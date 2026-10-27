import type { Prisma } from '@prisma/client';

type InventoryTransaction = Pick<Prisma.TransactionClient, 'product'>;
type OrderInventoryItem = { productId: string; quantity: number };

export const reserveOrderInventory = async (
  transaction: InventoryTransaction,
  items: OrderInventoryItem[],
): Promise<void> => {
  for (const item of items) {
    const updated = await transaction.product.updateMany({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
    if (updated.count !== 1) {
      throw Object.assign(new Error('Not enough stock to place this order.'), { status: 409 });
    }
  }
};

export const releaseOrderInventory = async (
  transaction: InventoryTransaction,
  items: OrderInventoryItem[],
): Promise<void> => {
  for (const item of items) {
    const updated = await transaction.product.updateMany({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
    if (updated.count !== 1) {
      throw Object.assign(new Error('Could not restore inventory for this order.'), { status: 409 });
    }
  }
};
