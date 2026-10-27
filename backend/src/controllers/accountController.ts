import { Request, Response, NextFunction } from 'express';
import type { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { updateCartSchema, updateWishlistSchema } from '../utils/accountValidation';

type AuthenticatedRequest = Request & { user?: { id: string } };

const productWithCollection = {
  product: { include: { collection: true } },
} satisfies Prisma.CartItemInclude;

export const getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: productWithCollection,
      orderBy: { updatedAt: 'asc' },
    });
    res.json(items.map(({ product, quantity }) => ({ ...product, quantity })));
  } catch (error) {
    next(error);
  }
};

export const replaceCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const parsed = updateCartSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Provide unique products and valid cart quantities.' });
    return;
  }

  try {
    const cart = await prisma.$transaction(async (transaction) => {
      const productIds = parsed.data.items.map((item) => item.productId);
      const products = productIds.length
        ? await transaction.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, stock: true },
          })
        : [];
      if (products.length !== productIds.length) {
        throw Object.assign(new Error('One or more cart products are no longer available.'), { status: 409 });
      }

      const stockByProductId = new Map(products.map((product) => [product.id, product.stock]));
      if (parsed.data.items.some((item) => item.quantity > (stockByProductId.get(item.productId) ?? 0))) {
        throw Object.assign(new Error('One or more cart quantities exceed current stock.'), { status: 409 });
      }

      await transaction.cartItem.deleteMany({ where: { userId: req.user!.id } });
      if (parsed.data.items.length) {
        await transaction.cartItem.createMany({
          data: parsed.data.items.map((item) => ({ ...item, userId: req.user!.id })),
        });
      }
      return transaction.cartItem.findMany({
        where: { userId: req.user!.id },
        include: productWithCollection,
        orderBy: { updatedAt: 'asc' },
      });
    });
    res.json(cart.map(({ product, quantity }) => ({ ...product, quantity })));
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: { include: { collection: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json(items.map(({ product }) => product));
  } catch (error) {
    next(error);
  }
};

export const replaceWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const parsed = updateWishlistSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Provide a list of unique, valid wishlist products.' });
    return;
  }

  try {
    const wishlist = await prisma.$transaction(async (transaction) => {
      const productIds = parsed.data.items.map((item) => item.productId);
      if (productIds.length) {
        const productCount = await transaction.product.count({ where: { id: { in: productIds } } });
        if (productCount !== productIds.length) {
          throw Object.assign(new Error('One or more wishlist products are no longer available.'), { status: 409 });
        }
      }

      await transaction.wishlistItem.deleteMany({ where: { userId: req.user!.id } });
      if (productIds.length) {
        await transaction.wishlistItem.createMany({
          data: productIds.map((productId) => ({ userId: req.user!.id, productId })),
        });
      }
      return transaction.wishlistItem.findMany({
        where: { userId: req.user!.id },
        include: { product: { include: { collection: true } } },
        orderBy: { createdAt: 'asc' },
      });
    });
    res.json(wishlist.map(({ product }) => product));
  } catch (error) {
    next(error);
  }
};
