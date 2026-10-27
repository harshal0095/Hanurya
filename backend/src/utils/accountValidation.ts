import { z } from 'zod';

const uniqueProductItems = <T extends { productId: string }>(items: T[], context: z.RefinementCtx) => {
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
};

export const updateCartSchema = z.object({
  items: z.array(z.object({
    productId: z.uuid(),
    quantity: z.number().int().min(1).max(99),
  })).max(30).superRefine(uniqueProductItems),
});

export const updateWishlistSchema = z.object({
  items: z.array(z.object({
    productId: z.uuid(),
  })).max(100).superRefine(uniqueProductItems),
});
