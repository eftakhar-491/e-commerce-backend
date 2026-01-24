/*
  Warnings:

  - You are about to drop the column `image` on the `Category` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
