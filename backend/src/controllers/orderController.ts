import { Request, Response, NextFunction } from 'express';
import type { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { createOrderSchema, orderQuoteSchema, updateOrderStatusSchema } from '../utils/orderValidation';
import { releaseOrderInventory, reserveOrderInventory } from '../utils/orderInventory';

type AuthenticatedRequest = Request & { user?: { id: string } };

const orderItems = {
  orderItems: {
    select: {
      id: true,
      productId: true,
      name: true,
      imageUrl: true,
      quantity: true,
      price: true,
    },
  },
} satisfies Prisma.OrderInclude;

const getCatalogItems = async (items: Array<{ productId: string; quantity: number }>) => {
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
    select: { id: true, name: true, price: true, imageUrl: true, stock: true },
  });

  if (products.length !== items.length) {
    return { error: 'One or more products are no longer available.' } as const;
  }

  const productById = new Map(products.map((product) => [product.id, product]));
  const lines = items.map((item) => {
    const product = productById.get(item.productId)!;
    return {
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      quantity: item.quantity,
      price: product.price,
      subtotal: Math.round(product.price * item.quantity * 100) / 100,
      stock: product.stock,
    };
  });

  if (lines.some((line) => !Number.isFinite(line.price) || line.price <= 0 || line.price > 10_000_000)) {
    return { error: 'One or more products have an invalid price.' } as const;
  }
  if (lines.some((line) => line.stock < line.quantity)) {
    return { error: 'One or more products do not have enough stock.' } as const;
  }

  const total = Math.round(lines.reduce((sum, line) => sum + line.subtotal, 0) * 100) / 100;
  if (!Number.isFinite(total)) {
    return { error: 'The order total is invalid.' } as const;
  }

  return {
    lines,
    total,
  } as const;
};

export const quoteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = orderQuoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Provide valid products and quantities.' });
    return;
  }

  try {
    const quote = await getCatalogItems(parsed.data.items);
    if ('error' in quote) {
      res.status(409).json({ message: quote.error });
      return;
    }

    res.json({
      items: quote.lines.map(({ productId, name, imageUrl, quantity, price, subtotal }) => ({
        productId,
        name,
        imageUrl,
        quantity,
        price,
        subtotal,
      })),
      total: quote.total,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Enter valid delivery details and products.' });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'Sign in before placing an order.' });
    return;
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const products = await transaction.product.findMany({
        where: { id: { in: parsed.data.items.map((item) => item.productId) } },
        select: { id: true, name: true, price: true, imageUrl: true, stock: true },
      });

      if (products.length !== parsed.data.items.length) {
        throw Object.assign(new Error('One or more products are no longer available.'), { status: 409 });
      }

      const productById = new Map(products.map((product) => [product.id, product]));
      const lines = parsed.data.items.map((item) => {
        const product = productById.get(item.productId)!;
        return { ...item, name: product.name, imageUrl: product.imageUrl, price: product.price, stock: product.stock };
      });

      if (lines.some((line) => !Number.isFinite(line.price) || line.price <= 0 || line.price > 10_000_000)) {
        throw Object.assign(new Error('One or more products have an invalid price.'), { status: 409 });
      }
      if (lines.some((line) => line.stock < line.quantity)) {
        throw Object.assign(new Error('One or more products do not have enough stock.'), { status: 409 });
      }

      const totalAmount = Math.round(lines.reduce(
        (total, line) => total + Math.round(line.price * line.quantity * 100) / 100,
        0,
      ) * 100) / 100;
      if (!Number.isFinite(totalAmount)) {
        throw Object.assign(new Error('The order total is invalid.'), { status: 409 });
      }
      if (Math.abs(totalAmount - parsed.data.expectedTotal) > 0.009) {
        throw Object.assign(new Error('Product prices changed. Refresh the checkout and verify the payment amount.'), { status: 409 });
      }

      await reserveOrderInventory(transaction, lines);

      return transaction.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PAYMENT_REVIEW',
          inventoryReserved: true,
          customerName: parsed.data.customerName,
          phone: parsed.data.phone,
          shippingAddress: parsed.data.shippingAddress,
          city: parsed.data.city,
          state: parsed.data.state,
          postalCode: parsed.data.postalCode,
          paymentSubmittedAt: new Date(),
          orderItems: {
            create: lines.map(({ productId, name, imageUrl, quantity, price }) => ({
              productId,
              name,
              imageUrl,
              quantity,
              price,
            })),
          },
        },
        include: { ...orderItems, user: { select: { id: true, name: true, email: true } } },
      });
    });

    res.status(201).json(result);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(409).json({ message: 'This order could not be submitted because it conflicts with existing order data.' });
      return;
    }
    next(error);
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: orderItems,
      take: 100,
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getMyOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user!.id },
      include: orderItems,
    });
    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
      return;
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        ...orderItems,
        user: { select: { id: true, name: true, email: true } },
      },
      take: 200,
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateAdminOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Provide a valid order action and rejection reason when applicable.' });
    return;
  }

  const { action, rejectionReason } = parsed.data;
  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const statusByAction = {
    confirm: { from: 'PAYMENT_REVIEW', to: 'CONFIRMED' },
    reject: { from: 'PAYMENT_REVIEW', to: 'REJECTED' },
    processing: { from: 'CONFIRMED', to: 'PROCESSING' },
    shipped: { from: 'PROCESSING', to: 'SHIPPED' },
    delivered: { from: 'SHIPPED', to: 'DELIVERED' },
  } as const;
  const transition = statusByAction[action];

  try {
    const order = await prisma.$transaction(async (transaction) => {
      const existing: Prisma.OrderGetPayload<{
        include: { orderItems: { select: { productId: true; quantity: true } } };
      }> | null = await transaction.order.findUnique({
        where: { id: orderId },
        include: { orderItems: { select: { productId: true, quantity: true } } },
      });

      if (!existing || existing.status !== transition.from) {
        throw Object.assign(new Error('Order not found or its status has changed. Refresh the order list.'), { status: 409 });
      }

      if (action === 'confirm' && !existing.inventoryReserved) {
        await reserveOrderInventory(transaction, existing.orderItems);
      }
      if (action === 'reject' && existing.inventoryReserved) {
        await releaseOrderInventory(transaction, existing.orderItems);
      }

      const updated = await transaction.order.updateMany({
        where: { id: existing.id, status: transition.from },
        data: {
          status: transition.to,
          ...(action === 'confirm' ? { inventoryReserved: true } : {}),
          ...(action === 'reject' ? { inventoryReserved: false } : {}),
          ...(action === 'confirm'
            ? { paymentReviewedAt: new Date(), estimatedDeliveryAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
            : {}),
          ...(action === 'reject' ? { paymentReviewedAt: new Date(), rejectionReason } : {}),
        },
      });
      if (updated.count !== 1) {
        throw Object.assign(new Error('Order status changed. Refresh the order list.'), { status: 409 });
      }
      return transaction.order.findUniqueOrThrow({
        where: { id: existing.id },
        include: {
          ...orderItems,
          user: { select: { id: true, name: true, email: true } },
        },
      });
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};
