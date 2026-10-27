/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const test = require('node:test');
const { loginSchema, registerSchema } = require('../src/utils/authValidation');
const { getJwtSecret } = require('../src/utils/jwtSecret');
const { createOrderSchema, orderQuoteSchema, updateOrderStatusSchema } = require('../src/utils/orderValidation');

test('registration trims names and normalizes email addresses', () => {
  const result = registerSchema.safeParse({
    name: '  Store Customer  ',
    email: ' CUSTOMER@EXAMPLE.COM ',
    password: 'long-enough-password',
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    name: 'Store Customer',
    email: 'customer@example.com',
    password: 'long-enough-password',
  });
});

test('registration rejects weak, malformed, or bcrypt-truncated passwords', () => {
  assert.equal(registerSchema.safeParse({
    name: 'Customer',
    email: 'customer@example.com',
    password: 'short',
  }).success, false);

  assert.equal(registerSchema.safeParse({
    name: 'Customer',
    email: 'not-an-email',
    password: 'long-enough-password',
  }).success, false);

  assert.equal(registerSchema.safeParse({
    name: 'Customer',
    email: 'customer@example.com',
    password: 'é'.repeat(37),
  }).success, false);
});

test('login keeps existing short passwords compatible but rejects malformed credentials', () => {
  const result = loginSchema.safeParse({
    email: ' CUSTOMER@EXAMPLE.COM ',
    password: 'legacy',
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, 'customer@example.com');
  assert.equal(loginSchema.safeParse({ email: 'invalid', password: 'pass' }).success, false);
});

test('production JWT configuration rejects missing, placeholder, and short secrets', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalJwtSecret = process.env.JWT_SECRET;

  process.env.NODE_ENV = 'production';
  for (const secret of [undefined, 'your_unique_random_secret_of_at_least_32_bytes', 'short']) {
    if (secret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = secret;
    assert.throws(() => getJwtSecret(), /JWT_SECRET/);
  }

  process.env.JWT_SECRET = 's'.repeat(32);
  assert.equal(getJwtSecret(), 's'.repeat(32));

  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
});

test('order quotes require unique product IDs and quantities within stock limits', () => {
  const productId = '92f711f1-08d4-4db0-b435-96b4d36c2a88';
  assert.equal(orderQuoteSchema.safeParse({ items: [{ productId, quantity: 2 }] }).success, true);
  assert.equal(orderQuoteSchema.safeParse({ items: [{ productId, quantity: 0 }] }).success, false);
  assert.equal(orderQuoteSchema.safeParse({
    items: [{ productId, quantity: 1 }, { productId, quantity: 1 }],
  }).success, false);
});

test('order submission requires delivery details and accepts QR payments without a transaction reference', () => {
  const details = {
    customerName: 'Store Customer',
    phone: '+91 98765 43210',
    shippingAddress: '10 Main Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    items: [{ productId: '92f711f1-08d4-4db0-b435-96b4d36c2a88', quantity: 1 }],
    expectedTotal: 399,
  };

  assert.equal(createOrderSchema.safeParse(details).success, true);
  assert.equal('paymentReference' in createOrderSchema.parse({ ...details, paymentReference: 'legacy123' }), false);
  assert.equal(createOrderSchema.safeParse({ ...details, expectedTotal: -1 }).success, false);
});

test('order transitions require valid review decisions and a rejection reason', () => {
  assert.equal(updateOrderStatusSchema.safeParse({ action: 'confirm' }).success, true);
  assert.equal(updateOrderStatusSchema.safeParse({ action: 'reject' }).success, false);
  assert.equal(updateOrderStatusSchema.safeParse({
    action: 'reject',
    rejectionReason: 'Payment reference not found',
  }).success, true);
  assert.equal(updateOrderStatusSchema.safeParse({ action: 'paid' }).success, false);
});
