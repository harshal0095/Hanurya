import { z } from 'zod';

const orderItemsSchema = z.array(z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
})).min(1).max(30).superRefine((items, context) => {
  const productIds = new Set<string>();
  items.forEach((item, index) => {
    if (productIds.has(item.productId)) {
      context.addIssue({
        code: 'custom',
        path: [index, 'productId'],
        message: 'Each product can only appear once.',
      });
    }
    productIds.add(item.productId);
  });
});

const shippingDetailsSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/),
  shippingAddress: z.string().trim().min(5).max(250),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{4,12}$/),
});

export const orderQuoteSchema = z.object({ items: orderItemsSchema });

export const createOrderSchema = shippingDetailsSchema.extend({
  items: orderItemsSchema,
  expectedTotal: z.number().positive().finite(),
});

export const updateOrderStatusSchema = z.object({
  action: z.enum(['confirm', 'reject', 'processing', 'shipped', 'delivered']),
  rejectionReason: z.string().trim().min(3).max(300).optional(),
}).refine(
  (value) => value.action !== 'reject' || Boolean(value.rejectionReason),
  { message: 'A reason is required when rejecting an order.', path: ['rejectionReason'] },
);
