-- AlterTable
ALTER TABLE "carts"
ADD COLUMN "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "cart_items"
ADD COLUMN "productId" TEXT;

-- Backfill productId from variant option -> variant -> product relation
UPDATE "cart_items" AS ci
SET "productId" = pv."productId"
FROM "variant_options" AS vo
JOIN "product_variants" AS pv
  ON pv."id" = vo."productVariantId"
WHERE ci."variantOptionId" = vo."id";

-- Make productId required after backfill
ALTER TABLE "cart_items"
ALTER COLUMN "productId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- AddForeignKey
ALTER TABLE "cart_items"
ADD CONSTRAINT "cart_items_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "products"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill cart total price from current items
UPDATE "carts" AS c
SET "totalPrice" = COALESCE(t."totalPrice", 0)
FROM (
  SELECT
    ci."cartId",
    SUM((COALESCE(p."price", 0) + vo."price") * ci."quantity") AS "totalPrice"
  FROM "cart_items" AS ci
  JOIN "variant_options" AS vo
    ON vo."id" = ci."variantOptionId"
  JOIN "product_variants" AS pv
    ON pv."id" = vo."productVariantId"
  JOIN "products" AS p
    ON p."id" = pv."productId"
  GROUP BY ci."cartId"
) AS t
WHERE c."id" = t."cartId";
