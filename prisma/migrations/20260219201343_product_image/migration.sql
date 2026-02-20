/*
  Warnings:

  - You are about to drop the column `lowStockThreshold` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `option1Name` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `option1Value` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `option2Name` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `option2Value` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `option3Name` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `option3Value` on the `variant_options` table. All the data in the column will be lost.
  - You are about to drop the column `reservedStock` on the `variant_options` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "variant_options" DROP COLUMN "lowStockThreshold",
DROP COLUMN "option1Name",
DROP COLUMN "option1Value",
DROP COLUMN "option2Name",
DROP COLUMN "option2Value",
DROP COLUMN "option3Name",
DROP COLUMN "option3Value",
DROP COLUMN "reservedStock";

-- CreateIndex
CREATE INDEX "product_images_variantId_idx" ON "product_images"("variantId");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
