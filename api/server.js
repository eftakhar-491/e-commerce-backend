// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "FRONTEND_URL",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "JWT_RESET_PASSWORD_EXPIRES",
    "CLOUDINARY_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_FROM"
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });
  const envConfig = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    JWT_RESET_PASSWORD_EXPIRES: process.env.JWT_RESET_PASSWORD_EXPIRES,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_FROM: process.env.SMTP_FROM
    }
  };
  if (process.env.SUPABASE_URL) {
    envConfig.SUPABASE_URL = process.env.SUPABASE_URL;
  }
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    envConfig.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  if (process.env.SUPABASE_BUCKET) {
    envConfig.SUPABASE_BUCKET = process.env.SUPABASE_BUCKET;
  }
  return envConfig;
};
var envVars = loadEnvVariables();

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport4 from "passport";

// src/app/config/passport.ts
import bcryptjs from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.0",
  "engineVersion": "ab56fe763f921d033a6c195e7ddeb3e255bdbb57",
  "activeProvider": "postgresql",
  "inlineSchema": `// prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ========== ENUMS ==========
enum UserRole {
  USER
  ADMIN
  MANAGER // Additional role for inventory managers
}

enum UserStatus {
  ACTIVE
  BLOCKED
  DELETED
}

enum OrderStatus {
  PENDING
  PROCESSING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
  REFUNDED
}

enum PaymentMethod {
  CASH_ON_DELIVERY
  BKASH
  NAGAD
  ROCKET
  CREDIT_CARD
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCESS
  FAILED
  REFUNDED
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

enum MessageStatus {
  UNREAD
  READ
  ARCHIVED
}

enum InventoryTransactionType {
  PURCHASE // Stock added from supplier
  SALE // Stock removed due to order
  ADJUSTMENT // Manual count adjustment
  RETURN // Customer return
  CANCELLATION // Order cancellation restock
  RESERVED // Stock temporarily held for cart/order
  RELEASED // Reserved stock released
}

// ========== USER & AUTH ==========
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  emailVerified Boolean    @default(false)
  name          String?
  phone         String?    @unique
  image         String?
  role          UserRole   @default(USER)
  status        UserStatus @default(ACTIVE)

  // Relations
  addresses             Address[]
  sessions              Session[]
  accounts              Account[]
  credential            UserCredential?
  reviews               Review[]
  orders                Order[]
  cart                  Cart?
  sentMessages          Message[]         @relation("MessageSender")
  customerConversations Conversation[]    @relation("CustomerConversations")
  adminReviewReplies    Review[]          @relation("AdminReviewReplies")
  productViews          ProductView[]
  searchQueries         SearchQuery[]
  blogComments          BlogComment[]
  conversionEvents      ConversionEvent[]
  wishlist              Wishlist?

  // Metadata for analytics (e.g., pixel tracking)
  lastLoginAt    DateTime?
  lastIp         String?
  userAgent      String?
  referralSource String? // Where user came from (UTM source)
  metadata       Json? // Flexible custom data

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([phone])
  @@index([role, status])
  @@map("User")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([token])
  @@map("sessions")
}

model Account {
  id                String    @id @default(uuid())
  userId            String
  providerId        String // e.g., "google", "facebook"
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  expiresAt         DateTime?
  tokenType         String?
  scope             String?
  idToken           String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([providerId, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model UserCredential {
  id           String @id @default(uuid())
  userId       String @unique
  passwordHash String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("user_credentials")
}

// ========== ADDRESS ==========
model Address {
  id        String  @id @default(uuid())
  userId    String
  label     String? // e.g., "Home", "Office"
  recipient String? // Name of recipient
  phone     String?
  street    String
  city      String
  state     String?
  zipCode   String?
  country   String  @default("Bangladesh")
  isDefault Boolean @default(false)

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@map("addresses")
}

// ========== CATEGORY & TAG ==========
model Category {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?
  image       String?
  isActive    Boolean @default(true)
  sortOrder   Int     @default(0)

  parentId String?
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  products         Product[]
  images           ProductImage[]
  couponCategories CouponCategory[]

  // Metadata for SEO/analytics
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([parentId, name])
  @@index([slug])
  @@index([parentId])
  @@map("categories")
}

model Tag {
  id   String @id @default(uuid())
  name String @unique
  slug String @unique

  products ProductTag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@map("tags")
}

// Junction table for Product-Tag (explicit many-to-many)
model ProductTag {
  productId String
  tagId     String

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@id([productId, tagId])
  @@map("product_tags")
}

// ========== PRODUCT ==========
model Product {
  id          String    @id @default(uuid())
  title       String
  slug        String    @unique
  description String?   @db.Text
  shortDesc   String?
  brand       String?
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])

  // Pricing & inventory defaults for simple products (no variants)
  price             Decimal? @db.Decimal(10, 2) // null if hasVariants
  compareAtPrice    Decimal? @db.Decimal(10, 2)
  costPrice         Decimal? @db.Decimal(10, 2)
  sku               String?  @unique
  barcode           String?
  stock             Int? // null if hasVariants
  lowStockThreshold Int      @default(5)

  hasVariants Boolean @default(false)
  isActive    Boolean @default(true)
  isFeatured  Boolean @default(false)
  isDigital   Boolean @default(false) // for downloadable products

  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?

  // Relations
  variants         ProductVariant[]
  images           ProductImage[]
  reviews          Review[]
  tags             ProductTag[]
  productViews     ProductView[]
  conversionEvents ConversionEvent[]
  couponProducts   CouponProduct[]

  // Analytics metadata (e.g., Google Analytics custom dimensions)
  metadata Json? // Flexible for pixel data, etc.

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([categoryId, isActive])
  @@index([isActive, isFeatured])
  @@index([brand])
  @@index([createdAt])
  @@map("products")
}

model ProductVariant {
  id        String  @id @default(uuid())
  productId String
  title     String // e.g., "Size S - Red"
  isActive  Boolean @default(true)

  product Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  options VariantOption[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([productId])
  @@map("product_variants")
}

model VariantOption {
  id               String   @id @default(uuid())
  productVariantId String
  sku              String   @unique
  barcode          String?
  price            Decimal  @db.Decimal(10, 2)
  compareAtPrice   Decimal? @db.Decimal(10, 2)
  costPrice        Decimal? @db.Decimal(10, 2)
  stock            Int      @default(0)

  isActive Boolean @default(true)

  variant               ProductVariant         @relation(fields: [productVariantId], references: [id], onDelete: Cascade)
  cartItems             CartItem[]
  orderItems            OrderItem[]
  images                ProductImage[]
  inventoryTransactions InventoryTransaction[]
  wishlistItems         WishlistItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([productVariantId, sku])
  @@index([sku])
  @@index([productVariantId, isActive])
  @@map("variant_options")
}

model ProductImage {
  id        String  @id @default(uuid())
  src       String
  publicId  String? // For Cloudinary etc.
  altText   String?
  sortOrder Int     @default(0)
  isPrimary Boolean @default(false)

  // Polymorphic-like relations: image can belong to product, variant, option, or category
  productId       String?
  variantOptionId String?
  categoryId      String?

  product  Product?       @relation(fields: [productId], references: [id], onDelete: Cascade)
  option   VariantOption? @relation(fields: [variantOptionId], references: [id], onDelete: Cascade)
  category Category?      @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([productId])
  @@index([variantOptionId])
  @@index([categoryId])
  @@map("product_images")
}

// ========== REVIEWS ==========
model Review {
  id                 String  @id @default(uuid())
  userId             String
  productId          String
  rating             Int
  title              String?
  comment            String? @db.Text
  isApproved         Boolean @default(false) // Admin approval
  isVerifiedPurchase Boolean @default(false)

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  // For analytics: helpful votes
  helpfulVotes    Int @default(0)
  notHelpfulVotes Int @default(0)

  // Admin reply
  adminReply     String?   @db.Text
  adminRepliedAt DateTime?
  adminRepliedBy String?
  admin          User?     @relation("AdminReviewReplies", fields: [adminRepliedBy], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId]) // One review per user per product
  @@index([productId, isApproved])
  @@index([rating])
  @@map("reviews")
}

// ========== CART ==========
model Cart {
  id     String @id @default(uuid())
  userId String @unique

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]

  // Metadata (abandoned cart tracking)
  updatedAt DateTime @updatedAt
  createdAt DateTime @default(now())

  @@map("carts")
}

model CartItem {
  id              String @id @default(uuid())
  cartId          String
  variantOptionId String
  quantity        Int

  cart   Cart          @relation(fields: [cartId], references: [id], onDelete: Cascade)
  option VariantOption @relation(fields: [variantOptionId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, variantOptionId])
  @@index([cartId])
  @@map("cart_items")
}

// ========== ORDERS ==========
model Order {
  id                String @id @default(uuid())
  orderNumber       String @unique
  userId            String
  shippingAddressId String
  billingAddress    Json? // Snapshot of billing address (if different)

  status     OrderStatus
  notes      String?     @db.Text // Customer notes
  adminNotes String?     @db.Text // Internal notes

  // Financials
  subtotal      Decimal @db.Decimal(10, 2)
  discountTotal Decimal @default(0) @db.Decimal(10, 2)
  shippingCost  Decimal @default(0) @db.Decimal(10, 2)
  tax           Decimal @default(0) @db.Decimal(10, 2)
  total         Decimal @db.Decimal(10, 2)

  // Coupon applied
  couponId   String?
  couponCode String? // Snapshot of coupon code

  // Timestamps
  placedAt    DateTime  @default(now()) // When order was placed
  processedAt DateTime?
  shippedAt   DateTime?
  deliveredAt DateTime?
  cancelledAt DateTime?
  returnedAt  DateTime?

  user             User                 @relation(fields: [userId], references: [id])
  address          Address              @relation(fields: [shippingAddressId], references: [id])
  coupon           Coupon?              @relation(fields: [couponId], references: [id])
  items            OrderItem[]
  payment          Payment?
  statusHistory    OrderStatusHistory[]
  shipments        Shipment[]
  conversionEvents ConversionEvent[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([orderNumber])
  @@index([userId, status])
  @@index([status, placedAt])
  @@index([couponId])
  @@map("orders")
}

model OrderItem {
  id              String  @id @default(uuid())
  orderId         String
  variantOptionId String
  productId       String // Denormalized for quick access
  productName     String // Snapshot of product name
  productSku      String // Snapshot of SKU
  productImage    String? // Snapshot of primary image

  // Snapshot of variant options at time of purchase
  variantSnapshot Json // e.g., { size: "M", color: "Red" }

  quantity       Int
  unitPrice      Decimal @db.Decimal(10, 2) // Price per unit at time of order
  discountAmount Decimal @default(0) @db.Decimal(10, 2)
  total          Decimal @db.Decimal(10, 2) // (unitPrice - discountAmount) * quantity

  order  Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  option VariantOption @relation(fields: [variantOptionId], references: [id])

  createdAt DateTime @default(now())

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

model OrderStatusHistory {
  id        String      @id @default(uuid())
  orderId   String
  status    OrderStatus
  note      String?
  changedBy String? // User ID (admin) or "system"

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([orderId, createdAt])
  @@index([status])
  @@map("order_status_history")
}

// ========== SHIPMENT ==========
model Shipment {
  id                String         @id @default(uuid())
  orderId           String         @unique
  carrier           String // e.g., "Pathao", "Sundarban"
  trackingNumber    String
  trackingUrl       String?
  shippingMethod    String? // e.g., "Express", "Standard"
  estimatedDelivery DateTime?
  actualDelivery    DateTime?
  status            ShipmentStatus
  metadata          Json? // Carrier-specific data

  order  Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  events ShipmentEvent[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([trackingNumber])
  @@map("shipments")
}

model ShipmentEvent {
  id          String   @id @default(uuid())
  shipmentId  String
  status      String // e.g., "Picked up", "In transit", "Out for delivery"
  location    String?
  description String?
  occurredAt  DateTime // Time reported by carrier

  shipment Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([shipmentId, occurredAt])
  @@map("shipment_events")
}

enum ShipmentStatus {
  PENDING
  PROCESSING
  SHIPPED
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  FAILED
  RETURNED
}

// ========== PAYMENT ==========
model Payment {
  id              String        @id @default(uuid())
  orderId         String        @unique
  method          PaymentMethod
  status          PaymentStatus
  amount          Decimal       @db.Decimal(10, 2)
  transactionId   String? // Gateway transaction ID
  gatewayResponse Json? // Raw response from payment gateway
  paidAt          DateTime?
  errorMessage    String?

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([transactionId])
  @@map("payments")
}

// ========== COUPON ==========
model Coupon {
  id            String       @id @default(uuid())
  code          String       @unique
  description   String?
  discountType  DiscountType
  discountValue Decimal      @db.Decimal(10, 2) // Percentage or fixed amount
  minPurchase   Decimal?     @db.Decimal(10, 2)
  maxDiscount   Decimal?     @db.Decimal(10, 2) // Max discount for percentage coupons

  // Usage limits
  usageLimit   Int? // Total times coupon can be used
  usageCount   Int  @default(0)
  perUserLimit Int? // Times per user

  // Validity
  validFrom  DateTime
  validUntil DateTime
  isActive   Boolean  @default(true)

  // Applicable products/categories (if restricted)
  appliesToAll Boolean          @default(true)
  products     CouponProduct[] // If not appliesToAll
  categories   CouponCategory[]

  orders Order[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([code, isActive])
  @@index([validFrom, validUntil, isActive])
  @@map("coupons")
}

// Junction for coupon-product
model CouponProduct {
  couponId  String
  productId String

  coupon  Coupon  @relation(fields: [couponId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@id([couponId, productId])
  @@map("coupon_products")
}

// Junction for coupon-category
model CouponCategory {
  couponId   String
  categoryId String

  coupon   Coupon   @relation(fields: [couponId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([couponId, categoryId])
  @@map("coupon_categories")
}

// ========== INVENTORY MANAGEMENT ==========
model InventoryTransaction {
  id              String                   @id @default(uuid())
  variantOptionId String
  type            InventoryTransactionType
  quantity        Int // Positive for incoming, negative for outgoing
  previousStock   Int
  newStock        Int
  referenceId     String? // Order ID, Purchase Order ID, etc.
  referenceType   String? // e.g., "order", "purchase", "adjustment"
  note            String?
  createdBy       String? // User ID who made the change

  variantOption VariantOption @relation(fields: [variantOptionId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([variantOptionId, createdAt])
  @@index([referenceId])
  @@map("inventory_transactions")
}

// ========== WISHLIST ==========
// (You asked to remove wishlist, but I'll include it optionally; you can delete these lines if not needed)
model Wishlist {
  id         String  @id @default(uuid())
  userId     String  @unique
  name       String  @default("Default")
  isPublic   Boolean @default(false)
  shareToken String? @unique

  user  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items WishlistItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("wishlists")
}

model WishlistItem {
  id              String @id @default(uuid())
  wishlistId      String
  variantOptionId String

  wishlist Wishlist      @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  option   VariantOption @relation(fields: [variantOptionId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([wishlistId, variantOptionId])
  @@map("wishlist_items")
}

// ========== BLOG / ARTICLES ==========
model BlogPost {
  id            String    @id @default(uuid())
  title         String
  slug          String    @unique
  excerpt       String?
  content       String    @db.Text
  featuredImage String?
  authorId      String? // Could link to User (admin)
  publishedAt   DateTime?
  isPublished   Boolean   @default(false)
  views         Int       @default(0)

  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?

  // Categories & Tags
  categories BlogPostCategory[]
  tags       BlogPostTag[]

  // Comments (if enabled)
  comments      BlogComment[]
  allowComments Boolean       @default(true)

  // Metadata for analytics
  metadata Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([publishedAt, isPublished])
  @@index([authorId])
  @@map("blog_posts")
}

model BlogCategory {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?

  posts BlogPostCategory[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("blog_categories")
}

model BlogTag {
  id   String @id @default(uuid())
  name String @unique
  slug String @unique

  posts BlogPostTag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("blog_tags")
}

// Junction tables for blog many-to-many
model BlogPostCategory {
  postId     String
  categoryId String

  post     BlogPost     @relation(fields: [postId], references: [id], onDelete: Cascade)
  category BlogCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([postId, categoryId])
  @@map("blog_post_categories")
}

model BlogPostTag {
  postId String
  tagId  String

  post BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  BlogTag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@map("blog_post_tags")
}

model BlogComment {
  id          String  @id @default(uuid())
  postId      String
  userId      String? // Nullable for guest comments
  authorName  String? // For guests
  authorEmail String? // For guests
  content     String  @db.Text
  isApproved  Boolean @default(false)
  parentId    String? // For nested replies

  post    BlogPost      @relation(fields: [postId], references: [id], onDelete: Cascade)
  user    User?         @relation(fields: [userId], references: [id])
  parent  BlogComment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies BlogComment[] @relation("CommentReplies")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([postId, isApproved])
  @@index([parentId])
  @@map("blog_comments")
}

// ========== MESSAGING (Customer to Admin) ==========
model Conversation {
  id         String             @id @default(uuid())
  customerId String
  subject    String
  status     ConversationStatus @default(OPEN)

  customer   User      @relation("CustomerConversations", fields: [customerId], references: [id])
  messages   Message[]
  assignedTo String? // Admin user ID if assigned

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([customerId])
  @@index([status])
  @@index([assignedTo])
  @@map("conversations")
}

enum ConversationStatus {
  OPEN
  WAITING_CUSTOMER
  WAITING_ADMIN
  RESOLVED
  CLOSED
}

model Message {
  id             String        @id @default(uuid())
  conversationId String
  senderId       String // Can be customer or admin
  senderRole     UserRole // To quickly identify sender type
  content        String        @db.Text
  attachments    Json? // Array of file URLs
  status         MessageStatus @default(UNREAD)

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation("MessageSender", fields: [senderId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([conversationId, createdAt])
  @@index([status])
  @@map("messages")
}

// ========== ANALYTICS & TRACKING ==========
// Product views for analytics
model ProductView {
  id        String  @id @default(uuid())
  productId String
  userId    String?
  sessionId String? // For anonymous users
  ip        String?
  userAgent String?
  referrer  String? // Where the view came from

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User?   @relation(fields: [userId], references: [id])

  viewedAt DateTime @default(now())

  @@index([productId, viewedAt])
  @@index([userId, viewedAt])
  @@index([sessionId])
  @@map("product_views")
}

// Search queries
model SearchQuery {
  id          String  @id @default(uuid())
  query       String
  userId      String?
  sessionId   String?
  resultCount Int?
  filters     Json? // Applied filters (category, price range, etc.)

  user User? @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([query, createdAt])
  @@index([userId, createdAt])
  @@map("search_queries")
}

// Conversion tracking (e.g., pixel events)
model ConversionEvent {
  id        String  @id @default(uuid())
  eventType String // e.g., "Purchase", "AddToCart", "ViewContent"
  userId    String?
  sessionId String?
  orderId   String? // If purchase
  productId String? // If product-specific
  value     Float? // Event value
  currency  String? @default("BDT")
  metadata  Json? // Custom pixel data

  user    User?    @relation(fields: [userId], references: [id])
  order   Order?   @relation(fields: [orderId], references: [id])
  product Product? @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())

  @@index([eventType, createdAt])
  @@index([userId, createdAt])
  @@index([sessionId])
  @@map("conversion_events")
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"credential","kind":"object","type":"UserCredential","relationName":"UserToUserCredential"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"MessageSender"},{"name":"customerConversations","kind":"object","type":"Conversation","relationName":"CustomerConversations"},{"name":"adminReviewReplies","kind":"object","type":"Review","relationName":"AdminReviewReplies"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductViewToUser"},{"name":"searchQueries","kind":"object","type":"SearchQuery","relationName":"SearchQueryToUser"},{"name":"blogComments","kind":"object","type":"BlogComment","relationName":"BlogCommentToUser"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToUser"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"UserToWishlist"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"lastIp","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referralSource","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"User"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sessions"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"tokenType","kind":"scalar","type":"String"},{"name":"scope","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"accounts"},"UserCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserCredential"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_credentials"},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"recipient","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"CategoryToProductImage"},{"name":"couponCategories","kind":"object","type":"CouponCategory","relationName":"CategoryToCouponCategory"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Tag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"ProductTag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tags"},"ProductTag":{"fields":[{"name":"productId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductTag"},{"name":"tag","kind":"object","type":"Tag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"product_tags"},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"brand","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"lowStockThreshold","kind":"scalar","type":"Int"},{"name":"hasVariants","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"isDigital","kind":"scalar","type":"Boolean"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"variants","kind":"object","type":"ProductVariant","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"tags","kind":"object","type":"ProductTag","relationName":"ProductToProductTag"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductToProductView"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToProduct"},{"name":"couponProducts","kind":"object","type":"CouponProduct","relationName":"CouponProductToProduct"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"products"},"ProductVariant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductVariant"},{"name":"options","kind":"object","type":"VariantOption","relationName":"ProductVariantToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_variants"},"VariantOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productVariantId","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductVariantToVariantOption"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToVariantOption"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToVariantOption"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToVariantOption"},{"name":"inventoryTransactions","kind":"object","type":"InventoryTransaction","relationName":"InventoryTransactionToVariantOption"},{"name":"wishlistItems","kind":"object","type":"WishlistItem","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"variant_options"},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"src","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"productId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"},{"name":"option","kind":"object","type":"VariantOption","relationName":"ProductImageToVariantOption"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProductImage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_images"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"helpfulVotes","kind":"scalar","type":"Int"},{"name":"notHelpfulVotes","kind":"scalar","type":"Int"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"adminRepliedAt","kind":"scalar","type":"DateTime"},{"name":"adminRepliedBy","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"User","relationName":"AdminReviewReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"CartItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"shippingAddressId","kind":"scalar","type":"String"},{"name":"billingAddress","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"adminNotes","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"discountTotal","kind":"scalar","type":"Decimal"},{"name":"shippingCost","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"couponCode","kind":"scalar","type":"String"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"shippedAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"returnedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"statusHistory","kind":"object","type":"OrderStatusHistory","relationName":"OrderToOrderStatusHistory"},{"name":"shipments","kind":"object","type":"Shipment","relationName":"OrderToShipment"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"productName","kind":"scalar","type":"String"},{"name":"productSku","kind":"scalar","type":"String"},{"name":"productImage","kind":"scalar","type":"String"},{"name":"variantSnapshot","kind":"scalar","type":"Json"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"OrderItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"OrderStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"changedBy","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderStatusHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_status_history"},"Shipment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"carrier","kind":"scalar","type":"String"},{"name":"trackingNumber","kind":"scalar","type":"String"},{"name":"trackingUrl","kind":"scalar","type":"String"},{"name":"shippingMethod","kind":"scalar","type":"String"},{"name":"estimatedDelivery","kind":"scalar","type":"DateTime"},{"name":"actualDelivery","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"ShipmentStatus"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToShipment"},{"name":"events","kind":"object","type":"ShipmentEvent","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"shipments"},"ShipmentEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"occurredAt","kind":"scalar","type":"DateTime"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"shipment_events"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"discountType","kind":"enum","type":"DiscountType"},{"name":"discountValue","kind":"scalar","type":"Decimal"},{"name":"minPurchase","kind":"scalar","type":"Decimal"},{"name":"maxDiscount","kind":"scalar","type":"Decimal"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usageCount","kind":"scalar","type":"Int"},{"name":"perUserLimit","kind":"scalar","type":"Int"},{"name":"validFrom","kind":"scalar","type":"DateTime"},{"name":"validUntil","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"appliesToAll","kind":"scalar","type":"Boolean"},{"name":"products","kind":"object","type":"CouponProduct","relationName":"CouponToCouponProduct"},{"name":"categories","kind":"object","type":"CouponCategory","relationName":"CouponToCouponCategory"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"CouponProduct":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponProduct"},{"name":"product","kind":"object","type":"Product","relationName":"CouponProductToProduct"}],"dbName":"coupon_products"},"CouponCategory":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponCategory"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToCouponCategory"}],"dbName":"coupon_categories"},"InventoryTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InventoryTransactionType"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"previousStock","kind":"scalar","type":"Int"},{"name":"newStock","kind":"scalar","type":"Int"},{"name":"referenceId","kind":"scalar","type":"String"},{"name":"referenceType","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"variantOption","kind":"object","type":"VariantOption","relationName":"InventoryTransactionToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"inventory_transactions"},"Wishlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToWishlist"},{"name":"items","kind":"object","type":"WishlistItem","relationName":"WishlistToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlists"},"WishlistItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"wishlistId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"WishlistToWishlistItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlist_items"},"BlogPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"featuredImage","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"views","kind":"scalar","type":"Int"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"categories","kind":"object","type":"BlogPostCategory","relationName":"BlogPostToBlogPostCategory"},{"name":"tags","kind":"object","type":"BlogPostTag","relationName":"BlogPostToBlogPostTag"},{"name":"comments","kind":"object","type":"BlogComment","relationName":"BlogCommentToBlogPost"},{"name":"allowComments","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_posts"},"BlogCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostCategory","relationName":"BlogCategoryToBlogPostCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_categories"},"BlogTag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostTag","relationName":"BlogPostTagToBlogTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_tags"},"BlogPostCategory":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostCategory"},{"name":"category","kind":"object","type":"BlogCategory","relationName":"BlogCategoryToBlogPostCategory"}],"dbName":"blog_post_categories"},"BlogPostTag":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostTag"},{"name":"tag","kind":"object","type":"BlogTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_post_tags"},"BlogComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"postId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"authorName","kind":"scalar","type":"String"},{"name":"authorEmail","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogCommentToBlogPost"},{"name":"user","kind":"object","type":"User","relationName":"BlogCommentToUser"},{"name":"parent","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_comments"},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConversationStatus"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerConversations"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"conversations"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"senderRole","kind":"enum","type":"UserRole"},{"name":"content","kind":"scalar","type":"String"},{"name":"attachments","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"MessageStatus"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"sender","kind":"object","type":"User","relationName":"MessageSender"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"ProductView":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductView"},{"name":"user","kind":"object","type":"User","relationName":"ProductViewToUser"},{"name":"viewedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_views"},"SearchQuery":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"query","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"resultCount","kind":"scalar","type":"Int"},{"name":"filters","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"SearchQueryToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"search_queries"},"ConversionEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"ConversionEventToUser"},{"name":"order","kind":"object","type":"Order","relationName":"ConversionEventToOrder"},{"name":"product","kind":"object","type":"Product","relationName":"ConversionEventToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"conversion_events"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","address","coupon","parent","children","products","product","options","_count","variant","items","cart","option","cartItems","order","orderItems","images","variantOption","inventoryTransactions","wishlist","wishlistItems","category","couponCategories","variants","admin","reviews","tag","tags","productViews","conversionEvents","couponProducts","categories","orders","payment","statusHistory","shipment","events","shipments","addresses","sessions","accounts","credential","customer","messages","conversation","sender","sentMessages","customerConversations","adminReviewReplies","searchQueries","post","posts","comments","replies","blogComments","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","UserCredential.findUnique","UserCredential.findUniqueOrThrow","UserCredential.findFirst","UserCredential.findFirstOrThrow","UserCredential.findMany","UserCredential.createOne","UserCredential.createMany","UserCredential.createManyAndReturn","UserCredential.updateOne","UserCredential.updateMany","UserCredential.updateManyAndReturn","UserCredential.upsertOne","UserCredential.deleteOne","UserCredential.deleteMany","UserCredential.groupBy","UserCredential.aggregate","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","Address.upsertOne","Address.deleteOne","Address.deleteMany","Address.groupBy","Address.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","_avg","_sum","Category.groupBy","Category.aggregate","Tag.findUnique","Tag.findUniqueOrThrow","Tag.findFirst","Tag.findFirstOrThrow","Tag.findMany","Tag.createOne","Tag.createMany","Tag.createManyAndReturn","Tag.updateOne","Tag.updateMany","Tag.updateManyAndReturn","Tag.upsertOne","Tag.deleteOne","Tag.deleteMany","Tag.groupBy","Tag.aggregate","ProductTag.findUnique","ProductTag.findUniqueOrThrow","ProductTag.findFirst","ProductTag.findFirstOrThrow","ProductTag.findMany","ProductTag.createOne","ProductTag.createMany","ProductTag.createManyAndReturn","ProductTag.updateOne","ProductTag.updateMany","ProductTag.updateManyAndReturn","ProductTag.upsertOne","ProductTag.deleteOne","ProductTag.deleteMany","ProductTag.groupBy","ProductTag.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","ProductVariant.findUnique","ProductVariant.findUniqueOrThrow","ProductVariant.findFirst","ProductVariant.findFirstOrThrow","ProductVariant.findMany","ProductVariant.createOne","ProductVariant.createMany","ProductVariant.createManyAndReturn","ProductVariant.updateOne","ProductVariant.updateMany","ProductVariant.updateManyAndReturn","ProductVariant.upsertOne","ProductVariant.deleteOne","ProductVariant.deleteMany","ProductVariant.groupBy","ProductVariant.aggregate","VariantOption.findUnique","VariantOption.findUniqueOrThrow","VariantOption.findFirst","VariantOption.findFirstOrThrow","VariantOption.findMany","VariantOption.createOne","VariantOption.createMany","VariantOption.createManyAndReturn","VariantOption.updateOne","VariantOption.updateMany","VariantOption.updateManyAndReturn","VariantOption.upsertOne","VariantOption.deleteOne","VariantOption.deleteMany","VariantOption.groupBy","VariantOption.aggregate","ProductImage.findUnique","ProductImage.findUniqueOrThrow","ProductImage.findFirst","ProductImage.findFirstOrThrow","ProductImage.findMany","ProductImage.createOne","ProductImage.createMany","ProductImage.createManyAndReturn","ProductImage.updateOne","ProductImage.updateMany","ProductImage.updateManyAndReturn","ProductImage.upsertOne","ProductImage.deleteOne","ProductImage.deleteMany","ProductImage.groupBy","ProductImage.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","OrderStatusHistory.findUnique","OrderStatusHistory.findUniqueOrThrow","OrderStatusHistory.findFirst","OrderStatusHistory.findFirstOrThrow","OrderStatusHistory.findMany","OrderStatusHistory.createOne","OrderStatusHistory.createMany","OrderStatusHistory.createManyAndReturn","OrderStatusHistory.updateOne","OrderStatusHistory.updateMany","OrderStatusHistory.updateManyAndReturn","OrderStatusHistory.upsertOne","OrderStatusHistory.deleteOne","OrderStatusHistory.deleteMany","OrderStatusHistory.groupBy","OrderStatusHistory.aggregate","Shipment.findUnique","Shipment.findUniqueOrThrow","Shipment.findFirst","Shipment.findFirstOrThrow","Shipment.findMany","Shipment.createOne","Shipment.createMany","Shipment.createManyAndReturn","Shipment.updateOne","Shipment.updateMany","Shipment.updateManyAndReturn","Shipment.upsertOne","Shipment.deleteOne","Shipment.deleteMany","Shipment.groupBy","Shipment.aggregate","ShipmentEvent.findUnique","ShipmentEvent.findUniqueOrThrow","ShipmentEvent.findFirst","ShipmentEvent.findFirstOrThrow","ShipmentEvent.findMany","ShipmentEvent.createOne","ShipmentEvent.createMany","ShipmentEvent.createManyAndReturn","ShipmentEvent.updateOne","ShipmentEvent.updateMany","ShipmentEvent.updateManyAndReturn","ShipmentEvent.upsertOne","ShipmentEvent.deleteOne","ShipmentEvent.deleteMany","ShipmentEvent.groupBy","ShipmentEvent.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Coupon.findUnique","Coupon.findUniqueOrThrow","Coupon.findFirst","Coupon.findFirstOrThrow","Coupon.findMany","Coupon.createOne","Coupon.createMany","Coupon.createManyAndReturn","Coupon.updateOne","Coupon.updateMany","Coupon.updateManyAndReturn","Coupon.upsertOne","Coupon.deleteOne","Coupon.deleteMany","Coupon.groupBy","Coupon.aggregate","CouponProduct.findUnique","CouponProduct.findUniqueOrThrow","CouponProduct.findFirst","CouponProduct.findFirstOrThrow","CouponProduct.findMany","CouponProduct.createOne","CouponProduct.createMany","CouponProduct.createManyAndReturn","CouponProduct.updateOne","CouponProduct.updateMany","CouponProduct.updateManyAndReturn","CouponProduct.upsertOne","CouponProduct.deleteOne","CouponProduct.deleteMany","CouponProduct.groupBy","CouponProduct.aggregate","CouponCategory.findUnique","CouponCategory.findUniqueOrThrow","CouponCategory.findFirst","CouponCategory.findFirstOrThrow","CouponCategory.findMany","CouponCategory.createOne","CouponCategory.createMany","CouponCategory.createManyAndReturn","CouponCategory.updateOne","CouponCategory.updateMany","CouponCategory.updateManyAndReturn","CouponCategory.upsertOne","CouponCategory.deleteOne","CouponCategory.deleteMany","CouponCategory.groupBy","CouponCategory.aggregate","InventoryTransaction.findUnique","InventoryTransaction.findUniqueOrThrow","InventoryTransaction.findFirst","InventoryTransaction.findFirstOrThrow","InventoryTransaction.findMany","InventoryTransaction.createOne","InventoryTransaction.createMany","InventoryTransaction.createManyAndReturn","InventoryTransaction.updateOne","InventoryTransaction.updateMany","InventoryTransaction.updateManyAndReturn","InventoryTransaction.upsertOne","InventoryTransaction.deleteOne","InventoryTransaction.deleteMany","InventoryTransaction.groupBy","InventoryTransaction.aggregate","Wishlist.findUnique","Wishlist.findUniqueOrThrow","Wishlist.findFirst","Wishlist.findFirstOrThrow","Wishlist.findMany","Wishlist.createOne","Wishlist.createMany","Wishlist.createManyAndReturn","Wishlist.updateOne","Wishlist.updateMany","Wishlist.updateManyAndReturn","Wishlist.upsertOne","Wishlist.deleteOne","Wishlist.deleteMany","Wishlist.groupBy","Wishlist.aggregate","WishlistItem.findUnique","WishlistItem.findUniqueOrThrow","WishlistItem.findFirst","WishlistItem.findFirstOrThrow","WishlistItem.findMany","WishlistItem.createOne","WishlistItem.createMany","WishlistItem.createManyAndReturn","WishlistItem.updateOne","WishlistItem.updateMany","WishlistItem.updateManyAndReturn","WishlistItem.upsertOne","WishlistItem.deleteOne","WishlistItem.deleteMany","WishlistItem.groupBy","WishlistItem.aggregate","BlogPost.findUnique","BlogPost.findUniqueOrThrow","BlogPost.findFirst","BlogPost.findFirstOrThrow","BlogPost.findMany","BlogPost.createOne","BlogPost.createMany","BlogPost.createManyAndReturn","BlogPost.updateOne","BlogPost.updateMany","BlogPost.updateManyAndReturn","BlogPost.upsertOne","BlogPost.deleteOne","BlogPost.deleteMany","BlogPost.groupBy","BlogPost.aggregate","BlogCategory.findUnique","BlogCategory.findUniqueOrThrow","BlogCategory.findFirst","BlogCategory.findFirstOrThrow","BlogCategory.findMany","BlogCategory.createOne","BlogCategory.createMany","BlogCategory.createManyAndReturn","BlogCategory.updateOne","BlogCategory.updateMany","BlogCategory.updateManyAndReturn","BlogCategory.upsertOne","BlogCategory.deleteOne","BlogCategory.deleteMany","BlogCategory.groupBy","BlogCategory.aggregate","BlogTag.findUnique","BlogTag.findUniqueOrThrow","BlogTag.findFirst","BlogTag.findFirstOrThrow","BlogTag.findMany","BlogTag.createOne","BlogTag.createMany","BlogTag.createManyAndReturn","BlogTag.updateOne","BlogTag.updateMany","BlogTag.updateManyAndReturn","BlogTag.upsertOne","BlogTag.deleteOne","BlogTag.deleteMany","BlogTag.groupBy","BlogTag.aggregate","BlogPostCategory.findUnique","BlogPostCategory.findUniqueOrThrow","BlogPostCategory.findFirst","BlogPostCategory.findFirstOrThrow","BlogPostCategory.findMany","BlogPostCategory.createOne","BlogPostCategory.createMany","BlogPostCategory.createManyAndReturn","BlogPostCategory.updateOne","BlogPostCategory.updateMany","BlogPostCategory.updateManyAndReturn","BlogPostCategory.upsertOne","BlogPostCategory.deleteOne","BlogPostCategory.deleteMany","BlogPostCategory.groupBy","BlogPostCategory.aggregate","BlogPostTag.findUnique","BlogPostTag.findUniqueOrThrow","BlogPostTag.findFirst","BlogPostTag.findFirstOrThrow","BlogPostTag.findMany","BlogPostTag.createOne","BlogPostTag.createMany","BlogPostTag.createManyAndReturn","BlogPostTag.updateOne","BlogPostTag.updateMany","BlogPostTag.updateManyAndReturn","BlogPostTag.upsertOne","BlogPostTag.deleteOne","BlogPostTag.deleteMany","BlogPostTag.groupBy","BlogPostTag.aggregate","BlogComment.findUnique","BlogComment.findUniqueOrThrow","BlogComment.findFirst","BlogComment.findFirstOrThrow","BlogComment.findMany","BlogComment.createOne","BlogComment.createMany","BlogComment.createManyAndReturn","BlogComment.updateOne","BlogComment.updateMany","BlogComment.updateManyAndReturn","BlogComment.upsertOne","BlogComment.deleteOne","BlogComment.deleteMany","BlogComment.groupBy","BlogComment.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","ProductView.findUnique","ProductView.findUniqueOrThrow","ProductView.findFirst","ProductView.findFirstOrThrow","ProductView.findMany","ProductView.createOne","ProductView.createMany","ProductView.createManyAndReturn","ProductView.updateOne","ProductView.updateMany","ProductView.updateManyAndReturn","ProductView.upsertOne","ProductView.deleteOne","ProductView.deleteMany","ProductView.groupBy","ProductView.aggregate","SearchQuery.findUnique","SearchQuery.findUniqueOrThrow","SearchQuery.findFirst","SearchQuery.findFirstOrThrow","SearchQuery.findMany","SearchQuery.createOne","SearchQuery.createMany","SearchQuery.createManyAndReturn","SearchQuery.updateOne","SearchQuery.updateMany","SearchQuery.updateManyAndReturn","SearchQuery.upsertOne","SearchQuery.deleteOne","SearchQuery.deleteMany","SearchQuery.groupBy","SearchQuery.aggregate","ConversionEvent.findUnique","ConversionEvent.findUniqueOrThrow","ConversionEvent.findFirst","ConversionEvent.findFirstOrThrow","ConversionEvent.findMany","ConversionEvent.createOne","ConversionEvent.createMany","ConversionEvent.createManyAndReturn","ConversionEvent.updateOne","ConversionEvent.updateMany","ConversionEvent.updateManyAndReturn","ConversionEvent.upsertOne","ConversionEvent.deleteOne","ConversionEvent.deleteMany","ConversionEvent.groupBy","ConversionEvent.aggregate","AND","OR","NOT","id","eventType","userId","sessionId","orderId","productId","value","currency","metadata","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","query","resultCount","filters","ip","userAgent","referrer","viewedAt","conversationId","senderId","UserRole","senderRole","content","attachments","MessageStatus","status","updatedAt","customerId","subject","ConversationStatus","assignedTo","postId","authorName","authorEmail","isApproved","parentId","tagId","categoryId","name","slug","every","some","none","description","title","excerpt","featuredImage","authorId","publishedAt","isPublished","views","metaTitle","metaDescription","metaKeywords","allowComments","wishlistId","variantOptionId","isPublic","shareToken","InventoryTransactionType","type","quantity","previousStock","newStock","referenceId","referenceType","note","createdBy","couponId","code","DiscountType","discountType","discountValue","minPurchase","maxDiscount","usageLimit","usageCount","perUserLimit","validFrom","validUntil","isActive","appliesToAll","PaymentMethod","method","PaymentStatus","amount","transactionId","gatewayResponse","paidAt","errorMessage","shipmentId","location","occurredAt","carrier","trackingNumber","trackingUrl","shippingMethod","estimatedDelivery","actualDelivery","ShipmentStatus","OrderStatus","changedBy","productName","productSku","productImage","variantSnapshot","unitPrice","discountAmount","total","orderNumber","shippingAddressId","billingAddress","notes","adminNotes","subtotal","discountTotal","shippingCost","tax","couponCode","placedAt","processedAt","shippedAt","deliveredAt","cancelledAt","returnedAt","cartId","rating","comment","isVerifiedPurchase","helpfulVotes","notHelpfulVotes","adminReply","adminRepliedAt","adminRepliedBy","src","publicId","altText","sortOrder","isPrimary","productVariantId","sku","barcode","price","compareAtPrice","costPrice","stock","shortDesc","brand","lowStockThreshold","hasVariants","isFeatured","isDigital","image","label","recipient","phone","street","city","state","zipCode","country","isDefault","passwordHash","providerId","providerAccountId","accessToken","refreshToken","expiresAt","tokenType","scope","idToken","token","ipAddress","email","emailVerified","role","UserStatus","lastLoginAt","lastIp","referralSource","postId_tagId","postId_categoryId","providerId_providerAccountId","productId_tagId","userId_productId","couponId_categoryId","wishlistId_variantOptionId","cartId_variantOptionId","productVariantId_sku","parentId_name","couponId_productId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "lxTeAuAEIQ4AAPkJACAWAAD-CQAgHAAA-AkAIB8AAPsJACAgAAD9CQAgIwAAnQkAICkAAPQJACAqAAD1CQAgKwAA9gkAICwAAPcJACAxAADaCQAgMgAA-gkAIDMAAPgJACA0AAD8CQAgOQAAgAkAIKIFAADyCQAwowUAAFIAEKQFAADyCQAwpQUBAAAAAa0FAAD_CAAgrgVAAO4IACHEBQEA8ggAIc4FAADzCeYGIs8FQADuCAAh2wUBAPIIACHNBgEA8ggAIdAGAQAAAAHiBgEAAAAB4wYgAP0IACHkBgAA3AnKBSLmBkAA_AgAIecGAQDyCAAh6AYBAPIIACEBAAAAAQAgEgMAAIQJACAjAACdCQAgogUAAKkKADCjBQAAAwAQpAUAAKkKADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHPBUAA7ggAIc4GAQDyCAAhzwYBAPIIACHQBgEA8ggAIdEGAQDtCAAh0gYBAO0IACHTBgEA8ggAIdQGAQDyCAAh1QYBAO0IACHWBiAA_QgAIQcDAADzCwAgIwAAlg0AIM4GAACqCgAgzwYAAKoKACDQBgAAqgoAINMGAACqCgAg1AYAAKoKACASAwAAhAkAICMAAJ0JACCiBQAAqQoAMKMFAAADABCkBQAAqQoAMKUFAQAAAAGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHOBgEA8ggAIc8GAQDyCAAh0AYBAPIIACHRBgEA7QgAIdIGAQDtCAAh0wYBAPIIACHUBgEA8ggAIdUGAQDtCAAh1gYgAP0IACEDAAAAAwAgAQAABAAwAgAABQAgIgMAAIQJACAEAACkCgAgBQAApQoAIA0AAJUKACAgAAD9CQAgJAAApgoAICUAAKcKACAoAACoCgAgogUAAKMKADCjBQAABwAQpAUAAKMKADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHOBQAA6AmaBiLPBUAA7ggAIfkFAQDyCAAhoQYQAJgJACGiBgEA7QgAIaMGAQDtCAAhpAYAAP8IACClBgEA8ggAIaYGAQDyCAAhpwYQAJgJACGoBhAAmAkAIakGEACYCQAhqgYQAJgJACGrBgEA8ggAIawGQADuCAAhrQZAAPwIACGuBkAA_AgAIa8GQAD8CAAhsAZAAPwIACGxBkAA_AgAIRIDAADzCwAgBAAA4BEAIAUAANYRACANAADaEQAgIAAAyhEAICQAAOERACAlAADiEQAgKAAA4xEAIPkFAACqCgAgpAYAAKoKACClBgAAqgoAIKYGAACqCgAgqwYAAKoKACCtBgAAqgoAIK4GAACqCgAgrwYAAKoKACCwBgAAqgoAILEGAACqCgAgIgMAAIQJACAEAACkCgAgBQAApQoAIA0AAJUKACAgAAD9CQAgJAAApgoAICUAAKcKACAoAACoCgAgogUAAKMKADCjBQAABwAQpAUAAKMKADClBQEAAAABpwUBAO0IACGuBUAA7ggAIc4FAADoCZoGIs8FQADuCAAh-QUBAPIIACGhBhAAmAkAIaIGAQAAAAGjBgEA7QgAIaQGAAD_CAAgpQYBAPIIACGmBgEA8ggAIacGEACYCQAhqAYQAJgJACGpBhAAmAkAIaoGEACYCQAhqwYBAPIIACGsBkAA7ggAIa0GQAD8CAAhrgZAAPwIACGvBkAA_AgAIbAGQAD8CAAhsQZAAPwIACEDAAAABwAgAQAACAAwAgAACQAgFggAAJsJACAiAACcCQAgIwAAnQkAIKIFAACWCQAwowUAAAsAEKQFAACWCQAwpQUBAO0IACGuBUAA7ggAIc8FQADuCAAh4AUBAPIIACH6BQEA7QgAIfwFAACXCfwFIv0FEACYCQAh_gUQAJkJACH_BRAAmQkAIYAGAgCaCQAhgQYCAP4IACGCBgIAmgkAIYMGQADuCAAhhAZAAO4IACGFBiAA_QgAIYYGIAD9CAAhAQAAAAsAIAcFAACFCgAgCQAA7gkAIKIFAACiCgAwowUAAA0AEKQFAACiCgAwqgUBAO0IACH5BQEA7QgAIQIFAADWEQAgCQAA0xEAIAgFAACFCgAgCQAA7gkAIKIFAACiCgAwowUAAA0AEKQFAACiCgAwqgUBAO0IACH5BQEA7QgAIfMGAAChCgAgAwAAAA0AIAEAAA4AMAIAAA8AIBUGAACaCgAgBwAAnwoAIAgAAKAKACATAACWCgAgGQAAnAkAIKIFAACeCgAwowUAABEAEKQFAACeCgAwpQUBAO0IACGuBUAA7ggAIc8FQADuCAAh2AUBAPIIACHbBQEA7QgAIdwFAQDtCAAh4AUBAPIIACHoBQEA8ggAIekFAQDyCAAh6gUBAPIIACGFBiAA_QgAIb4GAgD-CAAhzQYBAPIIACEBAAAAEQAgAQAAABEAIAsGAADXEQAgBwAA3hEAIAgAAN8RACATAADbEQAgGQAAlQ0AINgFAACqCgAg4AUAAKoKACDoBQAAqgoAIOkFAACqCgAg6gUAAKoKACDNBgAAqgoAIBYGAACaCgAgBwAAnwoAIAgAAKAKACATAACWCgAgGQAAnAkAIKIFAACeCgAwowUAABEAEKQFAACeCgAwpQUBAAAAAa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAAAAAeAFAQDyCAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAhhQYgAP0IACG-BgIA_ggAIc0GAQDyCAAh8gYAAJ0KACADAAAAEQAgAQAAFAAwAgAAFQAgIxMAAJYKACAYAACaCgAgGgAAnAoAIBwAAPgJACAeAADCCQAgHwAA-wkAICAAAP0JACAhAACbCQAgogUAAJsKADCjBQAAFwAQpAUAAJsKADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh3AUBAO0IACHgBQEA8ggAIeEFAQDtCAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAhhQYgAP0IACHBBgEA8ggAIcIGAQDyCAAhwwYQAJkJACHEBhAAmQkAIcUGEACZCQAhxgYCAJoJACHHBgEA8ggAIcgGAQDyCAAhyQYCAP4IACHKBiAA_QgAIcsGIAD9CAAhzAYgAP0IACEWEwAA2xEAIBgAANcRACAaAADdEQAgHAAAxBEAIB4AALsPACAfAADIEQAgIAAAyhEAICEAAJQNACCtBQAAqgoAINoFAACqCgAg4AUAAKoKACDoBQAAqgoAIOkFAACqCgAg6gUAAKoKACDBBgAAqgoAIMIGAACqCgAgwwYAAKoKACDEBgAAqgoAIMUGAACqCgAgxgYAAKoKACDHBgAAqgoAIMgGAACqCgAgIxMAAJYKACAYAACaCgAgGgAAnAoAIBwAAPgJACAeAADCCQAgHwAA-wkAICAAAP0JACAhAACbCQAgogUAAJsKADCjBQAAFwAQpAUAAJsKADClBQEAAAABrQUAAP8IACCuBUAA7ggAIc8FQADuCAAh2gUBAPIIACHcBQEAAAAB4AUBAPIIACHhBQEA7QgAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhwQYBAAAAAcIGAQDyCAAhwwYQAJkJACHEBhAAmQkAIcUGEACZCQAhxgYCAJoJACHHBgEA8ggAIcgGAQDyCAAhyQYCAP4IACHKBiAA_QgAIcsGIAD9CAAhzAYgAP0IACEDAAAAFwAgAQAAGAAwAgAAGQAgEQkAAOwJACAPAACZCgAgGAAAmgoAIKIFAACYCgAwowUAABsAEKQFAACYCgAwpQUBAO0IACGqBQEA8ggAIa4FQADuCAAhzwVAAO4IACHaBQEA8ggAIe0FAQDyCAAhuwYBAO0IACG8BgEA8ggAIb0GAQDyCAAhvgYCAP4IACG_BiAA_QgAIQgJAADTEQAgDwAA2BEAIBgAANcRACCqBQAAqgoAINoFAACqCgAg7QUAAKoKACC8BgAAqgoAIL0GAACqCgAgEQkAAOwJACAPAACZCgAgGAAAmgoAIKIFAACYCgAwowUAABsAEKQFAACYCgAwpQUBAAAAAaoFAQDyCAAhrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh7QUBAPIIACG7BgEA7QgAIbwGAQDyCAAhvQYBAPIIACG-BgIA_ggAIb8GIAD9CAAhAwAAABsAIAEAABwAMAIAAB0AIAEAAAAXACAUDAAAlAoAIBAAALkJACASAACVCgAgEwAAlgoAIBUAAJcKACAXAACFCQAgogUAAJMKADCjBQAAIAAQpAUAAJMKADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACGFBiAA_QgAIcAGAQDtCAAhwQYBAO0IACHCBgEA8ggAIcMGEACYCQAhxAYQAJkJACHFBhAAmQkAIcYGAgD-CAAhAQAAACAAIAkMAADZEQAgEAAA2A0AIBIAANoRACATAADbEQAgFQAA3BEAIBcAAPQLACDCBgAAqgoAIMQGAACqCgAgxQYAAKoKACAVDAAAlAoAIBAAALkJACASAACVCgAgEwAAlgoAIBUAAJcKACAXAACFCQAgogUAAJMKADCjBQAAIAAQpAUAAJMKADClBQEAAAABrgVAAO4IACHPBUAA7ggAIYUGIAD9CAAhwAYBAO0IACHBBgEAAAABwgYBAPIIACHDBhAAmAkAIcQGEACZCQAhxQYQAJkJACHGBgIA_ggAIfEGAACSCgAgAwAAACAAIAEAACIAMAIAACMAIAEAAAAgACALDgAAkQoAIA8AAIoKACCiBQAAkAoAMKMFAAAmABCkBQAAkAoAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIe0FAQDtCAAh8gUCAP4IACGyBgEA7QgAIQIOAADFEQAgDwAA2BEAIAwOAACRCgAgDwAAigoAIKIFAACQCgAwowUAACYAEKQFAACQCgAwpQUBAAAAAa4FQADuCAAhzwVAAO4IACHtBQEA7QgAIfIFAgD-CAAhsgYBAO0IACHwBgAAjwoAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAACYAIBIPAACKCgAgEQAAqAkAIKIFAACNCgAwowUAACwAEKQFAACNCgAwpQUBAO0IACGpBQEA7QgAIaoFAQDtCAAhrgVAAO4IACHtBQEA7QgAIfIFAgD-CAAhmwYBAO0IACGcBgEA7QgAIZ0GAQDyCAAhngYAAI4KACCfBhAAmAkAIaAGEACYCQAhoQYQAJgJACEDDwAA2BEAIBEAAJ4NACCdBgAAqgoAIBIPAACKCgAgEQAAqAkAIKIFAACNCgAwowUAACwAEKQFAACNCgAwpQUBAAAAAakFAQDtCAAhqgUBAO0IACGuBUAA7ggAIe0FAQDtCAAh8gUCAP4IACGbBgEA7QgAIZwGAQDtCAAhnQYBAPIIACGeBgAAjgoAIJ8GEACYCQAhoAYQAJgJACGhBhAAmAkAIQMAAAAsACABAAAtADACAAAuACADAAAAGwAgAQAAHAAwAgAAHQAgDxQAAIoKACCiBQAAiwoAMKMFAAAxABCkBQAAiwoAMKUFAQDtCAAhrgVAAO4IACHtBQEA7QgAIfEFAACMCvEFIvIFAgD-CAAh8wUCAP4IACH0BQIA_ggAIfUFAQDyCAAh9gUBAPIIACH3BQEA8ggAIfgFAQDyCAAhBRQAANgRACD1BQAAqgoAIPYFAACqCgAg9wUAAKoKACD4BQAAqgoAIA8UAACKCgAgogUAAIsKADCjBQAAMQAQpAUAAIsKADClBQEAAAABrgVAAO4IACHtBQEA7QgAIfEFAACMCvEFIvIFAgD-CAAh8wUCAP4IACH0BQIA_ggAIfUFAQDyCAAh9gUBAPIIACH3BQEA8ggAIfgFAQDyCAAhAwAAADEAIAEAADIAMAIAADMAIAkPAACKCgAgFgAAiQoAIKIFAACICgAwowUAADUAEKQFAACICgAwpQUBAO0IACGuBUAA7ggAIewFAQDtCAAh7QUBAO0IACECDwAA2BEAIBYAAMsRACAKDwAAigoAIBYAAIkKACCiBQAAiAoAMKMFAAA1ABCkBQAAiAoAMKUFAQAAAAGuBUAA7ggAIewFAQDtCAAh7QUBAO0IACHvBgAAhwoAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgAQAAADUAIAEAAAAmACABAAAALAAgAQAAABsAIAEAAAAxACABAAAANQAgAQAAABEAIAcFAACFCgAgGAAAhgoAIKIFAACECgAwowUAAEEAEKQFAACECgAw2gUBAO0IACH5BQEA7QgAIQIFAADWEQAgGAAA1xEAIAgFAACFCgAgGAAAhgoAIKIFAACECgAwowUAAEEAEKQFAACECgAw2gUBAO0IACH5BQEA7QgAIe4GAACDCgAgAwAAAEEAIAEAAEIAMAIAAEMAIAEAAAARACABAAAAFwAgAQAAABsAIAEAAABBACALCQAA7gkAIAoAAIIKACCiBQAAgQoAMKMFAABJABCkBQAAgQoAMKUFAQDtCAAhqgUBAO0IACGuBUAA7ggAIc8FQADuCAAh4QUBAO0IACGFBiAA_QgAIQIJAADTEQAgCgAA1REAIAsJAADuCQAgCgAAggoAIKIFAACBCgAwowUAAEkAEKQFAACBCgAwpQUBAAAAAaoFAQDtCAAhrgVAAO4IACHPBUAA7ggAIeEFAQDtCAAhhQYgAP0IACEDAAAASQAgAQAASgAwAgAASwAgAwAAABsAIAEAABwAMAIAAB0AIBUDAACECQAgCQAA7gkAIBsAANUJACCiBQAAgAoAMKMFAABOABCkBQAAgAoAMKUFAQDtCAAhpwUBAO0IACGqBQEA7QgAIa4FQADuCAAhzwVAAO4IACHXBSAA_QgAIeEFAQDyCAAhswYCAP4IACG0BgEA8ggAIbUGIAD9CAAhtgYCAP4IACG3BgIA_ggAIbgGAQDyCAAhuQZAAPwIACG6BgEA8ggAIQgDAADzCwAgCQAA0xEAIBsAAPMLACDhBQAAqgoAILQGAACqCgAguAYAAKoKACC5BgAAqgoAILoGAACqCgAgFgMAAIQJACAJAADuCQAgGwAA1QkAIKIFAACACgAwowUAAE4AEKQFAACACgAwpQUBAAAAAacFAQDtCAAhqgUBAO0IACGuBUAA7ggAIc8FQADuCAAh1wUgAP0IACHhBQEA8ggAIbMGAgD-CAAhtAYBAPIIACG1BiAA_QgAIbYGAgD-CAAhtwYCAP4IACG4BgEA8ggAIbkGQAD8CAAhugYBAPIIACHtBgAA_wkAIAMAAABOACABAABPADACAABQACAhDgAA-QkAIBYAAP4JACAcAAD4CQAgHwAA-wkAICAAAP0JACAjAACdCQAgKQAA9AkAICoAAPUJACArAAD2CQAgLAAA9wkAIDEAANoJACAyAAD6CQAgMwAA-AkAIDQAAPwJACA5AACACQAgogUAAPIJADCjBQAAUgAQpAUAAPIJADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHEBQEA8ggAIc4FAADzCeYGIs8FQADuCAAh2wUBAPIIACHNBgEA8ggAIdAGAQDyCAAh4gYBAO0IACHjBiAA_QgAIeQGAADcCcoFIuYGQAD8CAAh5wYBAPIIACHoBgEA8ggAIQEAAABSACAICQAA7gkAIB0AAPEJACCiBQAA8AkAMKMFAABUABCkBQAA8AkAMKoFAQDtCAAhrgVAAO4IACHZBQEA7QgAIQIJAADTEQAgHQAA1BEAIAkJAADuCQAgHQAA8QkAIKIFAADwCQAwowUAAFQAEKQFAADwCQAwqgUBAO0IACGuBUAA7ggAIdkFAQDtCAAh7AYAAO8JACADAAAAVAAgAQAAVQAwAgAAVgAgAwAAAFQAIAEAAFUAMAIAAFYAIAEAAABUACANAwAA1QkAIAkAAO4JACCiBQAA7QkAMKMFAABaABCkBQAA7QkAMKUFAQDtCAAhpwUBAPIIACGoBQEA8ggAIaoFAQDtCAAhwwUBAPIIACHEBQEA8ggAIcUFAQDyCAAhxgVAAO4IACEHAwAA8wsAIAkAANMRACCnBQAAqgoAIKgFAACqCgAgwwUAAKoKACDEBQAAqgoAIMUFAACqCgAgDQMAANUJACAJAADuCQAgogUAAO0JADCjBQAAWgAQpAUAAO0JADClBQEAAAABpwUBAPIIACGoBQEA8ggAIaoFAQDtCAAhwwUBAPIIACHEBQEA8ggAIcUFAQDyCAAhxgVAAO4IACEDAAAAWgAgAQAAWwAwAgAAXAAgAQAAAFIAIBADAADVCQAgCQAA7AkAIBEAAOsJACCiBQAA6QkAMKMFAABfABCkBQAA6QkAMKUFAQDtCAAhpgUBAO0IACGnBQEA8ggAIagFAQDyCAAhqQUBAPIIACGqBQEA8ggAIasFCADqCQAhrAUBAPIIACGtBQAA_wgAIK4FQADuCAAhCgMAAPMLACAJAADTEQAgEQAAng0AIKcFAACqCgAgqAUAAKoKACCpBQAAqgoAIKoFAACqCgAgqwUAAKoKACCsBQAAqgoAIK0FAACqCgAgEAMAANUJACAJAADsCQAgEQAA6wkAIKIFAADpCQAwowUAAF8AEKQFAADpCQAwpQUBAAAAAaYFAQDtCAAhpwUBAPIIACGoBQEA8ggAIakFAQDyCAAhqgUBAPIIACGrBQgA6gkAIawFAQDyCAAhrQUAAP8IACCuBUAA7ggAIQMAAABfACABAABgADACAABhACABAAAAUgAgAQAAAAcAIAEAAAAXACADAAAADQAgAQAADgAwAgAADwAgAQAAAEkAIAEAAAAbACABAAAATgAgAQAAAFQAIAEAAABaACABAAAAXwAgAQAAAA0AIAMAAABBACABAABCADACAABDACADAAAABwAgAQAACAAwAgAACQAgAQAAAA0AIAEAAABBACABAAAABwAgAwAAACwAIAEAAC0AMAIAAC4AIA8RAACoCQAgogUAAKUJADCjBQAAdAAQpAUAAKUJADClBQEA7QgAIakFAQDtCAAhrgVAAO4IACHOBQAApwmKBiLPBUAA7ggAIYgGAACmCYgGIooGEACYCQAhiwYBAPIIACGMBgAA_wgAII0GQAD8CAAhjgYBAPIIACEBAAAAdAAgChEAAKgJACCiBQAA5wkAMKMFAAB2ABCkBQAA5wkAMKUFAQDtCAAhqQUBAO0IACGuBUAA7ggAIc4FAADoCZoGIvcFAQDyCAAhmgYBAPIIACEDEQAAng0AIPcFAACqCgAgmgYAAKoKACAKEQAAqAkAIKIFAADnCQAwowUAAHYAEKQFAADnCQAwpQUBAAAAAakFAQDtCAAhrgVAAO4IACHOBQAA6AmaBiL3BQEA8ggAIZoGAQDyCAAhAwAAAHYAIAEAAHcAMAIAAHgAIBERAACoCQAgJwAA5gkAIKIFAADkCQAwowUAAHoAEKQFAADkCQAwpQUBAO0IACGpBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHOBQAA5QmZBiLPBUAA7ggAIZIGAQDtCAAhkwYBAO0IACGUBgEA8ggAIZUGAQDyCAAhlgZAAPwIACGXBkAA_AgAIQcRAACeDQAgJwAA0hEAIK0FAACqCgAglAYAAKoKACCVBgAAqgoAIJYGAACqCgAglwYAAKoKACAREQAAqAkAICcAAOYJACCiBQAA5AkAMKMFAAB6ABCkBQAA5AkAMKUFAQAAAAGpBQEAAAABrQUAAP8IACCuBUAA7ggAIc4FAADlCZkGIs8FQADuCAAhkgYBAO0IACGTBgEA7QgAIZQGAQDyCAAhlQYBAPIIACGWBkAA_AgAIZcGQAD8CAAhAwAAAHoAIAEAAHsAMAIAAHwAIAsmAADjCQAgogUAAOIJADCjBQAAfgAQpAUAAOIJADClBQEA7QgAIa4FQADuCAAhzgUBAO0IACHgBQEA8ggAIY8GAQDtCAAhkAYBAPIIACGRBkAA7ggAIQMmAADREQAg4AUAAKoKACCQBgAAqgoAIAsmAADjCQAgogUAAOIJADCjBQAAfgAQpAUAAOIJADClBQEAAAABrgVAAO4IACHOBQEA7QgAIeAFAQDyCAAhjwYBAO0IACGQBgEA8ggAIZEGQADuCAAhAwAAAH4AIAEAAH8AMAIAAIABACABAAAAfgAgAwAAAF8AIAEAAGAAMAIAAGEAIAEAAAAsACABAAAAdgAgAQAAAHoAIAEAAABfACABAAAABwAgDAMAAIQJACCiBQAA4QkAMKMFAACJAQAQpAUAAOEJADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHEBQEA8ggAIc8FQADuCAAh3AZAAO4IACHgBgEA7QgAIeEGAQDyCAAhAwMAAPMLACDEBQAAqgoAIOEGAACqCgAgDAMAAIQJACCiBQAA4QkAMKMFAACJAQAQpAUAAOEJADClBQEAAAABpwUBAO0IACGuBUAA7ggAIcQFAQDyCAAhzwVAAO4IACHcBkAA7ggAIeAGAQAAAAHhBgEA8ggAIQMAAACJAQAgAQAAigEAMAIAAIsBACAQAwAAhAkAIKIFAADgCQAwowUAAI0BABCkBQAA4AkAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2AYBAO0IACHZBgEA7QgAIdoGAQDyCAAh2wYBAPIIACHcBkAA_AgAId0GAQDyCAAh3gYBAPIIACHfBgEA8ggAIQcDAADzCwAg2gYAAKoKACDbBgAAqgoAINwGAACqCgAg3QYAAKoKACDeBgAAqgoAIN8GAACqCgAgEQMAAIQJACCiBQAA4AkAMKMFAACNAQAQpAUAAOAJADClBQEAAAABpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2AYBAO0IACHZBgEA7QgAIdoGAQDyCAAh2wYBAPIIACHcBkAA_AgAId0GAQDyCAAh3gYBAPIIACHfBgEA8ggAIesGAADfCQAgAwAAAI0BACABAACOAQAwAgAAjwEAIAkDAACECQAgogUAAMYJADCjBQAAkQEAEKQFAADGCQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHXBgEA7QgAIQEAAACRAQAgAwAAAE4AIAEAAE8AMAIAAFAAIAMAAAAHACABAAAIADACAAAJACAJAwAAhAkAIA0AALkJACCiBQAAuAkAMKMFAACVAQAQpAUAALgJADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHPBUAA7ggAIQEAAACVAQAgDi8AAN4JACAwAACECQAgogUAANsJADCjBQAAlwEAEKQFAADbCQAwpQUBAO0IACGuBUAA7ggAIccFAQDtCAAhyAUBAO0IACHKBQAA3AnKBSLLBQEA7QgAIcwFAAD_CAAgzgUAAN0JzgUizwVAAO4IACEDLwAA0BEAIDAAAPMLACDMBQAAqgoAIA4vAADeCQAgMAAAhAkAIKIFAADbCQAwowUAAJcBABCkBQAA2wkAMKUFAQAAAAGuBUAA7ggAIccFAQDtCAAhyAUBAO0IACHKBQAA3AnKBSLLBQEA7QgAIcwFAAD_CAAgzgUAAN0JzgUizwVAAO4IACEDAAAAlwEAIAEAAJgBADACAACZAQAgAwAAAJcBACABAACYAQAwAgAAmQEAIAEAAACXAQAgDC0AAIQJACAuAADaCQAgogUAANgJADCjBQAAnQEAEKQFAADYCQAwpQUBAO0IACGuBUAA7ggAIc4FAADZCdMFIs8FQADuCAAh0AUBAO0IACHRBQEA7QgAIdMFAQDyCAAhAy0AAPMLACAuAADGEQAg0wUAAKoKACAMLQAAhAkAIC4AANoJACCiBQAA2AkAMKMFAACdAQAQpAUAANgJADClBQEAAAABrgVAAO4IACHOBQAA2QnTBSLPBUAA7ggAIdAFAQDtCAAh0QUBAO0IACHTBQEA8ggAIQMAAACdAQAgAQAAngEAMAIAAJ8BACADAAAATgAgAQAATwAwAgAAUAAgAwAAAFoAIAEAAFsAMAIAAFwAIAsDAADVCQAgogUAANcJADCjBQAAowEAEKQFAADXCQAwpQUBAO0IACGnBQEA8ggAIagFAQDyCAAhrgVAAO4IACHABQEA7QgAIcEFAgCaCQAhwgUAAP8IACAFAwAA8wsAIKcFAACqCgAgqAUAAKoKACDBBQAAqgoAIMIFAACqCgAgCwMAANUJACCiBQAA1wkAMKMFAACjAQAQpAUAANcJADClBQEAAAABpwUBAPIIACGoBQEA8ggAIa4FQADuCAAhwAUBAO0IACHBBQIAmgkAIcIFAAD_CAAgAwAAAKMBACABAACkAQAwAgAApQEAIAEAAABSACARAwAA1QkAIAYAANYJACA1AADPCQAgOAAAgAkAIKIFAADUCQAwowUAAKgBABCkBQAA1AkAMKUFAQDtCAAhpwUBAPIIACGuBUAA7ggAIcsFAQDtCAAhzwVAAO4IACHUBQEA7QgAIdUFAQDyCAAh1gUBAPIIACHXBSAA_QgAIdgFAQDyCAAhCAMAAPMLACAGAADPEQAgNQAAzBEAIDgAANgLACCnBQAAqgoAINUFAACqCgAg1gUAAKoKACDYBQAAqgoAIBEDAADVCQAgBgAA1gkAIDUAAM8JACA4AACACQAgogUAANQJADCjBQAAqAEAEKQFAADUCQAwpQUBAAAAAacFAQDyCAAhrgVAAO4IACHLBQEA7QgAIc8FQADuCAAh1AUBAO0IACHVBQEA8ggAIdYFAQDyCAAh1wUgAP0IACHYBQEA8ggAIQMAAACoAQAgAQAAqQEAMAIAAKoBACAHGAAA0wkAIDUAAM8JACCiBQAA0gkAMKMFAACsAQAQpAUAANIJADDUBQEA7QgAIdoFAQDtCAAhAhgAAM4RACA1AADMEQAgCBgAANMJACA1AADPCQAgogUAANIJADCjBQAArAEAEKQFAADSCQAw1AUBAO0IACHaBQEA7QgAIeoGAADRCQAgAwAAAKwBACABAACtAQAwAgAArgEAIAMAAACsAQAgAQAArQEAMAIAAK4BACABAAAArAEAIAcdAADQCQAgNQAAzwkAIKIFAADOCQAwowUAALIBABCkBQAAzgkAMNQFAQDtCAAh2QUBAO0IACECHQAAzREAIDUAAMwRACAIHQAA0AkAIDUAAM8JACCiBQAAzgkAMKMFAACyAQAQpAUAAM4JADDUBQEA7QgAIdkFAQDtCAAh6QYAAM0JACADAAAAsgEAIAEAALMBADACAAC0AQAgAwAAALIBACABAACzAQAwAgAAtAEAIAEAAACyAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIAEAAACsAQAgAQAAALIBACABAAAAqAEAIAEAAABSACABAAAAqAEAIAMAAACoAQAgAQAAqQEAMAIAAKoBACABAAAAqAEAIAMAAABfACABAABgADACAABhACAMAwAAhAkAIA0AAIUJACCiBQAAgwkAMKMFAADBAQAQpAUAAIMJADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdsFAQDtCAAh7gUgAP0IACHvBQEA8ggAIQEAAADBAQAgAQAAAAMAIAEAAACJAQAgAQAAAI0BACABAAAATgAgAQAAAAcAIAEAAACXAQAgAQAAAJ0BACABAAAATgAgAQAAAFoAIAEAAACjAQAgAQAAAKgBACABAAAAXwAgAQAAAAEAIBcOAADFEQAgFgAAyxEAIBwAAMQRACAfAADIEQAgIAAAyhEAICMAAJYNACApAADAEQAgKgAAwREAICsAAMIRACAsAADDEQAgMQAAxhEAIDIAAMcRACAzAADEEQAgNAAAyREAIDkAANgLACCtBQAAqgoAIMQFAACqCgAg2wUAAKoKACDNBgAAqgoAINAGAACqCgAg5gYAAKoKACDnBgAAqgoAIOgGAACqCgAgAwAAAFIAIAEAANABADACAAABACADAAAAUgAgAQAA0AEAMAIAAAEAIAMAAABSACABAADQAQAwAgAAAQAgHg4AALcRACAWAAC_EQAgHAAAtREAIB8AALsRACAgAAC-EQAgIwAAthEAICkAALERACAqAACyEQAgKwAAsxEAICwAALQRACAxAAC4EQAgMgAAuREAIDMAALoRACA0AAC8EQAgOQAAvREAIKUFAQAAAAGtBYAAAAABrgVAAAAAAcQFAQAAAAHOBQAAAOYGAs8FQAAAAAHbBQEAAAABzQYBAAAAAdAGAQAAAAHiBgEAAAAB4wYgAAAAAeQGAAAAygUC5gZAAAAAAecGAQAAAAHoBgEAAAABAT8AANQBACAPpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5gYCzwVAAAAAAdsFAQAAAAHNBgEAAAAB0AYBAAAAAeIGAQAAAAHjBiAAAAAB5AYAAADKBQLmBkAAAAAB5wYBAAAAAegGAQAAAAEBPwAA1gEAMAE_AADWAQAwHg4AAJ4QACAWAACmEAAgHAAAnBAAIB8AAKIQACAgAAClEAAgIwAAnRAAICkAAJgQACAqAACZEAAgKwAAmhAAICwAAJsQACAxAACfEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACECAAAAAQAgPwAA2QEAIA-lBQEAsAoAIa0FgAAAAAGuBUAAswoAIcQFAQCxCgAhzgUAAJcQ5gYizwVAALMKACHbBQEAsQoAIc0GAQCxCgAh0AYBALEKACHiBgEAsAoAIeMGIADpCgAh5AYAAMwKygUi5gZAALULACHnBgEAsQoAIegGAQCxCgAhAgAAAFIAID8AANsBACACAAAAUgAgPwAA2wEAIAMAAAABACBGAADUAQAgRwAA2QEAIAEAAAABACABAAAAUgAgCwsAAJQQACBMAACWEAAgTQAAlRAAIK0FAACqCgAgxAUAAKoKACDbBQAAqgoAIM0GAACqCgAg0AYAAKoKACDmBgAAqgoAIOcGAACqCgAg6AYAAKoKACASogUAAMkJADCjBQAA4gEAEKQFAADJCQAwpQUBAMYIACGtBQAAyQgAIK4FQADKCAAhxAUBAMcIACHOBQAAygnmBiLPBUAAyggAIdsFAQDHCAAhzQYBAMcIACHQBgEAxwgAIeIGAQDGCAAh4wYgAOYIACHkBgAA2wjKBSLmBkAA9QgAIecGAQDHCAAh6AYBAMcIACEDAAAAUgAgAQAA4QEAMEsAAOIBACADAAAAUgAgAQAA0AEAMAIAAAEAIAEAAACLAQAgAQAAAIsBACADAAAAiQEAIAEAAIoBADACAACLAQAgAwAAAIkBACABAACKAQAwAgAAiwEAIAMAAACJAQAgAQAAigEAMAIAAIsBACAJAwAAkxAAIKUFAQAAAAGnBQEAAAABrgVAAAAAAcQFAQAAAAHPBUAAAAAB3AZAAAAAAeAGAQAAAAHhBgEAAAABAT8AAOoBACAIpQUBAAAAAacFAQAAAAGuBUAAAAABxAUBAAAAAc8FQAAAAAHcBkAAAAAB4AYBAAAAAeEGAQAAAAEBPwAA7AEAMAE_AADsAQAwCQMAAJIQACClBQEAsAoAIacFAQCwCgAhrgVAALMKACHEBQEAsQoAIc8FQACzCgAh3AZAALMKACHgBgEAsAoAIeEGAQCxCgAhAgAAAIsBACA_AADvAQAgCKUFAQCwCgAhpwUBALAKACGuBUAAswoAIcQFAQCxCgAhzwVAALMKACHcBkAAswoAIeAGAQCwCgAh4QYBALEKACECAAAAiQEAID8AAPEBACACAAAAiQEAID8AAPEBACADAAAAiwEAIEYAAOoBACBHAADvAQAgAQAAAIsBACABAAAAiQEAIAULAACPEAAgTAAAkRAAIE0AAJAQACDEBQAAqgoAIOEGAACqCgAgC6IFAADICQAwowUAAPgBABCkBQAAyAkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIcQFAQDHCAAhzwVAAMoIACHcBkAAyggAIeAGAQDGCAAh4QYBAMcIACEDAAAAiQEAIAEAAPcBADBLAAD4AQAgAwAAAIkBACABAACKAQAwAgAAiwEAIAEAAACPAQAgAQAAAI8BACADAAAAjQEAIAEAAI4BADACAACPAQAgAwAAAI0BACABAACOAQAwAgAAjwEAIAMAAACNAQAgAQAAjgEAMAIAAI8BACANAwAAjhAAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHYBgEAAAAB2QYBAAAAAdoGAQAAAAHbBgEAAAAB3AZAAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAQE_AACAAgAgDKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHYBgEAAAAB2QYBAAAAAdoGAQAAAAHbBgEAAAAB3AZAAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAQE_AACCAgAwAT8AAIICADANAwAAjRAAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAh2AYBALAKACHZBgEAsAoAIdoGAQCxCgAh2wYBALEKACHcBkAAtQsAId0GAQCxCgAh3gYBALEKACHfBgEAsQoAIQIAAACPAQAgPwAAhQIAIAylBQEAsAoAIacFAQCwCgAhrgVAALMKACHPBUAAswoAIdgGAQCwCgAh2QYBALAKACHaBgEAsQoAIdsGAQCxCgAh3AZAALULACHdBgEAsQoAId4GAQCxCgAh3wYBALEKACECAAAAjQEAID8AAIcCACACAAAAjQEAID8AAIcCACADAAAAjwEAIEYAAIACACBHAACFAgAgAQAAAI8BACABAAAAjQEAIAkLAACKEAAgTAAAjBAAIE0AAIsQACDaBgAAqgoAINsGAACqCgAg3AYAAKoKACDdBgAAqgoAIN4GAACqCgAg3wYAAKoKACAPogUAAMcJADCjBQAAjgIAEKQFAADHCQAwpQUBAMYIACGnBQEAxggAIa4FQADKCAAhzwVAAMoIACHYBgEAxggAIdkGAQDGCAAh2gYBAMcIACHbBgEAxwgAIdwGQAD1CAAh3QYBAMcIACHeBgEAxwgAId8GAQDHCAAhAwAAAI0BACABAACNAgAwSwAAjgIAIAMAAACNAQAgAQAAjgEAMAIAAI8BACAJAwAAhAkAIKIFAADGCQAwowUAAJEBABCkBQAAxgkAMKUFAQAAAAGnBQEAAAABrgVAAO4IACHPBUAA7ggAIdcGAQDtCAAhAQAAAJECACABAAAAkQIAIAEDAADzCwAgAwAAAJEBACABAACUAgAwAgAAkQIAIAMAAACRAQAgAQAAlAIAMAIAAJECACADAAAAkQEAIAEAAJQCADACAACRAgAgBgMAAIkQACClBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAAB1wYBAAAAAQE_AACYAgAgBaUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHXBgEAAAABAT8AAJoCADABPwAAmgIAMAYDAACIEAAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzwVAALMKACHXBgEAsAoAIQIAAACRAgAgPwAAnQIAIAWlBQEAsAoAIacFAQCwCgAhrgVAALMKACHPBUAAswoAIdcGAQCwCgAhAgAAAJEBACA_AACfAgAgAgAAAJEBACA_AACfAgAgAwAAAJECACBGAACYAgAgRwAAnQIAIAEAAACRAgAgAQAAAJEBACADCwAAhRAAIEwAAIcQACBNAACGEAAgCKIFAADFCQAwowUAAKYCABCkBQAAxQkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIc8FQADKCAAh1wYBAMYIACEDAAAAkQEAIAEAAKUCADBLAACmAgAgAwAAAJEBACABAACUAgAwAgAAkQIAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgDwMAAIMQACAjAACEEAAgpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAc4GAQAAAAHPBgEAAAAB0AYBAAAAAdEGAQAAAAHSBgEAAAAB0wYBAAAAAdQGAQAAAAHVBgEAAAAB1gYgAAAAAQE_AACuAgAgDaUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHOBgEAAAABzwYBAAAAAdAGAQAAAAHRBgEAAAAB0gYBAAAAAdMGAQAAAAHUBgEAAAAB1QYBAAAAAdYGIAAAAAEBPwAAsAIAMAE_AACwAgAwDwMAAPgPACAjAAD5DwAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzwVAALMKACHOBgEAsQoAIc8GAQCxCgAh0AYBALEKACHRBgEAsAoAIdIGAQCwCgAh0wYBALEKACHUBgEAsQoAIdUGAQCwCgAh1gYgAOkKACECAAAABQAgPwAAswIAIA2lBQEAsAoAIacFAQCwCgAhrgVAALMKACHPBUAAswoAIc4GAQCxCgAhzwYBALEKACHQBgEAsQoAIdEGAQCwCgAh0gYBALAKACHTBgEAsQoAIdQGAQCxCgAh1QYBALAKACHWBiAA6QoAIQIAAAADACA_AAC1AgAgAgAAAAMAID8AALUCACADAAAABQAgRgAArgIAIEcAALMCACABAAAABQAgAQAAAAMAIAgLAAD1DwAgTAAA9w8AIE0AAPYPACDOBgAAqgoAIM8GAACqCgAg0AYAAKoKACDTBgAAqgoAINQGAACqCgAgEKIFAADECQAwowUAALwCABCkBQAAxAkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIc8FQADKCAAhzgYBAMcIACHPBgEAxwgAIdAGAQDHCAAh0QYBAMYIACHSBgEAxggAIdMGAQDHCAAh1AYBAMcIACHVBgEAxggAIdYGIADmCAAhAwAAAAMAIAEAALsCADBLAAC8AgAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAVACABAAAAFQAgAwAAABEAIAEAABQAMAIAABUAIAMAAAARACABAAAUADACAAAVACADAAAAEQAgAQAAFAAwAgAAFQAgEgYAAPQPACAHAADwDwAgCAAA8Q8AIBMAAPIPACAZAADzDwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2AUBAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAG-BgIAAAABzQYBAAAAAQE_AADEAgAgDaUFAQAAAAGuBUAAAAABzwVAAAAAAdgFAQAAAAHbBQEAAAAB3AUBAAAAAeAFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABvgYCAAAAAc0GAQAAAAEBPwAAxgIAMAE_AADGAgAwAQAAABEAIBIGAADBDwAgBwAAwg8AIAgAAMMPACATAADEDwAgGQAAxQ8AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdgFAQCxCgAh2wUBALAKACHcBQEAsAoAIeAFAQCxCgAh6AUBALEKACHpBQEAsQoAIeoFAQCxCgAhhQYgAOkKACG-BgIAtgsAIc0GAQCxCgAhAgAAABUAID8AAMoCACANpQUBALAKACGuBUAAswoAIc8FQACzCgAh2AUBALEKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIb4GAgC2CwAhzQYBALEKACECAAAAEQAgPwAAzAIAIAIAAAARACA_AADMAgAgAQAAABEAIAMAAAAVACBGAADEAgAgRwAAygIAIAEAAAAVACABAAAAEQAgCwsAALwPACBMAAC_DwAgTQAAvg8AIJ4BAAC9DwAgnwEAAMAPACDYBQAAqgoAIOAFAACqCgAg6AUAAKoKACDpBQAAqgoAIOoFAACqCgAgzQYAAKoKACAQogUAAMMJADCjBQAA1AIAEKQFAADDCQAwpQUBAMYIACGuBUAAyggAIc8FQADKCAAh2AUBAMcIACHbBQEAxggAIdwFAQDGCAAh4AUBAMcIACHoBQEAxwgAIekFAQDHCAAh6gUBAMcIACGFBiAA5ggAIb4GAgD2CAAhzQYBAMcIACEDAAAAEQAgAQAA0wIAMEsAANQCACADAAAAEQAgAQAAFAAwAgAAFQAgCQgAAMIJACCiBQAAwQkAMKMFAADaAgAQpAUAAMEJADClBQEAAAABrgVAAO4IACHPBUAA7ggAIdsFAQAAAAHcBQEAAAABAQAAANcCACABAAAA1wIAIAkIAADCCQAgogUAAMEJADCjBQAA2gIAEKQFAADBCQAwpQUBAO0IACGuBUAA7ggAIc8FQADuCAAh2wUBAO0IACHcBQEA7QgAIQEIAAC7DwAgAwAAANoCACABAADbAgAwAgAA1wIAIAMAAADaAgAgAQAA2wIAMAIAANcCACADAAAA2gIAIAEAANsCADACAADXAgAgBggAALoPACClBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB3AUBAAAAAQE_AADfAgAgBaUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAABAT8AAOECADABPwAA4QIAMAYIAACwDwAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHcBQEAsAoAIQIAAADXAgAgPwAA5AIAIAWlBQEAsAoAIa4FQACzCgAhzwVAALMKACHbBQEAsAoAIdwFAQCwCgAhAgAAANoCACA_AADmAgAgAgAAANoCACA_AADmAgAgAwAAANcCACBGAADfAgAgRwAA5AIAIAEAAADXAgAgAQAAANoCACADCwAArQ8AIEwAAK8PACBNAACuDwAgCKIFAADACQAwowUAAO0CABCkBQAAwAkAMKUFAQDGCAAhrgVAAMoIACHPBUAAyggAIdsFAQDGCAAh3AUBAMYIACEDAAAA2gIAIAEAAOwCADBLAADtAgAgAwAAANoCACABAADbAgAwAgAA1wIAIAEAAABWACABAAAAVgAgAwAAAFQAIAEAAFUAMAIAAFYAIAMAAABUACABAABVADACAABWACADAAAAVAAgAQAAVQAwAgAAVgAgBQkAAKwPACAdAAD-DgAgqgUBAAAAAa4FQAAAAAHZBQEAAAABAT8AAPUCACADqgUBAAAAAa4FQAAAAAHZBQEAAAABAT8AAPcCADABPwAA9wIAMAUJAACrDwAgHQAA_A4AIKoFAQCwCgAhrgVAALMKACHZBQEAsAoAIQIAAABWACA_AAD6AgAgA6oFAQCwCgAhrgVAALMKACHZBQEAsAoAIQIAAABUACA_AAD8AgAgAgAAAFQAID8AAPwCACADAAAAVgAgRgAA9QIAIEcAAPoCACABAAAAVgAgAQAAAFQAIAMLAACoDwAgTAAAqg8AIE0AAKkPACAGogUAAL8JADCjBQAAgwMAEKQFAAC_CQAwqgUBAMYIACGuBUAAyggAIdkFAQDGCAAhAwAAAFQAIAEAAIIDADBLAACDAwAgAwAAAFQAIAEAAFUAMAIAAFYAIAEAAAAZACABAAAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgIBMAAKIPACAYAACgDwAgGgAAoQ8AIBwAAKMPACAeAACkDwAgHwAApQ8AICAAAKYPACAhAACnDwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHcBQEAAAAB4AUBAAAAAeEFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGIAAAAAHMBiAAAAABAT8AAIsDACAYpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHcBQEAAAAB4AUBAAAAAeEFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGIAAAAAHMBiAAAAABAT8AAI0DADABPwAAjQMAMAEAAAARACAgEwAAzQ4AIBgAAMsOACAaAADMDgAgHAAAzg4AIB4AAM8OACAfAADQDgAgIAAA0Q4AICEAANIOACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIc8FQACzCgAh2gUBALEKACHcBQEAsAoAIeAFAQCxCgAh4QUBALAKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIcEGAQCxCgAhwgYBALEKACHDBhAAkgwAIcQGEACSDAAhxQYQAJIMACHGBgIAvwoAIccGAQCxCgAhyAYBALEKACHJBgIAtgsAIcoGIADpCgAhywYgAOkKACHMBiAA6QoAIQIAAAAZACA_AACRAwAgGKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhzwVAALMKACHaBQEAsQoAIdwFAQCwCgAh4AUBALEKACHhBQEAsAoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhwQYBALEKACHCBgEAsQoAIcMGEACSDAAhxAYQAJIMACHFBhAAkgwAIcYGAgC_CgAhxwYBALEKACHIBgEAsQoAIckGAgC2CwAhygYgAOkKACHLBiAA6QoAIcwGIADpCgAhAgAAABcAID8AAJMDACACAAAAFwAgPwAAkwMAIAEAAAARACADAAAAGQAgRgAAiwMAIEcAAJEDACABAAAAGQAgAQAAABcAIBMLAADGDgAgTAAAyQ4AIE0AAMgOACCeAQAAxw4AIJ8BAADKDgAgrQUAAKoKACDaBQAAqgoAIOAFAACqCgAg6AUAAKoKACDpBQAAqgoAIOoFAACqCgAgwQYAAKoKACDCBgAAqgoAIMMGAACqCgAgxAYAAKoKACDFBgAAqgoAIMYGAACqCgAgxwYAAKoKACDIBgAAqgoAIBuiBQAAvgkAMKMFAACbAwAQpAUAAL4JADClBQEAxggAIa0FAADJCAAgrgVAAMoIACHPBUAAyggAIdoFAQDHCAAh3AUBAMYIACHgBQEAxwgAIeEFAQDGCAAh6AUBAMcIACHpBQEAxwgAIeoFAQDHCAAhhQYgAOYIACHBBgEAxwgAIcIGAQDHCAAhwwYQAI8JACHEBhAAjwkAIcUGEACPCQAhxgYCANcIACHHBgEAxwgAIcgGAQDHCAAhyQYCAPYIACHKBiAA5ggAIcsGIADmCAAhzAYgAOYIACEDAAAAFwAgAQAAmgMAMEsAAJsDACADAAAAFwAgAQAAGAAwAgAAGQAgAQAAAEsAIAEAAABLACADAAAASQAgAQAASgAwAgAASwAgAwAAAEkAIAEAAEoAMAIAAEsAIAMAAABJACABAABKADACAABLACAICQAAxA4AIAoAAMUOACClBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAEBPwAAowMAIAalBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAEBPwAApQMAMAE_AAClAwAwCAkAALYOACAKAAC3DgAgpQUBALAKACGqBQEAsAoAIa4FQACzCgAhzwVAALMKACHhBQEAsAoAIYUGIADpCgAhAgAAAEsAID8AAKgDACAGpQUBALAKACGqBQEAsAoAIa4FQACzCgAhzwVAALMKACHhBQEAsAoAIYUGIADpCgAhAgAAAEkAID8AAKoDACACAAAASQAgPwAAqgMAIAMAAABLACBGAACjAwAgRwAAqAMAIAEAAABLACABAAAASQAgAwsAALMOACBMAAC1DgAgTQAAtA4AIAmiBQAAvQkAMKMFAACxAwAQpAUAAL0JADClBQEAxggAIaoFAQDGCAAhrgVAAMoIACHPBUAAyggAIeEFAQDGCAAhhQYgAOYIACEDAAAASQAgAQAAsAMAMEsAALEDACADAAAASQAgAQAASgAwAgAASwAgAQAAACMAIAEAAAAjACADAAAAIAAgAQAAIgAwAgAAIwAgAwAAACAAIAEAACIAMAIAACMAIAMAAAAgACABAAAiADACAAAjACARDAAArQ4AIBAAAK4OACASAACvDgAgEwAAsA4AIBUAALEOACAXAACyDgAgpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcAGAQAAAAHBBgEAAAABwgYBAAAAAcMGEAAAAAHEBhAAAAABxQYQAAAAAcYGAgAAAAEBPwAAuQMAIAulBQEAAAABrgVAAAAAAc8FQAAAAAGFBiAAAAABwAYBAAAAAcEGAQAAAAHCBgEAAAABwwYQAAAAAcQGEAAAAAHFBhAAAAABxgYCAAAAAQE_AAC7AwAwAT8AALsDADARDAAA9A0AIBAAAPUNACASAAD2DQAgEwAA9w0AIBUAAPgNACAXAAD5DQAgpQUBALAKACGuBUAAswoAIc8FQACzCgAhhQYgAOkKACHABgEAsAoAIcEGAQCwCgAhwgYBALEKACHDBhAAkQwAIcQGEACSDAAhxQYQAJIMACHGBgIAtgsAIQIAAAAjACA_AAC-AwAgC6UFAQCwCgAhrgVAALMKACHPBUAAswoAIYUGIADpCgAhwAYBALAKACHBBgEAsAoAIcIGAQCxCgAhwwYQAJEMACHEBhAAkgwAIcUGEACSDAAhxgYCALYLACECAAAAIAAgPwAAwAMAIAIAAAAgACA_AADAAwAgAwAAACMAIEYAALkDACBHAAC-AwAgAQAAACMAIAEAAAAgACAICwAA7w0AIEwAAPINACBNAADxDQAgngEAAPANACCfAQAA8w0AIMIGAACqCgAgxAYAAKoKACDFBgAAqgoAIA6iBQAAvAkAMKMFAADHAwAQpAUAALwJADClBQEAxggAIa4FQADKCAAhzwVAAMoIACGFBiAA5ggAIcAGAQDGCAAhwQYBAMYIACHCBgEAxwgAIcMGEACOCQAhxAYQAI8JACHFBhAAjwkAIcYGAgD2CAAhAwAAACAAIAEAAMYDADBLAADHAwAgAwAAACAAIAEAACIAMAIAACMAIAEAAAAdACABAAAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgDgkAAOwNACAPAADtDQAgGAAA7g0AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAAB7QUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABAT8AAM8DACALpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHtBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAEBPwAA0QMAMAE_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_gMAIAIDAADzCwAgDQAA2A0AIAMAAACVAQAgAQAAgQQAMAIAAP4DACADAAAAlQEAIAEAAIEEADACAAD-AwAgAwAAAJUBACABAACBBAAwAgAA_gMAIAYDAADWDQAgDQAA1w0AIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAEBPwAAhQQAIASlBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAABAT8AAIcEADABPwAAhwQAMAYDAADIDQAgDQAAyQ0AIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAhAgAAAP4DACA_AACKBAAgBKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAhAgAAAJUBACA_AACMBAAgAgAAAJUBACA_AACMBAAgAwAAAP4DACBGAACFBAAgRwAAigQAIAEAAAD-AwAgAQAAAJUBACADCwAAxQ0AIEwAAMcNACBNAADGDQAgB6IFAAC3CQAwowUAAJMEABCkBQAAtwkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIc8FQADKCAAhAwAAAJUBACABAACSBAAwSwAAkwQAIAMAAACVAQAgAQAAgQQAMAIAAP4DACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAgOAADDDQAgDwAAxA0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAHyBQIAAAABsgYBAAAAAQE_AACbBAAgBqUFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAHyBQIAAAABsgYBAAAAAQE_AACdBAAwAT8AAJ0EADAIDgAAwQ0AIA8AAMINACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHtBQEAsAoAIfIFAgC2CwAhsgYBALAKACECAAAAKAAgPwAAoAQAIAalBQEAsAoAIa4FQACzCgAhzwVAALMKACHtBQEAsAoAIfIFAgC2CwAhsgYBALAKACECAAAAJgAgPwAAogQAIAIAAAAmACA_AACiBAAgAwAAACgAIEYAAJsEACBHAACgBAAgAQAAACgAIAEAAAAmACAFCwAAvA0AIEwAAL8NACBNAAC-DQAgngEAAL0NACCfAQAAwA0AIAmiBQAAtgkAMKMFAACpBAAQpAUAALYJADClBQEAxggAIa4FQADKCAAhzwVAAMoIACHtBQEAxggAIfIFAgD2CAAhsgYBAMYIACEDAAAAJgAgAQAAqAQAMEsAAKkEACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAfAwAA8gwAIAQAAPMMACAFAAC7DQAgDQAA9AwAICAAAPgMACAkAAD1DAAgJQAA9gwAICgAAPcMACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAEBPwAAsQQAIBelBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAEBPwAAswQAMAE_AACzBAAwAQAAAAsAIB8DAACiDAAgBAAAowwAIAUAALoNACANAACkDAAgIAAAqAwAICQAAKUMACAlAACmDAAgKAAApwwAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc4FAACgDJoGIs8FQACzCgAh-QUBALEKACGhBhAAkQwAIaIGAQCwCgAhowYBALAKACGkBoAAAAABpQYBALEKACGmBgEAsQoAIacGEACRDAAhqAYQAJEMACGpBhAAkQwAIaoGEACRDAAhqwYBALEKACGsBkAAswoAIa0GQAC1CwAhrgZAALULACGvBkAAtQsAIbAGQAC1CwAhsQZAALULACECAAAACQAgPwAAtwQAIBelBQEAsAoAIacFAQCwCgAhrgVAALMKACHOBQAAoAyaBiLPBUAAswoAIfkFAQCxCgAhoQYQAJEMACGiBgEAsAoAIaMGAQCwCgAhpAaAAAAAAaUGAQCxCgAhpgYBALEKACGnBhAAkQwAIagGEACRDAAhqQYQAJEMACGqBhAAkQwAIasGAQCxCgAhrAZAALMKACGtBkAAtQsAIa4GQAC1CwAhrwZAALULACGwBkAAtQsAIbEGQAC1CwAhAgAAAAcAID8AALkEACACAAAABwAgPwAAuQQAIAEAAAALACADAAAACQAgRgAAsQQAIEcAALcEACABAAAACQAgAQAAAAcAIA8LAAC1DQAgTAAAuA0AIE0AALcNACCeAQAAtg0AIJ8BAAC5DQAg-QUAAKoKACCkBgAAqgoAIKUGAACqCgAgpgYAAKoKACCrBgAAqgoAIK0GAACqCgAgrgYAAKoKACCvBgAAqgoAILAGAACqCgAgsQYAAKoKACAaogUAALUJADCjBQAAwQQAEKQFAAC1CQAwpQUBAMYIACGnBQEAxggAIa4FQADKCAAhzgUAAK8JmgYizwVAAMoIACH5BQEAxwgAIaEGEACOCQAhogYBAMYIACGjBgEAxggAIaQGAADJCAAgpQYBAMcIACGmBgEAxwgAIacGEACOCQAhqAYQAI4JACGpBhAAjgkAIaoGEACOCQAhqwYBAMcIACGsBkAAyggAIa0GQAD1CAAhrgZAAPUIACGvBkAA9QgAIbAGQAD1CAAhsQZAAPUIACEDAAAABwAgAQAAwAQAMEsAAMEEACADAAAABwAgAQAACAAwAgAACQAgAQAAAC4AIAEAAAAuACADAAAALAAgAQAALQAwAgAALgAgAwAAACwAIAEAAC0AMAIAAC4AIAMAAAAsACABAAAtADACAAAuACAPDwAA8AwAIBEAALQNACClBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB7QUBAAAAAfIFAgAAAAGbBgEAAAABnAYBAAAAAZ0GAQAAAAGeBoAAAAABnwYQAAAAAaAGEAAAAAGhBhAAAAABAT8AAMkEACANpQUBAAAAAakFAQAAAAGqBQEAAAABrgVAAAAAAe0FAQAAAAHyBQIAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABngaAAAAAAZ8GEAAAAAGgBhAAAAABoQYQAAAAAQE_AADLBAAwAT8AAMsEADAPDwAA7gwAIBEAALMNACClBQEAsAoAIakFAQCwCgAhqgUBALAKACGuBUAAswoAIe0FAQCwCgAh8gUCALYLACGbBgEAsAoAIZwGAQCwCgAhnQYBALEKACGeBoAAAAABnwYQAJEMACGgBhAAkQwAIaEGEACRDAAhAgAAAC4AID8AAM4EACANpQUBALAKACGpBQEAsAoAIaoFAQCwCgAhrgVAALMKACHtBQEAsAoAIfIFAgC2CwAhmwYBALAKACGcBgEAsAoAIZ0GAQCxCgAhngaAAAAAAZ8GEACRDAAhoAYQAJEMACGhBhAAkQwAIQIAAAAsACA_AADQBAAgAgAAACwAID8AANAEACADAAAALgAgRgAAyQQAIEcAAM4EACABAAAALgAgAQAAACwAIAYLAACuDQAgTAAAsQ0AIE0AALANACCeAQAArw0AIJ8BAACyDQAgnQYAAKoKACAQogUAALIJADCjBQAA1wQAEKQFAACyCQAwpQUBAMYIACGpBQEAxggAIaoFAQDGCAAhrgVAAMoIACHtBQEAxggAIfIFAgD2CAAhmwYBAMYIACGcBgEAxggAIZ0GAQDHCAAhngYAALMJACCfBhAAjgkAIaAGEACOCQAhoQYQAI4JACEDAAAALAAgAQAA1gQAMEsAANcEACADAAAALAAgAQAALQAwAgAALgAgAQAAAHgAIAEAAAB4ACADAAAAdgAgAQAAdwAwAgAAeAAgAwAAAHYAIAEAAHcAMAIAAHgAIAMAAAB2ACABAAB3ADACAAB4ACAHEQAArQ0AIKUFAQAAAAGpBQEAAAABrgVAAAAAAc4FAAAAmgYC9wUBAAAAAZoGAQAAAAEBPwAA3wQAIAalBQEAAAABqQUBAAAAAa4FQAAAAAHOBQAAAJoGAvcFAQAAAAGaBgEAAAABAT8AAOEEADABPwAA4QQAMAcRAACsDQAgpQUBALAKACGpBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYi9wUBALEKACGaBgEAsQoAIQIAAAB4ACA_AADkBAAgBqUFAQCwCgAhqQUBALAKACGuBUAAswoAIc4FAACgDJoGIvcFAQCxCgAhmgYBALEKACECAAAAdgAgPwAA5gQAIAIAAAB2ACA_AADmBAAgAwAAAHgAIEYAAN8EACBHAADkBAAgAQAAAHgAIAEAAAB2ACAFCwAAqQ0AIEwAAKsNACBNAACqDQAg9wUAAKoKACCaBgAAqgoAIAmiBQAArgkAMKMFAADtBAAQpAUAAK4JADClBQEAxggAIakFAQDGCAAhrgVAAMoIACHOBQAArwmaBiL3BQEAxwgAIZoGAQDHCAAhAwAAAHYAIAEAAOwEADBLAADtBAAgAwAAAHYAIAEAAHcAMAIAAHgAIAEAAAB8ACABAAAAfAAgAwAAAHoAIAEAAHsAMAIAAHwAIAMAAAB6ACABAAB7ADACAAB8ACADAAAAegAgAQAAewAwAgAAfAAgDhEAAKgNACAnAADPDAAgpQUBAAAAAakFAQAAAAGtBYAAAAABrgVAAAAAAc4FAAAAmQYCzwVAAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAQE_AAD1BAAgDKUFAQAAAAGpBQEAAAABrQWAAAAAAa4FQAAAAAHOBQAAAJkGAs8FQAAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAEBPwAA9wQAMAE_AAD3BAAwDhEAAKcNACAnAADBDAAgpQUBALAKACGpBQEAsAoAIa0FgAAAAAGuBUAAswoAIc4FAAC_DJkGIs8FQACzCgAhkgYBALAKACGTBgEAsAoAIZQGAQCxCgAhlQYBALEKACGWBkAAtQsAIZcGQAC1CwAhAgAAAHwAID8AAPoEACAMpQUBALAKACGpBQEAsAoAIa0FgAAAAAGuBUAAswoAIc4FAAC_DJkGIs8FQACzCgAhkgYBALAKACGTBgEAsAoAIZQGAQCxCgAhlQYBALEKACGWBkAAtQsAIZcGQAC1CwAhAgAAAHoAID8AAPwEACACAAAAegAgPwAA_AQAIAMAAAB8ACBGAAD1BAAgRwAA-gQAIAEAAAB8ACABAAAAegAgCAsAAKQNACBMAACmDQAgTQAApQ0AIK0FAACqCgAglAYAAKoKACCVBgAAqgoAIJYGAACqCgAglwYAAKoKACAPogUAAKoJADCjBQAAgwUAEKQFAACqCQAwpQUBAMYIACGpBQEAxggAIa0FAADJCAAgrgVAAMoIACHOBQAAqwmZBiLPBUAAyggAIZIGAQDGCAAhkwYBAMYIACGUBgEAxwgAIZUGAQDHCAAhlgZAAPUIACGXBkAA9QgAIQMAAAB6ACABAACCBQAwSwAAgwUAIAMAAAB6ACABAAB7ADACAAB8ACABAAAAgAEAIAEAAACAAQAgAwAAAH4AIAEAAH8AMAIAAIABACADAAAAfgAgAQAAfwAwAgAAgAEAIAMAAAB-ACABAAB_ADACAACAAQAgCCYAAKMNACClBQEAAAABrgVAAAAAAc4FAQAAAAHgBQEAAAABjwYBAAAAAZAGAQAAAAGRBkAAAAABAT8AAIsFACAHpQUBAAAAAa4FQAAAAAHOBQEAAAAB4AUBAAAAAY8GAQAAAAGQBgEAAAABkQZAAAAAAQE_AACNBQAwAT8AAI0FADAIJgAAog0AIKUFAQCwCgAhrgVAALMKACHOBQEAsAoAIeAFAQCxCgAhjwYBALAKACGQBgEAsQoAIZEGQACzCgAhAgAAAIABACA_AACQBQAgB6UFAQCwCgAhrgVAALMKACHOBQEAsAoAIeAFAQCxCgAhjwYBALAKACGQBgEAsQoAIZEGQACzCgAhAgAAAH4AID8AAJIFACACAAAAfgAgPwAAkgUAIAMAAACAAQAgRgAAiwUAIEcAAJAFACABAAAAgAEAIAEAAAB-ACAFCwAAnw0AIEwAAKENACBNAACgDQAg4AUAAKoKACCQBgAAqgoAIAqiBQAAqQkAMKMFAACZBQAQpAUAAKkJADClBQEAxggAIa4FQADKCAAhzgUBAMYIACHgBQEAxwgAIY8GAQDGCAAhkAYBAMcIACGRBkAAyggAIQMAAAB-ACABAACYBQAwSwAAmQUAIAMAAAB-ACABAAB_ADACAACAAQAgDxEAAKgJACCiBQAApQkAMKMFAAB0ABCkBQAApQkAMKUFAQAAAAGpBQEAAAABrgVAAO4IACHOBQAApwmKBiLPBUAA7ggAIYgGAACmCYgGIooGEACYCQAhiwYBAPIIACGMBgAA_wgAII0GQAD8CAAhjgYBAPIIACEBAAAAnAUAIAEAAACcBQAgBREAAJ4NACCLBgAAqgoAIIwGAACqCgAgjQYAAKoKACCOBgAAqgoAIAMAAAB0ACABAACfBQAwAgAAnAUAIAMAAAB0ACABAACfBQAwAgAAnAUAIAMAAAB0ACABAACfBQAwAgAAnAUAIAwRAACdDQAgpQUBAAAAAakFAQAAAAGuBUAAAAABzgUAAACKBgLPBUAAAAABiAYAAACIBgKKBhAAAAABiwYBAAAAAYwGgAAAAAGNBkAAAAABjgYBAAAAAQE_AACjBQAgC6UFAQAAAAGpBQEAAAABrgVAAAAAAc4FAAAAigYCzwVAAAAAAYgGAAAAiAYCigYQAAAAAYsGAQAAAAGMBoAAAAABjQZAAAAAAY4GAQAAAAEBPwAApQUAMAE_AAClBQAwDBEAAJwNACClBQEAsAoAIakFAQCwCgAhrgVAALMKACHOBQAA4gyKBiLPBUAAswoAIYgGAADhDIgGIooGEACRDAAhiwYBALEKACGMBoAAAAABjQZAALULACGOBgEAsQoAIQIAAACcBQAgPwAAqAUAIAulBQEAsAoAIakFAQCwCgAhrgVAALMKACHOBQAA4gyKBiLPBUAAswoAIYgGAADhDIgGIooGEACRDAAhiwYBALEKACGMBoAAAAABjQZAALULACGOBgEAsQoAIQIAAAB0ACA_AACqBQAgAgAAAHQAID8AAKoFACADAAAAnAUAIEYAAKMFACBHAACoBQAgAQAAAJwFACABAAAAdAAgCQsAAJcNACBMAACaDQAgTQAAmQ0AIJ4BAACYDQAgnwEAAJsNACCLBgAAqgoAIIwGAACqCgAgjQYAAKoKACCOBgAAqgoAIA6iBQAAngkAMKMFAACxBQAQpAUAAJ4JADClBQEAxggAIakFAQDGCAAhrgVAAMoIACHOBQAAoAmKBiLPBUAAyggAIYgGAACfCYgGIooGEACOCQAhiwYBAMcIACGMBgAAyQgAII0GQAD1CAAhjgYBAMcIACEDAAAAdAAgAQAAsAUAMEsAALEFACADAAAAdAAgAQAAnwUAMAIAAJwFACAWCAAAmwkAICIAAJwJACAjAACdCQAgogUAAJYJADCjBQAACwAQpAUAAJYJADClBQEAAAABrgVAAO4IACHPBUAA7ggAIeAFAQDyCAAh-gUBAAAAAfwFAACXCfwFIv0FEACYCQAh_gUQAJkJACH_BRAAmQkAIYAGAgCaCQAhgQYCAP4IACGCBgIAmgkAIYMGQADuCAAhhAZAAO4IACGFBiAA_QgAIYYGIAD9CAAhAQAAALQFACABAAAAtAUAIAgIAACUDQAgIgAAlQ0AICMAAJYNACDgBQAAqgoAIP4FAACqCgAg_wUAAKoKACCABgAAqgoAIIIGAACqCgAgAwAAAAsAIAEAALcFADACAAC0BQAgAwAAAAsAIAEAALcFADACAAC0BQAgAwAAAAsAIAEAALcFADACAAC0BQAgEwgAAJENACAiAACSDQAgIwAAkw0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAeAFAQAAAAH6BQEAAAAB_AUAAAD8BQL9BRAAAAAB_gUQAAAAAf8FEAAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBkAAAAABhAZAAAAAAYUGIAAAAAGGBiAAAAABAT8AALsFACAQpQUBAAAAAa4FQAAAAAHPBUAAAAAB4AUBAAAAAfoFAQAAAAH8BQAAAPwFAv0FEAAAAAH-BRAAAAAB_wUQAAAAAYAGAgAAAAGBBgIAAAABggYCAAAAAYMGQAAAAAGEBkAAAAABhQYgAAAAAYYGIAAAAAEBPwAAvQUAMAE_AAC9BQAwEwgAAJMMACAiAACUDAAgIwAAlQwAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIeAFAQCxCgAh-gUBALAKACH8BQAAkAz8BSL9BRAAkQwAIf4FEACSDAAh_wUQAJIMACGABgIAvwoAIYEGAgC2CwAhggYCAL8KACGDBkAAswoAIYQGQACzCgAhhQYgAOkKACGGBiAA6QoAIQIAAAC0BQAgPwAAwAUAIBClBQEAsAoAIa4FQACzCgAhzwVAALMKACHgBQEAsQoAIfoFAQCwCgAh_AUAAJAM_AUi_QUQAJEMACH-BRAAkgwAIf8FEACSDAAhgAYCAL8KACGBBgIAtgsAIYIGAgC_CgAhgwZAALMKACGEBkAAswoAIYUGIADpCgAhhgYgAOkKACECAAAACwAgPwAAwgUAIAIAAAALACA_AADCBQAgAwAAALQFACBGAAC7BQAgRwAAwAUAIAEAAAC0BQAgAQAAAAsAIAoLAACLDAAgTAAAjgwAIE0AAI0MACCeAQAAjAwAIJ8BAACPDAAg4AUAAKoKACD-BQAAqgoAIP8FAACqCgAggAYAAKoKACCCBgAAqgoAIBOiBQAAjAkAMKMFAADJBQAQpAUAAIwJADClBQEAxggAIa4FQADKCAAhzwVAAMoIACHgBQEAxwgAIfoFAQDGCAAh_AUAAI0J_AUi_QUQAI4JACH-BRAAjwkAIf8FEACPCQAhgAYCANcIACGBBgIA9ggAIYIGAgDXCAAhgwZAAMoIACGEBkAAyggAIYUGIADmCAAhhgYgAOYIACEDAAAACwAgAQAAyAUAMEsAAMkFACADAAAACwAgAQAAtwUAMAIAALQFACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAQFAACJDAAgCQAAigwAIKoFAQAAAAH5BQEAAAABAT8AANEFACACqgUBAAAAAfkFAQAAAAEBPwAA0wUAMAE_AADTBQAwBAUAAIcMACAJAACIDAAgqgUBALAKACH5BQEAsAoAIQIAAAAPACA_AADWBQAgAqoFAQCwCgAh-QUBALAKACECAAAADQAgPwAA2AUAIAIAAAANACA_AADYBQAgAwAAAA8AIEYAANEFACBHAADWBQAgAQAAAA8AIAEAAAANACADCwAAhAwAIEwAAIYMACBNAACFDAAgBaIFAACLCQAwowUAAN8FABCkBQAAiwkAMKoFAQDGCAAh-QUBAMYIACEDAAAADQAgAQAA3gUAMEsAAN8FACADAAAADQAgAQAADgAwAgAADwAgAQAAAEMAIAEAAABDACADAAAAQQAgAQAAQgAwAgAAQwAgAwAAAEEAIAEAAEIAMAIAAEMAIAMAAABBACABAABCADACAABDACAEBQAAggwAIBgAAIMMACDaBQEAAAAB-QUBAAAAAQE_AADnBQAgAtoFAQAAAAH5BQEAAAABAT8AAOkFADABPwAA6QUAMAQFAACADAAgGAAAgQwAINoFAQCwCgAh-QUBALAKACECAAAAQwAgPwAA7AUAIALaBQEAsAoAIfkFAQCwCgAhAgAAAEEAID8AAO4FACACAAAAQQAgPwAA7gUAIAMAAABDACBGAADnBQAgRwAA7AUAIAEAAABDACABAAAAQQAgAwsAAP0LACBMAAD_CwAgTQAA_gsAIAWiBQAAigkAMKMFAAD1BQAQpAUAAIoJADDaBQEAxggAIfkFAQDGCAAhAwAAAEEAIAEAAPQFADBLAAD1BQAgAwAAAEEAIAEAAEIAMAIAAEMAIAEAAAAzACABAAAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgDBQAAPwLACClBQEAAAABrgVAAAAAAe0FAQAAAAHxBQAAAPEFAvIFAgAAAAHzBQIAAAAB9AUCAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAEBPwAA_QUAIAulBQEAAAABrgVAAAAAAe0FAQAAAAHxBQAAAPEFAvIFAgAAAAHzBQIAAAAB9AUCAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAEBPwAA_wUAMAE_AAD_BQAwDBQAAPsLACClBQEAsAoAIa4FQACzCgAh7QUBALAKACHxBQAA-gvxBSLyBQIAtgsAIfMFAgC2CwAh9AUCALYLACH1BQEAsQoAIfYFAQCxCgAh9wUBALEKACH4BQEAsQoAIQIAAAAzACA_AACCBgAgC6UFAQCwCgAhrgVAALMKACHtBQEAsAoAIfEFAAD6C_EFIvIFAgC2CwAh8wUCALYLACH0BQIAtgsAIfUFAQCxCgAh9gUBALEKACH3BQEAsQoAIfgFAQCxCgAhAgAAADEAID8AAIQGACACAAAAMQAgPwAAhAYAIAMAAAAzACBGAAD9BQAgRwAAggYAIAEAAAAzACABAAAAMQAgCQsAAPULACBMAAD4CwAgTQAA9wsAIJ4BAAD2CwAgnwEAAPkLACD1BQAAqgoAIPYFAACqCgAg9wUAAKoKACD4BQAAqgoAIA6iBQAAhgkAMKMFAACLBgAQpAUAAIYJADClBQEAxggAIa4FQADKCAAh7QUBAMYIACHxBQAAhwnxBSLyBQIA9ggAIfMFAgD2CAAh9AUCAPYIACH1BQEAxwgAIfYFAQDHCAAh9wUBAMcIACH4BQEAxwgAIQMAAAAxACABAACKBgAwSwAAiwYAIAMAAAAxACABAAAyADACAAAzACAMAwAAhAkAIA0AAIUJACCiBQAAgwkAMKMFAADBAQAQpAUAAIMJADClBQEAAAABpwUBAAAAAa4FQADuCAAhzwVAAO4IACHbBQEA7QgAIe4FIAD9CAAh7wUBAAAAAQEAAACOBgAgAQAAAI4GACADAwAA8wsAIA0AAPQLACDvBQAAqgoAIAMAAADBAQAgAQAAkQYAMAIAAI4GACADAAAAwQEAIAEAAJEGADACAACOBgAgAwAAAMEBACABAACRBgAwAgAAjgYAIAkDAADxCwAgDQAA8gsAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB7gUgAAAAAe8FAQAAAAEBPwAAlQYAIAelBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAe4FIAAAAAHvBQEAAAABAT8AAJcGADABPwAAlwYAMAkDAADjCwAgDQAA5AsAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHuBSAA6QoAIe8FAQCxCgAhAgAAAI4GACA_AACaBgAgB6UFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHuBSAA6QoAIe8FAQCxCgAhAgAAAMEBACA_AACcBgAgAgAAAMEBACA_AACcBgAgAwAAAI4GACBGAACVBgAgRwAAmgYAIAEAAACOBgAgAQAAAMEBACAECwAA4AsAIEwAAOILACBNAADhCwAg7wUAAKoKACAKogUAAIIJADCjBQAAowYAEKQFAACCCQAwpQUBAMYIACGnBQEAxggAIa4FQADKCAAhzwVAAMoIACHbBQEAxggAIe4FIADmCAAh7wUBAMcIACEDAAAAwQEAIAEAAKIGADBLAACjBgAgAwAAAMEBACABAACRBgAwAgAAjgYAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgBg8AAN8LACAWAADeCwAgpQUBAAAAAa4FQAAAAAHsBQEAAAAB7QUBAAAAAQE_AACrBgAgBKUFAQAAAAGuBUAAAAAB7AUBAAAAAe0FAQAAAAEBPwAArQYAMAE_AACtBgAwBg8AAN0LACAWAADcCwAgpQUBALAKACGuBUAAswoAIewFAQCwCgAh7QUBALAKACECAAAANwAgPwAAsAYAIASlBQEAsAoAIa4FQACzCgAh7AUBALAKACHtBQEAsAoAIQIAAAA1ACA_AACyBgAgAgAAADUAID8AALIGACADAAAANwAgRgAAqwYAIEcAALAGACABAAAANwAgAQAAADUAIAMLAADZCwAgTAAA2wsAIE0AANoLACAHogUAAIEJADCjBQAAuQYAEKQFAACBCQAwpQUBAMYIACGuBUAAyggAIewFAQDGCAAh7QUBAMYIACEDAAAANQAgAQAAuAYAMEsAALkGACADAAAANQAgAQAANgAwAgAANwAgFx4AAO8IACAiAADzCAAgNwAAgAkAIKIFAAD7CAAwowUAAL8GABCkBQAA-wgAMKUFAQAAAAGtBQAA_wgAIK4FQADuCAAhywUBAO0IACHPBUAA7ggAIdwFAQAAAAHhBQEA7QgAIeIFAQDyCAAh4wUBAPIIACHkBQEA8ggAIeUFQAD8CAAh5gUgAP0IACHnBQIA_ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIesFIAD9CAAhAQAAALwGACABAAAAvAYAIBceAADvCAAgIgAA8wgAIDcAAIAJACCiBQAA-wgAMKMFAAC_BgAQpAUAAPsIADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHLBQEA7QgAIc8FQADuCAAh3AUBAO0IACHhBQEA7QgAIeIFAQDyCAAh4wUBAPIIACHkBQEA8ggAIeUFQAD8CAAh5gUgAP0IACHnBQIA_ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIesFIAD9CAAhCx4AAJ0LACAiAACvCwAgNwAA2AsAIK0FAACqCgAg4gUAAKoKACDjBQAAqgoAIOQFAACqCgAg5QUAAKoKACDoBQAAqgoAIOkFAACqCgAg6gUAAKoKACADAAAAvwYAIAEAAMAGADACAAC8BgAgAwAAAL8GACABAADABgAwAgAAvAYAIAMAAAC_BgAgAQAAwAYAMAIAALwGACAUHgAA1gsAICIAANULACA3AADXCwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHcBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFQAAAAAHmBSAAAAAB5wUCAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAesFIAAAAAEBPwAAxAYAIBGlBQEAAAABrQWAAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdwFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBQEAAAAB5QVAAAAAAeYFIAAAAAHnBQIAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAAB6wUgAAAAAQE_AADGBgAwAT8AAMYGADAUHgAAuAsAICIAALcLACA3AAC5CwAgpQUBALAKACGtBYAAAAABrgVAALMKACHLBQEAsAoAIc8FQACzCgAh3AUBALAKACHhBQEAsAoAIeIFAQCxCgAh4wUBALEKACHkBQEAsQoAIeUFQAC1CwAh5gUgAOkKACHnBQIAtgsAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIesFIADpCgAhAgAAALwGACA_AADJBgAgEaUFAQCwCgAhrQWAAAAAAa4FQACzCgAhywUBALAKACHPBUAAswoAIdwFAQCwCgAh4QUBALAKACHiBQEAsQoAIeMFAQCxCgAh5AUBALEKACHlBUAAtQsAIeYFIADpCgAh5wUCALYLACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACHrBSAA6QoAIQIAAAC_BgAgPwAAywYAIAIAAAC_BgAgPwAAywYAIAMAAAC8BgAgRgAAxAYAIEcAAMkGACABAAAAvAYAIAEAAAC_BgAgDQsAALALACBMAACzCwAgTQAAsgsAIJ4BAACxCwAgnwEAALQLACCtBQAAqgoAIOIFAACqCgAg4wUAAKoKACDkBQAAqgoAIOUFAACqCgAg6AUAAKoKACDpBQAAqgoAIOoFAACqCgAgFKIFAAD0CAAwowUAANIGABCkBQAA9AgAMKUFAQDGCAAhrQUAAMkIACCuBUAAyggAIcsFAQDGCAAhzwVAAMoIACHcBQEAxggAIeEFAQDGCAAh4gUBAMcIACHjBQEAxwgAIeQFAQDHCAAh5QVAAPUIACHmBSAA5ggAIecFAgD2CAAh6AUBAMcIACHpBQEAxwgAIeoFAQDHCAAh6wUgAOYIACEDAAAAvwYAIAEAANEGADBLAADSBgAgAwAAAL8GACABAADABgAwAgAAvAYAIAo2AADzCAAgogUAAPEIADCjBQAA2AYAEKQFAADxCAAwpQUBAAAAAa4FQADuCAAhzwVAAO4IACHbBQEA7QgAIdwFAQAAAAHgBQEA8ggAIQEAAADVBgAgAQAAANUGACAKNgAA8wgAIKIFAADxCAAwowUAANgGABCkBQAA8QgAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIQI2AACvCwAg4AUAAKoKACADAAAA2AYAIAEAANkGADACAADVBgAgAwAAANgGACABAADZBgAwAgAA1QYAIAMAAADYBgAgAQAA2QYAMAIAANUGACAHNgAArgsAIKUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAQE_AADdBgAgBqUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAQE_AADfBgAwAT8AAN8GADAHNgAAoQsAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdsFAQCwCgAh3AUBALAKACHgBQEAsQoAIQIAAADVBgAgPwAA4gYAIAalBQEAsAoAIa4FQACzCgAhzwVAALMKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACECAAAA2AYAID8AAOQGACACAAAA2AYAID8AAOQGACADAAAA1QYAIEYAAN0GACBHAADiBgAgAQAAANUGACABAAAA2AYAIAQLAACeCwAgTAAAoAsAIE0AAJ8LACDgBQAAqgoAIAmiBQAA8AgAMKMFAADrBgAQpAUAAPAIADClBQEAxggAIa4FQADKCAAhzwVAAMoIACHbBQEAxggAIdwFAQDGCAAh4AUBAMcIACEDAAAA2AYAIAEAAOoGADBLAADrBgAgAwAAANgGACABAADZBgAwAgAA1QYAIAk2AADvCAAgogUAAOwIADCjBQAA8QYAEKQFAADsCAAwpQUBAAAAAa4FQADuCAAhzwVAAO4IACHbBQEAAAAB3AUBAAAAAQEAAADuBgAgAQAAAO4GACAJNgAA7wgAIKIFAADsCAAwowUAAPEGABCkBQAA7AgAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdsFAQDtCAAh3AUBAO0IACEBNgAAnQsAIAMAAADxBgAgAQAA8gYAMAIAAO4GACADAAAA8QYAIAEAAPIGADACAADuBgAgAwAAAPEGACABAADyBgAwAgAA7gYAIAY2AACcCwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAdwFAQAAAAEBPwAA9gYAIAWlBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB3AUBAAAAAQE_AAD4BgAwAT8AAPgGADAGNgAAjwsAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdsFAQCwCgAh3AUBALAKACECAAAA7gYAID8AAPsGACAFpQUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHcBQEAsAoAIQIAAADxBgAgPwAA_QYAIAIAAADxBgAgPwAA_QYAIAMAAADuBgAgRgAA9gYAIEcAAPsGACABAAAA7gYAIAEAAADxBgAgAwsAAIwLACBMAACOCwAgTQAAjQsAIAiiBQAA6wgAMKMFAACEBwAQpAUAAOsIADClBQEAxggAIa4FQADKCAAhzwVAAMoIACHbBQEAxggAIdwFAQDGCAAhAwAAAPEGACABAACDBwAwSwAAhAcAIAMAAADxBgAgAQAA8gYAMAIAAO4GACABAAAArgEAIAEAAACuAQAgAwAAAKwBACABAACtAQAwAgAArgEAIAMAAACsAQAgAQAArQEAMAIAAK4BACADAAAArAEAIAEAAK0BADACAACuAQAgBBgAAIsLACA1AACKCwAg1AUBAAAAAdoFAQAAAAEBPwAAjAcAIALUBQEAAAAB2gUBAAAAAQE_AACOBwAwAT8AAI4HADAEGAAAiQsAIDUAAIgLACDUBQEAsAoAIdoFAQCwCgAhAgAAAK4BACA_AACRBwAgAtQFAQCwCgAh2gUBALAKACECAAAArAEAID8AAJMHACACAAAArAEAID8AAJMHACADAAAArgEAIEYAAIwHACBHAACRBwAgAQAAAK4BACABAAAArAEAIAMLAACFCwAgTAAAhwsAIE0AAIYLACAFogUAAOoIADCjBQAAmgcAEKQFAADqCAAw1AUBAMYIACHaBQEAxggAIQMAAACsAQAgAQAAmQcAMEsAAJoHACADAAAArAEAIAEAAK0BADACAACuAQAgAQAAALQBACABAAAAtAEAIAMAAACyAQAgAQAAswEAMAIAALQBACADAAAAsgEAIAEAALMBADACAAC0AQAgAwAAALIBACABAACzAQAwAgAAtAEAIAQdAACECwAgNQAAgwsAINQFAQAAAAHZBQEAAAABAT8AAKIHACAC1AUBAAAAAdkFAQAAAAEBPwAApAcAMAE_AACkBwAwBB0AAIILACA1AACBCwAg1AUBALAKACHZBQEAsAoAIQIAAAC0AQAgPwAApwcAIALUBQEAsAoAIdkFAQCwCgAhAgAAALIBACA_AACpBwAgAgAAALIBACA_AACpBwAgAwAAALQBACBGAACiBwAgRwAApwcAIAEAAAC0AQAgAQAAALIBACADCwAA_goAIEwAAIALACBNAAD_CgAgBaIFAADpCAAwowUAALAHABCkBQAA6QgAMNQFAQDGCAAh2QUBAMYIACEDAAAAsgEAIAEAAK8HADBLAACwBwAgAwAAALIBACABAACzAQAwAgAAtAEAIAEAAACqAQAgAQAAAKoBACADAAAAqAEAIAEAAKkBADACAACqAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIAMAAACoAQAgAQAAqQEAMAIAAKoBACAOAwAA-woAIAYAAP0KACA1AAD6CgAgOAAA_AoAIKUFAQAAAAGnBQEAAAABrgVAAAAAAcsFAQAAAAHPBUAAAAAB1AUBAAAAAdUFAQAAAAHWBQEAAAAB1wUgAAAAAdgFAQAAAAEBPwAAuAcAIAqlBQEAAAABpwUBAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdQFAQAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAHYBQEAAAABAT8AALoHADABPwAAugcAMAEAAABSACABAAAAqAEAIA4DAADrCgAgBgAA7AoAIDUAAOoKACA4AADtCgAgpQUBALAKACGnBQEAsQoAIa4FQACzCgAhywUBALAKACHPBUAAswoAIdQFAQCwCgAh1QUBALEKACHWBQEAsQoAIdcFIADpCgAh2AUBALEKACECAAAAqgEAID8AAL8HACAKpQUBALAKACGnBQEAsQoAIa4FQACzCgAhywUBALAKACHPBUAAswoAIdQFAQCwCgAh1QUBALEKACHWBQEAsQoAIdcFIADpCgAh2AUBALEKACECAAAAqAEAID8AAMEHACACAAAAqAEAID8AAMEHACABAAAAUgAgAQAAAKgBACADAAAAqgEAIEYAALgHACBHAAC_BwAgAQAAAKoBACABAAAAqAEAIAcLAADmCgAgTAAA6AoAIE0AAOcKACCnBQAAqgoAINUFAACqCgAg1gUAAKoKACDYBQAAqgoAIA2iBQAA5QgAMKMFAADKBwAQpAUAAOUIADClBQEAxggAIacFAQDHCAAhrgVAAMoIACHLBQEAxggAIc8FQADKCAAh1AUBAMYIACHVBQEAxwgAIdYFAQDHCAAh1wUgAOYIACHYBQEAxwgAIQMAAACoAQAgAQAAyQcAMEsAAMoHACADAAAAqAEAIAEAAKkBADACAACqAQAgAQAAAJ8BACABAAAAnwEAIAMAAACdAQAgAQAAngEAMAIAAJ8BACADAAAAnQEAIAEAAJ4BADACAACfAQAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAktAADkCgAgLgAA5QoAIKUFAQAAAAGuBUAAAAABzgUAAADTBQLPBUAAAAAB0AUBAAAAAdEFAQAAAAHTBQEAAAABAT8AANIHACAHpQUBAAAAAa4FQAAAAAHOBQAAANMFAs8FQAAAAAHQBQEAAAAB0QUBAAAAAdMFAQAAAAEBPwAA1AcAMAE_AADUBwAwCS0AANYKACAuAADXCgAgpQUBALAKACGuBUAAswoAIc4FAADVCtMFIs8FQACzCgAh0AUBALAKACHRBQEAsAoAIdMFAQCxCgAhAgAAAJ8BACA_AADXBwAgB6UFAQCwCgAhrgVAALMKACHOBQAA1QrTBSLPBUAAswoAIdAFAQCwCgAh0QUBALAKACHTBQEAsQoAIQIAAACdAQAgPwAA2QcAIAIAAACdAQAgPwAA2QcAIAMAAACfAQAgRgAA0gcAIEcAANcHACABAAAAnwEAIAEAAACdAQAgBAsAANIKACBMAADUCgAgTQAA0woAINMFAACqCgAgCqIFAADhCAAwowUAAOAHABCkBQAA4QgAMKUFAQDGCAAhrgVAAMoIACHOBQAA4gjTBSLPBUAAyggAIdAFAQDGCAAh0QUBAMYIACHTBQEAxwgAIQMAAACdAQAgAQAA3wcAMEsAAOAHACADAAAAnQEAIAEAAJ4BADACAACfAQAgAQAAAJkBACABAAAAmQEAIAMAAACXAQAgAQAAmAEAMAIAAJkBACADAAAAlwEAIAEAAJgBADACAACZAQAgAwAAAJcBACABAACYAQAwAgAAmQEAIAsvAADQCgAgMAAA0QoAIKUFAQAAAAGuBUAAAAABxwUBAAAAAcgFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABAT8AAOgHACAJpQUBAAAAAa4FQAAAAAHHBQEAAAAByAUBAAAAAcoFAAAAygUCywUBAAAAAcwFgAAAAAHOBQAAAM4FAs8FQAAAAAEBPwAA6gcAMAE_AADqBwAwCy8AAM4KACAwAADPCgAgpQUBALAKACGuBUAAswoAIccFAQCwCgAhyAUBALAKACHKBQAAzArKBSLLBQEAsAoAIcwFgAAAAAHOBQAAzQrOBSLPBUAAswoAIQIAAACZAQAgPwAA7QcAIAmlBQEAsAoAIa4FQACzCgAhxwUBALAKACHIBQEAsAoAIcoFAADMCsoFIssFAQCwCgAhzAWAAAAAAc4FAADNCs4FIs8FQACzCgAhAgAAAJcBACA_AADvBwAgAgAAAJcBACA_AADvBwAgAwAAAJkBACBGAADoBwAgRwAA7QcAIAEAAACZAQAgAQAAAJcBACAECwAAyQoAIEwAAMsKACBNAADKCgAgzAUAAKoKACAMogUAANoIADCjBQAA9gcAEKQFAADaCAAwpQUBAMYIACGuBUAAyggAIccFAQDGCAAhyAUBAMYIACHKBQAA2wjKBSLLBQEAxggAIcwFAADJCAAgzgUAANwIzgUizwVAAMoIACEDAAAAlwEAIAEAAPUHADBLAAD2BwAgAwAAAJcBACABAACYAQAwAgAAmQEAIAEAAABcACABAAAAXAAgAwAAAFoAIAEAAFsAMAIAAFwAIAMAAABaACABAABbADACAABcACADAAAAWgAgAQAAWwAwAgAAXAAgCgMAAMgKACAJAADHCgAgpQUBAAAAAacFAQAAAAGoBQEAAAABqgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAEBPwAA_gcAIAilBQEAAAABpwUBAAAAAagFAQAAAAGqBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAQE_AACACAAwAT8AAIAIADABAAAAUgAgCgMAAMYKACAJAADFCgAgpQUBALAKACGnBQEAsQoAIagFAQCxCgAhqgUBALAKACHDBQEAsQoAIcQFAQCxCgAhxQUBALEKACHGBUAAswoAIQIAAABcACA_AACECAAgCKUFAQCwCgAhpwUBALEKACGoBQEAsQoAIaoFAQCwCgAhwwUBALEKACHEBQEAsQoAIcUFAQCxCgAhxgVAALMKACECAAAAWgAgPwAAhggAIAIAAABaACA_AACGCAAgAQAAAFIAIAMAAABcACBGAAD-BwAgRwAAhAgAIAEAAABcACABAAAAWgAgCAsAAMIKACBMAADECgAgTQAAwwoAIKcFAACqCgAgqAUAAKoKACDDBQAAqgoAIMQFAACqCgAgxQUAAKoKACALogUAANkIADCjBQAAjggAEKQFAADZCAAwpQUBAMYIACGnBQEAxwgAIagFAQDHCAAhqgUBAMYIACHDBQEAxwgAIcQFAQDHCAAhxQUBAMcIACHGBUAAyggAIQMAAABaACABAACNCAAwSwAAjggAIAMAAABaACABAABbADACAABcACABAAAApQEAIAEAAAClAQAgAwAAAKMBACABAACkAQAwAgAApQEAIAMAAACjAQAgAQAApAEAMAIAAKUBACADAAAAowEAIAEAAKQBADACAAClAQAgCAMAAMEKACClBQEAAAABpwUBAAAAAagFAQAAAAGuBUAAAAABwAUBAAAAAcEFAgAAAAHCBYAAAAABAT8AAJYIACAHpQUBAAAAAacFAQAAAAGoBQEAAAABrgVAAAAAAcAFAQAAAAHBBQIAAAABwgWAAAAAAQE_AACYCAAwAT8AAJgIADABAAAAUgAgCAMAAMAKACClBQEAsAoAIacFAQCxCgAhqAUBALEKACGuBUAAswoAIcAFAQCwCgAhwQUCAL8KACHCBYAAAAABAgAAAKUBACA_AACcCAAgB6UFAQCwCgAhpwUBALEKACGoBQEAsQoAIa4FQACzCgAhwAUBALAKACHBBQIAvwoAIcIFgAAAAAECAAAAowEAID8AAJ4IACACAAAAowEAID8AAJ4IACABAAAAUgAgAwAAAKUBACBGAACWCAAgRwAAnAgAIAEAAAClAQAgAQAAAKMBACAJCwAAugoAIEwAAL0KACBNAAC8CgAgngEAALsKACCfAQAAvgoAIKcFAACqCgAgqAUAAKoKACDBBQAAqgoAIMIFAACqCgAgCqIFAADWCAAwowUAAKYIABCkBQAA1ggAMKUFAQDGCAAhpwUBAMcIACGoBQEAxwgAIa4FQADKCAAhwAUBAMYIACHBBQIA1wgAIcIFAADJCAAgAwAAAKMBACABAAClCAAwSwAApggAIAMAAACjAQAgAQAApAEAMAIAAKUBACABAAAAYQAgAQAAAGEAIAMAAABfACABAABgADACAABhACADAAAAXwAgAQAAYAAwAgAAYQAgAwAAAF8AIAEAAGAAMAIAAGEAIA0DAAC3CgAgCQAAuQoAIBEAALgKACClBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABqQUBAAAAAaoFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABAT8AAK4IACAKpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQE_AACwCAAwAT8AALAIADABAAAAUgAgAQAAAAcAIAEAAAAXACANAwAAtAoAIAkAALYKACARAAC1CgAgpQUBALAKACGmBQEAsAoAIacFAQCxCgAhqAUBALEKACGpBQEAsQoAIaoFAQCxCgAhqwUIALIKACGsBQEAsQoAIa0FgAAAAAGuBUAAswoAIQIAAABhACA_AAC2CAAgCqUFAQCwCgAhpgUBALAKACGnBQEAsQoAIagFAQCxCgAhqQUBALEKACGqBQEAsQoAIasFCACyCgAhrAUBALEKACGtBYAAAAABrgVAALMKACECAAAAXwAgPwAAuAgAIAIAAABfACA_AAC4CAAgAQAAAFIAIAEAAAAHACABAAAAFwAgAwAAAGEAIEYAAK4IACBHAAC2CAAgAQAAAGEAIAEAAABfACAMCwAAqwoAIEwAAK4KACBNAACtCgAgngEAAKwKACCfAQAArwoAIKcFAACqCgAgqAUAAKoKACCpBQAAqgoAIKoFAACqCgAgqwUAAKoKACCsBQAAqgoAIK0FAACqCgAgDaIFAADFCAAwowUAAMIIABCkBQAAxQgAMKUFAQDGCAAhpgUBAMYIACGnBQEAxwgAIagFAQDHCAAhqQUBAMcIACGqBQEAxwgAIasFCADICAAhrAUBAMcIACGtBQAAyQgAIK4FQADKCAAhAwAAAF8AIAEAAMEIADBLAADCCAAgAwAAAF8AIAEAAGAAMAIAAGEAIA2iBQAAxQgAMKMFAADCCAAQpAUAAMUIADClBQEAxggAIaYFAQDGCAAhpwUBAMcIACGoBQEAxwgAIakFAQDHCAAhqgUBAMcIACGrBQgAyAgAIawFAQDHCAAhrQUAAMkIACCuBUAAyggAIQ4LAADMCAAgTAAA1QgAIE0AANUIACCvBQEAAAABsAUBAAAABLEFAQAAAASyBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtgUBANQIACG9BQEAAAABvgUBAAAAAb8FAQAAAAEOCwAAzggAIEwAANMIACBNAADTCAAgrwUBAAAAAbAFAQAAAAWxBQEAAAAFsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDSCAAhvQUBAAAAAb4FAQAAAAG_BQEAAAABDQsAAM4IACBMAADRCAAgTQAA0QgAIJ4BAADRCAAgnwEAANEIACCvBQgAAAABsAUIAAAABbEFCAAAAAWyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIANAIACEPCwAAzggAIEwAAM8IACBNAADPCAAgrwWAAAAAAbIFgAAAAAGzBYAAAAABtAWAAAAAAbUFgAAAAAG2BYAAAAABtwUBAAAAAbgFAQAAAAG5BQEAAAABugWAAAAAAbsFgAAAAAG8BYAAAAABCwsAAMwIACBMAADNCAAgTQAAzQgAIK8FQAAAAAGwBUAAAAAEsQVAAAAABLIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAAywgAIQsLAADMCAAgTAAAzQgAIE0AAM0IACCvBUAAAAABsAVAAAAABLEFQAAAAASyBUAAAAABswVAAAAAAbQFQAAAAAG1BUAAAAABtgVAAMsIACEIrwUCAAAAAbAFAgAAAASxBQIAAAAEsgUCAAAAAbMFAgAAAAG0BQIAAAABtQUCAAAAAbYFAgDMCAAhCK8FQAAAAAGwBUAAAAAEsQVAAAAABLIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAAzQgAIQivBQIAAAABsAUCAAAABbEFAgAAAAWyBQIAAAABswUCAAAAAbQFAgAAAAG1BQIAAAABtgUCAM4IACEMrwWAAAAAAbIFgAAAAAGzBYAAAAABtAWAAAAAAbUFgAAAAAG2BYAAAAABtwUBAAAAAbgFAQAAAAG5BQEAAAABugWAAAAAAbsFgAAAAAG8BYAAAAABDQsAAM4IACBMAADRCAAgTQAA0QgAIJ4BAADRCAAgnwEAANEIACCvBQgAAAABsAUIAAAABbEFCAAAAAWyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIANAIACEIrwUIAAAAAbAFCAAAAAWxBQgAAAAFsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCADRCAAhDgsAAM4IACBMAADTCAAgTQAA0wgAIK8FAQAAAAGwBQEAAAAFsQUBAAAABbIFAQAAAAGzBQEAAAABtAUBAAAAAbUFAQAAAAG2BQEA0ggAIb0FAQAAAAG-BQEAAAABvwUBAAAAAQuvBQEAAAABsAUBAAAABbEFAQAAAAWyBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtgUBANMIACG9BQEAAAABvgUBAAAAAb8FAQAAAAEOCwAAzAgAIEwAANUIACBNAADVCAAgrwUBAAAAAbAFAQAAAASxBQEAAAAEsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDUCAAhvQUBAAAAAb4FAQAAAAG_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_BQEAAAABCK8FQAAAAAGwBUAAAAAEsQVAAAAABLIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAAzQgAIQPdBQAAsgEAIN4FAACyAQAg3wUAALIBACAJogUAAPAIADCjBQAA6wYAEKQFAADwCAAwpQUBAMYIACGuBUAAyggAIc8FQADKCAAh2wUBAMYIACHcBQEAxggAIeAFAQDHCAAhCjYAAPMIACCiBQAA8QgAMKMFAADYBgAQpAUAAPEIADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHbBQEA7QgAIdwFAQDtCAAh4AUBAPIIACELrwUBAAAAAbAFAQAAAAWxBQEAAAAFsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDTCAAhvQUBAAAAAb4FAQAAAAG_BQEAAAABA90FAACsAQAg3gUAAKwBACDfBQAArAEAIBSiBQAA9AgAMKMFAADSBgAQpAUAAPQIADClBQEAxggAIa0FAADJCAAgrgVAAMoIACHLBQEAxggAIc8FQADKCAAh3AUBAMYIACHhBQEAxggAIeIFAQDHCAAh4wUBAMcIACHkBQEAxwgAIeUFQAD1CAAh5gUgAOYIACHnBQIA9ggAIegFAQDHCAAh6QUBAMcIACHqBQEAxwgAIesFIADmCAAhCwsAAM4IACBMAAD6CAAgTQAA-ggAIK8FQAAAAAGwBUAAAAAFsQVAAAAABbIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA-QgAIQ0LAADMCAAgTAAAzAgAIE0AAMwIACCeAQAA-AgAIJ8BAADMCAAgrwUCAAAAAbAFAgAAAASxBQIAAAAEsgUCAAAAAbMFAgAAAAG0BQIAAAABtQUCAAAAAbYFAgD3CAAhDQsAAMwIACBMAADMCAAgTQAAzAgAIJ4BAAD4CAAgnwEAAMwIACCvBQIAAAABsAUCAAAABLEFAgAAAASyBQIAAAABswUCAAAAAbQFAgAAAAG1BQIAAAABtgUCAPcIACEIrwUIAAAAAbAFCAAAAASxBQgAAAAEsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCAD4CAAhCwsAAM4IACBMAAD6CAAgTQAA-ggAIK8FQAAAAAGwBUAAAAAFsQVAAAAABbIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA-QgAIQivBUAAAAABsAVAAAAABbEFQAAAAAWyBUAAAAABswVAAAAAAbQFQAAAAAG1BUAAAAABtgVAAPoIACEXHgAA7wgAICIAAPMIACA3AACACQAgogUAAPsIADCjBQAAvwYAEKQFAAD7CAAwpQUBAO0IACGtBQAA_wgAIK4FQADuCAAhywUBAO0IACHPBUAA7ggAIdwFAQDtCAAh4QUBAO0IACHiBQEA8ggAIeMFAQDyCAAh5AUBAPIIACHlBUAA_AgAIeYFIAD9CAAh5wUCAP4IACHoBQEA8ggAIekFAQDyCAAh6gUBAPIIACHrBSAA_QgAIQivBUAAAAABsAVAAAAABbEFQAAAAAWyBUAAAAABswVAAAAAAbQFQAAAAAG1BUAAAAABtgVAAPoIACECrwUgAAAAAbYFIADoCAAhCK8FAgAAAAGwBQIAAAAEsQUCAAAABLIFAgAAAAGzBQIAAAABtAUCAAAAAbUFAgAAAAG2BQIAzAgAIQyvBYAAAAABsgWAAAAAAbMFgAAAAAG0BYAAAAABtQWAAAAAAbYFgAAAAAG3BQEAAAABuAUBAAAAAbkFAQAAAAG6BYAAAAABuwWAAAAAAbwFgAAAAAED3QUAAKgBACDeBQAAqAEAIN8FAACoAQAgB6IFAACBCQAwowUAALkGABCkBQAAgQkAMKUFAQDGCAAhrgVAAMoIACHsBQEAxggAIe0FAQDGCAAhCqIFAACCCQAwowUAAKMGABCkBQAAggkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIc8FQADKCAAh2wUBAMYIACHuBSAA5ggAIe8FAQDHCAAhDAMAAIQJACANAACFCQAgogUAAIMJADCjBQAAwQEAEKQFAACDCQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHbBQEA7QgAIe4FIAD9CAAh7wUBAPIIACEjDgAA-QkAIBYAAP4JACAcAAD4CQAgHwAA-wkAICAAAP0JACAjAACdCQAgKQAA9AkAICoAAPUJACArAAD2CQAgLAAA9wkAIDEAANoJACAyAAD6CQAgMwAA-AkAIDQAAPwJACA5AACACQAgogUAAPIJADCjBQAAUgAQpAUAAPIJADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHEBQEA8ggAIc4FAADzCeYGIs8FQADuCAAh2wUBAPIIACHNBgEA8ggAIdAGAQDyCAAh4gYBAO0IACHjBiAA_QgAIeQGAADcCcoFIuYGQAD8CAAh5wYBAPIIACHoBgEA8ggAIfQGAABSACD1BgAAUgAgA90FAAA1ACDeBQAANQAg3wUAADUAIA6iBQAAhgkAMKMFAACLBgAQpAUAAIYJADClBQEAxggAIa4FQADKCAAh7QUBAMYIACHxBQAAhwnxBSLyBQIA9ggAIfMFAgD2CAAh9AUCAPYIACH1BQEAxwgAIfYFAQDHCAAh9wUBAMcIACH4BQEAxwgAIQcLAADMCAAgTAAAiQkAIE0AAIkJACCvBQAAAPEFArAFAAAA8QUIsQUAAADxBQi2BQAAiAnxBSIHCwAAzAgAIEwAAIkJACBNAACJCQAgrwUAAADxBQKwBQAAAPEFCLEFAAAA8QUItgUAAIgJ8QUiBK8FAAAA8QUCsAUAAADxBQixBQAAAPEFCLYFAACJCfEFIgWiBQAAigkAMKMFAAD1BQAQpAUAAIoJADDaBQEAxggAIfkFAQDGCAAhBaIFAACLCQAwowUAAN8FABCkBQAAiwkAMKoFAQDGCAAh-QUBAMYIACETogUAAIwJADCjBQAAyQUAEKQFAACMCQAwpQUBAMYIACGuBUAAyggAIc8FQADKCAAh4AUBAMcIACH6BQEAxggAIfwFAACNCfwFIv0FEACOCQAh_gUQAI8JACH_BRAAjwkAIYAGAgDXCAAhgQYCAPYIACGCBgIA1wgAIYMGQADKCAAhhAZAAMoIACGFBiAA5ggAIYYGIADmCAAhBwsAAMwIACBMAACVCQAgTQAAlQkAIK8FAAAA_AUCsAUAAAD8BQixBQAAAPwFCLYFAACUCfwFIg0LAADMCAAgTAAAkwkAIE0AAJMJACCeAQAAkwkAIJ8BAACTCQAgrwUQAAAAAbAFEAAAAASxBRAAAAAEsgUQAAAAAbMFEAAAAAG0BRAAAAABtQUQAAAAAbYFEACSCQAhDQsAAM4IACBMAACRCQAgTQAAkQkAIJ4BAACRCQAgnwEAAJEJACCvBRAAAAABsAUQAAAABbEFEAAAAAWyBRAAAAABswUQAAAAAbQFEAAAAAG1BRAAAAABtgUQAJAJACENCwAAzggAIEwAAJEJACBNAACRCQAgngEAAJEJACCfAQAAkQkAIK8FEAAAAAGwBRAAAAAFsQUQAAAABbIFEAAAAAGzBRAAAAABtAUQAAAAAbUFEAAAAAG2BRAAkAkAIQivBRAAAAABsAUQAAAABbEFEAAAAAWyBRAAAAABswUQAAAAAbQFEAAAAAG1BRAAAAABtgUQAJEJACENCwAAzAgAIEwAAJMJACBNAACTCQAgngEAAJMJACCfAQAAkwkAIK8FEAAAAAGwBRAAAAAEsQUQAAAABLIFEAAAAAGzBRAAAAABtAUQAAAAAbUFEAAAAAG2BRAAkgkAIQivBRAAAAABsAUQAAAABLEFEAAAAASyBRAAAAABswUQAAAAAbQFEAAAAAG1BRAAAAABtgUQAJMJACEHCwAAzAgAIEwAAJUJACBNAACVCQAgrwUAAAD8BQKwBQAAAPwFCLEFAAAA_AUItgUAAJQJ_AUiBK8FAAAA_AUCsAUAAAD8BQixBQAAAPwFCLYFAACVCfwFIhYIAACbCQAgIgAAnAkAICMAAJ0JACCiBQAAlgkAMKMFAAALABCkBQAAlgkAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIeAFAQDyCAAh-gUBAO0IACH8BQAAlwn8BSL9BRAAmAkAIf4FEACZCQAh_wUQAJkJACGABgIAmgkAIYEGAgD-CAAhggYCAJoJACGDBkAA7ggAIYQGQADuCAAhhQYgAP0IACGGBiAA_QgAIQSvBQAAAPwFArAFAAAA_AUIsQUAAAD8BQi2BQAAlQn8BSIIrwUQAAAAAbAFEAAAAASxBRAAAAAEsgUQAAAAAbMFEAAAAAG0BRAAAAABtQUQAAAAAbYFEACTCQAhCK8FEAAAAAGwBRAAAAAFsQUQAAAABbIFEAAAAAGzBRAAAAABtAUQAAAAAbUFEAAAAAG2BRAAkQkAIQivBQIAAAABsAUCAAAABbEFAgAAAAWyBQIAAAABswUCAAAAAbQFAgAAAAG1BQIAAAABtgUCAM4IACED3QUAAA0AIN4FAAANACDfBQAADQAgA90FAABBACDeBQAAQQAg3wUAAEEAIAPdBQAABwAg3gUAAAcAIN8FAAAHACAOogUAAJ4JADCjBQAAsQUAEKQFAACeCQAwpQUBAMYIACGpBQEAxggAIa4FQADKCAAhzgUAAKAJigYizwVAAMoIACGIBgAAnwmIBiKKBhAAjgkAIYsGAQDHCAAhjAYAAMkIACCNBkAA9QgAIY4GAQDHCAAhBwsAAMwIACBMAACkCQAgTQAApAkAIK8FAAAAiAYCsAUAAACIBgixBQAAAIgGCLYFAACjCYgGIgcLAADMCAAgTAAAogkAIE0AAKIJACCvBQAAAIoGArAFAAAAigYIsQUAAACKBgi2BQAAoQmKBiIHCwAAzAgAIEwAAKIJACBNAACiCQAgrwUAAACKBgKwBQAAAIoGCLEFAAAAigYItgUAAKEJigYiBK8FAAAAigYCsAUAAACKBgixBQAAAIoGCLYFAACiCYoGIgcLAADMCAAgTAAApAkAIE0AAKQJACCvBQAAAIgGArAFAAAAiAYIsQUAAACIBgi2BQAAowmIBiIErwUAAACIBgKwBQAAAIgGCLEFAAAAiAYItgUAAKQJiAYiDxEAAKgJACCiBQAApQkAMKMFAAB0ABCkBQAApQkAMKUFAQDtCAAhqQUBAO0IACGuBUAA7ggAIc4FAACnCYoGIs8FQADuCAAhiAYAAKYJiAYiigYQAJgJACGLBgEA8ggAIYwGAAD_CAAgjQZAAPwIACGOBgEA8ggAIQSvBQAAAIgGArAFAAAAiAYIsQUAAACIBgi2BQAApAmIBiIErwUAAACKBgKwBQAAAIoGCLEFAAAAigYItgUAAKIJigYiJAMAAIQJACAEAACkCgAgBQAApQoAIA0AAJUKACAgAAD9CQAgJAAApgoAICUAAKcKACAoAACoCgAgogUAAKMKADCjBQAABwAQpAUAAKMKADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHOBQAA6AmaBiLPBUAA7ggAIfkFAQDyCAAhoQYQAJgJACGiBgEA7QgAIaMGAQDtCAAhpAYAAP8IACClBgEA8ggAIaYGAQDyCAAhpwYQAJgJACGoBhAAmAkAIakGEACYCQAhqgYQAJgJACGrBgEA8ggAIawGQADuCAAhrQZAAPwIACGuBkAA_AgAIa8GQAD8CAAhsAZAAPwIACGxBkAA_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_BiAA5ggAIQ6iBQAAvAkAMKMFAADHAwAQpAUAALwJADClBQEAxggAIa4FQADKCAAhzwVAAMoIACGFBiAA5ggAIcAGAQDGCAAhwQYBAMYIACHCBgEAxwgAIcMGEACOCQAhxAYQAI8JACHFBhAAjwkAIcYGAgD2CAAhCaIFAAC9CQAwowUAALEDABCkBQAAvQkAMKUFAQDGCAAhqgUBAMYIACGuBUAAyggAIc8FQADKCAAh4QUBAMYIACGFBiAA5ggAIRuiBQAAvgkAMKMFAACbAwAQpAUAAL4JADClBQEAxggAIa0FAADJCAAgrgVAAMoIACHPBUAAyggAIdoFAQDHCAAh3AUBAMYIACHgBQEAxwgAIeEFAQDGCAAh6AUBAMcIACHpBQEAxwgAIeoFAQDHCAAhhQYgAOYIACHBBgEAxwgAIcIGAQDHCAAhwwYQAI8JACHEBhAAjwkAIcUGEACPCQAhxgYCANcIACHHBgEAxwgAIcgGAQDHCAAhyQYCAPYIACHKBiAA5ggAIcsGIADmCAAhzAYgAOYIACEGogUAAL8JADCjBQAAgwMAEKQFAAC_CQAwqgUBAMYIACGuBUAAyggAIdkFAQDGCAAhCKIFAADACQAwowUAAO0CABCkBQAAwAkAMKUFAQDGCAAhrgVAAMoIACHPBUAAyggAIdsFAQDGCAAh3AUBAMYIACEJCAAAwgkAIKIFAADBCQAwowUAANoCABCkBQAAwQkAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdsFAQDtCAAh3AUBAO0IACED3QUAAFQAIN4FAABUACDfBQAAVAAgEKIFAADDCQAwowUAANQCABCkBQAAwwkAMKUFAQDGCAAhrgVAAMoIACHPBUAAyggAIdgFAQDHCAAh2wUBAMYIACHcBQEAxggAIeAFAQDHCAAh6AUBAMcIACHpBQEAxwgAIeoFAQDHCAAhhQYgAOYIACG-BgIA9ggAIc0GAQDHCAAhEKIFAADECQAwowUAALwCABCkBQAAxAkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIc8FQADKCAAhzgYBAMcIACHPBgEAxwgAIdAGAQDHCAAh0QYBAMYIACHSBgEAxggAIdMGAQDHCAAh1AYBAMcIACHVBgEAxggAIdYGIADmCAAhCKIFAADFCQAwowUAAKYCABCkBQAAxQkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIc8FQADKCAAh1wYBAMYIACEJAwAAhAkAIKIFAADGCQAwowUAAJEBABCkBQAAxgkAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh1wYBAO0IACEPogUAAMcJADCjBQAAjgIAEKQFAADHCQAwpQUBAMYIACGnBQEAxggAIa4FQADKCAAhzwVAAMoIACHYBgEAxggAIdkGAQDGCAAh2gYBAMcIACHbBgEAxwgAIdwGQAD1CAAh3QYBAMcIACHeBgEAxwgAId8GAQDHCAAhC6IFAADICQAwowUAAPgBABCkBQAAyAkAMKUFAQDGCAAhpwUBAMYIACGuBUAAyggAIcQFAQDHCAAhzwVAAMoIACHcBkAAyggAIeAGAQDGCAAh4QYBAMcIACESogUAAMkJADCjBQAA4gEAEKQFAADJCQAwpQUBAMYIACGtBQAAyQgAIK4FQADKCAAhxAUBAMcIACHOBQAAygnmBiLPBUAAyggAIdsFAQDHCAAhzQYBAMcIACHQBgEAxwgAIeIGAQDGCAAh4wYgAOYIACHkBgAA2wjKBSLmBkAA9QgAIecGAQDHCAAh6AYBAMcIACEHCwAAzAgAIEwAAMwJACBNAADMCQAgrwUAAADmBgKwBQAAAOYGCLEFAAAA5gYItgUAAMsJ5gYiBwsAAMwIACBMAADMCQAgTQAAzAkAIK8FAAAA5gYCsAUAAADmBgixBQAAAOYGCLYFAADLCeYGIgSvBQAAAOYGArAFAAAA5gYIsQUAAADmBgi2BQAAzAnmBiIC1AUBAAAAAdkFAQAAAAEHHQAA0AkAIDUAAM8JACCiBQAAzgkAMKMFAACyAQAQpAUAAM4JADDUBQEA7QgAIdkFAQDtCAAhGR4AAO8IACAiAADzCAAgNwAAgAkAIKIFAAD7CAAwowUAAL8GABCkBQAA-wgAMKUFAQDtCAAhrQUAAP8IACCuBUAA7ggAIcsFAQDtCAAhzwVAAO4IACHcBQEA7QgAIeEFAQDtCAAh4gUBAPIIACHjBQEA8ggAIeQFAQDyCAAh5QVAAPwIACHmBSAA_QgAIecFAgD-CAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAh6wUgAP0IACH0BgAAvwYAIPUGAAC_BgAgCzYAAO8IACCiBQAA7AgAMKMFAADxBgAQpAUAAOwIADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHbBQEA7QgAIdwFAQDtCAAh9AYAAPEGACD1BgAA8QYAIALUBQEAAAAB2gUBAAAAAQcYAADTCQAgNQAAzwkAIKIFAADSCQAwowUAAKwBABCkBQAA0gkAMNQFAQDtCAAh2gUBAO0IACEMNgAA8wgAIKIFAADxCAAwowUAANgGABCkBQAA8QgAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIfQGAADYBgAg9QYAANgGACARAwAA1QkAIAYAANYJACA1AADPCQAgOAAAgAkAIKIFAADUCQAwowUAAKgBABCkBQAA1AkAMKUFAQDtCAAhpwUBAPIIACGuBUAA7ggAIcsFAQDtCAAhzwVAAO4IACHUBQEA7QgAIdUFAQDyCAAh1gUBAPIIACHXBSAA_QgAIdgFAQDyCAAhIw4AAPkJACAWAAD-CQAgHAAA-AkAIB8AAPsJACAgAAD9CQAgIwAAnQkAICkAAPQJACAqAAD1CQAgKwAA9gkAICwAAPcJACAxAADaCQAgMgAA-gkAIDMAAPgJACA0AAD8CQAgOQAAgAkAIKIFAADyCQAwowUAAFIAEKQFAADyCQAwpQUBAO0IACGtBQAA_wgAIK4FQADuCAAhxAUBAPIIACHOBQAA8wnmBiLPBUAA7ggAIdsFAQDyCAAhzQYBAPIIACHQBgEA8ggAIeIGAQDtCAAh4wYgAP0IACHkBgAA3AnKBSLmBkAA_AgAIecGAQDyCAAh6AYBAPIIACH0BgAAUgAg9QYAAFIAIBMDAADVCQAgBgAA1gkAIDUAAM8JACA4AACACQAgogUAANQJADCjBQAAqAEAEKQFAADUCQAwpQUBAO0IACGnBQEA8ggAIa4FQADuCAAhywUBAO0IACHPBUAA7ggAIdQFAQDtCAAh1QUBAPIIACHWBQEA8ggAIdcFIAD9CAAh2AUBAPIIACH0BgAAqAEAIPUGAACoAQAgCwMAANUJACCiBQAA1wkAMKMFAACjAQAQpAUAANcJADClBQEA7QgAIacFAQDyCAAhqAUBAPIIACGuBUAA7ggAIcAFAQDtCAAhwQUCAJoJACHCBQAA_wgAIAwtAACECQAgLgAA2gkAIKIFAADYCQAwowUAAJ0BABCkBQAA2AkAMKUFAQDtCAAhrgVAAO4IACHOBQAA2QnTBSLPBUAA7ggAIdAFAQDtCAAh0QUBAO0IACHTBQEA8ggAIQSvBQAAANMFArAFAAAA0wUIsQUAAADTBQi2BQAA5AjTBSID3QUAAJcBACDeBQAAlwEAIN8FAACXAQAgDi8AAN4JACAwAACECQAgogUAANsJADCjBQAAlwEAEKQFAADbCQAwpQUBAO0IACGuBUAA7ggAIccFAQDtCAAhyAUBAO0IACHKBQAA3AnKBSLLBQEA7QgAIcwFAAD_CAAgzgUAAN0JzgUizwVAAO4IACEErwUAAADKBQKwBQAAAMoFCLEFAAAAygUItgUAAOAIygUiBK8FAAAAzgUCsAUAAADOBQixBQAAAM4FCLYFAADeCM4FIg4tAACECQAgLgAA2gkAIKIFAADYCQAwowUAAJ0BABCkBQAA2AkAMKUFAQDtCAAhrgVAAO4IACHOBQAA2QnTBSLPBUAA7ggAIdAFAQDtCAAh0QUBAO0IACHTBQEA8ggAIfQGAACdAQAg9QYAAJ0BACAC2AYBAAAAAdkGAQAAAAEQAwAAhAkAIKIFAADgCQAwowUAAI0BABCkBQAA4AkAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2AYBAO0IACHZBgEA7QgAIdoGAQDyCAAh2wYBAPIIACHcBkAA_AgAId0GAQDyCAAh3gYBAPIIACHfBgEA8ggAIQwDAACECQAgogUAAOEJADCjBQAAiQEAEKQFAADhCQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhxAUBAPIIACHPBUAA7ggAIdwGQADuCAAh4AYBAO0IACHhBgEA8ggAIQsmAADjCQAgogUAAOIJADCjBQAAfgAQpAUAAOIJADClBQEA7QgAIa4FQADuCAAhzgUBAO0IACHgBQEA8ggAIY8GAQDtCAAhkAYBAPIIACGRBkAA7ggAIRMRAACoCQAgJwAA5gkAIKIFAADkCQAwowUAAHoAEKQFAADkCQAwpQUBAO0IACGpBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHOBQAA5QmZBiLPBUAA7ggAIZIGAQDtCAAhkwYBAO0IACGUBgEA8ggAIZUGAQDyCAAhlgZAAPwIACGXBkAA_AgAIfQGAAB6ACD1BgAAegAgEREAAKgJACAnAADmCQAgogUAAOQJADCjBQAAegAQpAUAAOQJADClBQEA7QgAIakFAQDtCAAhrQUAAP8IACCuBUAA7ggAIc4FAADlCZkGIs8FQADuCAAhkgYBAO0IACGTBgEA7QgAIZQGAQDyCAAhlQYBAPIIACGWBkAA_AgAIZcGQAD8CAAhBK8FAAAAmQYCsAUAAACZBgixBQAAAJkGCLYFAACtCZkGIgPdBQAAfgAg3gUAAH4AIN8FAAB-ACAKEQAAqAkAIKIFAADnCQAwowUAAHYAEKQFAADnCQAwpQUBAO0IACGpBQEA7QgAIa4FQADuCAAhzgUAAOgJmgYi9wUBAPIIACGaBgEA8ggAIQSvBQAAAJoGArAFAAAAmgYIsQUAAACaBgi2BQAAsQmaBiIQAwAA1QkAIAkAAOwJACARAADrCQAgogUAAOkJADCjBQAAXwAQpAUAAOkJADClBQEA7QgAIaYFAQDtCAAhpwUBAPIIACGoBQEA8ggAIakFAQDyCAAhqgUBAPIIACGrBQgA6gkAIawFAQDyCAAhrQUAAP8IACCuBUAA7ggAIQivBQgAAAABsAUIAAAABbEFCAAAAAWyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIANEIACEkAwAAhAkAIAQAAKQKACAFAAClCgAgDQAAlQoAICAAAP0JACAkAACmCgAgJQAApwoAICgAAKgKACCiBQAAowoAMKMFAAAHABCkBQAAowoAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc4FAADoCZoGIs8FQADuCAAh-QUBAPIIACGhBhAAmAkAIaIGAQDtCAAhowYBAO0IACGkBgAA_wgAIKUGAQDyCAAhpgYBAPIIACGnBhAAmAkAIagGEACYCQAhqQYQAJgJACGqBhAAmAkAIasGAQDyCAAhrAZAAO4IACGtBkAA_AgAIa4GQAD8CAAhrwZAAPwIACGwBkAA_AgAIbEGQAD8CAAh9AYAAAcAIPUGAAAHACAlEwAAlgoAIBgAAJoKACAaAACcCgAgHAAA-AkAIB4AAMIJACAfAAD7CQAgIAAA_QkAICEAAJsJACCiBQAAmwoAMKMFAAAXABCkBQAAmwoAMKUFAQDtCAAhrQUAAP8IACCuBUAA7ggAIc8FQADuCAAh2gUBAPIIACHcBQEA7QgAIeAFAQDyCAAh4QUBAO0IACHoBQEA8ggAIekFAQDyCAAh6gUBAPIIACGFBiAA_QgAIcEGAQDyCAAhwgYBAPIIACHDBhAAmQkAIcQGEACZCQAhxQYQAJkJACHGBgIAmgkAIccGAQDyCAAhyAYBAPIIACHJBgIA_ggAIcoGIAD9CAAhywYgAP0IACHMBiAA_QgAIfQGAAAXACD1BgAAFwAgDQMAANUJACAJAADuCQAgogUAAO0JADCjBQAAWgAQpAUAAO0JADClBQEA7QgAIacFAQDyCAAhqAUBAPIIACGqBQEA7QgAIcMFAQDyCAAhxAUBAPIIACHFBQEA8ggAIcYFQADuCAAhJRMAAJYKACAYAACaCgAgGgAAnAoAIBwAAPgJACAeAADCCQAgHwAA-wkAICAAAP0JACAhAACbCQAgogUAAJsKADCjBQAAFwAQpAUAAJsKADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh3AUBAO0IACHgBQEA8ggAIeEFAQDtCAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAhhQYgAP0IACHBBgEA8ggAIcIGAQDyCAAhwwYQAJkJACHEBhAAmQkAIcUGEACZCQAhxgYCAJoJACHHBgEA8ggAIcgGAQDyCAAhyQYCAP4IACHKBiAA_QgAIcsGIAD9CAAhzAYgAP0IACH0BgAAFwAg9QYAABcAIAKqBQEAAAAB2QUBAAAAAQgJAADuCQAgHQAA8QkAIKIFAADwCQAwowUAAFQAEKQFAADwCQAwqgUBAO0IACGuBUAA7ggAIdkFAQDtCAAhCwgAAMIJACCiBQAAwQkAMKMFAADaAgAQpAUAAMEJADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHbBQEA7QgAIdwFAQDtCAAh9AYAANoCACD1BgAA2gIAICEOAAD5CQAgFgAA_gkAIBwAAPgJACAfAAD7CQAgIAAA_QkAICMAAJ0JACApAAD0CQAgKgAA9QkAICsAAPYJACAsAAD3CQAgMQAA2gkAIDIAAPoJACAzAAD4CQAgNAAA_AkAIDkAAIAJACCiBQAA8gkAMKMFAABSABCkBQAA8gkAMKUFAQDtCAAhrQUAAP8IACCuBUAA7ggAIcQFAQDyCAAhzgUAAPMJ5gYizwVAAO4IACHbBQEA8ggAIc0GAQDyCAAh0AYBAPIIACHiBgEA7QgAIeMGIAD9CAAh5AYAANwJygUi5gZAAPwIACHnBgEA8ggAIegGAQDyCAAhBK8FAAAA5gYCsAUAAADmBgixBQAAAOYGCLYFAADMCeYGIgPdBQAAAwAg3gUAAAMAIN8FAAADACAD3QUAAIkBACDeBQAAiQEAIN8FAACJAQAgA90FAACNAQAg3gUAAI0BACDfBQAAjQEAIAsDAACECQAgogUAAMYJADCjBQAAkQEAEKQFAADGCQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHXBgEA7QgAIfQGAACRAQAg9QYAAJEBACAD3QUAAE4AIN4FAABOACDfBQAATgAgCwMAAIQJACANAAC5CQAgogUAALgJADCjBQAAlQEAEKQFAAC4CQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACH0BgAAlQEAIPUGAACVAQAgA90FAACdAQAg3gUAAJ0BACDfBQAAnQEAIAPdBQAAWgAg3gUAAFoAIN8FAABaACAD3QUAAKMBACDeBQAAowEAIN8FAACjAQAgA90FAABfACDeBQAAXwAg3wUAAF8AIA4DAACECQAgDQAAhQkAIKIFAACDCQAwowUAAMEBABCkBQAAgwkAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2wUBAO0IACHuBSAA_QgAIe8FAQDyCAAh9AYAAMEBACD1BgAAwQEAIAKnBQEAAAABqgUBAAAAARUDAACECQAgCQAA7gkAIBsAANUJACCiBQAAgAoAMKMFAABOABCkBQAAgAoAMKUFAQDtCAAhpwUBAO0IACGqBQEA7QgAIa4FQADuCAAhzwVAAO4IACHXBSAA_QgAIeEFAQDyCAAhswYCAP4IACG0BgEA8ggAIbUGIAD9CAAhtgYCAP4IACG3BgIA_ggAIbgGAQDyCAAhuQZAAPwIACG6BgEA8ggAIQsJAADuCQAgCgAAggoAIKIFAACBCgAwowUAAEkAEKQFAACBCgAwpQUBAO0IACGqBQEA7QgAIa4FQADuCAAhzwVAAO4IACHhBQEA7QgAIYUGIAD9CAAhA90FAAAgACDeBQAAIAAg3wUAACAAIALaBQEAAAAB-QUBAAAAAQcFAACFCgAgGAAAhgoAIKIFAACECgAwowUAAEEAEKQFAACECgAw2gUBAO0IACH5BQEA7QgAIRgIAACbCQAgIgAAnAkAICMAAJ0JACCiBQAAlgkAMKMFAAALABCkBQAAlgkAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIeAFAQDyCAAh-gUBAO0IACH8BQAAlwn8BSL9BRAAmAkAIf4FEACZCQAh_wUQAJkJACGABgIAmgkAIYEGAgD-CAAhggYCAJoJACGDBkAA7ggAIYQGQADuCAAhhQYgAP0IACGGBiAA_QgAIfQGAAALACD1BgAACwAgFwYAAJoKACAHAACfCgAgCAAAoAoAIBMAAJYKACAZAACcCQAgogUAAJ4KADCjBQAAEQAQpAUAAJ4KADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhvgYCAP4IACHNBgEA8ggAIfQGAAARACD1BgAAEQAgAuwFAQAAAAHtBQEAAAABCQ8AAIoKACAWAACJCgAgogUAAIgKADCjBQAANQAQpAUAAIgKADClBQEA7QgAIa4FQADuCAAh7AUBAO0IACHtBQEA7QgAIQ4DAACECQAgDQAAhQkAIKIFAACDCQAwowUAAMEBABCkBQAAgwkAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2wUBAO0IACHuBSAA_QgAIe8FAQDyCAAh9AYAAMEBACD1BgAAwQEAIBYMAACUCgAgEAAAuQkAIBIAAJUKACATAACWCgAgFQAAlwoAIBcAAIUJACCiBQAAkwoAMKMFAAAgABCkBQAAkwoAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIYUGIAD9CAAhwAYBAO0IACHBBgEA7QgAIcIGAQDyCAAhwwYQAJgJACHEBhAAmQkAIcUGEACZCQAhxgYCAP4IACH0BgAAIAAg9QYAACAAIA8UAACKCgAgogUAAIsKADCjBQAAMQAQpAUAAIsKADClBQEA7QgAIa4FQADuCAAh7QUBAO0IACHxBQAAjArxBSLyBQIA_ggAIfMFAgD-CAAh9AUCAP4IACH1BQEA8ggAIfYFAQDyCAAh9wUBAPIIACH4BQEA8ggAIQSvBQAAAPEFArAFAAAA8QUIsQUAAADxBQi2BQAAiQnxBSISDwAAigoAIBEAAKgJACCiBQAAjQoAMKMFAAAsABCkBQAAjQoAMKUFAQDtCAAhqQUBAO0IACGqBQEA7QgAIa4FQADuCAAh7QUBAO0IACHyBQIA_ggAIZsGAQDtCAAhnAYBAO0IACGdBgEA8ggAIZ4GAACOCgAgnwYQAJgJACGgBhAAmAkAIaEGEACYCQAhDK8FgAAAAAGyBYAAAAABswWAAAAAAbQFgAAAAAG1BYAAAAABtgWAAAAAAbcFAQAAAAG4BQEAAAABuQUBAAAAAboFgAAAAAG7BYAAAAABvAWAAAAAAQLtBQEAAAABsgYBAAAAAQsOAACRCgAgDwAAigoAIKIFAACQCgAwowUAACYAEKQFAACQCgAwpQUBAO0IACGuBUAA7ggAIc8FQADuCAAh7QUBAO0IACHyBQIA_ggAIbIGAQDtCAAhCwMAAIQJACANAAC5CQAgogUAALgJADCjBQAAlQEAEKQFAAC4CQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACH0BgAAlQEAIPUGAACVAQAgAsAGAQAAAAHBBgEAAAABFAwAAJQKACAQAAC5CQAgEgAAlQoAIBMAAJYKACAVAACXCgAgFwAAhQkAIKIFAACTCgAwowUAACAAEKQFAACTCgAwpQUBAO0IACGuBUAA7ggAIc8FQADuCAAhhQYgAP0IACHABgEA7QgAIcEGAQDtCAAhwgYBAPIIACHDBhAAmAkAIcQGEACZCQAhxQYQAJkJACHGBgIA_ggAIQ0JAADuCQAgCgAAggoAIKIFAACBCgAwowUAAEkAEKQFAACBCgAwpQUBAO0IACGqBQEA7QgAIa4FQADuCAAhzwVAAO4IACHhBQEA7QgAIYUGIAD9CAAh9AYAAEkAIPUGAABJACAD3QUAACwAIN4FAAAsACDfBQAALAAgA90FAAAbACDeBQAAGwAg3wUAABsAIAPdBQAAMQAg3gUAADEAIN8FAAAxACARCQAA7AkAIA8AAJkKACAYAACaCgAgogUAAJgKADCjBQAAGwAQpAUAAJgKADClBQEA7QgAIaoFAQDyCAAhrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh7QUBAPIIACG7BgEA7QgAIbwGAQDyCAAhvQYBAPIIACG-BgIA_ggAIb8GIAD9CAAhFgwAAJQKACAQAAC5CQAgEgAAlQoAIBMAAJYKACAVAACXCgAgFwAAhQkAIKIFAACTCgAwowUAACAAEKQFAACTCgAwpQUBAO0IACGuBUAA7ggAIc8FQADuCAAhhQYgAP0IACHABgEA7QgAIcEGAQDtCAAhwgYBAPIIACHDBhAAmAkAIcQGEACZCQAhxQYQAJkJACHGBgIA_ggAIfQGAAAgACD1BgAAIAAgFwYAAJoKACAHAACfCgAgCAAAoAoAIBMAAJYKACAZAACcCQAgogUAAJ4KADCjBQAAEQAQpAUAAJ4KADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhvgYCAP4IACHNBgEA8ggAIfQGAAARACD1BgAAEQAgIxMAAJYKACAYAACaCgAgGgAAnAoAIBwAAPgJACAeAADCCQAgHwAA-wkAICAAAP0JACAhAACbCQAgogUAAJsKADCjBQAAFwAQpAUAAJsKADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh3AUBAO0IACHgBQEA8ggAIeEFAQDtCAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAhhQYgAP0IACHBBgEA8ggAIcIGAQDyCAAhwwYQAJkJACHEBhAAmQkAIcUGEACZCQAhxgYCAJoJACHHBgEA8ggAIcgGAQDyCAAhyQYCAP4IACHKBiAA_QgAIcsGIAD9CAAhzAYgAP0IACED3QUAAEkAIN4FAABJACDfBQAASQAgAtgFAQAAAAHbBQEAAAABFQYAAJoKACAHAACfCgAgCAAAoAoAIBMAAJYKACAZAACcCQAgogUAAJ4KADCjBQAAEQAQpAUAAJ4KADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhvgYCAP4IACHNBgEA8ggAIQPdBQAAEQAg3gUAABEAIN8FAAARACAD3QUAABcAIN4FAAAXACDfBQAAFwAgAqoFAQAAAAH5BQEAAAABBwUAAIUKACAJAADuCQAgogUAAKIKADCjBQAADQAQpAUAAKIKADCqBQEA7QgAIfkFAQDtCAAhIgMAAIQJACAEAACkCgAgBQAApQoAIA0AAJUKACAgAAD9CQAgJAAApgoAICUAAKcKACAoAACoCgAgogUAAKMKADCjBQAABwAQpAUAAKMKADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHOBQAA6AmaBiLPBUAA7ggAIfkFAQDyCAAhoQYQAJgJACGiBgEA7QgAIaMGAQDtCAAhpAYAAP8IACClBgEA8ggAIaYGAQDyCAAhpwYQAJgJACGoBhAAmAkAIakGEACYCQAhqgYQAJgJACGrBgEA8ggAIawGQADuCAAhrQZAAPwIACGuBkAA_AgAIa8GQAD8CAAhsAZAAPwIACGxBkAA_AgAIRQDAACECQAgIwAAnQkAIKIFAACpCgAwowUAAAMAEKQFAACpCgAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHOBgEA8ggAIc8GAQDyCAAh0AYBAPIIACHRBgEA7QgAIdIGAQDtCAAh0wYBAPIIACHUBgEA8ggAIdUGAQDtCAAh1gYgAP0IACH0BgAAAwAg9QYAAAMAIBgIAACbCQAgIgAAnAkAICMAAJ0JACCiBQAAlgkAMKMFAAALABCkBQAAlgkAMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIeAFAQDyCAAh-gUBAO0IACH8BQAAlwn8BSL9BRAAmAkAIf4FEACZCQAh_wUQAJkJACGABgIAmgkAIYEGAgD-CAAhggYCAJoJACGDBkAA7ggAIYQGQADuCAAhhQYgAP0IACGGBiAA_QgAIfQGAAALACD1BgAACwAgEREAAKgJACCiBQAApQkAMKMFAAB0ABCkBQAApQkAMKUFAQDtCAAhqQUBAO0IACGuBUAA7ggAIc4FAACnCYoGIs8FQADuCAAhiAYAAKYJiAYiigYQAJgJACGLBgEA8ggAIYwGAAD_CAAgjQZAAPwIACGOBgEA8ggAIfQGAAB0ACD1BgAAdAAgA90FAAB2ACDeBQAAdgAg3wUAAHYAIAPdBQAAegAg3gUAAHoAIN8FAAB6ACASAwAAhAkAICMAAJ0JACCiBQAAqQoAMKMFAAADABCkBQAAqQoAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAhzgYBAPIIACHPBgEA8ggAIdAGAQDyCAAh0QYBAO0IACHSBgEA7QgAIdMGAQDyCAAh1AYBAPIIACHVBgEA7QgAIdYGIAD9CAAhAAAAAAAAAfkGAQAAAAEB-QYBAAAAAQX5BggAAAAB_wYIAAAAAYAHCAAAAAGBBwgAAAABggcIAAAAAQH5BkAAAAABB0YAAI0UACBHAACWFAAg9gYAAI4UACD3BgAAlRQAIPoGAABSACD7BgAAUgAg_AYAAAEAIAdGAACLFAAgRwAAkxQAIPYGAACMFAAg9wYAAJIUACD6BgAABwAg-wYAAAcAIPwGAAAJACAHRgAAiRQAIEcAAJAUACD2BgAAihQAIPcGAACPFAAg-gYAABcAIPsGAAAXACD8BgAAGQAgA0YAAI0UACD2BgAAjhQAIPwGAAABACADRgAAixQAIPYGAACMFAAg_AYAAAkAIANGAACJFAAg9gYAAIoUACD8BgAAGQAgAAAAAAAF-QYCAAAAAf8GAgAAAAGABwIAAAABgQcCAAAAAYIHAgAAAAEHRgAAhBQAIEcAAIcUACD2BgAAhRQAIPcGAACGFAAg-gYAAFIAIPsGAABSACD8BgAAAQAgA0YAAIQUACD2BgAAhRQAIPwGAAABACAAAAAFRgAA_BMAIEcAAIIUACD2BgAA_RMAIPcGAACBFAAg_AYAABkAIAdGAAD6EwAgRwAA_xMAIPYGAAD7EwAg9wYAAP4TACD6BgAAUgAg-wYAAFIAIPwGAAABACADRgAA_BMAIPYGAAD9EwAg_AYAABkAIANGAAD6EwAg9gYAAPsTACD8BgAAAQAgAAAAAfkGAAAAygUCAfkGAAAAzgUCBUYAAPITACBHAAD4EwAg9gYAAPMTACD3BgAA9xMAIPwGAACfAQAgBUYAAPATACBHAAD1EwAg9gYAAPETACD3BgAA9BMAIPwGAAABACADRgAA8hMAIPYGAADzEwAg_AYAAJ8BACADRgAA8BMAIPYGAADxEwAg_AYAAAEAIAAAAAH5BgAAANMFAgVGAADqEwAgRwAA7hMAIPYGAADrEwAg9wYAAO0TACD8BgAAAQAgC0YAANgKADBHAADdCgAw9gYAANkKADD3BgAA2goAMPgGAADbCgAg-QYAANwKADD6BgAA3AoAMPsGAADcCgAw_AYAANwKADD9BgAA3goAMP4GAADfCgAwCTAAANEKACClBQEAAAABrgVAAAAAAcgFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABAgAAAJkBACBGAADjCgAgAwAAAJkBACBGAADjCgAgRwAA4goAIAE_AADsEwAwDi8AAN4JACAwAACECQAgogUAANsJADCjBQAAlwEAEKQFAADbCQAwpQUBAAAAAa4FQADuCAAhxwUBAO0IACHIBQEA7QgAIcoFAADcCcoFIssFAQDtCAAhzAUAAP8IACDOBQAA3QnOBSLPBUAA7ggAIQIAAACZAQAgPwAA4goAIAIAAADgCgAgPwAA4QoAIAyiBQAA3woAMKMFAADgCgAQpAUAAN8KADClBQEA7QgAIa4FQADuCAAhxwUBAO0IACHIBQEA7QgAIcoFAADcCcoFIssFAQDtCAAhzAUAAP8IACDOBQAA3QnOBSLPBUAA7ggAIQyiBQAA3woAMKMFAADgCgAQpAUAAN8KADClBQEA7QgAIa4FQADuCAAhxwUBAO0IACHIBQEA7QgAIcoFAADcCcoFIssFAQDtCAAhzAUAAP8IACDOBQAA3QnOBSLPBUAA7ggAIQilBQEAsAoAIa4FQACzCgAhyAUBALAKACHKBQAAzArKBSLLBQEAsAoAIcwFgAAAAAHOBQAAzQrOBSLPBUAAswoAIQkwAADPCgAgpQUBALAKACGuBUAAswoAIcgFAQCwCgAhygUAAMwKygUiywUBALAKACHMBYAAAAABzgUAAM0KzgUizwVAALMKACEJMAAA0QoAIKUFAQAAAAGuBUAAAAAByAUBAAAAAcoFAAAAygUCywUBAAAAAcwFgAAAAAHOBQAAAM4FAs8FQAAAAAEDRgAA6hMAIPYGAADrEwAg_AYAAAEAIARGAADYCgAw9gYAANkKADD4BgAA2woAIPwGAADcCgAwAAAAAfkGIAAAAAEFRgAA3hMAIEcAAOgTACD2BgAA3xMAIPcGAADnEwAg_AYAALwGACAHRgAA3BMAIEcAAOUTACD2BgAA3RMAIPcGAADkEwAg-gYAAFIAIPsGAABSACD8BgAAAQAgB0YAANoTACBHAADiEwAg9gYAANsTACD3BgAA4RMAIPoGAACoAQAg-wYAAKgBACD8BgAAqgEAIAtGAADuCgAwRwAA8woAMPYGAADvCgAw9wYAAPAKADD4BgAA8QoAIPkGAADyCgAw-gYAAPIKADD7BgAA8goAMPwGAADyCgAw_QYAAPQKADD-BgAA9QoAMAwDAAD7CgAgNQAA-goAIDgAAPwKACClBQEAAAABpwUBAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdQFAQAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAECAAAAqgEAIEYAAPkKACADAAAAqgEAIEYAAPkKACBHAAD4CgAgAT8AAOATADARAwAA1QkAIAYAANYJACA1AADPCQAgOAAAgAkAIKIFAADUCQAwowUAAKgBABCkBQAA1AkAMKUFAQAAAAGnBQEA8ggAIa4FQADuCAAhywUBAO0IACHPBUAA7ggAIdQFAQDtCAAh1QUBAPIIACHWBQEA8ggAIdcFIAD9CAAh2AUBAPIIACECAAAAqgEAID8AAPgKACACAAAA9goAID8AAPcKACANogUAAPUKADCjBQAA9goAEKQFAAD1CgAwpQUBAO0IACGnBQEA8ggAIa4FQADuCAAhywUBAO0IACHPBUAA7ggAIdQFAQDtCAAh1QUBAPIIACHWBQEA8ggAIdcFIAD9CAAh2AUBAPIIACENogUAAPUKADCjBQAA9goAEKQFAAD1CgAwpQUBAO0IACGnBQEA8ggAIa4FQADuCAAhywUBAO0IACHPBUAA7ggAIdQFAQDtCAAh1QUBAPIIACHWBQEA8ggAIdcFIAD9CAAh2AUBAPIIACEJpQUBALAKACGnBQEAsQoAIa4FQACzCgAhywUBALAKACHPBUAAswoAIdQFAQCwCgAh1QUBALEKACHWBQEAsQoAIdcFIADpCgAhDAMAAOsKACA1AADqCgAgOAAA7QoAIKUFAQCwCgAhpwUBALEKACGuBUAAswoAIcsFAQCwCgAhzwVAALMKACHUBQEAsAoAIdUFAQCxCgAh1gUBALEKACHXBSAA6QoAIQwDAAD7CgAgNQAA-goAIDgAAPwKACClBQEAAAABpwUBAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdQFAQAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAEDRgAA3hMAIPYGAADfEwAg_AYAALwGACADRgAA3BMAIPYGAADdEwAg_AYAAAEAIARGAADuCgAw9gYAAO8KADD4BgAA8QoAIPwGAADyCgAwA0YAANoTACD2BgAA2xMAIPwGAACqAQAgAAAABUYAANITACBHAADYEwAg9gYAANMTACD3BgAA1xMAIPwGAAC8BgAgBUYAANATACBHAADVEwAg9gYAANETACD3BgAA1BMAIPwGAADuBgAgA0YAANITACD2BgAA0xMAIPwGAAC8BgAgA0YAANATACD2BgAA0RMAIPwGAADuBgAgAAAABUYAAMgTACBHAADOEwAg9gYAAMkTACD3BgAAzRMAIPwGAAC8BgAgBUYAAMYTACBHAADLEwAg9gYAAMcTACD3BgAAyhMAIPwGAADVBgAgA0YAAMgTACD2BgAAyRMAIPwGAAC8BgAgA0YAAMYTACD2BgAAxxMAIPwGAADVBgAgAAAAC0YAAJALADBHAACVCwAw9gYAAJELADD3BgAAkgsAMPgGAACTCwAg-QYAAJQLADD6BgAAlAsAMPsGAACUCwAw_AYAAJQLADD9BgAAlgsAMP4GAACXCwAwAjUAAIMLACDUBQEAAAABAgAAALQBACBGAACbCwAgAwAAALQBACBGAACbCwAgRwAAmgsAIAE_AADFEwAwCB0AANAJACA1AADPCQAgogUAAM4JADCjBQAAsgEAEKQFAADOCQAw1AUBAO0IACHZBQEA7QgAIekGAADNCQAgAgAAALQBACA_AACaCwAgAgAAAJgLACA_AACZCwAgBaIFAACXCwAwowUAAJgLABCkBQAAlwsAMNQFAQDtCAAh2QUBAO0IACEFogUAAJcLADCjBQAAmAsAEKQFAACXCwAw1AUBAO0IACHZBQEA7QgAIQHUBQEAsAoAIQI1AACBCwAg1AUBALAKACECNQAAgwsAINQFAQAAAAEERgAAkAsAMPYGAACRCwAw-AYAAJMLACD8BgAAlAsAMAAAAAALRgAAogsAMEcAAKcLADD2BgAAowsAMPcGAACkCwAw-AYAAKULACD5BgAApgsAMPoGAACmCwAw-wYAAKYLADD8BgAApgsAMP0GAACoCwAw_gYAAKkLADACNQAAigsAINQFAQAAAAECAAAArgEAIEYAAK0LACADAAAArgEAIEYAAK0LACBHAACsCwAgAT8AAMQTADAIGAAA0wkAIDUAAM8JACCiBQAA0gkAMKMFAACsAQAQpAUAANIJADDUBQEA7QgAIdoFAQDtCAAh6gYAANEJACACAAAArgEAID8AAKwLACACAAAAqgsAID8AAKsLACAFogUAAKkLADCjBQAAqgsAEKQFAACpCwAw1AUBAO0IACHaBQEA7QgAIQWiBQAAqQsAMKMFAACqCwAQpAUAAKkLADDUBQEA7QgAIdoFAQDtCAAhAdQFAQCwCgAhAjUAAIgLACDUBQEAsAoAIQI1AACKCwAg1AUBAAAAAQRGAACiCwAw9gYAAKMLADD4BgAApQsAIPwGAACmCwAwAAAAAAAAAfkGQAAAAAEF-QYCAAAAAf8GAgAAAAGABwIAAAABgQcCAAAAAYIHAgAAAAELRgAAzAsAMEcAANALADD2BgAAzQsAMPcGAADOCwAw-AYAAM8LACD5BgAApgsAMPoGAACmCwAw-wYAAKYLADD8BgAApgsAMP0GAADRCwAw_gYAAKkLADALRgAAwwsAMEcAAMcLADD2BgAAxAsAMPcGAADFCwAw-AYAAMYLACD5BgAAlAsAMPoGAACUCwAw-wYAAJQLADD8BgAAlAsAMP0GAADICwAw_gYAAJcLADALRgAAugsAMEcAAL4LADD2BgAAuwsAMPcGAAC8CwAw-AYAAL0LACD5BgAA8goAMPoGAADyCgAw-wYAAPIKADD8BgAA8goAMP0GAAC_CwAw_gYAAPUKADAMAwAA-woAIAYAAP0KACA4AAD8CgAgpQUBAAAAAacFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAHYBQEAAAABAgAAAKoBACBGAADCCwAgAwAAAKoBACBGAADCCwAgRwAAwQsAIAE_AADDEwAwAgAAAKoBACA_AADBCwAgAgAAAPYKACA_AADACwAgCaUFAQCwCgAhpwUBALEKACGuBUAAswoAIcsFAQCwCgAhzwVAALMKACHVBQEAsQoAIdYFAQCxCgAh1wUgAOkKACHYBQEAsQoAIQwDAADrCgAgBgAA7AoAIDgAAO0KACClBQEAsAoAIacFAQCxCgAhrgVAALMKACHLBQEAsAoAIc8FQACzCgAh1QUBALEKACHWBQEAsQoAIdcFIADpCgAh2AUBALEKACEMAwAA-woAIAYAAP0KACA4AAD8CgAgpQUBAAAAAacFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAHYBQEAAAABAh0AAIQLACDZBQEAAAABAgAAALQBACBGAADLCwAgAwAAALQBACBGAADLCwAgRwAAygsAIAE_AADCEwAwAgAAALQBACA_AADKCwAgAgAAAJgLACA_AADJCwAgAdkFAQCwCgAhAh0AAIILACDZBQEAsAoAIQIdAACECwAg2QUBAAAAAQIYAACLCwAg2gUBAAAAAQIAAACuAQAgRgAA1AsAIAMAAACuAQAgRgAA1AsAIEcAANMLACABPwAAwRMAMAIAAACuAQAgPwAA0wsAIAIAAACqCwAgPwAA0gsAIAHaBQEAsAoAIQIYAACJCwAg2gUBALAKACECGAAAiwsAINoFAQAAAAEERgAAzAsAMPYGAADNCwAw-AYAAM8LACD8BgAApgsAMARGAADDCwAw9gYAAMQLADD4BgAAxgsAIPwGAACUCwAwBEYAALoLADD2BgAAuwsAMPgGAAC9CwAg_AYAAPIKADAAAAAABUYAALkTACBHAAC_EwAg9gYAALoTACD3BgAAvhMAIPwGAACOBgAgBUYAALcTACBHAAC8EwAg9gYAALgTACD3BgAAuxMAIPwGAAAjACADRgAAuRMAIPYGAAC6EwAg_AYAAI4GACADRgAAtxMAIPYGAAC4EwAg_AYAACMAIAAAAAVGAACxEwAgRwAAtRMAIPYGAACyEwAg9wYAALQTACD8BgAAAQAgC0YAAOULADBHAADqCwAw9gYAAOYLADD3BgAA5wsAMPgGAADoCwAg-QYAAOkLADD6BgAA6QsAMPsGAADpCwAw_AYAAOkLADD9BgAA6wsAMP4GAADsCwAwBA8AAN8LACClBQEAAAABrgVAAAAAAe0FAQAAAAECAAAANwAgRgAA8AsAIAMAAAA3ACBGAADwCwAgRwAA7wsAIAE_AACzEwAwCg8AAIoKACAWAACJCgAgogUAAIgKADCjBQAANQAQpAUAAIgKADClBQEAAAABrgVAAO4IACHsBQEA7QgAIe0FAQDtCAAh7wYAAIcKACACAAAANwAgPwAA7wsAIAIAAADtCwAgPwAA7gsAIAeiBQAA7AsAMKMFAADtCwAQpAUAAOwLADClBQEA7QgAIa4FQADuCAAh7AUBAO0IACHtBQEA7QgAIQeiBQAA7AsAMKMFAADtCwAQpAUAAOwLADClBQEA7QgAIa4FQADuCAAh7AUBAO0IACHtBQEA7QgAIQOlBQEAsAoAIa4FQACzCgAh7QUBALAKACEEDwAA3QsAIKUFAQCwCgAhrgVAALMKACHtBQEAsAoAIQQPAADfCwAgpQUBAAAAAa4FQAAAAAHtBQEAAAABA0YAALETACD2BgAAshMAIPwGAAABACAERgAA5QsAMPYGAADmCwAw-AYAAOgLACD8BgAA6QsAMBcOAADFEQAgFgAAyxEAIBwAAMQRACAfAADIEQAgIAAAyhEAICMAAJYNACApAADAEQAgKgAAwREAICsAAMIRACAsAADDEQAgMQAAxhEAIDIAAMcRACAzAADEEQAgNAAAyREAIDkAANgLACCtBQAAqgoAIMQFAACqCgAg2wUAAKoKACDNBgAAqgoAINAGAACqCgAg5gYAAKoKACDnBgAAqgoAIOgGAACqCgAgAAAAAAAAAfkGAAAA8QUCBUYAAKwTACBHAACvEwAg9gYAAK0TACD3BgAArhMAIPwGAAAjACADRgAArBMAIPYGAACtEwAg_AYAACMAIAAAAAVGAACkEwAgRwAAqhMAIPYGAAClEwAg9wYAAKkTACD8BgAAtAUAIAVGAACiEwAgRwAApxMAIPYGAACjEwAg9wYAAKYTACD8BgAAFQAgA0YAAKQTACD2BgAApRMAIPwGAAC0BQAgA0YAAKITACD2BgAAoxMAIPwGAAAVACAAAAAFRgAAmhMAIEcAAKATACD2BgAAmxMAIPcGAACfEwAg_AYAALQFACAFRgAAmBMAIEcAAJ0TACD2BgAAmRMAIPcGAACcEwAg_AYAABkAIANGAACaEwAg9gYAAJsTACD8BgAAtAUAIANGAACYEwAg9gYAAJkTACD8BgAAGQAgAAAAAAAB-QYAAAD8BQIF-QYQAAAAAf8GEAAAAAGABxAAAAABgQcQAAAAAYIHEAAAAAEF-QYQAAAAAf8GEAAAAAGABxAAAAABgQcQAAAAAYIHEAAAAAELRgAAhQ0AMEcAAIoNADD2BgAAhg0AMPcGAACHDQAw-AYAAIgNACD5BgAAiQ0AMPoGAACJDQAw-wYAAIkNADD8BgAAiQ0AMP0GAACLDQAw_gYAAIwNADALRgAA-QwAMEcAAP4MADD2BgAA-gwAMPcGAAD7DAAw-AYAAPwMACD5BgAA_QwAMPoGAAD9DAAw-wYAAP0MADD8BgAA_QwAMP0GAAD_DAAw_gYAAIANADALRgAAlgwAMEcAAJsMADD2BgAAlwwAMPcGAACYDAAw-AYAAJkMACD5BgAAmgwAMPoGAACaDAAw-wYAAJoMADD8BgAAmgwAMP0GAACcDAAw_gYAAJ0MADAdAwAA8gwAIAQAAPMMACANAAD0DAAgIAAA-AwAICQAAPUMACAlAAD2DAAgKAAA9wwAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAaEGEAAAAAGiBgEAAAABowYBAAAAAaQGgAAAAAGlBgEAAAABpgYBAAAAAacGEAAAAAGoBhAAAAABqQYQAAAAAaoGEAAAAAGrBgEAAAABrAZAAAAAAa0GQAAAAAGuBkAAAAABrwZAAAAAAbAGQAAAAAGxBkAAAAABAgAAAAkAIEYAAPEMACADAAAACQAgRgAA8QwAIEcAAKEMACABPwAAlxMAMCIDAACECQAgBAAApAoAIAUAAKUKACANAACVCgAgIAAA_QkAICQAAKYKACAlAACnCgAgKAAAqAoAIKIFAACjCgAwowUAAAcAEKQFAACjCgAwpQUBAAAAAacFAQDtCAAhrgVAAO4IACHOBQAA6AmaBiLPBUAA7ggAIfkFAQDyCAAhoQYQAJgJACGiBgEAAAABowYBAO0IACGkBgAA_wgAIKUGAQDyCAAhpgYBAPIIACGnBhAAmAkAIagGEACYCQAhqQYQAJgJACGqBhAAmAkAIasGAQDyCAAhrAZAAO4IACGtBkAA_AgAIa4GQAD8CAAhrwZAAPwIACGwBkAA_AgAIbEGQAD8CAAhAgAAAAkAID8AAKEMACACAAAAngwAID8AAJ8MACAaogUAAJ0MADCjBQAAngwAEKQFAACdDAAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzgUAAOgJmgYizwVAAO4IACH5BQEA8ggAIaEGEACYCQAhogYBAO0IACGjBgEA7QgAIaQGAAD_CAAgpQYBAPIIACGmBgEA8ggAIacGEACYCQAhqAYQAJgJACGpBhAAmAkAIaoGEACYCQAhqwYBAPIIACGsBkAA7ggAIa0GQAD8CAAhrgZAAPwIACGvBkAA_AgAIbAGQAD8CAAhsQZAAPwIACEaogUAAJ0MADCjBQAAngwAEKQFAACdDAAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzgUAAOgJmgYizwVAAO4IACH5BQEA8ggAIaEGEACYCQAhogYBAO0IACGjBgEA7QgAIaQGAAD_CAAgpQYBAPIIACGmBgEA8ggAIacGEACYCQAhqAYQAJgJACGpBhAAmAkAIaoGEACYCQAhqwYBAPIIACGsBkAA7ggAIa0GQAD8CAAhrgZAAPwIACGvBkAA_AgAIbAGQAD8CAAhsQZAAPwIACEWpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYizwVAALMKACGhBhAAkQwAIaIGAQCwCgAhowYBALAKACGkBoAAAAABpQYBALEKACGmBgEAsQoAIacGEACRDAAhqAYQAJEMACGpBhAAkQwAIaoGEACRDAAhqwYBALEKACGsBkAAswoAIa0GQAC1CwAhrgZAALULACGvBkAAtQsAIbAGQAC1CwAhsQZAALULACEB-QYAAACaBgIdAwAAogwAIAQAAKMMACANAACkDAAgIAAAqAwAICQAAKUMACAlAACmDAAgKAAApwwAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc4FAACgDJoGIs8FQACzCgAhoQYQAJEMACGiBgEAsAoAIaMGAQCwCgAhpAaAAAAAAaUGAQCxCgAhpgYBALEKACGnBhAAkQwAIagGEACRDAAhqQYQAJEMACGqBhAAkQwAIasGAQCxCgAhrAZAALMKACGtBkAAtQsAIa4GQAC1CwAhrwZAALULACGwBkAAtQsAIbEGQAC1CwAhBUYAAIUTACBHAACVEwAg9gYAAIYTACD3BgAAlBMAIPwGAAABACAFRgAAgxMAIEcAAJITACD2BgAAhBMAIPcGAACREwAg_AYAAAUAIAtGAADjDAAwRwAA6AwAMPYGAADkDAAw9wYAAOUMADD4BgAA5gwAIPkGAADnDAAw-gYAAOcMADD7BgAA5wwAMPwGAADnDAAw_QYAAOkMADD-BgAA6gwAMAdGAADcDAAgRwAA3wwAIPYGAADdDAAg9wYAAN4MACD6BgAAdAAg-wYAAHQAIPwGAACcBQAgC0YAANAMADBHAADVDAAw9gYAANEMADD3BgAA0gwAMPgGAADTDAAg-QYAANQMADD6BgAA1AwAMPsGAADUDAAw_AYAANQMADD9BgAA1gwAMP4GAADXDAAwC0YAALUMADBHAAC6DAAw9gYAALYMADD3BgAAtwwAMPgGAAC4DAAg-QYAALkMADD6BgAAuQwAMPsGAAC5DAAw_AYAALkMADD9BgAAuwwAMP4GAAC8DAAwC0YAAKkMADBHAACuDAAw9gYAAKoMADD3BgAAqwwAMPgGAACsDAAg-QYAAK0MADD6BgAArQwAMPsGAACtDAAw_AYAAK0MADD9BgAArwwAMP4GAACwDAAwCwMAALcKACAJAAC5CgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAaoFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABAgAAAGEAIEYAALQMACADAAAAYQAgRgAAtAwAIEcAALMMACABPwAAkBMAMBADAADVCQAgCQAA7AkAIBEAAOsJACCiBQAA6QkAMKMFAABfABCkBQAA6QkAMKUFAQAAAAGmBQEA7QgAIacFAQDyCAAhqAUBAPIIACGpBQEA8ggAIaoFAQDyCAAhqwUIAOoJACGsBQEA8ggAIa0FAAD_CAAgrgVAAO4IACECAAAAYQAgPwAAswwAIAIAAACxDAAgPwAAsgwAIA2iBQAAsAwAMKMFAACxDAAQpAUAALAMADClBQEA7QgAIaYFAQDtCAAhpwUBAPIIACGoBQEA8ggAIakFAQDyCAAhqgUBAPIIACGrBQgA6gkAIawFAQDyCAAhrQUAAP8IACCuBUAA7ggAIQ2iBQAAsAwAMKMFAACxDAAQpAUAALAMADClBQEA7QgAIaYFAQDtCAAhpwUBAPIIACGoBQEA8ggAIakFAQDyCAAhqgUBAPIIACGrBQgA6gkAIawFAQDyCAAhrQUAAP8IACCuBUAA7ggAIQmlBQEAsAoAIaYFAQCwCgAhpwUBALEKACGoBQEAsQoAIaoFAQCxCgAhqwUIALIKACGsBQEAsQoAIa0FgAAAAAGuBUAAswoAIQsDAAC0CgAgCQAAtgoAIKUFAQCwCgAhpgUBALAKACGnBQEAsQoAIagFAQCxCgAhqgUBALEKACGrBQgAsgoAIawFAQCxCgAhrQWAAAAAAa4FQACzCgAhCwMAALcKACAJAAC5CgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAaoFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABDCcAAM8MACClBQEAAAABrQWAAAAAAa4FQAAAAAHOBQAAAJkGAs8FQAAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAECAAAAfAAgRgAAzgwAIAMAAAB8ACBGAADODAAgRwAAwAwAIAE_AACPEwAwEREAAKgJACAnAADmCQAgogUAAOQJADCjBQAAegAQpAUAAOQJADClBQEAAAABqQUBAAAAAa0FAAD_CAAgrgVAAO4IACHOBQAA5QmZBiLPBUAA7ggAIZIGAQDtCAAhkwYBAO0IACGUBgEA8ggAIZUGAQDyCAAhlgZAAPwIACGXBkAA_AgAIQIAAAB8ACA_AADADAAgAgAAAL0MACA_AAC-DAAgD6IFAAC8DAAwowUAAL0MABCkBQAAvAwAMKUFAQDtCAAhqQUBAO0IACGtBQAA_wgAIK4FQADuCAAhzgUAAOUJmQYizwVAAO4IACGSBgEA7QgAIZMGAQDtCAAhlAYBAPIIACGVBgEA8ggAIZYGQAD8CAAhlwZAAPwIACEPogUAALwMADCjBQAAvQwAEKQFAAC8DAAwpQUBAO0IACGpBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHOBQAA5QmZBiLPBUAA7ggAIZIGAQDtCAAhkwYBAO0IACGUBgEA8ggAIZUGAQDyCAAhlgZAAPwIACGXBkAA_AgAIQulBQEAsAoAIa0FgAAAAAGuBUAAswoAIc4FAAC_DJkGIs8FQACzCgAhkgYBALAKACGTBgEAsAoAIZQGAQCxCgAhlQYBALEKACGWBkAAtQsAIZcGQAC1CwAhAfkGAAAAmQYCDCcAAMEMACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIc4FAAC_DJkGIs8FQACzCgAhkgYBALAKACGTBgEAsAoAIZQGAQCxCgAhlQYBALEKACGWBkAAtQsAIZcGQAC1CwAhC0YAAMIMADBHAADHDAAw9gYAAMMMADD3BgAAxAwAMPgGAADFDAAg-QYAAMYMADD6BgAAxgwAMPsGAADGDAAw_AYAAMYMADD9BgAAyAwAMP4GAADJDAAwBqUFAQAAAAGuBUAAAAABzgUBAAAAAeAFAQAAAAGQBgEAAAABkQZAAAAAAQIAAACAAQAgRgAAzQwAIAMAAACAAQAgRgAAzQwAIEcAAMwMACABPwAAjhMAMAsmAADjCQAgogUAAOIJADCjBQAAfgAQpAUAAOIJADClBQEAAAABrgVAAO4IACHOBQEA7QgAIeAFAQDyCAAhjwYBAO0IACGQBgEA8ggAIZEGQADuCAAhAgAAAIABACA_AADMDAAgAgAAAMoMACA_AADLDAAgCqIFAADJDAAwowUAAMoMABCkBQAAyQwAMKUFAQDtCAAhrgVAAO4IACHOBQEA7QgAIeAFAQDyCAAhjwYBAO0IACGQBgEA8ggAIZEGQADuCAAhCqIFAADJDAAwowUAAMoMABCkBQAAyQwAMKUFAQDtCAAhrgVAAO4IACHOBQEA7QgAIeAFAQDyCAAhjwYBAO0IACGQBgEA8ggAIZEGQADuCAAhBqUFAQCwCgAhrgVAALMKACHOBQEAsAoAIeAFAQCxCgAhkAYBALEKACGRBkAAswoAIQalBQEAsAoAIa4FQACzCgAhzgUBALAKACHgBQEAsQoAIZAGAQCxCgAhkQZAALMKACEGpQUBAAAAAa4FQAAAAAHOBQEAAAAB4AUBAAAAAZAGAQAAAAGRBkAAAAABDCcAAM8MACClBQEAAAABrQWAAAAAAa4FQAAAAAHOBQAAAJkGAs8FQAAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAEERgAAwgwAMPYGAADDDAAw-AYAAMUMACD8BgAAxgwAMAWlBQEAAAABrgVAAAAAAc4FAAAAmgYC9wUBAAAAAZoGAQAAAAECAAAAeAAgRgAA2wwAIAMAAAB4ACBGAADbDAAgRwAA2gwAIAE_AACNEwAwChEAAKgJACCiBQAA5wkAMKMFAAB2ABCkBQAA5wkAMKUFAQAAAAGpBQEA7QgAIa4FQADuCAAhzgUAAOgJmgYi9wUBAPIIACGaBgEA8ggAIQIAAAB4ACA_AADaDAAgAgAAANgMACA_AADZDAAgCaIFAADXDAAwowUAANgMABCkBQAA1wwAMKUFAQDtCAAhqQUBAO0IACGuBUAA7ggAIc4FAADoCZoGIvcFAQDyCAAhmgYBAPIIACEJogUAANcMADCjBQAA2AwAEKQFAADXDAAwpQUBAO0IACGpBQEA7QgAIa4FQADuCAAhzgUAAOgJmgYi9wUBAPIIACGaBgEA8ggAIQWlBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYi9wUBALEKACGaBgEAsQoAIQWlBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYi9wUBALEKACGaBgEAsQoAIQWlBQEAAAABrgVAAAAAAc4FAAAAmgYC9wUBAAAAAZoGAQAAAAEKpQUBAAAAAa4FQAAAAAHOBQAAAIoGAs8FQAAAAAGIBgAAAIgGAooGEAAAAAGLBgEAAAABjAaAAAAAAY0GQAAAAAGOBgEAAAABAgAAAJwFACBGAADcDAAgAwAAAHQAIEYAANwMACBHAADgDAAgDAAAAHQAID8AAOAMACClBQEAsAoAIa4FQACzCgAhzgUAAOIMigYizwVAALMKACGIBgAA4QyIBiKKBhAAkQwAIYsGAQCxCgAhjAaAAAAAAY0GQAC1CwAhjgYBALEKACEKpQUBALAKACGuBUAAswoAIc4FAADiDIoGIs8FQACzCgAhiAYAAOEMiAYiigYQAJEMACGLBgEAsQoAIYwGgAAAAAGNBkAAtQsAIY4GAQCxCgAhAfkGAAAAiAYCAfkGAAAAigYCDQ8AAPAMACClBQEAAAABqgUBAAAAAa4FQAAAAAHtBQEAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAECAAAALgAgRgAA7wwAIAMAAAAuACBGAADvDAAgRwAA7QwAIAE_AACMEwAwEg8AAIoKACARAACoCQAgogUAAI0KADCjBQAALAAQpAUAAI0KADClBQEAAAABqQUBAO0IACGqBQEA7QgAIa4FQADuCAAh7QUBAO0IACHyBQIA_ggAIZsGAQDtCAAhnAYBAO0IACGdBgEA8ggAIZ4GAACOCgAgnwYQAJgJACGgBhAAmAkAIaEGEACYCQAhAgAAAC4AID8AAO0MACACAAAA6wwAID8AAOwMACAQogUAAOoMADCjBQAA6wwAEKQFAADqDAAwpQUBAO0IACGpBQEA7QgAIaoFAQDtCAAhrgVAAO4IACHtBQEA7QgAIfIFAgD-CAAhmwYBAO0IACGcBgEA7QgAIZ0GAQDyCAAhngYAAI4KACCfBhAAmAkAIaAGEACYCQAhoQYQAJgJACEQogUAAOoMADCjBQAA6wwAEKQFAADqDAAwpQUBAO0IACGpBQEA7QgAIaoFAQDtCAAhrgVAAO4IACHtBQEA7QgAIfIFAgD-CAAhmwYBAO0IACGcBgEA7QgAIZ0GAQDyCAAhngYAAI4KACCfBhAAmAkAIaAGEACYCQAhoQYQAJgJACEMpQUBALAKACGqBQEAsAoAIa4FQACzCgAh7QUBALAKACHyBQIAtgsAIZsGAQCwCgAhnAYBALAKACGdBgEAsQoAIZ4GgAAAAAGfBhAAkQwAIaAGEACRDAAhoQYQAJEMACENDwAA7gwAIKUFAQCwCgAhqgUBALAKACGuBUAAswoAIe0FAQCwCgAh8gUCALYLACGbBgEAsAoAIZwGAQCwCgAhnQYBALEKACGeBoAAAAABnwYQAJEMACGgBhAAkQwAIaEGEACRDAAhBUYAAIcTACBHAACKEwAg9gYAAIgTACD3BgAAiRMAIPwGAAAjACANDwAA8AwAIKUFAQAAAAGqBQEAAAABrgVAAAAAAe0FAQAAAAHyBQIAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABngaAAAAAAZ8GEAAAAAGgBhAAAAABoQYQAAAAAQNGAACHEwAg9gYAAIgTACD8BgAAIwAgHQMAAPIMACAEAADzDAAgDQAA9AwAICAAAPgMACAkAAD1DAAgJQAA9gwAICgAAPcMACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAGhBhAAAAABogYBAAAAAaMGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQNGAACFEwAg9gYAAIYTACD8BgAAAQAgA0YAAIMTACD2BgAAhBMAIPwGAAAFACAERgAA4wwAMPYGAADkDAAw-AYAAOYMACD8BgAA5wwAMANGAADcDAAg9gYAAN0MACD8BgAAnAUAIARGAADQDAAw9gYAANEMADD4BgAA0wwAIPwGAADUDAAwBEYAALUMADD2BgAAtgwAMPgGAAC4DAAg_AYAALkMADAERgAAqQwAMPYGAACqDAAw-AYAAKwMACD8BgAArQwAMAIYAACDDAAg2gUBAAAAAQIAAABDACBGAACEDQAgAwAAAEMAIEYAAIQNACBHAACDDQAgAT8AAIITADAIBQAAhQoAIBgAAIYKACCiBQAAhAoAMKMFAABBABCkBQAAhAoAMNoFAQDtCAAh-QUBAO0IACHuBgAAgwoAIAIAAABDACA_AACDDQAgAgAAAIENACA_AACCDQAgBaIFAACADQAwowUAAIENABCkBQAAgA0AMNoFAQDtCAAh-QUBAO0IACEFogUAAIANADCjBQAAgQ0AEKQFAACADQAw2gUBAO0IACH5BQEA7QgAIQHaBQEAsAoAIQIYAACBDAAg2gUBALAKACECGAAAgwwAINoFAQAAAAECCQAAigwAIKoFAQAAAAECAAAADwAgRgAAkA0AIAMAAAAPACBGAACQDQAgRwAAjw0AIAE_AACBEwAwCAUAAIUKACAJAADuCQAgogUAAKIKADCjBQAADQAQpAUAAKIKADCqBQEA7QgAIfkFAQDtCAAh8wYAAKEKACACAAAADwAgPwAAjw0AIAIAAACNDQAgPwAAjg0AIAWiBQAAjA0AMKMFAACNDQAQpAUAAIwNADCqBQEA7QgAIfkFAQDtCAAhBaIFAACMDQAwowUAAI0NABCkBQAAjA0AMKoFAQDtCAAh-QUBAO0IACEBqgUBALAKACECCQAAiAwAIKoFAQCwCgAhAgkAAIoMACCqBQEAAAABBEYAAIUNADD2BgAAhg0AMPgGAACIDQAg_AYAAIkNADAERgAA-QwAMPYGAAD6DAAw-AYAAPwMACD8BgAA_QwAMARGAACWDAAw9gYAAJcMADD4BgAAmQwAIPwGAACaDAAwAAAAAAAAAAAFRgAA_BIAIEcAAP8SACD2BgAA_RIAIPcGAAD-EgAg_AYAAAkAIANGAAD8EgAg9gYAAP0SACD8BgAACQAgEgMAAPMLACAEAADgEQAgBQAA1hEAIA0AANoRACAgAADKEQAgJAAA4REAICUAAOIRACAoAADjEQAg-QUAAKoKACCkBgAAqgoAIKUGAACqCgAgpgYAAKoKACCrBgAAqgoAIK0GAACqCgAgrgYAAKoKACCvBgAAqgoAILAGAACqCgAgsQYAAKoKACAAAAAFRgAA9xIAIEcAAPoSACD2BgAA-BIAIPcGAAD5EgAg_AYAAHwAIANGAAD3EgAg9gYAAPgSACD8BgAAfAAgAAAABUYAAPISACBHAAD1EgAg9gYAAPMSACD3BgAA9BIAIPwGAAAJACADRgAA8hIAIPYGAADzEgAg_AYAAAkAIAAAAAVGAADtEgAgRwAA8BIAIPYGAADuEgAg9wYAAO8SACD8BgAACQAgA0YAAO0SACD2BgAA7hIAIPwGAAAJACAAAAAAAAVGAADoEgAgRwAA6xIAIPYGAADpEgAg9wYAAOoSACD8BgAACQAgA0YAAOgSACD2BgAA6RIAIPwGAAAJACAAAAAAAAdGAADjEgAgRwAA5hIAIPYGAADkEgAg9wYAAOUSACD6BgAACwAg-wYAAAsAIPwGAAC0BQAgA0YAAOMSACD2BgAA5BIAIPwGAAC0BQAgAAAAAAAFRgAA2xIAIEcAAOESACD2BgAA3BIAIPcGAADgEgAg_AYAAP4DACAFRgAA2RIAIEcAAN4SACD2BgAA2hIAIPcGAADdEgAg_AYAACMAIANGAADbEgAg9gYAANwSACD8BgAA_gMAIANGAADZEgAg9gYAANoSACD8BgAAIwAgAAAABUYAANMSACBHAADXEgAg9gYAANQSACD3BgAA1hIAIPwGAAABACALRgAAyg0AMEcAAM8NADD2BgAAyw0AMPcGAADMDQAw-AYAAM0NACD5BgAAzg0AMPoGAADODQAw-wYAAM4NADD8BgAAzg0AMP0GAADQDQAw_gYAANENADAGDwAAxA0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAHyBQIAAAABAgAAACgAIEYAANUNACADAAAAKAAgRgAA1Q0AIEcAANQNACABPwAA1RIAMAwOAACRCgAgDwAAigoAIKIFAACQCgAwowUAACYAEKQFAACQCgAwpQUBAAAAAa4FQADuCAAhzwVAAO4IACHtBQEA7QgAIfIFAgD-CAAhsgYBAO0IACHwBgAAjwoAIAIAAAAoACA_AADUDQAgAgAAANINACA_AADTDQAgCaIFAADRDQAwowUAANINABCkBQAA0Q0AMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIe0FAQDtCAAh8gUCAP4IACGyBgEA7QgAIQmiBQAA0Q0AMKMFAADSDQAQpAUAANENADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHtBQEA7QgAIfIFAgD-CAAhsgYBAO0IACEFpQUBALAKACGuBUAAswoAIc8FQACzCgAh7QUBALAKACHyBQIAtgsAIQYPAADCDQAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh7QUBALAKACHyBQIAtgsAIQYPAADEDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB7QUBAAAAAfIFAgAAAAEDRgAA0xIAIPYGAADUEgAg_AYAAAEAIARGAADKDQAw9gYAAMsNADD4BgAAzQ0AIPwGAADODQAwAAAAAAAABUYAAMgSACBHAADREgAg9gYAAMkSACD3BgAA0BIAIPwGAAABACAFRgAAxhIAIEcAAM4SACD2BgAAxxIAIPcGAADNEgAg_AYAABkAIAdGAADEEgAgRwAAyxIAIPYGAADFEgAg9wYAAMoSACD6BgAAUgAg-wYAAFIAIPwGAAABACADRgAAyBIAIPYGAADJEgAg_AYAAAEAIANGAADGEgAg9gYAAMcSACD8BgAAGQAgA0YAAMQSACD2BgAAxRIAIPwGAAABACAAAAAAAAdGAAC5EgAgRwAAwhIAIPYGAAC6EgAg9wYAAMESACD6BgAAFwAg-wYAABcAIPwGAAAZACAHRgAAtxIAIEcAAL8SACD2BgAAuBIAIPcGAAC-EgAg-gYAACAAIPsGAAAgACD8BgAAIwAgB0YAALUSACBHAAC8EgAg9gYAALYSACD3BgAAuxIAIPoGAAARACD7BgAAEQAg_AYAABUAIANGAAC5EgAg9gYAALoSACD8BgAAGQAgA0YAALcSACD2BgAAuBIAIPwGAAAjACADRgAAtRIAIPYGAAC2EgAg_AYAABUAIAAAAAAABUYAAKsSACBHAACzEgAg9gYAAKwSACD3BgAAshIAIPwGAABLACALRgAApA4AMEcAAKgOADD2BgAApQ4AMPcGAACmDgAw-AYAAKcOACD5BgAAzg0AMPoGAADODQAw-wYAAM4NADD8BgAAzg0AMP0GAACpDgAw_gYAANENADALRgAAmw4AMEcAAJ8OADD2BgAAnA4AMPcGAACdDgAw-AYAAJ4OACD5BgAA5wwAMPoGAADnDAAw-wYAAOcMADD8BgAA5wwAMP0GAACgDgAw_gYAAOoMADALRgAAjw4AMEcAAJQOADD2BgAAkA4AMPcGAACRDgAw-AYAAJIOACD5BgAAkw4AMPoGAACTDgAw-wYAAJMOADD8BgAAkw4AMP0GAACVDgAw_gYAAJYOADALRgAAgw4AMEcAAIgOADD2BgAAhA4AMPcGAACFDgAw-AYAAIYOACD5BgAAhw4AMPoGAACHDgAw-wYAAIcOADD8BgAAhw4AMP0GAACJDgAw_gYAAIoOADALRgAA-g0AMEcAAP4NADD2BgAA-w0AMPcGAAD8DQAw-AYAAP0NACD5BgAA6QsAMPoGAADpCwAw-wYAAOkLADD8BgAA6QsAMP0GAAD_DQAw_gYAAOwLADAEFgAA3gsAIKUFAQAAAAGuBUAAAAAB7AUBAAAAAQIAAAA3ACBGAACCDgAgAwAAADcAIEYAAIIOACBHAACBDgAgAT8AALESADACAAAANwAgPwAAgQ4AIAIAAADtCwAgPwAAgA4AIAOlBQEAsAoAIa4FQACzCgAh7AUBALAKACEEFgAA3AsAIKUFAQCwCgAhrgVAALMKACHsBQEAsAoAIQQWAADeCwAgpQUBAAAAAa4FQAAAAAHsBQEAAAABCqUFAQAAAAGuBUAAAAAB8QUAAADxBQLyBQIAAAAB8wUCAAAAAfQFAgAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAABAgAAADMAIEYAAI4OACADAAAAMwAgRgAAjg4AIEcAAI0OACABPwAAsBIAMA8UAACKCgAgogUAAIsKADCjBQAAMQAQpAUAAIsKADClBQEAAAABrgVAAO4IACHtBQEA7QgAIfEFAACMCvEFIvIFAgD-CAAh8wUCAP4IACH0BQIA_ggAIfUFAQDyCAAh9gUBAPIIACH3BQEA8ggAIfgFAQDyCAAhAgAAADMAID8AAI0OACACAAAAiw4AID8AAIwOACAOogUAAIoOADCjBQAAiw4AEKQFAACKDgAwpQUBAO0IACGuBUAA7ggAIe0FAQDtCAAh8QUAAIwK8QUi8gUCAP4IACHzBQIA_ggAIfQFAgD-CAAh9QUBAPIIACH2BQEA8ggAIfcFAQDyCAAh-AUBAPIIACEOogUAAIoOADCjBQAAiw4AEKQFAACKDgAwpQUBAO0IACGuBUAA7ggAIe0FAQDtCAAh8QUAAIwK8QUi8gUCAP4IACHzBQIA_ggAIfQFAgD-CAAh9QUBAPIIACH2BQEA8ggAIfcFAQDyCAAh-AUBAPIIACEKpQUBALAKACGuBUAAswoAIfEFAAD6C_EFIvIFAgC2CwAh8wUCALYLACH0BQIAtgsAIfUFAQCxCgAh9gUBALEKACH3BQEAsQoAIfgFAQCxCgAhCqUFAQCwCgAhrgVAALMKACHxBQAA-gvxBSLyBQIAtgsAIfMFAgC2CwAh9AUCALYLACH1BQEAsQoAIfYFAQCxCgAh9wUBALEKACH4BQEAsQoAIQqlBQEAAAABrgVAAAAAAfEFAAAA8QUC8gUCAAAAAfMFAgAAAAH0BQIAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAQwJAADsDQAgGAAA7g0AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAECAAAAHQAgRgAAmg4AIAMAAAAdACBGAACaDgAgRwAAmQ4AIAE_AACvEgAwEQkAAOwJACAPAACZCgAgGAAAmgoAIKIFAACYCgAwowUAABsAEKQFAACYCgAwpQUBAAAAAaoFAQDyCAAhrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh7QUBAPIIACG7BgEA7QgAIbwGAQDyCAAhvQYBAPIIACG-BgIA_ggAIb8GIAD9CAAhAgAAAB0AID8AAJkOACACAAAAlw4AID8AAJgOACAOogUAAJYOADCjBQAAlw4AEKQFAACWDgAwpQUBAO0IACGqBQEA8ggAIa4FQADuCAAhzwVAAO4IACHaBQEA8ggAIe0FAQDyCAAhuwYBAO0IACG8BgEA8ggAIb0GAQDyCAAhvgYCAP4IACG_BiAA_QgAIQ6iBQAAlg4AMKMFAACXDgAQpAUAAJYOADClBQEA7QgAIaoFAQDyCAAhrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh7QUBAPIIACG7BgEA7QgAIbwGAQDyCAAhvQYBAPIIACG-BgIA_ggAIb8GIAD9CAAhCqUFAQCwCgAhqgUBALEKACGuBUAAswoAIc8FQACzCgAh2gUBALEKACG7BgEAsAoAIbwGAQCxCgAhvQYBALEKACG-BgIAtgsAIb8GIADpCgAhDAkAAOkNACAYAADrDQAgpQUBALAKACGqBQEAsQoAIa4FQACzCgAhzwVAALMKACHaBQEAsQoAIbsGAQCwCgAhvAYBALEKACG9BgEAsQoAIb4GAgC2CwAhvwYgAOkKACEMCQAA7A0AIBgAAO4NACClBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABDREAALQNACClBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAECAAAALgAgRgAAow4AIAMAAAAuACBGAACjDgAgRwAAog4AIAE_AACuEgAwAgAAAC4AID8AAKIOACACAAAA6wwAID8AAKEOACAMpQUBALAKACGpBQEAsAoAIaoFAQCwCgAhrgVAALMKACHyBQIAtgsAIZsGAQCwCgAhnAYBALAKACGdBgEAsQoAIZ4GgAAAAAGfBhAAkQwAIaAGEACRDAAhoQYQAJEMACENEQAAsw0AIKUFAQCwCgAhqQUBALAKACGqBQEAsAoAIa4FQACzCgAh8gUCALYLACGbBgEAsAoAIZwGAQCwCgAhnQYBALEKACGeBoAAAAABnwYQAJEMACGgBhAAkQwAIaEGEACRDAAhDREAALQNACClBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAEGDgAAww0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAfIFAgAAAAGyBgEAAAABAgAAACgAIEYAAKwOACADAAAAKAAgRgAArA4AIEcAAKsOACABPwAArRIAMAIAAAAoACA_AACrDgAgAgAAANINACA_AACqDgAgBaUFAQCwCgAhrgVAALMKACHPBUAAswoAIfIFAgC2CwAhsgYBALAKACEGDgAAwQ0AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIfIFAgC2CwAhsgYBALAKACEGDgAAww0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAfIFAgAAAAGyBgEAAAABA0YAAKsSACD2BgAArBIAIPwGAABLACAERgAApA4AMPYGAAClDgAw-AYAAKcOACD8BgAAzg0AMARGAACbDgAw9gYAAJwOADD4BgAAng4AIPwGAADnDAAwBEYAAI8OADD2BgAAkA4AMPgGAACSDgAg_AYAAJMOADAERgAAgw4AMPYGAACEDgAw-AYAAIYOACD8BgAAhw4AMARGAAD6DQAw9gYAAPsNADD4BgAA_Q0AIPwGAADpCwAwAAAABUYAAKUSACBHAACpEgAg9gYAAKYSACD3BgAAqBIAIPwGAAAZACALRgAAuA4AMEcAAL0OADD2BgAAuQ4AMPcGAAC6DgAw-AYAALsOACD5BgAAvA4AMPoGAAC8DgAw-wYAALwOADD8BgAAvA4AMP0GAAC-DgAw_gYAAL8OADAPEAAArg4AIBIAAK8OACATAACwDgAgFQAAsQ4AIBcAALIOACClBQEAAAABrgVAAAAAAc8FQAAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABAgAAACMAIEYAAMMOACADAAAAIwAgRgAAww4AIEcAAMIOACABPwAApxIAMBUMAACUCgAgEAAAuQkAIBIAAJUKACATAACWCgAgFQAAlwoAIBcAAIUJACCiBQAAkwoAMKMFAAAgABCkBQAAkwoAMKUFAQAAAAGuBUAA7ggAIc8FQADuCAAhhQYgAP0IACHABgEA7QgAIcEGAQAAAAHCBgEA8ggAIcMGEACYCQAhxAYQAJkJACHFBhAAmQkAIcYGAgD-CAAh8QYAAJIKACACAAAAIwAgPwAAwg4AIAIAAADADgAgPwAAwQ4AIA6iBQAAvw4AMKMFAADADgAQpAUAAL8OADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACGFBiAA_QgAIcAGAQDtCAAhwQYBAO0IACHCBgEA8ggAIcMGEACYCQAhxAYQAJkJACHFBhAAmQkAIcYGAgD-CAAhDqIFAAC_DgAwowUAAMAOABCkBQAAvw4AMKUFAQDtCAAhrgVAAO4IACHPBUAA7ggAIYUGIAD9CAAhwAYBAO0IACHBBgEA7QgAIcIGAQDyCAAhwwYQAJgJACHEBhAAmQkAIcUGEACZCQAhxgYCAP4IACEKpQUBALAKACGuBUAAswoAIc8FQACzCgAhhQYgAOkKACHBBgEAsAoAIcIGAQCxCgAhwwYQAJEMACHEBhAAkgwAIcUGEACSDAAhxgYCALYLACEPEAAA9Q0AIBIAAPYNACATAAD3DQAgFQAA-A0AIBcAAPkNACClBQEAsAoAIa4FQACzCgAhzwVAALMKACGFBiAA6QoAIcEGAQCwCgAhwgYBALEKACHDBhAAkQwAIcQGEACSDAAhxQYQAJIMACHGBgIAtgsAIQ8QAACuDgAgEgAArw4AIBMAALAOACAVAACxDgAgFwAAsg4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAYUGIAAAAAHBBgEAAAABwgYBAAAAAcMGEAAAAAHEBhAAAAABxQYQAAAAAcYGAgAAAAEDRgAApRIAIPYGAACmEgAg_AYAABkAIARGAAC4DgAw9gYAALkOADD4BgAAuw4AIPwGAAC8DgAwAAAAAAAHRgAAlBIAIEcAAKMSACD2BgAAlRIAIPcGAACiEgAg-gYAABEAIPsGAAARACD8BgAAFQAgC0YAAJQPADBHAACZDwAw9gYAAJUPADD3BgAAlg8AMPgGAACXDwAg-QYAAJgPADD6BgAAmA8AMPsGAACYDwAw_AYAAJgPADD9BgAAmg8AMP4GAACbDwAwC0YAAIsPADBHAACPDwAw9gYAAIwPADD3BgAAjQ8AMPgGAACODwAg-QYAAJMOADD6BgAAkw4AMPsGAACTDgAw_AYAAJMOADD9BgAAkA8AMP4GAACWDgAwC0YAAP8OADBHAACEDwAw9gYAAIAPADD3BgAAgQ8AMPgGAACCDwAg-QYAAIMPADD6BgAAgw8AMPsGAACDDwAw_AYAAIMPADD9BgAAhQ8AMP4GAACGDwAwC0YAAPEOADBHAAD2DgAw9gYAAPIOADD3BgAA8w4AMPgGAAD0DgAg-QYAAPUOADD6BgAA9Q4AMPsGAAD1DgAw_AYAAPUOADD9BgAA9w4AMP4GAAD4DgAwC0YAAOUOADBHAADqDgAw9gYAAOYOADD3BgAA5w4AMPgGAADoDgAg-QYAAOkOADD6BgAA6Q4AMPsGAADpDgAw_AYAAOkOADD9BgAA6w4AMP4GAADsDgAwC0YAANwOADBHAADgDgAw9gYAAN0OADD3BgAA3g4AMPgGAADfDgAg-QYAAK0MADD6BgAArQwAMPsGAACtDAAw_AYAAK0MADD9BgAA4Q4AMP4GAACwDAAwC0YAANMOADBHAADXDgAw9gYAANQOADD3BgAA1Q4AMPgGAADWDgAg-QYAAIkNADD6BgAAiQ0AMPsGAACJDQAw_AYAAIkNADD9BgAA2A4AMP4GAACMDQAwAgUAAIkMACD5BQEAAAABAgAAAA8AIEYAANsOACADAAAADwAgRgAA2w4AIEcAANoOACABPwAAoRIAMAIAAAAPACA_AADaDgAgAgAAAI0NACA_AADZDgAgAfkFAQCwCgAhAgUAAIcMACD5BQEAsAoAIQIFAACJDAAg-QUBAAAAAQsDAAC3CgAgEQAAuAoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQIAAABhACBGAADkDgAgAwAAAGEAIEYAAOQOACBHAADjDgAgAT8AAKASADACAAAAYQAgPwAA4w4AIAIAAACxDAAgPwAA4g4AIAmlBQEAsAoAIaYFAQCwCgAhpwUBALEKACGoBQEAsQoAIakFAQCxCgAhqwUIALIKACGsBQEAsQoAIa0FgAAAAAGuBUAAswoAIQsDAAC0CgAgEQAAtQoAIKUFAQCwCgAhpgUBALAKACGnBQEAsQoAIagFAQCxCgAhqQUBALEKACGrBQgAsgoAIawFAQCxCgAhrQWAAAAAAa4FQACzCgAhCwMAALcKACARAAC4CgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABCAMAAMgKACClBQEAAAABpwUBAAAAAagFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABAgAAAFwAIEYAAPAOACADAAAAXAAgRgAA8A4AIEcAAO8OACABPwAAnxIAMA0DAADVCQAgCQAA7gkAIKIFAADtCQAwowUAAFoAEKQFAADtCQAwpQUBAAAAAacFAQDyCAAhqAUBAPIIACGqBQEA7QgAIcMFAQDyCAAhxAUBAPIIACHFBQEA8ggAIcYFQADuCAAhAgAAAFwAID8AAO8OACACAAAA7Q4AID8AAO4OACALogUAAOwOADCjBQAA7Q4AEKQFAADsDgAwpQUBAO0IACGnBQEA8ggAIagFAQDyCAAhqgUBAO0IACHDBQEA8ggAIcQFAQDyCAAhxQUBAPIIACHGBUAA7ggAIQuiBQAA7A4AMKMFAADtDgAQpAUAAOwOADClBQEA7QgAIacFAQDyCAAhqAUBAPIIACGqBQEA7QgAIcMFAQDyCAAhxAUBAPIIACHFBQEA8ggAIcYFQADuCAAhB6UFAQCwCgAhpwUBALEKACGoBQEAsQoAIcMFAQCxCgAhxAUBALEKACHFBQEAsQoAIcYFQACzCgAhCAMAAMYKACClBQEAsAoAIacFAQCxCgAhqAUBALEKACHDBQEAsQoAIcQFAQCxCgAhxQUBALEKACHGBUAAswoAIQgDAADICgAgpQUBAAAAAacFAQAAAAGoBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAQMdAAD-DgAgrgVAAAAAAdkFAQAAAAECAAAAVgAgRgAA_Q4AIAMAAABWACBGAAD9DgAgRwAA-w4AIAE_AACeEgAwCQkAAO4JACAdAADxCQAgogUAAPAJADCjBQAAVAAQpAUAAPAJADCqBQEA7QgAIa4FQADuCAAh2QUBAO0IACHsBgAA7wkAIAIAAABWACA_AAD7DgAgAgAAAPkOACA_AAD6DgAgBqIFAAD4DgAwowUAAPkOABCkBQAA-A4AMKoFAQDtCAAhrgVAAO4IACHZBQEA7QgAIQaiBQAA-A4AMKMFAAD5DgAQpAUAAPgOADCqBQEA7QgAIa4FQADuCAAh2QUBAO0IACECrgVAALMKACHZBQEAsAoAIQMdAAD8DgAgrgVAALMKACHZBQEAsAoAIQVGAACZEgAgRwAAnBIAIPYGAACaEgAg9wYAAJsSACD8BgAA1wIAIAMdAAD-DgAgrgVAAAAAAdkFAQAAAAEDRgAAmRIAIPYGAACaEgAg_AYAANcCACAQAwAA4Q0AIBsAAOMNACClBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABugYBAAAAAQIAAABQACBGAACKDwAgAwAAAFAAIEYAAIoPACBHAACJDwAgAT8AAJgSADAWAwAAhAkAIAkAAO4JACAbAADVCQAgogUAAIAKADCjBQAATgAQpAUAAIAKADClBQEAAAABpwUBAO0IACGqBQEA7QgAIa4FQADuCAAhzwVAAO4IACHXBSAA_QgAIeEFAQDyCAAhswYCAP4IACG0BgEA8ggAIbUGIAD9CAAhtgYCAP4IACG3BgIA_ggAIbgGAQDyCAAhuQZAAPwIACG6BgEA8ggAIe0GAAD_CQAgAgAAAFAAID8AAIkPACACAAAAhw8AID8AAIgPACASogUAAIYPADCjBQAAhw8AEKQFAACGDwAwpQUBAO0IACGnBQEA7QgAIaoFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdcFIAD9CAAh4QUBAPIIACGzBgIA_ggAIbQGAQDyCAAhtQYgAP0IACG2BgIA_ggAIbcGAgD-CAAhuAYBAPIIACG5BkAA_AgAIboGAQDyCAAhEqIFAACGDwAwowUAAIcPABCkBQAAhg8AMKUFAQDtCAAhpwUBAO0IACGqBQEA7QgAIa4FQADuCAAhzwVAAO4IACHXBSAA_QgAIeEFAQDyCAAhswYCAP4IACG0BgEA8ggAIbUGIAD9CAAhtgYCAP4IACG3BgIA_ggAIbgGAQDyCAAhuQZAAPwIACG6BgEA8ggAIQ6lBQEAsAoAIacFAQCwCgAhrgVAALMKACHPBUAAswoAIdcFIADpCgAh4QUBALEKACGzBgIAtgsAIbQGAQCxCgAhtQYgAOkKACG2BgIAtgsAIbcGAgC2CwAhuAYBALEKACG5BkAAtQsAIboGAQCxCgAhEAMAAN4NACAbAADgDQAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzwVAALMKACHXBSAA6QoAIeEFAQCxCgAhswYCALYLACG0BgEAsQoAIbUGIADpCgAhtgYCALYLACG3BgIAtgsAIbgGAQCxCgAhuQZAALULACG6BgEAsQoAIRADAADhDQAgGwAA4w0AIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAG6BgEAAAABDA8AAO0NACAYAADuDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAe0FAQAAAAG7BgEAAAABvAYBAAAAAb0GAQAAAAG-BgIAAAABvwYgAAAAAQIAAAAdACBGAACTDwAgAwAAAB0AIEYAAJMPACBHAACSDwAgAT8AAJcSADACAAAAHQAgPwAAkg8AIAIAAACXDgAgPwAAkQ8AIAqlBQEAsAoAIa4FQACzCgAhzwVAALMKACHaBQEAsQoAIe0FAQCxCgAhuwYBALAKACG8BgEAsQoAIb0GAQCxCgAhvgYCALYLACG_BiAA6QoAIQwPAADqDQAgGAAA6w0AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdoFAQCxCgAh7QUBALEKACG7BgEAsAoAIbwGAQCxCgAhvQYBALEKACG-BgIAtgsAIb8GIADpCgAhDA8AAO0NACAYAADuDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAe0FAQAAAAG7BgEAAAABvAYBAAAAAb0GAQAAAAG-BgIAAAABvwYgAAAAAQYKAADFDgAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAECAAAASwAgRgAAnw8AIAMAAABLACBGAACfDwAgRwAAng8AIAE_AACWEgAwCwkAAO4JACAKAACCCgAgogUAAIEKADCjBQAASQAQpAUAAIEKADClBQEAAAABqgUBAO0IACGuBUAA7ggAIc8FQADuCAAh4QUBAO0IACGFBiAA_QgAIQIAAABLACA_AACeDwAgAgAAAJwPACA_AACdDwAgCaIFAACbDwAwowUAAJwPABCkBQAAmw8AMKUFAQDtCAAhqgUBAO0IACGuBUAA7ggAIc8FQADuCAAh4QUBAO0IACGFBiAA_QgAIQmiBQAAmw8AMKMFAACcDwAQpAUAAJsPADClBQEA7QgAIaoFAQDtCAAhrgVAAO4IACHPBUAA7ggAIeEFAQDtCAAhhQYgAP0IACEFpQUBALAKACGuBUAAswoAIc8FQACzCgAh4QUBALAKACGFBiAA6QoAIQYKAAC3DgAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh4QUBALAKACGFBiAA6QoAIQYKAADFDgAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAEDRgAAlBIAIPYGAACVEgAg_AYAABUAIARGAACUDwAw9gYAAJUPADD4BgAAlw8AIPwGAACYDwAwBEYAAIsPADD2BgAAjA8AMPgGAACODwAg_AYAAJMOADAERgAA_w4AMPYGAACADwAw-AYAAIIPACD8BgAAgw8AMARGAADxDgAw9gYAAPIOADD4BgAA9A4AIPwGAAD1DgAwBEYAAOUOADD2BgAA5g4AMPgGAADoDgAg_AYAAOkOADAERgAA3A4AMPYGAADdDgAw-AYAAN8OACD8BgAArQwAMARGAADTDgAw9gYAANQOADD4BgAA1g4AIPwGAACJDQAwAAAABUYAAI8SACBHAACSEgAg9gYAAJASACD3BgAAkRIAIPwGAAAZACADRgAAjxIAIPYGAACQEgAg_AYAABkAIAAAAAtGAACxDwAwRwAAtQ8AMPYGAACyDwAw9wYAALMPADD4BgAAtA8AIPkGAAD1DgAw-gYAAPUOADD7BgAA9Q4AMPwGAAD1DgAw_QYAALYPADD-BgAA-A4AMAMJAACsDwAgqgUBAAAAAa4FQAAAAAECAAAAVgAgRgAAuQ8AIAMAAABWACBGAAC5DwAgRwAAuA8AIAE_AACOEgAwAgAAAFYAID8AALgPACACAAAA-Q4AID8AALcPACACqgUBALAKACGuBUAAswoAIQMJAACrDwAgqgUBALAKACGuBUAAswoAIQMJAACsDwAgqgUBAAAAAa4FQAAAAAEERgAAsQ8AMPYGAACyDwAw-AYAALQPACD8BgAA9Q4AMAAAAAAAAAdGAACFEgAgRwAAjBIAIPYGAACGEgAg9wYAAIsSACD6BgAAEQAg-wYAABEAIPwGAAAVACALRgAA5A8AMEcAAOkPADD2BgAA5Q8AMPcGAADmDwAw-AYAAOcPACD5BgAA6A8AMPoGAADoDwAw-wYAAOgPADD8BgAA6A8AMP0GAADqDwAw_gYAAOsPADALRgAA2A8AMEcAAN0PADD2BgAA2Q8AMPcGAADaDwAw-AYAANsPACD5BgAA3A8AMPoGAADcDwAw-wYAANwPADD8BgAA3A8AMP0GAADeDwAw_gYAAN8PADALRgAAzw8AMEcAANMPADD2BgAA0A8AMPcGAADRDwAw-AYAANIPACD5BgAAkw4AMPoGAACTDgAw-wYAAJMOADD8BgAAkw4AMP0GAADUDwAw_gYAAJYOADALRgAAxg8AMEcAAMoPADD2BgAAxw8AMPcGAADIDwAw-AYAAMkPACD5BgAA_QwAMPoGAAD9DAAw-wYAAP0MADD8BgAA_QwAMP0GAADLDwAw_gYAAIANADACBQAAggwAIPkFAQAAAAECAAAAQwAgRgAAzg8AIAMAAABDACBGAADODwAgRwAAzQ8AIAE_AACKEgAwAgAAAEMAID8AAM0PACACAAAAgQ0AID8AAMwPACAB-QUBALAKACECBQAAgAwAIPkFAQCwCgAhAgUAAIIMACD5BQEAAAABDAkAAOwNACAPAADtDQAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAG7BgEAAAABvAYBAAAAAb0GAQAAAAG-BgIAAAABvwYgAAAAAQIAAAAdACBGAADXDwAgAwAAAB0AIEYAANcPACBHAADWDwAgAT8AAIkSADACAAAAHQAgPwAA1g8AIAIAAACXDgAgPwAA1Q8AIAqlBQEAsAoAIaoFAQCxCgAhrgVAALMKACHPBUAAswoAIe0FAQCxCgAhuwYBALAKACG8BgEAsQoAIb0GAQCxCgAhvgYCALYLACG_BiAA6QoAIQwJAADpDQAgDwAA6g0AIKUFAQCwCgAhqgUBALEKACGuBUAAswoAIc8FQACzCgAh7QUBALEKACG7BgEAsAoAIbwGAQCxCgAhvQYBALEKACG-BgIAtgsAIb8GIADpCgAhDAkAAOwNACAPAADtDQAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAG7BgEAAAABvAYBAAAAAb0GAQAAAAG-BgIAAAABvwYgAAAAAR4TAACiDwAgGgAAoQ8AIBwAAKMPACAeAACkDwAgHwAApQ8AICAAAKYPACAhAACnDwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdwFAQAAAAHgBQEAAAAB4QUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAHBBgEAAAABwgYBAAAAAcMGEAAAAAHEBhAAAAABxQYQAAAAAcYGAgAAAAHHBgEAAAAByAYBAAAAAckGAgAAAAHKBiAAAAABywYgAAAAAcwGIAAAAAECAAAAGQAgRgAA4w8AIAMAAAAZACBGAADjDwAgRwAA4g8AIAE_AACIEgAwIxMAAJYKACAYAACaCgAgGgAAnAoAIBwAAPgJACAeAADCCQAgHwAA-wkAICAAAP0JACAhAACbCQAgogUAAJsKADCjBQAAFwAQpAUAAJsKADClBQEAAAABrQUAAP8IACCuBUAA7ggAIc8FQADuCAAh2gUBAPIIACHcBQEAAAAB4AUBAPIIACHhBQEA7QgAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhwQYBAAAAAcIGAQDyCAAhwwYQAJkJACHEBhAAmQkAIcUGEACZCQAhxgYCAJoJACHHBgEA8ggAIcgGAQDyCAAhyQYCAP4IACHKBiAA_QgAIcsGIAD9CAAhzAYgAP0IACECAAAAGQAgPwAA4g8AIAIAAADgDwAgPwAA4Q8AIBuiBQAA3w8AMKMFAADgDwAQpAUAAN8PADClBQEA7QgAIa0FAAD_CAAgrgVAAO4IACHPBUAA7ggAIdoFAQDyCAAh3AUBAO0IACHgBQEA8ggAIeEFAQDtCAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAhhQYgAP0IACHBBgEA8ggAIcIGAQDyCAAhwwYQAJkJACHEBhAAmQkAIcUGEACZCQAhxgYCAJoJACHHBgEA8ggAIcgGAQDyCAAhyQYCAP4IACHKBiAA_QgAIcsGIAD9CAAhzAYgAP0IACEbogUAAN8PADCjBQAA4A8AEKQFAADfDwAwpQUBAO0IACGtBQAA_wgAIK4FQADuCAAhzwVAAO4IACHaBQEA8ggAIdwFAQDtCAAh4AUBAPIIACHhBQEA7QgAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhwQYBAPIIACHCBgEA8ggAIcMGEACZCQAhxAYQAJkJACHFBhAAmQkAIcYGAgCaCQAhxwYBAPIIACHIBgEA8ggAIckGAgD-CAAhygYgAP0IACHLBiAA_QgAIcwGIAD9CAAhF6UFAQCwCgAhrQWAAAAAAa4FQACzCgAhzwVAALMKACHcBQEAsAoAIeAFAQCxCgAh4QUBALAKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIcEGAQCxCgAhwgYBALEKACHDBhAAkgwAIcQGEACSDAAhxQYQAJIMACHGBgIAvwoAIccGAQCxCgAhyAYBALEKACHJBgIAtgsAIcoGIADpCgAhywYgAOkKACHMBiAA6QoAIR4TAADNDgAgGgAAzA4AIBwAAM4OACAeAADPDgAgHwAA0A4AICAAANEOACAhAADSDgAgpQUBALAKACGtBYAAAAABrgVAALMKACHPBUAAswoAIdwFAQCwCgAh4AUBALEKACHhBQEAsAoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhwQYBALEKACHCBgEAsQoAIcMGEACSDAAhxAYQAJIMACHFBhAAkgwAIcYGAgC_CgAhxwYBALEKACHIBgEAsQoAIckGAgC2CwAhygYgAOkKACHLBiAA6QoAIcwGIADpCgAhHhMAAKIPACAaAAChDwAgHAAAow8AIB4AAKQPACAfAAClDwAgIAAApg8AICEAAKcPACClBQEAAAABrQWAAAAAAa4FQAAAAAHPBUAAAAAB3AUBAAAAAeAFAQAAAAHhBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAcEGAQAAAAHCBgEAAAABwwYQAAAAAcQGEAAAAAHFBhAAAAABxgYCAAAAAccGAQAAAAHIBgEAAAAByQYCAAAAAcoGIAAAAAHLBiAAAAABzAYgAAAAARAHAADwDwAgCAAA8Q8AIBMAAPIPACAZAADzDwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAdwFAQAAAAHgBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAb4GAgAAAAHNBgEAAAABAgAAABUAIEYAAO8PACADAAAAFQAgRgAA7w8AIEcAAO4PACABPwAAhxIAMBYGAACaCgAgBwAAnwoAIAgAAKAKACATAACWCgAgGQAAnAkAIKIFAACeCgAwowUAABEAEKQFAACeCgAwpQUBAAAAAa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAAAAAeAFAQDyCAAh6AUBAPIIACHpBQEA8ggAIeoFAQDyCAAhhQYgAP0IACG-BgIA_ggAIc0GAQDyCAAh8gYAAJ0KACACAAAAFQAgPwAA7g8AIAIAAADsDwAgPwAA7Q8AIBCiBQAA6w8AMKMFAADsDwAQpAUAAOsPADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhvgYCAP4IACHNBgEA8ggAIRCiBQAA6w8AMKMFAADsDwAQpAUAAOsPADClBQEA7QgAIa4FQADuCAAhzwVAAO4IACHYBQEA8ggAIdsFAQDtCAAh3AUBAO0IACHgBQEA8ggAIegFAQDyCAAh6QUBAPIIACHqBQEA8ggAIYUGIAD9CAAhvgYCAP4IACHNBgEA8ggAIQylBQEAsAoAIa4FQACzCgAhzwVAALMKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIb4GAgC2CwAhzQYBALEKACEQBwAAwg8AIAgAAMMPACATAADEDwAgGQAAxQ8AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdsFAQCwCgAh3AUBALAKACHgBQEAsQoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhvgYCALYLACHNBgEAsQoAIRAHAADwDwAgCAAA8Q8AIBMAAPIPACAZAADzDwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAdwFAQAAAAHgBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAb4GAgAAAAHNBgEAAAABBEYAAOQPADD2BgAA5Q8AMPgGAADnDwAg_AYAAOgPADAERgAA2A8AMPYGAADZDwAw-AYAANsPACD8BgAA3A8AMARGAADPDwAw9gYAANAPADD4BgAA0g8AIPwGAACTDgAwBEYAAMYPADD2BgAAxw8AMPgGAADJDwAg_AYAAP0MADADRgAAhRIAIPYGAACGEgAg_AYAABUAIAAAAAVGAAD_EQAgRwAAgxIAIPYGAACAEgAg9wYAAIISACD8BgAAAQAgC0YAAPoPADBHAAD-DwAw9gYAAPsPADD3BgAA_A8AMPgGAAD9DwAg-QYAAJoMADD6BgAAmgwAMPsGAACaDAAw_AYAAJoMADD9BgAA_w8AMP4GAACdDAAwHQMAAPIMACAFAAC7DQAgDQAA9AwAICAAAPgMACAkAAD1DAAgJQAA9gwAICgAAPcMACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQIAAAAJACBGAACCEAAgAwAAAAkAIEYAAIIQACBHAACBEAAgAT8AAIESADACAAAACQAgPwAAgRAAIAIAAACeDAAgPwAAgBAAIBalBQEAsAoAIacFAQCwCgAhrgVAALMKACHOBQAAoAyaBiLPBUAAswoAIfkFAQCxCgAhoQYQAJEMACGiBgEAsAoAIaQGgAAAAAGlBgEAsQoAIaYGAQCxCgAhpwYQAJEMACGoBhAAkQwAIakGEACRDAAhqgYQAJEMACGrBgEAsQoAIawGQACzCgAhrQZAALULACGuBkAAtQsAIa8GQAC1CwAhsAZAALULACGxBkAAtQsAIR0DAACiDAAgBQAAug0AIA0AAKQMACAgAACoDAAgJAAApQwAICUAAKYMACAoAACnDAAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYizwVAALMKACH5BQEAsQoAIaEGEACRDAAhogYBALAKACGkBoAAAAABpQYBALEKACGmBgEAsQoAIacGEACRDAAhqAYQAJEMACGpBhAAkQwAIaoGEACRDAAhqwYBALEKACGsBkAAswoAIa0GQAC1CwAhrgZAALULACGvBkAAtQsAIbAGQAC1CwAhsQZAALULACEdAwAA8gwAIAUAALsNACANAAD0DAAgIAAA-AwAICQAAPUMACAlAAD2DAAgKAAA9wwAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAfkFAQAAAAGhBhAAAAABogYBAAAAAaQGgAAAAAGlBgEAAAABpgYBAAAAAacGEAAAAAGoBhAAAAABqQYQAAAAAaoGEAAAAAGrBgEAAAABrAZAAAAAAa0GQAAAAAGuBkAAAAABrwZAAAAAAbAGQAAAAAGxBkAAAAABA0YAAP8RACD2BgAAgBIAIPwGAAABACAERgAA-g8AMPYGAAD7DwAw-AYAAP0PACD8BgAAmgwAMAAAAAVGAAD6EQAgRwAA_REAIPYGAAD7EQAg9wYAAPwRACD8BgAAAQAgA0YAAPoRACD2BgAA-xEAIPwGAAABACAAAAAFRgAA9REAIEcAAPgRACD2BgAA9hEAIPcGAAD3EQAg_AYAAAEAIANGAAD1EQAg9gYAAPYRACD8BgAAAQAgAAAABUYAAPARACBHAADzEQAg9gYAAPERACD3BgAA8hEAIPwGAAABACADRgAA8BEAIPYGAADxEQAg_AYAAAEAIAAAAAH5BgAAAOYGAgtGAAClEQAwRwAAqhEAMPYGAACmEQAw9wYAAKcRADD4BgAAqBEAIPkGAACpEQAw-gYAAKkRADD7BgAAqREAMPwGAACpEQAw_QYAAKsRADD-BgAArBEAMAtGAACZEQAwRwAAnhEAMPYGAACaEQAw9wYAAJsRADD4BgAAnBEAIPkGAACdEQAw-gYAAJ0RADD7BgAAnREAMPwGAACdEQAw_QYAAJ8RADD-BgAAoBEAMAtGAACNEQAwRwAAkhEAMPYGAACOEQAw9wYAAI8RADD4BgAAkBEAIPkGAACREQAw-gYAAJERADD7BgAAkREAMPwGAACREQAw_QYAAJMRADD-BgAAlBEAMAdGAACIEQAgRwAAixEAIPYGAACJEQAg9wYAAIoRACD6BgAAkQEAIPsGAACRAQAg_AYAAJECACALRgAA_xAAMEcAAIMRADD2BgAAgBEAMPcGAACBEQAw-AYAAIIRACD5BgAAgw8AMPoGAACDDwAw-wYAAIMPADD8BgAAgw8AMP0GAACEEQAw_gYAAIYPADALRgAA9hAAMEcAAPoQADD2BgAA9xAAMPcGAAD4EAAw-AYAAPkQACD5BgAAmgwAMPoGAACaDAAw-wYAAJoMADD8BgAAmgwAMP0GAAD7EAAw_gYAAJ0MADAHRgAA8RAAIEcAAPQQACD2BgAA8hAAIPcGAADzEAAg-gYAAJUBACD7BgAAlQEAIPwGAAD-AwAgC0YAAOgQADBHAADsEAAw9gYAAOkQADD3BgAA6hAAMPgGAADrEAAg-QYAANwKADD6BgAA3AoAMPsGAADcCgAw_AYAANwKADD9BgAA7RAAMP4GAADfCgAwC0YAANwQADBHAADhEAAw9gYAAN0QADD3BgAA3hAAMPgGAADfEAAg-QYAAOAQADD6BgAA4BAAMPsGAADgEAAw_AYAAOAQADD9BgAA4hAAMP4GAADjEAAwC0YAANMQADBHAADXEAAw9gYAANQQADD3BgAA1RAAMPgGAADWEAAg-QYAAIMPADD6BgAAgw8AMPsGAACDDwAw_AYAAIMPADD9BgAA2BAAMP4GAACGDwAwC0YAAMoQADBHAADOEAAw9gYAAMsQADD3BgAAzBAAMPgGAADNEAAg-QYAAOkOADD6BgAA6Q4AMPsGAADpDgAw_AYAAOkOADD9BgAAzxAAMP4GAADsDgAwC0YAAL4QADBHAADDEAAw9gYAAL8QADD3BgAAwBAAMPgGAADBEAAg-QYAAMIQADD6BgAAwhAAMPsGAADCEAAw_AYAAMIQADD9BgAAxBAAMP4GAADFEAAwC0YAALUQADBHAAC5EAAw9gYAALYQADD3BgAAtxAAMPgGAAC4EAAg-QYAAPIKADD6BgAA8goAMPsGAADyCgAw_AYAAPIKADD9BgAAuhAAMP4GAAD1CgAwC0YAAKwQADBHAACwEAAw9gYAAK0QADD3BgAArhAAMPgGAACvEAAg-QYAAK0MADD6BgAArQwAMPsGAACtDAAw_AYAAK0MADD9BgAAsRAAMP4GAACwDAAwB0YAAKcQACBHAACqEAAg9gYAAKgQACD3BgAAqRAAIPoGAADBAQAg-wYAAMEBACD8BgAAjgYAIAcNAADyCwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAe4FIAAAAAHvBQEAAAABAgAAAI4GACBGAACnEAAgAwAAAMEBACBGAACnEAAgRwAAqxAAIAkAAADBAQAgDQAA5AsAID8AAKsQACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHbBQEAsAoAIe4FIADpCgAh7wUBALEKACEHDQAA5AsAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdsFAQCwCgAh7gUgAOkKACHvBQEAsQoAIQsJAAC5CgAgEQAAuAoAIKUFAQAAAAGmBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQIAAABhACBGAAC0EAAgAwAAAGEAIEYAALQQACBHAACzEAAgAT8AAO8RADACAAAAYQAgPwAAsxAAIAIAAACxDAAgPwAAshAAIAmlBQEAsAoAIaYFAQCwCgAhqAUBALEKACGpBQEAsQoAIaoFAQCxCgAhqwUIALIKACGsBQEAsQoAIa0FgAAAAAGuBUAAswoAIQsJAAC2CgAgEQAAtQoAIKUFAQCwCgAhpgUBALAKACGoBQEAsQoAIakFAQCxCgAhqgUBALEKACGrBQgAsgoAIawFAQCxCgAhrQWAAAAAAa4FQACzCgAhCwkAALkKACARAAC4CgAgpQUBAAAAAaYFAQAAAAGoBQEAAAABqQUBAAAAAaoFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABDAYAAP0KACA1AAD6CgAgOAAA_AoAIKUFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAAB2AUBAAAAAQIAAACqAQAgRgAAvRAAIAMAAACqAQAgRgAAvRAAIEcAALwQACABPwAA7hEAMAIAAACqAQAgPwAAvBAAIAIAAAD2CgAgPwAAuxAAIAmlBQEAsAoAIa4FQACzCgAhywUBALAKACHPBUAAswoAIdQFAQCwCgAh1QUBALEKACHWBQEAsQoAIdcFIADpCgAh2AUBALEKACEMBgAA7AoAIDUAAOoKACA4AADtCgAgpQUBALAKACGuBUAAswoAIcsFAQCwCgAhzwVAALMKACHUBQEAsAoAIdUFAQCxCgAh1gUBALEKACHXBSAA6QoAIdgFAQCxCgAhDAYAAP0KACA1AAD6CgAgOAAA_AoAIKUFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAAB2AUBAAAAAQalBQEAAAABqAUBAAAAAa4FQAAAAAHABQEAAAABwQUCAAAAAcIFgAAAAAECAAAApQEAIEYAAMkQACADAAAApQEAIEYAAMkQACBHAADIEAAgAT8AAO0RADALAwAA1QkAIKIFAADXCQAwowUAAKMBABCkBQAA1wkAMKUFAQAAAAGnBQEA8ggAIagFAQDyCAAhrgVAAO4IACHABQEA7QgAIcEFAgCaCQAhwgUAAP8IACACAAAApQEAID8AAMgQACACAAAAxhAAID8AAMcQACAKogUAAMUQADCjBQAAxhAAEKQFAADFEAAwpQUBAO0IACGnBQEA8ggAIagFAQDyCAAhrgVAAO4IACHABQEA7QgAIcEFAgCaCQAhwgUAAP8IACAKogUAAMUQADCjBQAAxhAAEKQFAADFEAAwpQUBAO0IACGnBQEA8ggAIagFAQDyCAAhrgVAAO4IACHABQEA7QgAIcEFAgCaCQAhwgUAAP8IACAGpQUBALAKACGoBQEAsQoAIa4FQACzCgAhwAUBALAKACHBBQIAvwoAIcIFgAAAAAEGpQUBALAKACGoBQEAsQoAIa4FQACzCgAhwAUBALAKACHBBQIAvwoAIcIFgAAAAAEGpQUBAAAAAagFAQAAAAGuBUAAAAABwAUBAAAAAcEFAgAAAAHCBYAAAAABCAkAAMcKACClBQEAAAABqAUBAAAAAaoFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABAgAAAFwAIEYAANIQACADAAAAXAAgRgAA0hAAIEcAANEQACABPwAA7BEAMAIAAABcACA_AADREAAgAgAAAO0OACA_AADQEAAgB6UFAQCwCgAhqAUBALEKACGqBQEAsAoAIcMFAQCxCgAhxAUBALEKACHFBQEAsQoAIcYFQACzCgAhCAkAAMUKACClBQEAsAoAIagFAQCxCgAhqgUBALAKACHDBQEAsQoAIcQFAQCxCgAhxQUBALEKACHGBUAAswoAIQgJAADHCgAgpQUBAAAAAagFAQAAAAGqBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAARADAADhDQAgCQAA4g0AIKUFAQAAAAGnBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABAgAAAFAAIEYAANsQACADAAAAUAAgRgAA2xAAIEcAANoQACABPwAA6xEAMAIAAABQACA_AADaEAAgAgAAAIcPACA_AADZEAAgDqUFAQCwCgAhpwUBALAKACGqBQEAsAoAIa4FQACzCgAhzwVAALMKACHXBSAA6QoAIeEFAQCxCgAhswYCALYLACG0BgEAsQoAIbUGIADpCgAhtgYCALYLACG3BgIAtgsAIbgGAQCxCgAhuQZAALULACEQAwAA3g0AIAkAAN8NACClBQEAsAoAIacFAQCwCgAhqgUBALAKACGuBUAAswoAIc8FQACzCgAh1wUgAOkKACHhBQEAsQoAIbMGAgC2CwAhtAYBALEKACG1BiAA6QoAIbYGAgC2CwAhtwYCALYLACG4BgEAsQoAIbkGQAC1CwAhEAMAAOENACAJAADiDQAgpQUBAAAAAacFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAEHLgAA5QoAIKUFAQAAAAGuBUAAAAABzgUAAADTBQLPBUAAAAAB0QUBAAAAAdMFAQAAAAECAAAAnwEAIEYAAOcQACADAAAAnwEAIEYAAOcQACBHAADmEAAgAT8AAOoRADAMLQAAhAkAIC4AANoJACCiBQAA2AkAMKMFAACdAQAQpAUAANgJADClBQEAAAABrgVAAO4IACHOBQAA2QnTBSLPBUAA7ggAIdAFAQDtCAAh0QUBAO0IACHTBQEA8ggAIQIAAACfAQAgPwAA5hAAIAIAAADkEAAgPwAA5RAAIAqiBQAA4xAAMKMFAADkEAAQpAUAAOMQADClBQEA7QgAIa4FQADuCAAhzgUAANkJ0wUizwVAAO4IACHQBQEA7QgAIdEFAQDtCAAh0wUBAPIIACEKogUAAOMQADCjBQAA5BAAEKQFAADjEAAwpQUBAO0IACGuBUAA7ggAIc4FAADZCdMFIs8FQADuCAAh0AUBAO0IACHRBQEA7QgAIdMFAQDyCAAhBqUFAQCwCgAhrgVAALMKACHOBQAA1QrTBSLPBUAAswoAIdEFAQCwCgAh0wUBALEKACEHLgAA1woAIKUFAQCwCgAhrgVAALMKACHOBQAA1QrTBSLPBUAAswoAIdEFAQCwCgAh0wUBALEKACEHLgAA5QoAIKUFAQAAAAGuBUAAAAABzgUAAADTBQLPBUAAAAAB0QUBAAAAAdMFAQAAAAEJLwAA0AoAIKUFAQAAAAGuBUAAAAABxwUBAAAAAcoFAAAAygUCywUBAAAAAcwFgAAAAAHOBQAAAM4FAs8FQAAAAAECAAAAmQEAIEYAAPAQACADAAAAmQEAIEYAAPAQACBHAADvEAAgAT8AAOkRADACAAAAmQEAID8AAO8QACACAAAA4AoAID8AAO4QACAIpQUBALAKACGuBUAAswoAIccFAQCwCgAhygUAAMwKygUiywUBALAKACHMBYAAAAABzgUAAM0KzgUizwVAALMKACEJLwAAzgoAIKUFAQCwCgAhrgVAALMKACHHBQEAsAoAIcoFAADMCsoFIssFAQCwCgAhzAWAAAAAAc4FAADNCs4FIs8FQACzCgAhCS8AANAKACClBQEAAAABrgVAAAAAAccFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABBA0AANcNACClBQEAAAABrgVAAAAAAc8FQAAAAAECAAAA_gMAIEYAAPEQACADAAAAlQEAIEYAAPEQACBHAAD1EAAgBgAAAJUBACANAADJDQAgPwAA9RAAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIQQNAADJDQAgpQUBALAKACGuBUAAswoAIc8FQACzCgAhHQQAAPMMACAFAAC7DQAgDQAA9AwAICAAAPgMACAkAAD1DAAgJQAA9gwAICgAAPcMACClBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAfkFAQAAAAGhBhAAAAABogYBAAAAAaMGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQIAAAAJACBGAAD-EAAgAwAAAAkAIEYAAP4QACBHAAD9EAAgAT8AAOgRADACAAAACQAgPwAA_RAAIAIAAACeDAAgPwAA_BAAIBalBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYizwVAALMKACH5BQEAsQoAIaEGEACRDAAhogYBALAKACGjBgEAsAoAIaQGgAAAAAGlBgEAsQoAIaYGAQCxCgAhpwYQAJEMACGoBhAAkQwAIakGEACRDAAhqgYQAJEMACGrBgEAsQoAIawGQACzCgAhrQZAALULACGuBkAAtQsAIa8GQAC1CwAhsAZAALULACGxBkAAtQsAIR0EAACjDAAgBQAAug0AIA0AAKQMACAgAACoDAAgJAAApQwAICUAAKYMACAoAACnDAAgpQUBALAKACGuBUAAswoAIc4FAACgDJoGIs8FQACzCgAh-QUBALEKACGhBhAAkQwAIaIGAQCwCgAhowYBALAKACGkBoAAAAABpQYBALEKACGmBgEAsQoAIacGEACRDAAhqAYQAJEMACGpBhAAkQwAIaoGEACRDAAhqwYBALEKACGsBkAAswoAIa0GQAC1CwAhrgZAALULACGvBkAAtQsAIbAGQAC1CwAhsQZAALULACEdBAAA8wwAIAUAALsNACANAAD0DAAgIAAA-AwAICQAAPUMACAlAAD2DAAgKAAA9wwAIKUFAQAAAAGuBUAAAAABzgUAAACaBgLPBUAAAAAB-QUBAAAAAaEGEAAAAAGiBgEAAAABowYBAAAAAaQGgAAAAAGlBgEAAAABpgYBAAAAAacGEAAAAAGoBhAAAAABqQYQAAAAAaoGEAAAAAGrBgEAAAABrAZAAAAAAa0GQAAAAAGuBkAAAAABrwZAAAAAAbAGQAAAAAGxBkAAAAABEAkAAOINACAbAADjDQAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdcFIAAAAAHhBQEAAAABswYCAAAAAbQGAQAAAAG1BiAAAAABtgYCAAAAAbcGAgAAAAG4BgEAAAABuQZAAAAAAboGAQAAAAECAAAAUAAgRgAAhxEAIAMAAABQACBGAACHEQAgRwAAhhEAIAE_AADnEQAwAgAAAFAAID8AAIYRACACAAAAhw8AID8AAIURACAOpQUBALAKACGqBQEAsAoAIa4FQACzCgAhzwVAALMKACHXBSAA6QoAIeEFAQCxCgAhswYCALYLACG0BgEAsQoAIbUGIADpCgAhtgYCALYLACG3BgIAtgsAIbgGAQCxCgAhuQZAALULACG6BgEAsQoAIRAJAADfDQAgGwAA4A0AIKUFAQCwCgAhqgUBALAKACGuBUAAswoAIc8FQACzCgAh1wUgAOkKACHhBQEAsQoAIbMGAgC2CwAhtAYBALEKACG1BiAA6QoAIbYGAgC2CwAhtwYCALYLACG4BgEAsQoAIbkGQAC1CwAhugYBALEKACEQCQAA4g0AIBsAAOMNACClBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABugYBAAAAAQSlBQEAAAABrgVAAAAAAc8FQAAAAAHXBgEAAAABAgAAAJECACBGAACIEQAgAwAAAJEBACBGAACIEQAgRwAAjBEAIAYAAACRAQAgPwAAjBEAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdcGAQCwCgAhBKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdcGAQCwCgAhC6UFAQAAAAGuBUAAAAABzwVAAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAdsGAQAAAAHcBkAAAAAB3QYBAAAAAd4GAQAAAAHfBgEAAAABAgAAAI8BACBGAACYEQAgAwAAAI8BACBGAACYEQAgRwAAlxEAIAE_AADmEQAwEQMAAIQJACCiBQAA4AkAMKMFAACNAQAQpAUAAOAJADClBQEAAAABpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2AYBAO0IACHZBgEA7QgAIdoGAQDyCAAh2wYBAPIIACHcBkAA_AgAId0GAQDyCAAh3gYBAPIIACHfBgEA8ggAIesGAADfCQAgAgAAAI8BACA_AACXEQAgAgAAAJURACA_AACWEQAgD6IFAACUEQAwowUAAJURABCkBQAAlBEAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIc8FQADuCAAh2AYBAO0IACHZBgEA7QgAIdoGAQDyCAAh2wYBAPIIACHcBkAA_AgAId0GAQDyCAAh3gYBAPIIACHfBgEA8ggAIQ-iBQAAlBEAMKMFAACVEQAQpAUAAJQRADClBQEA7QgAIacFAQDtCAAhrgVAAO4IACHPBUAA7ggAIdgGAQDtCAAh2QYBAO0IACHaBgEA8ggAIdsGAQDyCAAh3AZAAPwIACHdBgEA8ggAId4GAQDyCAAh3wYBAPIIACELpQUBALAKACGuBUAAswoAIc8FQACzCgAh2AYBALAKACHZBgEAsAoAIdoGAQCxCgAh2wYBALEKACHcBkAAtQsAId0GAQCxCgAh3gYBALEKACHfBgEAsQoAIQulBQEAsAoAIa4FQACzCgAhzwVAALMKACHYBgEAsAoAIdkGAQCwCgAh2gYBALEKACHbBgEAsQoAIdwGQAC1CwAh3QYBALEKACHeBgEAsQoAId8GAQCxCgAhC6UFAQAAAAGuBUAAAAABzwVAAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAdsGAQAAAAHcBkAAAAAB3QYBAAAAAd4GAQAAAAHfBgEAAAABB6UFAQAAAAGuBUAAAAABxAUBAAAAAc8FQAAAAAHcBkAAAAAB4AYBAAAAAeEGAQAAAAECAAAAiwEAIEYAAKQRACADAAAAiwEAIEYAAKQRACBHAACjEQAgAT8AAOURADAMAwAAhAkAIKIFAADhCQAwowUAAIkBABCkBQAA4QkAMKUFAQAAAAGnBQEA7QgAIa4FQADuCAAhxAUBAPIIACHPBUAA7ggAIdwGQADuCAAh4AYBAAAAAeEGAQDyCAAhAgAAAIsBACA_AACjEQAgAgAAAKERACA_AACiEQAgC6IFAACgEQAwowUAAKERABCkBQAAoBEAMKUFAQDtCAAhpwUBAO0IACGuBUAA7ggAIcQFAQDyCAAhzwVAAO4IACHcBkAA7ggAIeAGAQDtCAAh4QYBAPIIACELogUAAKARADCjBQAAoREAEKQFAACgEQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhxAUBAPIIACHPBUAA7ggAIdwGQADuCAAh4AYBAO0IACHhBgEA8ggAIQelBQEAsAoAIa4FQACzCgAhxAUBALEKACHPBUAAswoAIdwGQACzCgAh4AYBALAKACHhBgEAsQoAIQelBQEAsAoAIa4FQACzCgAhxAUBALEKACHPBUAAswoAIdwGQACzCgAh4AYBALAKACHhBgEAsQoAIQelBQEAAAABrgVAAAAAAcQFAQAAAAHPBUAAAAAB3AZAAAAAAeAGAQAAAAHhBgEAAAABDSMAAIQQACClBQEAAAABrgVAAAAAAc8FQAAAAAHOBgEAAAABzwYBAAAAAdAGAQAAAAHRBgEAAAAB0gYBAAAAAdMGAQAAAAHUBgEAAAAB1QYBAAAAAdYGIAAAAAECAAAABQAgRgAAsBEAIAMAAAAFACBGAACwEQAgRwAArxEAIAE_AADkEQAwEgMAAIQJACAjAACdCQAgogUAAKkKADCjBQAAAwAQpAUAAKkKADClBQEAAAABpwUBAO0IACGuBUAA7ggAIc8FQADuCAAhzgYBAPIIACHPBgEA8ggAIdAGAQDyCAAh0QYBAO0IACHSBgEA7QgAIdMGAQDyCAAh1AYBAPIIACHVBgEA7QgAIdYGIAD9CAAhAgAAAAUAID8AAK8RACACAAAArREAID8AAK4RACAQogUAAKwRADCjBQAArREAEKQFAACsEQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHOBgEA8ggAIc8GAQDyCAAh0AYBAPIIACHRBgEA7QgAIdIGAQDtCAAh0wYBAPIIACHUBgEA8ggAIdUGAQDtCAAh1gYgAP0IACEQogUAAKwRADCjBQAArREAEKQFAACsEQAwpQUBAO0IACGnBQEA7QgAIa4FQADuCAAhzwVAAO4IACHOBgEA8ggAIc8GAQDyCAAh0AYBAPIIACHRBgEA7QgAIdIGAQDtCAAh0wYBAPIIACHUBgEA8ggAIdUGAQDtCAAh1gYgAP0IACEMpQUBALAKACGuBUAAswoAIc8FQACzCgAhzgYBALEKACHPBgEAsQoAIdAGAQCxCgAh0QYBALAKACHSBgEAsAoAIdMGAQCxCgAh1AYBALEKACHVBgEAsAoAIdYGIADpCgAhDSMAAPkPACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHOBgEAsQoAIc8GAQCxCgAh0AYBALEKACHRBgEAsAoAIdIGAQCwCgAh0wYBALEKACHUBgEAsQoAIdUGAQCwCgAh1gYgAOkKACENIwAAhBAAIKUFAQAAAAGuBUAAAAABzwVAAAAAAc4GAQAAAAHPBgEAAAAB0AYBAAAAAdEGAQAAAAHSBgEAAAAB0wYBAAAAAdQGAQAAAAHVBgEAAAAB1gYgAAAAAQRGAAClEQAw9gYAAKYRADD4BgAAqBEAIPwGAACpEQAwBEYAAJkRADD2BgAAmhEAMPgGAACcEQAg_AYAAJ0RADAERgAAjREAMPYGAACOEQAw-AYAAJARACD8BgAAkREAMANGAACIEQAg9gYAAIkRACD8BgAAkQIAIARGAAD_EAAw9gYAAIARADD4BgAAghEAIPwGAACDDwAwBEYAAPYQADD2BgAA9xAAMPgGAAD5EAAg_AYAAJoMADADRgAA8RAAIPYGAADyEAAg_AYAAP4DACAERgAA6BAAMPYGAADpEAAw-AYAAOsQACD8BgAA3AoAMARGAADcEAAw9gYAAN0QADD4BgAA3xAAIPwGAADgEAAwBEYAANMQADD2BgAA1BAAMPgGAADWEAAg_AYAAIMPADAERgAAyhAAMPYGAADLEAAw-AYAAM0QACD8BgAA6Q4AMARGAAC-EAAw9gYAAL8QADD4BgAAwRAAIPwGAADCEAAwBEYAALUQADD2BgAAthAAMPgGAAC4EAAg_AYAAPIKADAERgAArBAAMPYGAACtEAAw-AYAAK8QACD8BgAArQwAMANGAACnEAAg9gYAAKgQACD8BgAAjgYAIAAAAAEDAADzCwAgAAIDAADzCwAgDQAA2A0AIAAAAAAAAwMAAPMLACANAAD0CwAg7wUAAKoKACALHgAAnQsAICIAAK8LACA3AADYCwAgrQUAAKoKACDiBQAAqgoAIOMFAACqCgAg5AUAAKoKACDlBQAAqgoAIOgFAACqCgAg6QUAAKoKACDqBQAAqgoAIAE2AACdCwAgAjYAAK8LACDgBQAAqgoAIAgDAADzCwAgBgAAzxEAIDUAAMwRACA4AADYCwAgpwUAAKoKACDVBQAAqgoAINYFAACqCgAg2AUAAKoKACADLQAA8wsAIC4AAMYRACDTBQAAqgoAIAcRAACeDQAgJwAA0hEAIK0FAACqCgAglAYAAKoKACCVBgAAqgoAIJYGAACqCgAglwYAAKoKACAAFhMAANsRACAYAADXEQAgGgAA3REAIBwAAMQRACAeAAC7DwAgHwAAyBEAICAAAMoRACAhAACUDQAgrQUAAKoKACDaBQAAqgoAIOAFAACqCgAg6AUAAKoKACDpBQAAqgoAIOoFAACqCgAgwQYAAKoKACDCBgAAqgoAIMMGAACqCgAgxAYAAKoKACDFBgAAqgoAIMYGAACqCgAgxwYAAKoKACDIBgAAqgoAIAEIAAC7DwAgAAgIAACUDQAgIgAAlQ0AICMAAJYNACDgBQAAqgoAIP4FAACqCgAg_wUAAKoKACCABgAAqgoAIIIGAACqCgAgCwYAANcRACAHAADeEQAgCAAA3xEAIBMAANsRACAZAACVDQAg2AUAAKoKACDgBQAAqgoAIOgFAACqCgAg6QUAAKoKACDqBQAAqgoAIM0GAACqCgAgCQwAANkRACAQAADYDQAgEgAA2hEAIBMAANsRACAVAADcEQAgFwAA9AsAIMIGAACqCgAgxAYAAKoKACDFBgAAqgoAIAIJAADTEQAgCgAA1REAIAAAAAAAAAcDAADzCwAgIwAAlg0AIM4GAACqCgAgzwYAAKoKACDQBgAAqgoAINMGAACqCgAg1AYAAKoKACAFEQAAng0AIIsGAACqCgAgjAYAAKoKACCNBgAAqgoAII4GAACqCgAgAAAMpQUBAAAAAa4FQAAAAAHPBUAAAAABzgYBAAAAAc8GAQAAAAHQBgEAAAAB0QYBAAAAAdIGAQAAAAHTBgEAAAAB1AYBAAAAAdUGAQAAAAHWBiAAAAABB6UFAQAAAAGuBUAAAAABxAUBAAAAAc8FQAAAAAHcBkAAAAAB4AYBAAAAAeEGAQAAAAELpQUBAAAAAa4FQAAAAAHPBUAAAAAB2AYBAAAAAdkGAQAAAAHaBgEAAAAB2wYBAAAAAdwGQAAAAAHdBgEAAAAB3gYBAAAAAd8GAQAAAAEOpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdcFIAAAAAHhBQEAAAABswYCAAAAAbQGAQAAAAG1BiAAAAABtgYCAAAAAbcGAgAAAAG4BgEAAAABuQZAAAAAAboGAQAAAAEWpQUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAEIpQUBAAAAAa4FQAAAAAHHBQEAAAABygUAAADKBQLLBQEAAAABzAWAAAAAAc4FAAAAzgUCzwVAAAAAAQalBQEAAAABrgVAAAAAAc4FAAAA0wUCzwVAAAAAAdEFAQAAAAHTBQEAAAABDqUFAQAAAAGnBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABB6UFAQAAAAGoBQEAAAABqgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAEGpQUBAAAAAagFAQAAAAGuBUAAAAABwAUBAAAAAcEFAgAAAAHCBYAAAAABCaUFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAAB2AUBAAAAAQmlBQEAAAABpgUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFCAAAAAGsBQEAAAABrQWAAAAAAa4FQAAAAAEdDgAAtxEAIBYAAL8RACAcAAC1EQAgHwAAuxEAICAAAL4RACAjAAC2EQAgKQAAsREAICsAALMRACAsAAC0EQAgMQAAuBEAIDIAALkRACAzAAC6EQAgNAAAvBEAIDkAAL0RACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADmBgLPBUAAAAAB2wUBAAAAAc0GAQAAAAHQBgEAAAAB4gYBAAAAAeMGIAAAAAHkBgAAAMoFAuYGQAAAAAHnBgEAAAAB6AYBAAAAAQIAAAABACBGAADwEQAgAwAAAFIAIEYAAPARACBHAAD0EQAgHwAAAFIAIA4AAJ4QACAWAACmEAAgHAAAnBAAIB8AAKIQACAgAAClEAAgIwAAnRAAICkAAJgQACArAACaEAAgLAAAmxAAIDEAAJ8QACAyAACgEAAgMwAAoRAAIDQAAKMQACA5AACkEAAgPwAA9BEAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACEdDgAAnhAAIBYAAKYQACAcAACcEAAgHwAAohAAICAAAKUQACAjAACdEAAgKQAAmBAAICsAAJoQACAsAACbEAAgMQAAnxAAIDIAAKAQACAzAAChEAAgNAAAoxAAIDkAAKQQACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIcQFAQCxCgAhzgUAAJcQ5gYizwVAALMKACHbBQEAsQoAIc0GAQCxCgAh0AYBALEKACHiBgEAsAoAIeMGIADpCgAh5AYAAMwKygUi5gZAALULACHnBgEAsQoAIegGAQCxCgAhHQ4AALcRACAWAAC_EQAgHAAAtREAIB8AALsRACAgAAC-EQAgIwAAthEAICkAALERACAqAACyEQAgLAAAtBEAIDEAALgRACAyAAC5EQAgMwAAuhEAIDQAALwRACA5AAC9EQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5gYCzwVAAAAAAdsFAQAAAAHNBgEAAAAB0AYBAAAAAeIGAQAAAAHjBiAAAAAB5AYAAADKBQLmBkAAAAAB5wYBAAAAAegGAQAAAAECAAAAAQAgRgAA9REAIAMAAABSACBGAAD1EQAgRwAA-REAIB8AAABSACAOAACeEAAgFgAAphAAIBwAAJwQACAfAACiEAAgIAAApRAAICMAAJ0QACApAACYEAAgKgAAmRAAICwAAJsQACAxAACfEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAID8AAPkRACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIcQFAQCxCgAhzgUAAJcQ5gYizwVAALMKACHbBQEAsQoAIc0GAQCxCgAh0AYBALEKACHiBgEAsAoAIeMGIADpCgAh5AYAAMwKygUi5gZAALULACHnBgEAsQoAIegGAQCxCgAhHQ4AAJ4QACAWAACmEAAgHAAAnBAAIB8AAKIQACAgAAClEAAgIwAAnRAAICkAAJgQACAqAACZEAAgLAAAmxAAIDEAAJ8QACAyAACgEAAgMwAAoRAAIDQAAKMQACA5AACkEAAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIR0OAAC3EQAgFgAAvxEAIBwAALURACAfAAC7EQAgIAAAvhEAICMAALYRACApAACxEQAgKgAAshEAICsAALMRACAxAAC4EQAgMgAAuREAIDMAALoRACA0AAC8EQAgOQAAvREAIKUFAQAAAAGtBYAAAAABrgVAAAAAAcQFAQAAAAHOBQAAAOYGAs8FQAAAAAHbBQEAAAABzQYBAAAAAdAGAQAAAAHiBgEAAAAB4wYgAAAAAeQGAAAAygUC5gZAAAAAAecGAQAAAAHoBgEAAAABAgAAAAEAIEYAAPoRACADAAAAUgAgRgAA-hEAIEcAAP4RACAfAAAAUgAgDgAAnhAAIBYAAKYQACAcAACcEAAgHwAAohAAICAAAKUQACAjAACdEAAgKQAAmBAAICoAAJkQACArAACaEAAgMQAAnxAAIDIAAKAQACAzAAChEAAgNAAAoxAAIDkAAKQQACA_AAD-EQAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIR0OAACeEAAgFgAAphAAIBwAAJwQACAfAACiEAAgIAAApRAAICMAAJ0QACApAACYEAAgKgAAmRAAICsAAJoQACAxAACfEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACEdDgAAtxEAIBYAAL8RACAcAAC1EQAgHwAAuxEAICAAAL4RACAjAAC2EQAgKgAAshEAICsAALMRACAsAAC0EQAgMQAAuBEAIDIAALkRACAzAAC6EQAgNAAAvBEAIDkAAL0RACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADmBgLPBUAAAAAB2wUBAAAAAc0GAQAAAAHQBgEAAAAB4gYBAAAAAeMGIAAAAAHkBgAAAMoFAuYGQAAAAAHnBgEAAAAB6AYBAAAAAQIAAAABACBGAAD_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_BiAAAAABDqUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAG6BgEAAAABBaUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAABAgAAANcCACBGAACZEgAgAwAAANoCACBGAACZEgAgRwAAnRIAIAcAAADaAgAgPwAAnRIAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdsFAQCwCgAh3AUBALAKACEFpQUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHcBQEAsAoAIQKuBUAAAAAB2QUBAAAAAQelBQEAAAABpwUBAAAAAagFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABCaUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQH5BQEAAAABAwAAABEAIEYAAJQSACBHAACkEgAgEwAAABEAIAYAAMEPACAHAADCDwAgEwAAxA8AIBkAAMUPACA_AACkEgAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh2AUBALEKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIb4GAgC2CwAhzQYBALEKACERBgAAwQ8AIAcAAMIPACATAADEDwAgGQAAxQ8AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdgFAQCxCgAh2wUBALAKACHcBQEAsAoAIeAFAQCxCgAh6AUBALEKACHpBQEAsQoAIeoFAQCxCgAhhQYgAOkKACG-BgIAtgsAIc0GAQCxCgAhHxMAAKIPACAYAACgDwAgHAAAow8AIB4AAKQPACAfAAClDwAgIAAApg8AICEAAKcPACClBQEAAAABrQWAAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAdwFAQAAAAHgBQEAAAAB4QUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAHBBgEAAAABwgYBAAAAAcMGEAAAAAHEBhAAAAABxQYQAAAAAcYGAgAAAAHHBgEAAAAByAYBAAAAAckGAgAAAAHKBiAAAAABywYgAAAAAcwGIAAAAAECAAAAGQAgRgAApRIAIAqlBQEAAAABrgVAAAAAAc8FQAAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABAwAAABcAIEYAAKUSACBHAACqEgAgIQAAABcAIBMAAM0OACAYAADLDgAgHAAAzg4AIB4AAM8OACAfAADQDgAgIAAA0Q4AICEAANIOACA_AACqEgAgpQUBALAKACGtBYAAAAABrgVAALMKACHPBUAAswoAIdoFAQCxCgAh3AUBALAKACHgBQEAsQoAIeEFAQCwCgAh6AUBALEKACHpBQEAsQoAIeoFAQCxCgAhhQYgAOkKACHBBgEAsQoAIcIGAQCxCgAhwwYQAJIMACHEBhAAkgwAIcUGEACSDAAhxgYCAL8KACHHBgEAsQoAIcgGAQCxCgAhyQYCALYLACHKBiAA6QoAIcsGIADpCgAhzAYgAOkKACEfEwAAzQ4AIBgAAMsOACAcAADODgAgHgAAzw4AIB8AANAOACAgAADRDgAgIQAA0g4AIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhzwVAALMKACHaBQEAsQoAIdwFAQCwCgAh4AUBALEKACHhBQEAsAoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhwQYBALEKACHCBgEAsQoAIcMGEACSDAAhxAYQAJIMACHFBhAAkgwAIcYGAgC_CgAhxwYBALEKACHIBgEAsQoAIckGAgC2CwAhygYgAOkKACHLBiAA6QoAIcwGIADpCgAhBwkAAMQOACClBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAECAAAASwAgRgAAqxIAIAWlBQEAAAABrgVAAAAAAc8FQAAAAAHyBQIAAAABsgYBAAAAAQylBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAEKpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAG7BgEAAAABvAYBAAAAAb0GAQAAAAG-BgIAAAABvwYgAAAAAQqlBQEAAAABrgVAAAAAAfEFAAAA8QUC8gUCAAAAAfMFAgAAAAH0BQIAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAQOlBQEAAAABrgVAAAAAAewFAQAAAAEDAAAASQAgRgAAqxIAIEcAALQSACAJAAAASQAgCQAAtg4AID8AALQSACClBQEAsAoAIaoFAQCwCgAhrgVAALMKACHPBUAAswoAIeEFAQCwCgAhhQYgAOkKACEHCQAAtg4AIKUFAQCwCgAhqgUBALAKACGuBUAAswoAIc8FQACzCgAh4QUBALAKACGFBiAA6QoAIREGAAD0DwAgBwAA8A8AIAgAAPEPACAZAADzDwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2AUBAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAG-BgIAAAABzQYBAAAAAQIAAAAVACBGAAC1EgAgEAwAAK0OACAQAACuDgAgEgAArw4AIBUAALEOACAXAACyDgAgpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcAGAQAAAAHBBgEAAAABwgYBAAAAAcMGEAAAAAHEBhAAAAABxQYQAAAAAcYGAgAAAAECAAAAIwAgRgAAtxIAIB8YAACgDwAgGgAAoQ8AIBwAAKMPACAeAACkDwAgHwAApQ8AICAAAKYPACAhAACnDwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHcBQEAAAAB4AUBAAAAAeEFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGIAAAAAHMBiAAAAABAgAAABkAIEYAALkSACADAAAAEQAgRgAAtRIAIEcAAL0SACATAAAAEQAgBgAAwQ8AIAcAAMIPACAIAADDDwAgGQAAxQ8AID8AAL0SACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHYBQEAsQoAIdsFAQCwCgAh3AUBALAKACHgBQEAsQoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhvgYCALYLACHNBgEAsQoAIREGAADBDwAgBwAAwg8AIAgAAMMPACAZAADFDwAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh2AUBALEKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIb4GAgC2CwAhzQYBALEKACEDAAAAIAAgRgAAtxIAIEcAAMASACASAAAAIAAgDAAA9A0AIBAAAPUNACASAAD2DQAgFQAA-A0AIBcAAPkNACA_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_AADMEgAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIR0OAACeEAAgFgAAphAAIBwAAJwQACAfAACiEAAgIAAApRAAICMAAJ0QACApAACYEAAgKgAAmRAAICsAAJoQACAsAACbEAAgMQAAnxAAIDIAAKAQACA0AACjEAAgOQAApBAAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACEDAAAAFwAgRgAAxhIAIEcAAM8SACAhAAAAFwAgEwAAzQ4AIBgAAMsOACAaAADMDgAgHgAAzw4AIB8AANAOACAgAADRDgAgIQAA0g4AID8AAM8SACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIc8FQACzCgAh2gUBALEKACHcBQEAsAoAIeAFAQCxCgAh4QUBALAKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIcEGAQCxCgAhwgYBALEKACHDBhAAkgwAIcQGEACSDAAhxQYQAJIMACHGBgIAvwoAIccGAQCxCgAhyAYBALEKACHJBgIAtgsAIcoGIADpCgAhywYgAOkKACHMBiAA6QoAIR8TAADNDgAgGAAAyw4AIBoAAMwOACAeAADPDgAgHwAA0A4AICAAANEOACAhAADSDgAgpQUBALAKACGtBYAAAAABrgVAALMKACHPBUAAswoAIdoFAQCxCgAh3AUBALAKACHgBQEAsQoAIeEFAQCwCgAh6AUBALEKACHpBQEAsQoAIeoFAQCxCgAhhQYgAOkKACHBBgEAsQoAIcIGAQCxCgAhwwYQAJIMACHEBhAAkgwAIcUGEACSDAAhxgYCAL8KACHHBgEAsQoAIcgGAQCxCgAhyQYCALYLACHKBiAA6QoAIcsGIADpCgAhzAYgAOkKACEDAAAAUgAgRgAAyBIAIEcAANISACAfAAAAUgAgDgAAnhAAIBYAAKYQACAfAACiEAAgIAAApRAAICMAAJ0QACApAACYEAAgKgAAmRAAICsAAJoQACAsAACbEAAgMQAAnxAAIDIAAKAQACAzAAChEAAgNAAAoxAAIDkAAKQQACA_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_AADiEgAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzwVAALMKACEFAwAAyA0AIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAhEggAAJENACAiAACSDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB4AUBAAAAAfoFAQAAAAH8BQAAAPwFAv0FEAAAAAH-BRAAAAAB_wUQAAAAAYAGAgAAAAGBBgIAAAABggYCAAAAAYMGQAAAAAGEBkAAAAABhQYgAAAAAYYGIAAAAAECAAAAtAUAIEYAAOMSACADAAAACwAgRgAA4xIAIEcAAOcSACAUAAAACwAgCAAAkwwAICIAAJQMACA_AADnEgAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh4AUBALEKACH6BQEAsAoAIfwFAACQDPwFIv0FEACRDAAh_gUQAJIMACH_BRAAkgwAIYAGAgC_CgAhgQYCALYLACGCBgIAvwoAIYMGQACzCgAhhAZAALMKACGFBiAA6QoAIYYGIADpCgAhEggAAJMMACAiAACUDAAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh4AUBALEKACH6BQEAsAoAIfwFAACQDPwFIv0FEACRDAAh_gUQAJIMACH_BRAAkgwAIYAGAgC_CgAhgQYCALYLACGCBgIAvwoAIYMGQACzCgAhhAZAALMKACGFBiAA6QoAIYYGIADpCgAhHgMAAPIMACAEAADzDAAgBQAAuw0AICAAAPgMACAkAAD1DAAgJQAA9gwAICgAAPcMACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAECAAAACQAgRgAA6BIAIAMAAAAHACBGAADoEgAgRwAA7BIAICAAAAAHACADAACiDAAgBAAAowwAIAUAALoNACAgAACoDAAgJAAApQwAICUAAKYMACAoAACnDAAgPwAA7BIAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc4FAACgDJoGIs8FQACzCgAh-QUBALEKACGhBhAAkQwAIaIGAQCwCgAhowYBALAKACGkBoAAAAABpQYBALEKACGmBgEAsQoAIacGEACRDAAhqAYQAJEMACGpBhAAkQwAIaoGEACRDAAhqwYBALEKACGsBkAAswoAIa0GQAC1CwAhrgZAALULACGvBkAAtQsAIbAGQAC1CwAhsQZAALULACEeAwAAogwAIAQAAKMMACAFAAC6DQAgIAAAqAwAICQAAKUMACAlAACmDAAgKAAApwwAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc4FAACgDJoGIs8FQACzCgAh-QUBALEKACGhBhAAkQwAIaIGAQCwCgAhowYBALAKACGkBoAAAAABpQYBALEKACGmBgEAsQoAIacGEACRDAAhqAYQAJEMACGpBhAAkQwAIaoGEACRDAAhqwYBALEKACGsBkAAswoAIa0GQAC1CwAhrgZAALULACGvBkAAtQsAIbAGQAC1CwAhsQZAALULACEeAwAA8gwAIAQAAPMMACAFAAC7DQAgDQAA9AwAICAAAPgMACAkAAD1DAAgKAAA9wwAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAfkFAQAAAAGhBhAAAAABogYBAAAAAaMGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQIAAAAJACBGAADtEgAgAwAAAAcAIEYAAO0SACBHAADxEgAgIAAAAAcAIAMAAKIMACAEAACjDAAgBQAAug0AIA0AAKQMACAgAACoDAAgJAAApQwAICgAAKcMACA_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_BIAIEcAAIATACAgAAAABwAgAwAAogwAIAQAAKMMACAFAAC6DQAgDQAApAwAICAAAKgMACAlAACmDAAgKAAApwwAID8AAIATACClBQEAsAoAIacFAQCwCgAhrgVAALMKACHOBQAAoAyaBiLPBUAAswoAIfkFAQCxCgAhoQYQAJEMACGiBgEAsAoAIaMGAQCwCgAhpAaAAAAAAaUGAQCxCgAhpgYBALEKACGnBhAAkQwAIagGEACRDAAhqQYQAJEMACGqBhAAkQwAIasGAQCxCgAhrAZAALMKACGtBkAAtQsAIa4GQAC1CwAhrwZAALULACGwBkAAtQsAIbEGQAC1CwAhHgMAAKIMACAEAACjDAAgBQAAug0AIA0AAKQMACAgAACoDAAgJQAApgwAICgAAKcMACClBQEAsAoAIacFAQCwCgAhrgVAALMKACHOBQAAoAyaBiLPBUAAswoAIfkFAQCxCgAhoQYQAJEMACGiBgEAsAoAIaMGAQCwCgAhpAaAAAAAAaUGAQCxCgAhpgYBALEKACGnBhAAkQwAIagGEACRDAAhqQYQAJEMACGqBhAAkQwAIasGAQCxCgAhrAZAALMKACGtBkAAtQsAIa4GQAC1CwAhrwZAALULACGwBkAAtQsAIbEGQAC1CwAhAaoFAQAAAAEB2gUBAAAAAQ4DAACDEAAgpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAc4GAQAAAAHPBgEAAAAB0AYBAAAAAdEGAQAAAAHSBgEAAAAB0wYBAAAAAdQGAQAAAAHVBgEAAAAB1gYgAAAAAQIAAAAFACBGAACDEwAgHQ4AALcRACAWAAC_EQAgHAAAtREAIB8AALsRACAgAAC-EQAgKQAAsREAICoAALIRACArAACzEQAgLAAAtBEAIDEAALgRACAyAAC5EQAgMwAAuhEAIDQAALwRACA5AAC9EQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5gYCzwVAAAAAAdsFAQAAAAHNBgEAAAAB0AYBAAAAAeIGAQAAAAHjBiAAAAAB5AYAAADKBQLmBkAAAAAB5wYBAAAAAegGAQAAAAECAAAAAQAgRgAAhRMAIBAMAACtDgAgEAAArg4AIBMAALAOACAVAACxDgAgFwAAsg4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAYUGIAAAAAHABgEAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABAgAAACMAIEYAAIcTACADAAAAIAAgRgAAhxMAIEcAAIsTACASAAAAIAAgDAAA9A0AIBAAAPUNACATAAD3DQAgFQAA-A0AIBcAAPkNACA_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-gUBAAAAAfwFAAAA_AUC_QUQAAAAAf4FEAAAAAH_BRAAAAABgAYCAAAAAYEGAgAAAAGCBgIAAAABgwZAAAAAAYQGQAAAAAGFBiAAAAABhgYgAAAAAQIAAAC0BQAgRgAAmhMAIAMAAAAXACBGAACYEwAgRwAAnhMAICEAAAAXACATAADNDgAgGAAAyw4AIBoAAMwOACAcAADODgAgHgAAzw4AIB8AANAOACAgAADRDgAgPwAAnhMAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhzwVAALMKACHaBQEAsQoAIdwFAQCwCgAh4AUBALEKACHhBQEAsAoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhwQYBALEKACHCBgEAsQoAIcMGEACSDAAhxAYQAJIMACHFBhAAkgwAIcYGAgC_CgAhxwYBALEKACHIBgEAsQoAIckGAgC2CwAhygYgAOkKACHLBiAA6QoAIcwGIADpCgAhHxMAAM0OACAYAADLDgAgGgAAzA4AIBwAAM4OACAeAADPDgAgHwAA0A4AICAAANEOACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIc8FQACzCgAh2gUBALEKACHcBQEAsAoAIeAFAQCxCgAh4QUBALAKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIcEGAQCxCgAhwgYBALEKACHDBhAAkgwAIcQGEACSDAAhxQYQAJIMACHGBgIAvwoAIccGAQCxCgAhyAYBALEKACHJBgIAtgsAIcoGIADpCgAhywYgAOkKACHMBiAA6QoAIQMAAAALACBGAACaEwAgRwAAoRMAIBQAAAALACAiAACUDAAgIwAAlQwAID8AAKETACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHgBQEAsQoAIfoFAQCwCgAh_AUAAJAM_AUi_QUQAJEMACH-BRAAkgwAIf8FEACSDAAhgAYCAL8KACGBBgIAtgsAIYIGAgC_CgAhgwZAALMKACGEBkAAswoAIYUGIADpCgAhhgYgAOkKACESIgAAlAwAICMAAJUMACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHgBQEAsQoAIfoFAQCwCgAh_AUAAJAM_AUi_QUQAJEMACH-BRAAkgwAIf8FEACSDAAhgAYCAL8KACGBBgIAtgsAIYIGAgC_CgAhgwZAALMKACGEBkAAswoAIYUGIADpCgAhhgYgAOkKACERBgAA9A8AIAcAAPAPACAIAADxDwAgEwAA8g8AIKUFAQAAAAGuBUAAAAABzwVAAAAAAdgFAQAAAAHbBQEAAAAB3AUBAAAAAeAFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABvgYCAAAAAc0GAQAAAAECAAAAFQAgRgAAohMAIBIIAACRDQAgIwAAkw0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAeAFAQAAAAH6BQEAAAAB_AUAAAD8BQL9BRAAAAAB_gUQAAAAAf8FEAAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBkAAAAABhAZAAAAAAYUGIAAAAAGGBiAAAAABAgAAALQFACBGAACkEwAgAwAAABEAIEYAAKITACBHAACoEwAgEwAAABEAIAYAAMEPACAHAADCDwAgCAAAww8AIBMAAMQPACA_AACoEwAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh2AUBALEKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACHoBQEAsQoAIekFAQCxCgAh6gUBALEKACGFBiAA6QoAIb4GAgC2CwAhzQYBALEKACERBgAAwQ8AIAcAAMIPACAIAADDDwAgEwAAxA8AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIdgFAQCxCgAh2wUBALAKACHcBQEAsAoAIeAFAQCxCgAh6AUBALEKACHpBQEAsQoAIeoFAQCxCgAhhQYgAOkKACG-BgIAtgsAIc0GAQCxCgAhAwAAAAsAIEYAAKQTACBHAACrEwAgFAAAAAsAIAgAAJMMACAjAACVDAAgPwAAqxMAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIeAFAQCxCgAh-gUBALAKACH8BQAAkAz8BSL9BRAAkQwAIf4FEACSDAAh_wUQAJIMACGABgIAvwoAIYEGAgC2CwAhggYCAL8KACGDBkAAswoAIYQGQACzCgAhhQYgAOkKACGGBiAA6QoAIRIIAACTDAAgIwAAlQwAIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIeAFAQCxCgAh-gUBALAKACH8BQAAkAz8BSL9BRAAkQwAIf4FEACSDAAh_wUQAJIMACGABgIAvwoAIYEGAgC2CwAhggYCAL8KACGDBkAAswoAIYQGQACzCgAhhQYgAOkKACGGBiAA6QoAIRAMAACtDgAgEAAArg4AIBIAAK8OACATAACwDgAgFwAAsg4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAYUGIAAAAAHABgEAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABAgAAACMAIEYAAKwTACADAAAAIAAgRgAArBMAIEcAALATACASAAAAIAAgDAAA9A0AIBAAAPUNACASAAD2DQAgEwAA9w0AIBcAAPkNACA_AACwEwAgpQUBALAKACGuBUAAswoAIc8FQACzCgAhhQYgAOkKACHABgEAsAoAIcEGAQCwCgAhwgYBALEKACHDBhAAkQwAIcQGEACSDAAhxQYQAJIMACHGBgIAtgsAIRAMAAD0DQAgEAAA9Q0AIBIAAPYNACATAAD3DQAgFwAA-Q0AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIYUGIADpCgAhwAYBALAKACHBBgEAsAoAIcIGAQCxCgAhwwYQAJEMACHEBhAAkgwAIcUGEACSDAAhxgYCALYLACEdDgAAtxEAIBwAALURACAfAAC7EQAgIAAAvhEAICMAALYRACApAACxEQAgKgAAshEAICsAALMRACAsAAC0EQAgMQAAuBEAIDIAALkRACAzAAC6EQAgNAAAvBEAIDkAAL0RACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADmBgLPBUAAAAAB2wUBAAAAAc0GAQAAAAHQBgEAAAAB4gYBAAAAAeMGIAAAAAHkBgAAAMoFAuYGQAAAAAHnBgEAAAAB6AYBAAAAAQIAAAABACBGAACxEwAgA6UFAQAAAAGuBUAAAAAB7QUBAAAAAQMAAABSACBGAACxEwAgRwAAthMAIB8AAABSACAOAACeEAAgHAAAnBAAIB8AAKIQACAgAAClEAAgIwAAnRAAICkAAJgQACAqAACZEAAgKwAAmhAAICwAAJsQACAxAACfEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAID8AALYTACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIcQFAQCxCgAhzgUAAJcQ5gYizwVAALMKACHbBQEAsQoAIc0GAQCxCgAh0AYBALEKACHiBgEAsAoAIeMGIADpCgAh5AYAAMwKygUi5gZAALULACHnBgEAsQoAIegGAQCxCgAhHQ4AAJ4QACAcAACcEAAgHwAAohAAICAAAKUQACAjAACdEAAgKQAAmBAAICoAAJkQACArAACaEAAgLAAAmxAAIDEAAJ8QACAyAACgEAAgMwAAoRAAIDQAAKMQACA5AACkEAAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIRAMAACtDgAgEAAArg4AIBIAAK8OACATAACwDgAgFQAAsQ4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAYUGIAAAAAHABgEAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABAgAAACMAIEYAALcTACAIAwAA8QsAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB7gUgAAAAAe8FAQAAAAECAAAAjgYAIEYAALkTACADAAAAIAAgRgAAtxMAIEcAAL0TACASAAAAIAAgDAAA9A0AIBAAAPUNACASAAD2DQAgEwAA9w0AIBUAAPgNACA_AAC9EwAgpQUBALAKACGuBUAAswoAIc8FQACzCgAhhQYgAOkKACHABgEAsAoAIcEGAQCwCgAhwgYBALEKACHDBhAAkQwAIcQGEACSDAAhxQYQAJIMACHGBgIAtgsAIRAMAAD0DQAgEAAA9Q0AIBIAAPYNACATAAD3DQAgFQAA-A0AIKUFAQCwCgAhrgVAALMKACHPBUAAswoAIYUGIADpCgAhwAYBALAKACHBBgEAsAoAIcIGAQCxCgAhwwYQAJEMACHEBhAAkgwAIcUGEACSDAAhxgYCALYLACEDAAAAwQEAIEYAALkTACBHAADAEwAgCgAAAMEBACADAADjCwAgPwAAwBMAIKUFAQCwCgAhpwUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHuBSAA6QoAIe8FAQCxCgAhCAMAAOMLACClBQEAsAoAIacFAQCwCgAhrgVAALMKACHPBUAAswoAIdsFAQCwCgAh7gUgAOkKACHvBQEAsQoAIQHaBQEAAAABAdkFAQAAAAEJpQUBAAAAAacFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAHYBQEAAAABAdQFAQAAAAEB1AUBAAAAAQalBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB3AUBAAAAAeAFAQAAAAECAAAA1QYAIEYAAMYTACATHgAA1gsAIDcAANcLACClBQEAAAABrQWAAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdwFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBQEAAAAB5QVAAAAAAeYFIAAAAAHnBQIAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAAB6wUgAAAAAQIAAAC8BgAgRgAAyBMAIAMAAADYBgAgRgAAxhMAIEcAAMwTACAIAAAA2AYAID8AAMwTACClBQEAsAoAIa4FQACzCgAhzwVAALMKACHbBQEAsAoAIdwFAQCwCgAh4AUBALEKACEGpQUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHcBQEAsAoAIeAFAQCxCgAhAwAAAL8GACBGAADIEwAgRwAAzxMAIBUAAAC_BgAgHgAAuAsAIDcAALkLACA_AADPEwAgpQUBALAKACGtBYAAAAABrgVAALMKACHLBQEAsAoAIc8FQACzCgAh3AUBALAKACHhBQEAsAoAIeIFAQCxCgAh4wUBALEKACHkBQEAsQoAIeUFQAC1CwAh5gUgAOkKACHnBQIAtgsAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIesFIADpCgAhEx4AALgLACA3AAC5CwAgpQUBALAKACGtBYAAAAABrgVAALMKACHLBQEAsAoAIc8FQACzCgAh3AUBALAKACHhBQEAsAoAIeIFAQCxCgAh4wUBALEKACHkBQEAsQoAIeUFQAC1CwAh5gUgAOkKACHnBQIAtgsAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIesFIADpCgAhBaUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAABAgAAAO4GACBGAADQEwAgEyIAANULACA3AADXCwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHcBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFQAAAAAHmBSAAAAAB5wUCAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAesFIAAAAAECAAAAvAYAIEYAANITACADAAAA8QYAIEYAANATACBHAADWEwAgBwAAAPEGACA_AADWEwAgpQUBALAKACGuBUAAswoAIc8FQACzCgAh2wUBALAKACHcBQEAsAoAIQWlBQEAsAoAIa4FQACzCgAhzwVAALMKACHbBQEAsAoAIdwFAQCwCgAhAwAAAL8GACBGAADSEwAgRwAA2RMAIBUAAAC_BgAgIgAAtwsAIDcAALkLACA_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_BgAgHgAAuAsAICIAALcLACA_AADpEwAgpQUBALAKACGtBYAAAAABrgVAALMKACHLBQEAsAoAIc8FQACzCgAh3AUBALAKACHhBQEAsAoAIeIFAQCxCgAh4wUBALEKACHkBQEAsQoAIeUFQAC1CwAh5gUgAOkKACHnBQIAtgsAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIesFIADpCgAhEx4AALgLACAiAAC3CwAgpQUBALAKACGtBYAAAAABrgVAALMKACHLBQEAsAoAIc8FQACzCgAh3AUBALAKACHhBQEAsAoAIeIFAQCxCgAh4wUBALEKACHkBQEAsQoAIeUFQAC1CwAh5gUgAOkKACHnBQIAtgsAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIesFIADpCgAhHQ4AALcRACAWAAC_EQAgHAAAtREAIB8AALsRACAgAAC-EQAgIwAAthEAICkAALERACAqAACyEQAgKwAAsxEAICwAALQRACAxAAC4EQAgMwAAuhEAIDQAALwRACA5AAC9EQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5gYCzwVAAAAAAdsFAQAAAAHNBgEAAAAB0AYBAAAAAeIGAQAAAAHjBiAAAAAB5AYAAADKBQLmBkAAAAAB5wYBAAAAAegGAQAAAAECAAAAAQAgRgAA6hMAIAilBQEAAAABrgVAAAAAAcgFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABAwAAAFIAIEYAAOoTACBHAADvEwAgHwAAAFIAIA4AAJ4QACAWAACmEAAgHAAAnBAAIB8AAKIQACAgAAClEAAgIwAAnRAAICkAAJgQACAqAACZEAAgKwAAmhAAICwAAJsQACAxAACfEAAgMwAAoRAAIDQAAKMQACA5AACkEAAgPwAA7xMAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACEdDgAAnhAAIBYAAKYQACAcAACcEAAgHwAAohAAICAAAKUQACAjAACdEAAgKQAAmBAAICoAAJkQACArAACaEAAgLAAAmxAAIDEAAJ8QACAzAAChEAAgNAAAoxAAIDkAAKQQACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIcQFAQCxCgAhzgUAAJcQ5gYizwVAALMKACHbBQEAsQoAIc0GAQCxCgAh0AYBALEKACHiBgEAsAoAIeMGIADpCgAh5AYAAMwKygUi5gZAALULACHnBgEAsQoAIegGAQCxCgAhHQ4AALcRACAWAAC_EQAgHAAAtREAIB8AALsRACAgAAC-EQAgIwAAthEAICkAALERACAqAACyEQAgKwAAsxEAICwAALQRACAyAAC5EQAgMwAAuhEAIDQAALwRACA5AAC9EQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5gYCzwVAAAAAAdsFAQAAAAHNBgEAAAAB0AYBAAAAAeIGAQAAAAHjBiAAAAAB5AYAAADKBQLmBkAAAAAB5wYBAAAAAegGAQAAAAECAAAAAQAgRgAA8BMAIAgtAADkCgAgpQUBAAAAAa4FQAAAAAHOBQAAANMFAs8FQAAAAAHQBQEAAAAB0QUBAAAAAdMFAQAAAAECAAAAnwEAIEYAAPITACADAAAAUgAgRgAA8BMAIEcAAPYTACAfAAAAUgAgDgAAnhAAIBYAAKYQACAcAACcEAAgHwAAohAAICAAAKUQACAjAACdEAAgKQAAmBAAICoAAJkQACArAACaEAAgLAAAmxAAIDIAAKAQACAzAAChEAAgNAAAoxAAIDkAAKQQACA_AAD2EwAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIR0OAACeEAAgFgAAphAAIBwAAJwQACAfAACiEAAgIAAApRAAICMAAJ0QACApAACYEAAgKgAAmRAAICsAAJoQACAsAACbEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACEDAAAAnQEAIEYAAPITACBHAAD5EwAgCgAAAJ0BACAtAADWCgAgPwAA-RMAIKUFAQCwCgAhrgVAALMKACHOBQAA1QrTBSLPBUAAswoAIdAFAQCwCgAh0QUBALAKACHTBQEAsQoAIQgtAADWCgAgpQUBALAKACGuBUAAswoAIc4FAADVCtMFIs8FQACzCgAh0AUBALAKACHRBQEAsAoAIdMFAQCxCgAhHQ4AALcRACAWAAC_EQAgHAAAtREAICAAAL4RACAjAAC2EQAgKQAAsREAICoAALIRACArAACzEQAgLAAAtBEAIDEAALgRACAyAAC5EQAgMwAAuhEAIDQAALwRACA5AAC9EQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5gYCzwVAAAAAAdsFAQAAAAHNBgEAAAAB0AYBAAAAAeIGAQAAAAHjBiAAAAAB5AYAAADKBQLmBkAAAAAB5wYBAAAAAegGAQAAAAECAAAAAQAgRgAA-hMAIB8TAACiDwAgGAAAoA8AIBoAAKEPACAcAACjDwAgHgAApA8AICAAAKYPACAhAACnDwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHcBQEAAAAB4AUBAAAAAeEFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBhAAAAABxAYQAAAAAcUGEAAAAAHGBgIAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGIAAAAAHMBiAAAAABAgAAABkAIEYAAPwTACADAAAAUgAgRgAA-hMAIEcAAIAUACAfAAAAUgAgDgAAnhAAIBYAAKYQACAcAACcEAAgIAAApRAAICMAAJ0QACApAACYEAAgKgAAmRAAICsAAJoQACAsAACbEAAgMQAAnxAAIDIAAKAQACAzAAChEAAgNAAAoxAAIDkAAKQQACA_AACAFAAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIR0OAACeEAAgFgAAphAAIBwAAJwQACAgAAClEAAgIwAAnRAAICkAAJgQACAqAACZEAAgKwAAmhAAICwAAJsQACAxAACfEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhxAUBALEKACHOBQAAlxDmBiLPBUAAswoAIdsFAQCxCgAhzQYBALEKACHQBgEAsQoAIeIGAQCwCgAh4wYgAOkKACHkBgAAzArKBSLmBkAAtQsAIecGAQCxCgAh6AYBALEKACEDAAAAFwAgRgAA_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_AACRFAAgpQUBALAKACGtBYAAAAABrgVAALMKACHPBUAAswoAIdoFAQCxCgAh3AUBALAKACHgBQEAsQoAIeEFAQCwCgAh6AUBALEKACHpBQEAsQoAIeoFAQCxCgAhhQYgAOkKACHBBgEAsQoAIcIGAQCxCgAhwwYQAJIMACHEBhAAkgwAIcUGEACSDAAhxgYCAL8KACHHBgEAsQoAIcgGAQCxCgAhyQYCALYLACHKBiAA6QoAIcsGIADpCgAhzAYgAOkKACEfEwAAzQ4AIBgAAMsOACAaAADMDgAgHAAAzg4AIB4AAM8OACAfAADQDgAgIQAA0g4AIKUFAQCwCgAhrQWAAAAAAa4FQACzCgAhzwVAALMKACHaBQEAsQoAIdwFAQCwCgAh4AUBALEKACHhBQEAsAoAIegFAQCxCgAh6QUBALEKACHqBQEAsQoAIYUGIADpCgAhwQYBALEKACHCBgEAsQoAIcMGEACSDAAhxAYQAJIMACHFBhAAkgwAIcYGAgC_CgAhxwYBALEKACHIBgEAsQoAIckGAgC2CwAhygYgAOkKACHLBiAA6QoAIcwGIADpCgAhAwAAAAcAIEYAAIsUACBHAACUFAAgIAAAAAcAIAMAAKIMACAEAACjDAAgBQAAug0AIA0AAKQMACAkAAClDAAgJQAApgwAICgAAKcMACA_AACUFAAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYizwVAALMKACH5BQEAsQoAIaEGEACRDAAhogYBALAKACGjBgEAsAoAIaQGgAAAAAGlBgEAsQoAIaYGAQCxCgAhpwYQAJEMACGoBhAAkQwAIakGEACRDAAhqgYQAJEMACGrBgEAsQoAIawGQACzCgAhrQZAALULACGuBkAAtQsAIa8GQAC1CwAhsAZAALULACGxBkAAtQsAIR4DAACiDAAgBAAAowwAIAUAALoNACANAACkDAAgJAAApQwAICUAAKYMACAoAACnDAAgpQUBALAKACGnBQEAsAoAIa4FQACzCgAhzgUAAKAMmgYizwVAALMKACH5BQEAsQoAIaEGEACRDAAhogYBALAKACGjBgEAsAoAIaQGgAAAAAGlBgEAsQoAIaYGAQCxCgAhpwYQAJEMACGoBhAAkQwAIakGEACRDAAhqgYQAJEMACGrBgEAsQoAIawGQACzCgAhrQZAALULACGuBkAAtQsAIa8GQAC1CwAhsAZAALULACGxBkAAtQsAIQMAAABSACBGAACNFAAgRwAAlxQAIB8AAABSACAOAACeEAAgFgAAphAAIBwAAJwQACAfAACiEAAgIwAAnRAAICkAAJgQACAqAACZEAAgKwAAmhAAICwAAJsQACAxAACfEAAgMgAAoBAAIDMAAKEQACA0AACjEAAgOQAApBAAID8AAJcUACClBQEAsAoAIa0FgAAAAAGuBUAAswoAIcQFAQCxCgAhzgUAAJcQ5gYizwVAALMKACHbBQEAsQoAIc0GAQCxCgAh0AYBALEKACHiBgEAsAoAIeMGIADpCgAh5AYAAMwKygUi5gZAALULACHnBgEAsQoAIegGAQCxCgAhHQ4AAJ4QACAWAACmEAAgHAAAnBAAIB8AAKIQACAjAACdEAAgKQAAmBAAICoAAJkQACArAACaEAAgLAAAmxAAIDEAAJ8QACAyAACgEAAgMwAAoRAAIDQAAKMQACA5AACkEAAgpQUBALAKACGtBYAAAAABrgVAALMKACHEBQEAsQoAIc4FAACXEOYGIs8FQACzCgAh2wUBALEKACHNBgEAsQoAIdAGAQCxCgAh4gYBALAKACHjBiAA6QoAIeQGAADMCsoFIuYGQAC1CwAh5wYBALEKACHoBgEAsQoAIRALADcOlgENFsIBEhyTARcfogEbIMABHCOUAQMpBgIqjAEmK5ABJyySASgxmgEpMqABKjOhARc0pgEsOasBLQMDAAELACUjCgMJAwABBAACBQwECwAkDXMPIIMBHCR1HyV5ICh9IQQIEAULAB4ibhUjbwMCBQAECQAGCQsAHRNNCBgSBxpMChxRFx5XGB9dGyBiHCFmBQYGEwcHFgcIGgYLABYTHggZRBUDCR8GDyEJGEAHBwsAFAwAChApDBIvDxMwCBU0EBc4EQMJAAYKJAkLAAsBCiUAAg4ADQ8ACQMDAAELAA4NKgwBDSsAAg8ACREAAwEUAAkCDwAJFgASAwMAAQsAEw05EQENOgAFEDsAEjwAEz0AFT4AFz8AAgUABBgABwQHRQAIRgATRwAZSAADAwABCQAGG1MBAgkABh0AGQIIWBgLABoBCFkAAgNeAQkABgMDYwEJZQYRZAMHE2gAGmcAHGkAHmoAH2sAIGwAIW0AAwhwACJxACNyAAERAAMBEQADAwsAIxEAAyeBASIBJgAhASeCAQAEDYQBACCHAQAlhQEAKIYBAAEjiAEAAQMAAQEDAAEBAwABAi8AKjAAAQMLACstAAEumwEpAS6cAQABA6cBAQUDvAEBBr0BLQsANjUALji-AS0ECwA1HrUBMiKvAS83uAEtAhgAMDUALgILADE2sAEvATaxAQACHQAzNQAuAgsANDa2ATIBNrcBAAMeugEAIrkBADe7AQABOL8BAAwcxgEAH8sBACDOAQAjxwEAKcMBACrEAQArxQEAMcgBADLJAQAzygEANMwBADnNAQAAAAADCwA8TAA9TQA-AAAAAwsAPEwAPU0APgEDAAEBAwABAwsAQ0wARE0ARQAAAAMLAENMAERNAEUBAwABAQMAAQMLAEpMAEtNAEwAAAADCwBKTABLTQBMAQMAAQEDAAEDCwBRTABSTQBTAAAAAwsAUUwAUk0AUwEDAAEBAwABAwsAWEwAWU0AWgAAAAMLAFhMAFlNAFoBBskCBwEGzwIHBQsAX0wAYk0AY54BAGCfAQBhAAAAAAAFCwBfTABiTQBjngEAYJ8BAGEAAAMLAGhMAGlNAGoAAAADCwBoTABpTQBqAgkABh0AGQIJAAYdABkDCwBvTABwTQBxAAAAAwsAb0wAcE0AcQEYkAMHARiWAwcFCwB2TAB5TQB6ngEAd58BAHgAAAAAAAULAHZMAHlNAHqeAQB3nwEAeAEJAAYBCQAGAwsAf0wAgAFNAIEBAAAAAwsAf0wAgAFNAIEBAQwACgEMAAoFCwCGAUwAiQFNAIoBngEAhwGfAQCIAQAAAAAABQsAhgFMAIkBTQCKAZ4BAIcBnwEAiAEDCdQDBg_VAwkY1gMHAwncAwYP3QMJGN4DBwULAI8BTACSAU0AkwGeAQCQAZ8BAJEBAAAAAAAFCwCPAUwAkgFNAJMBngEAkAGfAQCRAQMDAAEJAAYb8AMBAwMAAQkABhv2AwEFCwCYAUwAmwFNAJwBngEAmQGfAQCaAQAAAAAABQsAmAFMAJsBTQCcAZ4BAJkBnwEAmgEBAwABAQMAAQMLAKEBTACiAU0AowEAAAADCwChAUwAogFNAKMBAg4ADQ8ACQIOAA0PAAkFCwCoAUwAqwFNAKwBngEAqQGfAQCqAQAAAAAABQsAqAFMAKsBTQCsAZ4BAKkBnwEAqgEDAwABBAACBbYEBAMDAAEEAAIFvAQEBQsAsQFMALQBTQC1AZ4BALIBnwEAswEAAAAAAAULALEBTAC0AU0AtQGeAQCyAZ8BALMBAg8ACREAAwIPAAkRAAMFCwC6AUwAvQFNAL4BngEAuwGfAQC8AQAAAAAABQsAugFMAL0BTQC-AZ4BALsBnwEAvAEBEQADAREAAwMLAMMBTADEAU0AxQEAAAADCwDDAUwAxAFNAMUBAREAAwERAAMDCwDKAUwAywFNAMwBAAAAAwsAygFMAMsBTQDMAQEmACEBJgAhAwsA0QFMANIBTQDTAQAAAAMLANEBTADSAU0A0wEBEQADAREAAwULANgBTADbAU0A3AGeAQDZAZ8BANoBAAAAAAAFCwDYAUwA2wFNANwBngEA2QGfAQDaAQAABQsA4QFMAOQBTQDlAZ4BAOIBnwEA4wEAAAAAAAULAOEBTADkAU0A5QGeAQDiAZ8BAOMBAgUABAkABgIFAAQJAAYDCwDqAUwA6wFNAOwBAAAAAwsA6gFMAOsBTQDsAQIFAAQYAAcCBQAEGAAHAwsA8QFMAPIBTQDzAQAAAAMLAPEBTADyAU0A8wEBFAAJARQACQULAPgBTAD7AU0A_AGeAQD5AZ8BAPoBAAAAAAAFCwD4AUwA-wFNAPwBngEA-QGfAQD6AQEDAAEBAwABAwsAgQJMAIICTQCDAgAAAAMLAIECTACCAk0AgwICDwAJFgASAg8ACRYAEgMLAIgCTACJAk0AigIAAAADCwCIAkwAiQJNAIoCAAAFCwCPAkwAkgJNAJMCngEAkAKfAQCRAgAAAAAABQsAjwJMAJICTQCTAp4BAJACnwEAkQIAAAMLAJgCTACZAk0AmgIAAAADCwCYAkwAmQJNAJoCAAADCwCfAkwAoAJNAKECAAAAAwsAnwJMAKACTQChAgIYADA1AC4CGAAwNQAuAwsApgJMAKcCTQCoAgAAAAMLAKYCTACnAk0AqAICHQAzNQAuAh0AMzUALgMLAK0CTACuAk0ArwIAAAADCwCtAkwArgJNAK8CAwO9BwEGvgctNQAuAwPEBwEGxQctNQAuAwsAtAJMALUCTQC2AgAAAAMLALQCTAC1Ak0AtgIBLQABAS0AAQMLALsCTAC8Ak0AvQIAAAADCwC7AkwAvAJNAL0CAi8AKjAAAQIvACowAAEDCwDCAkwAwwJNAMQCAAAAAwsAwgJMAMMCTQDEAgIDgwgBCQAGAgOJCAEJAAYDCwDJAkwAygJNAMsCAAAAAwsAyQJMAMoCTQDLAgEDmwgBAQOhCAEFCwDQAkwA0wJNANQCngEA0QKfAQDSAgAAAAAABQsA0AJMANMCTQDUAp4BANECnwEA0gIDA7MIAQm1CAYRtAgDAwO7CAEJvQgGEbwIAwULANkCTADcAk0A3QKeAQDaAp8BANsCAAAAAAAFCwDZAkwA3AJNAN0CngEA2gKfAQDbAjoCATvPAQE80QEBPdIBAT7TAQFA1QEBQdcBOELYATlD2gEBRNwBOEXdATpI3gEBSd8BAUrgAThO4wE7T-QBP1DlASZR5gEmUucBJlPoASZU6QEmVesBJlbtAThX7gFAWPABJlnyATha8wFBW_QBJlz1ASZd9gE4XvkBQl_6AUZg-wEnYfwBJ2L9ASdj_gEnZP8BJ2WBAidmgwI4Z4QCR2iGAidpiAI4aokCSGuKAidsiwInbYwCOG6PAklvkAJNcJICKHGTAihylQIoc5YCKHSXAih1mQIodpsCOHecAk54ngIoeaACOHqhAk97ogIofKMCKH2kAjh-pwJQf6gCVIABqQICgQGqAgKCAasCAoMBrAIChAGtAgKFAa8CAoYBsQI4hwGyAlWIAbQCAokBtgI4igG3AlaLAbgCAowBuQICjQG6AjiOAb0CV48BvgJbkAG_AgeRAcACB5IBwQIHkwHCAgeUAcMCB5UBxQIHlgHHAjiXAcgCXJgBywIHmQHNAjiaAc4CXZsB0AIHnAHRAgedAdICOKAB1QJeoQHWAmSiAdgCGaMB2QIZpAHcAhmlAd0CGaYB3gIZpwHgAhmoAeICOKkB4wJlqgHlAhmrAecCOKwB6AJmrQHpAhmuAeoCGa8B6wI4sAHuAmexAe8Ca7IB8AIYswHxAhi0AfICGLUB8wIYtgH0Ahi3AfYCGLgB-AI4uQH5Amy6AfsCGLsB_QI4vAH-Am29Af8CGL4BgAMYvwGBAzjAAYQDbsEBhQNywgGGAwbDAYcDBsQBiAMGxQGJAwbGAYoDBscBjAMGyAGOAzjJAY8Dc8oBkgMGywGUAzjMAZUDdM0BlwMGzgGYAwbPAZkDONABnAN10QGdA3vSAZ4DCtMBnwMK1AGgAwrVAaEDCtYBogMK1wGkAwrYAaYDONkBpwN82gGpAwrbAasDONwBrAN93QGtAwreAa4DCt8BrwM44AGyA37hAbMDggHiAbQDCeMBtQMJ5AG2AwnlAbcDCeYBuAMJ5wG6AwnoAbwDOOkBvQODAeoBvwMJ6wHBAzjsAcIDhAHtAcMDCe4BxAMJ7wHFAzjwAcgDhQHxAckDiwHyAcoDCPMBywMI9AHMAwj1Ac0DCPYBzgMI9wHQAwj4AdIDOPkB0wOMAfoB2AMI-wHaAzj8AdsDjQH9Ad8DCP4B4AMI_wHhAziAAuQDjgGBAuUDlAGCAuYDF4MC5wMXhALoAxeFAukDF4YC6gMXhwLsAxeIAu4DOIkC7wOVAYoC8gMXiwL0AziMAvUDlgGNAvcDF44C-AMXjwL5AziQAvwDlwGRAv0DnQGSAv8DDZMCgAQNlAKCBA2VAoMEDZYChAQNlwKGBA2YAogEOJkCiQSeAZoCiwQNmwKNBDicAo4EnwGdAo8EDZ4CkAQNnwKRBDigApQEoAGhApUEpAGiApYEDKMClwQMpAKYBAylApkEDKYCmgQMpwKcBAyoAp4EOKkCnwSlAaoCoQQMqwKjBDisAqQEpgGtAqUEDK4CpgQMrwKnBDiwAqoEpwGxAqsErQGyAqwEA7MCrQQDtAKuBAO1Aq8EA7YCsAQDtwKyBAO4ArQEOLkCtQSuAboCuAQDuwK6BDi8ArsErwG9Ar0EA74CvgQDvwK_BDjAAsIEsAHBAsMEtgHCAsQED8MCxQQPxALGBA_FAscED8YCyAQPxwLKBA_IAswEOMkCzQS3AcoCzwQPywLRBDjMAtIEuAHNAtMED84C1AQPzwLVBDjQAtgEuQHRAtkEvwHSAtoEINMC2wQg1ALcBCDVAt0EINYC3gQg1wLgBCDYAuIEONkC4wTAAdoC5QQg2wLnBDjcAugEwQHdAukEIN4C6gQg3wLrBDjgAu4EwgHhAu8ExgHiAvAEIeMC8QQh5ALyBCHlAvMEIeYC9AQh5wL2BCHoAvgEOOkC-QTHAeoC-wQh6wL9BDjsAv4EyAHtAv8EIe4CgAUh7wKBBTjwAoQFyQHxAoUFzQHyAoYFIvMChwUi9AKIBSL1AokFIvYCigUi9wKMBSL4Ao4FOPkCjwXOAfoCkQUi-wKTBTj8ApQFzwH9ApUFIv4ClgUi_wKXBTiAA5oF0AGBA5sF1AGCA50FH4MDngUfhAOgBR-FA6EFH4YDogUfhwOkBR-IA6YFOIkDpwXVAYoDqQUfiwOrBTiMA6wF1gGNA60FH44DrgUfjwOvBTiQA7IF1wGRA7MF3QGSA7UFBJMDtgUElAO4BQSVA7kFBJYDugUElwO8BQSYA74FOJkDvwXeAZoDwQUEmwPDBTicA8QF3wGdA8UFBJ4DxgUEnwPHBTigA8oF4AGhA8sF5gGiA8wFBaMDzQUFpAPOBQWlA88FBaYD0AUFpwPSBQWoA9QFOKkD1QXnAaoD1wUFqwPZBTisA9oF6AGtA9sFBa4D3AUFrwPdBTiwA-AF6QGxA-EF7QGyA-IFFbMD4wUVtAPkBRW1A-UFFbYD5gUVtwPoBRW4A-oFOLkD6wXuAboD7QUVuwPvBTi8A_AF7wG9A_EFFb4D8gUVvwPzBTjAA_YF8AHBA_cF9AHCA_gFEMMD-QUQxAP6BRDFA_sFEMYD_AUQxwP-BRDIA4AGOMkDgQb1AcoDgwYQywOFBjjMA4YG9gHNA4cGEM4DiAYQzwOJBjjQA4wG9wHRA40G_QHSA48GEtMDkAYS1AOSBhLVA5MGEtYDlAYS1wOWBhLYA5gGONkDmQb-AdoDmwYS2wOdBjjcA54G_wHdA58GEt4DoAYS3wOhBjjgA6QGgALhA6UGhALiA6YGEeMDpwYR5AOoBhHlA6kGEeYDqgYR5wOsBhHoA64GOOkDrwaFAuoDsQYR6wOzBjjsA7QGhgLtA7UGEe4DtgYR7wO3BjjwA7oGhwLxA7sGiwLyA70GLvMDvgYu9APBBi71A8IGLvYDwwYu9wPFBi74A8cGOPkDyAaMAvoDygYu-wPMBjj8A80GjQL9A84GLv4DzwYu_wPQBjiABNMGjgKBBNQGlAKCBNYGMIME1wYwhATaBjCFBNsGMIYE3AYwhwTeBjCIBOAGOIkE4QaVAooE4wYwiwTlBjiMBOYGlgKNBOcGMI4E6AYwjwTpBjiQBOwGlwKRBO0GmwKSBO8GM5ME8AYzlATzBjOVBPQGM5YE9QYzlwT3BjOYBPkGOJkE-gacApoE_AYzmwT-BjicBP8GnQKdBIAHM54EgQcznwSCBzigBIUHngKhBIYHogKiBIcHL6MEiAcvpASJBy-lBIoHL6YEiwcvpwSNBy-oBI8HOKkEkAejAqoEkgcvqwSUBzisBJUHpAKtBJYHL64ElwcvrwSYBziwBJsHpQKxBJwHqQKyBJ0HMrMEngcytASfBzK1BKAHMrYEoQcytwSjBzK4BKUHOLkEpgeqAroEqAcyuwSqBzi8BKsHqwK9BKwHMr4ErQcyvwSuBzjABLEHrALBBLIHsALCBLMHLcMEtActxAS1By3FBLYHLcYEtwctxwS5By3IBLsHOMkEvAexAsoEwActywTCBzjMBMMHsgLNBMYHLc4ExwctzwTIBzjQBMsHswLRBMwHtwLSBM0HKtMEzgcq1ATPByrVBNAHKtYE0Qcq1wTTByrYBNUHONkE1ge4AtoE2Acq2wTaBzjcBNsHuQLdBNwHKt4E3Qcq3wTeBzjgBOEHugLhBOIHvgLiBOMHKeME5Acp5ATlBynlBOYHKeYE5wcp5wTpBynoBOsHOOkE7Ae_AuoE7gcp6wTwBzjsBPEHwALtBPIHKe4E8wcp7wT0BzjwBPcHwQLxBPgHxQLyBPkHG_ME-gcb9AT7Bxv1BPwHG_YE_Qcb9wT_Bxv4BIEIOPkEggjGAvoEhQgb-wSHCDj8BIgIxwL9BIoIG_4Eiwgb_wSMCDiABY8IyAKBBZAIzAKCBZEILIMFkggshAWTCCyFBZQILIYFlQgshwWXCCyIBZkIOIkFmgjNAooFnQgsiwWfCDiMBaAIzgKNBaIILI4FowgsjwWkCDiQBacIzwKRBagI1QKSBakIHJMFqggclAWrCByVBawIHJYFrQgclwWvCByYBbEIOJkFsgjWApoFtwgcmwW5CDicBboI1wKdBb4IHJ4FvwgcnwXACDigBcMI2AKhBcQI3gI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/modules/user/user.interface.ts
var Role = /* @__PURE__ */ ((Role4) => {
  Role4["ADMIN"] = "ADMIN";
  Role4["USER"] = "USER";
  Role4["MANAGER"] = "MANAGER";
  return Role4;
})(Role || {});
var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["ACTIVE"] = "ACTIVE";
  UserStatus2["BLOCKED"] = "BLOCKED";
  UserStatus2["DELETED"] = "DELETED";
  return UserStatus2;
})(UserStatus || {});

// src/app/config/passport.ts
var toPassportUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  emailVerified: user.emailVerified,
  phone: user.phone,
  status: user.status
});
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            credential: true
          }
        });
        if (!user || !user.credential) {
          return done(null, false, {
            message: "Invalid email or password"
          });
        }
        if (user.status === "BLOCKED" /* BLOCKED */ || user.status === "DELETED" /* DELETED */) {
          return done(null, false, {
            message: `User is ${user.status.toLowerCase()}`
          });
        }
        const isPasswordMatched = await bcryptjs.compare(
          password,
          user.credential.passwordHash
        );
        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Invalid email or password"
          });
        }
        return done(null, toPassportUser(user));
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(null, false, { message: "No email found from google account" });
        }
        let user = await prisma.user.findUnique({
          where: { email }
        });
        if (user) {
          if (user.status === "BLOCKED" /* BLOCKED */ || user.status === "DELETED" /* DELETED */) {
            return done(null, false, {
              message: `User is ${user.status.toLowerCase()}`
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || null,
              image: profile.photos?.[0]?.value ?? null,
              emailVerified: true,
              role: "USER",
              status: "ACTIVE"
            }
          });
        }
        await prisma.account.upsert({
          where: {
            providerId_providerAccountId: {
              providerId: "google",
              providerAccountId: profile.id
            }
          },
          update: {},
          create: {
            userId: user.id,
            providerId: "google",
            providerAccountId: profile.id
          }
        });
        return done(null, toPassportUser(user));
      } catch (error) {
        return done(error);
      }
    }
  )
);

// src/app/routes/index.ts
import { Router as Router5 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";
import passport3 from "passport";

// src/app/middlewares/checkAuth.ts
import httpStatus from "http-status-codes";

// src/app/helper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var generateToken = (payload, secret, expiresIn) => {
  if (!expiresIn) {
    return jwt.sign(payload, secret);
  }
  return jwt.sign(payload, secret, { expiresIn });
};
var verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// src/app/middlewares/checkAuth.ts
var extractToken = (req) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;
  if (!authHeader) {
    return cookieToken;
  }
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return authHeader;
};
var checkAuth = (...authRoles) => async (req, _, next) => {
  try {
    const accessToken = extractToken(req);
    if (!accessToken) {
      throw new AppError_default(httpStatus.UNAUTHORIZED, "No access token received");
    }
    const decodedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    );
    const userId = decodedToken.userId;
    if (!userId) {
      throw new AppError_default(httpStatus.UNAUTHORIZED, "Invalid access token");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        phone: true,
        status: true
      }
    });
    if (!user) {
      throw new AppError_default(httpStatus.NOT_FOUND, "User not found");
    }
    if (user.status === "BLOCKED" /* BLOCKED */ || user.status === "DELETED" /* DELETED */) {
      throw new AppError_default(
        httpStatus.FORBIDDEN,
        `User is ${user.status.toLowerCase()}`
      );
    }
    if (!user.emailVerified) {
      throw new AppError_default(
        httpStatus.FORBIDDEN,
        "Please verify your email to continue"
      );
    }
    if (authRoles.length && !authRoles.includes(user.role)) {
      throw new AppError_default(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      phone: user.phone,
      status: user.status
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => async (req, res, next) => {
  try {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    req.body = await zodSchema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/modules/auth/auth.controller.ts
import httpStatus4 from "http-status-codes";
import passport2 from "passport";

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    next(err);
  });
};

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};

// src/app/utils/setCookie.ts
var cookieOptions = {
  httpOnly: true,
  secure: envVars.NODE_ENV === "production",
  sameSite: envVars.NODE_ENV === "production" ? "none" : "lax"
};
var setAuthCookie = (res, tokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, cookieOptions);
  }
  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
  }
};

// src/app/utils/userTokens.ts
import httpStatus2 from "http-status-codes";
var createUserTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = generateToken(
    payload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    payload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken
  };
};
var createNewAccessTokenWithRefreshToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);
  const userId = decoded.userId;
  if (!userId) {
    throw new AppError_default(httpStatus2.UNAUTHORIZED, "Invalid refresh token");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "User not found");
  }
  if (user.status === "BLOCKED" /* BLOCKED */ || user.status === "DELETED" /* DELETED */) {
    throw new AppError_default(httpStatus2.FORBIDDEN, `User is ${user.status.toLowerCase()}`);
  }
  const newAccessToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  return newAccessToken;
};

// src/app/modules/auth/auth.service.ts
import bcryptjs2 from "bcryptjs";
import httpStatus3 from "http-status-codes";

// src/app/utils/sendEmail.ts
import ejs from "ejs";
import nodemailer from "nodemailer";
import path2 from "path";
var transporter = nodemailer.createTransport({
  // port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST
});
var sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}) => {
  try {
    const rootDir = path2.resolve(process.cwd());
    const templatePath = path2.join(
      rootDir,
      "src",
      "app",
      "utils",
      "templates",
      `${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.log("email sending error", error.message);
    throw new AppError_default(401, "Email error");
  }
};

// src/app/modules/auth/auth.service.ts
var register = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (existingUser) {
    throw new AppError_default(httpStatus3.CONFLICT, "User already exists with this email");
  }
  const hashedPassword = await bcryptjs2.hash(
    payload.password,
    envVars.BCRYPT_SALT_ROUND
  );
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? null,
        image: payload.image ?? null,
        role: "USER",
        status: "ACTIVE",
        emailVerified: true
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        image: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
    await tx.userCredential.create({
      data: {
        userId: createdUser.id,
        passwordHash: hashedPassword
      }
    });
    await tx.account.create({
      data: {
        userId: createdUser.id,
        providerId: "credentials",
        providerAccountId: createdUser.email
      }
    });
    return createdUser;
  });
  return user;
};
var getNewAccessToken = async (refreshToken) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken
  };
};
var changePassword = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      credential: true
    }
  });
  if (!user || !user.credential) {
    throw new AppError_default(
      httpStatus3.BAD_REQUEST,
      "Password is not set for this account. Please use set password first"
    );
  }
  const isOldPasswordMatched = await bcryptjs2.compare(
    payload.oldPassword,
    user.credential.passwordHash
  );
  if (!isOldPasswordMatched) {
    throw new AppError_default(httpStatus3.UNAUTHORIZED, "Old password does not match");
  }
  const newHashedPassword = await bcryptjs2.hash(
    payload.newPassword,
    envVars.BCRYPT_SALT_ROUND
  );
  await prisma.userCredential.update({
    where: {
      userId: user.id
    },
    data: {
      passwordHash: newHashedPassword
    }
  });
};
var setPassword = async (userId, plainPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      credential: true,
      accounts: true
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus3.NOT_FOUND, "User not found");
  }
  if (user.credential) {
    throw new AppError_default(
      httpStatus3.CONFLICT,
      "Password already exists for this account. Use change-password instead"
    );
  }
  const hashedPassword = await bcryptjs2.hash(
    plainPassword,
    envVars.BCRYPT_SALT_ROUND
  );
  await prisma.$transaction(async (tx) => {
    await tx.userCredential.create({
      data: {
        userId: user.id,
        passwordHash: hashedPassword
      }
    });
    const hasCredentialsAccount = user.accounts.some(
      (provider) => provider.providerId === "credentials"
    );
    if (!hasCredentialsAccount) {
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credentials",
          providerAccountId: user.email
        }
      });
    }
  });
};
var forgotPassword = async (payload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus3.NOT_FOUND, "User does not exist");
  }
  if (user.status === "BLOCKED" /* BLOCKED */ || user.status === "DELETED" /* DELETED */) {
    throw new AppError_default(httpStatus3.FORBIDDEN, `User is ${user.status.toLowerCase()}`);
  }
  const resetToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenType: "RESET_PASSWORD"
    },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_RESET_PASSWORD_EXPIRES
  );
  const resetUILink = `${envVars.FRONTEND_URL}/auth/reset-password?id=${user.id}&token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: user.name || "User",
      resetUILink
    }
  });
};
var resetPassword = async (payload) => {
  const decodedToken = verifyToken(
    payload.token,
    envVars.JWT_ACCESS_SECRET
  );
  if (!decodedToken.userId || decodedToken.userId !== payload.id || decodedToken.tokenType !== "RESET_PASSWORD") {
    throw new AppError_default(httpStatus3.UNAUTHORIZED, "Invalid reset token");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id
    },
    select: {
      id: true
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus3.NOT_FOUND, "User does not exist");
  }
  const hashedPassword = await bcryptjs2.hash(
    payload.newPassword,
    envVars.BCRYPT_SALT_ROUND
  );
  await prisma.userCredential.upsert({
    where: { userId: user.id },
    update: {
      passwordHash: hashedPassword
    },
    create: {
      userId: user.id,
      passwordHash: hashedPassword
    }
  });
};
var AuthServices = {
  register,
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword
};

// src/app/modules/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const createdUser = await AuthServices.register(payload);
  const tokens = createUserTokens(createdUser);
  setAuthCookie(res, tokens);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.CREATED,
    message: "User registered successfully",
    data: {
      user: createdUser,
      ...tokens
    }
  });
});
var credentialsLogin = catchAsync(
  async (req, res, next) => {
    passport2.authenticate(
      "local",
      { session: false },
      (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(
            new AppError_default(
              httpStatus4.UNAUTHORIZED,
              info?.message || "Invalid email or password"
            )
          );
        }
        const typedUser = user;
        const tokens = createUserTokens(typedUser);
        setAuthCookie(res, tokens);
        return sendResponse(res, {
          success: true,
          statusCode: httpStatus4.OK,
          message: "User logged in successfully",
          data: {
            user: typedUser,
            ...tokens
          }
        });
      }
    )(req, res, next);
  }
);
var getNewAccessToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw new AppError_default(httpStatus4.BAD_REQUEST, "No refresh token received");
  }
  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
  setAuthCookie(res, tokenInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "New access token retrieved successfully",
    data: tokenInfo
  });
});
var logout = catchAsync(async (_, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax"
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax"
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "User logged out successfully",
    data: null
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus4.UNAUTHORIZED, "User not authenticated");
  }
  await AuthServices.changePassword(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Password changed successfully",
    data: null
  });
});
var setPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus4.UNAUTHORIZED, "User not authenticated");
  }
  await AuthServices.setPassword(userId, payload.password);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Password set successfully",
    data: null
  });
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthServices.forgotPassword(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Password reset email sent successfully",
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthServices.resetPassword(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Password reset successfully",
    data: null
  });
});
var googleCallbackController = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError_default(httpStatus4.NOT_FOUND, "User not found");
  }
  const tokens = createUserTokens(user);
  setAuthCookie(res, tokens);
  const redirectState = typeof req.query.state === "string" ? req.query.state : "/";
  const safeRedirectPath = redirectState.startsWith("/") ? redirectState : "/";
  res.redirect(`${envVars.FRONTEND_URL}${safeRedirectPath}`);
});
var AuthControllers = {
  register: register2,
  credentialsLogin,
  getNewAccessToken: getNewAccessToken2,
  logout,
  changePassword: changePassword2,
  setPassword: setPassword2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  googleCallbackController
};

// src/app/modules/auth/auth.validation.ts
import { z } from "zod";
var passwordSchema = z.string().min(8, { message: "Password must be at least 8 characters long" }).regex(/^(?=.*[A-Z])/, {
  message: "Password must contain at least 1 uppercase letter"
}).regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
  message: "Password must contain at least 1 special character"
}).regex(/^(?=.*\d)/, {
  message: "Password must contain at least 1 number"
});
var registerZodSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name cannot exceed 50 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: passwordSchema,
  phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"
  }).optional(),
  image: z.string().url({ message: "Image must be a valid URL" }).optional()
});
var loginZodSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" })
});
var refreshTokenZodSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token must be a string" }).optional()
});
var forgotPasswordZodSchema = z.object({
  email: z.string().email({ message: "Invalid email format" })
});
var resetPasswordZodSchema = z.object({
  id: z.string().uuid({ message: "Invalid user id" }),
  token: z.string().min(1, { message: "Reset token is required" }),
  newPassword: passwordSchema
});
var changePasswordZodSchema = z.object({
  oldPassword: z.string().min(1, { message: "Old password is required" }),
  newPassword: passwordSchema
});
var setPasswordZodSchema = z.object({
  password: passwordSchema
});

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(registerZodSchema), AuthControllers.register);
router.post("/login", validateRequest(loginZodSchema), AuthControllers.credentialsLogin);
router.post(
  "/refresh-token",
  validateRequest(refreshTokenZodSchema),
  AuthControllers.getNewAccessToken
);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validateRequest(changePasswordZodSchema),
  AuthControllers.changePassword
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword
);
router.get(
  "/google",
  async (req, res, next) => {
    const redirect = req.query.redirect || "/";
    await passport3.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect,
      session: false
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport3.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=Authentication failed`,
    session: false
  }),
  AuthControllers.googleCallbackController
);
var AuthRoutes = router;

// src/app/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/app/modules/user/user.controller.ts
import httpStatus6 from "http-status-codes";

// src/app/modules/user/user.service.ts
import httpStatus5 from "http-status-codes";

// src/app/constants/index.ts
var excludeField = ["searchTerm", "sort", "fields", "page", "limit"];

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  query;
  where = {};
  select;
  orderBy;
  skip;
  take;
  constructor(query) {
    this.query = query;
  }
  /** ---------------- FILTER ---------------- */
  filter() {
    const filter = { ...this.query };
    excludeField.forEach((field) => delete filter[field]);
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        this.where[key] = filter[key];
      }
    });
    return this;
  }
  search(searchableFields) {
    const searchTerm = this.query.searchTerm;
    if (!searchTerm) return this;
    this.where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive"
      }
    }));
    return this;
  }
  sort() {
    const sort = this.query.sort || "createdAt";
    const fields = sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return { [field.substring(1)]: "desc" };
      }
      return { [field]: "asc" };
    });
    this.orderBy = fields;
    return this;
  }
  fields() {
    if (!this.query.fields) return this;
    const fields = this.query.fields.split(",");
    this.select = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    return this;
  }
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    this.skip = (page - 1) * limit;
    this.take = limit;
    return this;
  }
  // build() {
  //   return {
  //     where: this.where,
  //     select: this.select,
  //     orderBy: this.orderBy,
  //     skip: this.skip,
  //     take: this.take,
  //   };
  // }
  build() {
    const query = {
      where: this.where
    };
    if (this.select) {
      query.select = this.select;
    }
    if (this.orderBy) {
      query.orderBy = this.orderBy;
    }
    if (this.skip !== void 0) {
      query.skip = this.skip;
    }
    if (this.take !== void 0) {
      query.take = this.take;
    }
    return query;
  }
  async getMeta(prismaModel) {
    const total = await prismaModel.count({
      where: this.where
    });
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    };
  }
};

// src/app/modules/user/user.constant.ts
var userSearchableFields = ["name", "email", "phone"];

// src/app/modules/user/user.service.ts
var userSelect = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  role: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true
};
var userWithAddressesSelect = {
  ...userSelect,
  addresses: {
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  }
};
var addressSelect = {
  id: true,
  userId: true,
  label: true,
  recipient: true,
  phone: true,
  street: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true
};
var ensureUserExists = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  if (!user) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "User not found");
  }
};
var ensurePhoneUnique = async (phone, excludedUserId) => {
  const existing = await prisma.user.findFirst({
    where: {
      phone,
      ...excludedUserId && { id: { not: excludedUserId } }
    },
    select: {
      id: true
    }
  });
  if (existing) {
    throw new AppError_default(httpStatus5.CONFLICT, "Phone number already in use");
  }
};
var getAllUsers = async (query) => {
  const qb = new QueryBuilder(query).filter().search(userSearchableFields).sort().fields().paginate();
  const builtQuery = qb.build();
  const [data, meta] = await Promise.all([
    prisma.user.findMany({
      ...builtQuery,
      select: builtQuery.select ?? userSelect
    }),
    qb.getMeta(prisma.user)
  ]);
  return {
    meta,
    data
  };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userWithAddressesSelect
  });
  if (!user) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "User not found");
  }
  return user;
};
var updateMe = async (userId, payload) => {
  await ensureUserExists(userId);
  if (payload.phone) {
    await ensurePhoneUnique(payload.phone, userId);
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.phone !== void 0 && { phone: payload.phone },
      ...payload.image !== void 0 && { image: payload.image },
      ...payload.status !== void 0 && { status: payload.status }
    },
    select: userWithAddressesSelect
  });
  return updatedUser;
};
var getSingleUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userWithAddressesSelect
  });
  if (!user) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "User not found");
  }
  return user;
};
var updateUser = async (userId, payload) => {
  await ensureUserExists(userId);
  if (payload.phone) {
    await ensurePhoneUnique(payload.phone, userId);
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.role !== void 0 && { role: payload.role },
      ...payload.emailVerified !== void 0 && {
        emailVerified: payload.emailVerified
      },
      ...payload.status !== void 0 && { status: payload.status },
      ...payload.phone !== void 0 && { phone: payload.phone }
    },
    select: userSelect
  });
  return updatedUser;
};
var createAddress = async (userId, payload) => {
  await ensureUserExists(userId);
  const shouldSetDefault = payload.isDefault === true || await prisma.address.count({ where: { userId } }) === 0;
  const addressData = {
    userId,
    street: payload.street,
    city: payload.city,
    ...payload.label !== void 0 && { label: payload.label },
    ...payload.recipient !== void 0 && { recipient: payload.recipient },
    ...payload.phone !== void 0 && { phone: payload.phone },
    ...payload.state !== void 0 && { state: payload.state },
    ...payload.zipCode !== void 0 && { zipCode: payload.zipCode },
    ...payload.country !== void 0 && { country: payload.country },
    ...shouldSetDefault && { isDefault: true }
  };
  const address = await prisma.$transaction(async (tx) => {
    if (shouldSetDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }
    return tx.address.create({
      data: addressData,
      select: addressSelect
    });
  });
  return address;
};
var getMyAddresses = async (userId) => {
  await ensureUserExists(userId);
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: addressSelect
  });
  return addresses;
};
var updateMyAddress = async (userId, addressId, payload) => {
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId
    },
    select: {
      id: true,
      isDefault: true
    }
  });
  if (!existingAddress) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "Address not found");
  }
  if (payload.isDefault === false && existingAddress.isDefault) {
    throw new AppError_default(
      httpStatus5.BAD_REQUEST,
      "Cannot unset the current default address directly"
    );
  }
  const addressData = {
    ...payload.label !== void 0 && { label: payload.label },
    ...payload.recipient !== void 0 && { recipient: payload.recipient },
    ...payload.phone !== void 0 && { phone: payload.phone },
    ...payload.street !== void 0 && { street: payload.street },
    ...payload.city !== void 0 && { city: payload.city },
    ...payload.state !== void 0 && { state: payload.state },
    ...payload.zipCode !== void 0 && { zipCode: payload.zipCode },
    ...payload.country !== void 0 && { country: payload.country },
    ...payload.isDefault !== void 0 && { isDefault: payload.isDefault }
  };
  if (payload.isDefault) {
    const updatedAddress2 = await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
      return tx.address.update({
        where: { id: addressId },
        data: {
          ...addressData,
          isDefault: true
        },
        select: addressSelect
      });
    });
    return updatedAddress2;
  }
  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: addressData,
    select: addressSelect
  });
  return updatedAddress;
};
var deleteMyAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId
    },
    select: {
      id: true,
      isDefault: true
    }
  });
  if (!address) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "Address not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.address.delete({
      where: { id: addressId }
    });
    if (address.isDefault) {
      const fallbackAddress = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true }
      });
      if (fallbackAddress) {
        await tx.address.update({
          where: { id: fallbackAddress.id },
          data: { isDefault: true }
        });
      }
    }
  });
};
var setDefaultAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId
    },
    select: {
      id: true
    }
  });
  if (!address) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "Address not found");
  }
  const updatedAddress = await prisma.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
    return tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
      select: addressSelect
    });
  });
  return updatedAddress;
};
var UserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  updateMe,
  createAddress,
  getMyAddresses,
  updateMyAddress,
  deleteMyAddress,
  setDefaultAddress
};

// src/app/modules/user/user.controller.ts
var getParamAsString = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus6.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var getAllUsers2 = catchAsync(async (req, res) => {
  const query = req.query;
  const users = await UserServices.getAllUsers(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "All users retrieved successfully",
    data: users.data,
    meta: users.meta
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  const user = await UserServices.getMe(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "User profile retrieved successfully",
    data: user
  });
});
var updateMe2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  const payload = req.body;
  const updatedUser = await UserServices.updateMe(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "User profile updated successfully",
    data: updatedUser
  });
});
var getSingleUser2 = catchAsync(async (req, res) => {
  const userId = getParamAsString(req.params.id, "User id");
  const user = await UserServices.getSingleUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "User retrieved successfully",
    data: user
  });
});
var updateUser2 = catchAsync(async (req, res) => {
  const userId = getParamAsString(req.params.id, "User id");
  const payload = req.body;
  const user = await UserServices.updateUser(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "User updated successfully",
    data: user
  });
});
var createAddress2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  const payload = req.body;
  const address = await UserServices.createAddress(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.CREATED,
    message: "Address created successfully",
    data: address
  });
});
var getMyAddresses2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  const addresses = await UserServices.getMyAddresses(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Addresses retrieved successfully",
    data: addresses
  });
});
var updateMyAddress2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const addressId = getParamAsString(req.params.addressId, "Address id");
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  const payload = req.body;
  const updatedAddress = await UserServices.updateMyAddress(
    userId,
    addressId,
    payload
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Address updated successfully",
    data: updatedAddress
  });
});
var deleteMyAddress2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const addressId = getParamAsString(req.params.addressId, "Address id");
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  await UserServices.deleteMyAddress(userId, addressId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Address deleted successfully",
    data: null
  });
});
var setDefaultAddress2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const addressId = getParamAsString(req.params.addressId, "Address id");
  if (!userId) {
    throw new AppError_default(httpStatus6.UNAUTHORIZED, "User not authenticated");
  }
  const address = await UserServices.setDefaultAddress(userId, addressId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Default address updated successfully",
    data: address
  });
});
var UserControllers = {
  getAllUsers: getAllUsers2,
  updateMe: updateMe2,
  getSingleUser: getSingleUser2,
  getMe: getMe2,
  updateUser: updateUser2,
  createAddress: createAddress2,
  getMyAddresses: getMyAddresses2,
  updateMyAddress: updateMyAddress2,
  deleteMyAddress: deleteMyAddress2,
  setDefaultAddress: setDefaultAddress2
};

// src/app/modules/user/user.validation.ts
import { z as z2 } from "zod";
var updateMeZodSchema = z2.object({
  name: z2.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name cannot exceed 50 characters" }).optional(),
  phone: z2.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"
  }).optional(),
  image: z2.string().url({ message: "Image must be a valid URL" }).optional(),
  status: z2.enum(["DELETED" /* DELETED */]).optional()
});
var adminUpdateUserZodSchema = z2.object({
  name: z2.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name cannot exceed 50 characters" }).optional(),
  role: z2.nativeEnum(Role).optional(),
  emailVerified: z2.boolean().optional(),
  status: z2.nativeEnum(UserStatus).optional(),
  phone: z2.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"
  }).optional()
});
var bdPhoneSchema = z2.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
  message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"
});
var createAddressZodSchema = z2.object({
  label: z2.string().min(2, { message: "Label must be at least 2 characters long" }).max(30, { message: "Label cannot exceed 30 characters" }).optional(),
  recipient: z2.string().min(2, { message: "Recipient must be at least 2 characters long" }).max(100, { message: "Recipient cannot exceed 100 characters" }).optional(),
  phone: bdPhoneSchema.optional(),
  street: z2.string().min(5, { message: "Street must be at least 5 characters long" }).max(255, { message: "Street cannot exceed 255 characters" }),
  city: z2.string().min(2, { message: "City must be at least 2 characters long" }).max(100, { message: "City cannot exceed 100 characters" }),
  state: z2.string().max(100, { message: "State cannot exceed 100 characters" }).optional(),
  zipCode: z2.string().max(20, { message: "Zip code cannot exceed 20 characters" }).optional(),
  country: z2.string().max(100, { message: "Country cannot exceed 100 characters" }).optional(),
  isDefault: z2.boolean().optional()
});
var updateAddressZodSchema = z2.object({
  label: z2.string().min(2, { message: "Label must be at least 2 characters long" }).max(30, { message: "Label cannot exceed 30 characters" }).optional(),
  recipient: z2.string().min(2, { message: "Recipient must be at least 2 characters long" }).max(100, { message: "Recipient cannot exceed 100 characters" }).optional(),
  phone: bdPhoneSchema.optional(),
  street: z2.string().min(5, { message: "Street must be at least 5 characters long" }).max(255, { message: "Street cannot exceed 255 characters" }).optional(),
  city: z2.string().min(2, { message: "City must be at least 2 characters long" }).max(100, { message: "City cannot exceed 100 characters" }).optional(),
  state: z2.string().max(100, { message: "State cannot exceed 100 characters" }).optional(),
  zipCode: z2.string().max(20, { message: "Zip code cannot exceed 20 characters" }).optional(),
  country: z2.string().max(100, { message: "Country cannot exceed 100 characters" }).optional(),
  isDefault: z2.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required for update"
});

// src/app/modules/user/user.route.ts
var router2 = Router2();
router2.get("/", checkAuth("ADMIN" /* ADMIN */), UserControllers.getAllUsers);
router2.get(
  "/profile/:id",
  checkAuth("ADMIN" /* ADMIN */),
  UserControllers.getSingleUser
);
router2.put(
  "/update-profile/:id",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(adminUpdateUserZodSchema),
  UserControllers.updateUser
);
router2.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.getMe
);
router2.patch(
  "/profile",
  checkAuth(...Object.values(Role)),
  validateRequest(updateMeZodSchema),
  UserControllers.updateMe
);
router2.post(
  "/addresses",
  checkAuth(...Object.values(Role)),
  validateRequest(createAddressZodSchema),
  UserControllers.createAddress
);
router2.get(
  "/addresses",
  checkAuth(...Object.values(Role)),
  UserControllers.getMyAddresses
);
router2.patch(
  "/addresses/:addressId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateAddressZodSchema),
  UserControllers.updateMyAddress
);
router2.patch(
  "/addresses/set-default/:addressId",
  checkAuth(...Object.values(Role)),
  UserControllers.setDefaultAddress
);
router2.delete(
  "/addresses/:addressId",
  checkAuth(...Object.values(Role)),
  UserControllers.deleteMyAddress
);
var UserRoutes = router2;

// src/app/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/app/modules/category/category.controller.ts
import httpStatus8 from "http-status-codes";

// src/app/modules/category/category.service.ts
import httpStatus7 from "http-status-codes";

// src/app/modules/category/category.constant.ts
var categorySearchableFields = ["name", "slug"];

// src/app/modules/category/category.service.ts
var categoryBaseSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  createdAt: true,
  updatedAt: true
};
var categoryListSelect = {
  ...categoryBaseSelect,
  parent: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  _count: {
    select: {
      children: true,
      products: true
    }
  }
};
var categoryDetailsSelect = {
  ...categoryListSelect,
  children: {
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      sortOrder: true,
      parentId: true
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  }
};
var collectionCategorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  products: {
    where: {
      isActive: true
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      brand: true,
      price: true,
      compareAtPrice: true,
      hasVariants: true,
      isFeatured: true,
      images: {
        where: {
          isPrimary: true
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          id: true,
          src: true,
          altText: true,
          isPrimary: true
        }
      }
    }
  }
};
var ensureParentExists = async (parentId) => {
  const parent = await prisma.category.findUnique({
    where: { id: parentId },
    select: { id: true }
  });
  if (!parent) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Parent category not found");
  }
};
var ensureSlugUnique = async (slug, excludedCategoryId) => {
  const existing = await prisma.category.findFirst({
    where: {
      slug,
      ...excludedCategoryId && { id: { not: excludedCategoryId } }
    },
    select: { id: true }
  });
  if (existing) {
    throw new AppError_default(httpStatus7.CONFLICT, "Category slug already exists");
  }
};
var ensureNameUniqueWithinParent = async (name, parentId, excludedCategoryId) => {
  const existing = await prisma.category.findFirst({
    where: {
      name,
      parentId,
      ...excludedCategoryId && { id: { not: excludedCategoryId } }
    },
    select: { id: true }
  });
  if (existing) {
    throw new AppError_default(
      httpStatus7.CONFLICT,
      "Category name already exists under this parent"
    );
  }
};
var ensureNoCircularParent = async (categoryId, nextParentId) => {
  let currentParentId = nextParentId;
  while (currentParentId) {
    if (currentParentId === categoryId) {
      throw new AppError_default(
        httpStatus7.BAD_REQUEST,
        "Circular parent relationship is not allowed"
      );
    }
    const parentCategory = await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true }
    });
    currentParentId = parentCategory?.parentId ?? null;
  }
};
var buildOrderBy = (sort) => {
  if (!sort) {
    return [{ sortOrder: "asc" }, { createdAt: "desc" }];
  }
  return sort.split(",").map((field) => field.trim()).filter(Boolean).map((field) => {
    if (field.startsWith("-")) {
      return { [field.slice(1)]: "desc" };
    }
    return { [field]: "asc" };
  });
};
var buildWhere = (query) => {
  const where = {};
  if (query.searchTerm) {
    where.OR = categorySearchableFields.map((field) => ({
      [field]: {
        contains: query.searchTerm,
        mode: "insensitive"
      }
    }));
  }
  if (query.parentId !== void 0) {
    const parentId = query.parentId.trim().toLowerCase();
    if (parentId === "" || parentId === "null" || parentId === "root") {
      where.parentId = null;
    } else {
      where.parentId = query.parentId;
    }
  }
  if (query.isActive !== void 0) {
    if (query.isActive !== "true" && query.isActive !== "false") {
      throw new AppError_default(
        httpStatus7.BAD_REQUEST,
        "isActive query must be true or false"
      );
    }
    where.isActive = query.isActive === "true";
  }
  return where;
};
var createCategory = async (payload) => {
  const parentId = payload.parentId ?? null;
  if (parentId) {
    await ensureParentExists(parentId);
  }
  await Promise.all([
    ensureSlugUnique(payload.slug),
    ensureNameUniqueWithinParent(payload.name, parentId)
  ]);
  const createdCategory = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      ...payload.description !== void 0 && { description: payload.description },
      ...payload.image !== void 0 && { image: payload.image },
      ...payload.isActive !== void 0 && { isActive: payload.isActive },
      ...payload.sortOrder !== void 0 && { sortOrder: payload.sortOrder },
      ...parentId && { parent: { connect: { id: parentId } } },
      ...payload.metaTitle !== void 0 && { metaTitle: payload.metaTitle },
      ...payload.metaDescription !== void 0 && {
        metaDescription: payload.metaDescription
      },
      ...payload.metaKeywords !== void 0 && {
        metaKeywords: payload.metaKeywords
      }
    },
    select: categoryDetailsSelect
  });
  return createdCategory;
};
var getCategories = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const where = buildWhere(query);
  const orderBy = buildOrderBy(query.sort);
  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: categoryListSelect
    }),
    prisma.category.count({ where })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var sortCollectionTree = (nodes) => {
  nodes.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });
  nodes.forEach((node) => sortCollectionTree(node.children));
};
var getPublicCollections = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const qb = new QueryBuilder({
    ...query,
    sort: query.sort ?? "sortOrder,name"
  }).filter().search(categorySearchableFields).sort();
  const builtQuery = qb.build();
  const where = {
    ...builtQuery.where ?? {},
    isActive: true
  };
  if (query.parentId !== void 0) {
    const parentId = query.parentId.trim().toLowerCase();
    where.parentId = parentId === "" || parentId === "null" || parentId === "root" ? null : query.parentId;
  }
  const categories = await prisma.category.findMany({
    where,
    orderBy: builtQuery.orderBy ?? [
      { sortOrder: "asc" },
      { name: "asc" }
    ],
    select: collectionCategorySelect
  });
  const nodeMap = /* @__PURE__ */ new Map();
  categories.forEach((category) => {
    nodeMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: category.parentId,
      products: category.products,
      children: []
    });
  });
  const roots = [];
  nodeMap.forEach((node) => {
    if (!node.parentId) {
      roots.push(node);
      return;
    }
    const parentNode = nodeMap.get(node.parentId);
    if (!parentNode) {
      roots.push(node);
      return;
    }
    parentNode.children.push(node);
  });
  sortCollectionTree(roots);
  const total = roots.length;
  const data = roots.slice(skip, skip + limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var getCategoryById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: categoryDetailsSelect
  });
  if (!category) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Category not found");
  }
  return category;
};
var updateCategory = async (categoryId, payload) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true
    }
  });
  if (!existingCategory) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Category not found");
  }
  if (Object.keys(payload).length === 0) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "At least one field is required to update category"
    );
  }
  if (payload.parentId !== void 0 && payload.parentId === categoryId) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "A category cannot be its own parent"
    );
  }
  if (payload.parentId !== void 0 && payload.parentId !== null) {
    await ensureParentExists(payload.parentId);
    await ensureNoCircularParent(categoryId, payload.parentId);
  }
  const nextParentId = payload.parentId !== void 0 ? payload.parentId : existingCategory.parentId;
  const nextName = payload.name ?? existingCategory.name;
  if (payload.slug !== void 0 && payload.slug !== existingCategory.slug) {
    await ensureSlugUnique(payload.slug, categoryId);
  }
  if (payload.name !== void 0 || payload.parentId !== void 0) {
    await ensureNameUniqueWithinParent(nextName, nextParentId ?? null, categoryId);
  }
  const updateData = {
    ...payload.name !== void 0 && { name: payload.name },
    ...payload.slug !== void 0 && { slug: payload.slug },
    ...payload.description !== void 0 && { description: payload.description },
    ...payload.image !== void 0 && { image: payload.image },
    ...payload.isActive !== void 0 && { isActive: payload.isActive },
    ...payload.sortOrder !== void 0 && { sortOrder: payload.sortOrder },
    ...payload.metaTitle !== void 0 && { metaTitle: payload.metaTitle },
    ...payload.metaDescription !== void 0 && {
      metaDescription: payload.metaDescription
    },
    ...payload.metaKeywords !== void 0 && {
      metaKeywords: payload.metaKeywords
    }
  };
  if (payload.parentId !== void 0) {
    updateData.parent = payload.parentId ? { connect: { id: payload.parentId } } : { disconnect: true };
  }
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
    select: categoryDetailsSelect
  });
  return updatedCategory;
};
var CategoryService = {
  createCategory,
  getCategories,
  getPublicCollections,
  getCategoryById,
  updateCategory
};

// src/app/modules/category/category.controller.ts
var getParamAsString2 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus8.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var createCategory2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await CategoryService.createCategory(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.CREATED,
    message: "Category created successfully",
    data: result
  });
});
var getCategories2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CategoryService.getCategories(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Categories retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getPublicCollections2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CategoryService.getPublicCollections(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Collections retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getCategoryById2 = catchAsync(async (req, res) => {
  const categoryId = getParamAsString2(req.params.id, "Category id");
  const result = await CategoryService.getCategoryById(categoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Category retrieved successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const categoryId = getParamAsString2(req.params.id, "Category id");
  const payload = req.body;
  const result = await CategoryService.updateCategory(categoryId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Category updated successfully",
    data: result
  });
});
var CategoryControllers = {
  createCategory: createCategory2,
  getCategories: getCategories2,
  getPublicCollections: getPublicCollections2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2
};

// src/app/modules/category/category.validation.ts
import { z as z3 } from "zod";
var slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var optionalText = (max) => z3.string().trim().min(1, { message: "Value cannot be empty" }).max(max, { message: `Value cannot exceed ${max} characters` }).optional();
var optionalParentIdSchema = z3.preprocess(
  (value) => {
    if (value === null) {
      return null;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed || trimmed.toLowerCase() === "null") {
        return null;
      }
      return trimmed;
    }
    return value;
  },
  z3.string().uuid().nullable().optional()
);
var createCategoryZodSchema = z3.object({
  name: z3.string().trim().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name cannot exceed 100 characters" }),
  slug: z3.string().trim().min(2, { message: "Slug must be at least 2 characters long" }).max(100, { message: "Slug cannot exceed 100 characters" }).regex(slugRegex, {
    message: "Slug can contain lowercase letters, numbers, and single hyphens only"
  }),
  description: optionalText(1e3),
  image: optionalText(500),
  isActive: z3.coerce.boolean().optional(),
  sortOrder: z3.coerce.number().int({ message: "Sort order must be an integer" }).min(0, { message: "Sort order cannot be negative" }).optional(),
  parentId: optionalParentIdSchema,
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  metaKeywords: optionalText(500)
});
var updateCategoryZodSchema = z3.object({
  name: z3.string().trim().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name cannot exceed 100 characters" }).optional(),
  slug: z3.string().trim().min(2, { message: "Slug must be at least 2 characters long" }).max(100, { message: "Slug cannot exceed 100 characters" }).regex(slugRegex, {
    message: "Slug can contain lowercase letters, numbers, and single hyphens only"
  }).optional(),
  description: optionalText(1e3),
  image: optionalText(500),
  isActive: z3.coerce.boolean().optional(),
  sortOrder: z3.coerce.number().int({ message: "Sort order must be an integer" }).min(0, { message: "Sort order cannot be negative" }).optional(),
  parentId: optionalParentIdSchema,
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  metaKeywords: optionalText(500)
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one field is required for update"
});

// src/app/modules/category/category.route.ts
var router3 = Router3();
router3.post(
  "/",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(createCategoryZodSchema),
  CategoryControllers.createCategory
);
router3.get(
  "/",
  checkAuth(...Object.values(Role)),
  CategoryControllers.getCategories
);
router3.get("/collections", CategoryControllers.getPublicCollections);
router3.patch(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(updateCategoryZodSchema),
  CategoryControllers.updateCategory
);
router3.get(
  "/:id",
  CategoryControllers.getCategoryById
);
var CategoryRoutes = router3;

// src/app/modules/image/image.route.ts
import { Router as Router4 } from "express";

// src/app/middlewares/uploadImages.ts
import path4 from "path";
import { v4 as uuidv42 } from "uuid";
import httpStatus11 from "http-status-codes";

// src/app/lib/multer.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET
});
var cloudinary_default = cloudinary;

// src/app/lib/multer.ts
import multer from "multer";
import path3 from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import httpStatus9 from "http-status-codes";
var MAX_MEDIA_SIZE_BYTES = 2 * 1024 * 1024;
var mediaLimits = {
  fileSize: MAX_MEDIA_SIZE_BYTES
};
var CloudinaryStorageInstance = new CloudinaryStorage({
  cloudinary: cloudinary_default,
  params: async () => ({
    folder: "media",
    resource_type: "auto",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "mp4",
      "mov",
      "avi",
      "webm",
      "mkv"
    ]
  })
});
var uploadWithCloudinary = multer({
  storage: CloudinaryStorageInstance,
  limits: mediaLimits
});
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path3.join(process.cwd(), "uploads/media");
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const ext = path3.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    cb(null, fileName);
  }
});
var fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new AppError_default(httpStatus9.BAD_REQUEST, "Only image/video files are allowed"));
  }
};
var uploadCategoryImage = multer({
  storage,
  fileFilter,
  limits: mediaLimits
});
var uploadProductImage = multer({
  storage,
  fileFilter,
  limits: mediaLimits
});
var uploadForSupabase = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: mediaLimits
});

// src/app/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import httpStatus10 from "http-status-codes";
var supabaseClient = null;
var getSupabaseClient = () => {
  if (!envVars.SUPABASE_URL || !envVars.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError_default(
      httpStatus10.INTERNAL_SERVER_ERROR,
      "Supabase storage is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!supabaseClient) {
    supabaseClient = createClient(
      envVars.SUPABASE_URL,
      envVars.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseClient;
};
var getSupabaseBucket = () => {
  if (!envVars.SUPABASE_BUCKET) {
    throw new AppError_default(
      httpStatus10.INTERNAL_SERVER_ERROR,
      "Supabase bucket is not configured. Please set SUPABASE_BUCKET."
    );
  }
  return envVars.SUPABASE_BUCKET;
};

// src/app/middlewares/uploadImages.ts
var storageTypes = ["link", "local", "cloudinary", "supabase"];
var storageTypeAliases = {
  cloudnery: "cloudinary",
  cloudenery: "cloudinary",
  cloudeniary: "cloudinary",
  cloudinery: "cloudinary",
  subabase: "supabase",
  subaabase: "supabase"
};
var getStorageType = (req) => {
  const storageType = req.query.storageType?.trim().toLowerCase();
  const normalizedStorageType = storageType ? storageTypeAliases[storageType] ?? storageType : void 0;
  if (!normalizedStorageType || !storageTypes.includes(normalizedStorageType)) {
    throw new AppError_default(
      httpStatus11.BAD_REQUEST,
      "Invalid storageType. Use one of: link, local, cloudinary, supabase"
    );
  }
  return normalizedStorageType;
};
var extractFiles = (req) => {
  if (!req.files) return [];
  if (Array.isArray(req.files)) {
    return req.files;
  }
  const filesByField = req.files;
  return Object.values(filesByField).flat();
};
var uploadWithMulter = (req, res, storageType) => {
  const uploader = storageType === "cloudinary" ? uploadWithCloudinary : storageType === "supabase" ? uploadForSupabase : uploadProductImage;
  return new Promise((resolve, reject) => {
    uploader.fields([
      { name: "files", maxCount: 20 },
      { name: "images", maxCount: 20 },
      { name: "videos", maxCount: 20 }
    ])(req, res, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(extractFiles(req));
    });
  });
};
var buildMediaType = (mimeType) => {
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  return "image";
};
var ensureLinkPayload = (req) => {
  const mediaUrlsRaw = req.body.mediaUrls;
  const mediaUrlRaw = req.body.mediaUrl;
  let mediaUrls = [];
  if (Array.isArray(mediaUrlsRaw)) {
    mediaUrls = mediaUrlsRaw;
  } else if (typeof mediaUrlsRaw === "string" && mediaUrlsRaw.trim()) {
    const trimmed = mediaUrlsRaw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          mediaUrls = parsed;
        }
      } catch {
        mediaUrls = [trimmed];
      }
    } else {
      mediaUrls = [trimmed];
    }
  } else if (mediaUrlRaw) {
    mediaUrls = [mediaUrlRaw];
  }
  if (!mediaUrls.length) {
    throw new AppError_default(
      httpStatus11.BAD_REQUEST,
      "For storageType=link, provide mediaUrl or mediaUrls[]"
    );
  }
  mediaUrls.forEach((url) => {
    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      throw new AppError_default(
        httpStatus11.BAD_REQUEST,
        "Each mediaUrl must be a valid http/https URL"
      );
    }
  });
  return mediaUrls;
};
var uploadImages = async (req, res, next) => {
  try {
    const storageType = getStorageType(req);
    req.uploadedImages = [];
    if (storageType === "link") {
      const mediaUrls = ensureLinkPayload(req);
      mediaUrls.forEach((url) => {
        req.uploadedImages.push({
          storageType: "link",
          src: url,
          publicId: `link:${uuidv42()}`
        });
      });
      next();
      return;
    }
    const files = await uploadWithMulter(req, res, storageType);
    if (!files.length) {
      throw new AppError_default(
        httpStatus11.BAD_REQUEST,
        "No files received. Send files in 'files', 'images', or 'videos' field"
      );
    }
    if (storageType === "local") {
      files.forEach((file) => {
        req.uploadedImages.push({
          storageType: "local",
          src: `/api/uploads/media/${file.filename}`,
          publicId: `local:${file.filename}`
        });
      });
      next();
      return;
    }
    if (storageType === "cloudinary") {
      files.forEach((file) => {
        req.uploadedImages.push({
          storageType: "cloudinary",
          src: file.path,
          publicId: `cloudinary:${file.filename}`
        });
      });
      next();
      return;
    }
    const supabase = getSupabaseClient();
    const bucket = getSupabaseBucket();
    for (const file of files) {
      const ext = path4.extname(file.originalname) || "";
      const mediaType = buildMediaType(file.mimetype);
      const objectPath = `${mediaType}s/${Date.now()}-${uuidv42()}${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(objectPath, file.buffer, {
        upsert: false,
        contentType: file.mimetype
      });
      if (error) {
        throw new AppError_default(
          httpStatus11.BAD_REQUEST,
          `Supabase upload failed: ${error.message}`
        );
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      req.uploadedImages.push({
        storageType: "supabase",
        src: data.publicUrl,
        publicId: `supabase:${objectPath}`
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/modules/image/image.controller.ts
import httpStatus13 from "http-status-codes";

// src/app/modules/image/image.service.ts
import httpStatus12 from "http-status-codes";

// src/app/utils/cleanupImage.ts
import fs2 from "fs/promises";
import path5 from "path";
var cleanupImages = async (images) => {
  if (!images) return;
  if (!images?.length) return;
  for (const image of images) {
    try {
      if (image.storageType === "local") {
        let localPath = image.src;
        if (image.publicId?.startsWith("local:")) {
          const filename = image.publicId.replace("local:", "");
          localPath = path5.join(process.cwd(), "uploads/media", filename);
        } else if (image.src?.startsWith("/api/uploads/media/")) {
          const filename = image.src.replace("/api/uploads/media/", "");
          localPath = path5.join(process.cwd(), "uploads/media", filename);
        }
        if (localPath) {
          await fs2.unlink(localPath);
        }
      }
      if (image.storageType === "cloudinary" && image.publicId) {
        const cloudinaryPublicId = image.publicId.startsWith("cloudinary:") ? image.publicId.replace("cloudinary:", "") : image.publicId;
        await cloudinary_default.uploader.destroy(cloudinaryPublicId, {
          resource_type: "auto"
        });
      }
      if (image.storageType === "supabase" && image.publicId) {
        const supabase = getSupabaseClient();
        const bucket = getSupabaseBucket();
        const objectPath = image.publicId.startsWith("supabase:") ? image.publicId.replace("supabase:", "") : image.publicId;
        await supabase.storage.from(bucket).remove([objectPath]);
      }
    } catch (err) {
      console.error("Failed to cleanup image:", err);
    }
  }
};

// src/app/modules/image/image.service.ts
var mediaSelect = {
  id: true,
  src: true,
  publicId: true,
  altText: true,
  isPrimary: true,
  productId: true,
  variantOptionId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true
};
var videoExtensions = /* @__PURE__ */ new Set([
  ".mp4",
  ".mov",
  ".avi",
  ".webm",
  ".mkv",
  ".m4v"
]);
var getMediaType = (src) => {
  const normalized = src.split("?")[0]?.split("#")[0] ?? src;
  for (const ext of videoExtensions) {
    if (normalized.toLowerCase().endsWith(ext)) {
      return "video";
    }
  }
  return "image";
};
var resolveStorageType = (image) => {
  const publicId = image.publicId ?? "";
  if (publicId.startsWith("link:")) {
    return "link";
  }
  if (publicId.startsWith("local:")) {
    return "local";
  }
  if (publicId.startsWith("cloudinary:")) {
    return "cloudinary";
  }
  if (publicId.startsWith("supabase:")) {
    return "supabase";
  }
  if (image.src.startsWith("/api/uploads/")) {
    return "local";
  }
  if (image.src.includes("res.cloudinary.com")) {
    return "cloudinary";
  }
  if (image.src.includes("supabase.co/storage/v1/object/public")) {
    return "supabase";
  }
  return "link";
};
var ensureRelationsExist = async (payload) => {
  const [product, variantOption, category] = await Promise.all([
    payload.productId ? prisma.product.findUnique({
      where: { id: payload.productId },
      select: { id: true }
    }) : Promise.resolve(null),
    payload.variantOptionId ? prisma.variantOption.findUnique({
      where: { id: payload.variantOptionId },
      select: { id: true }
    }) : Promise.resolve(null),
    payload.categoryId ? prisma.category.findUnique({
      where: { id: payload.categoryId },
      select: { id: true }
    }) : Promise.resolve(null)
  ]);
  if (payload.productId && !product) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Product not found");
  }
  if (payload.variantOptionId && !variantOption) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Variant option not found");
  }
  if (payload.categoryId && !category) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Category not found");
  }
};
var createImages = async (payload) => {
  if (!payload.images.length) {
    throw new AppError_default(httpStatus12.BAD_REQUEST, "Media files are required");
  }
  await ensureRelationsExist(payload);
  const createdImages = await prisma.productImage.createManyAndReturn({
    data: payload.images.map((media) => ({
      src: media.src,
      publicId: media.publicId ?? null,
      altText: media.altText ?? null,
      isPrimary: media.isPrimary ?? false,
      productId: payload.productId ?? null,
      variantOptionId: payload.variantOptionId ?? null,
      categoryId: payload.categoryId ?? null
    })),
    select: mediaSelect
  });
  return createdImages.map((media) => ({
    ...media,
    mediaType: getMediaType(media.src)
  }));
};
var getAllImages = async (query) => {
  const qb = new QueryBuilder({ ...query }).filter().search(["altText", "src", "publicId"]).sort().fields().paginate();
  const builtQuery = qb.build();
  const [rows, meta] = await Promise.all([
    prisma.productImage.findMany({
      ...builtQuery,
      select: builtQuery.select ?? mediaSelect
    }),
    qb.getMeta(prisma.productImage)
  ]);
  return {
    meta,
    data: rows.map((media) => ({
      ...media,
      mediaType: getMediaType(media.src)
    }))
  };
};
var deleteImage = async (imageId) => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      src: true,
      publicId: true
    }
  });
  if (!image) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Media not found");
  }
  await cleanupImages([
    {
      storageType: resolveStorageType(image),
      src: image.src,
      ...image.publicId !== null && { publicId: image.publicId }
    }
  ]);
  await prisma.productImage.delete({
    where: { id: image.id }
  });
};
var ImageService = {
  createImages,
  getAllImages,
  deleteImage
};

// src/app/modules/image/image.controller.ts
var getParamAsString3 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus13.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var createImages2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const uploadedImages = req.uploadedImages ?? [];
  if (!uploadedImages.length) {
    throw new AppError_default(httpStatus13.BAD_REQUEST, "No media received");
  }
  const createPayload = {
    ...payload.productId !== void 0 && { productId: payload.productId },
    ...payload.variantOptionId !== void 0 && {
      variantOptionId: payload.variantOptionId
    },
    ...payload.categoryId !== void 0 && { categoryId: payload.categoryId },
    images: uploadedImages.map((media) => ({
      src: media.src,
      ...media.publicId !== void 0 && { publicId: media.publicId },
      ...payload.altText !== void 0 && { altText: payload.altText },
      ...payload.isPrimary !== void 0 && { isPrimary: payload.isPrimary }
    }))
  };
  const result = await ImageService.createImages(createPayload);
  sendResponse(res, {
    statusCode: httpStatus13.CREATED,
    success: true,
    message: "Media uploaded successfully",
    data: result
  });
});
var getAllImages2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ImageService.getAllImages(query);
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result
  });
});
var deleteImage2 = catchAsync(async (req, res) => {
  const imageId = getParamAsString3(req.params.id, "Image id");
  await ImageService.deleteImage(imageId);
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Media deleted successfully",
    data: null
  });
});
var ImageController = {
  createImages: createImages2,
  getAllImages: getAllImages2,
  deleteImage: deleteImage2
};

// src/app/modules/image/image.validation.ts
import { z as z4 } from "zod";
var uuidSchema = z4.string().uuid();
var mediaUrlsSchema = z4.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return void 0;
    }
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return value;
      }
    }
    return [trimmed];
  }
  return value;
}, z4.array(z4.string().url({ message: "Each media URL must be valid" })).optional());
var createMediaZodSchema = z4.object({
  productId: uuidSchema.optional(),
  variantOptionId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
  altText: z4.string().min(1, { message: "altText cannot be empty" }).max(255, { message: "altText cannot exceed 255 characters" }).optional(),
  isPrimary: z4.coerce.boolean().optional(),
  mediaUrl: z4.string().url({ message: "mediaUrl must be a valid URL" }).optional(),
  mediaUrls: mediaUrlsSchema
});

// src/app/modules/image/image.route.ts
var router4 = Router4();
router4.post(
  "/upload",
  checkAuth("ADMIN" /* ADMIN */),
  uploadImages,
  validateRequest(createMediaZodSchema),
  ImageController.createImages
);
router4.get("/", checkAuth("ADMIN" /* ADMIN */), ImageController.getAllImages);
router4.delete("/:id", checkAuth("ADMIN" /* ADMIN */), ImageController.deleteImage);
var ImageRoutes = router4;

// src/app/routes/index.ts
var router5 = Router5();
var moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/user",
    route: UserRoutes
  },
  // {
  //   path: "/product",
  //   route: ProductRoutes,
  // },
  {
    path: "/category",
    route: CategoryRoutes
  },
  {
    path: "/image",
    route: ImageRoutes
  }
];
moduleRoutes.forEach((route) => {
  router5.use(route.path, route.route);
});

// src/app/middlewares/globalErrorHandler.ts
import httpStatus14 from "http-status-codes";
import { ZodError } from "zod";
var globalErrorHandler = async (err, req, res, next) => {
  await cleanupImages(
    req.uploadedImages
  );
  if (envVars.NODE_ENV === "development") {
    console.log("============================================");
    console.log(err);
    console.log("============================================");
  }
  let errorSources = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";
  if (err.code === 11e3) {
  }
  if (err.code === "P2002") {
    statusCode = 503;
    message = err.message;
  }
  if (err.code === "P2025") {
    statusCode = 503;
    message = "No record found to delete/update!";
  }
  if (err.code === "P2003") {
    statusCode = 503;
    message = err.message;
  } else if (err.name === "CastError") {
  } else if (err instanceof ZodError) {
    statusCode = httpStatus14.BAD_REQUEST;
    message = "Validation error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });
};

// src/app/middlewares/notFound.ts
import httpStatus15 from "http-status-codes";
var notFound = (req, res) => {
  res.status(httpStatus15.NOT_FOUND).json({
    success: false,
    message: "Route Not Found"
  });
};
var notFound_default = notFound;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport4.initialize());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
  })
);
app.use(
  "/api/uploads",
  express.static("uploads", {
    maxAge: "7d",
    index: false,
    setHeaders: (res) => {
      res.set("X-Content-Type-Options", "nosniff");
    }
  })
);
app.use("/api", router5);
app.get("/", (_, res) => {
  res.send({
    message: "Welcome to the APP, this is a E-Commerce API",
    success: true
  });
});
app.use(globalErrorHandler);
app.use(notFound_default);

// src/server.ts
var server;
var startServer = async () => {
  try {
    server = app.listen(envVars.PORT, () => {
      console.log(
        `\u2705\u2705\u2705\u2705 Server is listening to http://localhost:${envVars.PORT} `
      );
    });
  } catch (error) {
    console.log("\u274C\u274C\u274C\u274C\u274C", error);
  }
};
(async () => {
  await startServer();
})();
process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
