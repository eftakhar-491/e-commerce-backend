var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
  if (process.env.META_PIXEL_ID) {
    envConfig.META_PIXEL_ID = process.env.META_PIXEL_ID;
  }
  if (process.env.META_CAPI_ACCESS_TOKEN) {
    envConfig.META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
  }
  if (process.env.META_TEST_EVENT_CODE) {
    envConfig.META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
  }
  if (process.env.GA4_MEASUREMENT_ID) {
    envConfig.GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
  }
  if (process.env.GA4_API_SECRET) {
    envConfig.GA4_API_SECRET = process.env.GA4_API_SECRET;
  }
  if (process.env.GA4_ENDPOINT) {
    envConfig.GA4_ENDPOINT = process.env.GA4_ENDPOINT;
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
  cartItems        CartItem[]

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
  images  ProductImage[]
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
  variantId       String?
  variantOptionId String?
  categoryId      String?

  product  Product?        @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant  ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
  option   VariantOption?  @relation(fields: [variantOptionId], references: [id], onDelete: Cascade)
  category Category?       @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([productId])
  @@index([variantId])
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
  id         String  @id @default(uuid())
  userId     String  @unique
  totalPrice Decimal @default(0) @db.Decimal(10, 2)

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
  productId       String
  variantOptionId String
  quantity        Int

  cart    Cart          @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  option  VariantOption @relation(fields: [variantOptionId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, variantOptionId])
  @@index([cartId])
  @@index([productId])
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
  id             String    @id @default(uuid())
  eventType      String // e.g., "Purchase", "AddToCart", "ViewContent"
  eventId        String?   @unique
  userId         String?
  sessionId      String?
  orderId        String? // If purchase
  productId      String? // If product-specific
  value          Float? // Event value
  currency       String?   @default("BDT")
  sourceUrl      String?
  ipAddress      String?
  userAgent      String?
  sentToMeta     Boolean   @default(false)
  sentToGa4      Boolean   @default(false)
  metaLastSentAt DateTime?
  ga4LastSentAt  DateTime?
  attemptCount   Int       @default(0)
  lastAttemptAt  DateTime?
  lastError      String?
  metadata       Json? // Custom pixel data

  user    User?    @relation(fields: [userId], references: [id])
  order   Order?   @relation(fields: [orderId], references: [id])
  product Product? @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())

  @@index([eventType, createdAt])
  @@index([userId, createdAt])
  @@index([sessionId])
  @@index([sentToMeta, sentToGa4])
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"credential","kind":"object","type":"UserCredential","relationName":"UserToUserCredential"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"MessageSender"},{"name":"customerConversations","kind":"object","type":"Conversation","relationName":"CustomerConversations"},{"name":"adminReviewReplies","kind":"object","type":"Review","relationName":"AdminReviewReplies"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductViewToUser"},{"name":"searchQueries","kind":"object","type":"SearchQuery","relationName":"SearchQueryToUser"},{"name":"blogComments","kind":"object","type":"BlogComment","relationName":"BlogCommentToUser"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToUser"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"UserToWishlist"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"lastIp","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referralSource","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"User"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sessions"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"tokenType","kind":"scalar","type":"String"},{"name":"scope","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"accounts"},"UserCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserCredential"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_credentials"},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"recipient","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"CategoryToProductImage"},{"name":"couponCategories","kind":"object","type":"CouponCategory","relationName":"CategoryToCouponCategory"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Tag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"ProductTag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tags"},"ProductTag":{"fields":[{"name":"productId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductTag"},{"name":"tag","kind":"object","type":"Tag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"product_tags"},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"brand","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"lowStockThreshold","kind":"scalar","type":"Int"},{"name":"hasVariants","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"isDigital","kind":"scalar","type":"Boolean"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"variants","kind":"object","type":"ProductVariant","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"tags","kind":"object","type":"ProductTag","relationName":"ProductToProductTag"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductToProductView"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToProduct"},{"name":"couponProducts","kind":"object","type":"CouponProduct","relationName":"CouponProductToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"products"},"ProductVariant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToProductVariant"},{"name":"options","kind":"object","type":"VariantOption","relationName":"ProductVariantToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_variants"},"VariantOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productVariantId","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductVariantToVariantOption"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToVariantOption"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToVariantOption"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToVariantOption"},{"name":"inventoryTransactions","kind":"object","type":"InventoryTransaction","relationName":"InventoryTransactionToVariantOption"},{"name":"wishlistItems","kind":"object","type":"WishlistItem","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"variant_options"},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"src","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"productId","kind":"scalar","type":"String"},{"name":"variantId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductImageToProductVariant"},{"name":"option","kind":"object","type":"VariantOption","relationName":"ProductImageToVariantOption"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProductImage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_images"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"helpfulVotes","kind":"scalar","type":"Int"},{"name":"notHelpfulVotes","kind":"scalar","type":"Int"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"adminRepliedAt","kind":"scalar","type":"DateTime"},{"name":"adminRepliedBy","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"User","relationName":"AdminReviewReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"},{"name":"option","kind":"object","type":"VariantOption","relationName":"CartItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"shippingAddressId","kind":"scalar","type":"String"},{"name":"billingAddress","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"adminNotes","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"discountTotal","kind":"scalar","type":"Decimal"},{"name":"shippingCost","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"couponCode","kind":"scalar","type":"String"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"shippedAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"returnedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"statusHistory","kind":"object","type":"OrderStatusHistory","relationName":"OrderToOrderStatusHistory"},{"name":"shipments","kind":"object","type":"Shipment","relationName":"OrderToShipment"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"productName","kind":"scalar","type":"String"},{"name":"productSku","kind":"scalar","type":"String"},{"name":"productImage","kind":"scalar","type":"String"},{"name":"variantSnapshot","kind":"scalar","type":"Json"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"OrderItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"OrderStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"changedBy","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderStatusHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_status_history"},"Shipment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"carrier","kind":"scalar","type":"String"},{"name":"trackingNumber","kind":"scalar","type":"String"},{"name":"trackingUrl","kind":"scalar","type":"String"},{"name":"shippingMethod","kind":"scalar","type":"String"},{"name":"estimatedDelivery","kind":"scalar","type":"DateTime"},{"name":"actualDelivery","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"ShipmentStatus"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToShipment"},{"name":"events","kind":"object","type":"ShipmentEvent","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"shipments"},"ShipmentEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"occurredAt","kind":"scalar","type":"DateTime"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"shipment_events"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"discountType","kind":"enum","type":"DiscountType"},{"name":"discountValue","kind":"scalar","type":"Decimal"},{"name":"minPurchase","kind":"scalar","type":"Decimal"},{"name":"maxDiscount","kind":"scalar","type":"Decimal"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usageCount","kind":"scalar","type":"Int"},{"name":"perUserLimit","kind":"scalar","type":"Int"},{"name":"validFrom","kind":"scalar","type":"DateTime"},{"name":"validUntil","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"appliesToAll","kind":"scalar","type":"Boolean"},{"name":"products","kind":"object","type":"CouponProduct","relationName":"CouponToCouponProduct"},{"name":"categories","kind":"object","type":"CouponCategory","relationName":"CouponToCouponCategory"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"CouponProduct":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponProduct"},{"name":"product","kind":"object","type":"Product","relationName":"CouponProductToProduct"}],"dbName":"coupon_products"},"CouponCategory":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponCategory"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToCouponCategory"}],"dbName":"coupon_categories"},"InventoryTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InventoryTransactionType"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"previousStock","kind":"scalar","type":"Int"},{"name":"newStock","kind":"scalar","type":"Int"},{"name":"referenceId","kind":"scalar","type":"String"},{"name":"referenceType","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"variantOption","kind":"object","type":"VariantOption","relationName":"InventoryTransactionToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"inventory_transactions"},"Wishlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToWishlist"},{"name":"items","kind":"object","type":"WishlistItem","relationName":"WishlistToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlists"},"WishlistItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"wishlistId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"WishlistToWishlistItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlist_items"},"BlogPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"featuredImage","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"views","kind":"scalar","type":"Int"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"categories","kind":"object","type":"BlogPostCategory","relationName":"BlogPostToBlogPostCategory"},{"name":"tags","kind":"object","type":"BlogPostTag","relationName":"BlogPostToBlogPostTag"},{"name":"comments","kind":"object","type":"BlogComment","relationName":"BlogCommentToBlogPost"},{"name":"allowComments","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_posts"},"BlogCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostCategory","relationName":"BlogCategoryToBlogPostCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_categories"},"BlogTag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostTag","relationName":"BlogPostTagToBlogTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_tags"},"BlogPostCategory":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostCategory"},{"name":"category","kind":"object","type":"BlogCategory","relationName":"BlogCategoryToBlogPostCategory"}],"dbName":"blog_post_categories"},"BlogPostTag":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostTag"},{"name":"tag","kind":"object","type":"BlogTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_post_tags"},"BlogComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"postId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"authorName","kind":"scalar","type":"String"},{"name":"authorEmail","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogCommentToBlogPost"},{"name":"user","kind":"object","type":"User","relationName":"BlogCommentToUser"},{"name":"parent","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_comments"},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConversationStatus"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerConversations"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"conversations"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"senderRole","kind":"enum","type":"UserRole"},{"name":"content","kind":"scalar","type":"String"},{"name":"attachments","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"MessageStatus"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"sender","kind":"object","type":"User","relationName":"MessageSender"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"ProductView":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductView"},{"name":"user","kind":"object","type":"User","relationName":"ProductViewToUser"},{"name":"viewedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_views"},"SearchQuery":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"query","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"resultCount","kind":"scalar","type":"Int"},{"name":"filters","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"SearchQueryToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"search_queries"},"ConversionEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"sourceUrl","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"sentToMeta","kind":"scalar","type":"Boolean"},{"name":"sentToGa4","kind":"scalar","type":"Boolean"},{"name":"metaLastSentAt","kind":"scalar","type":"DateTime"},{"name":"ga4LastSentAt","kind":"scalar","type":"DateTime"},{"name":"attemptCount","kind":"scalar","type":"Int"},{"name":"lastAttemptAt","kind":"scalar","type":"DateTime"},{"name":"lastError","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"ConversionEventToUser"},{"name":"order","kind":"object","type":"Order","relationName":"ConversionEventToOrder"},{"name":"product","kind":"object","type":"Product","relationName":"ConversionEventToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"conversion_events"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","address","coupon","parent","children","products","product","images","variant","items","_count","cart","option","cartItems","order","orderItems","variantOption","inventoryTransactions","wishlist","wishlistItems","options","category","couponCategories","variants","admin","reviews","tag","tags","productViews","conversionEvents","couponProducts","categories","orders","payment","statusHistory","shipment","events","shipments","addresses","sessions","accounts","credential","customer","messages","conversation","sender","sentMessages","customerConversations","adminReviewReplies","searchQueries","post","posts","comments","replies","blogComments","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","UserCredential.findUnique","UserCredential.findUniqueOrThrow","UserCredential.findFirst","UserCredential.findFirstOrThrow","UserCredential.findMany","UserCredential.createOne","UserCredential.createMany","UserCredential.createManyAndReturn","UserCredential.updateOne","UserCredential.updateMany","UserCredential.updateManyAndReturn","UserCredential.upsertOne","UserCredential.deleteOne","UserCredential.deleteMany","UserCredential.groupBy","UserCredential.aggregate","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","Address.upsertOne","Address.deleteOne","Address.deleteMany","Address.groupBy","Address.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","_avg","_sum","Category.groupBy","Category.aggregate","Tag.findUnique","Tag.findUniqueOrThrow","Tag.findFirst","Tag.findFirstOrThrow","Tag.findMany","Tag.createOne","Tag.createMany","Tag.createManyAndReturn","Tag.updateOne","Tag.updateMany","Tag.updateManyAndReturn","Tag.upsertOne","Tag.deleteOne","Tag.deleteMany","Tag.groupBy","Tag.aggregate","ProductTag.findUnique","ProductTag.findUniqueOrThrow","ProductTag.findFirst","ProductTag.findFirstOrThrow","ProductTag.findMany","ProductTag.createOne","ProductTag.createMany","ProductTag.createManyAndReturn","ProductTag.updateOne","ProductTag.updateMany","ProductTag.updateManyAndReturn","ProductTag.upsertOne","ProductTag.deleteOne","ProductTag.deleteMany","ProductTag.groupBy","ProductTag.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","ProductVariant.findUnique","ProductVariant.findUniqueOrThrow","ProductVariant.findFirst","ProductVariant.findFirstOrThrow","ProductVariant.findMany","ProductVariant.createOne","ProductVariant.createMany","ProductVariant.createManyAndReturn","ProductVariant.updateOne","ProductVariant.updateMany","ProductVariant.updateManyAndReturn","ProductVariant.upsertOne","ProductVariant.deleteOne","ProductVariant.deleteMany","ProductVariant.groupBy","ProductVariant.aggregate","VariantOption.findUnique","VariantOption.findUniqueOrThrow","VariantOption.findFirst","VariantOption.findFirstOrThrow","VariantOption.findMany","VariantOption.createOne","VariantOption.createMany","VariantOption.createManyAndReturn","VariantOption.updateOne","VariantOption.updateMany","VariantOption.updateManyAndReturn","VariantOption.upsertOne","VariantOption.deleteOne","VariantOption.deleteMany","VariantOption.groupBy","VariantOption.aggregate","ProductImage.findUnique","ProductImage.findUniqueOrThrow","ProductImage.findFirst","ProductImage.findFirstOrThrow","ProductImage.findMany","ProductImage.createOne","ProductImage.createMany","ProductImage.createManyAndReturn","ProductImage.updateOne","ProductImage.updateMany","ProductImage.updateManyAndReturn","ProductImage.upsertOne","ProductImage.deleteOne","ProductImage.deleteMany","ProductImage.groupBy","ProductImage.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","OrderStatusHistory.findUnique","OrderStatusHistory.findUniqueOrThrow","OrderStatusHistory.findFirst","OrderStatusHistory.findFirstOrThrow","OrderStatusHistory.findMany","OrderStatusHistory.createOne","OrderStatusHistory.createMany","OrderStatusHistory.createManyAndReturn","OrderStatusHistory.updateOne","OrderStatusHistory.updateMany","OrderStatusHistory.updateManyAndReturn","OrderStatusHistory.upsertOne","OrderStatusHistory.deleteOne","OrderStatusHistory.deleteMany","OrderStatusHistory.groupBy","OrderStatusHistory.aggregate","Shipment.findUnique","Shipment.findUniqueOrThrow","Shipment.findFirst","Shipment.findFirstOrThrow","Shipment.findMany","Shipment.createOne","Shipment.createMany","Shipment.createManyAndReturn","Shipment.updateOne","Shipment.updateMany","Shipment.updateManyAndReturn","Shipment.upsertOne","Shipment.deleteOne","Shipment.deleteMany","Shipment.groupBy","Shipment.aggregate","ShipmentEvent.findUnique","ShipmentEvent.findUniqueOrThrow","ShipmentEvent.findFirst","ShipmentEvent.findFirstOrThrow","ShipmentEvent.findMany","ShipmentEvent.createOne","ShipmentEvent.createMany","ShipmentEvent.createManyAndReturn","ShipmentEvent.updateOne","ShipmentEvent.updateMany","ShipmentEvent.updateManyAndReturn","ShipmentEvent.upsertOne","ShipmentEvent.deleteOne","ShipmentEvent.deleteMany","ShipmentEvent.groupBy","ShipmentEvent.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Coupon.findUnique","Coupon.findUniqueOrThrow","Coupon.findFirst","Coupon.findFirstOrThrow","Coupon.findMany","Coupon.createOne","Coupon.createMany","Coupon.createManyAndReturn","Coupon.updateOne","Coupon.updateMany","Coupon.updateManyAndReturn","Coupon.upsertOne","Coupon.deleteOne","Coupon.deleteMany","Coupon.groupBy","Coupon.aggregate","CouponProduct.findUnique","CouponProduct.findUniqueOrThrow","CouponProduct.findFirst","CouponProduct.findFirstOrThrow","CouponProduct.findMany","CouponProduct.createOne","CouponProduct.createMany","CouponProduct.createManyAndReturn","CouponProduct.updateOne","CouponProduct.updateMany","CouponProduct.updateManyAndReturn","CouponProduct.upsertOne","CouponProduct.deleteOne","CouponProduct.deleteMany","CouponProduct.groupBy","CouponProduct.aggregate","CouponCategory.findUnique","CouponCategory.findUniqueOrThrow","CouponCategory.findFirst","CouponCategory.findFirstOrThrow","CouponCategory.findMany","CouponCategory.createOne","CouponCategory.createMany","CouponCategory.createManyAndReturn","CouponCategory.updateOne","CouponCategory.updateMany","CouponCategory.updateManyAndReturn","CouponCategory.upsertOne","CouponCategory.deleteOne","CouponCategory.deleteMany","CouponCategory.groupBy","CouponCategory.aggregate","InventoryTransaction.findUnique","InventoryTransaction.findUniqueOrThrow","InventoryTransaction.findFirst","InventoryTransaction.findFirstOrThrow","InventoryTransaction.findMany","InventoryTransaction.createOne","InventoryTransaction.createMany","InventoryTransaction.createManyAndReturn","InventoryTransaction.updateOne","InventoryTransaction.updateMany","InventoryTransaction.updateManyAndReturn","InventoryTransaction.upsertOne","InventoryTransaction.deleteOne","InventoryTransaction.deleteMany","InventoryTransaction.groupBy","InventoryTransaction.aggregate","Wishlist.findUnique","Wishlist.findUniqueOrThrow","Wishlist.findFirst","Wishlist.findFirstOrThrow","Wishlist.findMany","Wishlist.createOne","Wishlist.createMany","Wishlist.createManyAndReturn","Wishlist.updateOne","Wishlist.updateMany","Wishlist.updateManyAndReturn","Wishlist.upsertOne","Wishlist.deleteOne","Wishlist.deleteMany","Wishlist.groupBy","Wishlist.aggregate","WishlistItem.findUnique","WishlistItem.findUniqueOrThrow","WishlistItem.findFirst","WishlistItem.findFirstOrThrow","WishlistItem.findMany","WishlistItem.createOne","WishlistItem.createMany","WishlistItem.createManyAndReturn","WishlistItem.updateOne","WishlistItem.updateMany","WishlistItem.updateManyAndReturn","WishlistItem.upsertOne","WishlistItem.deleteOne","WishlistItem.deleteMany","WishlistItem.groupBy","WishlistItem.aggregate","BlogPost.findUnique","BlogPost.findUniqueOrThrow","BlogPost.findFirst","BlogPost.findFirstOrThrow","BlogPost.findMany","BlogPost.createOne","BlogPost.createMany","BlogPost.createManyAndReturn","BlogPost.updateOne","BlogPost.updateMany","BlogPost.updateManyAndReturn","BlogPost.upsertOne","BlogPost.deleteOne","BlogPost.deleteMany","BlogPost.groupBy","BlogPost.aggregate","BlogCategory.findUnique","BlogCategory.findUniqueOrThrow","BlogCategory.findFirst","BlogCategory.findFirstOrThrow","BlogCategory.findMany","BlogCategory.createOne","BlogCategory.createMany","BlogCategory.createManyAndReturn","BlogCategory.updateOne","BlogCategory.updateMany","BlogCategory.updateManyAndReturn","BlogCategory.upsertOne","BlogCategory.deleteOne","BlogCategory.deleteMany","BlogCategory.groupBy","BlogCategory.aggregate","BlogTag.findUnique","BlogTag.findUniqueOrThrow","BlogTag.findFirst","BlogTag.findFirstOrThrow","BlogTag.findMany","BlogTag.createOne","BlogTag.createMany","BlogTag.createManyAndReturn","BlogTag.updateOne","BlogTag.updateMany","BlogTag.updateManyAndReturn","BlogTag.upsertOne","BlogTag.deleteOne","BlogTag.deleteMany","BlogTag.groupBy","BlogTag.aggregate","BlogPostCategory.findUnique","BlogPostCategory.findUniqueOrThrow","BlogPostCategory.findFirst","BlogPostCategory.findFirstOrThrow","BlogPostCategory.findMany","BlogPostCategory.createOne","BlogPostCategory.createMany","BlogPostCategory.createManyAndReturn","BlogPostCategory.updateOne","BlogPostCategory.updateMany","BlogPostCategory.updateManyAndReturn","BlogPostCategory.upsertOne","BlogPostCategory.deleteOne","BlogPostCategory.deleteMany","BlogPostCategory.groupBy","BlogPostCategory.aggregate","BlogPostTag.findUnique","BlogPostTag.findUniqueOrThrow","BlogPostTag.findFirst","BlogPostTag.findFirstOrThrow","BlogPostTag.findMany","BlogPostTag.createOne","BlogPostTag.createMany","BlogPostTag.createManyAndReturn","BlogPostTag.updateOne","BlogPostTag.updateMany","BlogPostTag.updateManyAndReturn","BlogPostTag.upsertOne","BlogPostTag.deleteOne","BlogPostTag.deleteMany","BlogPostTag.groupBy","BlogPostTag.aggregate","BlogComment.findUnique","BlogComment.findUniqueOrThrow","BlogComment.findFirst","BlogComment.findFirstOrThrow","BlogComment.findMany","BlogComment.createOne","BlogComment.createMany","BlogComment.createManyAndReturn","BlogComment.updateOne","BlogComment.updateMany","BlogComment.updateManyAndReturn","BlogComment.upsertOne","BlogComment.deleteOne","BlogComment.deleteMany","BlogComment.groupBy","BlogComment.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","ProductView.findUnique","ProductView.findUniqueOrThrow","ProductView.findFirst","ProductView.findFirstOrThrow","ProductView.findMany","ProductView.createOne","ProductView.createMany","ProductView.createManyAndReturn","ProductView.updateOne","ProductView.updateMany","ProductView.updateManyAndReturn","ProductView.upsertOne","ProductView.deleteOne","ProductView.deleteMany","ProductView.groupBy","ProductView.aggregate","SearchQuery.findUnique","SearchQuery.findUniqueOrThrow","SearchQuery.findFirst","SearchQuery.findFirstOrThrow","SearchQuery.findMany","SearchQuery.createOne","SearchQuery.createMany","SearchQuery.createManyAndReturn","SearchQuery.updateOne","SearchQuery.updateMany","SearchQuery.updateManyAndReturn","SearchQuery.upsertOne","SearchQuery.deleteOne","SearchQuery.deleteMany","SearchQuery.groupBy","SearchQuery.aggregate","ConversionEvent.findUnique","ConversionEvent.findUniqueOrThrow","ConversionEvent.findFirst","ConversionEvent.findFirstOrThrow","ConversionEvent.findMany","ConversionEvent.createOne","ConversionEvent.createMany","ConversionEvent.createManyAndReturn","ConversionEvent.updateOne","ConversionEvent.updateMany","ConversionEvent.updateManyAndReturn","ConversionEvent.upsertOne","ConversionEvent.deleteOne","ConversionEvent.deleteMany","ConversionEvent.groupBy","ConversionEvent.aggregate","AND","OR","NOT","id","eventType","eventId","userId","sessionId","orderId","productId","value","currency","sourceUrl","ipAddress","userAgent","sentToMeta","sentToGa4","metaLastSentAt","ga4LastSentAt","attemptCount","lastAttemptAt","lastError","metadata","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","query","resultCount","filters","ip","referrer","viewedAt","conversationId","senderId","UserRole","senderRole","content","attachments","MessageStatus","status","updatedAt","customerId","subject","ConversationStatus","assignedTo","postId","authorName","authorEmail","isApproved","parentId","tagId","categoryId","name","slug","every","some","none","description","title","excerpt","featuredImage","authorId","publishedAt","isPublished","views","metaTitle","metaDescription","metaKeywords","allowComments","wishlistId","variantOptionId","isPublic","shareToken","InventoryTransactionType","type","quantity","previousStock","newStock","referenceId","referenceType","note","createdBy","couponId","code","DiscountType","discountType","discountValue","minPurchase","maxDiscount","usageLimit","usageCount","perUserLimit","validFrom","validUntil","isActive","appliesToAll","PaymentMethod","method","PaymentStatus","amount","transactionId","gatewayResponse","paidAt","errorMessage","shipmentId","location","occurredAt","carrier","trackingNumber","trackingUrl","shippingMethod","estimatedDelivery","actualDelivery","ShipmentStatus","OrderStatus","changedBy","productName","productSku","productImage","variantSnapshot","unitPrice","discountAmount","total","orderNumber","shippingAddressId","billingAddress","notes","adminNotes","subtotal","discountTotal","shippingCost","tax","couponCode","placedAt","processedAt","shippedAt","deliveredAt","cancelledAt","returnedAt","cartId","totalPrice","rating","comment","isVerifiedPurchase","helpfulVotes","notHelpfulVotes","adminReply","adminRepliedAt","adminRepliedBy","src","publicId","altText","sortOrder","isPrimary","variantId","productVariantId","sku","barcode","price","compareAtPrice","costPrice","stock","shortDesc","brand","lowStockThreshold","hasVariants","isFeatured","isDigital","image","label","recipient","phone","street","city","state","zipCode","country","isDefault","passwordHash","providerId","providerAccountId","accessToken","refreshToken","expiresAt","tokenType","scope","idToken","token","email","emailVerified","role","UserStatus","lastLoginAt","lastIp","referralSource","postId_tagId","postId_categoryId","providerId_providerAccountId","productId_tagId","userId_productId","couponId_categoryId","wishlistId_variantOptionId","cartId_variantOptionId","productVariantId_sku","parentId_name","couponId_productId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "xxTgAuAEIQ4AAIAKACAVAACFCgAgHAAA_wkAIB8AAIIKACAgAACECgAgIwAApAkAICkAAPsJACAqAAD8CQAgKwAA_QkAICwAAP4JACAxAADhCQAgMgAAgQoAIDMAAP8JACA0AACDCgAgOQAAhwkAIKIFAAD5CQAwowUAAFUAEKQFAAD5CQAwpQUBAAAAAbAFAQD_CAAhuAUAAIYJACC5BUAA-wgAIdgFAAD6CfEGItkFQAD7CAAh5QUBAP8IACHZBgEA_wgAIdwGAQAAAAHtBgEAAAAB7gYgAIQJACHvBgAA4wnUBSLxBkAAgwkAIfIGAQD_CAAh8wYBAP8IACEBAAAAAQAgEgMAAIsJACAjAACkCQAgogUAALEKADCjBQAAAwAQpAUAALEKADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHZBUAA-wgAIdoGAQD_CAAh2wYBAP8IACHcBgEA_wgAId0GAQD6CAAh3gYBAPoIACHfBgEA_wgAIeAGAQD_CAAh4QYBAPoIACHiBiAAhAkAIQcDAAD7CwAgIwAAng0AINoGAACyCgAg2wYAALIKACDcBgAAsgoAIN8GAACyCgAg4AYAALIKACASAwAAiwkAICMAAKQJACCiBQAAsQoAMKMFAAADABCkBQAAsQoAMKUFAQAAAAGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHaBgEA_wgAIdsGAQD_CAAh3AYBAP8IACHdBgEA-ggAId4GAQD6CAAh3wYBAP8IACHgBgEA_wgAIeEGAQD6CAAh4gYgAIQJACEDAAAAAwAgAQAABAAwAgAABQAgIgMAAIsJACAEAACsCgAgBQAArQoAIAwAAJ0KACAgAACECgAgJAAArgoAICUAAK8KACAoAACwCgAgogUAAKsKADCjBQAABwAQpAUAAKsKADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHYBQAA7wmkBiLZBUAA-wgAIYMGAQD_CAAhqwYQAJ8JACGsBgEA-ggAIa0GAQD6CAAhrgYAAIYJACCvBgEA_wgAIbAGAQD_CAAhsQYQAJ8JACGyBhAAnwkAIbMGEACfCQAhtAYQAJ8JACG1BgEA_wgAIbYGQAD7CAAhtwZAAIMJACG4BkAAgwkAIbkGQACDCQAhugZAAIMJACG7BkAAgwkAIRIDAAD7CwAgBAAAhBIAIAUAAPsRACAMAAD_EQAgIAAA7hEAICQAAIUSACAlAACGEgAgKAAAhxIAIIMGAACyCgAgrgYAALIKACCvBgAAsgoAILAGAACyCgAgtQYAALIKACC3BgAAsgoAILgGAACyCgAguQYAALIKACC6BgAAsgoAILsGAACyCgAgIgMAAIsJACAEAACsCgAgBQAArQoAIAwAAJ0KACAgAACECgAgJAAArgoAICUAAK8KACAoAACwCgAgogUAAKsKADCjBQAABwAQpAUAAKsKADClBQEAAAABqAUBAPoIACG5BUAA-wgAIdgFAADvCaQGItkFQAD7CAAhgwYBAP8IACGrBhAAnwkAIawGAQAAAAGtBgEA-ggAIa4GAACGCQAgrwYBAP8IACGwBgEA_wgAIbEGEACfCQAhsgYQAJ8JACGzBhAAnwkAIbQGEACfCQAhtQYBAP8IACG2BkAA-wgAIbcGQACDCQAhuAZAAIMJACG5BkAAgwkAIboGQACDCQAhuwZAAIMJACEDAAAABwAgAQAACAAwAgAACQAgFggAAKIJACAiAACjCQAgIwAApAkAIKIFAACdCQAwowUAAAsAEKQFAACdCQAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAh6gUBAP8IACGEBgEA-ggAIYYGAACeCYYGIocGEACfCQAhiAYQAKAJACGJBhAAoAkAIYoGAgChCQAhiwYCAIUJACGMBgIAoQkAIY0GQAD7CAAhjgZAAPsIACGPBiAAhAkAIZAGIACECQAhAQAAAAsAIAcFAACNCgAgCQAA9QkAIKIFAACqCgAwowUAAA0AEKQFAACqCgAwqwUBAPoIACGDBgEA-ggAIQIFAAD7EQAgCQAA9xEAIAgFAACNCgAgCQAA9QkAIKIFAACqCgAwowUAAA0AEKQFAACqCgAwqwUBAPoIACGDBgEA-ggAIf4GAACpCgAgAwAAAA0AIAEAAA4AMAIAAA8AIBUGAACiCgAgBwAApwoAIAgAAKgKACAKAACJCgAgGQAAowkAIKIFAACmCgAwowUAABEAEKQFAACmCgAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAh4gUBAP8IACHlBQEA-ggAIeYFAQD6CAAh6gUBAP8IACHyBQEA_wgAIfMFAQD_CAAh9AUBAP8IACGPBiAAhAkAIckGAgCFCQAh2QYBAP8IACEBAAAAEQAgAQAAABEAIAsGAAD8EQAgBwAAghIAIAgAAIMSACAKAAD5EQAgGQAAnQ0AIOIFAACyCgAg6gUAALIKACDyBQAAsgoAIPMFAACyCgAg9AUAALIKACDZBgAAsgoAIBYGAACiCgAgBwAApwoAIAgAAKgKACAKAACJCgAgGQAAowkAIKIFAACmCgAwowUAABEAEKQFAACmCgAwpQUBAAAAAbkFQAD7CAAh2QVAAPsIACHiBQEA_wgAIeUFAQD6CAAh5gUBAAAAAeoFAQD_CAAh8gUBAP8IACHzBQEA_wgAIfQFAQD_CAAhjwYgAIQJACHJBgIAhQkAIdkGAQD_CAAh_QYAAKUKACADAAAAEQAgAQAAFAAwAgAAFQAgJAoAAIkKACAQAADACQAgGAAAogoAIBoAAKQKACAcAAD_CQAgHgAAyQkAIB8AAIIKACAgAACECgAgIQAAogkAIKIFAACjCgAwowUAABcAEKQFAACjCgAwpQUBAPoIACG4BQAAhgkAILkFQAD7CAAh2QVAAPsIACHkBQEA_wgAIeYFAQD6CAAh6gUBAP8IACHrBQEA-ggAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhzQYBAP8IACHOBgEA_wgAIc8GEACgCQAh0AYQAKAJACHRBhAAoAkAIdIGAgChCQAh0wYBAP8IACHUBgEA_wgAIdUGAgCFCQAh1gYgAIQJACHXBiAAhAkAIdgGIACECQAhFwoAAPkRACAQAADkDQAgGAAA_BEAIBoAAIESACAcAADoEQAgHgAA3w8AIB8AAOwRACAgAADuEQAgIQAAnA0AILgFAACyCgAg5AUAALIKACDqBQAAsgoAIPIFAACyCgAg8wUAALIKACD0BQAAsgoAIM0GAACyCgAgzgYAALIKACDPBgAAsgoAINAGAACyCgAg0QYAALIKACDSBgAAsgoAINMGAACyCgAg1AYAALIKACAkCgAAiQoAIBAAAMAJACAYAACiCgAgGgAApAoAIBwAAP8JACAeAADJCQAgHwAAggoAICAAAIQKACAhAACiCQAgogUAAKMKADCjBQAAFwAQpAUAAKMKADClBQEAAAABuAUAAIYJACC5BUAA-wgAIdkFQAD7CAAh5AUBAP8IACHmBQEAAAAB6gUBAP8IACHrBQEA-ggAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhzQYBAAAAAc4GAQD_CAAhzwYQAKAJACHQBhAAoAkAIdEGEACgCQAh0gYCAKEJACHTBgEA_wgAIdQGAQD_CAAh1QYCAIUJACHWBiAAhAkAIdcGIACECQAh2AYgAIQJACEDAAAAFwAgAQAAGAAwAgAAGQAgEwkAAPMJACALAACgCgAgDwAAoQoAIBgAAKIKACCiBQAAnwoAMKMFAAAbABCkBQAAnwoAMKUFAQD6CAAhqwUBAP8IACG5BUAA-wgAIdkFQAD7CAAh5AUBAP8IACH3BQEA_wgAIcYGAQD6CAAhxwYBAP8IACHIBgEA_wgAIckGAgCFCQAhygYgAIQJACHLBgEA_wgAIQoJAAD3EQAgCwAA_hEAIA8AAP0RACAYAAD8EQAgqwUAALIKACDkBQAAsgoAIPcFAACyCgAgxwYAALIKACDIBgAAsgoAIMsGAACyCgAgEwkAAPMJACALAACgCgAgDwAAoQoAIBgAAKIKACCiBQAAnwoAMKMFAAAbABCkBQAAnwoAMKUFAQAAAAGrBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHkBQEA_wgAIfcFAQD_CAAhxgYBAPoIACHHBgEA_wgAIcgGAQD_CAAhyQYCAIUJACHKBiAAhAkAIcsGAQD_CAAhAwAAABsAIAEAABwAMAIAAB0AIAEAAAAXACAMCQAA9QkAIAoAAIkKACAXAACKCgAgogUAAIgKADCjBQAAIAAQpAUAAIgKADClBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIesFAQD6CAAhjwYgAIQJACEBAAAAIAAgAwAAABsAIAEAABwAMAIAAB0AIBQKAACJCgAgCwAAnAoAIBAAAMAJACASAACdCgAgFAAAngoAIBYAAIwJACCiBQAAmwoAMKMFAAAjABCkBQAAmwoAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIY8GIACECQAhzAYBAPoIACHNBgEA-ggAIc4GAQD_CAAhzwYQAJ8JACHQBhAAoAkAIdEGEACgCQAh0gYCAIUJACEJCgAA-REAIAsAAP4RACAQAADkDQAgEgAA_xEAIBQAAIASACAWAAD8CwAgzgYAALIKACDQBgAAsgoAINEGAACyCgAgFQoAAIkKACALAACcCgAgEAAAwAkAIBIAAJ0KACAUAACeCgAgFgAAjAkAIKIFAACbCgAwowUAACMAEKQFAACbCgAwpQUBAAAAAbkFQAD7CAAh2QVAAPsIACGPBiAAhAkAIcwGAQD6CAAhzQYBAAAAAc4GAQD_CAAhzwYQAJ8JACHQBhAAoAkAIdEGEACgCQAh0gYCAIUJACH8BgAAmgoAIAMAAAAjACABAAAkADACAAAlACANCQAA9QkAIA4AAJkKACAPAACSCgAgogUAAJgKADCjBQAAJwAQpAUAAJgKADClBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIfcFAQD6CAAh_AUCAIUJACG8BgEA-ggAIQMJAAD3EQAgDgAA6REAIA8AAP0RACAOCQAA9QkAIA4AAJkKACAPAACSCgAgogUAAJgKADCjBQAAJwAQpAUAAJgKADClBQEAAAABqwUBAPoIACG5BUAA-wgAIdkFQAD7CAAh9wUBAPoIACH8BQIAhQkAIbwGAQD6CAAh-wYAAJcKACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAEAAAAnACASDwAAkgoAIBEAAK8JACCiBQAAlQoAMKMFAAAtABCkBQAAlQoAMKUFAQD6CAAhqgUBAPoIACGrBQEA-ggAIbkFQAD7CAAh9wUBAPoIACH8BQIAhQkAIaUGAQD6CAAhpgYBAPoIACGnBgEA_wgAIagGAACWCgAgqQYQAJ8JACGqBhAAnwkAIasGEACfCQAhAw8AAP0RACARAACmDQAgpwYAALIKACASDwAAkgoAIBEAAK8JACCiBQAAlQoAMKMFAAAtABCkBQAAlQoAMKUFAQAAAAGqBQEA-ggAIasFAQD6CAAhuQVAAPsIACH3BQEA-ggAIfwFAgCFCQAhpQYBAPoIACGmBgEA-ggAIacGAQD_CAAhqAYAAJYKACCpBhAAnwkAIaoGEACfCQAhqwYQAJ8JACEDAAAALQAgAQAALgAwAgAALwAgAwAAABsAIAEAABwAMAIAAB0AIA8TAACSCgAgogUAAJMKADCjBQAAMgAQpAUAAJMKADClBQEA-ggAIbkFQAD7CAAh9wUBAPoIACH7BQAAlAr7BSL8BQIAhQkAIf0FAgCFCQAh_gUCAIUJACH_BQEA_wgAIYAGAQD_CAAhgQYBAP8IACGCBgEA_wgAIQUTAAD9EQAg_wUAALIKACCABgAAsgoAIIEGAACyCgAgggYAALIKACAPEwAAkgoAIKIFAACTCgAwowUAADIAEKQFAACTCgAwpQUBAAAAAbkFQAD7CAAh9wUBAPoIACH7BQAAlAr7BSL8BQIAhQkAIf0FAgCFCQAh_gUCAIUJACH_BQEA_wgAIYAGAQD_CAAhgQYBAP8IACGCBgEA_wgAIQMAAAAyACABAAAzADACAAA0ACAJDwAAkgoAIBUAAJEKACCiBQAAkAoAMKMFAAA2ABCkBQAAkAoAMKUFAQD6CAAhuQVAAPsIACH2BQEA-ggAIfcFAQD6CAAhAg8AAP0RACAVAADvEQAgCg8AAJIKACAVAACRCgAgogUAAJAKADCjBQAANgAQpAUAAJAKADClBQEAAAABuQVAAPsIACH2BQEA-ggAIfcFAQD6CAAh-gYAAI8KACADAAAANgAgAQAANwAwAgAAOAAgAwAAADYAIAEAADcAMAIAADgAIAEAAAA2ACABAAAAJwAgAQAAAC0AIAEAAAAbACABAAAAMgAgAQAAADYAIAEAAAAbACABAAAAIwAgAQAAACMAIAEAAAARACAHBQAAjQoAIBgAAI4KACCiBQAAjAoAMKMFAABFABCkBQAAjAoAMOQFAQD6CAAhgwYBAPoIACECBQAA-xEAIBgAAPwRACAIBQAAjQoAIBgAAI4KACCiBQAAjAoAMKMFAABFABCkBQAAjAoAMOQFAQD6CAAhgwYBAPoIACH5BgAAiwoAIAMAAABFACABAABGADACAABHACABAAAAEQAgAQAAABcAIAEAAAAbACABAAAARQAgAwkAAPcRACAKAAD5EQAgFwAA-hEAIAwJAAD1CQAgCgAAiQoAIBcAAIoKACCiBQAAiAoAMKMFAAAgABCkBQAAiAoAMKUFAQAAAAGrBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHrBQEA-ggAIY8GIACECQAhAwAAACAAIAEAAE0AMAIAAE4AIAMAAAAbACABAAAcADACAAAdACAVAwAAiwkAIAkAAPUJACAbAADcCQAgogUAAIcKADCjBQAAUQAQpAUAAIcKADClBQEA-ggAIagFAQD6CAAhqwUBAPoIACG5BUAA-wgAIdkFQAD7CAAh4QUgAIQJACHrBQEA_wgAIb4GAgCFCQAhvwYBAP8IACHABiAAhAkAIcEGAgCFCQAhwgYCAIUJACHDBgEA_wgAIcQGQACDCQAhxQYBAP8IACEIAwAA-wsAIAkAAPcRACAbAAD7CwAg6wUAALIKACC_BgAAsgoAIMMGAACyCgAgxAYAALIKACDFBgAAsgoAIBYDAACLCQAgCQAA9QkAIBsAANwJACCiBQAAhwoAMKMFAABRABCkBQAAhwoAMKUFAQAAAAGoBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeEFIACECQAh6wUBAP8IACG-BgIAhQkAIb8GAQD_CAAhwAYgAIQJACHBBgIAhQkAIcIGAgCFCQAhwwYBAP8IACHEBkAAgwkAIcUGAQD_CAAh-AYAAIYKACADAAAAUQAgAQAAUgAwAgAAUwAgIQ4AAIAKACAVAACFCgAgHAAA_wkAIB8AAIIKACAgAACECgAgIwAApAkAICkAAPsJACAqAAD8CQAgKwAA_QkAICwAAP4JACAxAADhCQAgMgAAgQoAIDMAAP8JACA0AACDCgAgOQAAhwkAIKIFAAD5CQAwowUAAFUAEKQFAAD5CQAwpQUBAPoIACGwBQEA_wgAIbgFAACGCQAguQVAAPsIACHYBQAA-gnxBiLZBUAA-wgAIeUFAQD_CAAh2QYBAP8IACHcBgEA_wgAIe0GAQD6CAAh7gYgAIQJACHvBgAA4wnUBSLxBkAAgwkAIfIGAQD_CAAh8wYBAP8IACEBAAAAVQAgCAkAAPUJACAdAAD4CQAgogUAAPcJADCjBQAAVwAQpAUAAPcJADCrBQEA-ggAIbkFQAD7CAAh4wUBAPoIACECCQAA9xEAIB0AAPgRACAJCQAA9QkAIB0AAPgJACCiBQAA9wkAMKMFAABXABCkBQAA9wkAMKsFAQD6CAAhuQVAAPsIACHjBQEA-ggAIfcGAAD2CQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACABAAAAVwAgDQMAANwJACAJAAD1CQAgogUAAPQJADCjBQAAXQAQpAUAAPQJADClBQEA-ggAIagFAQD_CAAhqQUBAP8IACGrBQEA-ggAIbAFAQD_CAAhzgUBAP8IACHPBQEA_wgAIdAFQAD7CAAhBwMAAPsLACAJAAD3EQAgqAUAALIKACCpBQAAsgoAILAFAACyCgAgzgUAALIKACDPBQAAsgoAIA0DAADcCQAgCQAA9QkAIKIFAAD0CQAwowUAAF0AEKQFAAD0CQAwpQUBAAAAAagFAQD_CAAhqQUBAP8IACGrBQEA-ggAIbAFAQD_CAAhzgUBAP8IACHPBQEA_wgAIdAFQAD7CAAhAwAAAF0AIAEAAF4AMAIAAF8AIAEAAABVACAbAwAA3AkAIAkAAPMJACARAADyCQAgogUAAPAJADCjBQAAYgAQpAUAAPAJADClBQEA-ggAIaYFAQD6CAAhpwUBAP8IACGoBQEA_wgAIakFAQD_CAAhqgUBAP8IACGrBQEA_wgAIawFCADxCQAhrQUBAP8IACGuBQEA_wgAIa8FAQD_CAAhsAUBAP8IACGxBSAAhAkAIbIFIACECQAhswVAAIMJACG0BUAAgwkAIbUFAgCFCQAhtgVAAIMJACG3BQEA_wgAIbgFAACGCQAguQVAAPsIACESAwAA-wsAIAkAAPcRACARAACmDQAgpwUAALIKACCoBQAAsgoAIKkFAACyCgAgqgUAALIKACCrBQAAsgoAIKwFAACyCgAgrQUAALIKACCuBQAAsgoAIK8FAACyCgAgsAUAALIKACCzBQAAsgoAILQFAACyCgAgtgUAALIKACC3BQAAsgoAILgFAACyCgAgGwMAANwJACAJAADzCQAgEQAA8gkAIKIFAADwCQAwowUAAGIAEKQFAADwCQAwpQUBAAAAAaYFAQD6CAAhpwUBAAAAAagFAQD_CAAhqQUBAP8IACGqBQEA_wgAIasFAQD_CAAhrAUIAPEJACGtBQEA_wgAIa4FAQD_CAAhrwUBAP8IACGwBQEA_wgAIbEFIACECQAhsgUgAIQJACGzBUAAgwkAIbQFQACDCQAhtQUCAIUJACG2BUAAgwkAIbcFAQD_CAAhuAUAAIYJACC5BUAA-wgAIQMAAABiACABAABjADACAABkACABAAAAVQAgAQAAAAcAIAEAAAAXACADAAAADQAgAQAADgAwAgAADwAgAwAAACcAIAEAACgAMAIAACkAIAEAAAAgACABAAAAGwAgAQAAAFEAIAEAAABXACABAAAAXQAgAQAAAGIAIAEAAAANACABAAAAJwAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAAAHACABAAAIADACAAAJACABAAAADQAgAQAAAEUAIAEAAAAHACADAAAALQAgAQAALgAwAgAALwAgDxEAAK8JACCiBQAArAkAMKMFAAB5ABCkBQAArAkAMKUFAQD6CAAhqgUBAPoIACG5BUAA-wgAIdgFAACuCZQGItkFQAD7CAAhkgYAAK0JkgYilAYQAJ8JACGVBgEA_wgAIZYGAACGCQAglwZAAIMJACGYBgEA_wgAIQEAAAB5ACAKEQAArwkAIKIFAADuCQAwowUAAHsAEKQFAADuCQAwpQUBAPoIACGqBQEA-ggAIbkFQAD7CAAh2AUAAO8JpAYigQYBAP8IACGkBgEA_wgAIQMRAACmDQAggQYAALIKACCkBgAAsgoAIAoRAACvCQAgogUAAO4JADCjBQAAewAQpAUAAO4JADClBQEAAAABqgUBAPoIACG5BUAA-wgAIdgFAADvCaQGIoEGAQD_CAAhpAYBAP8IACEDAAAAewAgAQAAfAAwAgAAfQAgEREAAK8JACAnAADtCQAgogUAAOsJADCjBQAAfwAQpAUAAOsJADClBQEA-ggAIaoFAQD6CAAhuAUAAIYJACC5BUAA-wgAIdgFAADsCaMGItkFQAD7CAAhnAYBAPoIACGdBgEA-ggAIZ4GAQD_CAAhnwYBAP8IACGgBkAAgwkAIaEGQACDCQAhBxEAAKYNACAnAAD2EQAguAUAALIKACCeBgAAsgoAIJ8GAACyCgAgoAYAALIKACChBgAAsgoAIBERAACvCQAgJwAA7QkAIKIFAADrCQAwowUAAH8AEKQFAADrCQAwpQUBAAAAAaoFAQAAAAG4BQAAhgkAILkFQAD7CAAh2AUAAOwJowYi2QVAAPsIACGcBgEA-ggAIZ0GAQD6CAAhngYBAP8IACGfBgEA_wgAIaAGQACDCQAhoQZAAIMJACEDAAAAfwAgAQAAgAEAMAIAAIEBACALJgAA6gkAIKIFAADpCQAwowUAAIMBABCkBQAA6QkAMKUFAQD6CAAhuQVAAPsIACHYBQEA-ggAIeoFAQD_CAAhmQYBAPoIACGaBgEA_wgAIZsGQAD7CAAhAyYAAPURACDqBQAAsgoAIJoGAACyCgAgCyYAAOoJACCiBQAA6QkAMKMFAACDAQAQpAUAAOkJADClBQEAAAABuQVAAPsIACHYBQEA-ggAIeoFAQD_CAAhmQYBAPoIACGaBgEA_wgAIZsGQAD7CAAhAwAAAIMBACABAACEAQAwAgAAhQEAIAEAAACDAQAgAwAAAGIAIAEAAGMAMAIAAGQAIAEAAAAtACABAAAAewAgAQAAAH8AIAEAAABiACABAAAABwAgDAMAAIsJACCiBQAA6AkAMKMFAACOAQAQpAUAAOgJADClBQEA-ggAIagFAQD6CAAhrwUBAP8IACGwBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHoBkAA-wgAIewGAQD6CAAhAwMAAPsLACCvBQAAsgoAILAFAACyCgAgDAMAAIsJACCiBQAA6AkAMKMFAACOAQAQpAUAAOgJADClBQEAAAABqAUBAPoIACGvBQEA_wgAIbAFAQD_CAAhuQVAAPsIACHZBUAA-wgAIegGQAD7CAAh7AYBAAAAAQMAAACOAQAgAQAAjwEAMAIAAJABACAQAwAAiwkAIKIFAADnCQAwowUAAJIBABCkBQAA5wkAMKUFAQD6CAAhqAUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5AYBAPoIACHlBgEA-ggAIeYGAQD_CAAh5wYBAP8IACHoBkAAgwkAIekGAQD_CAAh6gYBAP8IACHrBgEA_wgAIQcDAAD7CwAg5gYAALIKACDnBgAAsgoAIOgGAACyCgAg6QYAALIKACDqBgAAsgoAIOsGAACyCgAgEQMAAIsJACCiBQAA5wkAMKMFAACSAQAQpAUAAOcJADClBQEAAAABqAUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5AYBAPoIACHlBgEA-ggAIeYGAQD_CAAh5wYBAP8IACHoBkAAgwkAIekGAQD_CAAh6gYBAP8IACHrBgEA_wgAIfYGAADmCQAgAwAAAJIBACABAACTAQAwAgAAlAEAIAkDAACLCQAgogUAAM0JADCjBQAAlgEAEKQFAADNCQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHjBgEA-ggAIQEAAACWAQAgAwAAAFEAIAEAAFIAMAIAAFMAIAMAAAAHACABAAAIADACAAAJACAKAwAAiwkAIAwAAMAJACCiBQAAvwkAMKMFAACaAQAQpAUAAL8JADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHZBUAA-wgAIb0GEACfCQAhAQAAAJoBACAOLwAA5QkAIDAAAIsJACCiBQAA4gkAMKMFAACcAQAQpAUAAOIJADClBQEA-ggAIbkFQAD7CAAh0QUBAPoIACHSBQEA-ggAIdQFAADjCdQFItUFAQD6CAAh1gUAAIYJACDYBQAA5AnYBSLZBUAA-wgAIQMvAAD0EQAgMAAA-wsAINYFAACyCgAgDi8AAOUJACAwAACLCQAgogUAAOIJADCjBQAAnAEAEKQFAADiCQAwpQUBAAAAAbkFQAD7CAAh0QUBAPoIACHSBQEA-ggAIdQFAADjCdQFItUFAQD6CAAh1gUAAIYJACDYBQAA5AnYBSLZBUAA-wgAIQMAAACcAQAgAQAAnQEAMAIAAJ4BACADAAAAnAEAIAEAAJ0BADACAACeAQAgAQAAAJwBACAMLQAAiwkAIC4AAOEJACCiBQAA3wkAMKMFAACiAQAQpAUAAN8JADClBQEA-ggAIbkFQAD7CAAh2AUAAOAJ3QUi2QVAAPsIACHaBQEA-ggAIdsFAQD6CAAh3QUBAP8IACEDLQAA-wsAIC4AAOoRACDdBQAAsgoAIAwtAACLCQAgLgAA4QkAIKIFAADfCQAwowUAAKIBABCkBQAA3wkAMKUFAQAAAAG5BUAA-wgAIdgFAADgCd0FItkFQAD7CAAh2gUBAPoIACHbBQEA-ggAId0FAQD_CAAhAwAAAKIBACABAACjAQAwAgAApAEAIAMAAABRACABAABSADACAABTACADAAAAXQAgAQAAXgAwAgAAXwAgCwMAANwJACCiBQAA3gkAMKMFAACoAQAQpAUAAN4JADClBQEA-ggAIagFAQD_CAAhqQUBAP8IACG5BUAA-wgAIcsFAQD6CAAhzAUCAKEJACHNBQAAhgkAIAUDAAD7CwAgqAUAALIKACCpBQAAsgoAIMwFAACyCgAgzQUAALIKACALAwAA3AkAIKIFAADeCQAwowUAAKgBABCkBQAA3gkAMKUFAQAAAAGoBQEA_wgAIakFAQD_CAAhuQVAAPsIACHLBQEA-ggAIcwFAgChCQAhzQUAAIYJACADAAAAqAEAIAEAAKkBADACAACqAQAgAQAAAFUAIBEDAADcCQAgBgAA3QkAIDUAANYJACA4AACHCQAgogUAANsJADCjBQAArQEAEKQFAADbCQAwpQUBAPoIACGoBQEA_wgAIbkFQAD7CAAh1QUBAPoIACHZBUAA-wgAId4FAQD6CAAh3wUBAP8IACHgBQEA_wgAIeEFIACECQAh4gUBAP8IACEIAwAA-wsAIAYAAPMRACA1AADwEQAgOAAA4AsAIKgFAACyCgAg3wUAALIKACDgBQAAsgoAIOIFAACyCgAgEQMAANwJACAGAADdCQAgNQAA1gkAIDgAAIcJACCiBQAA2wkAMKMFAACtAQAQpAUAANsJADClBQEAAAABqAUBAP8IACG5BUAA-wgAIdUFAQD6CAAh2QVAAPsIACHeBQEA-ggAId8FAQD_CAAh4AUBAP8IACHhBSAAhAkAIeIFAQD_CAAhAwAAAK0BACABAACuAQAwAgAArwEAIAcYAADaCQAgNQAA1gkAIKIFAADZCQAwowUAALEBABCkBQAA2QkAMN4FAQD6CAAh5AUBAPoIACECGAAA8hEAIDUAAPARACAIGAAA2gkAIDUAANYJACCiBQAA2QkAMKMFAACxAQAQpAUAANkJADDeBQEA-ggAIeQFAQD6CAAh9QYAANgJACADAAAAsQEAIAEAALIBADACAACzAQAgAwAAALEBACABAACyAQAwAgAAswEAIAEAAACxAQAgBx0AANcJACA1AADWCQAgogUAANUJADCjBQAAtwEAEKQFAADVCQAw3gUBAPoIACHjBQEA-ggAIQIdAADxEQAgNQAA8BEAIAgdAADXCQAgNQAA1gkAIKIFAADVCQAwowUAALcBABCkBQAA1QkAMN4FAQD6CAAh4wUBAPoIACH0BgAA1AkAIAMAAAC3AQAgAQAAuAEAMAIAALkBACADAAAAtwEAIAEAALgBADACAAC5AQAgAQAAALcBACADAAAArQEAIAEAAK4BADACAACvAQAgAQAAALEBACABAAAAtwEAIAEAAACtAQAgAQAAAFUAIAEAAACtAQAgAwAAAK0BACABAACuAQAwAgAArwEAIAEAAACtAQAgAwAAAGIAIAEAAGMAMAIAAGQAIAwDAACLCQAgDAAAjAkAIKIFAACKCQAwowUAAMYBABCkBQAAigkAMKUFAQD6CAAhqAUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5QUBAPoIACH4BSAAhAkAIfkFAQD_CAAhAQAAAMYBACABAAAAAwAgAQAAAI4BACABAAAAkgEAIAEAAABRACABAAAABwAgAQAAAJwBACABAAAAogEAIAEAAABRACABAAAAXQAgAQAAAKgBACABAAAArQEAIAEAAABiACABAAAAAQAgFw4AAOkRACAVAADvEQAgHAAA6BEAIB8AAOwRACAgAADuEQAgIwAAng0AICkAAOQRACAqAADlEQAgKwAA5hEAICwAAOcRACAxAADqEQAgMgAA6xEAIDMAAOgRACA0AADtEQAgOQAA4AsAILAFAACyCgAguAUAALIKACDlBQAAsgoAINkGAACyCgAg3AYAALIKACDxBgAAsgoAIPIGAACyCgAg8wYAALIKACADAAAAVQAgAQAA1QEAMAIAAAEAIAMAAABVACABAADVAQAwAgAAAQAgAwAAAFUAIAEAANUBADACAAABACAeDgAA2xEAIBUAAOMRACAcAADZEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKQAA1REAICoAANYRACArAADXEQAgLAAA2BEAIDEAANwRACAyAADdEQAgMwAA3hEAIDQAAOARACA5AADhEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8QYC2QVAAAAAAeUFAQAAAAHZBgEAAAAB3AYBAAAAAe0GAQAAAAHuBiAAAAAB7wYAAADUBQLxBkAAAAAB8gYBAAAAAfMGAQAAAAEBPwAA2QEAIA-lBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQE_AADbAQAwAT8AANsBADAeDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIQIAAAABACA_AADeAQAgD6UFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACECAAAAVQAgPwAA4AEAIAIAAABVACA_AADgAQAgAwAAAAEAIEYAANkBACBHAADeAQAgAQAAAAEAIAEAAABVACALDQAAuBAAIEwAALoQACBNAAC5EAAgsAUAALIKACC4BQAAsgoAIOUFAACyCgAg2QYAALIKACDcBgAAsgoAIPEGAACyCgAg8gYAALIKACDzBgAAsgoAIBKiBQAA0AkAMKMFAADnAQAQpAUAANAJADClBQEAzQgAIbAFAQDOCAAhuAUAANMIACC5BUAA1AgAIdgFAADRCfEGItkFQADUCAAh5QUBAM4IACHZBgEAzggAIdwGAQDOCAAh7QYBAM0IACHuBiAA0AgAIe8GAADrCNQFIvEGQADRCAAh8gYBAM4IACHzBgEAzggAIQMAAABVACABAADmAQAwSwAA5wEAIAMAAABVACABAADVAQAwAgAAAQAgAQAAAJABACABAAAAkAEAIAMAAACOAQAgAQAAjwEAMAIAAJABACADAAAAjgEAIAEAAI8BADACAACQAQAgAwAAAI4BACABAACPAQAwAgAAkAEAIAkDAAC3EAAgpQUBAAAAAagFAQAAAAGvBQEAAAABsAUBAAAAAbkFQAAAAAHZBUAAAAAB6AZAAAAAAewGAQAAAAEBPwAA7wEAIAilBQEAAAABqAUBAAAAAa8FAQAAAAGwBQEAAAABuQVAAAAAAdkFQAAAAAHoBkAAAAAB7AYBAAAAAQE_AADxAQAwAT8AAPEBADAJAwAAthAAIKUFAQC4CgAhqAUBALgKACGvBQEAuQoAIbAFAQC5CgAhuQVAAL4KACHZBUAAvgoAIegGQAC-CgAh7AYBALgKACECAAAAkAEAID8AAPQBACAIpQUBALgKACGoBQEAuAoAIa8FAQC5CgAhsAUBALkKACG5BUAAvgoAIdkFQAC-CgAh6AZAAL4KACHsBgEAuAoAIQIAAACOAQAgPwAA9gEAIAIAAACOAQAgPwAA9gEAIAMAAACQAQAgRgAA7wEAIEcAAPQBACABAAAAkAEAIAEAAACOAQAgBQ0AALMQACBMAAC1EAAgTQAAtBAAIK8FAACyCgAgsAUAALIKACALogUAAM8JADCjBQAA_QEAEKQFAADPCQAwpQUBAM0IACGoBQEAzQgAIa8FAQDOCAAhsAUBAM4IACG5BUAA1AgAIdkFQADUCAAh6AZAANQIACHsBgEAzQgAIQMAAACOAQAgAQAA_AEAMEsAAP0BACADAAAAjgEAIAEAAI8BADACAACQAQAgAQAAAJQBACABAAAAlAEAIAMAAACSAQAgAQAAkwEAMAIAAJQBACADAAAAkgEAIAEAAJMBADACAACUAQAgAwAAAJIBACABAACTAQAwAgAAlAEAIA0DAACyEAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGAQAAAAHoBkAAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAABAT8AAIUCACAMpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGAQAAAAHoBkAAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAABAT8AAIcCADABPwAAhwIAMA0DAACxEAAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHkBgEAuAoAIeUGAQC4CgAh5gYBALkKACHnBgEAuQoAIegGQAC8CgAh6QYBALkKACHqBgEAuQoAIesGAQC5CgAhAgAAAJQBACA_AACKAgAgDKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh5AYBALgKACHlBgEAuAoAIeYGAQC5CgAh5wYBALkKACHoBkAAvAoAIekGAQC5CgAh6gYBALkKACHrBgEAuQoAIQIAAACSAQAgPwAAjAIAIAIAAACSAQAgPwAAjAIAIAMAAACUAQAgRgAAhQIAIEcAAIoCACABAAAAlAEAIAEAAACSAQAgCQ0AAK4QACBMAACwEAAgTQAArxAAIOYGAACyCgAg5wYAALIKACDoBgAAsgoAIOkGAACyCgAg6gYAALIKACDrBgAAsgoAIA-iBQAAzgkAMKMFAACTAgAQpAUAAM4JADClBQEAzQgAIagFAQDNCAAhuQVAANQIACHZBUAA1AgAIeQGAQDNCAAh5QYBAM0IACHmBgEAzggAIecGAQDOCAAh6AZAANEIACHpBgEAzggAIeoGAQDOCAAh6wYBAM4IACEDAAAAkgEAIAEAAJICADBLAACTAgAgAwAAAJIBACABAACTAQAwAgAAlAEAIAkDAACLCQAgogUAAM0JADCjBQAAlgEAEKQFAADNCQAwpQUBAAAAAagFAQAAAAG5BUAA-wgAIdkFQAD7CAAh4wYBAPoIACEBAAAAlgIAIAEAAACWAgAgAQMAAPsLACADAAAAlgEAIAEAAJkCADACAACWAgAgAwAAAJYBACABAACZAgAwAgAAlgIAIAMAAACWAQAgAQAAmQIAMAIAAJYCACAGAwAArRAAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAHjBgEAAAABAT8AAJ0CACAFpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeMGAQAAAAEBPwAAnwIAMAE_AACfAgAwBgMAAKwQACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeMGAQC4CgAhAgAAAJYCACA_AACiAgAgBaUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh4wYBALgKACECAAAAlgEAID8AAKQCACACAAAAlgEAID8AAKQCACADAAAAlgIAIEYAAJ0CACBHAACiAgAgAQAAAJYCACABAAAAlgEAIAMNAACpEAAgTAAAqxAAIE0AAKoQACAIogUAAMwJADCjBQAAqwIAEKQFAADMCQAwpQUBAM0IACGoBQEAzQgAIbkFQADUCAAh2QVAANQIACHjBgEAzQgAIQMAAACWAQAgAQAAqgIAMEsAAKsCACADAAAAlgEAIAEAAJkCADACAACWAgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAPAwAApxAAICMAAKgQACClBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAAB3QYBAAAAAd4GAQAAAAHfBgEAAAAB4AYBAAAAAeEGAQAAAAHiBiAAAAABAT8AALMCACANpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAeAGAQAAAAHhBgEAAAAB4gYgAAAAAQE_AAC1AgAwAT8AALUCADAPAwAAnBAAICMAAJ0QACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHZBUAAvgoAIdoGAQC5CgAh2wYBALkKACHcBgEAuQoAId0GAQC4CgAh3gYBALgKACHfBgEAuQoAIeAGAQC5CgAh4QYBALgKACHiBiAAuwoAIQIAAAAFACA_AAC4AgAgDaUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh2gYBALkKACHbBgEAuQoAIdwGAQC5CgAh3QYBALgKACHeBgEAuAoAId8GAQC5CgAh4AYBALkKACHhBgEAuAoAIeIGIAC7CgAhAgAAAAMAID8AALoCACACAAAAAwAgPwAAugIAIAMAAAAFACBGAACzAgAgRwAAuAIAIAEAAAAFACABAAAAAwAgCA0AAJkQACBMAACbEAAgTQAAmhAAINoGAACyCgAg2wYAALIKACDcBgAAsgoAIN8GAACyCgAg4AYAALIKACAQogUAAMsJADCjBQAAwQIAEKQFAADLCQAwpQUBAM0IACGoBQEAzQgAIbkFQADUCAAh2QVAANQIACHaBgEAzggAIdsGAQDOCAAh3AYBAM4IACHdBgEAzQgAId4GAQDNCAAh3wYBAM4IACHgBgEAzggAIeEGAQDNCAAh4gYgANAIACEDAAAAAwAgAQAAwAIAMEsAAMECACADAAAAAwAgAQAABAAwAgAABQAgAQAAABUAIAEAAAAVACADAAAAEQAgAQAAFAAwAgAAFQAgAwAAABEAIAEAABQAMAIAABUAIAMAAAARACABAAAUADACAAAVACASBgAAmBAAIAcAAJQQACAIAACVEAAgCgAAlhAAIBkAAJcQACClBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAckGAgAAAAHZBgEAAAABAT8AAMkCACANpQUBAAAAAbkFQAAAAAHZBUAAAAAB4gUBAAAAAeUFAQAAAAHmBQEAAAAB6gUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHJBgIAAAAB2QYBAAAAAQE_AADLAgAwAT8AAMsCADABAAAAEQAgEgYAAOUPACAHAADmDwAgCAAA5w8AIAoAAOgPACAZAADpDwAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4gUBALkKACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIckGAgC9CgAh2QYBALkKACECAAAAFQAgPwAAzwIAIA2lBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHiBQEAuQoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhyQYCAL0KACHZBgEAuQoAIQIAAAARACA_AADRAgAgAgAAABEAID8AANECACABAAAAEQAgAwAAABUAIEYAAMkCACBHAADPAgAgAQAAABUAIAEAAAARACALDQAA4A8AIEwAAOMPACBNAADiDwAgngEAAOEPACCfAQAA5A8AIOIFAACyCgAg6gUAALIKACDyBQAAsgoAIPMFAACyCgAg9AUAALIKACDZBgAAsgoAIBCiBQAAygkAMKMFAADZAgAQpAUAAMoJADClBQEAzQgAIbkFQADUCAAh2QVAANQIACHiBQEAzggAIeUFAQDNCAAh5gUBAM0IACHqBQEAzggAIfIFAQDOCAAh8wUBAM4IACH0BQEAzggAIY8GIADQCAAhyQYCANIIACHZBgEAzggAIQMAAAARACABAADYAgAwSwAA2QIAIAMAAAARACABAAAUADACAAAVACAJCAAAyQkAIKIFAADICQAwowUAAN8CABCkBQAAyAkAMKUFAQAAAAG5BUAA-wgAIdkFQAD7CAAh5QUBAAAAAeYFAQAAAAEBAAAA3AIAIAEAAADcAgAgCQgAAMkJACCiBQAAyAkAMKMFAADfAgAQpAUAAMgJADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHlBQEA-ggAIeYFAQD6CAAhAQgAAN8PACADAAAA3wIAIAEAAOACADACAADcAgAgAwAAAN8CACABAADgAgAwAgAA3AIAIAMAAADfAgAgAQAA4AIAMAIAANwCACAGCAAA3g8AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAHmBQEAAAABAT8AAOQCACAFpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAEBPwAA5gIAMAE_AADmAgAwBggAANQPACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIeYFAQC4CgAhAgAAANwCACA_AADpAgAgBaUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh5gUBALgKACECAAAA3wIAID8AAOsCACACAAAA3wIAID8AAOsCACADAAAA3AIAIEYAAOQCACBHAADpAgAgAQAAANwCACABAAAA3wIAIAMNAADRDwAgTAAA0w8AIE0AANIPACAIogUAAMcJADCjBQAA8gIAEKQFAADHCQAwpQUBAM0IACG5BUAA1AgAIdkFQADUCAAh5QUBAM0IACHmBQEAzQgAIQMAAADfAgAgAQAA8QIAMEsAAPICACADAAAA3wIAIAEAAOACADACAADcAgAgAQAAAFkAIAEAAABZACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACAFCQAA0A8AIB0AAKEPACCrBQEAAAABuQVAAAAAAeMFAQAAAAEBPwAA-gIAIAOrBQEAAAABuQVAAAAAAeMFAQAAAAEBPwAA_AIAMAE_AAD8AgAwBQkAAM8PACAdAACfDwAgqwUBALgKACG5BUAAvgoAIeMFAQC4CgAhAgAAAFkAID8AAP8CACADqwUBALgKACG5BUAAvgoAIeMFAQC4CgAhAgAAAFcAID8AAIEDACACAAAAVwAgPwAAgQMAIAMAAABZACBGAAD6AgAgRwAA_wIAIAEAAABZACABAAAAVwAgAw0AAMwPACBMAADODwAgTQAAzQ8AIAaiBQAAxgkAMKMFAACIAwAQpAUAAMYJADCrBQEAzQgAIbkFQADUCAAh4wUBAM0IACEDAAAAVwAgAQAAhwMAMEsAAIgDACADAAAAVwAgAQAAWAAwAgAAWQAgAQAAABkAIAEAAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACAhCgAAxQ8AIBAAAMsPACAYAADDDwAgGgAAxA8AIBwAAMYPACAeAADHDwAgHwAAyA8AICAAAMkPACAhAADKDwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAHVBgIAAAAB1gYgAAAAAdcGIAAAAAHYBiAAAAABAT8AAJADACAYpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAHVBgIAAAAB1gYgAAAAAdcGIAAAAAHYBiAAAAABAT8AAJIDADABPwAAkgMAMAEAAAARACAhCgAA5g4AIBAAAOwOACAYAADkDgAgGgAA5Q4AIBwAAOcOACAeAADoDgAgHwAA6Q4AICAAAOoOACAhAADrDgAgpQUBALgKACG4BYAAAAABuQVAAL4KACHZBUAAvgoAIeQFAQC5CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACECAAAAGQAgPwAAlgMAIBilBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHmBQEAuAoAIeoFAQC5CgAh6wUBALgKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIc0GAQC5CgAhzgYBALkKACHPBhAAmgwAIdAGEACaDAAh0QYQAJoMACHSBgIAygoAIdMGAQC5CgAh1AYBALkKACHVBgIAvQoAIdYGIAC7CgAh1wYgALsKACHYBiAAuwoAIQIAAAAXACA_AACYAwAgAgAAABcAID8AAJgDACABAAAAEQAgAwAAABkAIEYAAJADACBHAACWAwAgAQAAABkAIAEAAAAXACATDQAA3w4AIEwAAOIOACBNAADhDgAgngEAAOAOACCfAQAA4w4AILgFAACyCgAg5AUAALIKACDqBQAAsgoAIPIFAACyCgAg8wUAALIKACD0BQAAsgoAIM0GAACyCgAgzgYAALIKACDPBgAAsgoAINAGAACyCgAg0QYAALIKACDSBgAAsgoAINMGAACyCgAg1AYAALIKACAbogUAAMUJADCjBQAAoAMAEKQFAADFCQAwpQUBAM0IACG4BQAA0wgAILkFQADUCAAh2QVAANQIACHkBQEAzggAIeYFAQDNCAAh6gUBAM4IACHrBQEAzQgAIfIFAQDOCAAh8wUBAM4IACH0BQEAzggAIY8GIADQCAAhzQYBAM4IACHOBgEAzggAIc8GEACWCQAh0AYQAJYJACHRBhAAlgkAIdIGAgDnCAAh0wYBAM4IACHUBgEAzggAIdUGAgDSCAAh1gYgANAIACHXBiAA0AgAIdgGIADQCAAhAwAAABcAIAEAAJ8DADBLAACgAwAgAwAAABcAIAEAABgAMAIAABkAIAEAAABOACABAAAATgAgAwAAACAAIAEAAE0AMAIAAE4AIAMAAAAgACABAABNADACAABOACADAAAAIAAgAQAATQAwAgAATgAgCQkAANwOACAKAADdDgAgFwAA3g4AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHrBQEAAAABjwYgAAAAAQE_AACoAwAgBqUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHrBQEAAAABjwYgAAAAAQE_AACqAwAwAT8AAKoDADAJCQAAxA4AIAoAAMUOACAXAADGDgAgpQUBALgKACGrBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHrBQEAuAoAIY8GIAC7CgAhAgAAAE4AID8AAK0DACAGpQUBALgKACGrBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHrBQEAuAoAIY8GIAC7CgAhAgAAACAAID8AAK8DACACAAAAIAAgPwAArwMAIAMAAABOACBGAACoAwAgRwAArQMAIAEAAABOACABAAAAIAAgAw0AAMEOACBMAADDDgAgTQAAwg4AIAmiBQAAxAkAMKMFAAC2AwAQpAUAAMQJADClBQEAzQgAIasFAQDNCAAhuQVAANQIACHZBUAA1AgAIesFAQDNCAAhjwYgANAIACEDAAAAIAAgAQAAtQMAMEsAALYDACADAAAAIAAgAQAATQAwAgAATgAgAQAAACUAIAEAAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACARCgAAvg4AIAsAALsOACAQAAC8DgAgEgAAvQ4AIBQAAL8OACAWAADADgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAEBPwAAvgMAIAulBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABzAYBAAAAAc0GAQAAAAHOBgEAAAABzwYQAAAAAdAGEAAAAAHRBhAAAAAB0gYCAAAAAQE_AADAAwAwAT8AAMADADARCgAAhQ4AIAsAAIIOACAQAACDDgAgEgAAhA4AIBQAAIYOACAWAACHDgAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAhjwYgALsKACHMBgEAuAoAIc0GAQC4CgAhzgYBALkKACHPBhAAmQwAIdAGEACaDAAh0QYQAJoMACHSBgIAvQoAIQIAAAAlACA_AADDAwAgC6UFAQC4CgAhuQVAAL4KACHZBUAAvgoAIY8GIAC7CgAhzAYBALgKACHNBgEAuAoAIc4GAQC5CgAhzwYQAJkMACHQBhAAmgwAIdEGEACaDAAh0gYCAL0KACECAAAAIwAgPwAAxQMAIAIAAAAjACA_AADFAwAgAwAAACUAIEYAAL4DACBHAADDAwAgAQAAACUAIAEAAAAjACAIDQAA_Q0AIEwAAIAOACBNAAD_DQAgngEAAP4NACCfAQAAgQ4AIM4GAACyCgAg0AYAALIKACDRBgAAsgoAIA6iBQAAwwkAMKMFAADMAwAQpAUAAMMJADClBQEAzQgAIbkFQADUCAAh2QVAANQIACGPBiAA0AgAIcwGAQDNCAAhzQYBAM0IACHOBgEAzggAIc8GEACVCQAh0AYQAJYJACHRBhAAlgkAIdIGAgDSCAAhAwAAACMAIAEAAMsDADBLAADMAwAgAwAAACMAIAEAACQAMAIAACUAIAEAAAAdACABAAAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgEAkAAPkNACALAAD6DQAgDwAA-w0AIBgAAPwNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGAQAAAAEBPwAA1AMAIAylBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGAQAAAAEBPwAA1gMAMAE_AADWAwAwAQAAABcAIAEAAAAgACABAAAAIwAgAQAAABEAIBAJAAD1DQAgCwAA9g0AIA8AAPcNACAYAAD4DQAgpQUBALgKACGrBQEAuQoAIbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIfcFAQC5CgAhxgYBALgKACHHBgEAuQoAIcgGAQC5CgAhyQYCAL0KACHKBiAAuwoAIcsGAQC5CgAhAgAAAB0AID8AAN0DACAMpQUBALgKACGrBQEAuQoAIbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIfcFAQC5CgAhxgYBALgKACHHBgEAuQoAIcgGAQC5CgAhyQYCAL0KACHKBiAAuwoAIcsGAQC5CgAhAgAAABsAID8AAN8DACACAAAAGwAgPwAA3wMAIAEAAAAXACABAAAAIAAgAQAAACMAIAEAAAARACADAAAAHQAgRgAA1AMAIEcAAN0DACABAAAAHQAgAQAAABsAIAsNAADwDQAgTAAA8w0AIE0AAPINACCeAQAA8Q0AIJ8BAAD0DQAgqwUAALIKACDkBQAAsgoAIPcFAACyCgAgxwYAALIKACDIBgAAsgoAIMsGAACyCgAgD6IFAADCCQAwowUAAOoDABCkBQAAwgkAMKUFAQDNCAAhqwUBAM4IACG5BUAA1AgAIdkFQADUCAAh5AUBAM4IACH3BQEAzggAIcYGAQDNCAAhxwYBAM4IACHIBgEAzggAIckGAgDSCAAhygYgANAIACHLBgEAzggAIQMAAAAbACABAADpAwAwSwAA6gMAIAMAAAAbACABAAAcADACAAAdACABAAAAUwAgAQAAAFMAIAMAAABRACABAABSADACAABTACADAAAAUQAgAQAAUgAwAgAAUwAgAwAAAFEAIAEAAFIAMAIAAFMAIBIDAADtDQAgCQAA7g0AIBsAAO8NACClBQEAAAABqAUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvgYCAAAAAb8GAQAAAAHABiAAAAABwQYCAAAAAcIGAgAAAAHDBgEAAAABxAZAAAAAAcUGAQAAAAEBPwAA8gMAIA-lBQEAAAABqAUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvgYCAAAAAb8GAQAAAAHABiAAAAABwQYCAAAAAcIGAgAAAAHDBgEAAAABxAZAAAAAAcUGAQAAAAEBPwAA9AMAMAE_AAD0AwAwAQAAAFUAIBIDAADqDQAgCQAA6w0AIBsAAOwNACClBQEAuAoAIagFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh4QUgALsKACHrBQEAuQoAIb4GAgC9CgAhvwYBALkKACHABiAAuwoAIcEGAgC9CgAhwgYCAL0KACHDBgEAuQoAIcQGQAC8CgAhxQYBALkKACECAAAAUwAgPwAA-AMAIA-lBQEAuAoAIagFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh4QUgALsKACHrBQEAuQoAIb4GAgC9CgAhvwYBALkKACHABiAAuwoAIcEGAgC9CgAhwgYCAL0KACHDBgEAuQoAIcQGQAC8CgAhxQYBALkKACECAAAAUQAgPwAA-gMAIAIAAABRACA_AAD6AwAgAQAAAFUAIAMAAABTACBGAADyAwAgRwAA-AMAIAEAAABTACABAAAAUQAgCg0AAOUNACBMAADoDQAgTQAA5w0AIJ4BAADmDQAgnwEAAOkNACDrBQAAsgoAIL8GAACyCgAgwwYAALIKACDEBgAAsgoAIMUGAACyCgAgEqIFAADBCQAwowUAAIIEABCkBQAAwQkAMKUFAQDNCAAhqAUBAM0IACGrBQEAzQgAIbkFQADUCAAh2QVAANQIACHhBSAA0AgAIesFAQDOCAAhvgYCANIIACG_BgEAzggAIcAGIADQCAAhwQYCANIIACHCBgIA0ggAIcMGAQDOCAAhxAZAANEIACHFBgEAzggAIQMAAABRACABAACBBAAwSwAAggQAIAMAAABRACABAABSADACAABTACAKAwAAiwkAIAwAAMAJACCiBQAAvwkAMKMFAACaAQAQpAUAAL8JADClBQEAAAABqAUBAAAAAbkFQAD7CAAh2QVAAPsIACG9BhAAnwkAIQEAAACFBAAgAQAAAIUEACACAwAA-wsAIAwAAOQNACADAAAAmgEAIAEAAIgEADACAACFBAAgAwAAAJoBACABAACIBAAwAgAAhQQAIAMAAACaAQAgAQAAiAQAMAIAAIUEACAHAwAA4g0AIAwAAOMNACClBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAABvQYQAAAAAQE_AACMBAAgBaUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAG9BhAAAAABAT8AAI4EADABPwAAjgQAMAcDAADUDQAgDAAA1Q0AIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAhvQYQAJkMACECAAAAhQQAID8AAJEEACAFpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2QVAAL4KACG9BhAAmQwAIQIAAACaAQAgPwAAkwQAIAIAAACaAQAgPwAAkwQAIAMAAACFBAAgRgAAjAQAIEcAAJEEACABAAAAhQQAIAEAAACaAQAgBQ0AAM8NACBMAADSDQAgTQAA0Q0AIJ4BAADQDQAgnwEAANMNACAIogUAAL4JADCjBQAAmgQAEKQFAAC-CQAwpQUBAM0IACGoBQEAzQgAIbkFQADUCAAh2QVAANQIACG9BhAAlQkAIQMAAACaAQAgAQAAmQQAMEsAAJoEACADAAAAmgEAIAEAAIgEADACAACFBAAgAQAAACkAIAEAAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACAKCQAAzQ0AIA4AAMwNACAPAADODQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAfcFAQAAAAH8BQIAAAABvAYBAAAAAQE_AACiBAAgB6UFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAAB_AUCAAAAAbwGAQAAAAEBPwAApAQAMAE_AACkBAAwCgkAAMoNACAOAADJDQAgDwAAyw0AIKUFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh9wUBALgKACH8BQIAvQoAIbwGAQC4CgAhAgAAACkAID8AAKcEACAHpQUBALgKACGrBQEAuAoAIbkFQAC-CgAh2QVAAL4KACH3BQEAuAoAIfwFAgC9CgAhvAYBALgKACECAAAAJwAgPwAAqQQAIAIAAAAnACA_AACpBAAgAwAAACkAIEYAAKIEACBHAACnBAAgAQAAACkAIAEAAAAnACAFDQAAxA0AIEwAAMcNACBNAADGDQAgngEAAMUNACCfAQAAyA0AIAqiBQAAvQkAMKMFAACwBAAQpAUAAL0JADClBQEAzQgAIasFAQDNCAAhuQVAANQIACHZBUAA1AgAIfcFAQDNCAAh_AUCANIIACG8BgEAzQgAIQMAAAAnACABAACvBAAwSwAAsAQAIAMAAAAnACABAAAoADACAAApACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIB8DAAD6DAAgBAAA-wwAIAUAAMMNACAMAAD8DAAgIAAAgA0AICQAAP0MACAlAAD-DAAgKAAA_wwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQE_AAC4BAAgF6UFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQE_AAC6BAAwAT8AALoEADABAAAACwAgHwMAAKoMACAEAACrDAAgBQAAwg0AIAwAAKwMACAgAACwDAAgJAAArQwAICUAAK4MACAoAACvDAAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYi2QVAAL4KACGDBgEAuQoAIasGEACZDAAhrAYBALgKACGtBgEAuAoAIa4GgAAAAAGvBgEAuQoAIbAGAQC5CgAhsQYQAJkMACGyBhAAmQwAIbMGEACZDAAhtAYQAJkMACG1BgEAuQoAIbYGQAC-CgAhtwZAALwKACG4BkAAvAoAIbkGQAC8CgAhugZAALwKACG7BkAAvAoAIQIAAAAJACA_AAC-BAAgF6UFAQC4CgAhqAUBALgKACG5BUAAvgoAIdgFAACoDKQGItkFQAC-CgAhgwYBALkKACGrBhAAmQwAIawGAQC4CgAhrQYBALgKACGuBoAAAAABrwYBALkKACGwBgEAuQoAIbEGEACZDAAhsgYQAJkMACGzBhAAmQwAIbQGEACZDAAhtQYBALkKACG2BkAAvgoAIbcGQAC8CgAhuAZAALwKACG5BkAAvAoAIboGQAC8CgAhuwZAALwKACECAAAABwAgPwAAwAQAIAIAAAAHACA_AADABAAgAQAAAAsAIAMAAAAJACBGAAC4BAAgRwAAvgQAIAEAAAAJACABAAAABwAgDw0AAL0NACBMAADADQAgTQAAvw0AIJ4BAAC-DQAgnwEAAMENACCDBgAAsgoAIK4GAACyCgAgrwYAALIKACCwBgAAsgoAILUGAACyCgAgtwYAALIKACC4BgAAsgoAILkGAACyCgAgugYAALIKACC7BgAAsgoAIBqiBQAAvAkAMKMFAADIBAAQpAUAALwJADClBQEAzQgAIagFAQDNCAAhuQVAANQIACHYBQAAtgmkBiLZBUAA1AgAIYMGAQDOCAAhqwYQAJUJACGsBgEAzQgAIa0GAQDNCAAhrgYAANMIACCvBgEAzggAIbAGAQDOCAAhsQYQAJUJACGyBhAAlQkAIbMGEACVCQAhtAYQAJUJACG1BgEAzggAIbYGQADUCAAhtwZAANEIACG4BkAA0QgAIbkGQADRCAAhugZAANEIACG7BkAA0QgAIQMAAAAHACABAADHBAAwSwAAyAQAIAMAAAAHACABAAAIADACAAAJACABAAAALwAgAQAAAC8AIAMAAAAtACABAAAuADACAAAvACADAAAALQAgAQAALgAwAgAALwAgAwAAAC0AIAEAAC4AMAIAAC8AIA8PAAD4DAAgEQAAvA0AIKUFAQAAAAGqBQEAAAABqwUBAAAAAbkFQAAAAAH3BQEAAAAB_AUCAAAAAaUGAQAAAAGmBgEAAAABpwYBAAAAAagGgAAAAAGpBhAAAAABqgYQAAAAAasGEAAAAAEBPwAA0AQAIA2lBQEAAAABqgUBAAAAAasFAQAAAAG5BUAAAAAB9wUBAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABAT8AANIEADABPwAA0gQAMA8PAAD2DAAgEQAAuw0AIKUFAQC4CgAhqgUBALgKACGrBQEAuAoAIbkFQAC-CgAh9wUBALgKACH8BQIAvQoAIaUGAQC4CgAhpgYBALgKACGnBgEAuQoAIagGgAAAAAGpBhAAmQwAIaoGEACZDAAhqwYQAJkMACECAAAALwAgPwAA1QQAIA2lBQEAuAoAIaoFAQC4CgAhqwUBALgKACG5BUAAvgoAIfcFAQC4CgAh_AUCAL0KACGlBgEAuAoAIaYGAQC4CgAhpwYBALkKACGoBoAAAAABqQYQAJkMACGqBhAAmQwAIasGEACZDAAhAgAAAC0AID8AANcEACACAAAALQAgPwAA1wQAIAMAAAAvACBGAADQBAAgRwAA1QQAIAEAAAAvACABAAAALQAgBg0AALYNACBMAAC5DQAgTQAAuA0AIJ4BAAC3DQAgnwEAALoNACCnBgAAsgoAIBCiBQAAuQkAMKMFAADeBAAQpAUAALkJADClBQEAzQgAIaoFAQDNCAAhqwUBAM0IACG5BUAA1AgAIfcFAQDNCAAh_AUCANIIACGlBgEAzQgAIaYGAQDNCAAhpwYBAM4IACGoBgAAugkAIKkGEACVCQAhqgYQAJUJACGrBhAAlQkAIQMAAAAtACABAADdBAAwSwAA3gQAIAMAAAAtACABAAAuADACAAAvACABAAAAfQAgAQAAAH0AIAMAAAB7ACABAAB8ADACAAB9ACADAAAAewAgAQAAfAAwAgAAfQAgAwAAAHsAIAEAAHwAMAIAAH0AIAcRAAC1DQAgpQUBAAAAAaoFAQAAAAG5BUAAAAAB2AUAAACkBgKBBgEAAAABpAYBAAAAAQE_AADmBAAgBqUFAQAAAAGqBQEAAAABuQVAAAAAAdgFAAAApAYCgQYBAAAAAaQGAQAAAAEBPwAA6AQAMAE_AADoBAAwBxEAALQNACClBQEAuAoAIaoFAQC4CgAhuQVAAL4KACHYBQAAqAykBiKBBgEAuQoAIaQGAQC5CgAhAgAAAH0AID8AAOsEACAGpQUBALgKACGqBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYigQYBALkKACGkBgEAuQoAIQIAAAB7ACA_AADtBAAgAgAAAHsAID8AAO0EACADAAAAfQAgRgAA5gQAIEcAAOsEACABAAAAfQAgAQAAAHsAIAUNAACxDQAgTAAAsw0AIE0AALINACCBBgAAsgoAIKQGAACyCgAgCaIFAAC1CQAwowUAAPQEABCkBQAAtQkAMKUFAQDNCAAhqgUBAM0IACG5BUAA1AgAIdgFAAC2CaQGIoEGAQDOCAAhpAYBAM4IACEDAAAAewAgAQAA8wQAMEsAAPQEACADAAAAewAgAQAAfAAwAgAAfQAgAQAAAIEBACABAAAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIA4RAACwDQAgJwAA1wwAIKUFAQAAAAGqBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAKMGAtkFQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAZAAAAAAaEGQAAAAAEBPwAA_AQAIAylBQEAAAABqgUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAACjBgLZBUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGQAAAAAGhBkAAAAABAT8AAP4EADABPwAA_gQAMA4RAACvDQAgJwAAyQwAIKUFAQC4CgAhqgUBALgKACG4BYAAAAABuQVAAL4KACHYBQAAxwyjBiLZBUAAvgoAIZwGAQC4CgAhnQYBALgKACGeBgEAuQoAIZ8GAQC5CgAhoAZAALwKACGhBkAAvAoAIQIAAACBAQAgPwAAgQUAIAylBQEAuAoAIaoFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2AUAAMcMowYi2QVAAL4KACGcBgEAuAoAIZ0GAQC4CgAhngYBALkKACGfBgEAuQoAIaAGQAC8CgAhoQZAALwKACECAAAAfwAgPwAAgwUAIAIAAAB_ACA_AACDBQAgAwAAAIEBACBGAAD8BAAgRwAAgQUAIAEAAACBAQAgAQAAAH8AIAgNAACsDQAgTAAArg0AIE0AAK0NACC4BQAAsgoAIJ4GAACyCgAgnwYAALIKACCgBgAAsgoAIKEGAACyCgAgD6IFAACxCQAwowUAAIoFABCkBQAAsQkAMKUFAQDNCAAhqgUBAM0IACG4BQAA0wgAILkFQADUCAAh2AUAALIJowYi2QVAANQIACGcBgEAzQgAIZ0GAQDNCAAhngYBAM4IACGfBgEAzggAIaAGQADRCAAhoQZAANEIACEDAAAAfwAgAQAAiQUAMEsAAIoFACADAAAAfwAgAQAAgAEAMAIAAIEBACABAAAAhQEAIAEAAACFAQAgAwAAAIMBACABAACEAQAwAgAAhQEAIAMAAACDAQAgAQAAhAEAMAIAAIUBACADAAAAgwEAIAEAAIQBADACAACFAQAgCCYAAKsNACClBQEAAAABuQVAAAAAAdgFAQAAAAHqBQEAAAABmQYBAAAAAZoGAQAAAAGbBkAAAAABAT8AAJIFACAHpQUBAAAAAbkFQAAAAAHYBQEAAAAB6gUBAAAAAZkGAQAAAAGaBgEAAAABmwZAAAAAAQE_AACUBQAwAT8AAJQFADAIJgAAqg0AIKUFAQC4CgAhuQVAAL4KACHYBQEAuAoAIeoFAQC5CgAhmQYBALgKACGaBgEAuQoAIZsGQAC-CgAhAgAAAIUBACA_AACXBQAgB6UFAQC4CgAhuQVAAL4KACHYBQEAuAoAIeoFAQC5CgAhmQYBALgKACGaBgEAuQoAIZsGQAC-CgAhAgAAAIMBACA_AACZBQAgAgAAAIMBACA_AACZBQAgAwAAAIUBACBGAACSBQAgRwAAlwUAIAEAAACFAQAgAQAAAIMBACAFDQAApw0AIEwAAKkNACBNAACoDQAg6gUAALIKACCaBgAAsgoAIAqiBQAAsAkAMKMFAACgBQAQpAUAALAJADClBQEAzQgAIbkFQADUCAAh2AUBAM0IACHqBQEAzggAIZkGAQDNCAAhmgYBAM4IACGbBkAA1AgAIQMAAACDAQAgAQAAnwUAMEsAAKAFACADAAAAgwEAIAEAAIQBADACAACFAQAgDxEAAK8JACCiBQAArAkAMKMFAAB5ABCkBQAArAkAMKUFAQAAAAGqBQEAAAABuQVAAPsIACHYBQAArgmUBiLZBUAA-wgAIZIGAACtCZIGIpQGEACfCQAhlQYBAP8IACGWBgAAhgkAIJcGQACDCQAhmAYBAP8IACEBAAAAowUAIAEAAACjBQAgBREAAKYNACCVBgAAsgoAIJYGAACyCgAglwYAALIKACCYBgAAsgoAIAMAAAB5ACABAACmBQAwAgAAowUAIAMAAAB5ACABAACmBQAwAgAAowUAIAMAAAB5ACABAACmBQAwAgAAowUAIAwRAAClDQAgpQUBAAAAAaoFAQAAAAG5BUAAAAAB2AUAAACUBgLZBUAAAAABkgYAAACSBgKUBhAAAAABlQYBAAAAAZYGgAAAAAGXBkAAAAABmAYBAAAAAQE_AACqBQAgC6UFAQAAAAGqBQEAAAABuQVAAAAAAdgFAAAAlAYC2QVAAAAAAZIGAAAAkgYClAYQAAAAAZUGAQAAAAGWBoAAAAABlwZAAAAAAZgGAQAAAAEBPwAArAUAMAE_AACsBQAwDBEAAKQNACClBQEAuAoAIaoFAQC4CgAhuQVAAL4KACHYBQAA6gyUBiLZBUAAvgoAIZIGAADpDJIGIpQGEACZDAAhlQYBALkKACGWBoAAAAABlwZAALwKACGYBgEAuQoAIQIAAACjBQAgPwAArwUAIAulBQEAuAoAIaoFAQC4CgAhuQVAAL4KACHYBQAA6gyUBiLZBUAAvgoAIZIGAADpDJIGIpQGEACZDAAhlQYBALkKACGWBoAAAAABlwZAALwKACGYBgEAuQoAIQIAAAB5ACA_AACxBQAgAgAAAHkAID8AALEFACADAAAAowUAIEYAAKoFACBHAACvBQAgAQAAAKMFACABAAAAeQAgCQ0AAJ8NACBMAACiDQAgTQAAoQ0AIJ4BAACgDQAgnwEAAKMNACCVBgAAsgoAIJYGAACyCgAglwYAALIKACCYBgAAsgoAIA6iBQAApQkAMKMFAAC4BQAQpAUAAKUJADClBQEAzQgAIaoFAQDNCAAhuQVAANQIACHYBQAApwmUBiLZBUAA1AgAIZIGAACmCZIGIpQGEACVCQAhlQYBAM4IACGWBgAA0wgAIJcGQADRCAAhmAYBAM4IACEDAAAAeQAgAQAAtwUAMEsAALgFACADAAAAeQAgAQAApgUAMAIAAKMFACAWCAAAogkAICIAAKMJACAjAACkCQAgogUAAJ0JADCjBQAACwAQpAUAAJ0JADClBQEAAAABuQVAAPsIACHZBUAA-wgAIeoFAQD_CAAhhAYBAAAAAYYGAACeCYYGIocGEACfCQAhiAYQAKAJACGJBhAAoAkAIYoGAgChCQAhiwYCAIUJACGMBgIAoQkAIY0GQAD7CAAhjgZAAPsIACGPBiAAhAkAIZAGIACECQAhAQAAALsFACABAAAAuwUAIAgIAACcDQAgIgAAnQ0AICMAAJ4NACDqBQAAsgoAIIgGAACyCgAgiQYAALIKACCKBgAAsgoAIIwGAACyCgAgAwAAAAsAIAEAAL4FADACAAC7BQAgAwAAAAsAIAEAAL4FADACAAC7BQAgAwAAAAsAIAEAAL4FADACAAC7BQAgEwgAAJkNACAiAACaDQAgIwAAmw0AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeoFAQAAAAGEBgEAAAABhgYAAACGBgKHBhAAAAABiAYQAAAAAYkGEAAAAAGKBgIAAAABiwYCAAAAAYwGAgAAAAGNBkAAAAABjgZAAAAAAY8GIAAAAAGQBiAAAAABAT8AAMIFACAQpQUBAAAAAbkFQAAAAAHZBUAAAAAB6gUBAAAAAYQGAQAAAAGGBgAAAIYGAocGEAAAAAGIBhAAAAABiQYQAAAAAYoGAgAAAAGLBgIAAAABjAYCAAAAAY0GQAAAAAGOBkAAAAABjwYgAAAAAZAGIAAAAAEBPwAAxAUAMAE_AADEBQAwEwgAAJsMACAiAACcDAAgIwAAnQwAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeoFAQC5CgAhhAYBALgKACGGBgAAmAyGBiKHBhAAmQwAIYgGEACaDAAhiQYQAJoMACGKBgIAygoAIYsGAgC9CgAhjAYCAMoKACGNBkAAvgoAIY4GQAC-CgAhjwYgALsKACGQBiAAuwoAIQIAAAC7BQAgPwAAxwUAIBClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHqBQEAuQoAIYQGAQC4CgAhhgYAAJgMhgYihwYQAJkMACGIBhAAmgwAIYkGEACaDAAhigYCAMoKACGLBgIAvQoAIYwGAgDKCgAhjQZAAL4KACGOBkAAvgoAIY8GIAC7CgAhkAYgALsKACECAAAACwAgPwAAyQUAIAIAAAALACA_AADJBQAgAwAAALsFACBGAADCBQAgRwAAxwUAIAEAAAC7BQAgAQAAAAsAIAoNAACTDAAgTAAAlgwAIE0AAJUMACCeAQAAlAwAIJ8BAACXDAAg6gUAALIKACCIBgAAsgoAIIkGAACyCgAgigYAALIKACCMBgAAsgoAIBOiBQAAkwkAMKMFAADQBQAQpAUAAJMJADClBQEAzQgAIbkFQADUCAAh2QVAANQIACHqBQEAzggAIYQGAQDNCAAhhgYAAJQJhgYihwYQAJUJACGIBhAAlgkAIYkGEACWCQAhigYCAOcIACGLBgIA0ggAIYwGAgDnCAAhjQZAANQIACGOBkAA1AgAIY8GIADQCAAhkAYgANAIACEDAAAACwAgAQAAzwUAMEsAANAFACADAAAACwAgAQAAvgUAMAIAALsFACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAQFAACRDAAgCQAAkgwAIKsFAQAAAAGDBgEAAAABAT8AANgFACACqwUBAAAAAYMGAQAAAAEBPwAA2gUAMAE_AADaBQAwBAUAAI8MACAJAACQDAAgqwUBALgKACGDBgEAuAoAIQIAAAAPACA_AADdBQAgAqsFAQC4CgAhgwYBALgKACECAAAADQAgPwAA3wUAIAIAAAANACA_AADfBQAgAwAAAA8AIEYAANgFACBHAADdBQAgAQAAAA8AIAEAAAANACADDQAAjAwAIEwAAI4MACBNAACNDAAgBaIFAACSCQAwowUAAOYFABCkBQAAkgkAMKsFAQDNCAAhgwYBAM0IACEDAAAADQAgAQAA5QUAMEsAAOYFACADAAAADQAgAQAADgAwAgAADwAgAQAAAEcAIAEAAABHACADAAAARQAgAQAARgAwAgAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAABFACABAABGADACAABHACAEBQAAigwAIBgAAIsMACDkBQEAAAABgwYBAAAAAQE_AADuBQAgAuQFAQAAAAGDBgEAAAABAT8AAPAFADABPwAA8AUAMAQFAACIDAAgGAAAiQwAIOQFAQC4CgAhgwYBALgKACECAAAARwAgPwAA8wUAIALkBQEAuAoAIYMGAQC4CgAhAgAAAEUAID8AAPUFACACAAAARQAgPwAA9QUAIAMAAABHACBGAADuBQAgRwAA8wUAIAEAAABHACABAAAARQAgAw0AAIUMACBMAACHDAAgTQAAhgwAIAWiBQAAkQkAMKMFAAD8BQAQpAUAAJEJADDkBQEAzQgAIYMGAQDNCAAhAwAAAEUAIAEAAPsFADBLAAD8BQAgAwAAAEUAIAEAAEYAMAIAAEcAIAEAAAA0ACABAAAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgDBMAAIQMACClBQEAAAABuQVAAAAAAfcFAQAAAAH7BQAAAPsFAvwFAgAAAAH9BQIAAAAB_gUCAAAAAf8FAQAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAEBPwAAhAYAIAulBQEAAAABuQVAAAAAAfcFAQAAAAH7BQAAAPsFAvwFAgAAAAH9BQIAAAAB_gUCAAAAAf8FAQAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAEBPwAAhgYAMAE_AACGBgAwDBMAAIMMACClBQEAuAoAIbkFQAC-CgAh9wUBALgKACH7BQAAggz7BSL8BQIAvQoAIf0FAgC9CgAh_gUCAL0KACH_BQEAuQoAIYAGAQC5CgAhgQYBALkKACGCBgEAuQoAIQIAAAA0ACA_AACJBgAgC6UFAQC4CgAhuQVAAL4KACH3BQEAuAoAIfsFAACCDPsFIvwFAgC9CgAh_QUCAL0KACH-BQIAvQoAIf8FAQC5CgAhgAYBALkKACGBBgEAuQoAIYIGAQC5CgAhAgAAADIAID8AAIsGACACAAAAMgAgPwAAiwYAIAMAAAA0ACBGAACEBgAgRwAAiQYAIAEAAAA0ACABAAAAMgAgCQ0AAP0LACBMAACADAAgTQAA_wsAIJ4BAAD-CwAgnwEAAIEMACD_BQAAsgoAIIAGAACyCgAggQYAALIKACCCBgAAsgoAIA6iBQAAjQkAMKMFAACSBgAQpAUAAI0JADClBQEAzQgAIbkFQADUCAAh9wUBAM0IACH7BQAAjgn7BSL8BQIA0ggAIf0FAgDSCAAh_gUCANIIACH_BQEAzggAIYAGAQDOCAAhgQYBAM4IACGCBgEAzggAIQMAAAAyACABAACRBgAwSwAAkgYAIAMAAAAyACABAAAzADACAAA0ACAMAwAAiwkAIAwAAIwJACCiBQAAigkAMKMFAADGAQAQpAUAAIoJADClBQEAAAABqAUBAAAAAbkFQAD7CAAh2QVAAPsIACHlBQEA-ggAIfgFIACECQAh-QUBAAAAAQEAAACVBgAgAQAAAJUGACADAwAA-wsAIAwAAPwLACD5BQAAsgoAIAMAAADGAQAgAQAAmAYAMAIAAJUGACADAAAAxgEAIAEAAJgGADACAACVBgAgAwAAAMYBACABAACYBgAwAgAAlQYAIAkDAAD5CwAgDAAA-gsAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAHlBQEAAAAB-AUgAAAAAfkFAQAAAAEBPwAAnAYAIAelBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAfgFIAAAAAH5BQEAAAABAT8AAJ4GADABPwAAngYAMAkDAADrCwAgDAAA7AsAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh5QUBALgKACH4BSAAuwoAIfkFAQC5CgAhAgAAAJUGACA_AAChBgAgB6UFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh5QUBALgKACH4BSAAuwoAIfkFAQC5CgAhAgAAAMYBACA_AACjBgAgAgAAAMYBACA_AACjBgAgAwAAAJUGACBGAACcBgAgRwAAoQYAIAEAAACVBgAgAQAAAMYBACAEDQAA6AsAIEwAAOoLACBNAADpCwAg-QUAALIKACAKogUAAIkJADCjBQAAqgYAEKQFAACJCQAwpQUBAM0IACGoBQEAzQgAIbkFQADUCAAh2QVAANQIACHlBQEAzQgAIfgFIADQCAAh-QUBAM4IACEDAAAAxgEAIAEAAKkGADBLAACqBgAgAwAAAMYBACABAACYBgAwAgAAlQYAIAEAAAA4ACABAAAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgBg8AAOcLACAVAADmCwAgpQUBAAAAAbkFQAAAAAH2BQEAAAAB9wUBAAAAAQE_AACyBgAgBKUFAQAAAAG5BUAAAAAB9gUBAAAAAfcFAQAAAAEBPwAAtAYAMAE_AAC0BgAwBg8AAOULACAVAADkCwAgpQUBALgKACG5BUAAvgoAIfYFAQC4CgAh9wUBALgKACECAAAAOAAgPwAAtwYAIASlBQEAuAoAIbkFQAC-CgAh9gUBALgKACH3BQEAuAoAIQIAAAA2ACA_AAC5BgAgAgAAADYAID8AALkGACADAAAAOAAgRgAAsgYAIEcAALcGACABAAAAOAAgAQAAADYAIAMNAADhCwAgTAAA4wsAIE0AAOILACAHogUAAIgJADCjBQAAwAYAEKQFAACICQAwpQUBAM0IACG5BUAA1AgAIfYFAQDNCAAh9wUBAM0IACEDAAAANgAgAQAAvwYAMEsAAMAGACADAAAANgAgAQAANwAwAgAAOAAgFx4AAPwIACAiAACACQAgNwAAhwkAIKIFAACCCQAwowUAAMYGABCkBQAAggkAMKUFAQAAAAG4BQAAhgkAILkFQAD7CAAh1QUBAPoIACHZBUAA-wgAIeYFAQAAAAHrBQEA-ggAIewFAQD_CAAh7QUBAP8IACHuBQEA_wgAIe8FQACDCQAh8AUgAIQJACHxBQIAhQkAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIfUFIACECQAhAQAAAMMGACABAAAAwwYAIBceAAD8CAAgIgAAgAkAIDcAAIcJACCiBQAAggkAMKMFAADGBgAQpAUAAIIJADClBQEA-ggAIbgFAACGCQAguQVAAPsIACHVBQEA-ggAIdkFQAD7CAAh5gUBAPoIACHrBQEA-ggAIewFAQD_CAAh7QUBAP8IACHuBQEA_wgAIe8FQACDCQAh8AUgAIQJACHxBQIAhQkAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIfUFIACECQAhCx4AAKcLACAiAAC5CwAgNwAA4AsAILgFAACyCgAg7AUAALIKACDtBQAAsgoAIO4FAACyCgAg7wUAALIKACDyBQAAsgoAIPMFAACyCgAg9AUAALIKACADAAAAxgYAIAEAAMcGADACAADDBgAgAwAAAMYGACABAADHBgAwAgAAwwYAIAMAAADGBgAgAQAAxwYAMAIAAMMGACAUHgAA3gsAICIAAN0LACA3AADfCwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHmBQEAAAAB6wUBAAAAAewFAQAAAAHtBQEAAAAB7gUBAAAAAe8FQAAAAAHwBSAAAAAB8QUCAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAfUFIAAAAAEBPwAAywYAIBGlBQEAAAABuAWAAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAeYFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBQEAAAAB7wVAAAAAAfAFIAAAAAHxBQIAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUgAAAAAQE_AADNBgAwAT8AAM0GADAUHgAAwAsAICIAAL8LACA3AADBCwAgpQUBALgKACG4BYAAAAABuQVAAL4KACHVBQEAuAoAIdkFQAC-CgAh5gUBALgKACHrBQEAuAoAIewFAQC5CgAh7QUBALkKACHuBQEAuQoAIe8FQAC8CgAh8AUgALsKACHxBQIAvQoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIfUFIAC7CgAhAgAAAMMGACA_AADQBgAgEaUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh1QUBALgKACHZBUAAvgoAIeYFAQC4CgAh6wUBALgKACHsBQEAuQoAIe0FAQC5CgAh7gUBALkKACHvBUAAvAoAIfAFIAC7CgAh8QUCAL0KACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACH1BSAAuwoAIQIAAADGBgAgPwAA0gYAIAIAAADGBgAgPwAA0gYAIAMAAADDBgAgRgAAywYAIEcAANAGACABAAAAwwYAIAEAAADGBgAgDQ0AALoLACBMAAC9CwAgTQAAvAsAIJ4BAAC7CwAgnwEAAL4LACC4BQAAsgoAIOwFAACyCgAg7QUAALIKACDuBQAAsgoAIO8FAACyCgAg8gUAALIKACDzBQAAsgoAIPQFAACyCgAgFKIFAACBCQAwowUAANkGABCkBQAAgQkAMKUFAQDNCAAhuAUAANMIACC5BUAA1AgAIdUFAQDNCAAh2QVAANQIACHmBQEAzQgAIesFAQDNCAAh7AUBAM4IACHtBQEAzggAIe4FAQDOCAAh7wVAANEIACHwBSAA0AgAIfEFAgDSCAAh8gUBAM4IACHzBQEAzggAIfQFAQDOCAAh9QUgANAIACEDAAAAxgYAIAEAANgGADBLAADZBgAgAwAAAMYGACABAADHBgAwAgAAwwYAIAo2AACACQAgogUAAP4IADCjBQAA3wYAEKQFAAD-CAAwpQUBAAAAAbkFQAD7CAAh2QVAAPsIACHlBQEA-ggAIeYFAQAAAAHqBQEA_wgAIQEAAADcBgAgAQAAANwGACAKNgAAgAkAIKIFAAD-CAAwowUAAN8GABCkBQAA_ggAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeUFAQD6CAAh5gUBAPoIACHqBQEA_wgAIQI2AAC5CwAg6gUAALIKACADAAAA3wYAIAEAAOAGADACAADcBgAgAwAAAN8GACABAADgBgAwAgAA3AYAIAMAAADfBgAgAQAA4AYAMAIAANwGACAHNgAAuAsAIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAHmBQEAAAAB6gUBAAAAAQE_AADkBgAgBqUFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAHmBQEAAAAB6gUBAAAAAQE_AADmBgAwAT8AAOYGADAHNgAAqwsAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIQIAAADcBgAgPwAA6QYAIAalBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACECAAAA3wYAID8AAOsGACACAAAA3wYAID8AAOsGACADAAAA3AYAIEYAAOQGACBHAADpBgAgAQAAANwGACABAAAA3wYAIAQNAACoCwAgTAAAqgsAIE0AAKkLACDqBQAAsgoAIAmiBQAA_QgAMKMFAADyBgAQpAUAAP0IADClBQEAzQgAIbkFQADUCAAh2QVAANQIACHlBQEAzQgAIeYFAQDNCAAh6gUBAM4IACEDAAAA3wYAIAEAAPEGADBLAADyBgAgAwAAAN8GACABAADgBgAwAgAA3AYAIAk2AAD8CAAgogUAAPkIADCjBQAA-AYAEKQFAAD5CAAwpQUBAAAAAbkFQAD7CAAh2QVAAPsIACHlBQEAAAAB5gUBAAAAAQEAAAD1BgAgAQAAAPUGACAJNgAA_AgAIKIFAAD5CAAwowUAAPgGABCkBQAA-QgAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeUFAQD6CAAh5gUBAPoIACEBNgAApwsAIAMAAAD4BgAgAQAA-QYAMAIAAPUGACADAAAA-AYAIAEAAPkGADACAAD1BgAgAwAAAPgGACABAAD5BgAwAgAA9QYAIAY2AACmCwAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAEBPwAA_QYAIAWlBQEAAAABuQVAAAAAAdkFQAAAAAHlBQEAAAAB5gUBAAAAAQE_AAD_BgAwAT8AAP8GADAGNgAAmQsAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh5gUBALgKACECAAAA9QYAID8AAIIHACAFpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh5QUBALgKACHmBQEAuAoAIQIAAAD4BgAgPwAAhAcAIAIAAAD4BgAgPwAAhAcAIAMAAAD1BgAgRgAA_QYAIEcAAIIHACABAAAA9QYAIAEAAAD4BgAgAw0AAJYLACBMAACYCwAgTQAAlwsAIAiiBQAA-AgAMKMFAACLBwAQpAUAAPgIADClBQEAzQgAIbkFQADUCAAh2QVAANQIACHlBQEAzQgAIeYFAQDNCAAhAwAAAPgGACABAACKBwAwSwAAiwcAIAMAAAD4BgAgAQAA-QYAMAIAAPUGACABAAAAswEAIAEAAACzAQAgAwAAALEBACABAACyAQAwAgAAswEAIAMAAACxAQAgAQAAsgEAMAIAALMBACADAAAAsQEAIAEAALIBADACAACzAQAgBBgAAJULACA1AACUCwAg3gUBAAAAAeQFAQAAAAEBPwAAkwcAIALeBQEAAAAB5AUBAAAAAQE_AACVBwAwAT8AAJUHADAEGAAAkwsAIDUAAJILACDeBQEAuAoAIeQFAQC4CgAhAgAAALMBACA_AACYBwAgAt4FAQC4CgAh5AUBALgKACECAAAAsQEAID8AAJoHACACAAAAsQEAID8AAJoHACADAAAAswEAIEYAAJMHACBHAACYBwAgAQAAALMBACABAAAAsQEAIAMNAACPCwAgTAAAkQsAIE0AAJALACAFogUAAPcIADCjBQAAoQcAEKQFAAD3CAAw3gUBAM0IACHkBQEAzQgAIQMAAACxAQAgAQAAoAcAMEsAAKEHACADAAAAsQEAIAEAALIBADACAACzAQAgAQAAALkBACABAAAAuQEAIAMAAAC3AQAgAQAAuAEAMAIAALkBACADAAAAtwEAIAEAALgBADACAAC5AQAgAwAAALcBACABAAC4AQAwAgAAuQEAIAQdAACOCwAgNQAAjQsAIN4FAQAAAAHjBQEAAAABAT8AAKkHACAC3gUBAAAAAeMFAQAAAAEBPwAAqwcAMAE_AACrBwAwBB0AAIwLACA1AACLCwAg3gUBALgKACHjBQEAuAoAIQIAAAC5AQAgPwAArgcAIALeBQEAuAoAIeMFAQC4CgAhAgAAALcBACA_AACwBwAgAgAAALcBACA_AACwBwAgAwAAALkBACBGAACpBwAgRwAArgcAIAEAAAC5AQAgAQAAALcBACADDQAAiAsAIEwAAIoLACBNAACJCwAgBaIFAAD2CAAwowUAALcHABCkBQAA9ggAMN4FAQDNCAAh4wUBAM0IACEDAAAAtwEAIAEAALYHADBLAAC3BwAgAwAAALcBACABAAC4AQAwAgAAuQEAIAEAAACvAQAgAQAAAK8BACADAAAArQEAIAEAAK4BADACAACvAQAgAwAAAK0BACABAACuAQAwAgAArwEAIAMAAACtAQAgAQAArgEAMAIAAK8BACAOAwAAhQsAIAYAAIcLACA1AACECwAgOAAAhgsAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAeIFAQAAAAEBPwAAvwcAIAqlBQEAAAABqAUBAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAHiBQEAAAABAT8AAMEHADABPwAAwQcAMAEAAABVACABAAAArQEAIA4DAAD1CgAgBgAA9goAIDUAAPQKACA4AAD3CgAgpQUBALgKACGoBQEAuQoAIbkFQAC-CgAh1QUBALgKACHZBUAAvgoAId4FAQC4CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAh4gUBALkKACECAAAArwEAID8AAMYHACAKpQUBALgKACGoBQEAuQoAIbkFQAC-CgAh1QUBALgKACHZBUAAvgoAId4FAQC4CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAh4gUBALkKACECAAAArQEAID8AAMgHACACAAAArQEAID8AAMgHACABAAAAVQAgAQAAAK0BACADAAAArwEAIEYAAL8HACBHAADGBwAgAQAAAK8BACABAAAArQEAIAcNAADxCgAgTAAA8woAIE0AAPIKACCoBQAAsgoAIN8FAACyCgAg4AUAALIKACDiBQAAsgoAIA2iBQAA9QgAMKMFAADRBwAQpAUAAPUIADClBQEAzQgAIagFAQDOCAAhuQVAANQIACHVBQEAzQgAIdkFQADUCAAh3gUBAM0IACHfBQEAzggAIeAFAQDOCAAh4QUgANAIACHiBQEAzggAIQMAAACtAQAgAQAA0AcAMEsAANEHACADAAAArQEAIAEAAK4BADACAACvAQAgAQAAAKQBACABAAAApAEAIAMAAACiAQAgAQAAowEAMAIAAKQBACADAAAAogEAIAEAAKMBADACAACkAQAgAwAAAKIBACABAACjAQAwAgAApAEAIAktAADvCgAgLgAA8AoAIKUFAQAAAAG5BUAAAAAB2AUAAADdBQLZBUAAAAAB2gUBAAAAAdsFAQAAAAHdBQEAAAABAT8AANkHACAHpQUBAAAAAbkFQAAAAAHYBQAAAN0FAtkFQAAAAAHaBQEAAAAB2wUBAAAAAd0FAQAAAAEBPwAA2wcAMAE_AADbBwAwCS0AAOEKACAuAADiCgAgpQUBALgKACG5BUAAvgoAIdgFAADgCt0FItkFQAC-CgAh2gUBALgKACHbBQEAuAoAId0FAQC5CgAhAgAAAKQBACA_AADeBwAgB6UFAQC4CgAhuQVAAL4KACHYBQAA4ArdBSLZBUAAvgoAIdoFAQC4CgAh2wUBALgKACHdBQEAuQoAIQIAAACiAQAgPwAA4AcAIAIAAACiAQAgPwAA4AcAIAMAAACkAQAgRgAA2QcAIEcAAN4HACABAAAApAEAIAEAAACiAQAgBA0AAN0KACBMAADfCgAgTQAA3goAIN0FAACyCgAgCqIFAADxCAAwowUAAOcHABCkBQAA8QgAMKUFAQDNCAAhuQVAANQIACHYBQAA8gjdBSLZBUAA1AgAIdoFAQDNCAAh2wUBAM0IACHdBQEAzggAIQMAAACiAQAgAQAA5gcAMEsAAOcHACADAAAAogEAIAEAAKMBADACAACkAQAgAQAAAJ4BACABAAAAngEAIAMAAACcAQAgAQAAnQEAMAIAAJ4BACADAAAAnAEAIAEAAJ0BADACAACeAQAgAwAAAJwBACABAACdAQAwAgAAngEAIAsvAADbCgAgMAAA3AoAIKUFAQAAAAG5BUAAAAAB0QUBAAAAAdIFAQAAAAHUBQAAANQFAtUFAQAAAAHWBYAAAAAB2AUAAADYBQLZBUAAAAABAT8AAO8HACAJpQUBAAAAAbkFQAAAAAHRBQEAAAAB0gUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAEBPwAA8QcAMAE_AADxBwAwCy8AANkKACAwAADaCgAgpQUBALgKACG5BUAAvgoAIdEFAQC4CgAh0gUBALgKACHUBQAA1wrUBSLVBQEAuAoAIdYFgAAAAAHYBQAA2ArYBSLZBUAAvgoAIQIAAACeAQAgPwAA9AcAIAmlBQEAuAoAIbkFQAC-CgAh0QUBALgKACHSBQEAuAoAIdQFAADXCtQFItUFAQC4CgAh1gWAAAAAAdgFAADYCtgFItkFQAC-CgAhAgAAAJwBACA_AAD2BwAgAgAAAJwBACA_AAD2BwAgAwAAAJ4BACBGAADvBwAgRwAA9AcAIAEAAACeAQAgAQAAAJwBACAEDQAA1AoAIEwAANYKACBNAADVCgAg1gUAALIKACAMogUAAOoIADCjBQAA_QcAEKQFAADqCAAwpQUBAM0IACG5BUAA1AgAIdEFAQDNCAAh0gUBAM0IACHUBQAA6wjUBSLVBQEAzQgAIdYFAADTCAAg2AUAAOwI2AUi2QVAANQIACEDAAAAnAEAIAEAAPwHADBLAAD9BwAgAwAAAJwBACABAACdAQAwAgAAngEAIAEAAABfACABAAAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgCgMAANMKACAJAADSCgAgpQUBAAAAAagFAQAAAAGpBQEAAAABqwUBAAAAAbAFAQAAAAHOBQEAAAABzwUBAAAAAdAFQAAAAAEBPwAAhQgAIAilBQEAAAABqAUBAAAAAakFAQAAAAGrBQEAAAABsAUBAAAAAc4FAQAAAAHPBQEAAAAB0AVAAAAAAQE_AACHCAAwAT8AAIcIADABAAAAVQAgCgMAANEKACAJAADQCgAgpQUBALgKACGoBQEAuQoAIakFAQC5CgAhqwUBALgKACGwBQEAuQoAIc4FAQC5CgAhzwUBALkKACHQBUAAvgoAIQIAAABfACA_AACLCAAgCKUFAQC4CgAhqAUBALkKACGpBQEAuQoAIasFAQC4CgAhsAUBALkKACHOBQEAuQoAIc8FAQC5CgAh0AVAAL4KACECAAAAXQAgPwAAjQgAIAIAAABdACA_AACNCAAgAQAAAFUAIAMAAABfACBGAACFCAAgRwAAiwgAIAEAAABfACABAAAAXQAgCA0AAM0KACBMAADPCgAgTQAAzgoAIKgFAACyCgAgqQUAALIKACCwBQAAsgoAIM4FAACyCgAgzwUAALIKACALogUAAOkIADCjBQAAlQgAEKQFAADpCAAwpQUBAM0IACGoBQEAzggAIakFAQDOCAAhqwUBAM0IACGwBQEAzggAIc4FAQDOCAAhzwUBAM4IACHQBUAA1AgAIQMAAABdACABAACUCAAwSwAAlQgAIAMAAABdACABAABeADACAABfACABAAAAqgEAIAEAAACqAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIAMAAACoAQAgAQAAqQEAMAIAAKoBACADAAAAqAEAIAEAAKkBADACAACqAQAgCAMAAMwKACClBQEAAAABqAUBAAAAAakFAQAAAAG5BUAAAAABywUBAAAAAcwFAgAAAAHNBYAAAAABAT8AAJ0IACAHpQUBAAAAAagFAQAAAAGpBQEAAAABuQVAAAAAAcsFAQAAAAHMBQIAAAABzQWAAAAAAQE_AACfCAAwAT8AAJ8IADABAAAAVQAgCAMAAMsKACClBQEAuAoAIagFAQC5CgAhqQUBALkKACG5BUAAvgoAIcsFAQC4CgAhzAUCAMoKACHNBYAAAAABAgAAAKoBACA_AACjCAAgB6UFAQC4CgAhqAUBALkKACGpBQEAuQoAIbkFQAC-CgAhywUBALgKACHMBQIAygoAIc0FgAAAAAECAAAAqAEAID8AAKUIACACAAAAqAEAID8AAKUIACABAAAAVQAgAwAAAKoBACBGAACdCAAgRwAAowgAIAEAAACqAQAgAQAAAKgBACAJDQAAxQoAIEwAAMgKACBNAADHCgAgngEAAMYKACCfAQAAyQoAIKgFAACyCgAgqQUAALIKACDMBQAAsgoAIM0FAACyCgAgCqIFAADmCAAwowUAAK0IABCkBQAA5ggAMKUFAQDNCAAhqAUBAM4IACGpBQEAzggAIbkFQADUCAAhywUBAM0IACHMBQIA5wgAIc0FAADTCAAgAwAAAKgBACABAACsCAAwSwAArQgAIAMAAACoAQAgAQAAqQEAMAIAAKoBACABAAAAZAAgAQAAAGQAIAMAAABiACABAABjADACAABkACADAAAAYgAgAQAAYwAwAgAAZAAgAwAAAGIAIAEAAGMAMAIAAGQAIBgDAADCCgAgCQAAxAoAIBEAAMMKACClBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABqQUBAAAAAaoFAQAAAAGrBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEBPwAAtQgAIBWlBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABqQUBAAAAAaoFAQAAAAGrBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEBPwAAtwgAMAE_AAC3CAAwAQAAAFUAIAEAAAAHACABAAAAFwAgGAMAAL8KACAJAADBCgAgEQAAwAoAIKUFAQC4CgAhpgUBALgKACGnBQEAuQoAIagFAQC5CgAhqQUBALkKACGqBQEAuQoAIasFAQC5CgAhrAUIALoKACGtBQEAuQoAIa4FAQC5CgAhrwUBALkKACGwBQEAuQoAIbEFIAC7CgAhsgUgALsKACGzBUAAvAoAIbQFQAC8CgAhtQUCAL0KACG2BUAAvAoAIbcFAQC5CgAhuAWAAAAAAbkFQAC-CgAhAgAAAGQAID8AAL0IACAVpQUBALgKACGmBQEAuAoAIacFAQC5CgAhqAUBALkKACGpBQEAuQoAIaoFAQC5CgAhqwUBALkKACGsBQgAugoAIa0FAQC5CgAhrgUBALkKACGvBQEAuQoAIbAFAQC5CgAhsQUgALsKACGyBSAAuwoAIbMFQAC8CgAhtAVAALwKACG1BQIAvQoAIbYFQAC8CgAhtwUBALkKACG4BYAAAAABuQVAAL4KACECAAAAYgAgPwAAvwgAIAIAAABiACA_AAC_CAAgAQAAAFUAIAEAAAAHACABAAAAFwAgAwAAAGQAIEYAALUIACBHAAC9CAAgAQAAAGQAIAEAAABiACAUDQAAswoAIEwAALYKACBNAAC1CgAgngEAALQKACCfAQAAtwoAIKcFAACyCgAgqAUAALIKACCpBQAAsgoAIKoFAACyCgAgqwUAALIKACCsBQAAsgoAIK0FAACyCgAgrgUAALIKACCvBQAAsgoAILAFAACyCgAgswUAALIKACC0BQAAsgoAILYFAACyCgAgtwUAALIKACC4BQAAsgoAIBiiBQAAzAgAMKMFAADJCAAQpAUAAMwIADClBQEAzQgAIaYFAQDNCAAhpwUBAM4IACGoBQEAzggAIakFAQDOCAAhqgUBAM4IACGrBQEAzggAIawFCADPCAAhrQUBAM4IACGuBQEAzggAIa8FAQDOCAAhsAUBAM4IACGxBSAA0AgAIbIFIADQCAAhswVAANEIACG0BUAA0QgAIbUFAgDSCAAhtgVAANEIACG3BQEAzggAIbgFAADTCAAguQVAANQIACEDAAAAYgAgAQAAyAgAMEsAAMkIACADAAAAYgAgAQAAYwAwAgAAZAAgGKIFAADMCAAwowUAAMkIABCkBQAAzAgAMKUFAQDNCAAhpgUBAM0IACGnBQEAzggAIagFAQDOCAAhqQUBAM4IACGqBQEAzggAIasFAQDOCAAhrAUIAM8IACGtBQEAzggAIa4FAQDOCAAhrwUBAM4IACGwBQEAzggAIbEFIADQCAAhsgUgANAIACGzBUAA0QgAIbQFQADRCAAhtQUCANIIACG2BUAA0QgAIbcFAQDOCAAhuAUAANMIACC5BUAA1AgAIQ4NAADWCAAgTAAA5QgAIE0AAOUIACC6BQEAAAABuwUBAAAABLwFAQAAAAS9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOQIACHIBQEAAAAByQUBAAAAAcoFAQAAAAEODQAA2AgAIEwAAOMIACBNAADjCAAgugUBAAAAAbsFAQAAAAW8BQEAAAAFvQUBAAAAAb4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQDiCAAhyAUBAAAAAckFAQAAAAHKBQEAAAABDQ0AANgIACBMAADhCAAgTQAA4QgAIJ4BAADhCAAgnwEAAOEIACC6BQgAAAABuwUIAAAABbwFCAAAAAW9BQgAAAABvgUIAAAAAb8FCAAAAAHABQgAAAABwQUIAOAIACEFDQAA1ggAIEwAAN8IACBNAADfCAAgugUgAAAAAcEFIADeCAAhCw0AANgIACBMAADdCAAgTQAA3QgAILoFQAAAAAG7BUAAAAAFvAVAAAAABb0FQAAAAAG-BUAAAAABvwVAAAAAAcAFQAAAAAHBBUAA3AgAIQ0NAADWCAAgTAAA1ggAIE0AANYIACCeAQAA2wgAIJ8BAADWCAAgugUCAAAAAbsFAgAAAAS8BQIAAAAEvQUCAAAAAb4FAgAAAAG_BQIAAAABwAUCAAAAAcEFAgDaCAAhDw0AANgIACBMAADZCAAgTQAA2QgAILoFgAAAAAG9BYAAAAABvgWAAAAAAb8FgAAAAAHABYAAAAABwQWAAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFgAAAAAHGBYAAAAABxwWAAAAAAQsNAADWCAAgTAAA1wgAIE0AANcIACC6BUAAAAABuwVAAAAABLwFQAAAAAS9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAANUIACELDQAA1ggAIEwAANcIACBNAADXCAAgugVAAAAAAbsFQAAAAAS8BUAAAAAEvQVAAAAAAb4FQAAAAAG_BUAAAAABwAVAAAAAAcEFQADVCAAhCLoFAgAAAAG7BQIAAAAEvAUCAAAABL0FAgAAAAG-BQIAAAABvwUCAAAAAcAFAgAAAAHBBQIA1ggAIQi6BUAAAAABuwVAAAAABLwFQAAAAAS9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAANcIACEIugUCAAAAAbsFAgAAAAW8BQIAAAAFvQUCAAAAAb4FAgAAAAG_BQIAAAABwAUCAAAAAcEFAgDYCAAhDLoFgAAAAAG9BYAAAAABvgWAAAAAAb8FgAAAAAHABYAAAAABwQWAAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFgAAAAAHGBYAAAAABxwWAAAAAAQ0NAADWCAAgTAAA1ggAIE0AANYIACCeAQAA2wgAIJ8BAADWCAAgugUCAAAAAbsFAgAAAAS8BQIAAAAEvQUCAAAAAb4FAgAAAAG_BQIAAAABwAUCAAAAAcEFAgDaCAAhCLoFCAAAAAG7BQgAAAAEvAUIAAAABL0FCAAAAAG-BQgAAAABvwUIAAAAAcAFCAAAAAHBBQgA2wgAIQsNAADYCAAgTAAA3QgAIE0AAN0IACC6BUAAAAABuwVAAAAABbwFQAAAAAW9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAANwIACEIugVAAAAAAbsFQAAAAAW8BUAAAAAFvQVAAAAAAb4FQAAAAAG_BUAAAAABwAVAAAAAAcEFQADdCAAhBQ0AANYIACBMAADfCAAgTQAA3wgAILoFIAAAAAHBBSAA3ggAIQK6BSAAAAABwQUgAN8IACENDQAA2AgAIEwAAOEIACBNAADhCAAgngEAAOEIACCfAQAA4QgAILoFCAAAAAG7BQgAAAAFvAUIAAAABb0FCAAAAAG-BQgAAAABvwUIAAAAAcAFCAAAAAHBBQgA4AgAIQi6BQgAAAABuwUIAAAABbwFCAAAAAW9BQgAAAABvgUIAAAAAb8FCAAAAAHABQgAAAABwQUIAOEIACEODQAA2AgAIEwAAOMIACBNAADjCAAgugUBAAAAAbsFAQAAAAW8BQEAAAAFvQUBAAAAAb4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQDiCAAhyAUBAAAAAckFAQAAAAHKBQEAAAABC7oFAQAAAAG7BQEAAAAFvAUBAAAABb0FAQAAAAG-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEA4wgAIcgFAQAAAAHJBQEAAAABygUBAAAAAQ4NAADWCAAgTAAA5QgAIE0AAOUIACC6BQEAAAABuwUBAAAABLwFAQAAAAS9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOQIACHIBQEAAAAByQUBAAAAAcoFAQAAAAELugUBAAAAAbsFAQAAAAS8BQEAAAAEvQUBAAAAAb4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQDlCAAhyAUBAAAAAckFAQAAAAHKBQEAAAABCqIFAADmCAAwowUAAK0IABCkBQAA5ggAMKUFAQDNCAAhqAUBAM4IACGpBQEAzggAIbkFQADUCAAhywUBAM0IACHMBQIA5wgAIc0FAADTCAAgDQ0AANgIACBMAADYCAAgTQAA2AgAIJ4BAADhCAAgnwEAANgIACC6BQIAAAABuwUCAAAABbwFAgAAAAW9BQIAAAABvgUCAAAAAb8FAgAAAAHABQIAAAABwQUCAOgIACENDQAA2AgAIEwAANgIACBNAADYCAAgngEAAOEIACCfAQAA2AgAILoFAgAAAAG7BQIAAAAFvAUCAAAABb0FAgAAAAG-BQIAAAABvwUCAAAAAcAFAgAAAAHBBQIA6AgAIQuiBQAA6QgAMKMFAACVCAAQpAUAAOkIADClBQEAzQgAIagFAQDOCAAhqQUBAM4IACGrBQEAzQgAIbAFAQDOCAAhzgUBAM4IACHPBQEAzggAIdAFQADUCAAhDKIFAADqCAAwowUAAP0HABCkBQAA6ggAMKUFAQDNCAAhuQVAANQIACHRBQEAzQgAIdIFAQDNCAAh1AUAAOsI1AUi1QUBAM0IACHWBQAA0wgAINgFAADsCNgFItkFQADUCAAhBw0AANYIACBMAADwCAAgTQAA8AgAILoFAAAA1AUCuwUAAADUBQi8BQAAANQFCMEFAADvCNQFIgcNAADWCAAgTAAA7ggAIE0AAO4IACC6BQAAANgFArsFAAAA2AUIvAUAAADYBQjBBQAA7QjYBSIHDQAA1ggAIEwAAO4IACBNAADuCAAgugUAAADYBQK7BQAAANgFCLwFAAAA2AUIwQUAAO0I2AUiBLoFAAAA2AUCuwUAAADYBQi8BQAAANgFCMEFAADuCNgFIgcNAADWCAAgTAAA8AgAIE0AAPAIACC6BQAAANQFArsFAAAA1AUIvAUAAADUBQjBBQAA7wjUBSIEugUAAADUBQK7BQAAANQFCLwFAAAA1AUIwQUAAPAI1AUiCqIFAADxCAAwowUAAOcHABCkBQAA8QgAMKUFAQDNCAAhuQVAANQIACHYBQAA8gjdBSLZBUAA1AgAIdoFAQDNCAAh2wUBAM0IACHdBQEAzggAIQcNAADWCAAgTAAA9AgAIE0AAPQIACC6BQAAAN0FArsFAAAA3QUIvAUAAADdBQjBBQAA8wjdBSIHDQAA1ggAIEwAAPQIACBNAAD0CAAgugUAAADdBQK7BQAAAN0FCLwFAAAA3QUIwQUAAPMI3QUiBLoFAAAA3QUCuwUAAADdBQi8BQAAAN0FCMEFAAD0CN0FIg2iBQAA9QgAMKMFAADRBwAQpAUAAPUIADClBQEAzQgAIagFAQDOCAAhuQVAANQIACHVBQEAzQgAIdkFQADUCAAh3gUBAM0IACHfBQEAzggAIeAFAQDOCAAh4QUgANAIACHiBQEAzggAIQWiBQAA9ggAMKMFAAC3BwAQpAUAAPYIADDeBQEAzQgAIeMFAQDNCAAhBaIFAAD3CAAwowUAAKEHABCkBQAA9wgAMN4FAQDNCAAh5AUBAM0IACEIogUAAPgIADCjBQAAiwcAEKQFAAD4CAAwpQUBAM0IACG5BUAA1AgAIdkFQADUCAAh5QUBAM0IACHmBQEAzQgAIQk2AAD8CAAgogUAAPkIADCjBQAA-AYAEKQFAAD5CAAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5QUBAPoIACHmBQEA-ggAIQu6BQEAAAABuwUBAAAABLwFAQAAAAS9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOUIACHIBQEAAAAByQUBAAAAAcoFAQAAAAEIugVAAAAAAbsFQAAAAAS8BUAAAAAEvQVAAAAAAb4FQAAAAAG_BUAAAAABwAVAAAAAAcEFQADXCAAhA-cFAAC3AQAg6AUAALcBACDpBQAAtwEAIAmiBQAA_QgAMKMFAADyBgAQpAUAAP0IADClBQEAzQgAIbkFQADUCAAh2QVAANQIACHlBQEAzQgAIeYFAQDNCAAh6gUBAM4IACEKNgAAgAkAIKIFAAD-CAAwowUAAN8GABCkBQAA_ggAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeUFAQD6CAAh5gUBAPoIACHqBQEA_wgAIQu6BQEAAAABuwUBAAAABbwFAQAAAAW9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOMIACHIBQEAAAAByQUBAAAAAcoFAQAAAAED5wUAALEBACDoBQAAsQEAIOkFAACxAQAgFKIFAACBCQAwowUAANkGABCkBQAAgQkAMKUFAQDNCAAhuAUAANMIACC5BUAA1AgAIdUFAQDNCAAh2QVAANQIACHmBQEAzQgAIesFAQDNCAAh7AUBAM4IACHtBQEAzggAIe4FAQDOCAAh7wVAANEIACHwBSAA0AgAIfEFAgDSCAAh8gUBAM4IACHzBQEAzggAIfQFAQDOCAAh9QUgANAIACEXHgAA_AgAICIAAIAJACA3AACHCQAgogUAAIIJADCjBQAAxgYAEKQFAACCCQAwpQUBAPoIACG4BQAAhgkAILkFQAD7CAAh1QUBAPoIACHZBUAA-wgAIeYFAQD6CAAh6wUBAPoIACHsBQEA_wgAIe0FAQD_CAAh7gUBAP8IACHvBUAAgwkAIfAFIACECQAh8QUCAIUJACHyBQEA_wgAIfMFAQD_CAAh9AUBAP8IACH1BSAAhAkAIQi6BUAAAAABuwVAAAAABbwFQAAAAAW9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAAN0IACECugUgAAAAAcEFIADfCAAhCLoFAgAAAAG7BQIAAAAEvAUCAAAABL0FAgAAAAG-BQIAAAABvwUCAAAAAcAFAgAAAAHBBQIA1ggAIQy6BYAAAAABvQWAAAAAAb4FgAAAAAG_BYAAAAABwAWAAAAAAcEFgAAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBYAAAAABxgWAAAAAAccFgAAAAAED5wUAAK0BACDoBQAArQEAIOkFAACtAQAgB6IFAACICQAwowUAAMAGABCkBQAAiAkAMKUFAQDNCAAhuQVAANQIACH2BQEAzQgAIfcFAQDNCAAhCqIFAACJCQAwowUAAKoGABCkBQAAiQkAMKUFAQDNCAAhqAUBAM0IACG5BUAA1AgAIdkFQADUCAAh5QUBAM0IACH4BSAA0AgAIfkFAQDOCAAhDAMAAIsJACAMAACMCQAgogUAAIoJADCjBQAAxgEAEKQFAACKCQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHlBQEA-ggAIfgFIACECQAh-QUBAP8IACEjDgAAgAoAIBUAAIUKACAcAAD_CQAgHwAAggoAICAAAIQKACAjAACkCQAgKQAA-wkAICoAAPwJACArAAD9CQAgLAAA_gkAIDEAAOEJACAyAACBCgAgMwAA_wkAIDQAAIMKACA5AACHCQAgogUAAPkJADCjBQAAVQAQpAUAAPkJADClBQEA-ggAIbAFAQD_CAAhuAUAAIYJACC5BUAA-wgAIdgFAAD6CfEGItkFQAD7CAAh5QUBAP8IACHZBgEA_wgAIdwGAQD_CAAh7QYBAPoIACHuBiAAhAkAIe8GAADjCdQFIvEGQACDCQAh8gYBAP8IACHzBgEA_wgAIf8GAABVACCABwAAVQAgA-cFAAA2ACDoBQAANgAg6QUAADYAIA6iBQAAjQkAMKMFAACSBgAQpAUAAI0JADClBQEAzQgAIbkFQADUCAAh9wUBAM0IACH7BQAAjgn7BSL8BQIA0ggAIf0FAgDSCAAh_gUCANIIACH_BQEAzggAIYAGAQDOCAAhgQYBAM4IACGCBgEAzggAIQcNAADWCAAgTAAAkAkAIE0AAJAJACC6BQAAAPsFArsFAAAA-wUIvAUAAAD7BQjBBQAAjwn7BSIHDQAA1ggAIEwAAJAJACBNAACQCQAgugUAAAD7BQK7BQAAAPsFCLwFAAAA-wUIwQUAAI8J-wUiBLoFAAAA-wUCuwUAAAD7BQi8BQAAAPsFCMEFAACQCfsFIgWiBQAAkQkAMKMFAAD8BQAQpAUAAJEJADDkBQEAzQgAIYMGAQDNCAAhBaIFAACSCQAwowUAAOYFABCkBQAAkgkAMKsFAQDNCAAhgwYBAM0IACETogUAAJMJADCjBQAA0AUAEKQFAACTCQAwpQUBAM0IACG5BUAA1AgAIdkFQADUCAAh6gUBAM4IACGEBgEAzQgAIYYGAACUCYYGIocGEACVCQAhiAYQAJYJACGJBhAAlgkAIYoGAgDnCAAhiwYCANIIACGMBgIA5wgAIY0GQADUCAAhjgZAANQIACGPBiAA0AgAIZAGIADQCAAhBw0AANYIACBMAACcCQAgTQAAnAkAILoFAAAAhgYCuwUAAACGBgi8BQAAAIYGCMEFAACbCYYGIg0NAADWCAAgTAAAmgkAIE0AAJoJACCeAQAAmgkAIJ8BAACaCQAgugUQAAAAAbsFEAAAAAS8BRAAAAAEvQUQAAAAAb4FEAAAAAG_BRAAAAABwAUQAAAAAcEFEACZCQAhDQ0AANgIACBMAACYCQAgTQAAmAkAIJ4BAACYCQAgnwEAAJgJACC6BRAAAAABuwUQAAAABbwFEAAAAAW9BRAAAAABvgUQAAAAAb8FEAAAAAHABRAAAAABwQUQAJcJACENDQAA2AgAIEwAAJgJACBNAACYCQAgngEAAJgJACCfAQAAmAkAILoFEAAAAAG7BRAAAAAFvAUQAAAABb0FEAAAAAG-BRAAAAABvwUQAAAAAcAFEAAAAAHBBRAAlwkAIQi6BRAAAAABuwUQAAAABbwFEAAAAAW9BRAAAAABvgUQAAAAAb8FEAAAAAHABRAAAAABwQUQAJgJACENDQAA1ggAIEwAAJoJACBNAACaCQAgngEAAJoJACCfAQAAmgkAILoFEAAAAAG7BRAAAAAEvAUQAAAABL0FEAAAAAG-BRAAAAABvwUQAAAAAcAFEAAAAAHBBRAAmQkAIQi6BRAAAAABuwUQAAAABLwFEAAAAAS9BRAAAAABvgUQAAAAAb8FEAAAAAHABRAAAAABwQUQAJoJACEHDQAA1ggAIEwAAJwJACBNAACcCQAgugUAAACGBgK7BQAAAIYGCLwFAAAAhgYIwQUAAJsJhgYiBLoFAAAAhgYCuwUAAACGBgi8BQAAAIYGCMEFAACcCYYGIhYIAACiCQAgIgAAowkAICMAAKQJACCiBQAAnQkAMKMFAAALABCkBQAAnQkAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeoFAQD_CAAhhAYBAPoIACGGBgAAngmGBiKHBhAAnwkAIYgGEACgCQAhiQYQAKAJACGKBgIAoQkAIYsGAgCFCQAhjAYCAKEJACGNBkAA-wgAIY4GQAD7CAAhjwYgAIQJACGQBiAAhAkAIQS6BQAAAIYGArsFAAAAhgYIvAUAAACGBgjBBQAAnAmGBiIIugUQAAAAAbsFEAAAAAS8BRAAAAAEvQUQAAAAAb4FEAAAAAG_BRAAAAABwAUQAAAAAcEFEACaCQAhCLoFEAAAAAG7BRAAAAAFvAUQAAAABb0FEAAAAAG-BRAAAAABvwUQAAAAAcAFEAAAAAHBBRAAmAkAIQi6BQIAAAABuwUCAAAABbwFAgAAAAW9BQIAAAABvgUCAAAAAb8FAgAAAAHABQIAAAABwQUCANgIACED5wUAAA0AIOgFAAANACDpBQAADQAgA-cFAABFACDoBQAARQAg6QUAAEUAIAPnBQAABwAg6AUAAAcAIOkFAAAHACAOogUAAKUJADCjBQAAuAUAEKQFAAClCQAwpQUBAM0IACGqBQEAzQgAIbkFQADUCAAh2AUAAKcJlAYi2QVAANQIACGSBgAApgmSBiKUBhAAlQkAIZUGAQDOCAAhlgYAANMIACCXBkAA0QgAIZgGAQDOCAAhBw0AANYIACBMAACrCQAgTQAAqwkAILoFAAAAkgYCuwUAAACSBgi8BQAAAJIGCMEFAACqCZIGIgcNAADWCAAgTAAAqQkAIE0AAKkJACC6BQAAAJQGArsFAAAAlAYIvAUAAACUBgjBBQAAqAmUBiIHDQAA1ggAIEwAAKkJACBNAACpCQAgugUAAACUBgK7BQAAAJQGCLwFAAAAlAYIwQUAAKgJlAYiBLoFAAAAlAYCuwUAAACUBgi8BQAAAJQGCMEFAACpCZQGIgcNAADWCAAgTAAAqwkAIE0AAKsJACC6BQAAAJIGArsFAAAAkgYIvAUAAACSBgjBBQAAqgmSBiIEugUAAACSBgK7BQAAAJIGCLwFAAAAkgYIwQUAAKsJkgYiDxEAAK8JACCiBQAArAkAMKMFAAB5ABCkBQAArAkAMKUFAQD6CAAhqgUBAPoIACG5BUAA-wgAIdgFAACuCZQGItkFQAD7CAAhkgYAAK0JkgYilAYQAJ8JACGVBgEA_wgAIZYGAACGCQAglwZAAIMJACGYBgEA_wgAIQS6BQAAAJIGArsFAAAAkgYIvAUAAACSBgjBBQAAqwmSBiIEugUAAACUBgK7BQAAAJQGCLwFAAAAlAYIwQUAAKkJlAYiJAMAAIsJACAEAACsCgAgBQAArQoAIAwAAJ0KACAgAACECgAgJAAArgoAICUAAK8KACAoAACwCgAgogUAAKsKADCjBQAABwAQpAUAAKsKADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHYBQAA7wmkBiLZBUAA-wgAIYMGAQD_CAAhqwYQAJ8JACGsBgEA-ggAIa0GAQD6CAAhrgYAAIYJACCvBgEA_wgAIbAGAQD_CAAhsQYQAJ8JACGyBhAAnwkAIbMGEACfCQAhtAYQAJ8JACG1BgEA_wgAIbYGQAD7CAAhtwZAAIMJACG4BkAAgwkAIbkGQACDCQAhugZAAIMJACG7BkAAgwkAIf8GAAAHACCABwAABwAgCqIFAACwCQAwowUAAKAFABCkBQAAsAkAMKUFAQDNCAAhuQVAANQIACHYBQEAzQgAIeoFAQDOCAAhmQYBAM0IACGaBgEAzggAIZsGQADUCAAhD6IFAACxCQAwowUAAIoFABCkBQAAsQkAMKUFAQDNCAAhqgUBAM0IACG4BQAA0wgAILkFQADUCAAh2AUAALIJowYi2QVAANQIACGcBgEAzQgAIZ0GAQDNCAAhngYBAM4IACGfBgEAzggAIaAGQADRCAAhoQZAANEIACEHDQAA1ggAIEwAALQJACBNAAC0CQAgugUAAACjBgK7BQAAAKMGCLwFAAAAowYIwQUAALMJowYiBw0AANYIACBMAAC0CQAgTQAAtAkAILoFAAAAowYCuwUAAACjBgi8BQAAAKMGCMEFAACzCaMGIgS6BQAAAKMGArsFAAAAowYIvAUAAACjBgjBBQAAtAmjBiIJogUAALUJADCjBQAA9AQAEKQFAAC1CQAwpQUBAM0IACGqBQEAzQgAIbkFQADUCAAh2AUAALYJpAYigQYBAM4IACGkBgEAzggAIQcNAADWCAAgTAAAuAkAIE0AALgJACC6BQAAAKQGArsFAAAApAYIvAUAAACkBgjBBQAAtwmkBiIHDQAA1ggAIEwAALgJACBNAAC4CQAgugUAAACkBgK7BQAAAKQGCLwFAAAApAYIwQUAALcJpAYiBLoFAAAApAYCuwUAAACkBgi8BQAAAKQGCMEFAAC4CaQGIhCiBQAAuQkAMKMFAADeBAAQpAUAALkJADClBQEAzQgAIaoFAQDNCAAhqwUBAM0IACG5BUAA1AgAIfcFAQDNCAAh_AUCANIIACGlBgEAzQgAIaYGAQDNCAAhpwYBAM4IACGoBgAAugkAIKkGEACVCQAhqgYQAJUJACGrBhAAlQkAIQ8NAADWCAAgTAAAuwkAIE0AALsJACC6BYAAAAABvQWAAAAAAb4FgAAAAAG_BYAAAAABwAWAAAAAAcEFgAAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBYAAAAABxgWAAAAAAccFgAAAAAEMugWAAAAAAb0FgAAAAAG-BYAAAAABvwWAAAAAAcAFgAAAAAHBBYAAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQWAAAAAAcYFgAAAAAHHBYAAAAABGqIFAAC8CQAwowUAAMgEABCkBQAAvAkAMKUFAQDNCAAhqAUBAM0IACG5BUAA1AgAIdgFAAC2CaQGItkFQADUCAAhgwYBAM4IACGrBhAAlQkAIawGAQDNCAAhrQYBAM0IACGuBgAA0wgAIK8GAQDOCAAhsAYBAM4IACGxBhAAlQkAIbIGEACVCQAhswYQAJUJACG0BhAAlQkAIbUGAQDOCAAhtgZAANQIACG3BkAA0QgAIbgGQADRCAAhuQZAANEIACG6BkAA0QgAIbsGQADRCAAhCqIFAAC9CQAwowUAALAEABCkBQAAvQkAMKUFAQDNCAAhqwUBAM0IACG5BUAA1AgAIdkFQADUCAAh9wUBAM0IACH8BQIA0ggAIbwGAQDNCAAhCKIFAAC-CQAwowUAAJoEABCkBQAAvgkAMKUFAQDNCAAhqAUBAM0IACG5BUAA1AgAIdkFQADUCAAhvQYQAJUJACEKAwAAiwkAIAwAAMAJACCiBQAAvwkAMKMFAACaAQAQpAUAAL8JADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHZBUAA-wgAIb0GEACfCQAhA-cFAAAnACDoBQAAJwAg6QUAACcAIBKiBQAAwQkAMKMFAACCBAAQpAUAAMEJADClBQEAzQgAIagFAQDNCAAhqwUBAM0IACG5BUAA1AgAIdkFQADUCAAh4QUgANAIACHrBQEAzggAIb4GAgDSCAAhvwYBAM4IACHABiAA0AgAIcEGAgDSCAAhwgYCANIIACHDBgEAzggAIcQGQADRCAAhxQYBAM4IACEPogUAAMIJADCjBQAA6gMAEKQFAADCCQAwpQUBAM0IACGrBQEAzggAIbkFQADUCAAh2QVAANQIACHkBQEAzggAIfcFAQDOCAAhxgYBAM0IACHHBgEAzggAIcgGAQDOCAAhyQYCANIIACHKBiAA0AgAIcsGAQDOCAAhDqIFAADDCQAwowUAAMwDABCkBQAAwwkAMKUFAQDNCAAhuQVAANQIACHZBUAA1AgAIY8GIADQCAAhzAYBAM0IACHNBgEAzQgAIc4GAQDOCAAhzwYQAJUJACHQBhAAlgkAIdEGEACWCQAh0gYCANIIACEJogUAAMQJADCjBQAAtgMAEKQFAADECQAwpQUBAM0IACGrBQEAzQgAIbkFQADUCAAh2QVAANQIACHrBQEAzQgAIY8GIADQCAAhG6IFAADFCQAwowUAAKADABCkBQAAxQkAMKUFAQDNCAAhuAUAANMIACC5BUAA1AgAIdkFQADUCAAh5AUBAM4IACHmBQEAzQgAIeoFAQDOCAAh6wUBAM0IACHyBQEAzggAIfMFAQDOCAAh9AUBAM4IACGPBiAA0AgAIc0GAQDOCAAhzgYBAM4IACHPBhAAlgkAIdAGEACWCQAh0QYQAJYJACHSBgIA5wgAIdMGAQDOCAAh1AYBAM4IACHVBgIA0ggAIdYGIADQCAAh1wYgANAIACHYBiAA0AgAIQaiBQAAxgkAMKMFAACIAwAQpAUAAMYJADCrBQEAzQgAIbkFQADUCAAh4wUBAM0IACEIogUAAMcJADCjBQAA8gIAEKQFAADHCQAwpQUBAM0IACG5BUAA1AgAIdkFQADUCAAh5QUBAM0IACHmBQEAzQgAIQkIAADJCQAgogUAAMgJADCjBQAA3wIAEKQFAADICQAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5QUBAPoIACHmBQEA-ggAIQPnBQAAVwAg6AUAAFcAIOkFAABXACAQogUAAMoJADCjBQAA2QIAEKQFAADKCQAwpQUBAM0IACG5BUAA1AgAIdkFQADUCAAh4gUBAM4IACHlBQEAzQgAIeYFAQDNCAAh6gUBAM4IACHyBQEAzggAIfMFAQDOCAAh9AUBAM4IACGPBiAA0AgAIckGAgDSCAAh2QYBAM4IACEQogUAAMsJADCjBQAAwQIAEKQFAADLCQAwpQUBAM0IACGoBQEAzQgAIbkFQADUCAAh2QVAANQIACHaBgEAzggAIdsGAQDOCAAh3AYBAM4IACHdBgEAzQgAId4GAQDNCAAh3wYBAM4IACHgBgEAzggAIeEGAQDNCAAh4gYgANAIACEIogUAAMwJADCjBQAAqwIAEKQFAADMCQAwpQUBAM0IACGoBQEAzQgAIbkFQADUCAAh2QVAANQIACHjBgEAzQgAIQkDAACLCQAgogUAAM0JADCjBQAAlgEAEKQFAADNCQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHjBgEA-ggAIQ-iBQAAzgkAMKMFAACTAgAQpAUAAM4JADClBQEAzQgAIagFAQDNCAAhuQVAANQIACHZBUAA1AgAIeQGAQDNCAAh5QYBAM0IACHmBgEAzggAIecGAQDOCAAh6AZAANEIACHpBgEAzggAIeoGAQDOCAAh6wYBAM4IACELogUAAM8JADCjBQAA_QEAEKQFAADPCQAwpQUBAM0IACGoBQEAzQgAIa8FAQDOCAAhsAUBAM4IACG5BUAA1AgAIdkFQADUCAAh6AZAANQIACHsBgEAzQgAIRKiBQAA0AkAMKMFAADnAQAQpAUAANAJADClBQEAzQgAIbAFAQDOCAAhuAUAANMIACC5BUAA1AgAIdgFAADRCfEGItkFQADUCAAh5QUBAM4IACHZBgEAzggAIdwGAQDOCAAh7QYBAM0IACHuBiAA0AgAIe8GAADrCNQFIvEGQADRCAAh8gYBAM4IACHzBgEAzggAIQcNAADWCAAgTAAA0wkAIE0AANMJACC6BQAAAPEGArsFAAAA8QYIvAUAAADxBgjBBQAA0gnxBiIHDQAA1ggAIEwAANMJACBNAADTCQAgugUAAADxBgK7BQAAAPEGCLwFAAAA8QYIwQUAANIJ8QYiBLoFAAAA8QYCuwUAAADxBgi8BQAAAPEGCMEFAADTCfEGIgLeBQEAAAAB4wUBAAAAAQcdAADXCQAgNQAA1gkAIKIFAADVCQAwowUAALcBABCkBQAA1QkAMN4FAQD6CAAh4wUBAPoIACEZHgAA_AgAICIAAIAJACA3AACHCQAgogUAAIIJADCjBQAAxgYAEKQFAACCCQAwpQUBAPoIACG4BQAAhgkAILkFQAD7CAAh1QUBAPoIACHZBUAA-wgAIeYFAQD6CAAh6wUBAPoIACHsBQEA_wgAIe0FAQD_CAAh7gUBAP8IACHvBUAAgwkAIfAFIACECQAh8QUCAIUJACHyBQEA_wgAIfMFAQD_CAAh9AUBAP8IACH1BSAAhAkAIf8GAADGBgAggAcAAMYGACALNgAA_AgAIKIFAAD5CAAwowUAAPgGABCkBQAA-QgAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeUFAQD6CAAh5gUBAPoIACH_BgAA-AYAIIAHAAD4BgAgAt4FAQAAAAHkBQEAAAABBxgAANoJACA1AADWCQAgogUAANkJADCjBQAAsQEAEKQFAADZCQAw3gUBAPoIACHkBQEA-ggAIQw2AACACQAgogUAAP4IADCjBQAA3wYAEKQFAAD-CAAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5QUBAPoIACHmBQEA-ggAIeoFAQD_CAAh_wYAAN8GACCABwAA3wYAIBEDAADcCQAgBgAA3QkAIDUAANYJACA4AACHCQAgogUAANsJADCjBQAArQEAEKQFAADbCQAwpQUBAPoIACGoBQEA_wgAIbkFQAD7CAAh1QUBAPoIACHZBUAA-wgAId4FAQD6CAAh3wUBAP8IACHgBQEA_wgAIeEFIACECQAh4gUBAP8IACEjDgAAgAoAIBUAAIUKACAcAAD_CQAgHwAAggoAICAAAIQKACAjAACkCQAgKQAA-wkAICoAAPwJACArAAD9CQAgLAAA_gkAIDEAAOEJACAyAACBCgAgMwAA_wkAIDQAAIMKACA5AACHCQAgogUAAPkJADCjBQAAVQAQpAUAAPkJADClBQEA-ggAIbAFAQD_CAAhuAUAAIYJACC5BUAA-wgAIdgFAAD6CfEGItkFQAD7CAAh5QUBAP8IACHZBgEA_wgAIdwGAQD_CAAh7QYBAPoIACHuBiAAhAkAIe8GAADjCdQFIvEGQACDCQAh8gYBAP8IACHzBgEA_wgAIf8GAABVACCABwAAVQAgEwMAANwJACAGAADdCQAgNQAA1gkAIDgAAIcJACCiBQAA2wkAMKMFAACtAQAQpAUAANsJADClBQEA-ggAIagFAQD_CAAhuQVAAPsIACHVBQEA-ggAIdkFQAD7CAAh3gUBAPoIACHfBQEA_wgAIeAFAQD_CAAh4QUgAIQJACHiBQEA_wgAIf8GAACtAQAggAcAAK0BACALAwAA3AkAIKIFAADeCQAwowUAAKgBABCkBQAA3gkAMKUFAQD6CAAhqAUBAP8IACGpBQEA_wgAIbkFQAD7CAAhywUBAPoIACHMBQIAoQkAIc0FAACGCQAgDC0AAIsJACAuAADhCQAgogUAAN8JADCjBQAAogEAEKQFAADfCQAwpQUBAPoIACG5BUAA-wgAIdgFAADgCd0FItkFQAD7CAAh2gUBAPoIACHbBQEA-ggAId0FAQD_CAAhBLoFAAAA3QUCuwUAAADdBQi8BQAAAN0FCMEFAAD0CN0FIgPnBQAAnAEAIOgFAACcAQAg6QUAAJwBACAOLwAA5QkAIDAAAIsJACCiBQAA4gkAMKMFAACcAQAQpAUAAOIJADClBQEA-ggAIbkFQAD7CAAh0QUBAPoIACHSBQEA-ggAIdQFAADjCdQFItUFAQD6CAAh1gUAAIYJACDYBQAA5AnYBSLZBUAA-wgAIQS6BQAAANQFArsFAAAA1AUIvAUAAADUBQjBBQAA8AjUBSIEugUAAADYBQK7BQAAANgFCLwFAAAA2AUIwQUAAO4I2AUiDi0AAIsJACAuAADhCQAgogUAAN8JADCjBQAAogEAEKQFAADfCQAwpQUBAPoIACG5BUAA-wgAIdgFAADgCd0FItkFQAD7CAAh2gUBAPoIACHbBQEA-ggAId0FAQD_CAAh_wYAAKIBACCABwAAogEAIALkBgEAAAAB5QYBAAAAARADAACLCQAgogUAAOcJADCjBQAAkgEAEKQFAADnCQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHkBgEA-ggAIeUGAQD6CAAh5gYBAP8IACHnBgEA_wgAIegGQACDCQAh6QYBAP8IACHqBgEA_wgAIesGAQD_CAAhDAMAAIsJACCiBQAA6AkAMKMFAACOAQAQpAUAAOgJADClBQEA-ggAIagFAQD6CAAhrwUBAP8IACGwBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHoBkAA-wgAIewGAQD6CAAhCyYAAOoJACCiBQAA6QkAMKMFAACDAQAQpAUAAOkJADClBQEA-ggAIbkFQAD7CAAh2AUBAPoIACHqBQEA_wgAIZkGAQD6CAAhmgYBAP8IACGbBkAA-wgAIRMRAACvCQAgJwAA7QkAIKIFAADrCQAwowUAAH8AEKQFAADrCQAwpQUBAPoIACGqBQEA-ggAIbgFAACGCQAguQVAAPsIACHYBQAA7AmjBiLZBUAA-wgAIZwGAQD6CAAhnQYBAPoIACGeBgEA_wgAIZ8GAQD_CAAhoAZAAIMJACGhBkAAgwkAIf8GAAB_ACCABwAAfwAgEREAAK8JACAnAADtCQAgogUAAOsJADCjBQAAfwAQpAUAAOsJADClBQEA-ggAIaoFAQD6CAAhuAUAAIYJACC5BUAA-wgAIdgFAADsCaMGItkFQAD7CAAhnAYBAPoIACGdBgEA-ggAIZ4GAQD_CAAhnwYBAP8IACGgBkAAgwkAIaEGQACDCQAhBLoFAAAAowYCuwUAAACjBgi8BQAAAKMGCMEFAAC0CaMGIgPnBQAAgwEAIOgFAACDAQAg6QUAAIMBACAKEQAArwkAIKIFAADuCQAwowUAAHsAEKQFAADuCQAwpQUBAPoIACGqBQEA-ggAIbkFQAD7CAAh2AUAAO8JpAYigQYBAP8IACGkBgEA_wgAIQS6BQAAAKQGArsFAAAApAYIvAUAAACkBgjBBQAAuAmkBiIbAwAA3AkAIAkAAPMJACARAADyCQAgogUAAPAJADCjBQAAYgAQpAUAAPAJADClBQEA-ggAIaYFAQD6CAAhpwUBAP8IACGoBQEA_wgAIakFAQD_CAAhqgUBAP8IACGrBQEA_wgAIawFCADxCQAhrQUBAP8IACGuBQEA_wgAIa8FAQD_CAAhsAUBAP8IACGxBSAAhAkAIbIFIACECQAhswVAAIMJACG0BUAAgwkAIbUFAgCFCQAhtgVAAIMJACG3BQEA_wgAIbgFAACGCQAguQVAAPsIACEIugUIAAAAAbsFCAAAAAW8BQgAAAAFvQUIAAAAAb4FCAAAAAG_BQgAAAABwAUIAAAAAcEFCADhCAAhJAMAAIsJACAEAACsCgAgBQAArQoAIAwAAJ0KACAgAACECgAgJAAArgoAICUAAK8KACAoAACwCgAgogUAAKsKADCjBQAABwAQpAUAAKsKADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHYBQAA7wmkBiLZBUAA-wgAIYMGAQD_CAAhqwYQAJ8JACGsBgEA-ggAIa0GAQD6CAAhrgYAAIYJACCvBgEA_wgAIbAGAQD_CAAhsQYQAJ8JACGyBhAAnwkAIbMGEACfCQAhtAYQAJ8JACG1BgEA_wgAIbYGQAD7CAAhtwZAAIMJACG4BkAAgwkAIbkGQACDCQAhugZAAIMJACG7BkAAgwkAIf8GAAAHACCABwAABwAgJgoAAIkKACAQAADACQAgGAAAogoAIBoAAKQKACAcAAD_CQAgHgAAyQkAIB8AAIIKACAgAACECgAgIQAAogkAIKIFAACjCgAwowUAABcAEKQFAACjCgAwpQUBAPoIACG4BQAAhgkAILkFQAD7CAAh2QVAAPsIACHkBQEA_wgAIeYFAQD6CAAh6gUBAP8IACHrBQEA-ggAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhzQYBAP8IACHOBgEA_wgAIc8GEACgCQAh0AYQAKAJACHRBhAAoAkAIdIGAgChCQAh0wYBAP8IACHUBgEA_wgAIdUGAgCFCQAh1gYgAIQJACHXBiAAhAkAIdgGIACECQAh_wYAABcAIIAHAAAXACANAwAA3AkAIAkAAPUJACCiBQAA9AkAMKMFAABdABCkBQAA9AkAMKUFAQD6CAAhqAUBAP8IACGpBQEA_wgAIasFAQD6CAAhsAUBAP8IACHOBQEA_wgAIc8FAQD_CAAh0AVAAPsIACEmCgAAiQoAIBAAAMAJACAYAACiCgAgGgAApAoAIBwAAP8JACAeAADJCQAgHwAAggoAICAAAIQKACAhAACiCQAgogUAAKMKADCjBQAAFwAQpAUAAKMKADClBQEA-ggAIbgFAACGCQAguQVAAPsIACHZBUAA-wgAIeQFAQD_CAAh5gUBAPoIACHqBQEA_wgAIesFAQD6CAAh8gUBAP8IACHzBQEA_wgAIfQFAQD_CAAhjwYgAIQJACHNBgEA_wgAIc4GAQD_CAAhzwYQAKAJACHQBhAAoAkAIdEGEACgCQAh0gYCAKEJACHTBgEA_wgAIdQGAQD_CAAh1QYCAIUJACHWBiAAhAkAIdcGIACECQAh2AYgAIQJACH_BgAAFwAggAcAABcAIAKrBQEAAAAB4wUBAAAAAQgJAAD1CQAgHQAA-AkAIKIFAAD3CQAwowUAAFcAEKQFAAD3CQAwqwUBAPoIACG5BUAA-wgAIeMFAQD6CAAhCwgAAMkJACCiBQAAyAkAMKMFAADfAgAQpAUAAMgJADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHlBQEA-ggAIeYFAQD6CAAh_wYAAN8CACCABwAA3wIAICEOAACACgAgFQAAhQoAIBwAAP8JACAfAACCCgAgIAAAhAoAICMAAKQJACApAAD7CQAgKgAA_AkAICsAAP0JACAsAAD-CQAgMQAA4QkAIDIAAIEKACAzAAD_CQAgNAAAgwoAIDkAAIcJACCiBQAA-QkAMKMFAABVABCkBQAA-QkAMKUFAQD6CAAhsAUBAP8IACG4BQAAhgkAILkFQAD7CAAh2AUAAPoJ8QYi2QVAAPsIACHlBQEA_wgAIdkGAQD_CAAh3AYBAP8IACHtBgEA-ggAIe4GIACECQAh7wYAAOMJ1AUi8QZAAIMJACHyBgEA_wgAIfMGAQD_CAAhBLoFAAAA8QYCuwUAAADxBgi8BQAAAPEGCMEFAADTCfEGIgPnBQAAAwAg6AUAAAMAIOkFAAADACAD5wUAAI4BACDoBQAAjgEAIOkFAACOAQAgA-cFAACSAQAg6AUAAJIBACDpBQAAkgEAIAsDAACLCQAgogUAAM0JADCjBQAAlgEAEKQFAADNCQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHjBgEA-ggAIf8GAACWAQAggAcAAJYBACAD5wUAAFEAIOgFAABRACDpBQAAUQAgDAMAAIsJACAMAADACQAgogUAAL8JADCjBQAAmgEAEKQFAAC_CQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACG9BhAAnwkAIf8GAACaAQAggAcAAJoBACAD5wUAAKIBACDoBQAAogEAIOkFAACiAQAgA-cFAABdACDoBQAAXQAg6QUAAF0AIAPnBQAAqAEAIOgFAACoAQAg6QUAAKgBACAD5wUAAGIAIOgFAABiACDpBQAAYgAgDgMAAIsJACAMAACMCQAgogUAAIoJADCjBQAAxgEAEKQFAACKCQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHlBQEA-ggAIfgFIACECQAh-QUBAP8IACH_BgAAxgEAIIAHAADGAQAgAqgFAQAAAAGrBQEAAAABFQMAAIsJACAJAAD1CQAgGwAA3AkAIKIFAACHCgAwowUAAFEAEKQFAACHCgAwpQUBAPoIACGoBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeEFIACECQAh6wUBAP8IACG-BgIAhQkAIb8GAQD_CAAhwAYgAIQJACHBBgIAhQkAIcIGAgCFCQAhwwYBAP8IACHEBkAAgwkAIcUGAQD_CAAhDAkAAPUJACAKAACJCgAgFwAAigoAIKIFAACICgAwowUAACAAEKQFAACICgAwpQUBAPoIACGrBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHrBQEA-ggAIY8GIACECQAhA-cFAAAbACDoBQAAGwAg6QUAABsAIAPnBQAAIwAg6AUAACMAIOkFAAAjACAC5AUBAAAAAYMGAQAAAAEHBQAAjQoAIBgAAI4KACCiBQAAjAoAMKMFAABFABCkBQAAjAoAMOQFAQD6CAAhgwYBAPoIACEYCAAAogkAICIAAKMJACAjAACkCQAgogUAAJ0JADCjBQAACwAQpAUAAJ0JADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHqBQEA_wgAIYQGAQD6CAAhhgYAAJ4JhgYihwYQAJ8JACGIBhAAoAkAIYkGEACgCQAhigYCAKEJACGLBgIAhQkAIYwGAgChCQAhjQZAAPsIACGOBkAA-wgAIY8GIACECQAhkAYgAIQJACH_BgAACwAggAcAAAsAIBcGAACiCgAgBwAApwoAIAgAAKgKACAKAACJCgAgGQAAowkAIKIFAACmCgAwowUAABEAEKQFAACmCgAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAh4gUBAP8IACHlBQEA-ggAIeYFAQD6CAAh6gUBAP8IACHyBQEA_wgAIfMFAQD_CAAh9AUBAP8IACGPBiAAhAkAIckGAgCFCQAh2QYBAP8IACH_BgAAEQAggAcAABEAIAL2BQEAAAAB9wUBAAAAAQkPAACSCgAgFQAAkQoAIKIFAACQCgAwowUAADYAEKQFAACQCgAwpQUBAPoIACG5BUAA-wgAIfYFAQD6CAAh9wUBAPoIACEOAwAAiwkAIAwAAIwJACCiBQAAigkAMKMFAADGAQAQpAUAAIoJADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeUFAQD6CAAh-AUgAIQJACH5BQEA_wgAIf8GAADGAQAggAcAAMYBACAWCgAAiQoAIAsAAJwKACAQAADACQAgEgAAnQoAIBQAAJ4KACAWAACMCQAgogUAAJsKADCjBQAAIwAQpAUAAJsKADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACGPBiAAhAkAIcwGAQD6CAAhzQYBAPoIACHOBgEA_wgAIc8GEACfCQAh0AYQAKAJACHRBhAAoAkAIdIGAgCFCQAh_wYAACMAIIAHAAAjACAPEwAAkgoAIKIFAACTCgAwowUAADIAEKQFAACTCgAwpQUBAPoIACG5BUAA-wgAIfcFAQD6CAAh-wUAAJQK-wUi_AUCAIUJACH9BQIAhQkAIf4FAgCFCQAh_wUBAP8IACGABgEA_wgAIYEGAQD_CAAhggYBAP8IACEEugUAAAD7BQK7BQAAAPsFCLwFAAAA-wUIwQUAAJAJ-wUiEg8AAJIKACARAACvCQAgogUAAJUKADCjBQAALQAQpAUAAJUKADClBQEA-ggAIaoFAQD6CAAhqwUBAPoIACG5BUAA-wgAIfcFAQD6CAAh_AUCAIUJACGlBgEA-ggAIaYGAQD6CAAhpwYBAP8IACGoBgAAlgoAIKkGEACfCQAhqgYQAJ8JACGrBhAAnwkAIQy6BYAAAAABvQWAAAAAAb4FgAAAAAG_BYAAAAABwAWAAAAAAcEFgAAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBYAAAAABxgWAAAAAAccFgAAAAAEC9wUBAAAAAbwGAQAAAAENCQAA9QkAIA4AAJkKACAPAACSCgAgogUAAJgKADCjBQAAJwAQpAUAAJgKADClBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIfcFAQD6CAAh_AUCAIUJACG8BgEA-ggAIQwDAACLCQAgDAAAwAkAIKIFAAC_CQAwowUAAJoBABCkBQAAvwkAMKUFAQD6CAAhqAUBAPoIACG5BUAA-wgAIdkFQAD7CAAhvQYQAJ8JACH_BgAAmgEAIIAHAACaAQAgAswGAQAAAAHNBgEAAAABFAoAAIkKACALAACcCgAgEAAAwAkAIBIAAJ0KACAUAACeCgAgFgAAjAkAIKIFAACbCgAwowUAACMAEKQFAACbCgAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAhjwYgAIQJACHMBgEA-ggAIc0GAQD6CAAhzgYBAP8IACHPBhAAnwkAIdAGEACgCQAh0QYQAKAJACHSBgIAhQkAIQ4JAAD1CQAgCgAAiQoAIBcAAIoKACCiBQAAiAoAMKMFAAAgABCkBQAAiAoAMKUFAQD6CAAhqwUBAPoIACG5BUAA-wgAIdkFQAD7CAAh6wUBAPoIACGPBiAAhAkAIf8GAAAgACCABwAAIAAgA-cFAAAtACDoBQAALQAg6QUAAC0AIAPnBQAAMgAg6AUAADIAIOkFAAAyACATCQAA8wkAIAsAAKAKACAPAAChCgAgGAAAogoAIKIFAACfCgAwowUAABsAEKQFAACfCgAwpQUBAPoIACGrBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHkBQEA_wgAIfcFAQD_CAAhxgYBAPoIACHHBgEA_wgAIcgGAQD_CAAhyQYCAIUJACHKBiAAhAkAIcsGAQD_CAAhDgkAAPUJACAKAACJCgAgFwAAigoAIKIFAACICgAwowUAACAAEKQFAACICgAwpQUBAPoIACGrBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHrBQEA-ggAIY8GIACECQAh_wYAACAAIIAHAAAgACAWCgAAiQoAIAsAAJwKACAQAADACQAgEgAAnQoAIBQAAJ4KACAWAACMCQAgogUAAJsKADCjBQAAIwAQpAUAAJsKADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACGPBiAAhAkAIcwGAQD6CAAhzQYBAPoIACHOBgEA_wgAIc8GEACfCQAh0AYQAKAJACHRBhAAoAkAIdIGAgCFCQAh_wYAACMAIIAHAAAjACAXBgAAogoAIAcAAKcKACAIAACoCgAgCgAAiQoAIBkAAKMJACCiBQAApgoAMKMFAAARABCkBQAApgoAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeIFAQD_CAAh5QUBAPoIACHmBQEA-ggAIeoFAQD_CAAh8gUBAP8IACHzBQEA_wgAIfQFAQD_CAAhjwYgAIQJACHJBgIAhQkAIdkGAQD_CAAh_wYAABEAIIAHAAARACAkCgAAiQoAIBAAAMAJACAYAACiCgAgGgAApAoAIBwAAP8JACAeAADJCQAgHwAAggoAICAAAIQKACAhAACiCQAgogUAAKMKADCjBQAAFwAQpAUAAKMKADClBQEA-ggAIbgFAACGCQAguQVAAPsIACHZBUAA-wgAIeQFAQD_CAAh5gUBAPoIACHqBQEA_wgAIesFAQD6CAAh8gUBAP8IACHzBQEA_wgAIfQFAQD_CAAhjwYgAIQJACHNBgEA_wgAIc4GAQD_CAAhzwYQAKAJACHQBhAAoAkAIdEGEACgCQAh0gYCAKEJACHTBgEA_wgAIdQGAQD_CAAh1QYCAIUJACHWBiAAhAkAIdcGIACECQAh2AYgAIQJACED5wUAACAAIOgFAAAgACDpBQAAIAAgAuIFAQAAAAHlBQEAAAABFQYAAKIKACAHAACnCgAgCAAAqAoAIAoAAIkKACAZAACjCQAgogUAAKYKADCjBQAAEQAQpAUAAKYKADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHiBQEA_wgAIeUFAQD6CAAh5gUBAPoIACHqBQEA_wgAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhyQYCAIUJACHZBgEA_wgAIQPnBQAAEQAg6AUAABEAIOkFAAARACAD5wUAABcAIOgFAAAXACDpBQAAFwAgAqsFAQAAAAGDBgEAAAABBwUAAI0KACAJAAD1CQAgogUAAKoKADCjBQAADQAQpAUAAKoKADCrBQEA-ggAIYMGAQD6CAAhIgMAAIsJACAEAACsCgAgBQAArQoAIAwAAJ0KACAgAACECgAgJAAArgoAICUAAK8KACAoAACwCgAgogUAAKsKADCjBQAABwAQpAUAAKsKADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHYBQAA7wmkBiLZBUAA-wgAIYMGAQD_CAAhqwYQAJ8JACGsBgEA-ggAIa0GAQD6CAAhrgYAAIYJACCvBgEA_wgAIbAGAQD_CAAhsQYQAJ8JACGyBhAAnwkAIbMGEACfCQAhtAYQAJ8JACG1BgEA_wgAIbYGQAD7CAAhtwZAAIMJACG4BkAAgwkAIbkGQACDCQAhugZAAIMJACG7BkAAgwkAIRQDAACLCQAgIwAApAkAIKIFAACxCgAwowUAAAMAEKQFAACxCgAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHaBgEA_wgAIdsGAQD_CAAh3AYBAP8IACHdBgEA-ggAId4GAQD6CAAh3wYBAP8IACHgBgEA_wgAIeEGAQD6CAAh4gYgAIQJACH_BgAAAwAggAcAAAMAIBgIAACiCQAgIgAAowkAICMAAKQJACCiBQAAnQkAMKMFAAALABCkBQAAnQkAMKUFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeoFAQD_CAAhhAYBAPoIACGGBgAAngmGBiKHBhAAnwkAIYgGEACgCQAhiQYQAKAJACGKBgIAoQkAIYsGAgCFCQAhjAYCAKEJACGNBkAA-wgAIY4GQAD7CAAhjwYgAIQJACGQBiAAhAkAIf8GAAALACCABwAACwAgEREAAK8JACCiBQAArAkAMKMFAAB5ABCkBQAArAkAMKUFAQD6CAAhqgUBAPoIACG5BUAA-wgAIdgFAACuCZQGItkFQAD7CAAhkgYAAK0JkgYilAYQAJ8JACGVBgEA_wgAIZYGAACGCQAglwZAAIMJACGYBgEA_wgAIf8GAAB5ACCABwAAeQAgA-cFAAB7ACDoBQAAewAg6QUAAHsAIAPnBQAAfwAg6AUAAH8AIOkFAAB_ACASAwAAiwkAICMAAKQJACCiBQAAsQoAMKMFAAADABCkBQAAsQoAMKUFAQD6CAAhqAUBAPoIACG5BUAA-wgAIdkFQAD7CAAh2gYBAP8IACHbBgEA_wgAIdwGAQD_CAAh3QYBAPoIACHeBgEA-ggAId8GAQD_CAAh4AYBAP8IACHhBgEA-ggAIeIGIACECQAhAAAAAAAAAYQHAQAAAAEBhAcBAAAAAQWEBwgAAAABigcIAAAAAYsHCAAAAAGMBwgAAAABjQcIAAAAAQGEByAAAAABAYQHQAAAAAEFhAcCAAAAAYoHAgAAAAGLBwIAAAABjAcCAAAAAY0HAgAAAAEBhAdAAAAAAQdGAAC9FAAgRwAAxhQAIIEHAAC-FAAgggcAAMUUACCFBwAAVQAghgcAAFUAIIcHAAABACAHRgAAuxQAIEcAAMMUACCBBwAAvBQAIIIHAADCFAAghQcAAAcAIIYHAAAHACCHBwAACQAgB0YAALkUACBHAADAFAAggQcAALoUACCCBwAAvxQAIIUHAAAXACCGBwAAFwAghwcAABkAIANGAAC9FAAggQcAAL4UACCHBwAAAQAgA0YAALsUACCBBwAAvBQAIIcHAAAJACADRgAAuRQAIIEHAAC6FAAghwcAABkAIAAAAAAABYQHAgAAAAGKBwIAAAABiwcCAAAAAYwHAgAAAAGNBwIAAAABB0YAALQUACBHAAC3FAAggQcAALUUACCCBwAAthQAIIUHAABVACCGBwAAVQAghwcAAAEAIANGAAC0FAAggQcAALUUACCHBwAAAQAgAAAABUYAAKwUACBHAACyFAAggQcAAK0UACCCBwAAsRQAIIcHAAAZACAHRgAAqhQAIEcAAK8UACCBBwAAqxQAIIIHAACuFAAghQcAAFUAIIYHAABVACCHBwAAAQAgA0YAAKwUACCBBwAArRQAIIcHAAAZACADRgAAqhQAIIEHAACrFAAghwcAAAEAIAAAAAGEBwAAANQFAgGEBwAAANgFAgVGAACiFAAgRwAAqBQAIIEHAACjFAAgggcAAKcUACCHBwAApAEAIAVGAACgFAAgRwAApRQAIIEHAAChFAAgggcAAKQUACCHBwAAAQAgA0YAAKIUACCBBwAAoxQAIIcHAACkAQAgA0YAAKAUACCBBwAAoRQAIIcHAAABACAAAAABhAcAAADdBQIFRgAAmhQAIEcAAJ4UACCBBwAAmxQAIIIHAACdFAAghwcAAAEAIAtGAADjCgAwRwAA6AoAMIEHAADkCgAwggcAAOUKADCDBwAA5goAIIQHAADnCgAwhQcAAOcKADCGBwAA5woAMIcHAADnCgAwiAcAAOkKADCJBwAA6goAMAkwAADcCgAgpQUBAAAAAbkFQAAAAAHSBQEAAAAB1AUAAADUBQLVBQEAAAAB1gWAAAAAAdgFAAAA2AUC2QVAAAAAAQIAAACeAQAgRgAA7goAIAMAAACeAQAgRgAA7goAIEcAAO0KACABPwAAnBQAMA4vAADlCQAgMAAAiwkAIKIFAADiCQAwowUAAJwBABCkBQAA4gkAMKUFAQAAAAG5BUAA-wgAIdEFAQD6CAAh0gUBAPoIACHUBQAA4wnUBSLVBQEA-ggAIdYFAACGCQAg2AUAAOQJ2AUi2QVAAPsIACECAAAAngEAID8AAO0KACACAAAA6woAID8AAOwKACAMogUAAOoKADCjBQAA6woAEKQFAADqCgAwpQUBAPoIACG5BUAA-wgAIdEFAQD6CAAh0gUBAPoIACHUBQAA4wnUBSLVBQEA-ggAIdYFAACGCQAg2AUAAOQJ2AUi2QVAAPsIACEMogUAAOoKADCjBQAA6woAEKQFAADqCgAwpQUBAPoIACG5BUAA-wgAIdEFAQD6CAAh0gUBAPoIACHUBQAA4wnUBSLVBQEA-ggAIdYFAACGCQAg2AUAAOQJ2AUi2QVAAPsIACEIpQUBALgKACG5BUAAvgoAIdIFAQC4CgAh1AUAANcK1AUi1QUBALgKACHWBYAAAAAB2AUAANgK2AUi2QVAAL4KACEJMAAA2goAIKUFAQC4CgAhuQVAAL4KACHSBQEAuAoAIdQFAADXCtQFItUFAQC4CgAh1gWAAAAAAdgFAADYCtgFItkFQAC-CgAhCTAAANwKACClBQEAAAABuQVAAAAAAdIFAQAAAAHUBQAAANQFAtUFAQAAAAHWBYAAAAAB2AUAAADYBQLZBUAAAAABA0YAAJoUACCBBwAAmxQAIIcHAAABACAERgAA4woAMIEHAADkCgAwgwcAAOYKACCHBwAA5woAMAAAAAVGAACOFAAgRwAAmBQAIIEHAACPFAAgggcAAJcUACCHBwAAwwYAIAdGAACMFAAgRwAAlRQAIIEHAACNFAAgggcAAJQUACCFBwAAVQAghgcAAFUAIIcHAAABACAHRgAAihQAIEcAAJIUACCBBwAAixQAIIIHAACRFAAghQcAAK0BACCGBwAArQEAIIcHAACvAQAgC0YAAPgKADBHAAD9CgAwgQcAAPkKADCCBwAA-goAMIMHAAD7CgAghAcAAPwKADCFBwAA_AoAMIYHAAD8CgAwhwcAAPwKADCIBwAA_goAMIkHAAD_CgAwDAMAAIULACA1AACECwAgOAAAhgsAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAQIAAACvAQAgRgAAgwsAIAMAAACvAQAgRgAAgwsAIEcAAIILACABPwAAkBQAMBEDAADcCQAgBgAA3QkAIDUAANYJACA4AACHCQAgogUAANsJADCjBQAArQEAEKQFAADbCQAwpQUBAAAAAagFAQD_CAAhuQVAAPsIACHVBQEA-ggAIdkFQAD7CAAh3gUBAPoIACHfBQEA_wgAIeAFAQD_CAAh4QUgAIQJACHiBQEA_wgAIQIAAACvAQAgPwAAggsAIAIAAACACwAgPwAAgQsAIA2iBQAA_woAMKMFAACACwAQpAUAAP8KADClBQEA-ggAIagFAQD_CAAhuQVAAPsIACHVBQEA-ggAIdkFQAD7CAAh3gUBAPoIACHfBQEA_wgAIeAFAQD_CAAh4QUgAIQJACHiBQEA_wgAIQ2iBQAA_woAMKMFAACACwAQpAUAAP8KADClBQEA-ggAIagFAQD_CAAhuQVAAPsIACHVBQEA-ggAIdkFQAD7CAAh3gUBAPoIACHfBQEA_wgAIeAFAQD_CAAh4QUgAIQJACHiBQEA_wgAIQmlBQEAuAoAIagFAQC5CgAhuQVAAL4KACHVBQEAuAoAIdkFQAC-CgAh3gUBALgKACHfBQEAuQoAIeAFAQC5CgAh4QUgALsKACEMAwAA9QoAIDUAAPQKACA4AAD3CgAgpQUBALgKACGoBQEAuQoAIbkFQAC-CgAh1QUBALgKACHZBUAAvgoAId4FAQC4CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAhDAMAAIULACA1AACECwAgOAAAhgsAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAQNGAACOFAAggQcAAI8UACCHBwAAwwYAIANGAACMFAAggQcAAI0UACCHBwAAAQAgBEYAAPgKADCBBwAA-QoAMIMHAAD7CgAghwcAAPwKADADRgAAihQAIIEHAACLFAAghwcAAK8BACAAAAAFRgAAghQAIEcAAIgUACCBBwAAgxQAIIIHAACHFAAghwcAAMMGACAFRgAAgBQAIEcAAIUUACCBBwAAgRQAIIIHAACEFAAghwcAAPUGACADRgAAghQAIIEHAACDFAAghwcAAMMGACADRgAAgBQAIIEHAACBFAAghwcAAPUGACAAAAAFRgAA-BMAIEcAAP4TACCBBwAA-RMAIIIHAAD9EwAghwcAAMMGACAFRgAA9hMAIEcAAPsTACCBBwAA9xMAIIIHAAD6EwAghwcAANwGACADRgAA-BMAIIEHAAD5EwAghwcAAMMGACADRgAA9hMAIIEHAAD3EwAghwcAANwGACAAAAALRgAAmgsAMEcAAJ8LADCBBwAAmwsAMIIHAACcCwAwgwcAAJ0LACCEBwAAngsAMIUHAACeCwAwhgcAAJ4LADCHBwAAngsAMIgHAACgCwAwiQcAAKELADACNQAAjQsAIN4FAQAAAAECAAAAuQEAIEYAAKULACADAAAAuQEAIEYAAKULACBHAACkCwAgAT8AAPUTADAIHQAA1wkAIDUAANYJACCiBQAA1QkAMKMFAAC3AQAQpAUAANUJADDeBQEA-ggAIeMFAQD6CAAh9AYAANQJACACAAAAuQEAID8AAKQLACACAAAAogsAID8AAKMLACAFogUAAKELADCjBQAAogsAEKQFAAChCwAw3gUBAPoIACHjBQEA-ggAIQWiBQAAoQsAMKMFAACiCwAQpAUAAKELADDeBQEA-ggAIeMFAQD6CAAhAd4FAQC4CgAhAjUAAIsLACDeBQEAuAoAIQI1AACNCwAg3gUBAAAAAQRGAACaCwAwgQcAAJsLADCDBwAAnQsAIIcHAACeCwAwAAAAAAtGAACsCwAwRwAAsQsAMIEHAACtCwAwggcAAK4LADCDBwAArwsAIIQHAACwCwAwhQcAALALADCGBwAAsAsAMIcHAACwCwAwiAcAALILADCJBwAAswsAMAI1AACUCwAg3gUBAAAAAQIAAACzAQAgRgAAtwsAIAMAAACzAQAgRgAAtwsAIEcAALYLACABPwAA9BMAMAgYAADaCQAgNQAA1gkAIKIFAADZCQAwowUAALEBABCkBQAA2QkAMN4FAQD6CAAh5AUBAPoIACH1BgAA2AkAIAIAAACzAQAgPwAAtgsAIAIAAAC0CwAgPwAAtQsAIAWiBQAAswsAMKMFAAC0CwAQpAUAALMLADDeBQEA-ggAIeQFAQD6CAAhBaIFAACzCwAwowUAALQLABCkBQAAswsAMN4FAQD6CAAh5AUBAPoIACEB3gUBALgKACECNQAAkgsAIN4FAQC4CgAhAjUAAJQLACDeBQEAAAABBEYAAKwLADCBBwAArQsAMIMHAACvCwAghwcAALALADAAAAAAAAALRgAA1AsAMEcAANgLADCBBwAA1QsAMIIHAADWCwAwgwcAANcLACCEBwAAsAsAMIUHAACwCwAwhgcAALALADCHBwAAsAsAMIgHAADZCwAwiQcAALMLADALRgAAywsAMEcAAM8LADCBBwAAzAsAMIIHAADNCwAwgwcAAM4LACCEBwAAngsAMIUHAACeCwAwhgcAAJ4LADCHBwAAngsAMIgHAADQCwAwiQcAAKELADALRgAAwgsAMEcAAMYLADCBBwAAwwsAMIIHAADECwAwgwcAAMULACCEBwAA_AoAMIUHAAD8CgAwhgcAAPwKADCHBwAA_AoAMIgHAADHCwAwiQcAAP8KADAMAwAAhQsAIAYAAIcLACA4AACGCwAgpQUBAAAAAagFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAHiBQEAAAABAgAAAK8BACBGAADKCwAgAwAAAK8BACBGAADKCwAgRwAAyQsAIAE_AADzEwAwAgAAAK8BACA_AADJCwAgAgAAAIALACA_AADICwAgCaUFAQC4CgAhqAUBALkKACG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHfBQEAuQoAIeAFAQC5CgAh4QUgALsKACHiBQEAuQoAIQwDAAD1CgAgBgAA9goAIDgAAPcKACClBQEAuAoAIagFAQC5CgAhuQVAAL4KACHVBQEAuAoAIdkFQAC-CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAh4gUBALkKACEMAwAAhQsAIAYAAIcLACA4AACGCwAgpQUBAAAAAagFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAHiBQEAAAABAh0AAI4LACDjBQEAAAABAgAAALkBACBGAADTCwAgAwAAALkBACBGAADTCwAgRwAA0gsAIAE_AADyEwAwAgAAALkBACA_AADSCwAgAgAAAKILACA_AADRCwAgAeMFAQC4CgAhAh0AAIwLACDjBQEAuAoAIQIdAACOCwAg4wUBAAAAAQIYAACVCwAg5AUBAAAAAQIAAACzAQAgRgAA3AsAIAMAAACzAQAgRgAA3AsAIEcAANsLACABPwAA8RMAMAIAAACzAQAgPwAA2wsAIAIAAAC0CwAgPwAA2gsAIAHkBQEAuAoAIQIYAACTCwAg5AUBALgKACECGAAAlQsAIOQFAQAAAAEERgAA1AsAMIEHAADVCwAwgwcAANcLACCHBwAAsAsAMARGAADLCwAwgQcAAMwLADCDBwAAzgsAIIcHAACeCwAwBEYAAMILADCBBwAAwwsAMIMHAADFCwAghwcAAPwKADAAAAAABUYAAOkTACBHAADvEwAggQcAAOoTACCCBwAA7hMAIIcHAACVBgAgBUYAAOcTACBHAADsEwAggQcAAOgTACCCBwAA6xMAIIcHAAAlACADRgAA6RMAIIEHAADqEwAghwcAAJUGACADRgAA5xMAIIEHAADoEwAghwcAACUAIAAAAAVGAADhEwAgRwAA5RMAIIEHAADiEwAgggcAAOQTACCHBwAAAQAgC0YAAO0LADBHAADyCwAwgQcAAO4LADCCBwAA7wsAMIMHAADwCwAghAcAAPELADCFBwAA8QsAMIYHAADxCwAwhwcAAPELADCIBwAA8wsAMIkHAAD0CwAwBA8AAOcLACClBQEAAAABuQVAAAAAAfcFAQAAAAECAAAAOAAgRgAA-AsAIAMAAAA4ACBGAAD4CwAgRwAA9wsAIAE_AADjEwAwCg8AAJIKACAVAACRCgAgogUAAJAKADCjBQAANgAQpAUAAJAKADClBQEAAAABuQVAAPsIACH2BQEA-ggAIfcFAQD6CAAh-gYAAI8KACACAAAAOAAgPwAA9wsAIAIAAAD1CwAgPwAA9gsAIAeiBQAA9AsAMKMFAAD1CwAQpAUAAPQLADClBQEA-ggAIbkFQAD7CAAh9gUBAPoIACH3BQEA-ggAIQeiBQAA9AsAMKMFAAD1CwAQpAUAAPQLADClBQEA-ggAIbkFQAD7CAAh9gUBAPoIACH3BQEA-ggAIQOlBQEAuAoAIbkFQAC-CgAh9wUBALgKACEEDwAA5QsAIKUFAQC4CgAhuQVAAL4KACH3BQEAuAoAIQQPAADnCwAgpQUBAAAAAbkFQAAAAAH3BQEAAAABA0YAAOETACCBBwAA4hMAIIcHAAABACAERgAA7QsAMIEHAADuCwAwgwcAAPALACCHBwAA8QsAMBcOAADpEQAgFQAA7xEAIBwAAOgRACAfAADsEQAgIAAA7hEAICMAAJ4NACApAADkEQAgKgAA5REAICsAAOYRACAsAADnEQAgMQAA6hEAIDIAAOsRACAzAADoEQAgNAAA7REAIDkAAOALACCwBQAAsgoAILgFAACyCgAg5QUAALIKACDZBgAAsgoAINwGAACyCgAg8QYAALIKACDyBgAAsgoAIPMGAACyCgAgAAAAAAAAAYQHAAAA-wUCBUYAANwTACBHAADfEwAggQcAAN0TACCCBwAA3hMAIIcHAAAlACADRgAA3BMAIIEHAADdEwAghwcAACUAIAAAAAVGAADUEwAgRwAA2hMAIIEHAADVEwAgggcAANkTACCHBwAAuwUAIAVGAADSEwAgRwAA1xMAIIEHAADTEwAgggcAANYTACCHBwAAFQAgA0YAANQTACCBBwAA1RMAIIcHAAC7BQAgA0YAANITACCBBwAA0xMAIIcHAAAVACAAAAAFRgAAyhMAIEcAANATACCBBwAAyxMAIIIHAADPEwAghwcAALsFACAFRgAAyBMAIEcAAM0TACCBBwAAyRMAIIIHAADMEwAghwcAABkAIANGAADKEwAggQcAAMsTACCHBwAAuwUAIANGAADIEwAggQcAAMkTACCHBwAAGQAgAAAAAAABhAcAAACGBgIFhAcQAAAAAYoHEAAAAAGLBxAAAAABjAcQAAAAAY0HEAAAAAEFhAcQAAAAAYoHEAAAAAGLBxAAAAABjAcQAAAAAY0HEAAAAAELRgAAjQ0AMEcAAJINADCBBwAAjg0AMIIHAACPDQAwgwcAAJANACCEBwAAkQ0AMIUHAACRDQAwhgcAAJENADCHBwAAkQ0AMIgHAACTDQAwiQcAAJQNADALRgAAgQ0AMEcAAIYNADCBBwAAgg0AMIIHAACDDQAwgwcAAIQNACCEBwAAhQ0AMIUHAACFDQAwhgcAAIUNADCHBwAAhQ0AMIgHAACHDQAwiQcAAIgNADALRgAAngwAMEcAAKMMADCBBwAAnwwAMIIHAACgDAAwgwcAAKEMACCEBwAAogwAMIUHAACiDAAwhgcAAKIMADCHBwAAogwAMIgHAACkDAAwiQcAAKUMADAdAwAA-gwAIAQAAPsMACAMAAD8DAAgIAAAgA0AICQAAP0MACAlAAD-DAAgKAAA_wwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAgAAAAkAIEYAAPkMACADAAAACQAgRgAA-QwAIEcAAKkMACABPwAAxxMAMCIDAACLCQAgBAAArAoAIAUAAK0KACAMAACdCgAgIAAAhAoAICQAAK4KACAlAACvCgAgKAAAsAoAIKIFAACrCgAwowUAAAcAEKQFAACrCgAwpQUBAAAAAagFAQD6CAAhuQVAAPsIACHYBQAA7wmkBiLZBUAA-wgAIYMGAQD_CAAhqwYQAJ8JACGsBgEAAAABrQYBAPoIACGuBgAAhgkAIK8GAQD_CAAhsAYBAP8IACGxBhAAnwkAIbIGEACfCQAhswYQAJ8JACG0BhAAnwkAIbUGAQD_CAAhtgZAAPsIACG3BkAAgwkAIbgGQACDCQAhuQZAAIMJACG6BkAAgwkAIbsGQACDCQAhAgAAAAkAID8AAKkMACACAAAApgwAID8AAKcMACAaogUAAKUMADCjBQAApgwAEKQFAAClDAAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2AUAAO8JpAYi2QVAAPsIACGDBgEA_wgAIasGEACfCQAhrAYBAPoIACGtBgEA-ggAIa4GAACGCQAgrwYBAP8IACGwBgEA_wgAIbEGEACfCQAhsgYQAJ8JACGzBhAAnwkAIbQGEACfCQAhtQYBAP8IACG2BkAA-wgAIbcGQACDCQAhuAZAAIMJACG5BkAAgwkAIboGQACDCQAhuwZAAIMJACEaogUAAKUMADCjBQAApgwAEKQFAAClDAAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2AUAAO8JpAYi2QVAAPsIACGDBgEA_wgAIasGEACfCQAhrAYBAPoIACGtBgEA-ggAIa4GAACGCQAgrwYBAP8IACGwBgEA_wgAIbEGEACfCQAhsgYQAJ8JACGzBhAAnwkAIbQGEACfCQAhtQYBAP8IACG2BkAA-wgAIbcGQACDCQAhuAZAAIMJACG5BkAAgwkAIboGQACDCQAhuwZAAIMJACEWpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYi2QVAAL4KACGrBhAAmQwAIawGAQC4CgAhrQYBALgKACGuBoAAAAABrwYBALkKACGwBgEAuQoAIbEGEACZDAAhsgYQAJkMACGzBhAAmQwAIbQGEACZDAAhtQYBALkKACG2BkAAvgoAIbcGQAC8CgAhuAZAALwKACG5BkAAvAoAIboGQAC8CgAhuwZAALwKACEBhAcAAACkBgIdAwAAqgwAIAQAAKsMACAMAACsDAAgIAAAsAwAICQAAK0MACAlAACuDAAgKAAArwwAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdgFAACoDKQGItkFQAC-CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhBUYAALUTACBHAADFEwAggQcAALYTACCCBwAAxBMAIIcHAAABACAFRgAAsxMAIEcAAMITACCBBwAAtBMAIIIHAADBEwAghwcAAAUAIAtGAADrDAAwRwAA8AwAMIEHAADsDAAwggcAAO0MADCDBwAA7gwAIIQHAADvDAAwhQcAAO8MADCGBwAA7wwAMIcHAADvDAAwiAcAAPEMADCJBwAA8gwAMAdGAADkDAAgRwAA5wwAIIEHAADlDAAgggcAAOYMACCFBwAAeQAghgcAAHkAIIcHAACjBQAgC0YAANgMADBHAADdDAAwgQcAANkMADCCBwAA2gwAMIMHAADbDAAghAcAANwMADCFBwAA3AwAMIYHAADcDAAwhwcAANwMADCIBwAA3gwAMIkHAADfDAAwC0YAAL0MADBHAADCDAAwgQcAAL4MADCCBwAAvwwAMIMHAADADAAghAcAAMEMADCFBwAAwQwAMIYHAADBDAAwhwcAAMEMADCIBwAAwwwAMIkHAADEDAAwC0YAALEMADBHAAC2DAAwgQcAALIMADCCBwAAswwAMIMHAAC0DAAghAcAALUMADCFBwAAtQwAMIYHAAC1DAAwhwcAALUMADCIBwAAtwwAMIkHAAC4DAAwFgMAAMIKACAJAADECgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGrBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAECAAAAZAAgRgAAvAwAIAMAAABkACBGAAC8DAAgRwAAuwwAIAE_AADAEwAwGwMAANwJACAJAADzCQAgEQAA8gkAIKIFAADwCQAwowUAAGIAEKQFAADwCQAwpQUBAAAAAaYFAQD6CAAhpwUBAAAAAagFAQD_CAAhqQUBAP8IACGqBQEA_wgAIasFAQD_CAAhrAUIAPEJACGtBQEA_wgAIa4FAQD_CAAhrwUBAP8IACGwBQEA_wgAIbEFIACECQAhsgUgAIQJACGzBUAAgwkAIbQFQACDCQAhtQUCAIUJACG2BUAAgwkAIbcFAQD_CAAhuAUAAIYJACC5BUAA-wgAIQIAAABkACA_AAC7DAAgAgAAALkMACA_AAC6DAAgGKIFAAC4DAAwowUAALkMABCkBQAAuAwAMKUFAQD6CAAhpgUBAPoIACGnBQEA_wgAIagFAQD_CAAhqQUBAP8IACGqBQEA_wgAIasFAQD_CAAhrAUIAPEJACGtBQEA_wgAIa4FAQD_CAAhrwUBAP8IACGwBQEA_wgAIbEFIACECQAhsgUgAIQJACGzBUAAgwkAIbQFQACDCQAhtQUCAIUJACG2BUAAgwkAIbcFAQD_CAAhuAUAAIYJACC5BUAA-wgAIRiiBQAAuAwAMKMFAAC5DAAQpAUAALgMADClBQEA-ggAIaYFAQD6CAAhpwUBAP8IACGoBQEA_wgAIakFAQD_CAAhqgUBAP8IACGrBQEA_wgAIawFCADxCQAhrQUBAP8IACGuBQEA_wgAIa8FAQD_CAAhsAUBAP8IACGxBSAAhAkAIbIFIACECQAhswVAAIMJACG0BUAAgwkAIbUFAgCFCQAhtgVAAIMJACG3BQEA_wgAIbgFAACGCQAguQVAAPsIACEUpQUBALgKACGmBQEAuAoAIacFAQC5CgAhqAUBALkKACGpBQEAuQoAIasFAQC5CgAhrAUIALoKACGtBQEAuQoAIa4FAQC5CgAhrwUBALkKACGwBQEAuQoAIbEFIAC7CgAhsgUgALsKACGzBUAAvAoAIbQFQAC8CgAhtQUCAL0KACG2BUAAvAoAIbcFAQC5CgAhuAWAAAAAAbkFQAC-CgAhFgMAAL8KACAJAADBCgAgpQUBALgKACGmBQEAuAoAIacFAQC5CgAhqAUBALkKACGpBQEAuQoAIasFAQC5CgAhrAUIALoKACGtBQEAuQoAIa4FAQC5CgAhrwUBALkKACGwBQEAuQoAIbEFIAC7CgAhsgUgALsKACGzBUAAvAoAIbQFQAC8CgAhtQUCAL0KACG2BUAAvAoAIbcFAQC5CgAhuAWAAAAAAbkFQAC-CgAhFgMAAMIKACAJAADECgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGrBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEMJwAA1wwAIKUFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAAowYC2QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAZ8GAQAAAAGgBkAAAAABoQZAAAAAAQIAAACBAQAgRgAA1gwAIAMAAACBAQAgRgAA1gwAIEcAAMgMACABPwAAvxMAMBERAACvCQAgJwAA7QkAIKIFAADrCQAwowUAAH8AEKQFAADrCQAwpQUBAAAAAaoFAQAAAAG4BQAAhgkAILkFQAD7CAAh2AUAAOwJowYi2QVAAPsIACGcBgEA-ggAIZ0GAQD6CAAhngYBAP8IACGfBgEA_wgAIaAGQACDCQAhoQZAAIMJACECAAAAgQEAID8AAMgMACACAAAAxQwAID8AAMYMACAPogUAAMQMADCjBQAAxQwAEKQFAADEDAAwpQUBAPoIACGqBQEA-ggAIbgFAACGCQAguQVAAPsIACHYBQAA7AmjBiLZBUAA-wgAIZwGAQD6CAAhnQYBAPoIACGeBgEA_wgAIZ8GAQD_CAAhoAZAAIMJACGhBkAAgwkAIQ-iBQAAxAwAMKMFAADFDAAQpAUAAMQMADClBQEA-ggAIaoFAQD6CAAhuAUAAIYJACC5BUAA-wgAIdgFAADsCaMGItkFQAD7CAAhnAYBAPoIACGdBgEA-ggAIZ4GAQD_CAAhnwYBAP8IACGgBkAAgwkAIaEGQACDCQAhC6UFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2AUAAMcMowYi2QVAAL4KACGcBgEAuAoAIZ0GAQC4CgAhngYBALkKACGfBgEAuQoAIaAGQAC8CgAhoQZAALwKACEBhAcAAACjBgIMJwAAyQwAIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2AUAAMcMowYi2QVAAL4KACGcBgEAuAoAIZ0GAQC4CgAhngYBALkKACGfBgEAuQoAIaAGQAC8CgAhoQZAALwKACELRgAAygwAMEcAAM8MADCBBwAAywwAMIIHAADMDAAwgwcAAM0MACCEBwAAzgwAMIUHAADODAAwhgcAAM4MADCHBwAAzgwAMIgHAADQDAAwiQcAANEMADAGpQUBAAAAAbkFQAAAAAHYBQEAAAAB6gUBAAAAAZoGAQAAAAGbBkAAAAABAgAAAIUBACBGAADVDAAgAwAAAIUBACBGAADVDAAgRwAA1AwAIAE_AAC-EwAwCyYAAOoJACCiBQAA6QkAMKMFAACDAQAQpAUAAOkJADClBQEAAAABuQVAAPsIACHYBQEA-ggAIeoFAQD_CAAhmQYBAPoIACGaBgEA_wgAIZsGQAD7CAAhAgAAAIUBACA_AADUDAAgAgAAANIMACA_AADTDAAgCqIFAADRDAAwowUAANIMABCkBQAA0QwAMKUFAQD6CAAhuQVAAPsIACHYBQEA-ggAIeoFAQD_CAAhmQYBAPoIACGaBgEA_wgAIZsGQAD7CAAhCqIFAADRDAAwowUAANIMABCkBQAA0QwAMKUFAQD6CAAhuQVAAPsIACHYBQEA-ggAIeoFAQD_CAAhmQYBAPoIACGaBgEA_wgAIZsGQAD7CAAhBqUFAQC4CgAhuQVAAL4KACHYBQEAuAoAIeoFAQC5CgAhmgYBALkKACGbBkAAvgoAIQalBQEAuAoAIbkFQAC-CgAh2AUBALgKACHqBQEAuQoAIZoGAQC5CgAhmwZAAL4KACEGpQUBAAAAAbkFQAAAAAHYBQEAAAAB6gUBAAAAAZoGAQAAAAGbBkAAAAABDCcAANcMACClBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAKMGAtkFQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAZAAAAAAaEGQAAAAAEERgAAygwAMIEHAADLDAAwgwcAAM0MACCHBwAAzgwAMAWlBQEAAAABuQVAAAAAAdgFAAAApAYCgQYBAAAAAaQGAQAAAAECAAAAfQAgRgAA4wwAIAMAAAB9ACBGAADjDAAgRwAA4gwAIAE_AAC9EwAwChEAAK8JACCiBQAA7gkAMKMFAAB7ABCkBQAA7gkAMKUFAQAAAAGqBQEA-ggAIbkFQAD7CAAh2AUAAO8JpAYigQYBAP8IACGkBgEA_wgAIQIAAAB9ACA_AADiDAAgAgAAAOAMACA_AADhDAAgCaIFAADfDAAwowUAAOAMABCkBQAA3wwAMKUFAQD6CAAhqgUBAPoIACG5BUAA-wgAIdgFAADvCaQGIoEGAQD_CAAhpAYBAP8IACEJogUAAN8MADCjBQAA4AwAEKQFAADfDAAwpQUBAPoIACGqBQEA-ggAIbkFQAD7CAAh2AUAAO8JpAYigQYBAP8IACGkBgEA_wgAIQWlBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYigQYBALkKACGkBgEAuQoAIQWlBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYigQYBALkKACGkBgEAuQoAIQWlBQEAAAABuQVAAAAAAdgFAAAApAYCgQYBAAAAAaQGAQAAAAEKpQUBAAAAAbkFQAAAAAHYBQAAAJQGAtkFQAAAAAGSBgAAAJIGApQGEAAAAAGVBgEAAAABlgaAAAAAAZcGQAAAAAGYBgEAAAABAgAAAKMFACBGAADkDAAgAwAAAHkAIEYAAOQMACBHAADoDAAgDAAAAHkAID8AAOgMACClBQEAuAoAIbkFQAC-CgAh2AUAAOoMlAYi2QVAAL4KACGSBgAA6QySBiKUBhAAmQwAIZUGAQC5CgAhlgaAAAAAAZcGQAC8CgAhmAYBALkKACEKpQUBALgKACG5BUAAvgoAIdgFAADqDJQGItkFQAC-CgAhkgYAAOkMkgYilAYQAJkMACGVBgEAuQoAIZYGgAAAAAGXBkAAvAoAIZgGAQC5CgAhAYQHAAAAkgYCAYQHAAAAlAYCDQ8AAPgMACClBQEAAAABqwUBAAAAAbkFQAAAAAH3BQEAAAAB_AUCAAAAAaUGAQAAAAGmBgEAAAABpwYBAAAAAagGgAAAAAGpBhAAAAABqgYQAAAAAasGEAAAAAECAAAALwAgRgAA9wwAIAMAAAAvACBGAAD3DAAgRwAA9QwAIAE_AAC8EwAwEg8AAJIKACARAACvCQAgogUAAJUKADCjBQAALQAQpAUAAJUKADClBQEAAAABqgUBAPoIACGrBQEA-ggAIbkFQAD7CAAh9wUBAPoIACH8BQIAhQkAIaUGAQD6CAAhpgYBAPoIACGnBgEA_wgAIagGAACWCgAgqQYQAJ8JACGqBhAAnwkAIasGEACfCQAhAgAAAC8AID8AAPUMACACAAAA8wwAID8AAPQMACAQogUAAPIMADCjBQAA8wwAEKQFAADyDAAwpQUBAPoIACGqBQEA-ggAIasFAQD6CAAhuQVAAPsIACH3BQEA-ggAIfwFAgCFCQAhpQYBAPoIACGmBgEA-ggAIacGAQD_CAAhqAYAAJYKACCpBhAAnwkAIaoGEACfCQAhqwYQAJ8JACEQogUAAPIMADCjBQAA8wwAEKQFAADyDAAwpQUBAPoIACGqBQEA-ggAIasFAQD6CAAhuQVAAPsIACH3BQEA-ggAIfwFAgCFCQAhpQYBAPoIACGmBgEA-ggAIacGAQD_CAAhqAYAAJYKACCpBhAAnwkAIaoGEACfCQAhqwYQAJ8JACEMpQUBALgKACGrBQEAuAoAIbkFQAC-CgAh9wUBALgKACH8BQIAvQoAIaUGAQC4CgAhpgYBALgKACGnBgEAuQoAIagGgAAAAAGpBhAAmQwAIaoGEACZDAAhqwYQAJkMACENDwAA9gwAIKUFAQC4CgAhqwUBALgKACG5BUAAvgoAIfcFAQC4CgAh_AUCAL0KACGlBgEAuAoAIaYGAQC4CgAhpwYBALkKACGoBoAAAAABqQYQAJkMACGqBhAAmQwAIasGEACZDAAhBUYAALcTACBHAAC6EwAggQcAALgTACCCBwAAuRMAIIcHAAAlACANDwAA-AwAIKUFAQAAAAGrBQEAAAABuQVAAAAAAfcFAQAAAAH8BQIAAAABpQYBAAAAAaYGAQAAAAGnBgEAAAABqAaAAAAAAakGEAAAAAGqBhAAAAABqwYQAAAAAQNGAAC3EwAggQcAALgTACCHBwAAJQAgHQMAAPoMACAEAAD7DAAgDAAA_AwAICAAAIANACAkAAD9DAAgJQAA_gwAICgAAP8MACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQNGAAC1EwAggQcAALYTACCHBwAAAQAgA0YAALMTACCBBwAAtBMAIIcHAAAFACAERgAA6wwAMIEHAADsDAAwgwcAAO4MACCHBwAA7wwAMANGAADkDAAggQcAAOUMACCHBwAAowUAIARGAADYDAAwgQcAANkMADCDBwAA2wwAIIcHAADcDAAwBEYAAL0MADCBBwAAvgwAMIMHAADADAAghwcAAMEMADAERgAAsQwAMIEHAACyDAAwgwcAALQMACCHBwAAtQwAMAIYAACLDAAg5AUBAAAAAQIAAABHACBGAACMDQAgAwAAAEcAIEYAAIwNACBHAACLDQAgAT8AALITADAIBQAAjQoAIBgAAI4KACCiBQAAjAoAMKMFAABFABCkBQAAjAoAMOQFAQD6CAAhgwYBAPoIACH5BgAAiwoAIAIAAABHACA_AACLDQAgAgAAAIkNACA_AACKDQAgBaIFAACIDQAwowUAAIkNABCkBQAAiA0AMOQFAQD6CAAhgwYBAPoIACEFogUAAIgNADCjBQAAiQ0AEKQFAACIDQAw5AUBAPoIACGDBgEA-ggAIQHkBQEAuAoAIQIYAACJDAAg5AUBALgKACECGAAAiwwAIOQFAQAAAAECCQAAkgwAIKsFAQAAAAECAAAADwAgRgAAmA0AIAMAAAAPACBGAACYDQAgRwAAlw0AIAE_AACxEwAwCAUAAI0KACAJAAD1CQAgogUAAKoKADCjBQAADQAQpAUAAKoKADCrBQEA-ggAIYMGAQD6CAAh_gYAAKkKACACAAAADwAgPwAAlw0AIAIAAACVDQAgPwAAlg0AIAWiBQAAlA0AMKMFAACVDQAQpAUAAJQNADCrBQEA-ggAIYMGAQD6CAAhBaIFAACUDQAwowUAAJUNABCkBQAAlA0AMKsFAQD6CAAhgwYBAPoIACEBqwUBALgKACECCQAAkAwAIKsFAQC4CgAhAgkAAJIMACCrBQEAAAABBEYAAI0NADCBBwAAjg0AMIMHAACQDQAghwcAAJENADAERgAAgQ0AMIEHAACCDQAwgwcAAIQNACCHBwAAhQ0AMARGAACeDAAwgQcAAJ8MADCDBwAAoQwAIIcHAACiDAAwAAAAAAAAAAAFRgAArBMAIEcAAK8TACCBBwAArRMAIIIHAACuEwAghwcAAAkAIANGAACsEwAggQcAAK0TACCHBwAACQAgEgMAAPsLACAEAACEEgAgBQAA-xEAIAwAAP8RACAgAADuEQAgJAAAhRIAICUAAIYSACAoAACHEgAggwYAALIKACCuBgAAsgoAIK8GAACyCgAgsAYAALIKACC1BgAAsgoAILcGAACyCgAguAYAALIKACC5BgAAsgoAILoGAACyCgAguwYAALIKACAAAAAFRgAApxMAIEcAAKoTACCBBwAAqBMAIIIHAACpEwAghwcAAIEBACADRgAApxMAIIEHAACoEwAghwcAAIEBACAAAAAFRgAAohMAIEcAAKUTACCBBwAAoxMAIIIHAACkEwAghwcAAAkAIANGAACiEwAggQcAAKMTACCHBwAACQAgAAAABUYAAJ0TACBHAACgEwAggQcAAJ4TACCCBwAAnxMAIIcHAAAJACADRgAAnRMAIIEHAACeEwAghwcAAAkAIAAAAAAABUYAAJgTACBHAACbEwAggQcAAJkTACCCBwAAmhMAIIcHAAAJACADRgAAmBMAIIEHAACZEwAghwcAAAkAIAAAAAAAB0YAAJMTACBHAACWEwAggQcAAJQTACCCBwAAlRMAIIUHAAALACCGBwAACwAghwcAALsFACADRgAAkxMAIIEHAACUEwAghwcAALsFACAAAAAAAAVGAACIEwAgRwAAkRMAIIEHAACJEwAgggcAAJATACCHBwAAhQQAIAVGAACGEwAgRwAAjhMAIIEHAACHEwAgggcAAI0TACCHBwAAGQAgBUYAAIQTACBHAACLEwAggQcAAIUTACCCBwAAihMAIIcHAAAlACADRgAAiBMAIIEHAACJEwAghwcAAIUEACADRgAAhhMAIIEHAACHEwAghwcAABkAIANGAACEEwAggQcAAIUTACCHBwAAJQAgAAAAAAAFRgAA_hIAIEcAAIITACCBBwAA_xIAIIIHAACBEwAghwcAAAEAIAtGAADWDQAwRwAA2w0AMIEHAADXDQAwggcAANgNADCDBwAA2Q0AIIQHAADaDQAwhQcAANoNADCGBwAA2g0AMIcHAADaDQAwiAcAANwNADCJBwAA3Q0AMAgJAADNDQAgDwAAzg0AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAAB_AUCAAAAAQIAAAApACBGAADhDQAgAwAAACkAIEYAAOENACBHAADgDQAgAT8AAIATADAOCQAA9QkAIA4AAJkKACAPAACSCgAgogUAAJgKADCjBQAAJwAQpAUAAJgKADClBQEAAAABqwUBAPoIACG5BUAA-wgAIdkFQAD7CAAh9wUBAPoIACH8BQIAhQkAIbwGAQD6CAAh-wYAAJcKACACAAAAKQAgPwAA4A0AIAIAAADeDQAgPwAA3w0AIAqiBQAA3Q0AMKMFAADeDQAQpAUAAN0NADClBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIfcFAQD6CAAh_AUCAIUJACG8BgEA-ggAIQqiBQAA3Q0AMKMFAADeDQAQpAUAAN0NADClBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIfcFAQD6CAAh_AUCAIUJACG8BgEA-ggAIQalBQEAuAoAIasFAQC4CgAhuQVAAL4KACHZBUAAvgoAIfcFAQC4CgAh_AUCAL0KACEICQAAyg0AIA8AAMsNACClBQEAuAoAIasFAQC4CgAhuQVAAL4KACHZBUAAvgoAIfcFAQC4CgAh_AUCAL0KACEICQAAzQ0AIA8AAM4NACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB9wUBAAAAAfwFAgAAAAEDRgAA_hIAIIEHAAD_EgAghwcAAAEAIARGAADWDQAwgQcAANcNADCDBwAA2Q0AIIcHAADaDQAwAAAAAAAABUYAAPMSACBHAAD8EgAggQcAAPQSACCCBwAA-xIAIIcHAAABACAFRgAA8RIAIEcAAPkSACCBBwAA8hIAIIIHAAD4EgAghwcAABkAIAdGAADvEgAgRwAA9hIAIIEHAADwEgAgggcAAPUSACCFBwAAVQAghgcAAFUAIIcHAAABACADRgAA8xIAIIEHAAD0EgAghwcAAAEAIANGAADxEgAggQcAAPISACCHBwAAGQAgA0YAAO8SACCBBwAA8BIAIIcHAAABACAAAAAAAAdGAADhEgAgRwAA7RIAIIEHAADiEgAgggcAAOwSACCFBwAAFwAghgcAABcAIIcHAAAZACAHRgAA3xIAIEcAAOoSACCBBwAA4BIAIIIHAADpEgAghQcAACAAIIYHAAAgACCHBwAATgAgB0YAAN0SACBHAADnEgAggQcAAN4SACCCBwAA5hIAIIUHAAAjACCGBwAAIwAghwcAACUAIAdGAADbEgAgRwAA5BIAIIEHAADcEgAgggcAAOMSACCFBwAAEQAghgcAABEAIIcHAAAVACADRgAA4RIAIIEHAADiEgAghwcAABkAIANGAADfEgAggQcAAOASACCHBwAATgAgA0YAAN0SACCBBwAA3hIAIIcHAAAlACADRgAA2xIAIIEHAADcEgAghwcAABUAIAAAAAAABUYAANESACBHAADZEgAggQcAANISACCCBwAA2BIAIIcHAABOACALRgAAsg4AMEcAALYOADCBBwAAsw4AMIIHAAC0DgAwgwcAALUOACCEBwAA2g0AMIUHAADaDQAwhgcAANoNADCHBwAA2g0AMIgHAAC3DgAwiQcAAN0NADALRgAAqQ4AMEcAAK0OADCBBwAAqg4AMIIHAACrDgAwgwcAAKwOACCEBwAA7wwAMIUHAADvDAAwhgcAAO8MADCHBwAA7wwAMIgHAACuDgAwiQcAAPIMADALRgAAnQ4AMEcAAKIOADCBBwAAng4AMIIHAACfDgAwgwcAAKAOACCEBwAAoQ4AMIUHAAChDgAwhgcAAKEOADCHBwAAoQ4AMIgHAACjDgAwiQcAAKQOADALRgAAkQ4AMEcAAJYOADCBBwAAkg4AMIIHAACTDgAwgwcAAJQOACCEBwAAlQ4AMIUHAACVDgAwhgcAAJUOADCHBwAAlQ4AMIgHAACXDgAwiQcAAJgOADALRgAAiA4AMEcAAIwOADCBBwAAiQ4AMIIHAACKDgAwgwcAAIsOACCEBwAA8QsAMIUHAADxCwAwhgcAAPELADCHBwAA8QsAMIgHAACNDgAwiQcAAPQLADAEFQAA5gsAIKUFAQAAAAG5BUAAAAAB9gUBAAAAAQIAAAA4ACBGAACQDgAgAwAAADgAIEYAAJAOACBHAACPDgAgAT8AANcSADACAAAAOAAgPwAAjw4AIAIAAAD1CwAgPwAAjg4AIAOlBQEAuAoAIbkFQAC-CgAh9gUBALgKACEEFQAA5AsAIKUFAQC4CgAhuQVAAL4KACH2BQEAuAoAIQQVAADmCwAgpQUBAAAAAbkFQAAAAAH2BQEAAAABCqUFAQAAAAG5BUAAAAAB-wUAAAD7BQL8BQIAAAAB_QUCAAAAAf4FAgAAAAH_BQEAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABAgAAADQAIEYAAJwOACADAAAANAAgRgAAnA4AIEcAAJsOACABPwAA1hIAMA8TAACSCgAgogUAAJMKADCjBQAAMgAQpAUAAJMKADClBQEAAAABuQVAAPsIACH3BQEA-ggAIfsFAACUCvsFIvwFAgCFCQAh_QUCAIUJACH-BQIAhQkAIf8FAQD_CAAhgAYBAP8IACGBBgEA_wgAIYIGAQD_CAAhAgAAADQAID8AAJsOACACAAAAmQ4AID8AAJoOACAOogUAAJgOADCjBQAAmQ4AEKQFAACYDgAwpQUBAPoIACG5BUAA-wgAIfcFAQD6CAAh-wUAAJQK-wUi_AUCAIUJACH9BQIAhQkAIf4FAgCFCQAh_wUBAP8IACGABgEA_wgAIYEGAQD_CAAhggYBAP8IACEOogUAAJgOADCjBQAAmQ4AEKQFAACYDgAwpQUBAPoIACG5BUAA-wgAIfcFAQD6CAAh-wUAAJQK-wUi_AUCAIUJACH9BQIAhQkAIf4FAgCFCQAh_wUBAP8IACGABgEA_wgAIYEGAQD_CAAhggYBAP8IACEKpQUBALgKACG5BUAAvgoAIfsFAACCDPsFIvwFAgC9CgAh_QUCAL0KACH-BQIAvQoAIf8FAQC5CgAhgAYBALkKACGBBgEAuQoAIYIGAQC5CgAhCqUFAQC4CgAhuQVAAL4KACH7BQAAggz7BSL8BQIAvQoAIf0FAgC9CgAh_gUCAL0KACH_BQEAuQoAIYAGAQC5CgAhgQYBALkKACGCBgEAuQoAIQqlBQEAAAABuQVAAAAAAfsFAAAA-wUC_AUCAAAAAf0FAgAAAAH-BQIAAAAB_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAQ4JAAD5DQAgCwAA-g0AIBgAAPwNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAgAAAAHKBiAAAAABywYBAAAAAQIAAAAdACBGAACoDgAgAwAAAB0AIEYAAKgOACBHAACnDgAgAT8AANUSADATCQAA8wkAIAsAAKAKACAPAAChCgAgGAAAogoAIKIFAACfCgAwowUAABsAEKQFAACfCgAwpQUBAAAAAasFAQD_CAAhuQVAAPsIACHZBUAA-wgAIeQFAQD_CAAh9wUBAP8IACHGBgEA-ggAIccGAQD_CAAhyAYBAP8IACHJBgIAhQkAIcoGIACECQAhywYBAP8IACECAAAAHQAgPwAApw4AIAIAAAClDgAgPwAApg4AIA-iBQAApA4AMKMFAAClDgAQpAUAAKQOADClBQEA-ggAIasFAQD_CAAhuQVAAPsIACHZBUAA-wgAIeQFAQD_CAAh9wUBAP8IACHGBgEA-ggAIccGAQD_CAAhyAYBAP8IACHJBgIAhQkAIcoGIACECQAhywYBAP8IACEPogUAAKQOADCjBQAApQ4AEKQFAACkDgAwpQUBAPoIACGrBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHkBQEA_wgAIfcFAQD_CAAhxgYBAPoIACHHBgEA_wgAIcgGAQD_CAAhyQYCAIUJACHKBiAAhAkAIcsGAQD_CAAhC6UFAQC4CgAhqwUBALkKACG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHGBgEAuAoAIccGAQC5CgAhyAYBALkKACHJBgIAvQoAIcoGIAC7CgAhywYBALkKACEOCQAA9Q0AIAsAAPYNACAYAAD4DQAgpQUBALgKACGrBQEAuQoAIbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIcYGAQC4CgAhxwYBALkKACHIBgEAuQoAIckGAgC9CgAhygYgALsKACHLBgEAuQoAIQ4JAAD5DQAgCwAA-g0AIBgAAPwNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAgAAAAHKBiAAAAABywYBAAAAAQ0RAAC8DQAgpQUBAAAAAaoFAQAAAAGrBQEAAAABuQVAAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABAgAAAC8AIEYAALEOACADAAAALwAgRgAAsQ4AIEcAALAOACABPwAA1BIAMAIAAAAvACA_AACwDgAgAgAAAPMMACA_AACvDgAgDKUFAQC4CgAhqgUBALgKACGrBQEAuAoAIbkFQAC-CgAh_AUCAL0KACGlBgEAuAoAIaYGAQC4CgAhpwYBALkKACGoBoAAAAABqQYQAJkMACGqBhAAmQwAIasGEACZDAAhDREAALsNACClBQEAuAoAIaoFAQC4CgAhqwUBALgKACG5BUAAvgoAIfwFAgC9CgAhpQYBALgKACGmBgEAuAoAIacGAQC5CgAhqAaAAAAAAakGEACZDAAhqgYQAJkMACGrBhAAmQwAIQ0RAAC8DQAgpQUBAAAAAaoFAQAAAAGrBQEAAAABuQVAAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABCAkAAM0NACAOAADMDQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAfwFAgAAAAG8BgEAAAABAgAAACkAIEYAALoOACADAAAAKQAgRgAAug4AIEcAALkOACABPwAA0xIAMAIAAAApACA_AAC5DgAgAgAAAN4NACA_AAC4DgAgBqUFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh_AUCAL0KACG8BgEAuAoAIQgJAADKDQAgDgAAyQ0AIKUFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh_AUCAL0KACG8BgEAuAoAIQgJAADNDQAgDgAAzA0AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAH8BQIAAAABvAYBAAAAAQNGAADREgAggQcAANISACCHBwAATgAgBEYAALIOADCBBwAAsw4AMIMHAAC1DgAghwcAANoNADAERgAAqQ4AMIEHAACqDgAwgwcAAKwOACCHBwAA7wwAMARGAACdDgAwgQcAAJ4OADCDBwAAoA4AIIcHAAChDgAwBEYAAJEOADCBBwAAkg4AMIMHAACUDgAghwcAAJUOADAERgAAiA4AMIEHAACJDgAwgwcAAIsOACCHBwAA8QsAMAAAAAVGAADKEgAgRwAAzxIAIIEHAADLEgAgggcAAM4SACCHBwAAGQAgC0YAANMOADBHAADXDgAwgQcAANQOADCCBwAA1Q4AMIMHAADWDgAghAcAAKEOADCFBwAAoQ4AMIYHAAChDgAwhwcAAKEOADCIBwAA2A4AMIkHAACkDgAwC0YAAMcOADBHAADMDgAwgQcAAMgOADCCBwAAyQ4AMIMHAADKDgAghAcAAMsOADCFBwAAyw4AMIYHAADLDgAwhwcAAMsOADCIBwAAzQ4AMIkHAADODgAwDwoAAL4OACAQAAC8DgAgEgAAvQ4AIBQAAL8OACAWAADADgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAc0GAQAAAAHOBgEAAAABzwYQAAAAAdAGEAAAAAHRBhAAAAAB0gYCAAAAAQIAAAAlACBGAADSDgAgAwAAACUAIEYAANIOACBHAADRDgAgAT8AAM0SADAVCgAAiQoAIAsAAJwKACAQAADACQAgEgAAnQoAIBQAAJ4KACAWAACMCQAgogUAAJsKADCjBQAAIwAQpAUAAJsKADClBQEAAAABuQVAAPsIACHZBUAA-wgAIY8GIACECQAhzAYBAPoIACHNBgEAAAABzgYBAP8IACHPBhAAnwkAIdAGEACgCQAh0QYQAKAJACHSBgIAhQkAIfwGAACaCgAgAgAAACUAID8AANEOACACAAAAzw4AID8AANAOACAOogUAAM4OADCjBQAAzw4AEKQFAADODgAwpQUBAPoIACG5BUAA-wgAIdkFQAD7CAAhjwYgAIQJACHMBgEA-ggAIc0GAQD6CAAhzgYBAP8IACHPBhAAnwkAIdAGEACgCQAh0QYQAKAJACHSBgIAhQkAIQ6iBQAAzg4AMKMFAADPDgAQpAUAAM4OADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACGPBiAAhAkAIcwGAQD6CAAhzQYBAPoIACHOBgEA_wgAIc8GEACfCQAh0AYQAKAJACHRBhAAoAkAIdIGAgCFCQAhCqUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIY8GIAC7CgAhzQYBALgKACHOBgEAuQoAIc8GEACZDAAh0AYQAJoMACHRBhAAmgwAIdIGAgC9CgAhDwoAAIUOACAQAACDDgAgEgAAhA4AIBQAAIYOACAWAACHDgAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAhjwYgALsKACHNBgEAuAoAIc4GAQC5CgAhzwYQAJkMACHQBhAAmgwAIdEGEACaDAAh0gYCAL0KACEPCgAAvg4AIBAAALwOACASAAC9DgAgFAAAvw4AIBYAAMAOACClBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAABDgkAAPkNACAPAAD7DQAgGAAA_A0AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB9wUBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAgAAAAHKBiAAAAABAgAAAB0AIEYAANsOACADAAAAHQAgRgAA2w4AIEcAANoOACABPwAAzBIAMAIAAAAdACA_AADaDgAgAgAAAKUOACA_AADZDgAgC6UFAQC4CgAhqwUBALkKACG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACH3BQEAuQoAIcYGAQC4CgAhxwYBALkKACHIBgEAuQoAIckGAgC9CgAhygYgALsKACEOCQAA9Q0AIA8AAPcNACAYAAD4DQAgpQUBALgKACGrBQEAuQoAIbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIfcFAQC5CgAhxgYBALgKACHHBgEAuQoAIcgGAQC5CgAhyQYCAL0KACHKBiAAuwoAIQ4JAAD5DQAgDwAA-w0AIBgAAPwNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAQNGAADKEgAggQcAAMsSACCHBwAAGQAgBEYAANMOADCBBwAA1A4AMIMHAADWDgAghwcAAKEOADAERgAAxw4AMIEHAADIDgAwgwcAAMoOACCHBwAAyw4AMAAAAAAAB0YAALgSACBHAADIEgAggQcAALkSACCCBwAAxxIAIIUHAAARACCGBwAAEQAghwcAABUAIAtGAAC3DwAwRwAAvA8AMIEHAAC4DwAwggcAALkPADCDBwAAug8AIIQHAAC7DwAwhQcAALsPADCGBwAAuw8AMIcHAAC7DwAwiAcAAL0PADCJBwAAvg8AMAtGAACuDwAwRwAAsg8AMIEHAACvDwAwggcAALAPADCDBwAAsQ8AIIQHAAChDgAwhQcAAKEOADCGBwAAoQ4AMIcHAAChDgAwiAcAALMPADCJBwAApA4AMAtGAACiDwAwRwAApw8AMIEHAACjDwAwggcAAKQPADCDBwAApQ8AIIQHAACmDwAwhQcAAKYPADCGBwAApg8AMIcHAACmDwAwiAcAAKgPADCJBwAAqQ8AMAtGAACUDwAwRwAAmQ8AMIEHAACVDwAwggcAAJYPADCDBwAAlw8AIIQHAACYDwAwhQcAAJgPADCGBwAAmA8AMIcHAACYDwAwiAcAAJoPADCJBwAAmw8AMAtGAACIDwAwRwAAjQ8AMIEHAACJDwAwggcAAIoPADCDBwAAiw8AIIQHAACMDwAwhQcAAIwPADCGBwAAjA8AMIcHAACMDwAwiAcAAI4PADCJBwAAjw8AMAtGAAD_DgAwRwAAgw8AMIEHAACADwAwggcAAIEPADCDBwAAgg8AIIQHAAC1DAAwhQcAALUMADCGBwAAtQwAMIcHAAC1DAAwiAcAAIQPADCJBwAAuAwAMAtGAAD2DgAwRwAA-g4AMIEHAAD3DgAwggcAAPgOADCDBwAA-Q4AIIQHAACRDQAwhQcAAJENADCGBwAAkQ0AMIcHAACRDQAwiAcAAPsOADCJBwAAlA0AMAtGAADtDgAwRwAA8Q4AMIEHAADuDgAwggcAAO8OADCDBwAA8A4AIIQHAADaDQAwhQcAANoNADCGBwAA2g0AMIcHAADaDQAwiAcAAPIOADCJBwAA3Q0AMAgOAADMDQAgDwAAzg0AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAfcFAQAAAAH8BQIAAAABvAYBAAAAAQIAAAApACBGAAD1DgAgAwAAACkAIEYAAPUOACBHAAD0DgAgAT8AAMYSADACAAAAKQAgPwAA9A4AIAIAAADeDQAgPwAA8w4AIAalBQEAuAoAIbkFQAC-CgAh2QVAAL4KACH3BQEAuAoAIfwFAgC9CgAhvAYBALgKACEIDgAAyQ0AIA8AAMsNACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACH3BQEAuAoAIfwFAgC9CgAhvAYBALgKACEIDgAAzA0AIA8AAM4NACClBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAAB_AUCAAAAAbwGAQAAAAECBQAAkQwAIIMGAQAAAAECAAAADwAgRgAA_g4AIAMAAAAPACBGAAD-DgAgRwAA_Q4AIAE_AADFEgAwAgAAAA8AID8AAP0OACACAAAAlQ0AID8AAPwOACABgwYBALgKACECBQAAjwwAIIMGAQC4CgAhAgUAAJEMACCDBgEAAAABFgMAAMIKACARAADDCgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAECAAAAZAAgRgAAhw8AIAMAAABkACBGAACHDwAgRwAAhg8AIAE_AADEEgAwAgAAAGQAID8AAIYPACACAAAAuQwAID8AAIUPACAUpQUBALgKACGmBQEAuAoAIacFAQC5CgAhqAUBALkKACGpBQEAuQoAIaoFAQC5CgAhrAUIALoKACGtBQEAuQoAIa4FAQC5CgAhrwUBALkKACGwBQEAuQoAIbEFIAC7CgAhsgUgALsKACGzBUAAvAoAIbQFQAC8CgAhtQUCAL0KACG2BUAAvAoAIbcFAQC5CgAhuAWAAAAAAbkFQAC-CgAhFgMAAL8KACARAADACgAgpQUBALgKACGmBQEAuAoAIacFAQC5CgAhqAUBALkKACGpBQEAuQoAIaoFAQC5CgAhrAUIALoKACGtBQEAuQoAIa4FAQC5CgAhrwUBALkKACGwBQEAuQoAIbEFIAC7CgAhsgUgALsKACGzBUAAvAoAIbQFQAC8CgAhtQUCAL0KACG2BUAAvAoAIbcFAQC5CgAhuAWAAAAAAbkFQAC-CgAhFgMAAMIKACARAADDCgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEIAwAA0woAIKUFAQAAAAGoBQEAAAABqQUBAAAAAbAFAQAAAAHOBQEAAAABzwUBAAAAAdAFQAAAAAECAAAAXwAgRgAAkw8AIAMAAABfACBGAACTDwAgRwAAkg8AIAE_AADDEgAwDQMAANwJACAJAAD1CQAgogUAAPQJADCjBQAAXQAQpAUAAPQJADClBQEAAAABqAUBAP8IACGpBQEA_wgAIasFAQD6CAAhsAUBAP8IACHOBQEA_wgAIc8FAQD_CAAh0AVAAPsIACECAAAAXwAgPwAAkg8AIAIAAACQDwAgPwAAkQ8AIAuiBQAAjw8AMKMFAACQDwAQpAUAAI8PADClBQEA-ggAIagFAQD_CAAhqQUBAP8IACGrBQEA-ggAIbAFAQD_CAAhzgUBAP8IACHPBQEA_wgAIdAFQAD7CAAhC6IFAACPDwAwowUAAJAPABCkBQAAjw8AMKUFAQD6CAAhqAUBAP8IACGpBQEA_wgAIasFAQD6CAAhsAUBAP8IACHOBQEA_wgAIc8FAQD_CAAh0AVAAPsIACEHpQUBALgKACGoBQEAuQoAIakFAQC5CgAhsAUBALkKACHOBQEAuQoAIc8FAQC5CgAh0AVAAL4KACEIAwAA0QoAIKUFAQC4CgAhqAUBALkKACGpBQEAuQoAIbAFAQC5CgAhzgUBALkKACHPBQEAuQoAIdAFQAC-CgAhCAMAANMKACClBQEAAAABqAUBAAAAAakFAQAAAAGwBQEAAAABzgUBAAAAAc8FAQAAAAHQBUAAAAABAx0AAKEPACC5BUAAAAAB4wUBAAAAAQIAAABZACBGAACgDwAgAwAAAFkAIEYAAKAPACBHAACeDwAgAT8AAMISADAJCQAA9QkAIB0AAPgJACCiBQAA9wkAMKMFAABXABCkBQAA9wkAMKsFAQD6CAAhuQVAAPsIACHjBQEA-ggAIfcGAAD2CQAgAgAAAFkAID8AAJ4PACACAAAAnA8AID8AAJ0PACAGogUAAJsPADCjBQAAnA8AEKQFAACbDwAwqwUBAPoIACG5BUAA-wgAIeMFAQD6CAAhBqIFAACbDwAwowUAAJwPABCkBQAAmw8AMKsFAQD6CAAhuQVAAPsIACHjBQEA-ggAIQK5BUAAvgoAIeMFAQC4CgAhAx0AAJ8PACC5BUAAvgoAIeMFAQC4CgAhBUYAAL0SACBHAADAEgAggQcAAL4SACCCBwAAvxIAIIcHAADcAgAgAx0AAKEPACC5BUAAAAAB4wUBAAAAAQNGAAC9EgAggQcAAL4SACCHBwAA3AIAIBADAADtDQAgGwAA7w0AIKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAHhBSAAAAAB6wUBAAAAAb4GAgAAAAG_BgEAAAABwAYgAAAAAcEGAgAAAAHCBgIAAAABwwYBAAAAAcQGQAAAAAHFBgEAAAABAgAAAFMAIEYAAK0PACADAAAAUwAgRgAArQ8AIEcAAKwPACABPwAAvBIAMBYDAACLCQAgCQAA9QkAIBsAANwJACCiBQAAhwoAMKMFAABRABCkBQAAhwoAMKUFAQAAAAGoBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeEFIACECQAh6wUBAP8IACG-BgIAhQkAIb8GAQD_CAAhwAYgAIQJACHBBgIAhQkAIcIGAgCFCQAhwwYBAP8IACHEBkAAgwkAIcUGAQD_CAAh-AYAAIYKACACAAAAUwAgPwAArA8AIAIAAACqDwAgPwAAqw8AIBKiBQAAqQ8AMKMFAACqDwAQpAUAAKkPADClBQEA-ggAIagFAQD6CAAhqwUBAPoIACG5BUAA-wgAIdkFQAD7CAAh4QUgAIQJACHrBQEA_wgAIb4GAgCFCQAhvwYBAP8IACHABiAAhAkAIcEGAgCFCQAhwgYCAIUJACHDBgEA_wgAIcQGQACDCQAhxQYBAP8IACESogUAAKkPADCjBQAAqg8AEKQFAACpDwAwpQUBAPoIACGoBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIeEFIACECQAh6wUBAP8IACG-BgIAhQkAIb8GAQD_CAAhwAYgAIQJACHBBgIAhQkAIcIGAgCFCQAhwwYBAP8IACHEBkAAgwkAIcUGAQD_CAAhDqUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh4QUgALsKACHrBQEAuQoAIb4GAgC9CgAhvwYBALkKACHABiAAuwoAIcEGAgC9CgAhwgYCAL0KACHDBgEAuQoAIcQGQAC8CgAhxQYBALkKACEQAwAA6g0AIBsAAOwNACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeEFIAC7CgAh6wUBALkKACG-BgIAvQoAIb8GAQC5CgAhwAYgALsKACHBBgIAvQoAIcIGAgC9CgAhwwYBALkKACHEBkAAvAoAIcUGAQC5CgAhEAMAAO0NACAbAADvDQAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvgYCAAAAAb8GAQAAAAHABiAAAAABwQYCAAAAAcIGAgAAAAHDBgEAAAABxAZAAAAAAcUGAQAAAAEOCwAA-g0AIA8AAPsNACAYAAD8DQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGAQAAAAECAAAAHQAgRgAAtg8AIAMAAAAdACBGAAC2DwAgRwAAtQ8AIAE_AAC7EgAwAgAAAB0AID8AALUPACACAAAApQ4AID8AALQPACALpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACH3BQEAuQoAIcYGAQC4CgAhxwYBALkKACHIBgEAuQoAIckGAgC9CgAhygYgALsKACHLBgEAuQoAIQ4LAAD2DQAgDwAA9w0AIBgAAPgNACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIfcFAQC5CgAhxgYBALgKACHHBgEAuQoAIcgGAQC5CgAhyQYCAL0KACHKBiAAuwoAIcsGAQC5CgAhDgsAAPoNACAPAAD7DQAgGAAA_A0AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAH3BQEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYCAAAAAcoGIAAAAAHLBgEAAAABBwoAAN0OACAXAADeDgAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAECAAAATgAgRgAAwg8AIAMAAABOACBGAADCDwAgRwAAwQ8AIAE_AAC6EgAwDAkAAPUJACAKAACJCgAgFwAAigoAIKIFAACICgAwowUAACAAEKQFAACICgAwpQUBAAAAAasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIesFAQD6CAAhjwYgAIQJACECAAAATgAgPwAAwQ8AIAIAAAC_DwAgPwAAwA8AIAmiBQAAvg8AMKMFAAC_DwAQpAUAAL4PADClBQEA-ggAIasFAQD6CAAhuQVAAPsIACHZBUAA-wgAIesFAQD6CAAhjwYgAIQJACEJogUAAL4PADCjBQAAvw8AEKQFAAC-DwAwpQUBAPoIACGrBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHrBQEA-ggAIY8GIACECQAhBaUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIesFAQC4CgAhjwYgALsKACEHCgAAxQ4AIBcAAMYOACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHrBQEAuAoAIY8GIAC7CgAhBwoAAN0OACAXAADeDgAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAEDRgAAuBIAIIEHAAC5EgAghwcAABUAIARGAAC3DwAwgQcAALgPADCDBwAAug8AIIcHAAC7DwAwBEYAAK4PADCBBwAArw8AMIMHAACxDwAghwcAAKEOADAERgAAog8AMIEHAACjDwAwgwcAAKUPACCHBwAApg8AMARGAACUDwAwgQcAAJUPADCDBwAAlw8AIIcHAACYDwAwBEYAAIgPADCBBwAAiQ8AMIMHAACLDwAghwcAAIwPADAERgAA_w4AMIEHAACADwAwgwcAAIIPACCHBwAAtQwAMARGAAD2DgAwgQcAAPcOADCDBwAA-Q4AIIcHAACRDQAwBEYAAO0OADCBBwAA7g4AMIMHAADwDgAghwcAANoNADAAAAAFRgAAsxIAIEcAALYSACCBBwAAtBIAIIIHAAC1EgAghwcAABkAIANGAACzEgAggQcAALQSACCHBwAAGQAgAAAAC0YAANUPADBHAADZDwAwgQcAANYPADCCBwAA1w8AMIMHAADYDwAghAcAAJgPADCFBwAAmA8AMIYHAACYDwAwhwcAAJgPADCIBwAA2g8AMIkHAACbDwAwAwkAANAPACCrBQEAAAABuQVAAAAAAQIAAABZACBGAADdDwAgAwAAAFkAIEYAAN0PACBHAADcDwAgAT8AALISADACAAAAWQAgPwAA3A8AIAIAAACcDwAgPwAA2w8AIAKrBQEAuAoAIbkFQAC-CgAhAwkAAM8PACCrBQEAuAoAIbkFQAC-CgAhAwkAANAPACCrBQEAAAABuQVAAAAAAQRGAADVDwAwgQcAANYPADCDBwAA2A8AIIcHAACYDwAwAAAAAAAAB0YAAKkSACBHAACwEgAggQcAAKoSACCCBwAArxIAIIUHAAARACCGBwAAEQAghwcAABUAIAtGAACIEAAwRwAAjRAAMIEHAACJEAAwggcAAIoQADCDBwAAixAAIIQHAACMEAAwhQcAAIwQADCGBwAAjBAAMIcHAACMEAAwiAcAAI4QADCJBwAAjxAAMAtGAAD8DwAwRwAAgRAAMIEHAAD9DwAwggcAAP4PADCDBwAA_w8AIIQHAACAEAAwhQcAAIAQADCGBwAAgBAAMIcHAACAEAAwiAcAAIIQADCJBwAAgxAAMAtGAADzDwAwRwAA9w8AMIEHAAD0DwAwggcAAPUPADCDBwAA9g8AIIQHAAChDgAwhQcAAKEOADCGBwAAoQ4AMIcHAAChDgAwiAcAAPgPADCJBwAApA4AMAtGAADqDwAwRwAA7g8AMIEHAADrDwAwggcAAOwPADCDBwAA7Q8AIIQHAACFDQAwhQcAAIUNADCGBwAAhQ0AMIcHAACFDQAwiAcAAO8PADCJBwAAiA0AMAIFAACKDAAggwYBAAAAAQIAAABHACBGAADyDwAgAwAAAEcAIEYAAPIPACBHAADxDwAgAT8AAK4SADACAAAARwAgPwAA8Q8AIAIAAACJDQAgPwAA8A8AIAGDBgEAuAoAIQIFAACIDAAggwYBALgKACECBQAAigwAIIMGAQAAAAEOCQAA-Q0AIAsAAPoNACAPAAD7DQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGAQAAAAECAAAAHQAgRgAA-w8AIAMAAAAdACBGAAD7DwAgRwAA-g8AIAE_AACtEgAwAgAAAB0AID8AAPoPACACAAAApQ4AID8AAPkPACALpQUBALgKACGrBQEAuQoAIbkFQAC-CgAh2QVAAL4KACH3BQEAuQoAIcYGAQC4CgAhxwYBALkKACHIBgEAuQoAIckGAgC9CgAhygYgALsKACHLBgEAuQoAIQ4JAAD1DQAgCwAA9g0AIA8AAPcNACClBQEAuAoAIasFAQC5CgAhuQVAAL4KACHZBUAAvgoAIfcFAQC5CgAhxgYBALgKACHHBgEAuQoAIcgGAQC5CgAhyQYCAL0KACHKBiAAuwoAIcsGAQC5CgAhDgkAAPkNACALAAD6DQAgDwAA-w0AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYCAAAAAcoGIAAAAAHLBgEAAAABHwoAAMUPACAQAADLDwAgGgAAxA8AIBwAAMYPACAeAADHDwAgHwAAyA8AICAAAMkPACAhAADKDwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeYFAQAAAAHqBQEAAAAB6wUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAHTBgEAAAAB1AYBAAAAAdUGAgAAAAHWBiAAAAAB1wYgAAAAAdgGIAAAAAECAAAAGQAgRgAAhxAAIAMAAAAZACBGAACHEAAgRwAAhhAAIAE_AACsEgAwJAoAAIkKACAQAADACQAgGAAAogoAIBoAAKQKACAcAAD_CQAgHgAAyQkAIB8AAIIKACAgAACECgAgIQAAogkAIKIFAACjCgAwowUAABcAEKQFAACjCgAwpQUBAAAAAbgFAACGCQAguQVAAPsIACHZBUAA-wgAIeQFAQD_CAAh5gUBAAAAAeoFAQD_CAAh6wUBAPoIACHyBQEA_wgAIfMFAQD_CAAh9AUBAP8IACGPBiAAhAkAIc0GAQAAAAHOBgEA_wgAIc8GEACgCQAh0AYQAKAJACHRBhAAoAkAIdIGAgChCQAh0wYBAP8IACHUBgEA_wgAIdUGAgCFCQAh1gYgAIQJACHXBiAAhAkAIdgGIACECQAhAgAAABkAID8AAIYQACACAAAAhBAAID8AAIUQACAbogUAAIMQADCjBQAAhBAAEKQFAACDEAAwpQUBAPoIACG4BQAAhgkAILkFQAD7CAAh2QVAAPsIACHkBQEA_wgAIeYFAQD6CAAh6gUBAP8IACHrBQEA-ggAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhzQYBAP8IACHOBgEA_wgAIc8GEACgCQAh0AYQAKAJACHRBhAAoAkAIdIGAgChCQAh0wYBAP8IACHUBgEA_wgAIdUGAgCFCQAh1gYgAIQJACHXBiAAhAkAIdgGIACECQAhG6IFAACDEAAwowUAAIQQABCkBQAAgxAAMKUFAQD6CAAhuAUAAIYJACC5BUAA-wgAIdkFQAD7CAAh5AUBAP8IACHmBQEA-ggAIeoFAQD_CAAh6wUBAPoIACHyBQEA_wgAIfMFAQD_CAAh9AUBAP8IACGPBiAAhAkAIc0GAQD_CAAhzgYBAP8IACHPBhAAoAkAIdAGEACgCQAh0QYQAKAJACHSBgIAoQkAIdMGAQD_CAAh1AYBAP8IACHVBgIAhQkAIdYGIACECQAh1wYgAIQJACHYBiAAhAkAIRelBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACEfCgAA5g4AIBAAAOwOACAaAADlDgAgHAAA5w4AIB4AAOgOACAfAADpDgAgIAAA6g4AICEAAOsOACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACEfCgAAxQ8AIBAAAMsPACAaAADEDwAgHAAAxg8AIB4AAMcPACAfAADIDwAgIAAAyQ8AICEAAMoPACClBQEAAAABuAWAAAAAAbkFQAAAAAHZBUAAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAc0GAQAAAAHOBgEAAAABzwYQAAAAAdAGEAAAAAHRBhAAAAAB0gYCAAAAAdMGAQAAAAHUBgEAAAAB1QYCAAAAAdYGIAAAAAHXBiAAAAAB2AYgAAAAARAHAACUEAAgCAAAlRAAIAoAAJYQACAZAACXEAAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAckGAgAAAAHZBgEAAAABAgAAABUAIEYAAJMQACADAAAAFQAgRgAAkxAAIEcAAJIQACABPwAAqxIAMBYGAACiCgAgBwAApwoAIAgAAKgKACAKAACJCgAgGQAAowkAIKIFAACmCgAwowUAABEAEKQFAACmCgAwpQUBAAAAAbkFQAD7CAAh2QVAAPsIACHiBQEA_wgAIeUFAQD6CAAh5gUBAAAAAeoFAQD_CAAh8gUBAP8IACHzBQEA_wgAIfQFAQD_CAAhjwYgAIQJACHJBgIAhQkAIdkGAQD_CAAh_QYAAKUKACACAAAAFQAgPwAAkhAAIAIAAACQEAAgPwAAkRAAIBCiBQAAjxAAMKMFAACQEAAQpAUAAI8QADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHiBQEA_wgAIeUFAQD6CAAh5gUBAPoIACHqBQEA_wgAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhyQYCAIUJACHZBgEA_wgAIRCiBQAAjxAAMKMFAACQEAAQpAUAAI8QADClBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHiBQEA_wgAIeUFAQD6CAAh5gUBAPoIACHqBQEA_wgAIfIFAQD_CAAh8wUBAP8IACH0BQEA_wgAIY8GIACECQAhyQYCAIUJACHZBgEA_wgAIQylBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIckGAgC9CgAh2QYBALkKACEQBwAA5g8AIAgAAOcPACAKAADoDwAgGQAA6Q8AIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhyQYCAL0KACHZBgEAuQoAIRAHAACUEAAgCAAAlRAAIAoAAJYQACAZAACXEAAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAckGAgAAAAHZBgEAAAABBEYAAIgQADCBBwAAiRAAMIMHAACLEAAghwcAAIwQADAERgAA_A8AMIEHAAD9DwAwgwcAAP8PACCHBwAAgBAAMARGAADzDwAwgQcAAPQPADCDBwAA9g8AIIcHAAChDgAwBEYAAOoPADCBBwAA6w8AMIMHAADtDwAghwcAAIUNADADRgAAqRIAIIEHAACqEgAghwcAABUAIAAAAAVGAACjEgAgRwAApxIAIIEHAACkEgAgggcAAKYSACCHBwAAAQAgC0YAAJ4QADBHAACiEAAwgQcAAJ8QADCCBwAAoBAAMIMHAAChEAAghAcAAKIMADCFBwAAogwAMIYHAACiDAAwhwcAAKIMADCIBwAAoxAAMIkHAAClDAAwHQMAAPoMACAFAADDDQAgDAAA_AwAICAAAIANACAkAAD9DAAgJQAA_gwAICgAAP8MACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGDBgEAAAABqwYQAAAAAawGAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAACmEAAgAwAAAAkAIEYAAKYQACBHAAClEAAgAT8AAKUSADACAAAACQAgPwAApRAAIAIAAACmDAAgPwAApBAAIBalBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa4GgAAAAAGvBgEAuQoAIbAGAQC5CgAhsQYQAJkMACGyBhAAmQwAIbMGEACZDAAhtAYQAJkMACG1BgEAuQoAIbYGQAC-CgAhtwZAALwKACG4BkAAvAoAIbkGQAC8CgAhugZAALwKACG7BkAAvAoAIR0DAACqDAAgBQAAwg0AIAwAAKwMACAgAACwDAAgJAAArQwAICUAAK4MACAoAACvDAAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYi2QVAAL4KACGDBgEAuQoAIasGEACZDAAhrAYBALgKACGuBoAAAAABrwYBALkKACGwBgEAuQoAIbEGEACZDAAhsgYQAJkMACGzBhAAmQwAIbQGEACZDAAhtQYBALkKACG2BkAAvgoAIbcGQAC8CgAhuAZAALwKACG5BkAAvAoAIboGQAC8CgAhuwZAALwKACEdAwAA-gwAIAUAAMMNACAMAAD8DAAgIAAAgA0AICQAAP0MACAlAAD-DAAgKAAA_wwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABA0YAAKMSACCBBwAApBIAIIcHAAABACAERgAAnhAAMIEHAACfEAAwgwcAAKEQACCHBwAAogwAMAAAAAVGAACeEgAgRwAAoRIAIIEHAACfEgAgggcAAKASACCHBwAAAQAgA0YAAJ4SACCBBwAAnxIAIIcHAAABACAAAAAFRgAAmRIAIEcAAJwSACCBBwAAmhIAIIIHAACbEgAghwcAAAEAIANGAACZEgAggQcAAJoSACCHBwAAAQAgAAAABUYAAJQSACBHAACXEgAggQcAAJUSACCCBwAAlhIAIIcHAAABACADRgAAlBIAIIEHAACVEgAghwcAAAEAIAAAAAGEBwAAAPEGAgtGAADJEQAwRwAAzhEAMIEHAADKEQAwggcAAMsRADCDBwAAzBEAIIQHAADNEQAwhQcAAM0RADCGBwAAzREAMIcHAADNEQAwiAcAAM8RADCJBwAA0BEAMAtGAAC9EQAwRwAAwhEAMIEHAAC-EQAwggcAAL8RADCDBwAAwBEAIIQHAADBEQAwhQcAAMERADCGBwAAwREAMIcHAADBEQAwiAcAAMMRADCJBwAAxBEAMAtGAACxEQAwRwAAthEAMIEHAACyEQAwggcAALMRADCDBwAAtBEAIIQHAAC1EQAwhQcAALURADCGBwAAtREAMIcHAAC1EQAwiAcAALcRADCJBwAAuBEAMAdGAACsEQAgRwAArxEAIIEHAACtEQAgggcAAK4RACCFBwAAlgEAIIYHAACWAQAghwcAAJYCACALRgAAoxEAMEcAAKcRADCBBwAApBEAMIIHAAClEQAwgwcAAKYRACCEBwAApg8AMIUHAACmDwAwhgcAAKYPADCHBwAApg8AMIgHAACoEQAwiQcAAKkPADALRgAAmhEAMEcAAJ4RADCBBwAAmxEAMIIHAACcEQAwgwcAAJ0RACCEBwAAogwAMIUHAACiDAAwhgcAAKIMADCHBwAAogwAMIgHAACfEQAwiQcAAKUMADAHRgAAlREAIEcAAJgRACCBBwAAlhEAIIIHAACXEQAghQcAAJoBACCGBwAAmgEAIIcHAACFBAAgC0YAAIwRADBHAACQEQAwgQcAAI0RADCCBwAAjhEAMIMHAACPEQAghAcAAOcKADCFBwAA5woAMIYHAADnCgAwhwcAAOcKADCIBwAAkREAMIkHAADqCgAwC0YAAIARADBHAACFEQAwgQcAAIERADCCBwAAghEAMIMHAACDEQAghAcAAIQRADCFBwAAhBEAMIYHAACEEQAwhwcAAIQRADCIBwAAhhEAMIkHAACHEQAwC0YAAPcQADBHAAD7EAAwgQcAAPgQADCCBwAA-RAAMIMHAAD6EAAghAcAAKYPADCFBwAApg8AMIYHAACmDwAwhwcAAKYPADCIBwAA_BAAMIkHAACpDwAwC0YAAO4QADBHAADyEAAwgQcAAO8QADCCBwAA8BAAMIMHAADxEAAghAcAAIwPADCFBwAAjA8AMIYHAACMDwAwhwcAAIwPADCIBwAA8xAAMIkHAACPDwAwC0YAAOIQADBHAADnEAAwgQcAAOMQADCCBwAA5BAAMIMHAADlEAAghAcAAOYQADCFBwAA5hAAMIYHAADmEAAwhwcAAOYQADCIBwAA6BAAMIkHAADpEAAwC0YAANkQADBHAADdEAAwgQcAANoQADCCBwAA2xAAMIMHAADcEAAghAcAAPwKADCFBwAA_AoAMIYHAAD8CgAwhwcAAPwKADCIBwAA3hAAMIkHAAD_CgAwC0YAANAQADBHAADUEAAwgQcAANEQADCCBwAA0hAAMIMHAADTEAAghAcAALUMADCFBwAAtQwAMIYHAAC1DAAwhwcAALUMADCIBwAA1RAAMIkHAAC4DAAwB0YAAMsQACBHAADOEAAggQcAAMwQACCCBwAAzRAAIIUHAADGAQAghgcAAMYBACCHBwAAlQYAIAcMAAD6CwAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAfgFIAAAAAH5BQEAAAABAgAAAJUGACBGAADLEAAgAwAAAMYBACBGAADLEAAgRwAAzxAAIAkAAADGAQAgDAAA7AsAID8AAM8QACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIfgFIAC7CgAh-QUBALkKACEHDAAA7AsAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh-AUgALsKACH5BQEAuQoAIRYJAADECgAgEQAAwwoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABAgAAAGQAIEYAANgQACADAAAAZAAgRgAA2BAAIEcAANcQACABPwAAkxIAMAIAAABkACA_AADXEAAgAgAAALkMACA_AADWEAAgFKUFAQC4CgAhpgUBALgKACGnBQEAuQoAIakFAQC5CgAhqgUBALkKACGrBQEAuQoAIawFCAC6CgAhrQUBALkKACGuBQEAuQoAIa8FAQC5CgAhsAUBALkKACGxBSAAuwoAIbIFIAC7CgAhswVAALwKACG0BUAAvAoAIbUFAgC9CgAhtgVAALwKACG3BQEAuQoAIbgFgAAAAAG5BUAAvgoAIRYJAADBCgAgEQAAwAoAIKUFAQC4CgAhpgUBALgKACGnBQEAuQoAIakFAQC5CgAhqgUBALkKACGrBQEAuQoAIawFCAC6CgAhrQUBALkKACGuBQEAuQoAIa8FAQC5CgAhsAUBALkKACGxBSAAuwoAIbIFIAC7CgAhswVAALwKACG0BUAAvAoAIbUFAgC9CgAhtgVAALwKACG3BQEAuQoAIbgFgAAAAAG5BUAAvgoAIRYJAADECgAgEQAAwwoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABDAYAAIcLACA1AACECwAgOAAAhgsAIKUFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQIAAACvAQAgRgAA4RAAIAMAAACvAQAgRgAA4RAAIEcAAOAQACABPwAAkhIAMAIAAACvAQAgPwAA4BAAIAIAAACACwAgPwAA3xAAIAmlBQEAuAoAIbkFQAC-CgAh1QUBALgKACHZBUAAvgoAId4FAQC4CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAh4gUBALkKACEMBgAA9goAIDUAAPQKACA4AAD3CgAgpQUBALgKACG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHeBQEAuAoAId8FAQC5CgAh4AUBALkKACHhBSAAuwoAIeIFAQC5CgAhDAYAAIcLACA1AACECwAgOAAAhgsAIKUFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQalBQEAAAABqQUBAAAAAbkFQAAAAAHLBQEAAAABzAUCAAAAAc0FgAAAAAECAAAAqgEAIEYAAO0QACADAAAAqgEAIEYAAO0QACBHAADsEAAgAT8AAJESADALAwAA3AkAIKIFAADeCQAwowUAAKgBABCkBQAA3gkAMKUFAQAAAAGoBQEA_wgAIakFAQD_CAAhuQVAAPsIACHLBQEA-ggAIcwFAgChCQAhzQUAAIYJACACAAAAqgEAID8AAOwQACACAAAA6hAAID8AAOsQACAKogUAAOkQADCjBQAA6hAAEKQFAADpEAAwpQUBAPoIACGoBQEA_wgAIakFAQD_CAAhuQVAAPsIACHLBQEA-ggAIcwFAgChCQAhzQUAAIYJACAKogUAAOkQADCjBQAA6hAAEKQFAADpEAAwpQUBAPoIACGoBQEA_wgAIakFAQD_CAAhuQVAAPsIACHLBQEA-ggAIcwFAgChCQAhzQUAAIYJACAGpQUBALgKACGpBQEAuQoAIbkFQAC-CgAhywUBALgKACHMBQIAygoAIc0FgAAAAAEGpQUBALgKACGpBQEAuQoAIbkFQAC-CgAhywUBALgKACHMBQIAygoAIc0FgAAAAAEGpQUBAAAAAakFAQAAAAG5BUAAAAABywUBAAAAAcwFAgAAAAHNBYAAAAABCAkAANIKACClBQEAAAABqQUBAAAAAasFAQAAAAGwBQEAAAABzgUBAAAAAc8FAQAAAAHQBUAAAAABAgAAAF8AIEYAAPYQACADAAAAXwAgRgAA9hAAIEcAAPUQACABPwAAkBIAMAIAAABfACA_AAD1EAAgAgAAAJAPACA_AAD0EAAgB6UFAQC4CgAhqQUBALkKACGrBQEAuAoAIbAFAQC5CgAhzgUBALkKACHPBQEAuQoAIdAFQAC-CgAhCAkAANAKACClBQEAuAoAIakFAQC5CgAhqwUBALgKACGwBQEAuQoAIc4FAQC5CgAhzwUBALkKACHQBUAAvgoAIQgJAADSCgAgpQUBAAAAAakFAQAAAAGrBQEAAAABsAUBAAAAAc4FAQAAAAHPBQEAAAAB0AVAAAAAARADAADtDQAgCQAA7g0AIKUFAQAAAAGoBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB4QUgAAAAAesFAQAAAAG-BgIAAAABvwYBAAAAAcAGIAAAAAHBBgIAAAABwgYCAAAAAcMGAQAAAAHEBkAAAAABAgAAAFMAIEYAAP8QACADAAAAUwAgRgAA_xAAIEcAAP4QACABPwAAjxIAMAIAAABTACA_AAD-EAAgAgAAAKoPACA_AAD9EAAgDqUFAQC4CgAhqAUBALgKACGrBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHhBSAAuwoAIesFAQC5CgAhvgYCAL0KACG_BgEAuQoAIcAGIAC7CgAhwQYCAL0KACHCBgIAvQoAIcMGAQC5CgAhxAZAALwKACEQAwAA6g0AIAkAAOsNACClBQEAuAoAIagFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh4QUgALsKACHrBQEAuQoAIb4GAgC9CgAhvwYBALkKACHABiAAuwoAIcEGAgC9CgAhwgYCAL0KACHDBgEAuQoAIcQGQAC8CgAhEAMAAO0NACAJAADuDQAgpQUBAAAAAagFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHhBSAAAAAB6wUBAAAAAb4GAgAAAAG_BgEAAAABwAYgAAAAAcEGAgAAAAHCBgIAAAABwwYBAAAAAcQGQAAAAAEHLgAA8AoAIKUFAQAAAAG5BUAAAAAB2AUAAADdBQLZBUAAAAAB2wUBAAAAAd0FAQAAAAECAAAApAEAIEYAAIsRACADAAAApAEAIEYAAIsRACBHAACKEQAgAT8AAI4SADAMLQAAiwkAIC4AAOEJACCiBQAA3wkAMKMFAACiAQAQpAUAAN8JADClBQEAAAABuQVAAPsIACHYBQAA4AndBSLZBUAA-wgAIdoFAQD6CAAh2wUBAPoIACHdBQEA_wgAIQIAAACkAQAgPwAAihEAIAIAAACIEQAgPwAAiREAIAqiBQAAhxEAMKMFAACIEQAQpAUAAIcRADClBQEA-ggAIbkFQAD7CAAh2AUAAOAJ3QUi2QVAAPsIACHaBQEA-ggAIdsFAQD6CAAh3QUBAP8IACEKogUAAIcRADCjBQAAiBEAEKQFAACHEQAwpQUBAPoIACG5BUAA-wgAIdgFAADgCd0FItkFQAD7CAAh2gUBAPoIACHbBQEA-ggAId0FAQD_CAAhBqUFAQC4CgAhuQVAAL4KACHYBQAA4ArdBSLZBUAAvgoAIdsFAQC4CgAh3QUBALkKACEHLgAA4goAIKUFAQC4CgAhuQVAAL4KACHYBQAA4ArdBSLZBUAAvgoAIdsFAQC4CgAh3QUBALkKACEHLgAA8AoAIKUFAQAAAAG5BUAAAAAB2AUAAADdBQLZBUAAAAAB2wUBAAAAAd0FAQAAAAEJLwAA2woAIKUFAQAAAAG5BUAAAAAB0QUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAECAAAAngEAIEYAAJQRACADAAAAngEAIEYAAJQRACBHAACTEQAgAT8AAI0SADACAAAAngEAID8AAJMRACACAAAA6woAID8AAJIRACAIpQUBALgKACG5BUAAvgoAIdEFAQC4CgAh1AUAANcK1AUi1QUBALgKACHWBYAAAAAB2AUAANgK2AUi2QVAAL4KACEJLwAA2QoAIKUFAQC4CgAhuQVAAL4KACHRBQEAuAoAIdQFAADXCtQFItUFAQC4CgAh1gWAAAAAAdgFAADYCtgFItkFQAC-CgAhCS8AANsKACClBQEAAAABuQVAAAAAAdEFAQAAAAHUBQAAANQFAtUFAQAAAAHWBYAAAAAB2AUAAADYBQLZBUAAAAABBQwAAOMNACClBQEAAAABuQVAAAAAAdkFQAAAAAG9BhAAAAABAgAAAIUEACBGAACVEQAgAwAAAJoBACBGAACVEQAgRwAAmREAIAcAAACaAQAgDAAA1Q0AID8AAJkRACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACG9BhAAmQwAIQUMAADVDQAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAhvQYQAJkMACEdBAAA-wwAIAUAAMMNACAMAAD8DAAgIAAAgA0AICQAAP0MACAlAAD-DAAgKAAA_wwAIKUFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAgAAAAkAIEYAAKIRACADAAAACQAgRgAAohEAIEcAAKERACABPwAAjBIAMAIAAAAJACA_AAChEQAgAgAAAKYMACA_AACgEQAgFqUFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhHQQAAKsMACAFAADCDQAgDAAArAwAICAAALAMACAkAACtDAAgJQAArgwAICgAAK8MACClBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYi2QVAAL4KACGDBgEAuQoAIasGEACZDAAhrAYBALgKACGtBgEAuAoAIa4GgAAAAAGvBgEAuQoAIbAGAQC5CgAhsQYQAJkMACGyBhAAmQwAIbMGEACZDAAhtAYQAJkMACG1BgEAuQoAIbYGQAC-CgAhtwZAALwKACG4BkAAvAoAIbkGQAC8CgAhugZAALwKACG7BkAAvAoAIR0EAAD7DAAgBQAAww0AIAwAAPwMACAgAACADQAgJAAA_QwAICUAAP4MACAoAAD_DAAgpQUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGDBgEAAAABqwYQAAAAAawGAQAAAAGtBgEAAAABrgaAAAAAAa8GAQAAAAGwBgEAAAABsQYQAAAAAbIGEAAAAAGzBhAAAAABtAYQAAAAAbUGAQAAAAG2BkAAAAABtwZAAAAAAbgGQAAAAAG5BkAAAAABugZAAAAAAbsGQAAAAAEQCQAA7g0AIBsAAO8NACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB4QUgAAAAAesFAQAAAAG-BgIAAAABvwYBAAAAAcAGIAAAAAHBBgIAAAABwgYCAAAAAcMGAQAAAAHEBkAAAAABxQYBAAAAAQIAAABTACBGAACrEQAgAwAAAFMAIEYAAKsRACBHAACqEQAgAT8AAIsSADACAAAAUwAgPwAAqhEAIAIAAACqDwAgPwAAqREAIA6lBQEAuAoAIasFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeEFIAC7CgAh6wUBALkKACG-BgIAvQoAIb8GAQC5CgAhwAYgALsKACHBBgIAvQoAIcIGAgC9CgAhwwYBALkKACHEBkAAvAoAIcUGAQC5CgAhEAkAAOsNACAbAADsDQAgpQUBALgKACGrBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHhBSAAuwoAIesFAQC5CgAhvgYCAL0KACG_BgEAuQoAIcAGIAC7CgAhwQYCAL0KACHCBgIAvQoAIcMGAQC5CgAhxAZAALwKACHFBgEAuQoAIRAJAADuDQAgGwAA7w0AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHhBSAAAAAB6wUBAAAAAb4GAgAAAAG_BgEAAAABwAYgAAAAAcEGAgAAAAHCBgIAAAABwwYBAAAAAcQGQAAAAAHFBgEAAAABBKUFAQAAAAG5BUAAAAAB2QVAAAAAAeMGAQAAAAECAAAAlgIAIEYAAKwRACADAAAAlgEAIEYAAKwRACBHAACwEQAgBgAAAJYBACA_AACwEQAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4wYBALgKACEEpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4wYBALgKACELpQUBAAAAAbkFQAAAAAHZBUAAAAAB5AYBAAAAAeUGAQAAAAHmBgEAAAAB5wYBAAAAAegGQAAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAECAAAAlAEAIEYAALwRACADAAAAlAEAIEYAALwRACBHAAC7EQAgAT8AAIoSADARAwAAiwkAIKIFAADnCQAwowUAAJIBABCkBQAA5wkAMKUFAQAAAAGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHkBgEA-ggAIeUGAQD6CAAh5gYBAP8IACHnBgEA_wgAIegGQACDCQAh6QYBAP8IACHqBgEA_wgAIesGAQD_CAAh9gYAAOYJACACAAAAlAEAID8AALsRACACAAAAuREAID8AALoRACAPogUAALgRADCjBQAAuREAEKQFAAC4EQAwpQUBAPoIACGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHkBgEA-ggAIeUGAQD6CAAh5gYBAP8IACHnBgEA_wgAIegGQACDCQAh6QYBAP8IACHqBgEA_wgAIesGAQD_CAAhD6IFAAC4EQAwowUAALkRABCkBQAAuBEAMKUFAQD6CAAhqAUBAPoIACG5BUAA-wgAIdkFQAD7CAAh5AYBAPoIACHlBgEA-ggAIeYGAQD_CAAh5wYBAP8IACHoBkAAgwkAIekGAQD_CAAh6gYBAP8IACHrBgEA_wgAIQulBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHkBgEAuAoAIeUGAQC4CgAh5gYBALkKACHnBgEAuQoAIegGQAC8CgAh6QYBALkKACHqBgEAuQoAIesGAQC5CgAhC6UFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeQGAQC4CgAh5QYBALgKACHmBgEAuQoAIecGAQC5CgAh6AZAALwKACHpBgEAuQoAIeoGAQC5CgAh6wYBALkKACELpQUBAAAAAbkFQAAAAAHZBUAAAAAB5AYBAAAAAeUGAQAAAAHmBgEAAAAB5wYBAAAAAegGQAAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAEHpQUBAAAAAa8FAQAAAAGwBQEAAAABuQVAAAAAAdkFQAAAAAHoBkAAAAAB7AYBAAAAAQIAAACQAQAgRgAAyBEAIAMAAACQAQAgRgAAyBEAIEcAAMcRACABPwAAiRIAMAwDAACLCQAgogUAAOgJADCjBQAAjgEAEKQFAADoCQAwpQUBAAAAAagFAQD6CAAhrwUBAP8IACGwBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHoBkAA-wgAIewGAQAAAAECAAAAkAEAID8AAMcRACACAAAAxREAID8AAMYRACALogUAAMQRADCjBQAAxREAEKQFAADEEQAwpQUBAPoIACGoBQEA-ggAIa8FAQD_CAAhsAUBAP8IACG5BUAA-wgAIdkFQAD7CAAh6AZAAPsIACHsBgEA-ggAIQuiBQAAxBEAMKMFAADFEQAQpAUAAMQRADClBQEA-ggAIagFAQD6CAAhrwUBAP8IACGwBQEA_wgAIbkFQAD7CAAh2QVAAPsIACHoBkAA-wgAIewGAQD6CAAhB6UFAQC4CgAhrwUBALkKACGwBQEAuQoAIbkFQAC-CgAh2QVAAL4KACHoBkAAvgoAIewGAQC4CgAhB6UFAQC4CgAhrwUBALkKACGwBQEAuQoAIbkFQAC-CgAh2QVAAL4KACHoBkAAvgoAIewGAQC4CgAhB6UFAQAAAAGvBQEAAAABsAUBAAAAAbkFQAAAAAHZBUAAAAAB6AZAAAAAAewGAQAAAAENIwAAqBAAIKUFAQAAAAG5BUAAAAAB2QVAAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAeAGAQAAAAHhBgEAAAAB4gYgAAAAAQIAAAAFACBGAADUEQAgAwAAAAUAIEYAANQRACBHAADTEQAgAT8AAIgSADASAwAAiwkAICMAAKQJACCiBQAAsQoAMKMFAAADABCkBQAAsQoAMKUFAQAAAAGoBQEA-ggAIbkFQAD7CAAh2QVAAPsIACHaBgEA_wgAIdsGAQD_CAAh3AYBAP8IACHdBgEA-ggAId4GAQD6CAAh3wYBAP8IACHgBgEA_wgAIeEGAQD6CAAh4gYgAIQJACECAAAABQAgPwAA0xEAIAIAAADREQAgPwAA0hEAIBCiBQAA0BEAMKMFAADREQAQpAUAANARADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHZBUAA-wgAIdoGAQD_CAAh2wYBAP8IACHcBgEA_wgAId0GAQD6CAAh3gYBAPoIACHfBgEA_wgAIeAGAQD_CAAh4QYBAPoIACHiBiAAhAkAIRCiBQAA0BEAMKMFAADREQAQpAUAANARADClBQEA-ggAIagFAQD6CAAhuQVAAPsIACHZBUAA-wgAIdoGAQD_CAAh2wYBAP8IACHcBgEA_wgAId0GAQD6CAAh3gYBAPoIACHfBgEA_wgAIeAGAQD_CAAh4QYBAPoIACHiBiAAhAkAIQylBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHaBgEAuQoAIdsGAQC5CgAh3AYBALkKACHdBgEAuAoAId4GAQC4CgAh3wYBALkKACHgBgEAuQoAIeEGAQC4CgAh4gYgALsKACENIwAAnRAAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIdoGAQC5CgAh2wYBALkKACHcBgEAuQoAId0GAQC4CgAh3gYBALgKACHfBgEAuQoAIeAGAQC5CgAh4QYBALgKACHiBiAAuwoAIQ0jAACoEAAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAAB3QYBAAAAAd4GAQAAAAHfBgEAAAAB4AYBAAAAAeEGAQAAAAHiBiAAAAABBEYAAMkRADCBBwAAyhEAMIMHAADMEQAghwcAAM0RADAERgAAvREAMIEHAAC-EQAwgwcAAMARACCHBwAAwREAMARGAACxEQAwgQcAALIRADCDBwAAtBEAIIcHAAC1EQAwA0YAAKwRACCBBwAArREAIIcHAACWAgAgBEYAAKMRADCBBwAApBEAMIMHAACmEQAghwcAAKYPADAERgAAmhEAMIEHAACbEQAwgwcAAJ0RACCHBwAAogwAMANGAACVEQAggQcAAJYRACCHBwAAhQQAIARGAACMEQAwgQcAAI0RADCDBwAAjxEAIIcHAADnCgAwBEYAAIARADCBBwAAgREAMIMHAACDEQAghwcAAIQRADAERgAA9xAAMIEHAAD4EAAwgwcAAPoQACCHBwAApg8AMARGAADuEAAwgQcAAO8QADCDBwAA8RAAIIcHAACMDwAwBEYAAOIQADCBBwAA4xAAMIMHAADlEAAghwcAAOYQADAERgAA2RAAMIEHAADaEAAwgwcAANwQACCHBwAA_AoAMARGAADQEAAwgQcAANEQADCDBwAA0xAAIIcHAAC1DAAwA0YAAMsQACCBBwAAzBAAIIcHAACVBgAgAAAAAQMAAPsLACAAAgMAAPsLACAMAADkDQAgAAAAAAADAwAA-wsAIAwAAPwLACD5BQAAsgoAIAseAACnCwAgIgAAuQsAIDcAAOALACC4BQAAsgoAIOwFAACyCgAg7QUAALIKACDuBQAAsgoAIO8FAACyCgAg8gUAALIKACDzBQAAsgoAIPQFAACyCgAgATYAAKcLACACNgAAuQsAIOoFAACyCgAgCAMAAPsLACAGAADzEQAgNQAA8BEAIDgAAOALACCoBQAAsgoAIN8FAACyCgAg4AUAALIKACDiBQAAsgoAIAMtAAD7CwAgLgAA6hEAIN0FAACyCgAgBxEAAKYNACAnAAD2EQAguAUAALIKACCeBgAAsgoAIJ8GAACyCgAgoAYAALIKACChBgAAsgoAIAAXCgAA-REAIBAAAOQNACAYAAD8EQAgGgAAgRIAIBwAAOgRACAeAADfDwAgHwAA7BEAICAAAO4RACAhAACcDQAguAUAALIKACDkBQAAsgoAIOoFAACyCgAg8gUAALIKACDzBQAAsgoAIPQFAACyCgAgzQYAALIKACDOBgAAsgoAIM8GAACyCgAg0AYAALIKACDRBgAAsgoAINIGAACyCgAg0wYAALIKACDUBgAAsgoAIAEIAADfDwAgAAAICAAAnA0AICIAAJ0NACAjAACeDQAg6gUAALIKACCIBgAAsgoAIIkGAACyCgAgigYAALIKACCMBgAAsgoAIAsGAAD8EQAgBwAAghIAIAgAAIMSACAKAAD5EQAgGQAAnQ0AIOIFAACyCgAg6gUAALIKACDyBQAAsgoAIPMFAACyCgAg9AUAALIKACDZBgAAsgoAIAkKAAD5EQAgCwAA_hEAIBAAAOQNACASAAD_EQAgFAAAgBIAIBYAAPwLACDOBgAAsgoAINAGAACyCgAg0QYAALIKACADCQAA9xEAIAoAAPkRACAXAAD6EQAgAAAAAAAHAwAA-wsAICMAAJ4NACDaBgAAsgoAINsGAACyCgAg3AYAALIKACDfBgAAsgoAIOAGAACyCgAgBREAAKYNACCVBgAAsgoAIJYGAACyCgAglwYAALIKACCYBgAAsgoAIAAADKUFAQAAAAG5BUAAAAAB2QVAAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAeAGAQAAAAHhBgEAAAAB4gYgAAAAAQelBQEAAAABrwUBAAAAAbAFAQAAAAG5BUAAAAAB2QVAAAAAAegGQAAAAAHsBgEAAAABC6UFAQAAAAG5BUAAAAAB2QVAAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGAQAAAAHoBkAAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAABDqUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHhBSAAAAAB6wUBAAAAAb4GAgAAAAG_BgEAAAABwAYgAAAAAcEGAgAAAAHCBgIAAAABwwYBAAAAAcQGQAAAAAHFBgEAAAABFqUFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABCKUFAQAAAAG5BUAAAAAB0QUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAEGpQUBAAAAAbkFQAAAAAHYBQAAAN0FAtkFQAAAAAHbBQEAAAAB3QUBAAAAAQ6lBQEAAAABqAUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvgYCAAAAAb8GAQAAAAHABiAAAAABwQYCAAAAAcIGAgAAAAHDBgEAAAABxAZAAAAAAQelBQEAAAABqQUBAAAAAasFAQAAAAGwBQEAAAABzgUBAAAAAc8FAQAAAAHQBUAAAAABBqUFAQAAAAGpBQEAAAABuQVAAAAAAcsFAQAAAAHMBQIAAAABzQWAAAAAAQmlBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAeIFAQAAAAEUpQUBAAAAAaYFAQAAAAGnBQEAAAABqQUBAAAAAaoFAQAAAAGrBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEdDgAA2xEAIBUAAOMRACAcAADZEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKQAA1REAICsAANcRACAsAADYEQAgMQAA3BEAIDIAAN0RACAzAADeEQAgNAAA4BEAIDkAAOERACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQIAAAABACBGAACUEgAgAwAAAFUAIEYAAJQSACBHAACYEgAgHwAAAFUAIA4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgIwAAwRAAICkAALwQACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgPwAAmBIAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhHQ4AANsRACAVAADjEQAgHAAA2REAIB8AAN8RACAgAADiEQAgIwAA2hEAICkAANURACAqAADWEQAgLAAA2BEAIDEAANwRACAyAADdEQAgMwAA3hEAIDQAAOARACA5AADhEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8QYC2QVAAAAAAeUFAQAAAAHZBgEAAAAB3AYBAAAAAe0GAQAAAAHuBiAAAAAB7wYAAADUBQLxBkAAAAAB8gYBAAAAAfMGAQAAAAECAAAAAQAgRgAAmRIAIAMAAABVACBGAACZEgAgRwAAnRIAIB8AAABVACAOAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICwAAL8QACAxAADDEAAgMgAAxBAAIDMAAMUQACA0AADHEAAgOQAAyBAAID8AAJ0SACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhHQ4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgIwAAwRAAICkAALwQACAqAAC9EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0OAADbEQAgFQAA4xEAIBwAANkRACAfAADfEQAgIAAA4hEAICMAANoRACApAADVEQAgKgAA1hEAICsAANcRACAxAADcEQAgMgAA3REAIDMAAN4RACA0AADgEQAgOQAA4REAIKUFAQAAAAGwBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAPEGAtkFQAAAAAHlBQEAAAAB2QYBAAAAAdwGAQAAAAHtBgEAAAAB7gYgAAAAAe8GAAAA1AUC8QZAAAAAAfIGAQAAAAHzBgEAAAABAgAAAAEAIEYAAJ4SACADAAAAVQAgRgAAnhIAIEcAAKISACAfAAAAVQAgDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACA_AACiEgAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0OAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAxAADDEAAgMgAAxBAAIDMAAMUQACA0AADHEAAgOQAAyBAAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAA2xEAIBUAAOMRACAcAADZEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKgAA1hEAICsAANcRACAsAADYEQAgMQAA3BEAIDIAAN0RACAzAADeEQAgNAAA4BEAIDkAAOERACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQIAAAABACBGAACjEgAgFqUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAwAAAFUAIEYAAKMSACBHAACoEgAgHwAAAFUAIA4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgIwAAwRAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgPwAAqBIAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhEQYAAJgQACAIAACVEAAgCgAAlhAAIBkAAJcQACClBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAckGAgAAAAHZBgEAAAABAgAAABUAIEYAAKkSACAMpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAckGAgAAAAHZBgEAAAABF6UFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAHVBgIAAAAB1gYgAAAAAdcGIAAAAAHYBiAAAAABC6UFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYCAAAAAcoGIAAAAAHLBgEAAAABAYMGAQAAAAEDAAAAEQAgRgAAqRIAIEcAALESACATAAAAEQAgBgAA5Q8AIAgAAOcPACAKAADoDwAgGQAA6Q8AID8AALESACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHiBQEAuQoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhyQYCAL0KACHZBgEAuQoAIREGAADlDwAgCAAA5w8AIAoAAOgPACAZAADpDwAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4gUBALkKACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIckGAgC9CgAh2QYBALkKACECqwUBAAAAAbkFQAAAAAEgCgAAxQ8AIBAAAMsPACAYAADDDwAgGgAAxA8AIBwAAMYPACAfAADIDwAgIAAAyQ8AICEAAMoPACClBQEAAAABuAWAAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAeYFAQAAAAHqBQEAAAAB6wUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAHTBgEAAAAB1AYBAAAAAdUGAgAAAAHWBiAAAAAB1wYgAAAAAdgGIAAAAAECAAAAGQAgRgAAsxIAIAMAAAAXACBGAACzEgAgRwAAtxIAICIAAAAXACAKAADmDgAgEAAA7A4AIBgAAOQOACAaAADlDgAgHAAA5w4AIB8AAOkOACAgAADqDgAgIQAA6w4AID8AALcSACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHmBQEAuAoAIeoFAQC5CgAh6wUBALgKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIc0GAQC5CgAhzgYBALkKACHPBhAAmgwAIdAGEACaDAAh0QYQAJoMACHSBgIAygoAIdMGAQC5CgAh1AYBALkKACHVBgIAvQoAIdYGIAC7CgAh1wYgALsKACHYBiAAuwoAISAKAADmDgAgEAAA7A4AIBgAAOQOACAaAADlDgAgHAAA5w4AIB8AAOkOACAgAADqDgAgIQAA6w4AIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhEQYAAJgQACAHAACUEAAgCgAAlhAAIBkAAJcQACClBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAckGAgAAAAHZBgEAAAABAgAAABUAIEYAALgSACAFpQUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAELpQUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAcsGAQAAAAEOpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvgYCAAAAAb8GAQAAAAHABiAAAAABwQYCAAAAAcIGAgAAAAHDBgEAAAABxAZAAAAAAcUGAQAAAAEFpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAECAAAA3AIAIEYAAL0SACADAAAA3wIAIEYAAL0SACBHAADBEgAgBwAAAN8CACA_AADBEgAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh5QUBALgKACHmBQEAuAoAIQWlBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIeYFAQC4CgAhArkFQAAAAAHjBQEAAAABB6UFAQAAAAGoBQEAAAABqQUBAAAAAbAFAQAAAAHOBQEAAAABzwUBAAAAAdAFQAAAAAEUpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEBgwYBAAAAAQalBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAAB_AUCAAAAAbwGAQAAAAEDAAAAEQAgRgAAuBIAIEcAAMkSACATAAAAEQAgBgAA5Q8AIAcAAOYPACAKAADoDwAgGQAA6Q8AID8AAMkSACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHiBQEAuQoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhyQYCAL0KACHZBgEAuQoAIREGAADlDwAgBwAA5g8AIAoAAOgPACAZAADpDwAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4gUBALkKACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIckGAgC9CgAh2QYBALkKACEgCgAAxQ8AIBAAAMsPACAYAADDDwAgHAAAxg8AIB4AAMcPACAfAADIDwAgIAAAyQ8AICEAAMoPACClBQEAAAABuAWAAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAeYFAQAAAAHqBQEAAAAB6wUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAHTBgEAAAAB1AYBAAAAAdUGAgAAAAHWBiAAAAAB1wYgAAAAAdgGIAAAAAECAAAAGQAgRgAAyhIAIAulBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgIAAAABygYgAAAAAQqlBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAABAwAAABcAIEYAAMoSACBHAADQEgAgIgAAABcAIAoAAOYOACAQAADsDgAgGAAA5A4AIBwAAOcOACAeAADoDgAgHwAA6Q4AICAAAOoOACAhAADrDgAgPwAA0BIAIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhIAoAAOYOACAQAADsDgAgGAAA5A4AIBwAAOcOACAeAADoDgAgHwAA6Q4AICAAAOoOACAhAADrDgAgpQUBALgKACG4BYAAAAABuQVAAL4KACHZBUAAvgoAIeQFAQC5CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACEICQAA3A4AIAoAAN0OACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAECAAAATgAgRgAA0RIAIAalBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB_AUCAAAAAbwGAQAAAAEMpQUBAAAAAaoFAQAAAAGrBQEAAAABuQVAAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABC6UFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYCAAAAAcoGIAAAAAHLBgEAAAABCqUFAQAAAAG5BUAAAAAB-wUAAAD7BQL8BQIAAAAB_QUCAAAAAf4FAgAAAAH_BQEAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABA6UFAQAAAAG5BUAAAAAB9gUBAAAAAQMAAAAgACBGAADREgAgRwAA2hIAIAoAAAAgACAJAADEDgAgCgAAxQ4AID8AANoSACClBQEAuAoAIasFAQC4CgAhuQVAAL4KACHZBUAAvgoAIesFAQC4CgAhjwYgALsKACEICQAAxA4AIAoAAMUOACClBQEAuAoAIasFAQC4CgAhuQVAAL4KACHZBUAAvgoAIesFAQC4CgAhjwYgALsKACERBgAAmBAAIAcAAJQQACAIAACVEAAgGQAAlxAAIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeIFAQAAAAHlBQEAAAAB5gUBAAAAAeoFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAAByQYCAAAAAdkGAQAAAAECAAAAFQAgRgAA2xIAIBALAAC7DgAgEAAAvA4AIBIAAL0OACAUAAC_DgAgFgAAwA4AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAY8GIAAAAAHMBgEAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAABAgAAACUAIEYAAN0SACAICQAA3A4AIBcAAN4OACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAECAAAATgAgRgAA3xIAICAQAADLDwAgGAAAww8AIBoAAMQPACAcAADGDwAgHgAAxw8AIB8AAMgPACAgAADJDwAgIQAAyg8AIKUFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAc0GAQAAAAHOBgEAAAABzwYQAAAAAdAGEAAAAAHRBhAAAAAB0gYCAAAAAdMGAQAAAAHUBgEAAAAB1QYCAAAAAdYGIAAAAAHXBiAAAAAB2AYgAAAAAQIAAAAZACBGAADhEgAgAwAAABEAIEYAANsSACBHAADlEgAgEwAAABEAIAYAAOUPACAHAADmDwAgCAAA5w8AIBkAAOkPACA_AADlEgAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4gUBALkKACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIckGAgC9CgAh2QYBALkKACERBgAA5Q8AIAcAAOYPACAIAADnDwAgGQAA6Q8AIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeIFAQC5CgAh5QUBALgKACHmBQEAuAoAIeoFAQC5CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHJBgIAvQoAIdkGAQC5CgAhAwAAACMAIEYAAN0SACBHAADoEgAgEgAAACMAIAsAAIIOACAQAACDDgAgEgAAhA4AIBQAAIYOACAWAACHDgAgPwAA6BIAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIY8GIAC7CgAhzAYBALgKACHNBgEAuAoAIc4GAQC5CgAhzwYQAJkMACHQBhAAmgwAIdEGEACaDAAh0gYCAL0KACEQCwAAgg4AIBAAAIMOACASAACEDgAgFAAAhg4AIBYAAIcOACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACGPBiAAuwoAIcwGAQC4CgAhzQYBALgKACHOBgEAuQoAIc8GEACZDAAh0AYQAJoMACHRBhAAmgwAIdIGAgC9CgAhAwAAACAAIEYAAN8SACBHAADrEgAgCgAAACAAIAkAAMQOACAXAADGDgAgPwAA6xIAIKUFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh6wUBALgKACGPBiAAuwoAIQgJAADEDgAgFwAAxg4AIKUFAQC4CgAhqwUBALgKACG5BUAAvgoAIdkFQAC-CgAh6wUBALgKACGPBiAAuwoAIQMAAAAXACBGAADhEgAgRwAA7hIAICIAAAAXACAQAADsDgAgGAAA5A4AIBoAAOUOACAcAADnDgAgHgAA6A4AIB8AAOkOACAgAADqDgAgIQAA6w4AID8AAO4SACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHmBQEAuAoAIeoFAQC5CgAh6wUBALgKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIc0GAQC5CgAhzgYBALkKACHPBhAAmgwAIdAGEACaDAAh0QYQAJoMACHSBgIAygoAIdMGAQC5CgAh1AYBALkKACHVBgIAvQoAIdYGIAC7CgAh1wYgALsKACHYBiAAuwoAISAQAADsDgAgGAAA5A4AIBoAAOUOACAcAADnDgAgHgAA6A4AIB8AAOkOACAgAADqDgAgIQAA6w4AIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhHQ4AANsRACAVAADjEQAgHAAA2REAIB8AAN8RACAgAADiEQAgIwAA2hEAICkAANURACAqAADWEQAgKwAA1xEAICwAANgRACAxAADcEQAgMgAA3REAIDQAAOARACA5AADhEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8QYC2QVAAAAAAeUFAQAAAAHZBgEAAAAB3AYBAAAAAe0GAQAAAAHuBiAAAAAB7wYAAADUBQLxBkAAAAAB8gYBAAAAAfMGAQAAAAECAAAAAQAgRgAA7xIAICAKAADFDwAgEAAAyw8AIBgAAMMPACAaAADEDwAgHgAAxw8AIB8AAMgPACAgAADJDwAgIQAAyg8AIKUFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAc0GAQAAAAHOBgEAAAABzwYQAAAAAdAGEAAAAAHRBhAAAAAB0gYCAAAAAdMGAQAAAAHUBgEAAAAB1QYCAAAAAdYGIAAAAAHXBiAAAAAB2AYgAAAAAQIAAAAZACBGAADxEgAgHQ4AANsRACAVAADjEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKQAA1REAICoAANYRACArAADXEQAgLAAA2BEAIDEAANwRACAyAADdEQAgMwAA3hEAIDQAAOARACA5AADhEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8QYC2QVAAAAAAeUFAQAAAAHZBgEAAAAB3AYBAAAAAe0GAQAAAAHuBiAAAAAB7wYAAADUBQLxBkAAAAAB8gYBAAAAAfMGAQAAAAECAAAAAQAgRgAA8xIAIAMAAABVACBGAADvEgAgRwAA9xIAIB8AAABVACAOAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACA0AADHEAAgOQAAyBAAID8AAPcSACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhHQ4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgIwAAwRAAICkAALwQACAqAAC9EAAgKwAAvhAAICwAAL8QACAxAADDEAAgMgAAxBAAIDQAAMcQACA5AADIEAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIQMAAAAXACBGAADxEgAgRwAA-hIAICIAAAAXACAKAADmDgAgEAAA7A4AIBgAAOQOACAaAADlDgAgHgAA6A4AIB8AAOkOACAgAADqDgAgIQAA6w4AID8AAPoSACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHmBQEAuAoAIeoFAQC5CgAh6wUBALgKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIc0GAQC5CgAhzgYBALkKACHPBhAAmgwAIdAGEACaDAAh0QYQAJoMACHSBgIAygoAIdMGAQC5CgAh1AYBALkKACHVBgIAvQoAIdYGIAC7CgAh1wYgALsKACHYBiAAuwoAISAKAADmDgAgEAAA7A4AIBgAAOQOACAaAADlDgAgHgAA6A4AIB8AAOkOACAgAADqDgAgIQAA6w4AIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhAwAAAFUAIEYAAPMSACBHAAD9EgAgHwAAAFUAIA4AAMIQACAVAADKEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgPwAA_RIAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAAwhAAIBUAAMoQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhHRUAAOMRACAcAADZEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKQAA1REAICoAANYRACArAADXEQAgLAAA2BEAIDEAANwRACAyAADdEQAgMwAA3hEAIDQAAOARACA5AADhEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8QYC2QVAAAAAAeUFAQAAAAHZBgEAAAAB3AYBAAAAAe0GAQAAAAHuBiAAAAAB7wYAAADUBQLxBkAAAAAB8gYBAAAAAfMGAQAAAAECAAAAAQAgRgAA_hIAIAalBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB9wUBAAAAAfwFAgAAAAEDAAAAVQAgRgAA_hIAIEcAAIMTACAfAAAAVQAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACA_AACDEwAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0VAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgIwAAwRAAICkAALwQACAqAAC9EAAgKwAAvhAAICwAAL8QACAxAADDEAAgMgAAxBAAIDMAAMUQACA0AADHEAAgOQAAyBAAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEQCgAAvg4AIAsAALsOACASAAC9DgAgFAAAvw4AIBYAAMAOACClBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABzAYBAAAAAc0GAQAAAAHOBgEAAAABzwYQAAAAAdAGEAAAAAHRBhAAAAAB0gYCAAAAAQIAAAAlACBGAACEEwAgIAoAAMUPACAYAADDDwAgGgAAxA8AIBwAAMYPACAeAADHDwAgHwAAyA8AICAAAMkPACAhAADKDwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAHVBgIAAAAB1gYgAAAAAdcGIAAAAAHYBiAAAAABAgAAABkAIEYAAIYTACAGAwAA4g0AIKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAG9BhAAAAABAgAAAIUEACBGAACIEwAgAwAAACMAIEYAAIQTACBHAACMEwAgEgAAACMAIAoAAIUOACALAACCDgAgEgAAhA4AIBQAAIYOACAWAACHDgAgPwAAjBMAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIY8GIAC7CgAhzAYBALgKACHNBgEAuAoAIc4GAQC5CgAhzwYQAJkMACHQBhAAmgwAIdEGEACaDAAh0gYCAL0KACEQCgAAhQ4AIAsAAIIOACASAACEDgAgFAAAhg4AIBYAAIcOACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACGPBiAAuwoAIcwGAQC4CgAhzQYBALgKACHOBgEAuQoAIc8GEACZDAAh0AYQAJoMACHRBhAAmgwAIdIGAgC9CgAhAwAAABcAIEYAAIYTACBHAACPEwAgIgAAABcAIAoAAOYOACAYAADkDgAgGgAA5Q4AIBwAAOcOACAeAADoDgAgHwAA6Q4AICAAAOoOACAhAADrDgAgPwAAjxMAIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhIAoAAOYOACAYAADkDgAgGgAA5Q4AIBwAAOcOACAeAADoDgAgHwAA6Q4AICAAAOoOACAhAADrDgAgpQUBALgKACG4BYAAAAABuQVAAL4KACHZBUAAvgoAIeQFAQC5CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACEDAAAAmgEAIEYAAIgTACBHAACSEwAgCAAAAJoBACADAADUDQAgPwAAkhMAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAhvQYQAJkMACEGAwAA1A0AIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAhvQYQAJkMACESCAAAmQ0AICIAAJoNACClBQEAAAABuQVAAAAAAdkFQAAAAAHqBQEAAAABhAYBAAAAAYYGAAAAhgYChwYQAAAAAYgGEAAAAAGJBhAAAAABigYCAAAAAYsGAgAAAAGMBgIAAAABjQZAAAAAAY4GQAAAAAGPBiAAAAABkAYgAAAAAQIAAAC7BQAgRgAAkxMAIAMAAAALACBGAACTEwAgRwAAlxMAIBQAAAALACAIAACbDAAgIgAAnAwAID8AAJcTACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHqBQEAuQoAIYQGAQC4CgAhhgYAAJgMhgYihwYQAJkMACGIBhAAmgwAIYkGEACaDAAhigYCAMoKACGLBgIAvQoAIYwGAgDKCgAhjQZAAL4KACGOBkAAvgoAIY8GIAC7CgAhkAYgALsKACESCAAAmwwAICIAAJwMACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHqBQEAuQoAIYQGAQC4CgAhhgYAAJgMhgYihwYQAJkMACGIBhAAmgwAIYkGEACaDAAhigYCAMoKACGLBgIAvQoAIYwGAgDKCgAhjQZAAL4KACGOBkAAvgoAIY8GIAC7CgAhkAYgALsKACEeAwAA-gwAIAQAAPsMACAFAADDDQAgIAAAgA0AICQAAP0MACAlAAD-DAAgKAAA_wwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAACYEwAgAwAAAAcAIEYAAJgTACBHAACcEwAgIAAAAAcAIAMAAKoMACAEAACrDAAgBQAAwg0AICAAALAMACAkAACtDAAgJQAArgwAICgAAK8MACA_AACcEwAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYi2QVAAL4KACGDBgEAuQoAIasGEACZDAAhrAYBALgKACGtBgEAuAoAIa4GgAAAAAGvBgEAuQoAIbAGAQC5CgAhsQYQAJkMACGyBhAAmQwAIbMGEACZDAAhtAYQAJkMACG1BgEAuQoAIbYGQAC-CgAhtwZAALwKACG4BkAAvAoAIbkGQAC8CgAhugZAALwKACG7BkAAvAoAIR4DAACqDAAgBAAAqwwAIAUAAMINACAgAACwDAAgJAAArQwAICUAAK4MACAoAACvDAAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2AUAAKgMpAYi2QVAAL4KACGDBgEAuQoAIasGEACZDAAhrAYBALgKACGtBgEAuAoAIa4GgAAAAAGvBgEAuQoAIbAGAQC5CgAhsQYQAJkMACGyBhAAmQwAIbMGEACZDAAhtAYQAJkMACG1BgEAuQoAIbYGQAC-CgAhtwZAALwKACG4BkAAvAoAIbkGQAC8CgAhugZAALwKACG7BkAAvAoAIR4DAAD6DAAgBAAA-wwAIAUAAMMNACAMAAD8DAAgIAAAgA0AICQAAP0MACAoAAD_DAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAgAAAAkAIEYAAJ0TACADAAAABwAgRgAAnRMAIEcAAKETACAgAAAABwAgAwAAqgwAIAQAAKsMACAFAADCDQAgDAAArAwAICAAALAMACAkAACtDAAgKAAArwwAID8AAKETACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhHgMAAKoMACAEAACrDAAgBQAAwg0AIAwAAKwMACAgAACwDAAgJAAArQwAICgAAK8MACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhHgMAAPoMACAEAAD7DAAgBQAAww0AIAwAAPwMACAgAACADQAgJAAA_QwAICUAAP4MACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGDBgEAAAABqwYQAAAAAawGAQAAAAGtBgEAAAABrgaAAAAAAa8GAQAAAAGwBgEAAAABsQYQAAAAAbIGEAAAAAGzBhAAAAABtAYQAAAAAbUGAQAAAAG2BkAAAAABtwZAAAAAAbgGQAAAAAG5BkAAAAABugZAAAAAAbsGQAAAAAECAAAACQAgRgAAohMAIAMAAAAHACBGAACiEwAgRwAAphMAICAAAAAHACADAACqDAAgBAAAqwwAIAUAAMINACAMAACsDAAgIAAAsAwAICQAAK0MACAlAACuDAAgPwAAphMAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdgFAACoDKQGItkFQAC-CgAhgwYBALkKACGrBhAAmQwAIawGAQC4CgAhrQYBALgKACGuBoAAAAABrwYBALkKACGwBgEAuQoAIbEGEACZDAAhsgYQAJkMACGzBhAAmQwAIbQGEACZDAAhtQYBALkKACG2BkAAvgoAIbcGQAC8CgAhuAZAALwKACG5BkAAvAoAIboGQAC8CgAhuwZAALwKACEeAwAAqgwAIAQAAKsMACAFAADCDQAgDAAArAwAICAAALAMACAkAACtDAAgJQAArgwAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdgFAACoDKQGItkFQAC-CgAhgwYBALkKACGrBhAAmQwAIawGAQC4CgAhrQYBALgKACGuBoAAAAABrwYBALkKACGwBgEAuQoAIbEGEACZDAAhsgYQAJkMACGzBhAAmQwAIbQGEACZDAAhtQYBALkKACG2BkAAvgoAIbcGQAC8CgAhuAZAALwKACG5BkAAvAoAIboGQAC8CgAhuwZAALwKACENEQAAsA0AIKUFAQAAAAGqBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAKMGAtkFQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAZAAAAAAaEGQAAAAAECAAAAgQEAIEYAAKcTACADAAAAfwAgRgAApxMAIEcAAKsTACAPAAAAfwAgEQAArw0AID8AAKsTACClBQEAuAoAIaoFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2AUAAMcMowYi2QVAAL4KACGcBgEAuAoAIZ0GAQC4CgAhngYBALkKACGfBgEAuQoAIaAGQAC8CgAhoQZAALwKACENEQAArw0AIKUFAQC4CgAhqgUBALgKACG4BYAAAAABuQVAAL4KACHYBQAAxwyjBiLZBUAAvgoAIZwGAQC4CgAhnQYBALgKACGeBgEAuQoAIZ8GAQC5CgAhoAZAALwKACGhBkAAvAoAIR4DAAD6DAAgBAAA-wwAIAUAAMMNACAMAAD8DAAgIAAAgA0AICUAAP4MACAoAAD_DAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAgAAAAkAIEYAAKwTACADAAAABwAgRgAArBMAIEcAALATACAgAAAABwAgAwAAqgwAIAQAAKsMACAFAADCDQAgDAAArAwAICAAALAMACAlAACuDAAgKAAArwwAID8AALATACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhHgMAAKoMACAEAACrDAAgBQAAwg0AIAwAAKwMACAgAACwDAAgJQAArgwAICgAAK8MACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhAasFAQAAAAEB5AUBAAAAAQ4DAACnEAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAeAGAQAAAAHhBgEAAAAB4gYgAAAAAQIAAAAFACBGAACzEwAgHQ4AANsRACAVAADjEQAgHAAA2REAIB8AAN8RACAgAADiEQAgKQAA1REAICoAANYRACArAADXEQAgLAAA2BEAIDEAANwRACAyAADdEQAgMwAA3hEAIDQAAOARACA5AADhEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8QYC2QVAAAAAAeUFAQAAAAHZBgEAAAAB3AYBAAAAAe0GAQAAAAHuBiAAAAAB7wYAAADUBQLxBkAAAAAB8gYBAAAAAfMGAQAAAAECAAAAAQAgRgAAtRMAIBAKAAC-DgAgCwAAuw4AIBAAALwOACAUAAC_DgAgFgAAwA4AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAY8GIAAAAAHMBgEAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAABAgAAACUAIEYAALcTACADAAAAIwAgRgAAtxMAIEcAALsTACASAAAAIwAgCgAAhQ4AIAsAAIIOACAQAACDDgAgFAAAhg4AIBYAAIcOACA_AAC7EwAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAhjwYgALsKACHMBgEAuAoAIc0GAQC4CgAhzgYBALkKACHPBhAAmQwAIdAGEACaDAAh0QYQAJoMACHSBgIAvQoAIRAKAACFDgAgCwAAgg4AIBAAAIMOACAUAACGDgAgFgAAhw4AIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIY8GIAC7CgAhzAYBALgKACHNBgEAuAoAIc4GAQC5CgAhzwYQAJkMACHQBhAAmgwAIdEGEACaDAAh0gYCAL0KACEMpQUBAAAAAasFAQAAAAG5BUAAAAAB9wUBAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABBaUFAQAAAAG5BUAAAAAB2AUAAACkBgKBBgEAAAABpAYBAAAAAQalBQEAAAABuQVAAAAAAdgFAQAAAAHqBQEAAAABmgYBAAAAAZsGQAAAAAELpQUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAACjBgLZBUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGQAAAAAGhBkAAAAABFKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABAwAAAAMAIEYAALMTACBHAADDEwAgEAAAAAMAIAMAAJwQACA_AADDEwAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHaBgEAuQoAIdsGAQC5CgAh3AYBALkKACHdBgEAuAoAId4GAQC4CgAh3wYBALkKACHgBgEAuQoAIeEGAQC4CgAh4gYgALsKACEOAwAAnBAAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh2gYBALkKACHbBgEAuQoAIdwGAQC5CgAh3QYBALgKACHeBgEAuAoAId8GAQC5CgAh4AYBALkKACHhBgEAuAoAIeIGIAC7CgAhAwAAAFUAIEYAALUTACBHAADGEwAgHwAAAFUAIA4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgPwAAxhMAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhFqUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABIAoAAMUPACAQAADLDwAgGAAAww8AIBoAAMQPACAcAADGDwAgHgAAxw8AIB8AAMgPACAgAADJDwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAHVBgIAAAAB1gYgAAAAAdcGIAAAAAHYBiAAAAABAgAAABkAIEYAAMgTACASIgAAmg0AICMAAJsNACClBQEAAAABuQVAAAAAAdkFQAAAAAHqBQEAAAABhAYBAAAAAYYGAAAAhgYChwYQAAAAAYgGEAAAAAGJBhAAAAABigYCAAAAAYsGAgAAAAGMBgIAAAABjQZAAAAAAY4GQAAAAAGPBiAAAAABkAYgAAAAAQIAAAC7BQAgRgAAyhMAIAMAAAAXACBGAADIEwAgRwAAzhMAICIAAAAXACAKAADmDgAgEAAA7A4AIBgAAOQOACAaAADlDgAgHAAA5w4AIB4AAOgOACAfAADpDgAgIAAA6g4AID8AAM4TACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHmBQEAuAoAIeoFAQC5CgAh6wUBALgKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIc0GAQC5CgAhzgYBALkKACHPBhAAmgwAIdAGEACaDAAh0QYQAJoMACHSBgIAygoAIdMGAQC5CgAh1AYBALkKACHVBgIAvQoAIdYGIAC7CgAh1wYgALsKACHYBiAAuwoAISAKAADmDgAgEAAA7A4AIBgAAOQOACAaAADlDgAgHAAA5w4AIB4AAOgOACAfAADpDgAgIAAA6g4AIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhAwAAAAsAIEYAAMoTACBHAADREwAgFAAAAAsAICIAAJwMACAjAACdDAAgPwAA0RMAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeoFAQC5CgAhhAYBALgKACGGBgAAmAyGBiKHBhAAmQwAIYgGEACaDAAhiQYQAJoMACGKBgIAygoAIYsGAgC9CgAhjAYCAMoKACGNBkAAvgoAIY4GQAC-CgAhjwYgALsKACGQBiAAuwoAIRIiAACcDAAgIwAAnQwAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeoFAQC5CgAhhAYBALgKACGGBgAAmAyGBiKHBhAAmQwAIYgGEACaDAAhiQYQAJoMACGKBgIAygoAIYsGAgC9CgAhjAYCAMoKACGNBkAAvgoAIY4GQAC-CgAhjwYgALsKACGQBiAAuwoAIREGAACYEAAgBwAAlBAAIAgAAJUQACAKAACWEAAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB4gUBAAAAAeUFAQAAAAHmBQEAAAAB6gUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHJBgIAAAAB2QYBAAAAAQIAAAAVACBGAADSEwAgEggAAJkNACAjAACbDQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6gUBAAAAAYQGAQAAAAGGBgAAAIYGAocGEAAAAAGIBhAAAAABiQYQAAAAAYoGAgAAAAGLBgIAAAABjAYCAAAAAY0GQAAAAAGOBkAAAAABjwYgAAAAAZAGIAAAAAECAAAAuwUAIEYAANQTACADAAAAEQAgRgAA0hMAIEcAANgTACATAAAAEQAgBgAA5Q8AIAcAAOYPACAIAADnDwAgCgAA6A8AID8AANgTACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHiBQEAuQoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhyQYCAL0KACHZBgEAuQoAIREGAADlDwAgBwAA5g8AIAgAAOcPACAKAADoDwAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh4gUBALkKACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIckGAgC9CgAh2QYBALkKACEDAAAACwAgRgAA1BMAIEcAANsTACAUAAAACwAgCAAAmwwAICMAAJ0MACA_AADbEwAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh6gUBALkKACGEBgEAuAoAIYYGAACYDIYGIocGEACZDAAhiAYQAJoMACGJBhAAmgwAIYoGAgDKCgAhiwYCAL0KACGMBgIAygoAIY0GQAC-CgAhjgZAAL4KACGPBiAAuwoAIZAGIAC7CgAhEggAAJsMACAjAACdDAAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAh6gUBALkKACGEBgEAuAoAIYYGAACYDIYGIocGEACZDAAhiAYQAJoMACGJBhAAmgwAIYoGAgDKCgAhiwYCAL0KACGMBgIAygoAIY0GQAC-CgAhjgZAAL4KACGPBiAAuwoAIZAGIAC7CgAhEAoAAL4OACALAAC7DgAgEAAAvA4AIBIAAL0OACAWAADADgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAECAAAAJQAgRgAA3BMAIAMAAAAjACBGAADcEwAgRwAA4BMAIBIAAAAjACAKAACFDgAgCwAAgg4AIBAAAIMOACASAACEDgAgFgAAhw4AID8AAOATACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACGPBiAAuwoAIcwGAQC4CgAhzQYBALgKACHOBgEAuQoAIc8GEACZDAAh0AYQAJoMACHRBhAAmgwAIdIGAgC9CgAhEAoAAIUOACALAACCDgAgEAAAgw4AIBIAAIQOACAWAACHDgAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAhjwYgALsKACHMBgEAuAoAIc0GAQC4CgAhzgYBALkKACHPBhAAmQwAIdAGEACaDAAh0QYQAJoMACHSBgIAvQoAIR0OAADbEQAgHAAA2REAIB8AAN8RACAgAADiEQAgIwAA2hEAICkAANURACAqAADWEQAgKwAA1xEAICwAANgRACAxAADcEQAgMgAA3REAIDMAAN4RACA0AADgEQAgOQAA4REAIKUFAQAAAAGwBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAPEGAtkFQAAAAAHlBQEAAAAB2QYBAAAAAdwGAQAAAAHtBgEAAAAB7gYgAAAAAe8GAAAA1AUC8QZAAAAAAfIGAQAAAAHzBgEAAAABAgAAAAEAIEYAAOETACADpQUBAAAAAbkFQAAAAAH3BQEAAAABAwAAAFUAIEYAAOETACBHAADmEwAgHwAAAFUAIA4AAMIQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgPwAA5hMAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAAwhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhEAoAAL4OACALAAC7DgAgEAAAvA4AIBIAAL0OACAUAAC_DgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAECAAAAJQAgRgAA5xMAIAgDAAD5CwAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAH4BSAAAAAB-QUBAAAAAQIAAACVBgAgRgAA6RMAIAMAAAAjACBGAADnEwAgRwAA7RMAIBIAAAAjACAKAACFDgAgCwAAgg4AIBAAAIMOACASAACEDgAgFAAAhg4AID8AAO0TACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACGPBiAAuwoAIcwGAQC4CgAhzQYBALgKACHOBgEAuQoAIc8GEACZDAAh0AYQAJoMACHRBhAAmgwAIdIGAgC9CgAhEAoAAIUOACALAACCDgAgEAAAgw4AIBIAAIQOACAUAACGDgAgpQUBALgKACG5BUAAvgoAIdkFQAC-CgAhjwYgALsKACHMBgEAuAoAIc0GAQC4CgAhzgYBALkKACHPBhAAmQwAIdAGEACaDAAh0QYQAJoMACHSBgIAvQoAIQMAAADGAQAgRgAA6RMAIEcAAPATACAKAAAAxgEAIAMAAOsLACA_AADwEwAgpQUBALgKACGoBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIfgFIAC7CgAh-QUBALkKACEIAwAA6wsAIKUFAQC4CgAhqAUBALgKACG5BUAAvgoAIdkFQAC-CgAh5QUBALgKACH4BSAAuwoAIfkFAQC5CgAhAeQFAQAAAAEB4wUBAAAAAQmlBQEAAAABqAUBAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAeIFAQAAAAEB3gUBAAAAAQHeBQEAAAABBqUFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAHmBQEAAAAB6gUBAAAAAQIAAADcBgAgRgAA9hMAIBMeAADeCwAgNwAA3wsAIKUFAQAAAAG4BYAAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB5gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FAQAAAAHvBUAAAAAB8AUgAAAAAfEFAgAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BSAAAAABAgAAAMMGACBGAAD4EwAgAwAAAN8GACBGAAD2EwAgRwAA_BMAIAgAAADfBgAgPwAA_BMAIKUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh5gUBALgKACHqBQEAuQoAIQalBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIeYFAQC4CgAh6gUBALkKACEDAAAAxgYAIEYAAPgTACBHAAD_EwAgFQAAAMYGACAeAADACwAgNwAAwQsAID8AAP8TACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHmBQEAuAoAIesFAQC4CgAh7AUBALkKACHtBQEAuQoAIe4FAQC5CgAh7wVAALwKACHwBSAAuwoAIfEFAgC9CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAh9QUgALsKACETHgAAwAsAIDcAAMELACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHmBQEAuAoAIesFAQC4CgAh7AUBALkKACHtBQEAuQoAIe4FAQC5CgAh7wVAALwKACHwBSAAuwoAIfEFAgC9CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAh9QUgALsKACEFpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAECAAAA9QYAIEYAAIAUACATIgAA3QsAIDcAAN8LACClBQEAAAABuAWAAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAeYFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBQEAAAAB7wVAAAAAAfAFIAAAAAHxBQIAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUgAAAAAQIAAADDBgAgRgAAghQAIAMAAAD4BgAgRgAAgBQAIEcAAIYUACAHAAAA-AYAID8AAIYUACClBQEAuAoAIbkFQAC-CgAh2QVAAL4KACHlBQEAuAoAIeYFAQC4CgAhBaUFAQC4CgAhuQVAAL4KACHZBUAAvgoAIeUFAQC4CgAh5gUBALgKACEDAAAAxgYAIEYAAIIUACBHAACJFAAgFQAAAMYGACAiAAC_CwAgNwAAwQsAID8AAIkUACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHmBQEAuAoAIesFAQC4CgAh7AUBALkKACHtBQEAuQoAIe4FAQC5CgAh7wVAALwKACHwBSAAuwoAIfEFAgC9CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAh9QUgALsKACETIgAAvwsAIDcAAMELACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHmBQEAuAoAIesFAQC4CgAh7AUBALkKACHtBQEAuQoAIe4FAQC5CgAh7wVAALwKACHwBSAAuwoAIfEFAgC9CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAh9QUgALsKACENAwAAhQsAIAYAAIcLACA1AACECwAgpQUBAAAAAagFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQIAAACvAQAgRgAAihQAIB0OAADbEQAgFQAA4xEAIBwAANkRACAfAADfEQAgIAAA4hEAICMAANoRACApAADVEQAgKgAA1hEAICsAANcRACAsAADYEQAgMQAA3BEAIDIAAN0RACAzAADeEQAgNAAA4BEAIKUFAQAAAAGwBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAPEGAtkFQAAAAAHlBQEAAAAB2QYBAAAAAdwGAQAAAAHtBgEAAAAB7gYgAAAAAe8GAAAA1AUC8QZAAAAAAfIGAQAAAAHzBgEAAAABAgAAAAEAIEYAAIwUACATHgAA3gsAICIAAN0LACClBQEAAAABuAWAAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAeYFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBQEAAAAB7wVAAAAAAfAFIAAAAAHxBQIAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUgAAAAAQIAAADDBgAgRgAAjhQAIAmlBQEAAAABqAUBAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAEDAAAArQEAIEYAAIoUACBHAACTFAAgDwAAAK0BACADAAD1CgAgBgAA9goAIDUAAPQKACA_AACTFAAgpQUBALgKACGoBQEAuQoAIbkFQAC-CgAh1QUBALgKACHZBUAAvgoAId4FAQC4CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAh4gUBALkKACENAwAA9QoAIAYAAPYKACA1AAD0CgAgpQUBALgKACGoBQEAuQoAIbkFQAC-CgAh1QUBALgKACHZBUAAvgoAId4FAQC4CgAh3wUBALkKACHgBQEAuQoAIeEFIAC7CgAh4gUBALkKACEDAAAAVQAgRgAAjBQAIEcAAJYUACAfAAAAVQAgDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA_AACWFAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0OAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEDAAAAxgYAIEYAAI4UACBHAACZFAAgFQAAAMYGACAeAADACwAgIgAAvwsAID8AAJkUACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHmBQEAuAoAIesFAQC4CgAh7AUBALkKACHtBQEAuQoAIe4FAQC5CgAh7wVAALwKACHwBSAAuwoAIfEFAgC9CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAh9QUgALsKACETHgAAwAsAICIAAL8LACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdUFAQC4CgAh2QVAAL4KACHmBQEAuAoAIesFAQC4CgAh7AUBALkKACHtBQEAuQoAIe4FAQC5CgAh7wVAALwKACHwBSAAuwoAIfEFAgC9CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAh9QUgALsKACEdDgAA2xEAIBUAAOMRACAcAADZEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKQAA1REAICoAANYRACArAADXEQAgLAAA2BEAIDEAANwRACAzAADeEQAgNAAA4BEAIDkAAOERACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQIAAAABACBGAACaFAAgCKUFAQAAAAG5BUAAAAAB0gUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAEDAAAAVQAgRgAAmhQAIEcAAJ8UACAfAAAAVQAgDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAzAADFEAAgNAAAxxAAIDkAAMgQACA_AACfFAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0OAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDMAAMUQACA0AADHEAAgOQAAyBAAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAA2xEAIBUAAOMRACAcAADZEQAgHwAA3xEAICAAAOIRACAjAADaEQAgKQAA1REAICoAANYRACArAADXEQAgLAAA2BEAIDIAAN0RACAzAADeEQAgNAAA4BEAIDkAAOERACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQIAAAABACBGAACgFAAgCC0AAO8KACClBQEAAAABuQVAAAAAAdgFAAAA3QUC2QVAAAAAAdoFAQAAAAHbBQEAAAAB3QUBAAAAAQIAAACkAQAgRgAAohQAIAMAAABVACBGAACgFAAgRwAAphQAIB8AAABVACAOAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMgAAxBAAIDMAAMUQACA0AADHEAAgOQAAyBAAID8AAKYUACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhHQ4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAgAADJEAAgIwAAwRAAICkAALwQACAqAAC9EAAgKwAAvhAAICwAAL8QACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIQMAAACiAQAgRgAAohQAIEcAAKkUACAKAAAAogEAIC0AAOEKACA_AACpFAAgpQUBALgKACG5BUAAvgoAIdgFAADgCt0FItkFQAC-CgAh2gUBALgKACHbBQEAuAoAId0FAQC5CgAhCC0AAOEKACClBQEAuAoAIbkFQAC-CgAh2AUAAOAK3QUi2QVAAL4KACHaBQEAuAoAIdsFAQC4CgAh3QUBALkKACEdDgAA2xEAIBUAAOMRACAcAADZEQAgIAAA4hEAICMAANoRACApAADVEQAgKgAA1hEAICsAANcRACAsAADYEQAgMQAA3BEAIDIAAN0RACAzAADeEQAgNAAA4BEAIDkAAOERACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQIAAAABACBGAACqFAAgIAoAAMUPACAQAADLDwAgGAAAww8AIBoAAMQPACAcAADGDwAgHgAAxw8AICAAAMkPACAhAADKDwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzQYBAAAAAc4GAQAAAAHPBhAAAAAB0AYQAAAAAdEGEAAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAHVBgIAAAAB1gYgAAAAAdcGIAAAAAHYBiAAAAABAgAAABkAIEYAAKwUACADAAAAVQAgRgAAqhQAIEcAALAUACAfAAAAVQAgDgAAwhAAIBUAAMoQACAcAADAEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACA_AACwFAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0OAADCEAAgFQAAyhAAIBwAAMAQACAgAADJEAAgIwAAwRAAICkAALwQACAqAAC9EAAgKwAAvhAAICwAAL8QACAxAADDEAAgMgAAxBAAIDMAAMUQACA0AADHEAAgOQAAyBAAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEDAAAAFwAgRgAArBQAIEcAALMUACAiAAAAFwAgCgAA5g4AIBAAAOwOACAYAADkDgAgGgAA5Q4AIBwAAOcOACAeAADoDgAgIAAA6g4AICEAAOsOACA_AACzFAAgpQUBALgKACG4BYAAAAABuQVAAL4KACHZBUAAvgoAIeQFAQC5CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACEgCgAA5g4AIBAAAOwOACAYAADkDgAgGgAA5Q4AIBwAAOcOACAeAADoDgAgIAAA6g4AICEAAOsOACClBQEAuAoAIbgFgAAAAAG5BUAAvgoAIdkFQAC-CgAh5AUBALkKACHmBQEAuAoAIeoFAQC5CgAh6wUBALgKACHyBQEAuQoAIfMFAQC5CgAh9AUBALkKACGPBiAAuwoAIc0GAQC5CgAhzgYBALkKACHPBhAAmgwAIdAGEACaDAAh0QYQAJoMACHSBgIAygoAIdMGAQC5CgAh1AYBALkKACHVBgIAvQoAIdYGIAC7CgAh1wYgALsKACHYBiAAuwoAIR0OAADbEQAgFQAA4xEAIBwAANkRACAfAADfEQAgIAAA4hEAICMAANoRACApAADVEQAgKgAA1hEAICsAANcRACAsAADYEQAgMQAA3BEAIDIAAN0RACAzAADeEQAgOQAA4REAIKUFAQAAAAGwBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAPEGAtkFQAAAAAHlBQEAAAAB2QYBAAAAAdwGAQAAAAHtBgEAAAAB7gYgAAAAAe8GAAAA1AUC8QZAAAAAAfIGAQAAAAHzBgEAAAABAgAAAAEAIEYAALQUACADAAAAVQAgRgAAtBQAIEcAALgUACAfAAAAVQAgDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICAAAMkQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDkAAMgQACA_AAC4FAAgpQUBALgKACGwBQEAuQoAIbgFgAAAAAG5BUAAvgoAIdgFAAC7EPEGItkFQAC-CgAh5QUBALkKACHZBgEAuQoAIdwGAQC5CgAh7QYBALgKACHuBiAAuwoAIe8GAADXCtQFIvEGQAC8CgAh8gYBALkKACHzBgEAuQoAIR0OAADCEAAgFQAAyhAAIBwAAMAQACAfAADGEAAgIAAAyRAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgOQAAyBAAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEgCgAAxQ8AIBAAAMsPACAYAADDDwAgGgAAxA8AIBwAAMYPACAeAADHDwAgHwAAyA8AICEAAMoPACClBQEAAAABuAWAAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAeYFAQAAAAHqBQEAAAAB6wUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHNBgEAAAABzgYBAAAAAc8GEAAAAAHQBhAAAAAB0QYQAAAAAdIGAgAAAAHTBgEAAAAB1AYBAAAAAdUGAgAAAAHWBiAAAAAB1wYgAAAAAdgGIAAAAAECAAAAGQAgRgAAuRQAIB4DAAD6DAAgBAAA-wwAIAUAAMMNACAMAAD8DAAgJAAA_QwAICUAAP4MACAoAAD_DAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAgAAAAkAIEYAALsUACAdDgAA2xEAIBUAAOMRACAcAADZEQAgHwAA3xEAICMAANoRACApAADVEQAgKgAA1hEAICsAANcRACAsAADYEQAgMQAA3BEAIDIAAN0RACAzAADeEQAgNAAA4BEAIDkAAOERACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADxBgLZBUAAAAAB5QUBAAAAAdkGAQAAAAHcBgEAAAAB7QYBAAAAAe4GIAAAAAHvBgAAANQFAvEGQAAAAAHyBgEAAAAB8wYBAAAAAQIAAAABACBGAAC9FAAgAwAAABcAIEYAALkUACBHAADBFAAgIgAAABcAIAoAAOYOACAQAADsDgAgGAAA5A4AIBoAAOUOACAcAADnDgAgHgAA6A4AIB8AAOkOACAhAADrDgAgPwAAwRQAIKUFAQC4CgAhuAWAAAAAAbkFQAC-CgAh2QVAAL4KACHkBQEAuQoAIeYFAQC4CgAh6gUBALkKACHrBQEAuAoAIfIFAQC5CgAh8wUBALkKACH0BQEAuQoAIY8GIAC7CgAhzQYBALkKACHOBgEAuQoAIc8GEACaDAAh0AYQAJoMACHRBhAAmgwAIdIGAgDKCgAh0wYBALkKACHUBgEAuQoAIdUGAgC9CgAh1gYgALsKACHXBiAAuwoAIdgGIAC7CgAhIAoAAOYOACAQAADsDgAgGAAA5A4AIBoAAOUOACAcAADnDgAgHgAA6A4AIB8AAOkOACAhAADrDgAgpQUBALgKACG4BYAAAAABuQVAAL4KACHZBUAAvgoAIeQFAQC5CgAh5gUBALgKACHqBQEAuQoAIesFAQC4CgAh8gUBALkKACHzBQEAuQoAIfQFAQC5CgAhjwYgALsKACHNBgEAuQoAIc4GAQC5CgAhzwYQAJoMACHQBhAAmgwAIdEGEACaDAAh0gYCAMoKACHTBgEAuQoAIdQGAQC5CgAh1QYCAL0KACHWBiAAuwoAIdcGIAC7CgAh2AYgALsKACEDAAAABwAgRgAAuxQAIEcAAMQUACAgAAAABwAgAwAAqgwAIAQAAKsMACAFAADCDQAgDAAArAwAICQAAK0MACAlAACuDAAgKAAArwwAID8AAMQUACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhHgMAAKoMACAEAACrDAAgBQAAwg0AIAwAAKwMACAkAACtDAAgJQAArgwAICgAAK8MACClBQEAuAoAIagFAQC4CgAhuQVAAL4KACHYBQAAqAykBiLZBUAAvgoAIYMGAQC5CgAhqwYQAJkMACGsBgEAuAoAIa0GAQC4CgAhrgaAAAAAAa8GAQC5CgAhsAYBALkKACGxBhAAmQwAIbIGEACZDAAhswYQAJkMACG0BhAAmQwAIbUGAQC5CgAhtgZAAL4KACG3BkAAvAoAIbgGQAC8CgAhuQZAALwKACG6BkAAvAoAIbsGQAC8CgAhAwAAAFUAIEYAAL0UACBHAADHFAAgHwAAAFUAIA4AAMIQACAVAADKEAAgHAAAwBAAIB8AAMYQACAjAADBEAAgKQAAvBAAICoAAL0QACArAAC-EAAgLAAAvxAAIDEAAMMQACAyAADEEAAgMwAAxRAAIDQAAMcQACA5AADIEAAgPwAAxxQAIKUFAQC4CgAhsAUBALkKACG4BYAAAAABuQVAAL4KACHYBQAAuxDxBiLZBUAAvgoAIeUFAQC5CgAh2QYBALkKACHcBgEAuQoAIe0GAQC4CgAh7gYgALsKACHvBgAA1wrUBSLxBkAAvAoAIfIGAQC5CgAh8wYBALkKACEdDgAAwhAAIBUAAMoQACAcAADAEAAgHwAAxhAAICMAAMEQACApAAC8EAAgKgAAvRAAICsAAL4QACAsAAC_EAAgMQAAwxAAIDIAAMQQACAzAADFEAAgNAAAxxAAIDkAAMgQACClBQEAuAoAIbAFAQC5CgAhuAWAAAAAAbkFQAC-CgAh2AUAALsQ8QYi2QVAAL4KACHlBQEAuQoAIdkGAQC5CgAh3AYBALkKACHtBgEAuAoAIe4GIAC7CgAh7wYAANcK1AUi8QZAALwKACHyBgEAuQoAIfMGAQC5CgAhEA0ANw6bAQwVxwERHJgBFx-nARsgxQEcI5kBAykGAiqRASYrlQEnLJcBKDGfASkypQEqM6YBFzSrASw5sAEtAwMAAQ0AJSMKAwkDAAEEAAIFDAQMeA4NACQgiAEcJHofJX4gKIIBIQQIEAUNAB4icxUjdAMCBQAECQAGCgpQCA0AHRBqCxgSBxpPCRxUFx5aGB9gGyBlHCFpBQYGEwcHFgcIGgYKHggNABYZSBUECR8GCyEJD0MKGEQHBAkABgoiCA0AFBcmCgcKMQgLAAkNABMQKgsSMA4UNQ8WORADCQAGDgAMDwAKAwMAAQwrCw0ADQEMLAACDwAKEQADARMACgIPAAoVABEDAwABDDoQDQASAQw7AAUKPgAQPAASPQAUPwAWQAACCkEAF0IAAgUABBgABwQHSQAISgAKSwAZTAADAwABCQAGG1YBAgkABh0AGQIIWxgNABoBCFwAAgNhAQkABgMDZgEJaAYRZwMICmwAEHIAGmsAHG0AHm4AH28AIHAAIXEAAwh1ACJ2ACN3AAERAAMBEQADAw0AIxEAAyeGASIBJgAhASeHAQAEDIkBACCMAQAligEAKIsBAAEjjQEAAQMAAQEDAAEBAwABAi8AKjAAAQMNACstAAEuoAEpAS6hAQABA6wBAQUDwQEBBsIBLQ0ANjUALjjDAS0EDQA1HroBMiK0AS83vQEtAhgAMDUALgINADE2tQEvATa2AQACHQAzNQAuAg0ANDa7ATIBNrwBAAMevwEAIr4BADfAAQABOMQBAAwcywEAH9ABACDTAQAjzAEAKcgBACrJAQArygEAMc0BADLOAQAzzwEANNEBADnSAQAAAAADDQA8TAA9TQA-AAAAAw0APEwAPU0APgEDAAEBAwABAw0AQ0wARE0ARQAAAAMNAENMAERNAEUBAwABAQMAAQMNAEpMAEtNAEwAAAADDQBKTABLTQBMAQMAAQEDAAEDDQBRTABSTQBTAAAAAw0AUUwAUk0AUwEDAAEBAwABAw0AWEwAWU0AWgAAAAMNAFhMAFlNAFoBBs4CBwEG1AIHBQ0AX0wAYk0AY54BAGCfAQBhAAAAAAAFDQBfTABiTQBjngEAYJ8BAGEAAAMNAGhMAGlNAGoAAAADDQBoTABpTQBqAgkABh0AGQIJAAYdABkDDQBvTABwTQBxAAAAAw0Ab0wAcE0AcQEYlQMHARibAwcFDQB2TAB5TQB6ngEAd58BAHgAAAAAAAUNAHZMAHlNAHqeAQB3nwEAeAEJAAYBCQAGAw0Af0wAgAFNAIEBAAAAAw0Af0wAgAFNAIEBAQsACQELAAkFDQCGAUwAiQFNAIoBngEAhwGfAQCIAQAAAAAABQ0AhgFMAIkBTQCKAZ4BAIcBnwEAiAEECdkDBgvaAwkP2wMKGNwDBwQJ4gMGC-MDCQ_kAwoY5QMHBQ0AjwFMAJIBTQCTAZ4BAJABnwEAkQEAAAAAAAUNAI8BTACSAU0AkwGeAQCQAZ8BAJEBAwMAAQkABhv3AwEDAwABCQAGG_0DAQUNAJgBTACbAU0AnAGeAQCZAZ8BAJoBAAAAAAAFDQCYAUwAmwFNAJwBngEAmQGfAQCaAQEDAAEBAwABBQ0AoQFMAKQBTQClAZ4BAKIBnwEAowEAAAAAAAUNAKEBTACkAU0ApQGeAQCiAZ8BAKMBAwkABg4ADA8ACgMJAAYOAAwPAAoFDQCqAUwArQFNAK4BngEAqwGfAQCsAQAAAAAABQ0AqgFMAK0BTQCuAZ4BAKsBnwEArAEDAwABBAACBb0EBAMDAAEEAAIFwwQEBQ0AswFMALYBTQC3AZ4BALQBnwEAtQEAAAAAAAUNALMBTAC2AU0AtwGeAQC0AZ8BALUBAg8AChEAAwIPAAoRAAMFDQC8AUwAvwFNAMABngEAvQGfAQC-AQAAAAAABQ0AvAFMAL8BTQDAAZ4BAL0BnwEAvgEBEQADAREAAwMNAMUBTADGAU0AxwEAAAADDQDFAUwAxgFNAMcBAREAAwERAAMDDQDMAUwAzQFNAM4BAAAAAw0AzAFMAM0BTQDOAQEmACEBJgAhAw0A0wFMANQBTQDVAQAAAAMNANMBTADUAU0A1QEBEQADAREAAwUNANoBTADdAU0A3gGeAQDbAZ8BANwBAAAAAAAFDQDaAUwA3QFNAN4BngEA2wGfAQDcAQAABQ0A4wFMAOYBTQDnAZ4BAOQBnwEA5QEAAAAAAAUNAOMBTADmAU0A5wGeAQDkAZ8BAOUBAgUABAkABgIFAAQJAAYDDQDsAUwA7QFNAO4BAAAAAw0A7AFMAO0BTQDuAQIFAAQYAAcCBQAEGAAHAw0A8wFMAPQBTQD1AQAAAAMNAPMBTAD0AU0A9QEBEwAKARMACgUNAPoBTAD9AU0A_gGeAQD7AZ8BAPwBAAAAAAAFDQD6AUwA_QFNAP4BngEA-wGfAQD8AQEDAAEBAwABAw0AgwJMAIQCTQCFAgAAAAMNAIMCTACEAk0AhQICDwAKFQARAg8AChUAEQMNAIoCTACLAk0AjAIAAAADDQCKAkwAiwJNAIwCAAAFDQCRAkwAlAJNAJUCngEAkgKfAQCTAgAAAAAABQ0AkQJMAJQCTQCVAp4BAJICnwEAkwIAAAMNAJoCTACbAk0AnAIAAAADDQCaAkwAmwJNAJwCAAADDQChAkwAogJNAKMCAAAAAw0AoQJMAKICTQCjAgIYADA1AC4CGAAwNQAuAw0AqAJMAKkCTQCqAgAAAAMNAKgCTACpAk0AqgICHQAzNQAuAh0AMzUALgMNAK8CTACwAk0AsQIAAAADDQCvAkwAsAJNALECAwPEBwEGxQctNQAuAwPLBwEGzActNQAuAw0AtgJMALcCTQC4AgAAAAMNALYCTAC3Ak0AuAIBLQABAS0AAQMNAL0CTAC-Ak0AvwIAAAADDQC9AkwAvgJNAL8CAi8AKjAAAQIvACowAAEDDQDEAkwAxQJNAMYCAAAAAw0AxAJMAMUCTQDGAgIDiggBCQAGAgOQCAEJAAYDDQDLAkwAzAJNAM0CAAAAAw0AywJMAMwCTQDNAgEDoggBAQOoCAEFDQDSAkwA1QJNANYCngEA0wKfAQDUAgAAAAAABQ0A0gJMANUCTQDWAp4BANMCnwEA1AIDA7oIAQm8CAYRuwgDAwPCCAEJxAgGEcMIAwUNANsCTADeAk0A3wKeAQDcAp8BAN0CAAAAAAAFDQDbAkwA3gJNAN8CngEA3AKfAQDdAjoCATvUAQE81gEBPdcBAT7YAQFA2gEBQdwBOELdATlD3wEBROEBOEXiATpI4wEBSeQBAUrlAThO6AE7T-kBP1DqASZR6wEmUuwBJlPtASZU7gEmVfABJlbyAThX8wFAWPUBJln3ATha-AFBW_kBJlz6ASZd-wE4Xv4BQl__AUZggAInYYECJ2KCAidjgwInZIQCJ2WGAidmiAI4Z4kCR2iLAidpjQI4ao4CSGuPAidskAInbZECOG6UAklvlQJNcJcCKHGYAihymgIoc5sCKHScAih1ngIodqACOHehAk54owIoeaUCOHqmAk97pwIofKgCKH2pAjh-rAJQf60CVIABrgICgQGvAgKCAbACAoMBsQIChAGyAgKFAbQCAoYBtgI4hwG3AlWIAbkCAokBuwI4igG8AlaLAb0CAowBvgICjQG_AjiOAcICV48BwwJbkAHEAgeRAcUCB5IBxgIHkwHHAgeUAcgCB5UBygIHlgHMAjiXAc0CXJgB0AIHmQHSAjiaAdMCXZsB1QIHnAHWAgedAdcCOKAB2gJeoQHbAmSiAd0CGaMB3gIZpAHhAhmlAeICGaYB4wIZpwHlAhmoAecCOKkB6AJlqgHqAhmrAewCOKwB7QJmrQHuAhmuAe8CGa8B8AI4sAHzAmexAfQCa7IB9QIYswH2Ahi0AfcCGLUB-AIYtgH5Ahi3AfsCGLgB_QI4uQH-Amy6AYADGLsBggM4vAGDA229AYQDGL4BhQMYvwGGAzjAAYkDbsEBigNywgGLAwbDAYwDBsQBjQMGxQGOAwbGAY8DBscBkQMGyAGTAzjJAZQDc8oBlwMGywGZAzjMAZoDdM0BnAMGzgGdAwbPAZ4DONABoQN10QGiA3vSAaMDCdMBpAMJ1AGlAwnVAaYDCdYBpwMJ1wGpAwnYAasDONkBrAN82gGuAwnbAbADONwBsQN93QGyAwneAbMDCd8BtAM44AG3A37hAbgDggHiAbkDCuMBugMK5AG7AwrlAbwDCuYBvQMK5wG_AwroAcEDOOkBwgODAeoBxAMK6wHGAzjsAccDhAHtAcgDCu4ByQMK7wHKAzjwAc0DhQHxAc4DiwHyAc8DCPMB0AMI9AHRAwj1AdIDCPYB0wMI9wHVAwj4AdcDOPkB2AOMAfoB3gMI-wHgAzj8AeEDjQH9AeYDCP4B5wMI_wHoAziAAusDjgGBAuwDlAGCAu0DF4MC7gMXhALvAxeFAvADF4YC8QMXhwLzAxeIAvUDOIkC9gOVAYoC-QMXiwL7AziMAvwDlgGNAv4DF44C_wMXjwKABDiQAoMElwGRAoQEnQGSAoYEDJMChwQMlAKJBAyVAooEDJYCiwQMlwKNBAyYAo8EOJkCkASeAZoCkgQMmwKUBDicApUEnwGdApYEDJ4ClwQMnwKYBDigApsEoAGhApwEpgGiAp0EC6MCngQLpAKfBAulAqAEC6YCoQQLpwKjBAuoAqUEOKkCpgSnAaoCqAQLqwKqBDisAqsEqAGtAqwEC64CrQQLrwKuBDiwArEEqQGxArIErwGyArMEA7MCtAQDtAK1BAO1ArYEA7YCtwQDtwK5BAO4ArsEOLkCvASwAboCvwQDuwLBBDi8AsIEsQG9AsQEA74CxQQDvwLGBDjAAskEsgHBAsoEuAHCAssEDsMCzAQOxALNBA7FAs4EDsYCzwQOxwLRBA7IAtMEOMkC1AS5AcoC1gQOywLYBDjMAtkEugHNAtoEDs4C2wQOzwLcBDjQAt8EuwHRAuAEwQHSAuEEINMC4gQg1ALjBCDVAuQEINYC5QQg1wLnBCDYAukEONkC6gTCAdoC7AQg2wLuBDjcAu8EwwHdAvAEIN4C8QQg3wLyBDjgAvUExAHhAvYEyAHiAvcEIeMC-AQh5AL5BCHlAvoEIeYC-wQh5wL9BCHoAv8EOOkCgAXJAeoCggUh6wKEBTjsAoUFygHtAoYFIe4ChwUh7wKIBTjwAosFywHxAowFzwHyAo0FIvMCjgUi9AKPBSL1ApAFIvYCkQUi9wKTBSL4ApUFOPkClgXQAfoCmAUi-wKaBTj8ApsF0QH9ApwFIv4CnQUi_wKeBTiAA6EF0gGBA6IF1gGCA6QFH4MDpQUfhAOnBR-FA6gFH4YDqQUfhwOrBR-IA60FOIkDrgXXAYoDsAUfiwOyBTiMA7MF2AGNA7QFH44DtQUfjwO2BTiQA7kF2QGRA7oF3wGSA7wFBJMDvQUElAO_BQSVA8AFBJYDwQUElwPDBQSYA8UFOJkDxgXgAZoDyAUEmwPKBTicA8sF4QGdA8wFBJ4DzQUEnwPOBTigA9EF4gGhA9IF6AGiA9MFBaMD1AUFpAPVBQWlA9YFBaYD1wUFpwPZBQWoA9sFOKkD3AXpAaoD3gUFqwPgBTisA-EF6gGtA-IFBa4D4wUFrwPkBTiwA-cF6wGxA-gF7wGyA-kFFbMD6gUVtAPrBRW1A-wFFbYD7QUVtwPvBRW4A_EFOLkD8gXwAboD9AUVuwP2BTi8A_cF8QG9A_gFFb4D-QUVvwP6BTjAA_0F8gHBA_4F9gHCA_8FD8MDgAYPxAOBBg_FA4IGD8YDgwYPxwOFBg_IA4cGOMkDiAb3AcoDigYPywOMBjjMA40G-AHNA44GD84DjwYPzwOQBjjQA5MG-QHRA5QG_wHSA5YGEdMDlwYR1AOZBhHVA5oGEdYDmwYR1wOdBhHYA58GONkDoAaAAtoDogYR2wOkBjjcA6UGgQLdA6YGEd4DpwYR3wOoBjjgA6sGggLhA6wGhgLiA60GEOMDrgYQ5AOvBhDlA7AGEOYDsQYQ5wOzBhDoA7UGOOkDtgaHAuoDuAYQ6wO6BjjsA7sGiALtA7wGEO4DvQYQ7wO-BjjwA8EGiQLxA8IGjQLyA8QGLvMDxQYu9APIBi71A8kGLvYDygYu9wPMBi74A84GOPkDzwaOAvoD0QYu-wPTBjj8A9QGjwL9A9UGLv4D1gYu_wPXBjiABNoGkAKBBNsGlgKCBN0GMIME3gYwhAThBjCFBOIGMIYE4wYwhwTlBjCIBOcGOIkE6AaXAooE6gYwiwTsBjiMBO0GmAKNBO4GMI4E7wYwjwTwBjiQBPMGmQKRBPQGnQKSBPYGM5ME9wYzlAT6BjOVBPsGM5YE_AYzlwT-BjOYBIAHOJkEgQeeApoEgwczmwSFBzicBIYHnwKdBIcHM54EiAcznwSJBzigBIwHoAKhBI0HpAKiBI4HL6MEjwcvpASQBy-lBJEHL6YEkgcvpwSUBy-oBJYHOKkElwelAqoEmQcvqwSbBzisBJwHpgKtBJ0HL64EngcvrwSfBziwBKIHpwKxBKMHqwKyBKQHMrMEpQcytASmBzK1BKcHMrYEqAcytwSqBzK4BKwHOLkErQesAroErwcyuwSxBzi8BLIHrQK9BLMHMr4EtAcyvwS1BzjABLgHrgLBBLkHsgLCBLoHLcMEuwctxAS8By3FBL0HLcYEvgctxwTABy3IBMIHOMkEwwezAsoExwctywTJBzjMBMoHtALNBM0HLc4EzgctzwTPBzjQBNIHtQLRBNMHuQLSBNQHKtME1Qcq1ATWByrVBNcHKtYE2Acq1wTaByrYBNwHONkE3Qe6AtoE3wcq2wThBzjcBOIHuwLdBOMHKt4E5Acq3wTlBzjgBOgHvALhBOkHwALiBOoHKeME6wcp5ATsBynlBO0HKeYE7gcp5wTwBynoBPIHOOkE8wfBAuoE9Qcp6wT3BzjsBPgHwgLtBPkHKe4E-gcp7wT7BzjwBP4HwwLxBP8HxwLyBIAIG_MEgQgb9ASCCBv1BIMIG_YEhAgb9wSGCBv4BIgIOPkEiQjIAvoEjAgb-wSOCDj8BI8IyQL9BJEIG_4Ekggb_wSTCDiABZYIygKBBZcIzgKCBZgILIMFmQgshAWaCCyFBZsILIYFnAgshwWeCCyIBaAIOIkFoQjPAooFpAgsiwWmCDiMBacI0AKNBakILI4FqggsjwWrCDiQBa4I0QKRBa8I1wKSBbAIHJMFsQgclAWyCByVBbMIHJYFtAgclwW2CByYBbgIOJkFuQjYApoFvggcmwXACDicBcEI2QKdBcUIHJ4FxggcnwXHCDigBcoI2gKhBcsI4AI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
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
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AddressScalarFieldEnum: () => AddressScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BlogCategoryScalarFieldEnum: () => BlogCategoryScalarFieldEnum,
  BlogCommentScalarFieldEnum: () => BlogCommentScalarFieldEnum,
  BlogPostCategoryScalarFieldEnum: () => BlogPostCategoryScalarFieldEnum,
  BlogPostScalarFieldEnum: () => BlogPostScalarFieldEnum,
  BlogPostTagScalarFieldEnum: () => BlogPostTagScalarFieldEnum,
  BlogTagScalarFieldEnum: () => BlogTagScalarFieldEnum,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  ConversationScalarFieldEnum: () => ConversationScalarFieldEnum,
  ConversionEventScalarFieldEnum: () => ConversionEventScalarFieldEnum,
  CouponCategoryScalarFieldEnum: () => CouponCategoryScalarFieldEnum,
  CouponProductScalarFieldEnum: () => CouponProductScalarFieldEnum,
  CouponScalarFieldEnum: () => CouponScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  InventoryTransactionScalarFieldEnum: () => InventoryTransactionScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  MessageScalarFieldEnum: () => MessageScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  OrderStatusHistoryScalarFieldEnum: () => OrderStatusHistoryScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProductImageScalarFieldEnum: () => ProductImageScalarFieldEnum,
  ProductScalarFieldEnum: () => ProductScalarFieldEnum,
  ProductTagScalarFieldEnum: () => ProductTagScalarFieldEnum,
  ProductVariantScalarFieldEnum: () => ProductVariantScalarFieldEnum,
  ProductViewScalarFieldEnum: () => ProductViewScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SearchQueryScalarFieldEnum: () => SearchQueryScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  ShipmentEventScalarFieldEnum: () => ShipmentEventScalarFieldEnum,
  ShipmentScalarFieldEnum: () => ShipmentScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TagScalarFieldEnum: () => TagScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserCredentialScalarFieldEnum: () => UserCredentialScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VariantOptionScalarFieldEnum: () => VariantOptionScalarFieldEnum,
  WishlistItemScalarFieldEnum: () => WishlistItemScalarFieldEnum,
  WishlistScalarFieldEnum: () => WishlistScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.4.0",
  engine: "ab56fe763f921d033a6c195e7ddeb3e255bdbb57"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  UserCredential: "UserCredential",
  Address: "Address",
  Category: "Category",
  Tag: "Tag",
  ProductTag: "ProductTag",
  Product: "Product",
  ProductVariant: "ProductVariant",
  VariantOption: "VariantOption",
  ProductImage: "ProductImage",
  Review: "Review",
  Cart: "Cart",
  CartItem: "CartItem",
  Order: "Order",
  OrderItem: "OrderItem",
  OrderStatusHistory: "OrderStatusHistory",
  Shipment: "Shipment",
  ShipmentEvent: "ShipmentEvent",
  Payment: "Payment",
  Coupon: "Coupon",
  CouponProduct: "CouponProduct",
  CouponCategory: "CouponCategory",
  InventoryTransaction: "InventoryTransaction",
  Wishlist: "Wishlist",
  WishlistItem: "WishlistItem",
  BlogPost: "BlogPost",
  BlogCategory: "BlogCategory",
  BlogTag: "BlogTag",
  BlogPostCategory: "BlogPostCategory",
  BlogPostTag: "BlogPostTag",
  BlogComment: "BlogComment",
  Conversation: "Conversation",
  Message: "Message",
  ProductView: "ProductView",
  SearchQuery: "SearchQuery",
  ConversionEvent: "ConversionEvent"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  emailVerified: "emailVerified",
  name: "name",
  phone: "phone",
  image: "image",
  role: "role",
  status: "status",
  lastLoginAt: "lastLoginAt",
  lastIp: "lastIp",
  userAgent: "userAgent",
  referralSource: "referralSource",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  token: "token",
  expiresAt: "expiresAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AccountScalarFieldEnum = {
  id: "id",
  userId: "userId",
  providerId: "providerId",
  providerAccountId: "providerAccountId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  expiresAt: "expiresAt",
  tokenType: "tokenType",
  scope: "scope",
  idToken: "idToken",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserCredentialScalarFieldEnum = {
  id: "id",
  userId: "userId",
  passwordHash: "passwordHash",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AddressScalarFieldEnum = {
  id: "id",
  userId: "userId",
  label: "label",
  recipient: "recipient",
  phone: "phone",
  street: "street",
  city: "city",
  state: "state",
  zipCode: "zipCode",
  country: "country",
  isDefault: "isDefault",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  image: "image",
  isActive: "isActive",
  sortOrder: "sortOrder",
  parentId: "parentId",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
  metaKeywords: "metaKeywords",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TagScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProductTagScalarFieldEnum = {
  productId: "productId",
  tagId: "tagId",
  createdAt: "createdAt"
};
var ProductScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  description: "description",
  shortDesc: "shortDesc",
  brand: "brand",
  categoryId: "categoryId",
  price: "price",
  compareAtPrice: "compareAtPrice",
  costPrice: "costPrice",
  sku: "sku",
  barcode: "barcode",
  stock: "stock",
  lowStockThreshold: "lowStockThreshold",
  hasVariants: "hasVariants",
  isActive: "isActive",
  isFeatured: "isFeatured",
  isDigital: "isDigital",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
  metaKeywords: "metaKeywords",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProductVariantScalarFieldEnum = {
  id: "id",
  productId: "productId",
  title: "title",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VariantOptionScalarFieldEnum = {
  id: "id",
  productVariantId: "productVariantId",
  sku: "sku",
  barcode: "barcode",
  price: "price",
  compareAtPrice: "compareAtPrice",
  costPrice: "costPrice",
  stock: "stock",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProductImageScalarFieldEnum = {
  id: "id",
  src: "src",
  publicId: "publicId",
  altText: "altText",
  sortOrder: "sortOrder",
  isPrimary: "isPrimary",
  productId: "productId",
  variantId: "variantId",
  variantOptionId: "variantOptionId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  productId: "productId",
  rating: "rating",
  title: "title",
  comment: "comment",
  isApproved: "isApproved",
  isVerifiedPurchase: "isVerifiedPurchase",
  helpfulVotes: "helpfulVotes",
  notHelpfulVotes: "notHelpfulVotes",
  adminReply: "adminReply",
  adminRepliedAt: "adminRepliedAt",
  adminRepliedBy: "adminRepliedBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  totalPrice: "totalPrice",
  updatedAt: "updatedAt",
  createdAt: "createdAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  productId: "productId",
  variantOptionId: "variantOptionId",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  orderNumber: "orderNumber",
  userId: "userId",
  shippingAddressId: "shippingAddressId",
  billingAddress: "billingAddress",
  status: "status",
  notes: "notes",
  adminNotes: "adminNotes",
  subtotal: "subtotal",
  discountTotal: "discountTotal",
  shippingCost: "shippingCost",
  tax: "tax",
  total: "total",
  couponId: "couponId",
  couponCode: "couponCode",
  placedAt: "placedAt",
  processedAt: "processedAt",
  shippedAt: "shippedAt",
  deliveredAt: "deliveredAt",
  cancelledAt: "cancelledAt",
  returnedAt: "returnedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  variantOptionId: "variantOptionId",
  productId: "productId",
  productName: "productName",
  productSku: "productSku",
  productImage: "productImage",
  variantSnapshot: "variantSnapshot",
  quantity: "quantity",
  unitPrice: "unitPrice",
  discountAmount: "discountAmount",
  total: "total",
  createdAt: "createdAt"
};
var OrderStatusHistoryScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  status: "status",
  note: "note",
  changedBy: "changedBy",
  createdAt: "createdAt"
};
var ShipmentScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  carrier: "carrier",
  trackingNumber: "trackingNumber",
  trackingUrl: "trackingUrl",
  shippingMethod: "shippingMethod",
  estimatedDelivery: "estimatedDelivery",
  actualDelivery: "actualDelivery",
  status: "status",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ShipmentEventScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  status: "status",
  location: "location",
  description: "description",
  occurredAt: "occurredAt",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  method: "method",
  status: "status",
  amount: "amount",
  transactionId: "transactionId",
  gatewayResponse: "gatewayResponse",
  paidAt: "paidAt",
  errorMessage: "errorMessage",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CouponScalarFieldEnum = {
  id: "id",
  code: "code",
  description: "description",
  discountType: "discountType",
  discountValue: "discountValue",
  minPurchase: "minPurchase",
  maxDiscount: "maxDiscount",
  usageLimit: "usageLimit",
  usageCount: "usageCount",
  perUserLimit: "perUserLimit",
  validFrom: "validFrom",
  validUntil: "validUntil",
  isActive: "isActive",
  appliesToAll: "appliesToAll",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CouponProductScalarFieldEnum = {
  couponId: "couponId",
  productId: "productId"
};
var CouponCategoryScalarFieldEnum = {
  couponId: "couponId",
  categoryId: "categoryId"
};
var InventoryTransactionScalarFieldEnum = {
  id: "id",
  variantOptionId: "variantOptionId",
  type: "type",
  quantity: "quantity",
  previousStock: "previousStock",
  newStock: "newStock",
  referenceId: "referenceId",
  referenceType: "referenceType",
  note: "note",
  createdBy: "createdBy",
  createdAt: "createdAt"
};
var WishlistScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  isPublic: "isPublic",
  shareToken: "shareToken",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var WishlistItemScalarFieldEnum = {
  id: "id",
  wishlistId: "wishlistId",
  variantOptionId: "variantOptionId",
  createdAt: "createdAt"
};
var BlogPostScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  excerpt: "excerpt",
  content: "content",
  featuredImage: "featuredImage",
  authorId: "authorId",
  publishedAt: "publishedAt",
  isPublished: "isPublished",
  views: "views",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
  metaKeywords: "metaKeywords",
  allowComments: "allowComments",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlogCategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlogTagScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlogPostCategoryScalarFieldEnum = {
  postId: "postId",
  categoryId: "categoryId"
};
var BlogPostTagScalarFieldEnum = {
  postId: "postId",
  tagId: "tagId"
};
var BlogCommentScalarFieldEnum = {
  id: "id",
  postId: "postId",
  userId: "userId",
  authorName: "authorName",
  authorEmail: "authorEmail",
  content: "content",
  isApproved: "isApproved",
  parentId: "parentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ConversationScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  subject: "subject",
  status: "status",
  assignedTo: "assignedTo",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MessageScalarFieldEnum = {
  id: "id",
  conversationId: "conversationId",
  senderId: "senderId",
  senderRole: "senderRole",
  content: "content",
  attachments: "attachments",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProductViewScalarFieldEnum = {
  id: "id",
  productId: "productId",
  userId: "userId",
  sessionId: "sessionId",
  ip: "ip",
  userAgent: "userAgent",
  referrer: "referrer",
  viewedAt: "viewedAt"
};
var SearchQueryScalarFieldEnum = {
  id: "id",
  query: "query",
  userId: "userId",
  sessionId: "sessionId",
  resultCount: "resultCount",
  filters: "filters",
  createdAt: "createdAt"
};
var ConversionEventScalarFieldEnum = {
  id: "id",
  eventType: "eventType",
  eventId: "eventId",
  userId: "userId",
  sessionId: "sessionId",
  orderId: "orderId",
  productId: "productId",
  value: "value",
  currency: "currency",
  sourceUrl: "sourceUrl",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  sentToMeta: "sentToMeta",
  sentToGa4: "sentToGa4",
  metaLastSentAt: "metaLastSentAt",
  ga4LastSentAt: "ga4LastSentAt",
  attemptCount: "attemptCount",
  lastAttemptAt: "lastAttemptAt",
  lastError: "lastError",
  metadata: "metadata",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
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
import { Router as Router10 } from "express";

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

// src/app/modules/product/product.route.ts
import { Router as Router3 } from "express";

// src/app/modules/product/product.controller.ts
import httpStatus8 from "http-status-codes";

// src/app/modules/product/product.service.ts
import httpStatus7 from "http-status-codes";
var productSearchableFields = ["title", "slug", "brand"];
var allowedSortFields = [
  "createdAt",
  "updatedAt",
  "title",
  "slug",
  "price",
  "isActive",
  "isFeatured"
];
var productImageSelect = {
  id: true,
  src: true,
  publicId: true,
  altText: true,
  sortOrder: true,
  isPrimary: true,
  productId: true,
  variantId: true,
  variantOptionId: true,
  createdAt: true,
  updatedAt: true
};
var variantOptionSelect = {
  id: true,
  productVariantId: true,
  sku: true,
  barcode: true,
  price: true,
  compareAtPrice: true,
  costPrice: true,
  stock: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productImageSelect
  }
};
var productVariantSelect = {
  id: true,
  productId: true,
  title: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productImageSelect
  },
  options: {
    orderBy: [{ createdAt: "asc" }],
    select: variantOptionSelect
  }
};
var productDetailsSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  shortDesc: true,
  brand: true,
  categoryId: true,
  price: true,
  compareAtPrice: true,
  costPrice: true,
  sku: true,
  barcode: true,
  stock: true,
  lowStockThreshold: true,
  hasVariants: true,
  isActive: true,
  isFeatured: true,
  isDigital: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true
    }
  },
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productImageSelect
  },
  variants: {
    orderBy: [{ createdAt: "asc" }],
    select: productVariantSelect
  }
};
var parseBooleanQuery = (value, key) => {
  if (value !== "true" && value !== "false") {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      `${key} query must be true or false`
    );
  }
  return value === "true";
};
var buildOrderBy = (sort) => {
  if (!sort) {
    return [{ createdAt: "desc" }];
  }
  const orderBy = sort.split(",").map((field) => field.trim()).filter(Boolean).map((field) => {
    const direction = field.startsWith("-") ? "desc" : "asc";
    const normalizedField = field.replace(/^-/, "");
    if (!allowedSortFields.includes(
      normalizedField
    )) {
      return null;
    }
    return {
      [normalizedField]: direction
    };
  }).filter(
    (value) => value !== null
  );
  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }
  return orderBy;
};
var buildWhere = (query) => {
  const where = {};
  if (query.searchTerm?.trim()) {
    where.OR = productSearchableFields.map((field) => ({
      [field]: {
        contains: query.searchTerm,
        mode: "insensitive"
      }
    }));
  }
  if (query.categoryId !== void 0) {
    const normalizedCategoryId = query.categoryId.trim().toLowerCase();
    if (!normalizedCategoryId || normalizedCategoryId === "null") {
      where.categoryId = null;
    } else {
      where.categoryId = query.categoryId;
    }
  }
  if (query.brand?.trim()) {
    where.brand = {
      contains: query.brand.trim(),
      mode: "insensitive"
    };
  }
  if (query.isActive !== void 0) {
    where.isActive = parseBooleanQuery(query.isActive, "isActive");
  }
  if (query.hasVariants !== void 0) {
    where.hasVariants = parseBooleanQuery(query.hasVariants, "hasVariants");
  }
  if (query.isFeatured !== void 0) {
    where.isFeatured = parseBooleanQuery(query.isFeatured, "isFeatured");
  }
  return where;
};
var collectVariantSkus = (variants) => {
  if (!variants?.length) {
    return [];
  }
  return variants.flatMap(
    (variant) => variant.options.map((option) => option.sku.trim())
  );
};
var ensureCategoryExists = async (categoryId) => {
  if (!categoryId) {
    return;
  }
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true }
  });
  if (!category) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Category not found");
  }
};
var ensureSlugUnique = async (slug, excludedProductId) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      slug,
      ...excludedProductId && { id: { not: excludedProductId } }
    },
    select: { id: true }
  });
  if (existingProduct) {
    throw new AppError_default(httpStatus7.CONFLICT, "Product slug already exists");
  }
};
var ensureProductSkuUnique = async (sku, excludedId) => {
  if (!sku) {
    return;
  }
  const existingProduct = await prisma.product.findFirst({
    where: {
      sku,
      ...excludedId && { id: { not: excludedId } }
    },
    select: { id: true }
  });
  if (existingProduct) {
    throw new AppError_default(httpStatus7.CONFLICT, "Product SKU already exists");
  }
};
var ensureVariantSkusAvailable = async (skus, currentProductId) => {
  const uniqueSkus = [...new Set(skus)];
  if (!uniqueSkus.length) {
    return;
  }
  const existingOptions = await prisma.variantOption.findMany({
    where: {
      sku: {
        in: uniqueSkus
      }
    },
    select: {
      sku: true,
      variant: {
        select: {
          productId: true
        }
      }
    }
  });
  const conflict = existingOptions.find((option) => {
    if (!currentProductId) {
      return true;
    }
    return option.variant.productId !== currentProductId;
  });
  if (conflict) {
    throw new AppError_default(
      httpStatus7.CONFLICT,
      `Variant option SKU '${conflict.sku}' already exists`
    );
  }
};
var attachImagesToProduct = async (tx, productId, imageIds) => {
  if (!imageIds?.length) {
    return;
  }
  const uniqueImageIds = [...new Set(imageIds)];
  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        productId: true
      }
    });
    if (!image) {
      throw new AppError_default(httpStatus7.BAD_REQUEST, `Image '${imageId}' not found`);
    }
    if (image.productId === productId) {
      continue;
    }
    if (image.productId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { productId }
      });
      continue;
    }
    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        productId
      }
    });
  }
};
var attachImagesToVariant = async (tx, variantId, imageIds) => {
  if (!imageIds?.length) {
    return;
  }
  const uniqueImageIds = [...new Set(imageIds)];
  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        variantId: true
      }
    });
    if (!image) {
      throw new AppError_default(httpStatus7.BAD_REQUEST, `Image '${imageId}' not found`);
    }
    if (image.variantId === variantId) {
      continue;
    }
    if (image.variantId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { variantId }
      });
      continue;
    }
    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        variantId
      }
    });
  }
};
var attachImagesToVariantOption = async (tx, variantOptionId, imageIds) => {
  if (!imageIds?.length) {
    return;
  }
  const uniqueImageIds = [...new Set(imageIds)];
  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        variantOptionId: true
      }
    });
    if (!image) {
      throw new AppError_default(httpStatus7.BAD_REQUEST, `Image '${imageId}' not found`);
    }
    if (image.variantOptionId === variantOptionId) {
      continue;
    }
    if (image.variantOptionId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { variantOptionId }
      });
      continue;
    }
    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        variantOptionId
      }
    });
  }
};
var detachImagesFromProduct = async (tx, productId) => {
  await tx.productImage.updateMany({
    where: { productId },
    data: { productId: null }
  });
};
var detachImagesFromVariants = async (tx, variantIds) => {
  if (!variantIds.length) {
    return;
  }
  await tx.productImage.updateMany({
    where: {
      variantId: {
        in: variantIds
      }
    },
    data: {
      variantId: null
    }
  });
};
var detachImagesFromVariantOptions = async (tx, optionIds) => {
  if (!optionIds.length) {
    return;
  }
  await tx.productImage.updateMany({
    where: {
      variantOptionId: {
        in: optionIds
      }
    },
    data: {
      variantOptionId: null
    }
  });
};
var createVariantTree = async (tx, productId, variants) => {
  for (const variant of variants) {
    const createdVariant = await tx.productVariant.create({
      data: {
        productId,
        title: variant.title,
        isActive: variant.isActive ?? true
      },
      select: {
        id: true
      }
    });
    await attachImagesToVariant(tx, createdVariant.id, variant.imageIds);
    for (const option of variant.options) {
      const createdOption = await tx.variantOption.create({
        data: {
          productVariantId: createdVariant.id,
          sku: option.sku,
          barcode: option.barcode ?? null,
          price: option.price,
          compareAtPrice: option.compareAtPrice ?? null,
          costPrice: option.costPrice ?? null,
          stock: option.stock ?? 0,
          isActive: option.isActive ?? true
        },
        select: {
          id: true
        }
      });
      await attachImagesToVariantOption(tx, createdOption.id, option.imageIds);
    }
  }
};
var createProduct = async (payload) => {
  const hasVariants = payload.hasVariants ?? false;
  const variants = hasVariants ? payload.variants ?? [] : [];
  const productPrice = payload.price ?? null;
  if (hasVariants && !variants.length) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Variants are required when hasVariants is true"
    );
  }
  if (!hasVariants && payload.variants?.length) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Set hasVariants to true to submit variants"
    );
  }
  if (hasVariants && productPrice === null) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Base product price is required when hasVariants is true"
    );
  }
  await Promise.all([
    ensureCategoryExists(payload.categoryId),
    ensureSlugUnique(payload.slug),
    ensureProductSkuUnique(payload.sku),
    ensureVariantSkusAvailable(collectVariantSkus(variants))
  ]);
  const createdProduct = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        description: payload.description ?? null,
        shortDesc: payload.shortDesc ?? null,
        brand: payload.brand ?? null,
        categoryId: payload.categoryId ?? null,
        price: productPrice,
        compareAtPrice: payload.compareAtPrice ?? null,
        costPrice: payload.costPrice ?? null,
        sku: payload.sku ?? null,
        barcode: payload.barcode ?? null,
        stock: payload.stock ?? null,
        lowStockThreshold: payload.lowStockThreshold ?? 5,
        hasVariants,
        isActive: payload.isActive ?? true,
        isFeatured: payload.isFeatured ?? false,
        isDigital: payload.isDigital ?? false,
        metaTitle: payload.metaTitle ?? null,
        metaDescription: payload.metaDescription ?? null,
        metaKeywords: payload.metaKeywords ?? null,
        ...payload.metadata !== void 0 && payload.metadata !== null && {
          metadata: payload.metadata
        }
      },
      select: {
        id: true
      }
    });
    await attachImagesToProduct(tx, product.id, payload.imageIds);
    if (variants.length) {
      await createVariantTree(tx, product.id, variants);
    }
    const fullProduct = await tx.product.findUnique({
      where: { id: product.id },
      select: productDetailsSelect
    });
    if (!fullProduct) {
      throw new AppError_default(httpStatus7.NOT_FOUND, "Product not found");
    }
    return fullProduct;
  });
  return createdProduct;
};
var getProducts = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const where = buildWhere(query);
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: productDetailsSelect
    }),
    prisma.product.count({ where })
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
var getProductById = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: productDetailsSelect
  });
  if (!product) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Product not found");
  }
  return product;
};
var updateProduct = async (productId, payload) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      hasVariants: true,
      price: true
    }
  });
  if (!existingProduct) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Product not found");
  }
  if (payload.hasVariants === true && !payload.variants?.length) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Variants are required when hasVariants is true"
    );
  }
  if (payload.hasVariants === false && payload.variants?.length) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Cannot submit variants when hasVariants is false"
    );
  }
  await Promise.all([
    payload.categoryId !== void 0 ? ensureCategoryExists(payload.categoryId) : Promise.resolve(),
    payload.slug ? ensureSlugUnique(payload.slug, productId) : Promise.resolve(),
    payload.sku !== void 0 ? ensureProductSkuUnique(payload.sku, productId) : Promise.resolve(),
    payload.variants ? ensureVariantSkusAvailable(
      collectVariantSkus(payload.variants),
      productId
    ) : Promise.resolve()
  ]);
  const updatedProduct = await prisma.$transaction(async (tx) => {
    const updateData = {};
    const nextHasVariants = payload.hasVariants !== void 0 ? payload.hasVariants : payload.variants !== void 0 ? payload.variants.length > 0 : existingProduct.hasVariants;
    const nextBasePrice = payload.price !== void 0 ? payload.price : existingProduct.price;
    if (payload.title !== void 0) {
      updateData.title = payload.title;
    }
    if (payload.slug !== void 0) {
      updateData.slug = payload.slug;
    }
    if (payload.description !== void 0) {
      updateData.description = payload.description;
    }
    if (payload.shortDesc !== void 0) {
      updateData.shortDesc = payload.shortDesc;
    }
    if (payload.brand !== void 0) {
      updateData.brand = payload.brand;
    }
    if (payload.categoryId !== void 0) {
      updateData.categoryId = payload.categoryId;
    }
    if (payload.price !== void 0) {
      updateData.price = payload.price;
    }
    if (nextHasVariants && nextBasePrice === null) {
      throw new AppError_default(
        httpStatus7.BAD_REQUEST,
        "Base product price is required when hasVariants is true"
      );
    }
    if (payload.compareAtPrice !== void 0) {
      updateData.compareAtPrice = payload.compareAtPrice;
    }
    if (payload.costPrice !== void 0) {
      updateData.costPrice = payload.costPrice;
    }
    if (payload.sku !== void 0) {
      updateData.sku = payload.sku;
    }
    if (payload.barcode !== void 0) {
      updateData.barcode = payload.barcode;
    }
    if (payload.stock !== void 0) {
      updateData.stock = payload.stock;
    }
    if (payload.lowStockThreshold !== void 0) {
      updateData.lowStockThreshold = payload.lowStockThreshold;
    }
    if (payload.hasVariants !== void 0) {
      updateData.hasVariants = payload.hasVariants;
    }
    if (payload.isActive !== void 0) {
      updateData.isActive = payload.isActive;
    }
    if (payload.isFeatured !== void 0) {
      updateData.isFeatured = payload.isFeatured;
    }
    if (payload.isDigital !== void 0) {
      updateData.isDigital = payload.isDigital;
    }
    if (payload.metaTitle !== void 0) {
      updateData.metaTitle = payload.metaTitle;
    }
    if (payload.metaDescription !== void 0) {
      updateData.metaDescription = payload.metaDescription;
    }
    if (payload.metaKeywords !== void 0) {
      updateData.metaKeywords = payload.metaKeywords;
    }
    if (payload.metadata !== void 0 && payload.metadata !== null) {
      updateData.metadata = payload.metadata;
    }
    if (payload.variants !== void 0 && payload.hasVariants === void 0) {
      updateData.hasVariants = payload.variants.length > 0;
    }
    if (Object.keys(updateData).length) {
      await tx.product.update({
        where: { id: productId },
        data: updateData
      });
    }
    if (payload.imageIds !== void 0) {
      await detachImagesFromProduct(tx, productId);
      await attachImagesToProduct(tx, productId, payload.imageIds);
    }
    const shouldReplaceVariants = payload.variants !== void 0 || payload.hasVariants === false;
    if (shouldReplaceVariants) {
      const existingVariants = await tx.productVariant.findMany({
        where: { productId },
        select: {
          id: true,
          options: {
            select: { id: true }
          }
        }
      });
      const existingVariantIds = existingVariants.map((variant) => variant.id);
      const existingOptionIds = existingVariants.flatMap(
        (variant) => variant.options.map((option) => option.id)
      );
      await detachImagesFromVariantOptions(tx, existingOptionIds);
      await detachImagesFromVariants(tx, existingVariantIds);
      await tx.productVariant.deleteMany({
        where: { productId }
      });
      const nextVariants = payload.variants ?? [];
      if (nextVariants.length) {
        await createVariantTree(tx, productId, nextVariants);
      }
    }
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: productDetailsSelect
    });
    if (!product) {
      throw new AppError_default(httpStatus7.NOT_FOUND, "Product not found");
    }
    return product;
  });
  return updatedProduct;
};
var deleteProduct = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!product) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Product not found");
  }
  await prisma.$transaction(async (tx) => {
    const variants = await tx.productVariant.findMany({
      where: { productId },
      select: {
        id: true,
        options: {
          select: { id: true }
        }
      }
    });
    const variantIds = variants.map((variant) => variant.id);
    const optionIds = variants.flatMap(
      (variant) => variant.options.map((option) => option.id)
    );
    await detachImagesFromVariantOptions(tx, optionIds);
    await detachImagesFromVariants(tx, variantIds);
    await detachImagesFromProduct(tx, productId);
    await tx.product.delete({
      where: { id: productId }
    });
  });
};
var ProductService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

// src/app/modules/product/product.controller.ts
var getParamAsString2 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus8.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var createProduct2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await ProductService.createProduct(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.CREATED,
    message: "Product created successfully",
    data: result
  });
});
var getProducts2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ProductService.getProducts(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Products retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getProductById2 = catchAsync(async (req, res) => {
  const productId = getParamAsString2(req.params.id, "Product id");
  const result = await ProductService.getProductById(productId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Product retrieved successfully",
    data: result
  });
});
var updateProduct2 = catchAsync(async (req, res) => {
  const productId = getParamAsString2(req.params.id, "Product id");
  const payload = req.body;
  const result = await ProductService.updateProduct(productId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Product updated successfully",
    data: result
  });
});
var deleteProduct2 = catchAsync(async (req, res) => {
  const productId = getParamAsString2(req.params.id, "Product id");
  await ProductService.deleteProduct(productId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Product deleted successfully",
    data: null
  });
});
var ProductControllers = {
  createProduct: createProduct2,
  getProducts: getProducts2,
  getProductById: getProductById2,
  updateProduct: updateProduct2,
  deleteProduct: deleteProduct2
};

// src/app/modules/product/product.validation.ts
import { z as z3 } from "zod";
var slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var optionalText = (max) => z3.string().trim().min(1, { message: "Value cannot be empty" }).max(max, { message: `Value cannot exceed ${max} characters` }).optional();
var nullableUuidSchema = z3.preprocess(
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
var imageIdsZodSchema = z3.array(z3.string().uuid({ message: "Each image id must be a valid UUID" })).optional().superRefine((ids, ctx) => {
  if (!ids?.length) {
    return;
  }
  const seen = /* @__PURE__ */ new Set();
  ids.forEach((id, index) => {
    if (seen.has(id)) {
      ctx.addIssue({
        code: z3.ZodIssueCode.custom,
        path: [index],
        message: "Duplicate image id is not allowed"
      });
      return;
    }
    seen.add(id);
  });
});
var variantOptionInputZodSchema = z3.object({
  sku: z3.string().trim().min(1, { message: "Option SKU is required" }).max(100, { message: "Option SKU cannot exceed 100 characters" }),
  barcode: optionalText(100),
  price: z3.coerce.number().min(0, { message: "Variant additional price cannot be negative" }),
  compareAtPrice: z3.coerce.number().min(0, { message: "Compare at price cannot be negative" }).optional(),
  costPrice: z3.coerce.number().min(0, { message: "Cost price cannot be negative" }).optional(),
  stock: z3.coerce.number().int({ message: "Stock must be an integer" }).min(0, { message: "Stock cannot be negative" }).optional(),
  isActive: z3.coerce.boolean().optional(),
  imageIds: imageIdsZodSchema
}).superRefine((option, ctx) => {
  if (option.compareAtPrice !== void 0 && option.compareAtPrice < option.price) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      path: ["compareAtPrice"],
      message: "Compare at price must be greater than or equal to price"
    });
  }
});
var productVariantInputZodSchema = z3.object({
  title: z3.string().trim().min(1, { message: "Variant title is required" }).max(150, { message: "Variant title cannot exceed 150 characters" }),
  isActive: z3.coerce.boolean().optional(),
  imageIds: imageIdsZodSchema,
  options: z3.array(variantOptionInputZodSchema).min(1, { message: "At least one option is required for each variant" })
});
var validateVariantSkus = (variants, ctx) => {
  if (!variants?.length) {
    return;
  }
  const seenSkus = /* @__PURE__ */ new Set();
  variants.forEach((variant, variantIndex) => {
    variant.options.forEach((option, optionIndex) => {
      const normalizedSku = option.sku.trim().toLowerCase();
      if (seenSkus.has(normalizedSku)) {
        ctx.addIssue({
          code: z3.ZodIssueCode.custom,
          path: ["variants", variantIndex, "options", optionIndex, "sku"],
          message: "Duplicate SKU found in variants payload"
        });
        return;
      }
      seenSkus.add(normalizedSku);
    });
  });
};
var createProductZodSchema = z3.object({
  title: z3.string().trim().min(2, { message: "Title must be at least 2 characters long" }).max(255, { message: "Title cannot exceed 255 characters" }),
  slug: z3.string().trim().min(2, { message: "Slug must be at least 2 characters long" }).max(255, { message: "Slug cannot exceed 255 characters" }).regex(slugRegex, {
    message: "Slug can contain lowercase letters, numbers, and single hyphens only"
  }),
  description: optionalText(5e3),
  shortDesc: optionalText(500),
  brand: optionalText(100),
  categoryId: nullableUuidSchema,
  price: z3.coerce.number().min(0, { message: "Base product price cannot be negative" }).optional(),
  compareAtPrice: z3.coerce.number().min(0, { message: "Compare at price cannot be negative" }).optional(),
  costPrice: z3.coerce.number().min(0, { message: "Cost price cannot be negative" }).optional(),
  sku: optionalText(100),
  barcode: optionalText(100),
  stock: z3.coerce.number().int({ message: "Stock must be an integer" }).min(0, { message: "Stock cannot be negative" }).optional(),
  lowStockThreshold: z3.coerce.number().int({ message: "Low stock threshold must be an integer" }).min(0, { message: "Low stock threshold cannot be negative" }).optional(),
  hasVariants: z3.coerce.boolean().optional(),
  isActive: z3.coerce.boolean().optional(),
  isFeatured: z3.coerce.boolean().optional(),
  isDigital: z3.coerce.boolean().optional(),
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  metaKeywords: optionalText(500),
  metadata: z3.unknown().optional(),
  imageIds: imageIdsZodSchema,
  variants: z3.array(productVariantInputZodSchema).optional()
}).superRefine((payload, ctx) => {
  const hasVariants = payload.hasVariants ?? false;
  if (hasVariants && !payload.variants?.length) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      path: ["variants"],
      message: "Variants are required when hasVariants is true"
    });
  }
  if (hasVariants && payload.price === void 0) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      path: ["price"],
      message: "Base product price is required when hasVariants is true"
    });
  }
  if (!hasVariants && payload.variants?.length) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      path: ["hasVariants"],
      message: "Set hasVariants to true to submit variants"
    });
  }
  if (payload.compareAtPrice !== void 0 && payload.price !== void 0) {
    if (payload.compareAtPrice < payload.price) {
      ctx.addIssue({
        code: z3.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message: "Compare at price must be greater than or equal to price"
      });
    }
  }
  validateVariantSkus(payload.variants, ctx);
});
var updateProductZodSchema = z3.object({
  title: z3.string().trim().min(2, { message: "Title must be at least 2 characters long" }).max(255, { message: "Title cannot exceed 255 characters" }).optional(),
  slug: z3.string().trim().min(2, { message: "Slug must be at least 2 characters long" }).max(255, { message: "Slug cannot exceed 255 characters" }).regex(slugRegex, {
    message: "Slug can contain lowercase letters, numbers, and single hyphens only"
  }).optional(),
  description: optionalText(5e3),
  shortDesc: optionalText(500),
  brand: optionalText(100),
  categoryId: nullableUuidSchema,
  price: z3.coerce.number().min(0, { message: "Base product price cannot be negative" }).optional(),
  compareAtPrice: z3.coerce.number().min(0, { message: "Compare at price cannot be negative" }).optional(),
  costPrice: z3.coerce.number().min(0, { message: "Cost price cannot be negative" }).optional(),
  sku: optionalText(100),
  barcode: optionalText(100),
  stock: z3.coerce.number().int({ message: "Stock must be an integer" }).min(0, { message: "Stock cannot be negative" }).optional(),
  lowStockThreshold: z3.coerce.number().int({ message: "Low stock threshold must be an integer" }).min(0, { message: "Low stock threshold cannot be negative" }).optional(),
  hasVariants: z3.coerce.boolean().optional(),
  isActive: z3.coerce.boolean().optional(),
  isFeatured: z3.coerce.boolean().optional(),
  isDigital: z3.coerce.boolean().optional(),
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  metaKeywords: optionalText(500),
  metadata: z3.unknown().optional(),
  imageIds: imageIdsZodSchema,
  variants: z3.array(productVariantInputZodSchema).optional()
}).superRefine((payload, ctx) => {
  if (Object.keys(payload).length === 0) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      message: "At least one field is required for update"
    });
  }
  if (payload.hasVariants === true && !payload.variants?.length) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      path: ["variants"],
      message: "Variants are required when hasVariants is true"
    });
  }
  if (payload.hasVariants === false && payload.variants?.length) {
    ctx.addIssue({
      code: z3.ZodIssueCode.custom,
      path: ["hasVariants"],
      message: "Cannot submit variants while hasVariants is false"
    });
  }
  if (payload.compareAtPrice !== void 0 && payload.price !== void 0) {
    if (payload.compareAtPrice < payload.price) {
      ctx.addIssue({
        code: z3.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message: "Compare at price must be greater than or equal to price"
      });
    }
  }
  validateVariantSkus(payload.variants, ctx);
});

// src/app/modules/product/product.route.ts
var router3 = Router3();
router3.post(
  "/",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  validateRequest(createProductZodSchema),
  ProductControllers.createProduct
);
router3.get("/", ProductControllers.getProducts);
router3.get("/:id", ProductControllers.getProductById);
router3.patch(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  validateRequest(updateProductZodSchema),
  ProductControllers.updateProduct
);
router3.delete("/:id", checkAuth("ADMIN" /* ADMIN */), ProductControllers.deleteProduct);
var ProductRoutes = router3;

// src/app/modules/category/category.route.ts
import { Router as Router4 } from "express";

// src/app/modules/category/category.controller.ts
import httpStatus10 from "http-status-codes";

// src/app/modules/category/category.service.ts
import httpStatus9 from "http-status-codes";

// src/app/modules/category/category.constant.ts
var categorySearchableFields = ["name", "slug"];

// src/app/modules/category/category.service.ts
var categoryImageSelect = {
  id: true,
  src: true,
  publicId: true,
  altText: true,
  sortOrder: true,
  isPrimary: true,
  productId: true,
  variantId: true,
  variantOptionId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true
};
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
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: categoryImageSelect
  },
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
    throw new AppError_default(httpStatus9.NOT_FOUND, "Parent category not found");
  }
};
var ensureSlugUnique2 = async (slug, excludedCategoryId) => {
  const existing = await prisma.category.findFirst({
    where: {
      slug,
      ...excludedCategoryId && { id: { not: excludedCategoryId } }
    },
    select: { id: true }
  });
  if (existing) {
    throw new AppError_default(httpStatus9.CONFLICT, "Category slug already exists");
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
      httpStatus9.CONFLICT,
      "Category name already exists under this parent"
    );
  }
};
var ensureNoCircularParent = async (categoryId, nextParentId) => {
  let currentParentId = nextParentId;
  while (currentParentId) {
    if (currentParentId === categoryId) {
      throw new AppError_default(
        httpStatus9.BAD_REQUEST,
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
var attachImagesToCategory = async (tx, categoryId, imageIds) => {
  if (!imageIds?.length) {
    return;
  }
  const uniqueImageIds = [...new Set(imageIds)];
  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        categoryId: true
      }
    });
    if (!image) {
      throw new AppError_default(httpStatus9.BAD_REQUEST, `Image '${imageId}' not found`);
    }
    if (image.categoryId === categoryId) {
      continue;
    }
    if (image.categoryId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { categoryId }
      });
      continue;
    }
    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        categoryId
      }
    });
  }
};
var buildOrderBy2 = (sort) => {
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
var buildWhere2 = (query) => {
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
        httpStatus9.BAD_REQUEST,
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
    ensureSlugUnique2(payload.slug),
    ensureNameUniqueWithinParent(payload.name, parentId)
  ]);
  const createdCategory = await prisma.$transaction(async (tx) => {
    const category = await tx.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        ...payload.description !== void 0 && {
          description: payload.description
        },
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
      select: {
        id: true
      }
    });
    await attachImagesToCategory(tx, category.id, payload.imageIds);
    const fullCategory = await tx.category.findUnique({
      where: { id: category.id },
      select: categoryDetailsSelect
    });
    if (!fullCategory) {
      throw new AppError_default(httpStatus9.NOT_FOUND, "Category not found");
    }
    return fullCategory;
  });
  return createdCategory;
};
var getCategories = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const where = buildWhere2(query);
  const orderBy = buildOrderBy2(query.sort);
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
    throw new AppError_default(httpStatus9.NOT_FOUND, "Category not found");
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
    throw new AppError_default(httpStatus9.NOT_FOUND, "Category not found");
  }
  if (Object.keys(payload).length === 0) {
    throw new AppError_default(
      httpStatus9.BAD_REQUEST,
      "At least one field is required to update category"
    );
  }
  if (payload.parentId !== void 0 && payload.parentId === categoryId) {
    throw new AppError_default(
      httpStatus9.BAD_REQUEST,
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
    await ensureSlugUnique2(payload.slug, categoryId);
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
  const updatedCategory = await prisma.$transaction(async (tx) => {
    if (Object.keys(updateData).length > 0) {
      await tx.category.update({
        where: { id: categoryId },
        data: updateData
      });
    }
    if (payload.imageIds !== void 0) {
      await tx.productImage.updateMany({
        where: { categoryId },
        data: { categoryId: null }
      });
      await attachImagesToCategory(tx, categoryId, payload.imageIds);
    }
    const category = await tx.category.findUnique({
      where: { id: categoryId },
      select: categoryDetailsSelect
    });
    if (!category) {
      throw new AppError_default(httpStatus9.NOT_FOUND, "Category not found");
    }
    return category;
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
var getParamAsString3 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus10.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var createCategory2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await CategoryService.createCategory(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.CREATED,
    message: "Category created successfully",
    data: result
  });
});
var getCategories2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CategoryService.getCategories(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
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
    statusCode: httpStatus10.OK,
    message: "Collections retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getCategoryById2 = catchAsync(async (req, res) => {
  const categoryId = getParamAsString3(req.params.id, "Category id");
  const result = await CategoryService.getCategoryById(categoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Category retrieved successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const categoryId = getParamAsString3(req.params.id, "Category id");
  const payload = req.body;
  const result = await CategoryService.updateCategory(categoryId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
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
import { z as z4 } from "zod";
var slugRegex2 = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var optionalText2 = (max) => z4.string().trim().min(1, { message: "Value cannot be empty" }).max(max, { message: `Value cannot exceed ${max} characters` }).optional();
var optionalParentIdSchema = z4.preprocess(
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
  z4.string().uuid().nullable().optional()
);
var imageIdsZodSchema2 = z4.array(z4.string().uuid({ message: "Each image id must be a valid UUID" })).optional().superRefine((ids, ctx) => {
  if (!ids?.length) {
    return;
  }
  const seen = /* @__PURE__ */ new Set();
  ids.forEach((id, index) => {
    if (seen.has(id)) {
      ctx.addIssue({
        code: z4.ZodIssueCode.custom,
        path: [index],
        message: "Duplicate image id is not allowed"
      });
      return;
    }
    seen.add(id);
  });
});
var createCategoryZodSchema = z4.object({
  name: z4.string().trim().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name cannot exceed 100 characters" }),
  slug: z4.string().trim().min(2, { message: "Slug must be at least 2 characters long" }).max(100, { message: "Slug cannot exceed 100 characters" }).regex(slugRegex2, {
    message: "Slug can contain lowercase letters, numbers, and single hyphens only"
  }),
  description: optionalText2(1e3),
  image: optionalText2(500),
  imageIds: imageIdsZodSchema2,
  isActive: z4.coerce.boolean().optional(),
  sortOrder: z4.coerce.number().int({ message: "Sort order must be an integer" }).min(0, { message: "Sort order cannot be negative" }).optional(),
  parentId: optionalParentIdSchema,
  metaTitle: optionalText2(255),
  metaDescription: optionalText2(500),
  metaKeywords: optionalText2(500)
});
var updateCategoryZodSchema = z4.object({
  name: z4.string().trim().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name cannot exceed 100 characters" }).optional(),
  slug: z4.string().trim().min(2, { message: "Slug must be at least 2 characters long" }).max(100, { message: "Slug cannot exceed 100 characters" }).regex(slugRegex2, {
    message: "Slug can contain lowercase letters, numbers, and single hyphens only"
  }).optional(),
  description: optionalText2(1e3),
  image: optionalText2(500),
  imageIds: imageIdsZodSchema2,
  isActive: z4.coerce.boolean().optional(),
  sortOrder: z4.coerce.number().int({ message: "Sort order must be an integer" }).min(0, { message: "Sort order cannot be negative" }).optional(),
  parentId: optionalParentIdSchema,
  metaTitle: optionalText2(255),
  metaDescription: optionalText2(500),
  metaKeywords: optionalText2(500)
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one field is required for update"
});

// src/app/modules/category/category.route.ts
var router4 = Router4();
router4.post(
  "/",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(createCategoryZodSchema),
  CategoryControllers.createCategory
);
router4.get(
  "/",
  checkAuth(...Object.values(Role)),
  CategoryControllers.getCategories
);
router4.get("/collections", CategoryControllers.getPublicCollections);
router4.patch(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(updateCategoryZodSchema),
  CategoryControllers.updateCategory
);
router4.get(
  "/:id",
  CategoryControllers.getCategoryById
);
var CategoryRoutes = router4;

// src/app/modules/image/image.route.ts
import { Router as Router5 } from "express";

// src/app/middlewares/uploadImages.ts
import path4 from "path";
import { v4 as uuidv42 } from "uuid";
import httpStatus13 from "http-status-codes";

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
import httpStatus11 from "http-status-codes";
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
    cb(new AppError_default(httpStatus11.BAD_REQUEST, "Only image/video files are allowed"));
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
import httpStatus12 from "http-status-codes";
var supabaseClient = null;
var getSupabaseClient = () => {
  if (!envVars.SUPABASE_URL || !envVars.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError_default(
      httpStatus12.INTERNAL_SERVER_ERROR,
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
      httpStatus12.INTERNAL_SERVER_ERROR,
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
      httpStatus13.BAD_REQUEST,
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
      httpStatus13.BAD_REQUEST,
      "For storageType=link, provide mediaUrl or mediaUrls[]"
    );
  }
  mediaUrls.forEach((url) => {
    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      throw new AppError_default(
        httpStatus13.BAD_REQUEST,
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
        httpStatus13.BAD_REQUEST,
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
          httpStatus13.BAD_REQUEST,
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
import httpStatus15 from "http-status-codes";

// src/app/modules/image/image.service.ts
import httpStatus14 from "http-status-codes";

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
  variantId: true,
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
  const [product, variant, variantOption, category] = await Promise.all([
    payload.productId ? prisma.product.findUnique({
      where: { id: payload.productId },
      select: { id: true }
    }) : Promise.resolve(null),
    payload.variantId ? prisma.productVariant.findUnique({
      where: { id: payload.variantId },
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
    throw new AppError_default(httpStatus14.NOT_FOUND, "Product not found");
  }
  if (payload.variantId && !variant) {
    throw new AppError_default(httpStatus14.NOT_FOUND, "Variant not found");
  }
  if (payload.variantOptionId && !variantOption) {
    throw new AppError_default(httpStatus14.NOT_FOUND, "Variant option not found");
  }
  if (payload.categoryId && !category) {
    throw new AppError_default(httpStatus14.NOT_FOUND, "Category not found");
  }
};
var createImages = async (payload) => {
  if (!payload.images.length) {
    throw new AppError_default(httpStatus14.BAD_REQUEST, "Media files are required");
  }
  await ensureRelationsExist(payload);
  const createdImages = await prisma.productImage.createManyAndReturn({
    data: payload.images.map((media) => ({
      src: media.src,
      publicId: media.publicId ?? null,
      altText: media.altText ?? null,
      isPrimary: media.isPrimary ?? false,
      productId: payload.productId ?? null,
      variantId: payload.variantId ?? null,
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
    throw new AppError_default(httpStatus14.NOT_FOUND, "Media not found");
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
var getParamAsString4 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus15.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var createImages2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const uploadedImages = req.uploadedImages ?? [];
  if (!uploadedImages.length) {
    throw new AppError_default(httpStatus15.BAD_REQUEST, "No media received");
  }
  const createPayload = {
    ...payload.productId !== void 0 && { productId: payload.productId },
    ...payload.variantId !== void 0 && { variantId: payload.variantId },
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
    statusCode: httpStatus15.CREATED,
    success: true,
    message: "Media uploaded successfully",
    data: result
  });
});
var getAllImages2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ImageService.getAllImages(query);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result
  });
});
var deleteImage2 = catchAsync(async (req, res) => {
  const imageId = getParamAsString4(req.params.id, "Image id");
  await ImageService.deleteImage(imageId);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
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
import { z as z5 } from "zod";
var uuidSchema = z5.string().uuid();
var mediaUrlsSchema = z5.preprocess((value) => {
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
}, z5.array(z5.string().url({ message: "Each media URL must be valid" })).optional());
var createMediaZodSchema = z5.object({
  productId: uuidSchema.optional(),
  variantId: uuidSchema.optional(),
  variantOptionId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
  altText: z5.string().min(1, { message: "altText cannot be empty" }).max(255, { message: "altText cannot exceed 255 characters" }).optional(),
  isPrimary: z5.coerce.boolean().optional(),
  mediaUrl: z5.string().url({ message: "mediaUrl must be a valid URL" }).optional(),
  mediaUrls: mediaUrlsSchema
});

// src/app/modules/image/image.route.ts
var router5 = Router5();
router5.post(
  "/upload",
  checkAuth("ADMIN" /* ADMIN */),
  uploadImages,
  validateRequest(createMediaZodSchema),
  ImageController.createImages
);
router5.get("/", checkAuth("ADMIN" /* ADMIN */), ImageController.getAllImages);
router5.delete("/:id", checkAuth("ADMIN" /* ADMIN */), ImageController.deleteImage);
var ImageRoutes = router5;

// src/app/modules/cart/cart.route.ts
import { Router as Router6 } from "express";

// src/app/modules/cart/cart.controller.ts
import httpStatus17 from "http-status-codes";

// src/app/modules/cart/cart.service.ts
import httpStatus16 from "http-status-codes";
var cartItemImageSelect = {
  id: true,
  src: true,
  altText: true,
  isPrimary: true,
  sortOrder: true
};
var cartSelect = {
  id: true,
  userId: true,
  totalPrice: true,
  createdAt: true,
  updatedAt: true,
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
      cartId: true,
      productId: true,
      variantOptionId: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          isActive: true,
          images: {
            where: {
              isPrimary: true
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: cartItemImageSelect
          }
        }
      },
      option: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          isActive: true,
          images: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: cartItemImageSelect
          },
          variant: {
            select: {
              id: true,
              title: true,
              isActive: true,
              productId: true
            }
          }
        }
      }
    }
  }
};
var decimalFrom = (value) => {
  if (value instanceof prismaNamespace_exports.Decimal) {
    return value;
  }
  if (value === null || value === void 0) {
    return new prismaNamespace_exports.Decimal(0);
  }
  return new prismaNamespace_exports.Decimal(value);
};
var toMoneyString = (value) => value.toFixed(2);
var computeUnitPrice = (item) => {
  const basePrice = decimalFrom(item.product.price);
  const variantAdditionalPrice = decimalFrom(item.option.price);
  const unitPrice = basePrice.add(variantAdditionalPrice);
  return {
    basePrice,
    variantAdditionalPrice,
    unitPrice
  };
};
var mapCartResponse = (cart) => {
  const items = cart.items.map((item) => {
    const { basePrice, variantAdditionalPrice, unitPrice } = computeUnitPrice(item);
    const lineTotal = unitPrice.mul(item.quantity);
    return {
      ...item,
      pricing: {
        basePrice: toMoneyString(basePrice),
        variantAdditionalPrice: toMoneyString(variantAdditionalPrice),
        unitPrice: toMoneyString(unitPrice),
        lineTotal: toMoneyString(lineTotal)
      }
    };
  });
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    ...cart,
    totalPrice: toMoneyString(decimalFrom(cart.totalPrice)),
    totalItems,
    items
  };
};
var getOrCreateCart = async (tx, userId) => {
  const cart = await tx.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: {
      id: true
    }
  });
  return cart;
};
var refreshCartTotalPrice = async (tx, cartId) => {
  const cartItems = await tx.cartItem.findMany({
    where: { cartId },
    select: {
      quantity: true,
      option: {
        select: {
          price: true,
          variant: {
            select: {
              product: {
                select: {
                  price: true
                }
              }
            }
          }
        }
      }
    }
  });
  let totalPrice = new prismaNamespace_exports.Decimal(0);
  cartItems.forEach((item) => {
    const basePrice = decimalFrom(item.option.variant.product.price);
    const variantAdditionalPrice = decimalFrom(item.option.price);
    const lineTotal = basePrice.add(variantAdditionalPrice).mul(item.quantity);
    totalPrice = totalPrice.add(lineTotal);
  });
  await tx.cart.update({
    where: { id: cartId },
    data: {
      totalPrice
    }
  });
};
var getOptionForCart = async (variantOptionId) => {
  const option = await prisma.variantOption.findUnique({
    where: {
      id: variantOptionId
    },
    select: {
      id: true,
      stock: true,
      isActive: true,
      variant: {
        select: {
          id: true,
          title: true,
          productId: true,
          isActive: true,
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              isActive: true,
              price: true
            }
          }
        }
      }
    }
  });
  if (!option) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Variant option not found");
  }
  return option;
};
var ensureOptionCanBeAdded = (payload, option) => {
  if (option.variant.productId !== payload.productId) {
    throw new AppError_default(
      httpStatus16.BAD_REQUEST,
      "Selected variant option does not belong to the provided product"
    );
  }
  if (!option.variant.product.isActive) {
    throw new AppError_default(httpStatus16.BAD_REQUEST, "Product is inactive");
  }
  if (!option.variant.isActive) {
    throw new AppError_default(httpStatus16.BAD_REQUEST, "Variant is inactive");
  }
  if (!option.isActive) {
    throw new AppError_default(httpStatus16.BAD_REQUEST, "Variant option is inactive");
  }
};
var ensureStockAvailable = (stock, quantity, actionLabel) => {
  if (stock < quantity) {
    throw new AppError_default(
      httpStatus16.BAD_REQUEST,
      `Insufficient stock to ${actionLabel}. Available stock is ${stock}`
    );
  }
};
var getMyCart = async (userId) => {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: cartSelect
  });
  return mapCartResponse(cart);
};
var addItemToCart = async (userId, payload) => {
  const quantity = payload.quantity ?? 1;
  const option = await getOptionForCart(payload.variantOptionId);
  ensureOptionCanBeAdded(payload, option);
  const updatedCart = await prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(tx, userId);
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_variantOptionId: {
          cartId: cart.id,
          variantOptionId: payload.variantOptionId
        }
      },
      select: {
        id: true,
        quantity: true
      }
    });
    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;
      ensureStockAvailable(option.stock, nextQuantity, "increase cart item quantity");
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: nextQuantity,
          productId: payload.productId
        }
      });
    } else {
      ensureStockAvailable(option.stock, quantity, "add this item");
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId: payload.productId,
          variantOptionId: payload.variantOptionId,
          quantity
        }
      });
    }
    await refreshCartTotalPrice(tx, cart.id);
    const fullCart = await tx.cart.findUnique({
      where: { id: cart.id },
      select: cartSelect
    });
    if (!fullCart) {
      throw new AppError_default(httpStatus16.NOT_FOUND, "Cart not found");
    }
    return fullCart;
  });
  return mapCartResponse(updatedCart);
};
var updateCartItemQuantity = async (userId, itemId, payload) => {
  const updatedCart = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId
        }
      },
      select: {
        id: true,
        cartId: true,
        option: {
          select: {
            stock: true,
            isActive: true,
            variant: {
              select: {
                isActive: true,
                product: {
                  select: {
                    isActive: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!cartItem) {
      throw new AppError_default(httpStatus16.NOT_FOUND, "Cart item not found");
    }
    if (!cartItem.option.variant.product.isActive) {
      throw new AppError_default(httpStatus16.BAD_REQUEST, "Product is inactive");
    }
    if (!cartItem.option.variant.isActive) {
      throw new AppError_default(httpStatus16.BAD_REQUEST, "Variant is inactive");
    }
    if (!cartItem.option.isActive) {
      throw new AppError_default(httpStatus16.BAD_REQUEST, "Variant option is inactive");
    }
    ensureStockAvailable(cartItem.option.stock, payload.quantity, "update quantity");
    await tx.cartItem.update({
      where: {
        id: cartItem.id
      },
      data: {
        quantity: payload.quantity
      }
    });
    await refreshCartTotalPrice(tx, cartItem.cartId);
    const fullCart = await tx.cart.findUnique({
      where: { id: cartItem.cartId },
      select: cartSelect
    });
    if (!fullCart) {
      throw new AppError_default(httpStatus16.NOT_FOUND, "Cart not found");
    }
    return fullCart;
  });
  return mapCartResponse(updatedCart);
};
var removeCartItem = async (userId, itemId) => {
  const updatedCart = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId
        }
      },
      select: {
        id: true,
        cartId: true
      }
    });
    if (!cartItem) {
      throw new AppError_default(httpStatus16.NOT_FOUND, "Cart item not found");
    }
    await tx.cartItem.delete({
      where: {
        id: cartItem.id
      }
    });
    await refreshCartTotalPrice(tx, cartItem.cartId);
    const fullCart = await tx.cart.findUnique({
      where: { id: cartItem.cartId },
      select: cartSelect
    });
    if (!fullCart) {
      throw new AppError_default(httpStatus16.NOT_FOUND, "Cart not found");
    }
    return fullCart;
  });
  return mapCartResponse(updatedCart);
};
var clearMyCart = async (userId) => {
  const clearedCart = await prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(tx, userId);
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });
    await tx.cart.update({
      where: {
        id: cart.id
      },
      data: {
        totalPrice: new prismaNamespace_exports.Decimal(0)
      }
    });
    const fullCart = await tx.cart.findUnique({
      where: {
        id: cart.id
      },
      select: cartSelect
    });
    if (!fullCart) {
      throw new AppError_default(httpStatus16.NOT_FOUND, "Cart not found");
    }
    return fullCart;
  });
  return mapCartResponse(clearedCart);
};
var CartService = {
  getMyCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart
};

// src/app/modules/cart/cart.controller.ts
var getParamAsString5 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus17.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var getAuthenticatedUserId = (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus17.UNAUTHORIZED, "User not authenticated");
  }
  return userId;
};
var getMyCart2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const result = await CartService.getMyCart(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Cart retrieved successfully",
    data: result
  });
});
var addItemToCart2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const payload = req.body;
  const result = await CartService.addItemToCart(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Item added to cart successfully",
    data: result
  });
});
var updateCartItemQuantity2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const itemId = getParamAsString5(req.params.itemId, "Cart item id");
  const payload = req.body;
  const result = await CartService.updateCartItemQuantity(userId, itemId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Cart item updated successfully",
    data: result
  });
});
var removeCartItem2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const itemId = getParamAsString5(req.params.itemId, "Cart item id");
  const result = await CartService.removeCartItem(userId, itemId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Cart item removed successfully",
    data: result
  });
});
var clearMyCart2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const result = await CartService.clearMyCart(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Cart cleared successfully",
    data: result
  });
});
var CartControllers = {
  getMyCart: getMyCart2,
  addItemToCart: addItemToCart2,
  updateCartItemQuantity: updateCartItemQuantity2,
  removeCartItem: removeCartItem2,
  clearMyCart: clearMyCart2
};

// src/app/modules/cart/cart.validation.ts
import { z as z6 } from "zod";
var addCartItemZodSchema = z6.object({
  productId: z6.string().uuid({ message: "productId must be a valid UUID" }),
  variantOptionId: z6.string().uuid({ message: "variantOptionId must be a valid UUID" }),
  quantity: z6.coerce.number().int({ message: "quantity must be an integer" }).min(1, { message: "quantity must be at least 1" }).max(100, { message: "quantity cannot exceed 100" }).optional()
});
var updateCartItemZodSchema = z6.object({
  quantity: z6.coerce.number().int({ message: "quantity must be an integer" }).min(1, { message: "quantity must be at least 1" }).max(100, { message: "quantity cannot exceed 100" })
});

// src/app/modules/cart/cart.route.ts
var router6 = Router6();
router6.get("/", checkAuth(...Object.values(Role)), CartControllers.getMyCart);
router6.post(
  "/items",
  checkAuth(...Object.values(Role)),
  validateRequest(addCartItemZodSchema),
  CartControllers.addItemToCart
);
router6.patch(
  "/items/:itemId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateCartItemZodSchema),
  CartControllers.updateCartItemQuantity
);
router6.delete(
  "/items/:itemId",
  checkAuth(...Object.values(Role)),
  CartControllers.removeCartItem
);
router6.delete(
  "/clear",
  checkAuth(...Object.values(Role)),
  CartControllers.clearMyCart
);
var CartRoutes = router6;

// src/app/modules/tracking/tracking.route.ts
import { Router as Router7 } from "express";

// src/app/modules/tracking/tracking.controller.ts
import httpStatus19 from "http-status-codes";

// src/app/modules/tracking/tracking.service.ts
import { randomUUID } from "crypto";
import httpStatus18 from "http-status-codes";

// src/app/modules/tracking/tracking.constant.ts
var ga4EventNameMap = {
  PageView: "page_view",
  ViewContent: "view_item",
  Search: "search",
  AddToCart: "add_to_cart",
  AddToWishlist: "add_to_wishlist",
  InitiateCheckout: "begin_checkout",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
  CompleteRegistration: "sign_up",
  Lead: "generate_lead",
  Contact: "contact"
};

// src/app/modules/google-analytics/googleAnalytics.service.ts
var GA4_TIMEOUT_MS = 8e3;
var GA4_DEFAULT_ENDPOINT = "https://www.google-analytics.com/mp/collect";
var sanitizeGa4EventName = (eventType) => {
  const mappedEvent = ga4EventNameMap[eventType];
  if (mappedEvent) {
    return mappedEvent;
  }
  const normalized = eventType.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return normalized || "custom_event";
};
var normalizeIpAddress = (ipAddress) => {
  if (!ipAddress) {
    return void 0;
  }
  const normalized = ipAddress.trim();
  if (!normalized) {
    return void 0;
  }
  if (normalized.startsWith("::ffff:")) {
    return normalized.slice(7);
  }
  return normalized;
};
var getPrimitiveMetadata = (metadata) => {
  if (!metadata) {
    return void 0;
  }
  const normalizedMetadata = {};
  Object.entries(metadata).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      normalizedMetadata[key] = value;
    }
  });
  if (Object.keys(normalizedMetadata).length === 0) {
    return void 0;
  }
  return normalizedMetadata;
};
var resolveClientId = (payload) => {
  const maybeClientId = payload.userData?.clientId?.trim();
  if (maybeClientId) {
    return maybeClientId;
  }
  const maybeSessionId = payload.sessionId?.trim();
  if (maybeSessionId) {
    return `${Date.now()}.${Math.abs(hashCode(maybeSessionId))}`;
  }
  return `${Date.now()}.${Math.abs(hashCode(payload.eventId))}`;
};
var hashCode = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
};
var buildGa4Payload = (payload) => {
  const params = {
    event_id: payload.eventId,
    currency: payload.currency,
    engagement_time_msec: 100
  };
  if (payload.value !== void 0) {
    params.value = payload.value;
  }
  if (payload.orderId) {
    params.transaction_id = payload.orderId;
  }
  if (payload.sourceUrl) {
    params.page_location = payload.sourceUrl;
  }
  if (payload.productId) {
    params.item_id = payload.productId;
  }
  if (payload.items?.length) {
    params.items = payload.items.map((item) => {
      const itemPayload = {
        item_id: item.itemId
      };
      if (item.itemName) {
        itemPayload.item_name = item.itemName;
      }
      if (item.itemBrand) {
        itemPayload.item_brand = item.itemBrand;
      }
      if (item.itemCategory) {
        itemPayload.item_category = item.itemCategory;
      }
      if (item.itemVariant) {
        itemPayload.item_variant = item.itemVariant;
      }
      if (item.price !== void 0) {
        itemPayload.price = item.price;
      }
      if (item.quantity !== void 0) {
        itemPayload.quantity = item.quantity;
      }
      return itemPayload;
    });
  }
  const customMetadata = getPrimitiveMetadata(payload.metadata);
  if (customMetadata) {
    Object.assign(params, customMetadata);
  }
  const requestBody = {
    client_id: resolveClientId(payload),
    timestamp_micros: payload.createdAt.getTime() * 1e3,
    events: [
      {
        name: sanitizeGa4EventName(payload.eventType),
        params
      }
    ]
  };
  if (payload.userId) {
    requestBody.user_id = payload.userId;
  }
  const ipOverride = normalizeIpAddress(payload.ipAddress);
  if (ipOverride) {
    requestBody.ip_override = ipOverride;
  }
  return requestBody;
};
var sendEvent = async (payload) => {
  if (!envVars.GA4_MEASUREMENT_ID || !envVars.GA4_API_SECRET) {
    return {
      provider: "ga4",
      success: false,
      message: "GA4 credentials are not configured"
    };
  }
  try {
    const endpoint = new URL(envVars.GA4_ENDPOINT ?? GA4_DEFAULT_ENDPOINT);
    endpoint.searchParams.set("measurement_id", envVars.GA4_MEASUREMENT_ID);
    endpoint.searchParams.set("api_secret", envVars.GA4_API_SECRET);
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildGa4Payload(payload)),
      signal: AbortSignal.timeout(GA4_TIMEOUT_MS)
    });
    const responseText = await response.text();
    if (!response.ok) {
      return {
        provider: "ga4",
        success: false,
        message: `GA4 request failed with status ${response.status}`,
        response: responseText || null
      };
    }
    return {
      provider: "ga4",
      success: true,
      message: "GA4 event sent successfully",
      response: responseText || null
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send GA4 event";
    return {
      provider: "ga4",
      success: false,
      message
    };
  }
};
var GoogleAnalyticsService = {
  sendEvent
};

// src/app/modules/meta-pixel/metaPixel.service.ts
import { createHash } from "crypto";
var META_GRAPH_API_VERSION = "v21.0";
var META_TIMEOUT_MS = 8e3;
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var hashValue = (value) => createHash("sha256").update(value).digest("hex");
var normalizeText = (value) => {
  if (!value) {
    return void 0;
  }
  const normalized = value.trim().toLowerCase();
  return normalized || void 0;
};
var normalizePhone = (value) => {
  if (!value) {
    return void 0;
  }
  const normalized = value.replace(/[^0-9]/g, "");
  return normalized || void 0;
};
var hashNormalizedValue = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return void 0;
  }
  return hashValue(normalized);
};
var hashPhoneValue = (value) => {
  const normalizedPhone = normalizePhone(value);
  if (!normalizedPhone) {
    return void 0;
  }
  return hashValue(normalizedPhone);
};
var normalizeIpAddress2 = (ipAddress) => {
  if (!ipAddress) {
    return void 0;
  }
  const normalized = ipAddress.trim();
  if (!normalized) {
    return void 0;
  }
  if (normalized.startsWith("::ffff:")) {
    return normalized.slice(7);
  }
  return normalized;
};
var buildMetaContents = (items) => {
  if (!items?.length) {
    return void 0;
  }
  const contents = items.map((item) => {
    const content = {
      id: item.itemId
    };
    if (item.quantity !== void 0) {
      content.quantity = item.quantity;
    }
    if (item.price !== void 0) {
      content.item_price = item.price;
    }
    return content;
  });
  return contents.length ? contents : void 0;
};
var buildMetaPayload = (payload) => {
  const normalizedIpAddress = normalizeIpAddress2(payload.ipAddress);
  const userData = {};
  if (normalizedIpAddress) {
    userData.client_ip_address = normalizedIpAddress;
  }
  if (payload.userAgent) {
    userData.client_user_agent = payload.userAgent;
  }
  const hashedEmail = hashNormalizedValue(payload.userData?.email);
  const hashedPhone = hashPhoneValue(payload.userData?.phone);
  const hashedFirstName = hashNormalizedValue(payload.userData?.firstName);
  const hashedLastName = hashNormalizedValue(payload.userData?.lastName);
  const hashedCity = hashNormalizedValue(payload.userData?.city);
  const hashedState = hashNormalizedValue(payload.userData?.state);
  const hashedCountry = hashNormalizedValue(payload.userData?.country);
  const hashedZip = hashNormalizedValue(payload.userData?.zip);
  const hashedExternalId = hashNormalizedValue(
    payload.userData?.externalId ?? payload.userId
  );
  if (hashedEmail) {
    userData.em = [hashedEmail];
  }
  if (hashedPhone) {
    userData.ph = [hashedPhone];
  }
  if (hashedFirstName) {
    userData.fn = [hashedFirstName];
  }
  if (hashedLastName) {
    userData.ln = [hashedLastName];
  }
  if (hashedCity) {
    userData.ct = [hashedCity];
  }
  if (hashedState) {
    userData.st = [hashedState];
  }
  if (hashedCountry) {
    userData.country = [hashedCountry];
  }
  if (hashedZip) {
    userData.zp = [hashedZip];
  }
  if (hashedExternalId) {
    userData.external_id = [hashedExternalId];
  }
  if (payload.userData?.fbp) {
    userData.fbp = payload.userData.fbp;
  }
  if (payload.userData?.fbc) {
    userData.fbc = payload.userData.fbc;
  }
  const contents = buildMetaContents(payload.items);
  const contentIds = payload.items?.map((item) => item.itemId) ?? [];
  const totalItems = payload.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;
  const inferredValue = payload.items?.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const hasInferredValue = typeof inferredValue === "number" && Number.isFinite(inferredValue) && inferredValue > 0;
  const value = payload.value ?? (hasInferredValue ? inferredValue : void 0);
  const customData = {};
  if (payload.currency) {
    customData.currency = payload.currency;
  }
  if (value !== void 0) {
    customData.value = value;
  }
  if (payload.orderId) {
    customData.order_id = payload.orderId;
  }
  if (contentIds.length > 0) {
    customData.content_ids = contentIds;
    customData.content_type = "product";
  }
  if (contents?.length) {
    customData.contents = contents;
  }
  if (totalItems > 0) {
    customData.num_items = totalItems;
  }
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    customData.custom_properties = payload.metadata;
  }
  const eventData = {
    event_name: payload.eventType,
    event_time: Math.floor(payload.createdAt.getTime() / 1e3),
    event_id: payload.eventId,
    action_source: "website"
  };
  if (payload.sourceUrl) {
    eventData.event_source_url = payload.sourceUrl;
  }
  if (Object.keys(userData).length > 0) {
    eventData.user_data = userData;
  }
  if (Object.keys(customData).length > 0) {
    eventData.custom_data = customData;
  }
  const requestBody = {
    data: [eventData]
  };
  if (envVars.META_TEST_EVENT_CODE) {
    requestBody.test_event_code = envVars.META_TEST_EVENT_CODE;
  }
  return requestBody;
};
var sendEvent2 = async (payload) => {
  if (!envVars.META_PIXEL_ID || !envVars.META_CAPI_ACCESS_TOKEN) {
    return {
      provider: "meta",
      success: false,
      message: "Meta Pixel credentials are not configured"
    };
  }
  try {
    const endpoint = new URL(
      `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${envVars.META_PIXEL_ID}/events`
    );
    endpoint.searchParams.set("access_token", envVars.META_CAPI_ACCESS_TOKEN);
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildMetaPayload(payload)),
      signal: AbortSignal.timeout(META_TIMEOUT_MS)
    });
    const responseText = await response.text();
    let parsedResponse = null;
    if (responseText) {
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = responseText;
      }
    }
    if (!response.ok) {
      return {
        provider: "meta",
        success: false,
        message: `Meta CAPI request failed with status ${response.status}`,
        response: parsedResponse
      };
    }
    if (isRecord(parsedResponse) && "error" in parsedResponse) {
      const errorValue = parsedResponse.error;
      if (isRecord(errorValue) && typeof errorValue.message === "string") {
        return {
          provider: "meta",
          success: false,
          message: errorValue.message,
          response: parsedResponse
        };
      }
      return {
        provider: "meta",
        success: false,
        message: "Meta CAPI returned an unknown error",
        response: parsedResponse
      };
    }
    return {
      provider: "meta",
      success: true,
      message: "Meta event sent successfully",
      response: parsedResponse
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send Meta event";
    return {
      provider: "meta",
      success: false,
      message
    };
  }
};
var MetaPixelService = {
  sendEvent: sendEvent2
};

// src/app/modules/tracking/tracking.service.ts
var conversionEventSelect = {
  id: true,
  eventId: true,
  eventType: true,
  userId: true,
  sessionId: true,
  orderId: true,
  productId: true,
  value: true,
  currency: true,
  sourceUrl: true,
  ipAddress: true,
  userAgent: true,
  sentToMeta: true,
  sentToGa4: true,
  metaLastSentAt: true,
  ga4LastSentAt: true,
  attemptCount: true,
  lastAttemptAt: true,
  lastError: true,
  metadata: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true
    }
  },
  order: {
    select: {
      id: true,
      orderNumber: true
    }
  },
  product: {
    select: {
      id: true,
      title: true,
      slug: true
    }
  }
};
var isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var normalizeText2 = (value) => {
  if (!value) {
    return void 0;
  }
  const normalized = value.trim();
  return normalized || void 0;
};
var parseStoredMetadata = (metadata) => {
  if (!isPlainObject(metadata)) {
    return {};
  }
  const parsedMetadata = {};
  if (isPlainObject(metadata.custom)) {
    parsedMetadata.custom = metadata.custom;
  }
  if (isPlainObject(metadata.userData)) {
    parsedMetadata.userData = metadata.userData;
  }
  if (Array.isArray(metadata.items)) {
    parsedMetadata.items = metadata.items;
  }
  return parsedMetadata;
};
var buildStoredMetadata = (payload) => {
  const metadata = {};
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    metadata.custom = payload.metadata;
  }
  if (payload.userData) {
    metadata.userData = payload.userData;
  }
  if (payload.items?.length) {
    metadata.items = payload.items;
  }
  if (Object.keys(metadata).length === 0) {
    return void 0;
  }
  return metadata;
};
var parseBooleanQuery2 = (value, key) => {
  if (value === void 0) {
    return void 0;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  throw new AppError_default(httpStatus18.BAD_REQUEST, `${key} must be true or false`);
};
var parseDateQuery = (value, key) => {
  if (!value) {
    return void 0;
  }
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError_default(httpStatus18.BAD_REQUEST, `${key} must be a valid date`);
  }
  return parsedDate;
};
var buildWhere3 = (query) => {
  const where = {};
  const searchTerm = query.searchTerm?.trim();
  if (searchTerm) {
    where.OR = [
      {
        eventType: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        eventId: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        sessionId: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }
    ];
  }
  if (query.eventType?.trim()) {
    where.eventType = query.eventType.trim();
  }
  if (query.userId?.trim()) {
    where.userId = query.userId.trim();
  }
  if (query.orderId?.trim()) {
    where.orderId = query.orderId.trim();
  }
  if (query.productId?.trim()) {
    where.productId = query.productId.trim();
  }
  if (query.sessionId?.trim()) {
    where.sessionId = query.sessionId.trim();
  }
  const sentToMeta = parseBooleanQuery2(query.sentToMeta, "sentToMeta");
  if (sentToMeta !== void 0) {
    where.sentToMeta = sentToMeta;
  }
  const sentToGa4 = parseBooleanQuery2(query.sentToGa4, "sentToGa4");
  if (sentToGa4 !== void 0) {
    where.sentToGa4 = sentToGa4;
  }
  const fromDate = parseDateQuery(query.fromDate, "fromDate");
  const toDate = parseDateQuery(query.toDate, "toDate");
  if (fromDate || toDate) {
    where.createdAt = {
      ...fromDate && { gte: fromDate },
      ...toDate && { lte: toDate }
    };
  }
  return where;
};
var allowedSortFields2 = /* @__PURE__ */ new Set([
  "createdAt",
  "eventType",
  "value",
  "attemptCount",
  "lastAttemptAt"
]);
var buildOrderBy3 = (sort) => {
  if (!sort?.trim()) {
    return [{ createdAt: "desc" }];
  }
  const orderBy = sort.split(",").map((rawField) => rawField.trim()).filter(Boolean).map((field) => {
    const isDescending = field.startsWith("-");
    const normalizedField = isDescending ? field.slice(1) : field;
    if (!allowedSortFields2.has(normalizedField)) {
      return null;
    }
    return {
      [normalizedField]: isDescending ? "desc" : "asc"
    };
  }).filter(Boolean);
  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }
  return orderBy;
};
var ensureProductExists = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!product) {
    throw new AppError_default(httpStatus18.NOT_FOUND, "Product not found");
  }
};
var ensureOrderExists = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true }
  });
  if (!order) {
    throw new AppError_default(httpStatus18.NOT_FOUND, "Order not found");
  }
};
var buildDispatchPayload = (event) => {
  const parsedMetadata = parseStoredMetadata(event.metadata);
  const eventId = event.eventId ?? randomUUID();
  return {
    eventType: event.eventType,
    eventId,
    ...event.userId && { userId: event.userId },
    ...event.sessionId && { sessionId: event.sessionId },
    ...event.orderId && { orderId: event.orderId },
    ...event.productId && { productId: event.productId },
    ...event.value !== null && { value: event.value },
    currency: event.currency ?? "BDT",
    ...event.sourceUrl && { sourceUrl: event.sourceUrl },
    ...event.ipAddress && { ipAddress: event.ipAddress },
    ...event.userAgent && { userAgent: event.userAgent },
    ...parsedMetadata.custom && { metadata: parsedMetadata.custom },
    ...parsedMetadata.userData && { userData: parsedMetadata.userData },
    ...parsedMetadata.items && { items: parsedMetadata.items },
    createdAt: event.createdAt
  };
};
var dispatchToProviders = async (payload, options) => {
  const [metaResult, ga4Result] = await Promise.all([
    options?.skipMeta ? Promise.resolve({
      provider: "meta",
      success: true,
      message: "Meta delivery skipped (already sent)"
    }) : MetaPixelService.sendEvent(payload),
    options?.skipGa4 ? Promise.resolve({
      provider: "ga4",
      success: true,
      message: "GA4 delivery skipped (already sent)"
    }) : GoogleAnalyticsService.sendEvent(payload)
  ]);
  return {
    meta: metaResult,
    ga4: ga4Result
  };
};
var getDeliveryErrorMessage = (delivery) => {
  const errors = [];
  if (!delivery.meta.success) {
    errors.push(`META: ${delivery.meta.message}`);
  }
  if (!delivery.ga4.success) {
    errors.push(`GA4: ${delivery.ga4.message}`);
  }
  if (!errors.length) {
    return null;
  }
  return errors.join(" | ");
};
var updateEventAfterDelivery = async (event, delivery, dispatchedEventId) => {
  const now = /* @__PURE__ */ new Date();
  const updateData = {
    sentToMeta: event.sentToMeta || delivery.meta.success,
    sentToGa4: event.sentToGa4 || delivery.ga4.success,
    attemptCount: {
      increment: 1
    },
    lastAttemptAt: now,
    lastError: getDeliveryErrorMessage(delivery)
  };
  if (!event.eventId) {
    updateData.eventId = dispatchedEventId;
  }
  if (delivery.meta.success) {
    updateData.metaLastSentAt = now;
  }
  if (delivery.ga4.success) {
    updateData.ga4LastSentAt = now;
  }
  const updatedEvent = await prisma.conversionEvent.update({
    where: { id: event.id },
    data: updateData,
    select: conversionEventSelect
  });
  return updatedEvent;
};
var trackEvent = async (payload, context) => {
  const sessionId = normalizeText2(payload.sessionId);
  const sourceUrl = normalizeText2(payload.sourceUrl ?? context.sourceUrl);
  const currency = payload.currency?.trim().toUpperCase() ?? "BDT";
  const userId = context.authenticatedUserId;
  const storedMetadata = buildStoredMetadata(payload);
  if (payload.productId) {
    await ensureProductExists(payload.productId);
  }
  if (payload.orderId) {
    await ensureOrderExists(payload.orderId);
  }
  if (payload.eventId) {
    const existingEvent = await prisma.conversionEvent.findUnique({
      where: { eventId: payload.eventId },
      select: conversionEventSelect
    });
    if (existingEvent) {
      if (existingEvent.sentToMeta && existingEvent.sentToGa4) {
        return {
          event: existingEvent,
          deduplicated: true,
          delivery: {
            meta: {
              provider: "meta",
              success: true,
              message: "Meta already received this event"
            },
            ga4: {
              provider: "ga4",
              success: true,
              message: "GA4 already received this event"
            }
          }
        };
      }
      const dispatchPayload2 = buildDispatchPayload(existingEvent);
      const delivery2 = await dispatchToProviders(dispatchPayload2, {
        skipMeta: existingEvent.sentToMeta,
        skipGa4: existingEvent.sentToGa4
      });
      const updatedEvent2 = await updateEventAfterDelivery(
        existingEvent,
        delivery2,
        dispatchPayload2.eventId
      );
      return {
        event: updatedEvent2,
        deduplicated: true,
        delivery: delivery2
      };
    }
  }
  const createdEvent = await prisma.conversionEvent.create({
    data: {
      eventType: payload.eventType,
      eventId: payload.eventId ?? randomUUID(),
      ...userId && { user: { connect: { id: userId } } },
      ...sessionId && { sessionId },
      ...payload.orderId && { order: { connect: { id: payload.orderId } } },
      ...payload.productId && {
        product: { connect: { id: payload.productId } }
      },
      ...payload.value !== void 0 && { value: payload.value },
      currency,
      ...sourceUrl && { sourceUrl },
      ...context.ipAddress && { ipAddress: context.ipAddress },
      ...context.userAgent && { userAgent: context.userAgent },
      ...storedMetadata && { metadata: storedMetadata }
    },
    select: conversionEventSelect
  });
  const dispatchPayload = buildDispatchPayload(createdEvent);
  const delivery = await dispatchToProviders(dispatchPayload);
  const updatedEvent = await updateEventAfterDelivery(
    createdEvent,
    delivery,
    dispatchPayload.eventId
  );
  return {
    event: updatedEvent,
    deduplicated: false,
    delivery
  };
};
var getTrackingEvents = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const where = buildWhere3(query);
  const orderBy = buildOrderBy3(query.sort);
  const [data, total] = await Promise.all([
    prisma.conversionEvent.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: conversionEventSelect
    }),
    prisma.conversionEvent.count({ where })
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
var getTrackingEventById = async (id) => {
  const event = await prisma.conversionEvent.findUnique({
    where: { id },
    select: conversionEventSelect
  });
  if (!event) {
    throw new AppError_default(httpStatus18.NOT_FOUND, "Tracking event not found");
  }
  return event;
};
var retryTrackingEvent = async (id) => {
  const existingEvent = await prisma.conversionEvent.findUnique({
    where: { id },
    select: conversionEventSelect
  });
  if (!existingEvent) {
    throw new AppError_default(httpStatus18.NOT_FOUND, "Tracking event not found");
  }
  const dispatchPayload = buildDispatchPayload(existingEvent);
  const delivery = await dispatchToProviders(dispatchPayload, {
    skipMeta: existingEvent.sentToMeta,
    skipGa4: existingEvent.sentToGa4
  });
  const updatedEvent = await updateEventAfterDelivery(
    existingEvent,
    delivery,
    dispatchPayload.eventId
  );
  return {
    event: updatedEvent,
    delivery
  };
};
var TrackingService = {
  trackEvent,
  getTrackingEvents,
  getTrackingEventById,
  retryTrackingEvent
};

// src/app/modules/tracking/tracking.controller.ts
var getParamAsString6 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus19.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var extractToken2 = (req) => {
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
var resolveAuthenticatedUserId = (req) => {
  if (req.user?.id) {
    return req.user.id;
  }
  const accessToken = extractToken2(req);
  if (!accessToken) {
    return void 0;
  }
  try {
    const decoded = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    );
    const userId = decoded.userId;
    return typeof userId === "string" ? userId : void 0;
  } catch {
    return void 0;
  }
};
var extractIpAddress = (req) => {
  const forwardedForHeader = req.headers["x-forwarded-for"];
  if (typeof forwardedForHeader === "string") {
    const firstIp = forwardedForHeader.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp.startsWith("::ffff:") ? firstIp.slice(7) : firstIp;
    }
  }
  if (Array.isArray(forwardedForHeader) && forwardedForHeader.length > 0) {
    const firstIp = forwardedForHeader[0]?.trim();
    if (firstIp) {
      return firstIp.startsWith("::ffff:") ? firstIp.slice(7) : firstIp;
    }
  }
  const ipAddress = req.ip || req.socket.remoteAddress;
  if (!ipAddress) {
    return void 0;
  }
  return ipAddress.startsWith("::ffff:") ? ipAddress.slice(7) : ipAddress;
};
var trackEvent2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const userAgentHeader = req.headers["user-agent"];
  const refererHeader = req.headers.referer;
  const ipAddress = extractIpAddress(req);
  const authenticatedUserId = resolveAuthenticatedUserId(req);
  const context = {
    ...authenticatedUserId && { authenticatedUserId },
    ...ipAddress && { ipAddress },
    ...typeof userAgentHeader === "string" && { userAgent: userAgentHeader },
    ...typeof refererHeader === "string" && { sourceUrl: refererHeader }
  };
  const result = await TrackingService.trackEvent(payload, context);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus19.CREATED,
    message: result.deduplicated ? "Tracking event processed (deduplicated)" : "Tracking event processed successfully",
    data: result
  });
});
var getTrackingEvents2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await TrackingService.getTrackingEvents(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus19.OK,
    message: "Tracking events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getTrackingEventById2 = catchAsync(async (req, res) => {
  const id = getParamAsString6(req.params.id, "Tracking event id");
  const result = await TrackingService.getTrackingEventById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus19.OK,
    message: "Tracking event retrieved successfully",
    data: result
  });
});
var retryTrackingEvent2 = catchAsync(async (req, res) => {
  const id = getParamAsString6(req.params.id, "Tracking event id");
  const result = await TrackingService.retryTrackingEvent(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus19.OK,
    message: "Tracking event retry completed",
    data: result
  });
});
var TrackingControllers = {
  trackEvent: trackEvent2,
  getTrackingEvents: getTrackingEvents2,
  getTrackingEventById: getTrackingEventById2,
  retryTrackingEvent: retryTrackingEvent2
};

// src/app/modules/tracking/tracking.validation.ts
import { z as z7 } from "zod";
var optionalTrimmedText = (maxLength) => z7.string().trim().min(1, { message: "Value cannot be empty" }).max(maxLength, { message: `Value cannot exceed ${maxLength} characters` }).optional();
var trackingItemZodSchema = z7.object({
  itemId: z7.string().trim().min(1, { message: "itemId is required" }).max(100, { message: "itemId cannot exceed 100 characters" }),
  itemName: optionalTrimmedText(255),
  itemBrand: optionalTrimmedText(100),
  itemCategory: optionalTrimmedText(100),
  itemVariant: optionalTrimmedText(100),
  price: z7.coerce.number().nonnegative({ message: "price cannot be negative" }).optional(),
  quantity: z7.coerce.number().int({ message: "quantity must be an integer" }).positive({ message: "quantity must be greater than 0" }).optional()
});
var trackingUserDataZodSchema = z7.object({
  email: z7.string().trim().email({ message: "Invalid email address" }).optional(),
  phone: optionalTrimmedText(30),
  firstName: optionalTrimmedText(80),
  lastName: optionalTrimmedText(80),
  city: optionalTrimmedText(120),
  state: optionalTrimmedText(120),
  country: optionalTrimmedText(120),
  zip: optionalTrimmedText(20),
  externalId: optionalTrimmedText(120),
  fbp: optionalTrimmedText(255),
  fbc: optionalTrimmedText(255),
  clientId: optionalTrimmedText(120)
});
var trackEventZodSchema = z7.object({
  eventType: z7.string().trim().min(1, { message: "eventType is required" }).max(100, { message: "eventType cannot exceed 100 characters" }),
  eventId: z7.string().uuid({ message: "eventId must be a valid UUID" }).optional(),
  sessionId: optionalTrimmedText(120),
  orderId: z7.string().uuid({ message: "orderId must be a valid UUID" }).optional(),
  productId: z7.string().uuid({ message: "productId must be a valid UUID" }).optional(),
  value: z7.coerce.number().nonnegative({ message: "value cannot be negative" }).optional(),
  currency: z7.string().trim().length(3, { message: "currency must be 3 characters (ISO code)" }).transform((value) => value.toUpperCase()).optional(),
  sourceUrl: z7.string().trim().url({ message: "sourceUrl must be a valid URL" }).optional(),
  metadata: z7.record(z7.string(), z7.unknown()).optional(),
  userData: trackingUserDataZodSchema.optional(),
  items: z7.array(trackingItemZodSchema).optional()
}).superRefine((payload, ctx) => {
  if (payload.eventType === "Purchase" && !payload.orderId) {
    ctx.addIssue({
      code: z7.ZodIssueCode.custom,
      path: ["orderId"],
      message: "orderId is required for Purchase event"
    });
  }
});

// src/app/modules/tracking/tracking.route.ts
var router7 = Router7();
router7.post("/", validateRequest(trackEventZodSchema), TrackingControllers.trackEvent);
router7.get(
  "/",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  TrackingControllers.getTrackingEvents
);
router7.get(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  TrackingControllers.getTrackingEventById
);
router7.post(
  "/:id/retry",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  TrackingControllers.retryTrackingEvent
);
var TrackingRoutes = router7;

// src/app/modules/review/review.route.ts
import { Router as Router8 } from "express";

// src/app/modules/review/review.controller.ts
import httpStatus21 from "http-status-codes";

// src/app/modules/review/review.service.ts
import httpStatus20 from "http-status-codes";
var sortableFields = ["createdAt", "updatedAt", "rating"];
var publicReviewSelect = {
  id: true,
  productId: true,
  rating: true,
  title: true,
  comment: true,
  isVerifiedPurchase: true,
  helpfulVotes: true,
  notHelpfulVotes: true,
  adminReply: true,
  adminRepliedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true
    }
  }
};
var myReviewSelect = {
  ...publicReviewSelect,
  isApproved: true,
  product: {
    select: {
      id: true,
      title: true,
      slug: true
    }
  }
};
var adminReviewSelect = {
  id: true,
  userId: true,
  productId: true,
  rating: true,
  title: true,
  comment: true,
  isApproved: true,
  isVerifiedPurchase: true,
  helpfulVotes: true,
  notHelpfulVotes: true,
  adminReply: true,
  adminRepliedAt: true,
  adminRepliedBy: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  },
  product: {
    select: {
      id: true,
      title: true,
      slug: true
    }
  },
  admin: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
};
var getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
var parseBooleanQuery3 = (value, key) => {
  if (value !== "true" && value !== "false") {
    throw new AppError_default(httpStatus20.BAD_REQUEST, `${key} query must be true or false`);
  }
  return value === "true";
};
var parseRatingQuery = (value, key) => {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError_default(httpStatus20.BAD_REQUEST, `${key} query must be an integer between 1 and 5`);
  }
  return rating;
};
var buildOrderBy4 = (sort) => {
  if (!sort) {
    return [{ createdAt: "desc" }];
  }
  const orderBy = sort.split(",").map((field) => field.trim()).filter(Boolean).map((field) => {
    const direction = field.startsWith("-") ? "desc" : "asc";
    const normalizedField = field.replace(/^-/, "");
    if (!sortableFields.includes(normalizedField)) {
      return null;
    }
    return {
      [normalizedField]: direction
    };
  }).filter(
    (value) => value !== null
  );
  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }
  return orderBy;
};
var addSearchFilter = (where, searchTerm) => {
  if (!searchTerm?.trim()) {
    return;
  }
  where.OR = [
    {
      title: {
        contains: searchTerm,
        mode: "insensitive"
      }
    },
    {
      comment: {
        contains: searchTerm,
        mode: "insensitive"
      }
    }
  ];
};
var addRatingFilters = (where, query) => {
  if (query.rating !== void 0) {
    where.rating = parseRatingQuery(query.rating, "rating");
    return;
  }
  const ratingFilter = {};
  if (query.minRating !== void 0) {
    ratingFilter.gte = parseRatingQuery(query.minRating, "minRating");
  }
  if (query.maxRating !== void 0) {
    ratingFilter.lte = parseRatingQuery(query.maxRating, "maxRating");
  }
  if (ratingFilter.gte !== void 0 && ratingFilter.lte !== void 0 && ratingFilter.gte > ratingFilter.lte) {
    throw new AppError_default(
      httpStatus20.BAD_REQUEST,
      "minRating cannot be greater than maxRating"
    );
  }
  if (ratingFilter.gte !== void 0 || ratingFilter.lte !== void 0) {
    where.rating = ratingFilter;
  }
};
var ensureProductExists2 = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!product) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Product not found");
  }
};
var createReview = async (userId, payload) => {
  await ensureProductExists2(payload.productId);
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId: payload.productId
    },
    select: { id: true }
  });
  if (existingReview) {
    throw new AppError_default(
      httpStatus20.CONFLICT,
      "You have already reviewed this product"
    );
  }
  const orderedItem = await prisma.orderItem.findFirst({
    where: {
      productId: payload.productId,
      order: {
        userId
      }
    },
    select: { id: true }
  });
  const createdReview = await prisma.review.create({
    data: {
      userId,
      productId: payload.productId,
      rating: payload.rating,
      title: payload.title ?? null,
      comment: payload.comment ?? null,
      isVerifiedPurchase: Boolean(orderedItem)
    },
    select: myReviewSelect
  });
  return createdReview;
};
var getPublicReviewsByProduct = async (productId, query) => {
  await ensureProductExists2(productId);
  const { page, limit, skip } = getPagination(query);
  const where = {
    productId,
    isApproved: true
  };
  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);
  const [data, total, aggregate, grouped] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy4(query.sort),
      skip,
      take: limit,
      select: publicReviewSelect
    }),
    prisma.review.count({ where }),
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { _all: true }
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where,
      _count: { _all: true }
    })
  ]);
  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: grouped.find((item) => item.rating === rating)?._count._all ?? 0
  }));
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    summary: {
      totalReviews: aggregate._count._all,
      averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(2)) : 0,
      ratingBreakdown
    },
    data
  };
};
var getMyReviews = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    userId
  };
  if (query.productId !== void 0) {
    where.productId = query.productId;
  }
  if (query.isApproved !== void 0) {
    where.isApproved = parseBooleanQuery3(query.isApproved, "isApproved");
  }
  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy4(query.sort),
      skip,
      take: limit,
      select: myReviewSelect
    }),
    prisma.review.count({ where })
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
var updateMyReview = async (userId, reviewId, payload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true }
  });
  if (!review) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(
      httpStatus20.FORBIDDEN,
      "You are not allowed to update this review"
    );
  }
  const updateData = {
    isApproved: false,
    adminReply: null,
    adminRepliedAt: null,
    adminRepliedBy: null
  };
  if (payload.rating !== void 0) {
    updateData.rating = payload.rating;
  }
  if (payload.title !== void 0) {
    updateData.title = payload.title;
  }
  if (payload.comment !== void 0) {
    updateData.comment = payload.comment;
  }
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    select: myReviewSelect
  });
  return updatedReview;
};
var deleteMyReview = async (userId, reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true }
  });
  if (!review) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(
      httpStatus20.FORBIDDEN,
      "You are not allowed to delete this review"
    );
  }
  await prisma.review.delete({
    where: { id: review.id }
  });
};
var getAllReviews = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {};
  if (query.productId !== void 0) {
    where.productId = query.productId;
  }
  if (query.userId !== void 0) {
    where.userId = query.userId;
  }
  if (query.isApproved !== void 0) {
    where.isApproved = parseBooleanQuery3(query.isApproved, "isApproved");
  }
  if (query.isVerifiedPurchase !== void 0) {
    where.isVerifiedPurchase = parseBooleanQuery3(
      query.isVerifiedPurchase,
      "isVerifiedPurchase"
    );
  }
  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy4(query.sort),
      skip,
      take: limit,
      select: adminReviewSelect
    }),
    prisma.review.count({ where })
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
var getReviewByIdForAdmin = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: adminReviewSelect
  });
  if (!review) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Review not found");
  }
  return review;
};
var moderateReview = async (reviewId, payload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true }
  });
  if (!review) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Review not found");
  }
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...payload.isApproved !== void 0 && { isApproved: payload.isApproved },
      ...payload.isVerifiedPurchase !== void 0 && {
        isVerifiedPurchase: payload.isVerifiedPurchase
      }
    },
    select: adminReviewSelect
  });
  return updatedReview;
};
var replyReview = async (reviewId, payload, adminId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true }
  });
  if (!review) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Review not found");
  }
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: payload.adminReply === null ? {
      adminReply: null,
      adminRepliedAt: null,
      adminRepliedBy: null
    } : {
      adminReply: payload.adminReply,
      adminRepliedAt: /* @__PURE__ */ new Date(),
      adminRepliedBy: adminId
    },
    select: adminReviewSelect
  });
  return updatedReview;
};
var deleteReviewByAdmin = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true }
  });
  if (!review) {
    throw new AppError_default(httpStatus20.NOT_FOUND, "Review not found");
  }
  await prisma.review.delete({
    where: { id: review.id }
  });
};
var ReviewService = {
  createReview,
  getPublicReviewsByProduct,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
  getAllReviews,
  getReviewByIdForAdmin,
  moderateReview,
  replyReview,
  deleteReviewByAdmin
};

// src/app/modules/review/review.controller.ts
var getParamAsString7 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus21.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var getAuthUserId = (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus21.UNAUTHORIZED, "User not authenticated");
  }
  return userId;
};
var createReview2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const payload = req.body;
  const result = await ReviewService.createReview(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.CREATED,
    message: "Review submitted successfully",
    data: result
  });
});
var getPublicReviewsByProduct2 = catchAsync(async (req, res) => {
  const productId = getParamAsString7(req.params.productId, "Product id");
  const query = req.query;
  const result = await ReviewService.getPublicReviewsByProduct(productId, query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Product reviews retrieved successfully",
    data: {
      reviews: result.data,
      summary: result.summary
    },
    meta: result.meta
  });
});
var getMyReviews2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const query = req.query;
  const result = await ReviewService.getMyReviews(userId, query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "My reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateMyReview2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const reviewId = getParamAsString7(req.params.id, "Review id");
  const payload = req.body;
  const result = await ReviewService.updateMyReview(userId, reviewId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Review updated successfully",
    data: result
  });
});
var deleteMyReview2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const reviewId = getParamAsString7(req.params.id, "Review id");
  await ReviewService.deleteMyReview(userId, reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Review deleted successfully",
    data: null
  });
});
var getAllReviews2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ReviewService.getAllReviews(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "All reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getReviewByIdForAdmin2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString7(req.params.id, "Review id");
  const result = await ReviewService.getReviewByIdForAdmin(reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Review retrieved successfully",
    data: result
  });
});
var moderateReview2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString7(req.params.id, "Review id");
  const payload = req.body;
  const result = await ReviewService.moderateReview(reviewId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Review moderated successfully",
    data: result
  });
});
var replyReview2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString7(req.params.id, "Review id");
  const adminId = getAuthUserId(req);
  const payload = req.body;
  const result = await ReviewService.replyReview(reviewId, payload, adminId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Review reply updated successfully",
    data: result
  });
});
var deleteReviewByAdmin2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString7(req.params.id, "Review id");
  await ReviewService.deleteReviewByAdmin(reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus21.OK,
    message: "Review deleted successfully",
    data: null
  });
});
var ReviewControllers = {
  createReview: createReview2,
  getPublicReviewsByProduct: getPublicReviewsByProduct2,
  getMyReviews: getMyReviews2,
  updateMyReview: updateMyReview2,
  deleteMyReview: deleteMyReview2,
  getAllReviews: getAllReviews2,
  getReviewByIdForAdmin: getReviewByIdForAdmin2,
  moderateReview: moderateReview2,
  replyReview: replyReview2,
  deleteReviewByAdmin: deleteReviewByAdmin2
};

// src/app/modules/review/review.validation.ts
import { z as z8 } from "zod";
var optionalText3 = (max) => z8.string().trim().min(1, { message: "Value cannot be empty" }).max(max, { message: `Value cannot exceed ${max} characters` }).optional();
var ratingSchema = z8.coerce.number().int({ message: "Rating must be an integer" }).min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" });
var createReviewZodSchema = z8.object({
  productId: z8.string().uuid({ message: "Product id must be a valid UUID" }),
  rating: ratingSchema,
  title: optionalText3(255),
  comment: optionalText3(2e3)
});
var updateMyReviewZodSchema = z8.object({
  rating: ratingSchema.optional(),
  title: optionalText3(255),
  comment: optionalText3(2e3)
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one field is required for update"
});
var moderateReviewZodSchema = z8.object({
  isApproved: z8.coerce.boolean().optional(),
  isVerifiedPurchase: z8.coerce.boolean().optional()
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one moderation field is required"
});
var adminReplyValueSchema = z8.preprocess(
  (value) => {
    if (value === null) {
      return null;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      return trimmed;
    }
    return value;
  },
  z8.string().max(2e3, { message: "Admin reply cannot exceed 2000 characters" }).nullable()
);
var replyReviewZodSchema = z8.object({
  adminReply: adminReplyValueSchema
});

// src/app/modules/review/review.route.ts
var router8 = Router8();
router8.get("/product/:productId", ReviewControllers.getPublicReviewsByProduct);
router8.post(
  "/",
  checkAuth("USER" /* USER */),
  validateRequest(createReviewZodSchema),
  ReviewControllers.createReview
);
router8.get(
  "/my-reviews",
  checkAuth("USER" /* USER */),
  ReviewControllers.getMyReviews
);
router8.patch(
  "/:id",
  checkAuth("USER" /* USER */),
  validateRequest(updateMyReviewZodSchema),
  ReviewControllers.updateMyReview
);
router8.put(
  "/:id",
  checkAuth("USER" /* USER */),
  validateRequest(updateMyReviewZodSchema),
  ReviewControllers.updateMyReview
);
router8.delete(
  "/:id",
  checkAuth("USER" /* USER */),
  ReviewControllers.deleteMyReview
);
router8.get("/", checkAuth("ADMIN" /* ADMIN */), ReviewControllers.getAllReviews);
router8.get("/:id/admin", checkAuth("ADMIN" /* ADMIN */), ReviewControllers.getReviewByIdForAdmin);
router8.patch(
  "/:id/moderate",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(moderateReviewZodSchema),
  ReviewControllers.moderateReview
);
router8.patch(
  "/:id/reply",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(replyReviewZodSchema),
  ReviewControllers.replyReview
);
router8.delete(
  "/:id/admin",
  checkAuth("ADMIN" /* ADMIN */),
  ReviewControllers.deleteReviewByAdmin
);
var ReviewRoutes = router8;

// src/app/modules/order/order.route.ts
import { Router as Router9 } from "express";

// src/app/modules/order/order.controller.ts
import httpStatus24 from "http-status-codes";

// src/app/modules/order/order.service.ts
import { randomUUID as randomUUID2 } from "crypto";
import httpStatus23 from "http-status-codes";

// src/app/modules/payment/payment.service.ts
import httpStatus22 from "http-status-codes";
var codPaymentProvider = {
  method: "CASH_ON_DELIVERY",
  createPayment: async () => ({
    status: "PENDING",
    paidAt: null,
    errorMessage: null,
    transactionId: null
  })
};
var paymentProviderRegistry = /* @__PURE__ */ new Map([
  ["CASH_ON_DELIVERY", codPaymentProvider]
]);
var createOrderPayment = async (tx, payload) => {
  const provider = paymentProviderRegistry.get(payload.method);
  if (!provider) {
    throw new AppError_default(
      httpStatus22.NOT_IMPLEMENTED,
      `${payload.method} payment is not implemented yet`
    );
  }
  const providerResult = await provider.createPayment(payload);
  const paymentData = {
    orderId: payload.orderId,
    method: payload.method,
    status: providerResult.status,
    amount: payload.amount,
    transactionId: providerResult.transactionId ?? null,
    paidAt: providerResult.paidAt ?? null,
    errorMessage: providerResult.errorMessage ?? null
  };
  if (providerResult.gatewayResponse !== void 0) {
    paymentData.gatewayResponse = providerResult.gatewayResponse;
  }
  const payment = await tx.payment.create({
    data: paymentData,
    select: {
      id: true,
      orderId: true,
      method: true,
      status: true,
      amount: true,
      transactionId: true,
      paidAt: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return payment;
};
var syncPaymentWithOrderStatus = async (tx, orderId, nextStatus) => {
  const payment = await tx.payment.findUnique({
    where: { orderId },
    select: {
      id: true,
      method: true,
      status: true
    }
  });
  if (!payment) {
    return null;
  }
  if (payment.method !== "CASH_ON_DELIVERY") {
    return payment;
  }
  if (nextStatus === "DELIVERED" && payment.status === "PENDING") {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: /* @__PURE__ */ new Date(),
        errorMessage: null
      },
      select: {
        id: true,
        method: true,
        status: true,
        paidAt: true
      }
    });
  }
  if (nextStatus === "CANCELLED" && payment.status === "PENDING") {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        errorMessage: "Order cancelled before payment collection"
      },
      select: {
        id: true,
        method: true,
        status: true,
        paidAt: true
      }
    });
  }
  if (nextStatus === "REFUNDED" && (payment.status === "SUCCESS" || payment.status === "PROCESSING")) {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED"
      },
      select: {
        id: true,
        method: true,
        status: true,
        paidAt: true
      }
    });
  }
  return payment;
};
var PaymentService = {
  createOrderPayment,
  syncPaymentWithOrderStatus
};

// src/app/modules/order/order.service.ts
var orderStatusValues = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED"
];
var paymentStatusValues = [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "REFUNDED"
];
var paymentMethodValues = [
  "CASH_ON_DELIVERY",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "CREDIT_CARD",
  "BANK_TRANSFER"
];
var orderStatusSet = new Set(orderStatusValues);
var paymentStatusSet = new Set(paymentStatusValues);
var paymentMethodSet = new Set(paymentMethodValues);
var orderPaymentSelect = {
  id: true,
  method: true,
  status: true,
  amount: true,
  transactionId: true,
  paidAt: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true
};
var orderItemSelect = {
  id: true,
  orderId: true,
  variantOptionId: true,
  productId: true,
  productName: true,
  productSku: true,
  productImage: true,
  variantSnapshot: true,
  quantity: true,
  unitPrice: true,
  discountAmount: true,
  total: true,
  createdAt: true,
  option: {
    select: {
      id: true,
      sku: true,
      price: true,
      stock: true,
      isActive: true,
      variant: {
        select: {
          id: true,
          title: true,
          productId: true,
          isActive: true
        }
      }
    }
  }
};
var orderSelect = {
  id: true,
  orderNumber: true,
  userId: true,
  shippingAddressId: true,
  billingAddress: true,
  status: true,
  notes: true,
  adminNotes: true,
  subtotal: true,
  discountTotal: true,
  shippingCost: true,
  tax: true,
  total: true,
  couponId: true,
  couponCode: true,
  placedAt: true,
  processedAt: true,
  shippedAt: true,
  deliveredAt: true,
  cancelledAt: true,
  returnedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  },
  address: {
    select: {
      id: true,
      label: true,
      recipient: true,
      phone: true,
      street: true,
      city: true,
      state: true,
      zipCode: true,
      country: true
    }
  },
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: orderItemSelect
  },
  payment: {
    select: orderPaymentSelect
  },
  statusHistory: {
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      status: true,
      note: true,
      changedBy: true,
      createdAt: true
    }
  }
};
var createOrderCartSelect = {
  id: true,
  userId: true,
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
      productId: true,
      variantOptionId: true,
      quantity: true,
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          isActive: true,
          images: {
            where: { isPrimary: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              id: true,
              src: true
            }
          }
        }
      },
      option: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          isActive: true,
          variant: {
            select: {
              id: true,
              title: true,
              productId: true,
              isActive: true
            }
          }
        }
      }
    }
  }
};
var orderStatusTransitions = {
  PENDING: ["PROCESSING", "CONFIRMED", "CANCELLED"],
  PROCESSING: ["CONFIRMED", "SHIPPED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED", "REFUNDED"],
  CANCELLED: [],
  RETURNED: ["REFUNDED"],
  REFUNDED: []
};
var orderSortableFields = ["createdAt", "placedAt", "total", "status"];
var decimalFrom2 = (value) => {
  if (value instanceof prismaNamespace_exports.Decimal) {
    return value;
  }
  if (value === null || value === void 0) {
    return new prismaNamespace_exports.Decimal(0);
  }
  return new prismaNamespace_exports.Decimal(value);
};
var parseOrderStatus = (value, key) => {
  const normalized = value.trim().toUpperCase();
  if (!orderStatusSet.has(normalized)) {
    throw new AppError_default(httpStatus23.BAD_REQUEST, `${key} has an invalid value`);
  }
  return normalized;
};
var parsePaymentStatus = (value) => {
  const normalized = value.trim().toUpperCase();
  if (!paymentStatusSet.has(normalized)) {
    throw new AppError_default(httpStatus23.BAD_REQUEST, "paymentStatus has an invalid value");
  }
  return normalized;
};
var parsePaymentMethod = (value) => {
  const normalized = value.trim().toUpperCase();
  if (!paymentMethodSet.has(normalized)) {
    throw new AppError_default(httpStatus23.BAD_REQUEST, "paymentMethod has an invalid value");
  }
  return normalized;
};
var parseDateQuery2 = (value, key) => {
  if (!value) {
    return void 0;
  }
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError_default(httpStatus23.BAD_REQUEST, `${key} must be a valid date`);
  }
  return parsedDate;
};
var getPagination2 = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
var buildOrderBy5 = (sort) => {
  if (!sort?.trim()) {
    return [{ placedAt: "desc" }];
  }
  const orderBy = sort.split(",").map((field) => field.trim()).filter(Boolean).map((field) => {
    const direction = field.startsWith("-") ? "desc" : "asc";
    const normalizedField = field.replace(/^-/, "");
    if (!orderSortableFields.includes(normalizedField)) {
      return null;
    }
    return {
      [normalizedField]: direction
    };
  }).filter((value) => value !== null);
  if (!orderBy.length) {
    return [{ placedAt: "desc" }];
  }
  return orderBy;
};
var buildOrderWhere = (query, userId) => {
  const where = {};
  const paymentWhere = {};
  if (userId) {
    where.userId = userId;
  }
  if (query.userId && !userId) {
    where.userId = query.userId;
  }
  if (query.status) {
    where.status = parseOrderStatus(query.status, "status");
  }
  if (query.paymentStatus) {
    paymentWhere.status = parsePaymentStatus(query.paymentStatus);
  }
  if (query.paymentMethod) {
    paymentWhere.method = parsePaymentMethod(query.paymentMethod);
  }
  if (Object.keys(paymentWhere).length > 0) {
    where.payment = {
      is: paymentWhere
    };
  }
  const fromDate = parseDateQuery2(query.fromDate, "fromDate");
  const toDate = parseDateQuery2(query.toDate, "toDate");
  if (fromDate || toDate) {
    where.placedAt = {
      ...fromDate && { gte: fromDate },
      ...toDate && { lte: toDate }
    };
  }
  if (query.searchTerm?.trim()) {
    const searchTerm = query.searchTerm.trim();
    where.OR = [
      {
        orderNumber: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        couponCode: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        items: {
          some: {
            productName: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        }
      }
    ];
  }
  return where;
};
var generateOrderNumber = () => {
  const datePrefix = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = randomUUID2().split("-")[0]?.toUpperCase() ?? "00000000";
  return `ORD-${datePrefix}-${randomSuffix}`;
};
var getUniqueOrderNumber = async (tx) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const orderNumber = generateOrderNumber();
    const existing = await tx.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    });
    if (!existing) {
      return orderNumber;
    }
  }
  throw new AppError_default(
    httpStatus23.SERVICE_UNAVAILABLE,
    "Unable to generate unique order number"
  );
};
var ensureShippingAddressBelongsToUser = async (tx, userId, shippingAddressId) => {
  const address = await tx.address.findFirst({
    where: {
      id: shippingAddressId,
      userId
    },
    select: {
      id: true
    }
  });
  if (!address) {
    throw new AppError_default(
      httpStatus23.NOT_FOUND,
      "Shipping address not found for this user"
    );
  }
};
var validateAndPrepareOrderItems = (cart) => {
  if (!cart.items.length) {
    throw new AppError_default(httpStatus23.BAD_REQUEST, "Cart is empty");
  }
  let subtotal = new prismaNamespace_exports.Decimal(0);
  const preparedItems = cart.items.map((item) => {
    if (item.option.variant.productId !== item.productId) {
      throw new AppError_default(
        httpStatus23.BAD_REQUEST,
        "Cart item contains mismatched product and variant option"
      );
    }
    if (!item.product.isActive) {
      throw new AppError_default(
        httpStatus23.BAD_REQUEST,
        `Product '${item.product.title}' is inactive`
      );
    }
    if (!item.option.variant.isActive) {
      throw new AppError_default(
        httpStatus23.BAD_REQUEST,
        `Variant '${item.option.variant.title}' is inactive`
      );
    }
    if (!item.option.isActive) {
      throw new AppError_default(
        httpStatus23.BAD_REQUEST,
        `Variant option '${item.option.sku}' is inactive`
      );
    }
    if (item.option.stock < item.quantity) {
      throw new AppError_default(
        httpStatus23.BAD_REQUEST,
        `Insufficient stock for SKU '${item.option.sku}'`
      );
    }
    if (item.product.price === null) {
      throw new AppError_default(
        httpStatus23.BAD_REQUEST,
        `Base price is missing for product '${item.product.title}'`
      );
    }
    const basePrice = decimalFrom2(item.product.price);
    const variantAdditionalPrice = decimalFrom2(item.option.price);
    const unitPrice = basePrice.add(variantAdditionalPrice);
    const total = unitPrice.mul(item.quantity);
    subtotal = subtotal.add(total);
    return {
      productId: item.product.id,
      variantOptionId: item.option.id,
      quantity: item.quantity,
      productName: item.product.title,
      productSku: item.option.sku,
      productImage: item.product.images[0]?.src ?? null,
      variantSnapshot: {
        variantId: item.option.variant.id,
        variantTitle: item.option.variant.title,
        optionId: item.option.id,
        optionSku: item.option.sku
      },
      unitPrice,
      discountAmount: new prismaNamespace_exports.Decimal(0),
      total,
      previousStock: item.option.stock
    };
  });
  return {
    preparedItems,
    subtotal
  };
};
var clearCartAfterOrder = async (tx, cartId) => {
  await tx.cartItem.deleteMany({
    where: {
      cartId
    }
  });
  await tx.cart.update({
    where: { id: cartId },
    data: {
      totalPrice: new prismaNamespace_exports.Decimal(0)
    }
  });
};
var restockOrderItems = async (tx, orderId, orderNumber, items, type, changedBy) => {
  for (const item of items) {
    const option = await tx.variantOption.findUnique({
      where: {
        id: item.variantOptionId
      },
      select: {
        id: true,
        stock: true
      }
    });
    if (!option) {
      throw new AppError_default(httpStatus23.NOT_FOUND, "Variant option not found");
    }
    const previousStock = option.stock;
    const newStock = previousStock + item.quantity;
    await tx.variantOption.update({
      where: { id: option.id },
      data: {
        stock: {
          increment: item.quantity
        }
      }
    });
    await tx.inventoryTransaction.create({
      data: {
        variantOptionId: option.id,
        type,
        quantity: item.quantity,
        previousStock,
        newStock,
        referenceId: orderId,
        referenceType: "order",
        note: `Stock restored due to ${type.toLowerCase()} for order ${orderNumber}`,
        createdBy: changedBy
      }
    });
  }
};
var createOrderFromCart = async (userId, payload) => {
  const order = await prisma.$transaction(async (tx) => {
    await ensureShippingAddressBelongsToUser(tx, userId, payload.shippingAddressId);
    const cart = await tx.cart.findUnique({
      where: {
        userId
      },
      select: createOrderCartSelect
    });
    if (!cart) {
      throw new AppError_default(httpStatus23.BAD_REQUEST, "Cart is empty");
    }
    const { preparedItems, subtotal } = validateAndPrepareOrderItems(cart);
    const discountTotal = new prismaNamespace_exports.Decimal(0);
    const shippingCost = decimalFrom2(payload.shippingCost ?? 0);
    const tax = decimalFrom2(payload.tax ?? 0);
    const total = subtotal.sub(discountTotal).add(shippingCost).add(tax);
    const orderNumber = await getUniqueOrderNumber(tx);
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId: payload.shippingAddressId,
        ...payload.billingAddress && {
          billingAddress: payload.billingAddress
        },
        status: "PENDING",
        notes: payload.notes ?? null,
        subtotal,
        discountTotal,
        shippingCost,
        tax,
        total
      },
      select: {
        id: true,
        orderNumber: true
      }
    });
    for (const item of preparedItems) {
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          variantOptionId: item.variantOptionId,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          productImage: item.productImage,
          variantSnapshot: item.variantSnapshot,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
          total: item.total
        }
      });
      const updated = await tx.variantOption.updateMany({
        where: {
          id: item.variantOptionId,
          stock: {
            gte: item.quantity
          }
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
      if (updated.count === 0) {
        throw new AppError_default(
          httpStatus23.BAD_REQUEST,
          `Insufficient stock for SKU '${item.productSku}'`
        );
      }
      await tx.inventoryTransaction.create({
        data: {
          variantOptionId: item.variantOptionId,
          type: "SALE",
          quantity: -item.quantity,
          previousStock: item.previousStock,
          newStock: item.previousStock - item.quantity,
          referenceId: createdOrder.id,
          referenceType: "order",
          note: `Stock deducted for order ${createdOrder.orderNumber}`,
          createdBy: userId
        }
      });
    }
    await PaymentService.createOrderPayment(tx, {
      orderId: createdOrder.id,
      method: payload.paymentMethod,
      amount: total
    });
    await tx.orderStatusHistory.create({
      data: {
        orderId: createdOrder.id,
        status: "PENDING",
        note: "Order placed",
        changedBy: userId
      }
    });
    await clearCartAfterOrder(tx, cart.id);
    const fullOrder = await tx.order.findUnique({
      where: {
        id: createdOrder.id
      },
      select: orderSelect
    });
    if (!fullOrder) {
      throw new AppError_default(httpStatus23.NOT_FOUND, "Order not found");
    }
    return fullOrder;
  });
  return order;
};
var getMyOrders = async (userId, query) => {
  const { page, limit, skip } = getPagination2(query);
  const where = buildOrderWhere(query, userId);
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: buildOrderBy5(query.sort),
      skip,
      take: limit,
      select: orderSelect
    }),
    prisma.order.count({ where })
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
var getMyOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    select: orderSelect
  });
  if (!order) {
    throw new AppError_default(httpStatus23.NOT_FOUND, "Order not found");
  }
  return order;
};
var getAllOrders = async (query) => {
  const { page, limit, skip } = getPagination2(query);
  const where = buildOrderWhere(query);
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: buildOrderBy5(query.sort),
      skip,
      take: limit,
      select: orderSelect
    }),
    prisma.order.count({ where })
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
var getOrderByIdForAdmin = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
    select: orderSelect
  });
  if (!order) {
    throw new AppError_default(httpStatus23.NOT_FOUND, "Order not found");
  }
  return order;
};
var ensureStatusTransition = (currentStatus, nextStatus) => {
  if (currentStatus === nextStatus) {
    throw new AppError_default(httpStatus23.BAD_REQUEST, "Order already has this status");
  }
  const allowedNextStatuses = orderStatusTransitions[currentStatus];
  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new AppError_default(
      httpStatus23.BAD_REQUEST,
      `Cannot transition order status from ${currentStatus} to ${nextStatus}`
    );
  }
};
var updateOrderStatus = async (orderId, payload, changedBy) => {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        items: {
          select: {
            variantOptionId: true,
            quantity: true
          }
        }
      }
    });
    if (!order) {
      throw new AppError_default(httpStatus23.NOT_FOUND, "Order not found");
    }
    const currentStatus = order.status;
    ensureStatusTransition(currentStatus, payload.status);
    const now = /* @__PURE__ */ new Date();
    const updateData = {
      status: payload.status
    };
    if (payload.status === "PROCESSING") {
      updateData.processedAt = now;
    }
    if (payload.status === "SHIPPED") {
      updateData.shippedAt = now;
    }
    if (payload.status === "DELIVERED") {
      updateData.deliveredAt = now;
    }
    if (payload.status === "CANCELLED") {
      updateData.cancelledAt = now;
    }
    if (payload.status === "RETURNED") {
      updateData.returnedAt = now;
    }
    await tx.order.update({
      where: { id: order.id },
      data: updateData
    });
    if (payload.status === "CANCELLED") {
      await restockOrderItems(
        tx,
        order.id,
        order.orderNumber,
        order.items,
        "CANCELLATION",
        changedBy
      );
    }
    if (payload.status === "RETURNED") {
      await restockOrderItems(
        tx,
        order.id,
        order.orderNumber,
        order.items,
        "RETURN",
        changedBy
      );
    }
    await PaymentService.syncPaymentWithOrderStatus(tx, order.id, payload.status);
    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: payload.status,
        note: payload.note ?? null,
        changedBy
      }
    });
    const fullOrder = await tx.order.findUnique({
      where: {
        id: order.id
      },
      select: orderSelect
    });
    if (!fullOrder) {
      throw new AppError_default(httpStatus23.NOT_FOUND, "Order not found");
    }
    return fullOrder;
  });
  return updatedOrder;
};
var OrderService = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdForAdmin,
  updateOrderStatus
};

// src/app/modules/order/order.controller.ts
var getParamAsString8 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus24.BAD_REQUEST, `${key} is required`);
  }
  return value;
};
var getAuthenticatedUserId2 = (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus24.UNAUTHORIZED, "User not authenticated");
  }
  return userId;
};
var createOrderFromCart2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId2(req);
  const payload = req.body;
  const result = await OrderService.createOrderFromCart(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus24.CREATED,
    message: "Order created successfully",
    data: result
  });
});
var getMyOrders2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId2(req);
  const query = req.query;
  const result = await OrderService.getMyOrders(userId, query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus24.OK,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMyOrderById2 = catchAsync(async (req, res) => {
  const userId = getAuthenticatedUserId2(req);
  const orderId = getParamAsString8(req.params.id, "Order id");
  const result = await OrderService.getMyOrderById(userId, orderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus24.OK,
    message: "Order retrieved successfully",
    data: result
  });
});
var getAllOrders2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await OrderService.getAllOrders(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus24.OK,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getOrderByIdForAdmin2 = catchAsync(async (req, res) => {
  const orderId = getParamAsString8(req.params.id, "Order id");
  const result = await OrderService.getOrderByIdForAdmin(orderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus24.OK,
    message: "Order retrieved successfully",
    data: result
  });
});
var updateOrderStatus2 = catchAsync(async (req, res) => {
  const orderId = getParamAsString8(req.params.id, "Order id");
  const payload = req.body;
  const changedBy = getAuthenticatedUserId2(req);
  const result = await OrderService.updateOrderStatus(orderId, payload, changedBy);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus24.OK,
    message: "Order status updated successfully",
    data: result
  });
});
var OrderControllers = {
  createOrderFromCart: createOrderFromCart2,
  getMyOrders: getMyOrders2,
  getMyOrderById: getMyOrderById2,
  getAllOrders: getAllOrders2,
  getOrderByIdForAdmin: getOrderByIdForAdmin2,
  updateOrderStatus: updateOrderStatus2
};

// src/app/modules/order/order.validation.ts
import { z as z9 } from "zod";
var paymentMethodValues2 = [
  "CASH_ON_DELIVERY",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "CREDIT_CARD",
  "BANK_TRANSFER"
];
var orderStatusValues2 = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED"
];
var optionalText4 = (max) => z9.string().trim().min(1, { message: "Value cannot be empty" }).max(max, { message: `Value cannot exceed ${max} characters` }).optional();
var createOrderZodSchema = z9.object({
  shippingAddressId: z9.string().uuid({ message: "shippingAddressId must be a valid UUID" }),
  paymentMethod: z9.enum(paymentMethodValues2, {
    message: "Unsupported payment method"
  }),
  notes: optionalText4(2e3),
  billingAddress: z9.record(z9.string(), z9.unknown()).optional(),
  shippingCost: z9.coerce.number().min(0, { message: "shippingCost cannot be negative" }).optional(),
  tax: z9.coerce.number().min(0, { message: "tax cannot be negative" }).optional()
});
var updateOrderStatusZodSchema = z9.object({
  status: z9.enum(orderStatusValues2, {
    message: "Unsupported order status"
  }),
  note: optionalText4(500)
});

// src/app/modules/order/order.route.ts
var router9 = Router9();
router9.post(
  "/",
  checkAuth("USER" /* USER */),
  validateRequest(createOrderZodSchema),
  OrderControllers.createOrderFromCart
);
router9.get(
  "/my-orders",
  checkAuth("USER" /* USER */),
  OrderControllers.getMyOrders
);
router9.get(
  "/my-orders/:id",
  checkAuth("USER" /* USER */),
  OrderControllers.getMyOrderById
);
router9.get(
  "/",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  OrderControllers.getAllOrders
);
router9.get(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  OrderControllers.getOrderByIdForAdmin
);
router9.patch(
  "/:id/status",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  validateRequest(updateOrderStatusZodSchema),
  OrderControllers.updateOrderStatus
);
var OrderRoutes = router9;

// src/app/routes/index.ts
var router10 = Router10();
var moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/product",
    route: ProductRoutes
  },
  {
    path: "/category",
    route: CategoryRoutes
  },
  {
    path: "/image",
    route: ImageRoutes
  },
  {
    path: "/cart",
    route: CartRoutes
  },
  {
    path: "/order",
    route: OrderRoutes
  },
  {
    path: "/tracking",
    route: TrackingRoutes
  },
  {
    path: "/review",
    route: ReviewRoutes
  }
];
moduleRoutes.forEach((route) => {
  router10.use(route.path, route.route);
});

// src/app/middlewares/globalErrorHandler.ts
import httpStatus25 from "http-status-codes";
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
    statusCode = httpStatus25.BAD_REQUEST;
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
import httpStatus26 from "http-status-codes";
var notFound = (req, res) => {
  res.status(httpStatus26.NOT_FOUND).json({
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
app.use("/api", router10);
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
