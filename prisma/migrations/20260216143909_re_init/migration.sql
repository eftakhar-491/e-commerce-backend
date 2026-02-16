/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_customerId_fkey";

-- DropForeignKey
ALTER TABLE "conversion_events" DROP CONSTRAINT "conversion_events_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "product_views" DROP CONSTRAINT "product_views_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_adminRepliedBy_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "search_queries" DROP CONSTRAINT "search_queries_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_userId_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_userId_fkey";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "lastIp" TEXT,
    "userAgent" TEXT,
    "referralSource" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_adminRepliedBy_fkey" FOREIGN KEY ("adminRepliedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_queries" ADD CONSTRAINT "search_queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_events" ADD CONSTRAINT "conversion_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
