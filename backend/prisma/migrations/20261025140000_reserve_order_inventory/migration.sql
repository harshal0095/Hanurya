ALTER TABLE "Order"
ADD COLUMN "inventoryReserved" BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM (
      SELECT product."id", product."stock", SUM(order_item."quantity") AS "reservedQuantity"
      FROM "Product" AS product
      JOIN "OrderItem" AS order_item ON order_item."productId" = product."id"
      JOIN "Order" AS customer_order ON customer_order."id" = order_item."orderId"
      WHERE customer_order."status" = 'PAYMENT_REVIEW'
      GROUP BY product."id", product."stock"
    ) AS pending_inventory
    WHERE pending_inventory."stock" < pending_inventory."reservedQuantity"
  ) THEN
    RAISE EXCEPTION 'Cannot reserve pending order inventory because one or more products have insufficient stock.';
  END IF;
END $$;

UPDATE "Product" AS product
SET "stock" = product."stock" - pending_inventory."reservedQuantity"
FROM (
  SELECT order_item."productId", SUM(order_item."quantity") AS "reservedQuantity"
  FROM "OrderItem" AS order_item
  JOIN "Order" AS customer_order ON customer_order."id" = order_item."orderId"
  WHERE customer_order."status" = 'PAYMENT_REVIEW'
  GROUP BY order_item."productId"
) AS pending_inventory
WHERE product."id" = pending_inventory."productId";

UPDATE "Order"
SET "inventoryReserved" = true
WHERE "status" = 'PAYMENT_REVIEW';
