/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const { updateCartSchema, updateWishlistSchema } = require('../src/utils/accountValidation');

const firstProductId = '93e3a8b6-79bb-4cf1-b123-202fdb05eb0e';
const secondProductId = '0263d4b8-fd9c-4308-830d-09b2d86767e2';

test('cart updates accept unique valid product quantities', () => {
  assert.equal(updateCartSchema.safeParse({
    items: [{ productId: firstProductId, quantity: 2 }],
  }).success, true);
});

test('cart updates reject duplicate products and invalid quantities', () => {
  assert.equal(updateCartSchema.safeParse({
    items: [
      { productId: firstProductId, quantity: 2 },
      { productId: firstProductId, quantity: 1 },
    ],
  }).success, false);
  assert.equal(updateCartSchema.safeParse({
    items: [{ productId: firstProductId, quantity: 100 }],
  }).success, false);
});

test('wishlist updates accept unique product IDs and reject duplicates', () => {
  assert.equal(updateWishlistSchema.safeParse({
    items: [{ productId: firstProductId }, { productId: secondProductId }],
  }).success, true);
  assert.equal(updateWishlistSchema.safeParse({
    items: [{ productId: firstProductId }, { productId: firstProductId }],
  }).success, false);
});
