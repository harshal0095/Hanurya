-- Create manual-payment verification and fulfillment fields on orders.
ALTER TABLE "Order"
  ALTER COLUMN "status" SET DEFAULT 'PAYMENT_REVIEW',
  ADD COLUMN "paymentReference" TEXT,
  ADD COLUMN "customerName" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "shippingAddress" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "postalCode" TEXT,
  ADD COLUMN "paymentSubmittedAt" TIMESTAMP(3),
  ADD COLUMN "paymentReviewedAt" TIMESTAMP(3),
  ADD COLUMN "estimatedDeliveryAt" TIMESTAMP(3),
  ADD COLUMN "rejectionReason" TEXT;

ALTER TABLE "OrderItem"
  ADD COLUMN "name" TEXT,
  ADD COLUMN "imageUrl" TEXT;

CREATE UNIQUE INDEX "Order_paymentReference_key" ON "Order"("paymentReference");
