/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const { reserveOrderInventory, releaseOrderInventory } = require('../src/utils/orderInventory');

const createInventoryTransaction = (initialStock) => {
  const stock = new Map(Object.entries(initialStock));
  return {
    stock,
    product: {
      updateMany: async ({ where, data }) => {
        const currentStock = stock.get(where.id);
        if (currentStock === undefined || (where.stock?.gte !== undefined && currentStock < where.stock.gte)) {
          return { count: 0 };
        }
        const nextStock = data.stock.decrement !== undefined
          ? currentStock - data.stock.decrement
          : currentStock + data.stock.increment;
        stock.set(where.id, nextStock);
        return { count: 1 };
      },
    },
  };
};

test('reserves inventory when an order is submitted', async () => {
  const transaction = createInventoryTransaction({ candle: 5 });

  await reserveOrderInventory(transaction, [{ productId: 'candle', quantity: 3 }]);

  assert.equal(transaction.stock.get('candle'), 2);
});

test('rejects a reservation that would oversell stock', async () => {
  const transaction = createInventoryTransaction({ candle: 2 });

  await assert.rejects(
    reserveOrderInventory(transaction, [{ productId: 'candle', quantity: 3 }]),
    { status: 409 },
  );
  assert.equal(transaction.stock.get('candle'), 2);
});

test('restores reserved inventory when an order is rejected', async () => {
  const transaction = createInventoryTransaction({ candle: 2 });

  await releaseOrderInventory(transaction, [{ productId: 'candle', quantity: 3 }]);

  assert.equal(transaction.stock.get('candle'), 5);
});
