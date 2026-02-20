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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"credential","kind":"object","type":"UserCredential","relationName":"UserToUserCredential"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"MessageSender"},{"name":"customerConversations","kind":"object","type":"Conversation","relationName":"CustomerConversations"},{"name":"adminReviewReplies","kind":"object","type":"Review","relationName":"AdminReviewReplies"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductViewToUser"},{"name":"searchQueries","kind":"object","type":"SearchQuery","relationName":"SearchQueryToUser"},{"name":"blogComments","kind":"object","type":"BlogComment","relationName":"BlogCommentToUser"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToUser"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"UserToWishlist"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"lastIp","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referralSource","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"User"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sessions"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"tokenType","kind":"scalar","type":"String"},{"name":"scope","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"accounts"},"UserCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserCredential"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_credentials"},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"recipient","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"CategoryToProductImage"},{"name":"couponCategories","kind":"object","type":"CouponCategory","relationName":"CategoryToCouponCategory"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Tag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"ProductTag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tags"},"ProductTag":{"fields":[{"name":"productId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductTag"},{"name":"tag","kind":"object","type":"Tag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"product_tags"},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"brand","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"lowStockThreshold","kind":"scalar","type":"Int"},{"name":"hasVariants","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"isDigital","kind":"scalar","type":"Boolean"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"variants","kind":"object","type":"ProductVariant","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"tags","kind":"object","type":"ProductTag","relationName":"ProductToProductTag"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductToProductView"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToProduct"},{"name":"couponProducts","kind":"object","type":"CouponProduct","relationName":"CouponProductToProduct"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"products"},"ProductVariant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToProductVariant"},{"name":"options","kind":"object","type":"VariantOption","relationName":"ProductVariantToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_variants"},"VariantOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productVariantId","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductVariantToVariantOption"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToVariantOption"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToVariantOption"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToVariantOption"},{"name":"inventoryTransactions","kind":"object","type":"InventoryTransaction","relationName":"InventoryTransactionToVariantOption"},{"name":"wishlistItems","kind":"object","type":"WishlistItem","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"variant_options"},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"src","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"productId","kind":"scalar","type":"String"},{"name":"variantId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductImageToProductVariant"},{"name":"option","kind":"object","type":"VariantOption","relationName":"ProductImageToVariantOption"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProductImage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_images"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"helpfulVotes","kind":"scalar","type":"Int"},{"name":"notHelpfulVotes","kind":"scalar","type":"Int"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"adminRepliedAt","kind":"scalar","type":"DateTime"},{"name":"adminRepliedBy","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"User","relationName":"AdminReviewReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"CartItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"shippingAddressId","kind":"scalar","type":"String"},{"name":"billingAddress","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"adminNotes","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"discountTotal","kind":"scalar","type":"Decimal"},{"name":"shippingCost","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"couponCode","kind":"scalar","type":"String"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"shippedAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"returnedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"statusHistory","kind":"object","type":"OrderStatusHistory","relationName":"OrderToOrderStatusHistory"},{"name":"shipments","kind":"object","type":"Shipment","relationName":"OrderToShipment"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"productName","kind":"scalar","type":"String"},{"name":"productSku","kind":"scalar","type":"String"},{"name":"productImage","kind":"scalar","type":"String"},{"name":"variantSnapshot","kind":"scalar","type":"Json"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"OrderItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"OrderStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"changedBy","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderStatusHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_status_history"},"Shipment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"carrier","kind":"scalar","type":"String"},{"name":"trackingNumber","kind":"scalar","type":"String"},{"name":"trackingUrl","kind":"scalar","type":"String"},{"name":"shippingMethod","kind":"scalar","type":"String"},{"name":"estimatedDelivery","kind":"scalar","type":"DateTime"},{"name":"actualDelivery","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"ShipmentStatus"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToShipment"},{"name":"events","kind":"object","type":"ShipmentEvent","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"shipments"},"ShipmentEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"occurredAt","kind":"scalar","type":"DateTime"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"shipment_events"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"discountType","kind":"enum","type":"DiscountType"},{"name":"discountValue","kind":"scalar","type":"Decimal"},{"name":"minPurchase","kind":"scalar","type":"Decimal"},{"name":"maxDiscount","kind":"scalar","type":"Decimal"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usageCount","kind":"scalar","type":"Int"},{"name":"perUserLimit","kind":"scalar","type":"Int"},{"name":"validFrom","kind":"scalar","type":"DateTime"},{"name":"validUntil","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"appliesToAll","kind":"scalar","type":"Boolean"},{"name":"products","kind":"object","type":"CouponProduct","relationName":"CouponToCouponProduct"},{"name":"categories","kind":"object","type":"CouponCategory","relationName":"CouponToCouponCategory"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"CouponProduct":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponProduct"},{"name":"product","kind":"object","type":"Product","relationName":"CouponProductToProduct"}],"dbName":"coupon_products"},"CouponCategory":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponCategory"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToCouponCategory"}],"dbName":"coupon_categories"},"InventoryTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InventoryTransactionType"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"previousStock","kind":"scalar","type":"Int"},{"name":"newStock","kind":"scalar","type":"Int"},{"name":"referenceId","kind":"scalar","type":"String"},{"name":"referenceType","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"variantOption","kind":"object","type":"VariantOption","relationName":"InventoryTransactionToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"inventory_transactions"},"Wishlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToWishlist"},{"name":"items","kind":"object","type":"WishlistItem","relationName":"WishlistToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlists"},"WishlistItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"wishlistId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"WishlistToWishlistItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlist_items"},"BlogPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"featuredImage","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"views","kind":"scalar","type":"Int"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"categories","kind":"object","type":"BlogPostCategory","relationName":"BlogPostToBlogPostCategory"},{"name":"tags","kind":"object","type":"BlogPostTag","relationName":"BlogPostToBlogPostTag"},{"name":"comments","kind":"object","type":"BlogComment","relationName":"BlogCommentToBlogPost"},{"name":"allowComments","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_posts"},"BlogCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostCategory","relationName":"BlogCategoryToBlogPostCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_categories"},"BlogTag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostTag","relationName":"BlogPostTagToBlogTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_tags"},"BlogPostCategory":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostCategory"},{"name":"category","kind":"object","type":"BlogCategory","relationName":"BlogCategoryToBlogPostCategory"}],"dbName":"blog_post_categories"},"BlogPostTag":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostTag"},{"name":"tag","kind":"object","type":"BlogTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_post_tags"},"BlogComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"postId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"authorName","kind":"scalar","type":"String"},{"name":"authorEmail","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogCommentToBlogPost"},{"name":"user","kind":"object","type":"User","relationName":"BlogCommentToUser"},{"name":"parent","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_comments"},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConversationStatus"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerConversations"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"conversations"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"senderRole","kind":"enum","type":"UserRole"},{"name":"content","kind":"scalar","type":"String"},{"name":"attachments","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"MessageStatus"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"sender","kind":"object","type":"User","relationName":"MessageSender"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"ProductView":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductView"},{"name":"user","kind":"object","type":"User","relationName":"ProductViewToUser"},{"name":"viewedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_views"},"SearchQuery":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"query","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"resultCount","kind":"scalar","type":"Int"},{"name":"filters","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"SearchQueryToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"search_queries"},"ConversionEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"sourceUrl","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"sentToMeta","kind":"scalar","type":"Boolean"},{"name":"sentToGa4","kind":"scalar","type":"Boolean"},{"name":"metaLastSentAt","kind":"scalar","type":"DateTime"},{"name":"ga4LastSentAt","kind":"scalar","type":"DateTime"},{"name":"attemptCount","kind":"scalar","type":"Int"},{"name":"lastAttemptAt","kind":"scalar","type":"DateTime"},{"name":"lastError","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"ConversionEventToUser"},{"name":"order","kind":"object","type":"Order","relationName":"ConversionEventToOrder"},{"name":"product","kind":"object","type":"Product","relationName":"ConversionEventToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"conversion_events"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","address","coupon","parent","children","products","product","images","variant","items","_count","cart","option","cartItems","order","orderItems","variantOption","inventoryTransactions","wishlist","wishlistItems","options","category","couponCategories","variants","admin","reviews","tag","tags","productViews","conversionEvents","couponProducts","categories","orders","payment","statusHistory","shipment","events","shipments","addresses","sessions","accounts","credential","customer","messages","conversation","sender","sentMessages","customerConversations","adminReviewReplies","searchQueries","post","posts","comments","replies","blogComments","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","UserCredential.findUnique","UserCredential.findUniqueOrThrow","UserCredential.findFirst","UserCredential.findFirstOrThrow","UserCredential.findMany","UserCredential.createOne","UserCredential.createMany","UserCredential.createManyAndReturn","UserCredential.updateOne","UserCredential.updateMany","UserCredential.updateManyAndReturn","UserCredential.upsertOne","UserCredential.deleteOne","UserCredential.deleteMany","UserCredential.groupBy","UserCredential.aggregate","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","Address.upsertOne","Address.deleteOne","Address.deleteMany","Address.groupBy","Address.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","_avg","_sum","Category.groupBy","Category.aggregate","Tag.findUnique","Tag.findUniqueOrThrow","Tag.findFirst","Tag.findFirstOrThrow","Tag.findMany","Tag.createOne","Tag.createMany","Tag.createManyAndReturn","Tag.updateOne","Tag.updateMany","Tag.updateManyAndReturn","Tag.upsertOne","Tag.deleteOne","Tag.deleteMany","Tag.groupBy","Tag.aggregate","ProductTag.findUnique","ProductTag.findUniqueOrThrow","ProductTag.findFirst","ProductTag.findFirstOrThrow","ProductTag.findMany","ProductTag.createOne","ProductTag.createMany","ProductTag.createManyAndReturn","ProductTag.updateOne","ProductTag.updateMany","ProductTag.updateManyAndReturn","ProductTag.upsertOne","ProductTag.deleteOne","ProductTag.deleteMany","ProductTag.groupBy","ProductTag.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","ProductVariant.findUnique","ProductVariant.findUniqueOrThrow","ProductVariant.findFirst","ProductVariant.findFirstOrThrow","ProductVariant.findMany","ProductVariant.createOne","ProductVariant.createMany","ProductVariant.createManyAndReturn","ProductVariant.updateOne","ProductVariant.updateMany","ProductVariant.updateManyAndReturn","ProductVariant.upsertOne","ProductVariant.deleteOne","ProductVariant.deleteMany","ProductVariant.groupBy","ProductVariant.aggregate","VariantOption.findUnique","VariantOption.findUniqueOrThrow","VariantOption.findFirst","VariantOption.findFirstOrThrow","VariantOption.findMany","VariantOption.createOne","VariantOption.createMany","VariantOption.createManyAndReturn","VariantOption.updateOne","VariantOption.updateMany","VariantOption.updateManyAndReturn","VariantOption.upsertOne","VariantOption.deleteOne","VariantOption.deleteMany","VariantOption.groupBy","VariantOption.aggregate","ProductImage.findUnique","ProductImage.findUniqueOrThrow","ProductImage.findFirst","ProductImage.findFirstOrThrow","ProductImage.findMany","ProductImage.createOne","ProductImage.createMany","ProductImage.createManyAndReturn","ProductImage.updateOne","ProductImage.updateMany","ProductImage.updateManyAndReturn","ProductImage.upsertOne","ProductImage.deleteOne","ProductImage.deleteMany","ProductImage.groupBy","ProductImage.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","OrderStatusHistory.findUnique","OrderStatusHistory.findUniqueOrThrow","OrderStatusHistory.findFirst","OrderStatusHistory.findFirstOrThrow","OrderStatusHistory.findMany","OrderStatusHistory.createOne","OrderStatusHistory.createMany","OrderStatusHistory.createManyAndReturn","OrderStatusHistory.updateOne","OrderStatusHistory.updateMany","OrderStatusHistory.updateManyAndReturn","OrderStatusHistory.upsertOne","OrderStatusHistory.deleteOne","OrderStatusHistory.deleteMany","OrderStatusHistory.groupBy","OrderStatusHistory.aggregate","Shipment.findUnique","Shipment.findUniqueOrThrow","Shipment.findFirst","Shipment.findFirstOrThrow","Shipment.findMany","Shipment.createOne","Shipment.createMany","Shipment.createManyAndReturn","Shipment.updateOne","Shipment.updateMany","Shipment.updateManyAndReturn","Shipment.upsertOne","Shipment.deleteOne","Shipment.deleteMany","Shipment.groupBy","Shipment.aggregate","ShipmentEvent.findUnique","ShipmentEvent.findUniqueOrThrow","ShipmentEvent.findFirst","ShipmentEvent.findFirstOrThrow","ShipmentEvent.findMany","ShipmentEvent.createOne","ShipmentEvent.createMany","ShipmentEvent.createManyAndReturn","ShipmentEvent.updateOne","ShipmentEvent.updateMany","ShipmentEvent.updateManyAndReturn","ShipmentEvent.upsertOne","ShipmentEvent.deleteOne","ShipmentEvent.deleteMany","ShipmentEvent.groupBy","ShipmentEvent.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Coupon.findUnique","Coupon.findUniqueOrThrow","Coupon.findFirst","Coupon.findFirstOrThrow","Coupon.findMany","Coupon.createOne","Coupon.createMany","Coupon.createManyAndReturn","Coupon.updateOne","Coupon.updateMany","Coupon.updateManyAndReturn","Coupon.upsertOne","Coupon.deleteOne","Coupon.deleteMany","Coupon.groupBy","Coupon.aggregate","CouponProduct.findUnique","CouponProduct.findUniqueOrThrow","CouponProduct.findFirst","CouponProduct.findFirstOrThrow","CouponProduct.findMany","CouponProduct.createOne","CouponProduct.createMany","CouponProduct.createManyAndReturn","CouponProduct.updateOne","CouponProduct.updateMany","CouponProduct.updateManyAndReturn","CouponProduct.upsertOne","CouponProduct.deleteOne","CouponProduct.deleteMany","CouponProduct.groupBy","CouponProduct.aggregate","CouponCategory.findUnique","CouponCategory.findUniqueOrThrow","CouponCategory.findFirst","CouponCategory.findFirstOrThrow","CouponCategory.findMany","CouponCategory.createOne","CouponCategory.createMany","CouponCategory.createManyAndReturn","CouponCategory.updateOne","CouponCategory.updateMany","CouponCategory.updateManyAndReturn","CouponCategory.upsertOne","CouponCategory.deleteOne","CouponCategory.deleteMany","CouponCategory.groupBy","CouponCategory.aggregate","InventoryTransaction.findUnique","InventoryTransaction.findUniqueOrThrow","InventoryTransaction.findFirst","InventoryTransaction.findFirstOrThrow","InventoryTransaction.findMany","InventoryTransaction.createOne","InventoryTransaction.createMany","InventoryTransaction.createManyAndReturn","InventoryTransaction.updateOne","InventoryTransaction.updateMany","InventoryTransaction.updateManyAndReturn","InventoryTransaction.upsertOne","InventoryTransaction.deleteOne","InventoryTransaction.deleteMany","InventoryTransaction.groupBy","InventoryTransaction.aggregate","Wishlist.findUnique","Wishlist.findUniqueOrThrow","Wishlist.findFirst","Wishlist.findFirstOrThrow","Wishlist.findMany","Wishlist.createOne","Wishlist.createMany","Wishlist.createManyAndReturn","Wishlist.updateOne","Wishlist.updateMany","Wishlist.updateManyAndReturn","Wishlist.upsertOne","Wishlist.deleteOne","Wishlist.deleteMany","Wishlist.groupBy","Wishlist.aggregate","WishlistItem.findUnique","WishlistItem.findUniqueOrThrow","WishlistItem.findFirst","WishlistItem.findFirstOrThrow","WishlistItem.findMany","WishlistItem.createOne","WishlistItem.createMany","WishlistItem.createManyAndReturn","WishlistItem.updateOne","WishlistItem.updateMany","WishlistItem.updateManyAndReturn","WishlistItem.upsertOne","WishlistItem.deleteOne","WishlistItem.deleteMany","WishlistItem.groupBy","WishlistItem.aggregate","BlogPost.findUnique","BlogPost.findUniqueOrThrow","BlogPost.findFirst","BlogPost.findFirstOrThrow","BlogPost.findMany","BlogPost.createOne","BlogPost.createMany","BlogPost.createManyAndReturn","BlogPost.updateOne","BlogPost.updateMany","BlogPost.updateManyAndReturn","BlogPost.upsertOne","BlogPost.deleteOne","BlogPost.deleteMany","BlogPost.groupBy","BlogPost.aggregate","BlogCategory.findUnique","BlogCategory.findUniqueOrThrow","BlogCategory.findFirst","BlogCategory.findFirstOrThrow","BlogCategory.findMany","BlogCategory.createOne","BlogCategory.createMany","BlogCategory.createManyAndReturn","BlogCategory.updateOne","BlogCategory.updateMany","BlogCategory.updateManyAndReturn","BlogCategory.upsertOne","BlogCategory.deleteOne","BlogCategory.deleteMany","BlogCategory.groupBy","BlogCategory.aggregate","BlogTag.findUnique","BlogTag.findUniqueOrThrow","BlogTag.findFirst","BlogTag.findFirstOrThrow","BlogTag.findMany","BlogTag.createOne","BlogTag.createMany","BlogTag.createManyAndReturn","BlogTag.updateOne","BlogTag.updateMany","BlogTag.updateManyAndReturn","BlogTag.upsertOne","BlogTag.deleteOne","BlogTag.deleteMany","BlogTag.groupBy","BlogTag.aggregate","BlogPostCategory.findUnique","BlogPostCategory.findUniqueOrThrow","BlogPostCategory.findFirst","BlogPostCategory.findFirstOrThrow","BlogPostCategory.findMany","BlogPostCategory.createOne","BlogPostCategory.createMany","BlogPostCategory.createManyAndReturn","BlogPostCategory.updateOne","BlogPostCategory.updateMany","BlogPostCategory.updateManyAndReturn","BlogPostCategory.upsertOne","BlogPostCategory.deleteOne","BlogPostCategory.deleteMany","BlogPostCategory.groupBy","BlogPostCategory.aggregate","BlogPostTag.findUnique","BlogPostTag.findUniqueOrThrow","BlogPostTag.findFirst","BlogPostTag.findFirstOrThrow","BlogPostTag.findMany","BlogPostTag.createOne","BlogPostTag.createMany","BlogPostTag.createManyAndReturn","BlogPostTag.updateOne","BlogPostTag.updateMany","BlogPostTag.updateManyAndReturn","BlogPostTag.upsertOne","BlogPostTag.deleteOne","BlogPostTag.deleteMany","BlogPostTag.groupBy","BlogPostTag.aggregate","BlogComment.findUnique","BlogComment.findUniqueOrThrow","BlogComment.findFirst","BlogComment.findFirstOrThrow","BlogComment.findMany","BlogComment.createOne","BlogComment.createMany","BlogComment.createManyAndReturn","BlogComment.updateOne","BlogComment.updateMany","BlogComment.updateManyAndReturn","BlogComment.upsertOne","BlogComment.deleteOne","BlogComment.deleteMany","BlogComment.groupBy","BlogComment.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","ProductView.findUnique","ProductView.findUniqueOrThrow","ProductView.findFirst","ProductView.findFirstOrThrow","ProductView.findMany","ProductView.createOne","ProductView.createMany","ProductView.createManyAndReturn","ProductView.updateOne","ProductView.updateMany","ProductView.updateManyAndReturn","ProductView.upsertOne","ProductView.deleteOne","ProductView.deleteMany","ProductView.groupBy","ProductView.aggregate","SearchQuery.findUnique","SearchQuery.findUniqueOrThrow","SearchQuery.findFirst","SearchQuery.findFirstOrThrow","SearchQuery.findMany","SearchQuery.createOne","SearchQuery.createMany","SearchQuery.createManyAndReturn","SearchQuery.updateOne","SearchQuery.updateMany","SearchQuery.updateManyAndReturn","SearchQuery.upsertOne","SearchQuery.deleteOne","SearchQuery.deleteMany","SearchQuery.groupBy","SearchQuery.aggregate","ConversionEvent.findUnique","ConversionEvent.findUniqueOrThrow","ConversionEvent.findFirst","ConversionEvent.findFirstOrThrow","ConversionEvent.findMany","ConversionEvent.createOne","ConversionEvent.createMany","ConversionEvent.createManyAndReturn","ConversionEvent.updateOne","ConversionEvent.updateMany","ConversionEvent.updateManyAndReturn","ConversionEvent.upsertOne","ConversionEvent.deleteOne","ConversionEvent.deleteMany","ConversionEvent.groupBy","ConversionEvent.aggregate","AND","OR","NOT","id","eventType","eventId","userId","sessionId","orderId","productId","value","currency","sourceUrl","ipAddress","userAgent","sentToMeta","sentToGa4","metaLastSentAt","ga4LastSentAt","attemptCount","lastAttemptAt","lastError","metadata","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","query","resultCount","filters","ip","referrer","viewedAt","conversationId","senderId","UserRole","senderRole","content","attachments","MessageStatus","status","updatedAt","customerId","subject","ConversationStatus","assignedTo","postId","authorName","authorEmail","isApproved","parentId","tagId","categoryId","name","slug","every","some","none","description","title","excerpt","featuredImage","authorId","publishedAt","isPublished","views","metaTitle","metaDescription","metaKeywords","allowComments","wishlistId","variantOptionId","isPublic","shareToken","InventoryTransactionType","type","quantity","previousStock","newStock","referenceId","referenceType","note","createdBy","couponId","code","DiscountType","discountType","discountValue","minPurchase","maxDiscount","usageLimit","usageCount","perUserLimit","validFrom","validUntil","isActive","appliesToAll","PaymentMethod","method","PaymentStatus","amount","transactionId","gatewayResponse","paidAt","errorMessage","shipmentId","location","occurredAt","carrier","trackingNumber","trackingUrl","shippingMethod","estimatedDelivery","actualDelivery","ShipmentStatus","OrderStatus","changedBy","productName","productSku","productImage","variantSnapshot","unitPrice","discountAmount","total","orderNumber","shippingAddressId","billingAddress","notes","adminNotes","subtotal","discountTotal","shippingCost","tax","couponCode","placedAt","processedAt","shippedAt","deliveredAt","cancelledAt","returnedAt","cartId","rating","comment","isVerifiedPurchase","helpfulVotes","notHelpfulVotes","adminReply","adminRepliedAt","adminRepliedBy","src","publicId","altText","sortOrder","isPrimary","variantId","productVariantId","sku","barcode","price","compareAtPrice","costPrice","stock","shortDesc","brand","lowStockThreshold","hasVariants","isFeatured","isDigital","image","label","recipient","phone","street","city","state","zipCode","country","isDefault","passwordHash","providerId","providerAccountId","accessToken","refreshToken","expiresAt","tokenType","scope","idToken","token","email","emailVerified","role","UserStatus","lastLoginAt","lastIp","referralSource","postId_tagId","postId_categoryId","providerId_providerAccountId","productId_tagId","userId_productId","couponId_categoryId","wishlistId_variantOptionId","cartId_variantOptionId","productVariantId_sku","parentId_name","couponId_productId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "sBTeAuAEIQ4AAP4JACAVAACDCgAgHAAA_QkAIB8AAIAKACAgAACCCgAgIwAAogkAICkAAPkJACAqAAD6CQAgKwAA-wkAICwAAPwJACAxAADfCQAgMgAA_wkAIDMAAP0JACA0AACBCgAgOQAAhQkAIKIFAAD3CQAwowUAAFUAEKQFAAD3CQAwpQUBAAAAAbAFAQD9CAAhuAUAAIQJACC5BUAA-QgAIdgFAAD4CfAGItkFQAD5CAAh5QUBAP0IACHYBgEA_QgAIdsGAQAAAAHsBgEAAAAB7QYgAIIJACHuBgAA4QnUBSLwBkAAgQkAIfEGAQD9CAAh8gYBAP0IACEBAAAAAQAgEgMAAIkJACAjAACiCQAgogUAAK8KADCjBQAAAwAQpAUAAK8KADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIdkGAQD9CAAh2gYBAP0IACHbBgEA_QgAIdwGAQD4CAAh3QYBAPgIACHeBgEA_QgAId8GAQD9CAAh4AYBAPgIACHhBiAAggkAIQcDAAD5CwAgIwAAnA0AINkGAACwCgAg2gYAALAKACDbBgAAsAoAIN4GAACwCgAg3wYAALAKACASAwAAiQkAICMAAKIJACCiBQAArwoAMKMFAAADABCkBQAArwoAMKUFAQAAAAGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHZBgEA_QgAIdoGAQD9CAAh2wYBAP0IACHcBgEA-AgAId0GAQD4CAAh3gYBAP0IACHfBgEA_QgAIeAGAQD4CAAh4QYgAIIJACEDAAAAAwAgAQAABAAwAgAABQAgIgMAAIkJACAEAACqCgAgBQAAqwoAIAwAAJsKACAgAACCCgAgJAAArAoAICUAAK0KACAoAACuCgAgogUAAKkKADCjBQAABwAQpAUAAKkKADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHYBQAA7QmkBiLZBUAA-QgAIYMGAQD9CAAhqwYQAJ0JACGsBgEA-AgAIa0GAQD4CAAhrgYAAIQJACCvBgEA_QgAIbAGAQD9CAAhsQYQAJ0JACGyBhAAnQkAIbMGEACdCQAhtAYQAJ0JACG1BgEA_QgAIbYGQAD5CAAhtwZAAIEJACG4BkAAgQkAIbkGQACBCQAhugZAAIEJACG7BkAAgQkAIRIDAAD5CwAgBAAA8xEAIAUAAOoRACAMAADuEQAgIAAA3REAICQAAPQRACAlAAD1EQAgKAAA9hEAIIMGAACwCgAgrgYAALAKACCvBgAAsAoAILAGAACwCgAgtQYAALAKACC3BgAAsAoAILgGAACwCgAguQYAALAKACC6BgAAsAoAILsGAACwCgAgIgMAAIkJACAEAACqCgAgBQAAqwoAIAwAAJsKACAgAACCCgAgJAAArAoAICUAAK0KACAoAACuCgAgogUAAKkKADCjBQAABwAQpAUAAKkKADClBQEAAAABqAUBAPgIACG5BUAA-QgAIdgFAADtCaQGItkFQAD5CAAhgwYBAP0IACGrBhAAnQkAIawGAQAAAAGtBgEA-AgAIa4GAACECQAgrwYBAP0IACGwBgEA_QgAIbEGEACdCQAhsgYQAJ0JACGzBhAAnQkAIbQGEACdCQAhtQYBAP0IACG2BkAA-QgAIbcGQACBCQAhuAZAAIEJACG5BkAAgQkAIboGQACBCQAhuwZAAIEJACEDAAAABwAgAQAACAAwAgAACQAgFggAAKAJACAiAAChCQAgIwAAogkAIKIFAACbCQAwowUAAAsAEKQFAACbCQAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh6gUBAP0IACGEBgEA-AgAIYYGAACcCYYGIocGEACdCQAhiAYQAJ4JACGJBhAAngkAIYoGAgCfCQAhiwYCAIMJACGMBgIAnwkAIY0GQAD5CAAhjgZAAPkIACGPBiAAggkAIZAGIACCCQAhAQAAAAsAIAcFAACLCgAgCQAA8wkAIKIFAACoCgAwowUAAA0AEKQFAACoCgAwqwUBAPgIACGDBgEA-AgAIQIFAADqEQAgCQAA5hEAIAgFAACLCgAgCQAA8wkAIKIFAACoCgAwowUAAA0AEKQFAACoCgAwqwUBAPgIACGDBgEA-AgAIf0GAACnCgAgAwAAAA0AIAEAAA4AMAIAAA8AIBUGAACgCgAgBwAApQoAIAgAAKYKACAKAACHCgAgGQAAoQkAIKIFAACkCgAwowUAABEAEKQFAACkCgAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4gUBAP0IACHlBQEA-AgAIeYFAQD4CAAh6gUBAP0IACHyBQEA_QgAIfMFAQD9CAAh9AUBAP0IACGPBiAAggkAIcgGAgCDCQAh2AYBAP0IACEBAAAAEQAgAQAAABEAIAsGAADrEQAgBwAA8REAIAgAAPIRACAKAADoEQAgGQAAmw0AIOIFAACwCgAg6gUAALAKACDyBQAAsAoAIPMFAACwCgAg9AUAALAKACDYBgAAsAoAIBYGAACgCgAgBwAApQoAIAgAAKYKACAKAACHCgAgGQAAoQkAIKIFAACkCgAwowUAABEAEKQFAACkCgAwpQUBAAAAAbkFQAD5CAAh2QVAAPkIACHiBQEA_QgAIeUFAQD4CAAh5gUBAAAAAeoFAQD9CAAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAhjwYgAIIJACHIBgIAgwkAIdgGAQD9CAAh_AYAAKMKACADAAAAEQAgAQAAFAAwAgAAFQAgIwoAAIcKACAYAACgCgAgGgAAogoAIBwAAP0JACAeAADHCQAgHwAAgAoAICAAAIIKACAhAACgCQAgogUAAKEKADCjBQAAFwAQpAUAAKEKADClBQEA-AgAIbgFAACECQAguQVAAPkIACHZBUAA-QgAIeQFAQD9CAAh5gUBAPgIACHqBQEA_QgAIesFAQD4CAAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAhjwYgAIIJACHMBgEA_QgAIc0GAQD9CAAhzgYQAJ4JACHPBhAAngkAIdAGEACeCQAh0QYCAJ8JACHSBgEA_QgAIdMGAQD9CAAh1AYCAIMJACHVBiAAggkAIdYGIACCCQAh1wYgAIIJACEWCgAA6BEAIBgAAOsRACAaAADwEQAgHAAA1xEAIB4AAM4PACAfAADbEQAgIAAA3REAICEAAJoNACC4BQAAsAoAIOQFAACwCgAg6gUAALAKACDyBQAAsAoAIPMFAACwCgAg9AUAALAKACDMBgAAsAoAIM0GAACwCgAgzgYAALAKACDPBgAAsAoAINAGAACwCgAg0QYAALAKACDSBgAAsAoAINMGAACwCgAgIwoAAIcKACAYAACgCgAgGgAAogoAIBwAAP0JACAeAADHCQAgHwAAgAoAICAAAIIKACAhAACgCQAgogUAAKEKADCjBQAAFwAQpAUAAKEKADClBQEAAAABuAUAAIQJACC5BUAA-QgAIdkFQAD5CAAh5AUBAP0IACHmBQEAAAAB6gUBAP0IACHrBQEA-AgAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIY8GIACCCQAhzAYBAAAAAc0GAQD9CAAhzgYQAJ4JACHPBhAAngkAIdAGEACeCQAh0QYCAJ8JACHSBgEA_QgAIdMGAQD9CAAh1AYCAIMJACHVBiAAggkAIdYGIACCCQAh1wYgAIIJACEDAAAAFwAgAQAAGAAwAgAAGQAgEwkAAPEJACALAACeCgAgDwAAnwoAIBgAAKAKACCiBQAAnQoAMKMFAAAbABCkBQAAnQoAMKUFAQD4CAAhqwUBAP0IACG5BUAA-QgAIdkFQAD5CAAh5AUBAP0IACH3BQEA_QgAIcUGAQD4CAAhxgYBAP0IACHHBgEA_QgAIcgGAgCDCQAhyQYgAIIJACHKBgEA_QgAIQoJAADmEQAgCwAA7REAIA8AAOwRACAYAADrEQAgqwUAALAKACDkBQAAsAoAIPcFAACwCgAgxgYAALAKACDHBgAAsAoAIMoGAACwCgAgEwkAAPEJACALAACeCgAgDwAAnwoAIBgAAKAKACCiBQAAnQoAMKMFAAAbABCkBQAAnQoAMKUFAQAAAAGrBQEA_QgAIbkFQAD5CAAh2QVAAPkIACHkBQEA_QgAIfcFAQD9CAAhxQYBAPgIACHGBgEA_QgAIccGAQD9CAAhyAYCAIMJACHJBiAAggkAIcoGAQD9CAAhAwAAABsAIAEAABwAMAIAAB0AIAEAAAAXACAMCQAA8wkAIAoAAIcKACAXAACICgAgogUAAIYKADCjBQAAIAAQpAUAAIYKADClBQEA-AgAIasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIesFAQD4CAAhjwYgAIIJACEBAAAAIAAgAwAAABsAIAEAABwAMAIAAB0AIBQKAACHCgAgCwAAmgoAIBAAAL4JACASAACbCgAgFAAAnAoAIBYAAIoJACCiBQAAmQoAMKMFAAAjABCkBQAAmQoAMKUFAQD4CAAhuQVAAPkIACHZBUAA-QgAIY8GIACCCQAhywYBAPgIACHMBgEA-AgAIc0GAQD9CAAhzgYQAJ0JACHPBhAAngkAIdAGEACeCQAh0QYCAIMJACEJCgAA6BEAIAsAAO0RACAQAADeDQAgEgAA7hEAIBQAAO8RACAWAAD6CwAgzQYAALAKACDPBgAAsAoAINAGAACwCgAgFQoAAIcKACALAACaCgAgEAAAvgkAIBIAAJsKACAUAACcCgAgFgAAigkAIKIFAACZCgAwowUAACMAEKQFAACZCgAwpQUBAAAAAbkFQAD5CAAh2QVAAPkIACGPBiAAggkAIcsGAQD4CAAhzAYBAAAAAc0GAQD9CAAhzgYQAJ0JACHPBhAAngkAIdAGEACeCQAh0QYCAIMJACH7BgAAmAoAIAMAAAAjACABAAAkADACAAAlACALDgAAlwoAIA8AAJAKACCiBQAAlgoAMKMFAAAnABCkBQAAlgoAMKUFAQD4CAAhuQVAAPkIACHZBUAA-QgAIfcFAQD4CAAh_AUCAIMJACG8BgEA-AgAIQIOAADYEQAgDwAA7BEAIAwOAACXCgAgDwAAkAoAIKIFAACWCgAwowUAACcAEKQFAACWCgAwpQUBAAAAAbkFQAD5CAAh2QVAAPkIACH3BQEA-AgAIfwFAgCDCQAhvAYBAPgIACH6BgAAlQoAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAACcAIBIPAACQCgAgEQAArQkAIKIFAACTCgAwowUAAC0AEKQFAACTCgAwpQUBAPgIACGqBQEA-AgAIasFAQD4CAAhuQVAAPkIACH3BQEA-AgAIfwFAgCDCQAhpQYBAPgIACGmBgEA-AgAIacGAQD9CAAhqAYAAJQKACCpBhAAnQkAIaoGEACdCQAhqwYQAJ0JACEDDwAA7BEAIBEAAKQNACCnBgAAsAoAIBIPAACQCgAgEQAArQkAIKIFAACTCgAwowUAAC0AEKQFAACTCgAwpQUBAAAAAaoFAQD4CAAhqwUBAPgIACG5BUAA-QgAIfcFAQD4CAAh_AUCAIMJACGlBgEA-AgAIaYGAQD4CAAhpwYBAP0IACGoBgAAlAoAIKkGEACdCQAhqgYQAJ0JACGrBhAAnQkAIQMAAAAtACABAAAuADACAAAvACADAAAAGwAgAQAAHAAwAgAAHQAgDxMAAJAKACCiBQAAkQoAMKMFAAAyABCkBQAAkQoAMKUFAQD4CAAhuQVAAPkIACH3BQEA-AgAIfsFAACSCvsFIvwFAgCDCQAh_QUCAIMJACH-BQIAgwkAIf8FAQD9CAAhgAYBAP0IACGBBgEA_QgAIYIGAQD9CAAhBRMAAOwRACD_BQAAsAoAIIAGAACwCgAggQYAALAKACCCBgAAsAoAIA8TAACQCgAgogUAAJEKADCjBQAAMgAQpAUAAJEKADClBQEAAAABuQVAAPkIACH3BQEA-AgAIfsFAACSCvsFIvwFAgCDCQAh_QUCAIMJACH-BQIAgwkAIf8FAQD9CAAhgAYBAP0IACGBBgEA_QgAIYIGAQD9CAAhAwAAADIAIAEAADMAMAIAADQAIAkPAACQCgAgFQAAjwoAIKIFAACOCgAwowUAADYAEKQFAACOCgAwpQUBAPgIACG5BUAA-QgAIfYFAQD4CAAh9wUBAPgIACECDwAA7BEAIBUAAN4RACAKDwAAkAoAIBUAAI8KACCiBQAAjgoAMKMFAAA2ABCkBQAAjgoAMKUFAQAAAAG5BUAA-QgAIfYFAQD4CAAh9wUBAPgIACH5BgAAjQoAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAQAAADYAIAEAAAAnACABAAAALQAgAQAAABsAIAEAAAAyACABAAAANgAgAQAAABsAIAEAAAAjACABAAAAIwAgAQAAABEAIAcFAACLCgAgGAAAjAoAIKIFAACKCgAwowUAAEUAEKQFAACKCgAw5AUBAPgIACGDBgEA-AgAIQIFAADqEQAgGAAA6xEAIAgFAACLCgAgGAAAjAoAIKIFAACKCgAwowUAAEUAEKQFAACKCgAw5AUBAPgIACGDBgEA-AgAIfgGAACJCgAgAwAAAEUAIAEAAEYAMAIAAEcAIAEAAAARACABAAAAFwAgAQAAABsAIAEAAABFACADCQAA5hEAIAoAAOgRACAXAADpEQAgDAkAAPMJACAKAACHCgAgFwAAiAoAIKIFAACGCgAwowUAACAAEKQFAACGCgAwpQUBAAAAAasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIesFAQD4CAAhjwYgAIIJACEDAAAAIAAgAQAATQAwAgAATgAgAwAAABsAIAEAABwAMAIAAB0AIBUDAACJCQAgCQAA8wkAIBsAANoJACCiBQAAhQoAMKMFAABRABCkBQAAhQoAMKUFAQD4CAAhqAUBAPgIACGrBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHhBSAAggkAIesFAQD9CAAhvQYCAIMJACG-BgEA_QgAIb8GIACCCQAhwAYCAIMJACHBBgIAgwkAIcIGAQD9CAAhwwZAAIEJACHEBgEA_QgAIQgDAAD5CwAgCQAA5hEAIBsAAPkLACDrBQAAsAoAIL4GAACwCgAgwgYAALAKACDDBgAAsAoAIMQGAACwCgAgFgMAAIkJACAJAADzCQAgGwAA2gkAIKIFAACFCgAwowUAAFEAEKQFAACFCgAwpQUBAAAAAagFAQD4CAAhqwUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4QUgAIIJACHrBQEA_QgAIb0GAgCDCQAhvgYBAP0IACG_BiAAggkAIcAGAgCDCQAhwQYCAIMJACHCBgEA_QgAIcMGQACBCQAhxAYBAP0IACH3BgAAhAoAIAMAAABRACABAABSADACAABTACAhDgAA_gkAIBUAAIMKACAcAAD9CQAgHwAAgAoAICAAAIIKACAjAACiCQAgKQAA-QkAICoAAPoJACArAAD7CQAgLAAA_AkAIDEAAN8JACAyAAD_CQAgMwAA_QkAIDQAAIEKACA5AACFCQAgogUAAPcJADCjBQAAVQAQpAUAAPcJADClBQEA-AgAIbAFAQD9CAAhuAUAAIQJACC5BUAA-QgAIdgFAAD4CfAGItkFQAD5CAAh5QUBAP0IACHYBgEA_QgAIdsGAQD9CAAh7AYBAPgIACHtBiAAggkAIe4GAADhCdQFIvAGQACBCQAh8QYBAP0IACHyBgEA_QgAIQEAAABVACAICQAA8wkAIB0AAPYJACCiBQAA9QkAMKMFAABXABCkBQAA9QkAMKsFAQD4CAAhuQVAAPkIACHjBQEA-AgAIQIJAADmEQAgHQAA5xEAIAkJAADzCQAgHQAA9gkAIKIFAAD1CQAwowUAAFcAEKQFAAD1CQAwqwUBAPgIACG5BUAA-QgAIeMFAQD4CAAh9gYAAPQJACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAEAAABXACANAwAA2gkAIAkAAPMJACCiBQAA8gkAMKMFAABdABCkBQAA8gkAMKUFAQD4CAAhqAUBAP0IACGpBQEA_QgAIasFAQD4CAAhsAUBAP0IACHOBQEA_QgAIc8FAQD9CAAh0AVAAPkIACEHAwAA-QsAIAkAAOYRACCoBQAAsAoAIKkFAACwCgAgsAUAALAKACDOBQAAsAoAIM8FAACwCgAgDQMAANoJACAJAADzCQAgogUAAPIJADCjBQAAXQAQpAUAAPIJADClBQEAAAABqAUBAP0IACGpBQEA_QgAIasFAQD4CAAhsAUBAP0IACHOBQEA_QgAIc8FAQD9CAAh0AVAAPkIACEDAAAAXQAgAQAAXgAwAgAAXwAgAQAAAFUAIBsDAADaCQAgCQAA8QkAIBEAAPAJACCiBQAA7gkAMKMFAABiABCkBQAA7gkAMKUFAQD4CAAhpgUBAPgIACGnBQEA_QgAIagFAQD9CAAhqQUBAP0IACGqBQEA_QgAIasFAQD9CAAhrAUIAO8JACGtBQEA_QgAIa4FAQD9CAAhrwUBAP0IACGwBQEA_QgAIbEFIACCCQAhsgUgAIIJACGzBUAAgQkAIbQFQACBCQAhtQUCAIMJACG2BUAAgQkAIbcFAQD9CAAhuAUAAIQJACC5BUAA-QgAIRIDAAD5CwAgCQAA5hEAIBEAAKQNACCnBQAAsAoAIKgFAACwCgAgqQUAALAKACCqBQAAsAoAIKsFAACwCgAgrAUAALAKACCtBQAAsAoAIK4FAACwCgAgrwUAALAKACCwBQAAsAoAILMFAACwCgAgtAUAALAKACC2BQAAsAoAILcFAACwCgAguAUAALAKACAbAwAA2gkAIAkAAPEJACARAADwCQAgogUAAO4JADCjBQAAYgAQpAUAAO4JADClBQEAAAABpgUBAPgIACGnBQEAAAABqAUBAP0IACGpBQEA_QgAIaoFAQD9CAAhqwUBAP0IACGsBQgA7wkAIa0FAQD9CAAhrgUBAP0IACGvBQEA_QgAIbAFAQD9CAAhsQUgAIIJACGyBSAAggkAIbMFQACBCQAhtAVAAIEJACG1BQIAgwkAIbYFQACBCQAhtwUBAP0IACG4BQAAhAkAILkFQAD5CAAhAwAAAGIAIAEAAGMAMAIAAGQAIAEAAABVACABAAAABwAgAQAAABcAIAMAAAANACABAAAOADACAAAPACABAAAAIAAgAQAAABsAIAEAAABRACABAAAAVwAgAQAAAF0AIAEAAABiACABAAAADQAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAAAHACABAAAIADACAAAJACABAAAADQAgAQAAAEUAIAEAAAAHACADAAAALQAgAQAALgAwAgAALwAgDxEAAK0JACCiBQAAqgkAMKMFAAB3ABCkBQAAqgkAMKUFAQD4CAAhqgUBAPgIACG5BUAA-QgAIdgFAACsCZQGItkFQAD5CAAhkgYAAKsJkgYilAYQAJ0JACGVBgEA_QgAIZYGAACECQAglwZAAIEJACGYBgEA_QgAIQEAAAB3ACAKEQAArQkAIKIFAADsCQAwowUAAHkAEKQFAADsCQAwpQUBAPgIACGqBQEA-AgAIbkFQAD5CAAh2AUAAO0JpAYigQYBAP0IACGkBgEA_QgAIQMRAACkDQAggQYAALAKACCkBgAAsAoAIAoRAACtCQAgogUAAOwJADCjBQAAeQAQpAUAAOwJADClBQEAAAABqgUBAPgIACG5BUAA-QgAIdgFAADtCaQGIoEGAQD9CAAhpAYBAP0IACEDAAAAeQAgAQAAegAwAgAAewAgEREAAK0JACAnAADrCQAgogUAAOkJADCjBQAAfQAQpAUAAOkJADClBQEA-AgAIaoFAQD4CAAhuAUAAIQJACC5BUAA-QgAIdgFAADqCaMGItkFQAD5CAAhnAYBAPgIACGdBgEA-AgAIZ4GAQD9CAAhnwYBAP0IACGgBkAAgQkAIaEGQACBCQAhBxEAAKQNACAnAADlEQAguAUAALAKACCeBgAAsAoAIJ8GAACwCgAgoAYAALAKACChBgAAsAoAIBERAACtCQAgJwAA6wkAIKIFAADpCQAwowUAAH0AEKQFAADpCQAwpQUBAAAAAaoFAQAAAAG4BQAAhAkAILkFQAD5CAAh2AUAAOoJowYi2QVAAPkIACGcBgEA-AgAIZ0GAQD4CAAhngYBAP0IACGfBgEA_QgAIaAGQACBCQAhoQZAAIEJACEDAAAAfQAgAQAAfgAwAgAAfwAgCyYAAOgJACCiBQAA5wkAMKMFAACBAQAQpAUAAOcJADClBQEA-AgAIbkFQAD5CAAh2AUBAPgIACHqBQEA_QgAIZkGAQD4CAAhmgYBAP0IACGbBkAA-QgAIQMmAADkEQAg6gUAALAKACCaBgAAsAoAIAsmAADoCQAgogUAAOcJADCjBQAAgQEAEKQFAADnCQAwpQUBAAAAAbkFQAD5CAAh2AUBAPgIACHqBQEA_QgAIZkGAQD4CAAhmgYBAP0IACGbBkAA-QgAIQMAAACBAQAgAQAAggEAMAIAAIMBACABAAAAgQEAIAMAAABiACABAABjADACAABkACABAAAALQAgAQAAAHkAIAEAAAB9ACABAAAAYgAgAQAAAAcAIAwDAACJCQAgogUAAOYJADCjBQAAjAEAEKQFAADmCQAwpQUBAPgIACGoBQEA-AgAIa8FAQD9CAAhsAUBAP0IACG5BUAA-QgAIdkFQAD5CAAh5wZAAPkIACHrBgEA-AgAIQMDAAD5CwAgrwUAALAKACCwBQAAsAoAIAwDAACJCQAgogUAAOYJADCjBQAAjAEAEKQFAADmCQAwpQUBAAAAAagFAQD4CAAhrwUBAP0IACGwBQEA_QgAIbkFQAD5CAAh2QVAAPkIACHnBkAA-QgAIesGAQAAAAEDAAAAjAEAIAEAAI0BADACAACOAQAgEAMAAIkJACCiBQAA5QkAMKMFAACQAQAQpAUAAOUJADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeMGAQD4CAAh5AYBAPgIACHlBgEA_QgAIeYGAQD9CAAh5wZAAIEJACHoBgEA_QgAIekGAQD9CAAh6gYBAP0IACEHAwAA-QsAIOUGAACwCgAg5gYAALAKACDnBgAAsAoAIOgGAACwCgAg6QYAALAKACDqBgAAsAoAIBEDAACJCQAgogUAAOUJADCjBQAAkAEAEKQFAADlCQAwpQUBAAAAAagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeMGAQD4CAAh5AYBAPgIACHlBgEA_QgAIeYGAQD9CAAh5wZAAIEJACHoBgEA_QgAIekGAQD9CAAh6gYBAP0IACH1BgAA5AkAIAMAAACQAQAgAQAAkQEAMAIAAJIBACAJAwAAiQkAIKIFAADLCQAwowUAAJQBABCkBQAAywkAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4gYBAPgIACEBAAAAlAEAIAMAAABRACABAABSADACAABTACADAAAABwAgAQAACAAwAgAACQAgCQMAAIkJACAMAAC-CQAgogUAAL0JADCjBQAAmAEAEKQFAAC9CQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACEBAAAAmAEAIA4vAADjCQAgMAAAiQkAIKIFAADgCQAwowUAAJoBABCkBQAA4AkAMKUFAQD4CAAhuQVAAPkIACHRBQEA-AgAIdIFAQD4CAAh1AUAAOEJ1AUi1QUBAPgIACHWBQAAhAkAINgFAADiCdgFItkFQAD5CAAhAy8AAOMRACAwAAD5CwAg1gUAALAKACAOLwAA4wkAIDAAAIkJACCiBQAA4AkAMKMFAACaAQAQpAUAAOAJADClBQEAAAABuQVAAPkIACHRBQEA-AgAIdIFAQD4CAAh1AUAAOEJ1AUi1QUBAPgIACHWBQAAhAkAINgFAADiCdgFItkFQAD5CAAhAwAAAJoBACABAACbAQAwAgAAnAEAIAMAAACaAQAgAQAAmwEAMAIAAJwBACABAAAAmgEAIAwtAACJCQAgLgAA3wkAIKIFAADdCQAwowUAAKABABCkBQAA3QkAMKUFAQD4CAAhuQVAAPkIACHYBQAA3gndBSLZBUAA-QgAIdoFAQD4CAAh2wUBAPgIACHdBQEA_QgAIQMtAAD5CwAgLgAA2REAIN0FAACwCgAgDC0AAIkJACAuAADfCQAgogUAAN0JADCjBQAAoAEAEKQFAADdCQAwpQUBAAAAAbkFQAD5CAAh2AUAAN4J3QUi2QVAAPkIACHaBQEA-AgAIdsFAQD4CAAh3QUBAP0IACEDAAAAoAEAIAEAAKEBADACAACiAQAgAwAAAFEAIAEAAFIAMAIAAFMAIAMAAABdACABAABeADACAABfACALAwAA2gkAIKIFAADcCQAwowUAAKYBABCkBQAA3AkAMKUFAQD4CAAhqAUBAP0IACGpBQEA_QgAIbkFQAD5CAAhywUBAPgIACHMBQIAnwkAIc0FAACECQAgBQMAAPkLACCoBQAAsAoAIKkFAACwCgAgzAUAALAKACDNBQAAsAoAIAsDAADaCQAgogUAANwJADCjBQAApgEAEKQFAADcCQAwpQUBAAAAAagFAQD9CAAhqQUBAP0IACG5BUAA-QgAIcsFAQD4CAAhzAUCAJ8JACHNBQAAhAkAIAMAAACmAQAgAQAApwEAMAIAAKgBACABAAAAVQAgEQMAANoJACAGAADbCQAgNQAA1AkAIDgAAIUJACCiBQAA2QkAMKMFAACrAQAQpAUAANkJADClBQEA-AgAIagFAQD9CAAhuQVAAPkIACHVBQEA-AgAIdkFQAD5CAAh3gUBAPgIACHfBQEA_QgAIeAFAQD9CAAh4QUgAIIJACHiBQEA_QgAIQgDAAD5CwAgBgAA4hEAIDUAAN8RACA4AADeCwAgqAUAALAKACDfBQAAsAoAIOAFAACwCgAg4gUAALAKACARAwAA2gkAIAYAANsJACA1AADUCQAgOAAAhQkAIKIFAADZCQAwowUAAKsBABCkBQAA2QkAMKUFAQAAAAGoBQEA_QgAIbkFQAD5CAAh1QUBAPgIACHZBUAA-QgAId4FAQD4CAAh3wUBAP0IACHgBQEA_QgAIeEFIACCCQAh4gUBAP0IACEDAAAAqwEAIAEAAKwBADACAACtAQAgBxgAANgJACA1AADUCQAgogUAANcJADCjBQAArwEAEKQFAADXCQAw3gUBAPgIACHkBQEA-AgAIQIYAADhEQAgNQAA3xEAIAgYAADYCQAgNQAA1AkAIKIFAADXCQAwowUAAK8BABCkBQAA1wkAMN4FAQD4CAAh5AUBAPgIACH0BgAA1gkAIAMAAACvAQAgAQAAsAEAMAIAALEBACADAAAArwEAIAEAALABADACAACxAQAgAQAAAK8BACAHHQAA1QkAIDUAANQJACCiBQAA0wkAMKMFAAC1AQAQpAUAANMJADDeBQEA-AgAIeMFAQD4CAAhAh0AAOARACA1AADfEQAgCB0AANUJACA1AADUCQAgogUAANMJADCjBQAAtQEAEKQFAADTCQAw3gUBAPgIACHjBQEA-AgAIfMGAADSCQAgAwAAALUBACABAAC2AQAwAgAAtwEAIAMAAAC1AQAgAQAAtgEAMAIAALcBACABAAAAtQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACABAAAArwEAIAEAAAC1AQAgAQAAAKsBACABAAAAVQAgAQAAAKsBACADAAAAqwEAIAEAAKwBADACAACtAQAgAQAAAKsBACADAAAAYgAgAQAAYwAwAgAAZAAgDAMAAIkJACAMAACKCQAgogUAAIgJADCjBQAAxAEAEKQFAACICQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHlBQEA-AgAIfgFIACCCQAh-QUBAP0IACEBAAAAxAEAIAEAAAADACABAAAAjAEAIAEAAACQAQAgAQAAAFEAIAEAAAAHACABAAAAmgEAIAEAAACgAQAgAQAAAFEAIAEAAABdACABAAAApgEAIAEAAACrAQAgAQAAAGIAIAEAAAABACAXDgAA2BEAIBUAAN4RACAcAADXEQAgHwAA2xEAICAAAN0RACAjAACcDQAgKQAA0xEAICoAANQRACArAADVEQAgLAAA1hEAIDEAANkRACAyAADaEQAgMwAA1xEAIDQAANwRACA5AADeCwAgsAUAALAKACC4BQAAsAoAIOUFAACwCgAg2AYAALAKACDbBgAAsAoAIPAGAACwCgAg8QYAALAKACDyBgAAsAoAIAMAAABVACABAADTAQAwAgAAAQAgAwAAAFUAIAEAANMBADACAAABACADAAAAVQAgAQAA0wEAMAIAAAEAIB4OAADKEQAgFQAA0hEAIBwAAMgRACAfAADOEQAgIAAA0REAICMAAMkRACApAADEEQAgKgAAxREAICsAAMYRACAsAADHEQAgMQAAyxEAIDIAAMwRACAzAADNEQAgNAAAzxEAIDkAANARACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADwBgLZBUAAAAAB5QUBAAAAAdgGAQAAAAHbBgEAAAAB7AYBAAAAAe0GIAAAAAHuBgAAANQFAvAGQAAAAAHxBgEAAAAB8gYBAAAAAQE_AADXAQAgD6UFAQAAAAGwBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAPAGAtkFQAAAAAHlBQEAAAAB2AYBAAAAAdsGAQAAAAHsBgEAAAAB7QYgAAAAAe4GAAAA1AUC8AZAAAAAAfEGAQAAAAHyBgEAAAABAT8AANkBADABPwAA2QEAMB4OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACClBQEAtgoAIbAFAQC3CgAhuAWAAAAAAbkFQAC8CgAh2AUAAKoQ8AYi2QVAALwKACHlBQEAtwoAIdgGAQC3CgAh2wYBALcKACHsBgEAtgoAIe0GIAC5CgAh7gYAANUK1AUi8AZAALoKACHxBgEAtwoAIfIGAQC3CgAhAgAAAAEAID8AANwBACAPpQUBALYKACGwBQEAtwoAIbgFgAAAAAG5BUAAvAoAIdgFAACqEPAGItkFQAC8CgAh5QUBALcKACHYBgEAtwoAIdsGAQC3CgAh7AYBALYKACHtBiAAuQoAIe4GAADVCtQFIvAGQAC6CgAh8QYBALcKACHyBgEAtwoAIQIAAABVACA_AADeAQAgAgAAAFUAID8AAN4BACADAAAAAQAgRgAA1wEAIEcAANwBACABAAAAAQAgAQAAAFUAIAsNAACnEAAgTAAAqRAAIE0AAKgQACCwBQAAsAoAILgFAACwCgAg5QUAALAKACDYBgAAsAoAINsGAACwCgAg8AYAALAKACDxBgAAsAoAIPIGAACwCgAgEqIFAADOCQAwowUAAOUBABCkBQAAzgkAMKUFAQDLCAAhsAUBAMwIACG4BQAA0QgAILkFQADSCAAh2AUAAM8J8AYi2QVAANIIACHlBQEAzAgAIdgGAQDMCAAh2wYBAMwIACHsBgEAywgAIe0GIADOCAAh7gYAAOkI1AUi8AZAAM8IACHxBgEAzAgAIfIGAQDMCAAhAwAAAFUAIAEAAOQBADBLAADlAQAgAwAAAFUAIAEAANMBADACAAABACABAAAAjgEAIAEAAACOAQAgAwAAAIwBACABAACNAQAwAgAAjgEAIAMAAACMAQAgAQAAjQEAMAIAAI4BACADAAAAjAEAIAEAAI0BADACAACOAQAgCQMAAKYQACClBQEAAAABqAUBAAAAAa8FAQAAAAGwBQEAAAABuQVAAAAAAdkFQAAAAAHnBkAAAAAB6wYBAAAAAQE_AADtAQAgCKUFAQAAAAGoBQEAAAABrwUBAAAAAbAFAQAAAAG5BUAAAAAB2QVAAAAAAecGQAAAAAHrBgEAAAABAT8AAO8BADABPwAA7wEAMAkDAAClEAAgpQUBALYKACGoBQEAtgoAIa8FAQC3CgAhsAUBALcKACG5BUAAvAoAIdkFQAC8CgAh5wZAALwKACHrBgEAtgoAIQIAAACOAQAgPwAA8gEAIAilBQEAtgoAIagFAQC2CgAhrwUBALcKACGwBQEAtwoAIbkFQAC8CgAh2QVAALwKACHnBkAAvAoAIesGAQC2CgAhAgAAAIwBACA_AAD0AQAgAgAAAIwBACA_AAD0AQAgAwAAAI4BACBGAADtAQAgRwAA8gEAIAEAAACOAQAgAQAAAIwBACAFDQAAohAAIEwAAKQQACBNAACjEAAgrwUAALAKACCwBQAAsAoAIAuiBQAAzQkAMKMFAAD7AQAQpAUAAM0JADClBQEAywgAIagFAQDLCAAhrwUBAMwIACGwBQEAzAgAIbkFQADSCAAh2QVAANIIACHnBkAA0ggAIesGAQDLCAAhAwAAAIwBACABAAD6AQAwSwAA-wEAIAMAAACMAQAgAQAAjQEAMAIAAI4BACABAAAAkgEAIAEAAACSAQAgAwAAAJABACABAACRAQAwAgAAkgEAIAMAAACQAQAgAQAAkQEAMAIAAJIBACADAAAAkAEAIAEAAJEBADACAACSAQAgDQMAAKEQACClBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGQAAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAEBPwAAgwIAIAylBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGQAAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAEBPwAAhQIAMAE_AACFAgAwDQMAAKAQACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHZBUAAvAoAIeMGAQC2CgAh5AYBALYKACHlBgEAtwoAIeYGAQC3CgAh5wZAALoKACHoBgEAtwoAIekGAQC3CgAh6gYBALcKACECAAAAkgEAID8AAIgCACAMpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHjBgEAtgoAIeQGAQC2CgAh5QYBALcKACHmBgEAtwoAIecGQAC6CgAh6AYBALcKACHpBgEAtwoAIeoGAQC3CgAhAgAAAJABACA_AACKAgAgAgAAAJABACA_AACKAgAgAwAAAJIBACBGAACDAgAgRwAAiAIAIAEAAACSAQAgAQAAAJABACAJDQAAnRAAIEwAAJ8QACBNAACeEAAg5QYAALAKACDmBgAAsAoAIOcGAACwCgAg6AYAALAKACDpBgAAsAoAIOoGAACwCgAgD6IFAADMCQAwowUAAJECABCkBQAAzAkAMKUFAQDLCAAhqAUBAMsIACG5BUAA0ggAIdkFQADSCAAh4wYBAMsIACHkBgEAywgAIeUGAQDMCAAh5gYBAMwIACHnBkAAzwgAIegGAQDMCAAh6QYBAMwIACHqBgEAzAgAIQMAAACQAQAgAQAAkAIAMEsAAJECACADAAAAkAEAIAEAAJEBADACAACSAQAgCQMAAIkJACCiBQAAywkAMKMFAACUAQAQpAUAAMsJADClBQEAAAABqAUBAAAAAbkFQAD5CAAh2QVAAPkIACHiBgEA-AgAIQEAAACUAgAgAQAAAJQCACABAwAA-QsAIAMAAACUAQAgAQAAlwIAMAIAAJQCACADAAAAlAEAIAEAAJcCADACAACUAgAgAwAAAJQBACABAACXAgAwAgAAlAIAIAYDAACcEAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeIGAQAAAAEBPwAAmwIAIAWlBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB4gYBAAAAAQE_AACdAgAwAT8AAJ0CADAGAwAAmxAAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdkFQAC8CgAh4gYBALYKACECAAAAlAIAID8AAKACACAFpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHiBgEAtgoAIQIAAACUAQAgPwAAogIAIAIAAACUAQAgPwAAogIAIAMAAACUAgAgRgAAmwIAIEcAAKACACABAAAAlAIAIAEAAACUAQAgAw0AAJgQACBMAACaEAAgTQAAmRAAIAiiBQAAygkAMKMFAACpAgAQpAUAAMoJADClBQEAywgAIagFAQDLCAAhuQVAANIIACHZBUAA0ggAIeIGAQDLCAAhAwAAAJQBACABAACoAgAwSwAAqQIAIAMAAACUAQAgAQAAlwIAMAIAAJQCACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIA8DAACWEAAgIwAAlxAAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAHZBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAAB3QYBAAAAAd4GAQAAAAHfBgEAAAAB4AYBAAAAAeEGIAAAAAEBPwAAsQIAIA2lBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB2QYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAeAGAQAAAAHhBiAAAAABAT8AALMCADABPwAAswIAMA8DAACLEAAgIwAAjBAAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdkFQAC8CgAh2QYBALcKACHaBgEAtwoAIdsGAQC3CgAh3AYBALYKACHdBgEAtgoAId4GAQC3CgAh3wYBALcKACHgBgEAtgoAIeEGIAC5CgAhAgAAAAUAID8AALYCACANpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHZBgEAtwoAIdoGAQC3CgAh2wYBALcKACHcBgEAtgoAId0GAQC2CgAh3gYBALcKACHfBgEAtwoAIeAGAQC2CgAh4QYgALkKACECAAAAAwAgPwAAuAIAIAIAAAADACA_AAC4AgAgAwAAAAUAIEYAALECACBHAAC2AgAgAQAAAAUAIAEAAAADACAIDQAAiBAAIEwAAIoQACBNAACJEAAg2QYAALAKACDaBgAAsAoAINsGAACwCgAg3gYAALAKACDfBgAAsAoAIBCiBQAAyQkAMKMFAAC_AgAQpAUAAMkJADClBQEAywgAIagFAQDLCAAhuQVAANIIACHZBUAA0ggAIdkGAQDMCAAh2gYBAMwIACHbBgEAzAgAIdwGAQDLCAAh3QYBAMsIACHeBgEAzAgAId8GAQDMCAAh4AYBAMsIACHhBiAAzggAIQMAAAADACABAAC-AgAwSwAAvwIAIAMAAAADACABAAAEADACAAAFACABAAAAFQAgAQAAABUAIAMAAAARACABAAAUADACAAAVACADAAAAEQAgAQAAFAAwAgAAFQAgAwAAABEAIAEAABQAMAIAABUAIBIGAACHEAAgBwAAgxAAIAgAAIQQACAKAACFEAAgGQAAhhAAIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeIFAQAAAAHlBQEAAAAB5gUBAAAAAeoFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAAByAYCAAAAAdgGAQAAAAEBPwAAxwIAIA2lBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcgGAgAAAAHYBgEAAAABAT8AAMkCADABPwAAyQIAMAEAAAARACASBgAA1A8AIAcAANUPACAIAADWDwAgCgAA1w8AIBkAANgPACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHiBQEAtwoAIeUFAQC2CgAh5gUBALYKACHqBQEAtwoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhyAYCALsKACHYBgEAtwoAIQIAAAAVACA_AADNAgAgDaUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeIFAQC3CgAh5QUBALYKACHmBQEAtgoAIeoFAQC3CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHIBgIAuwoAIdgGAQC3CgAhAgAAABEAID8AAM8CACACAAAAEQAgPwAAzwIAIAEAAAARACADAAAAFQAgRgAAxwIAIEcAAM0CACABAAAAFQAgAQAAABEAIAsNAADPDwAgTAAA0g8AIE0AANEPACCeAQAA0A8AIJ8BAADTDwAg4gUAALAKACDqBQAAsAoAIPIFAACwCgAg8wUAALAKACD0BQAAsAoAINgGAACwCgAgEKIFAADICQAwowUAANcCABCkBQAAyAkAMKUFAQDLCAAhuQVAANIIACHZBUAA0ggAIeIFAQDMCAAh5QUBAMsIACHmBQEAywgAIeoFAQDMCAAh8gUBAMwIACHzBQEAzAgAIfQFAQDMCAAhjwYgAM4IACHIBgIA0AgAIdgGAQDMCAAhAwAAABEAIAEAANYCADBLAADXAgAgAwAAABEAIAEAABQAMAIAABUAIAkIAADHCQAgogUAAMYJADCjBQAA3QIAEKQFAADGCQAwpQUBAAAAAbkFQAD5CAAh2QVAAPkIACHlBQEAAAAB5gUBAAAAAQEAAADaAgAgAQAAANoCACAJCAAAxwkAIKIFAADGCQAwowUAAN0CABCkBQAAxgkAMKUFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeUFAQD4CAAh5gUBAPgIACEBCAAAzg8AIAMAAADdAgAgAQAA3gIAMAIAANoCACADAAAA3QIAIAEAAN4CADACAADaAgAgAwAAAN0CACABAADeAgAwAgAA2gIAIAYIAADNDwAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAEBPwAA4gIAIAWlBQEAAAABuQVAAAAAAdkFQAAAAAHlBQEAAAAB5gUBAAAAAQE_AADkAgAwAT8AAOQCADAGCAAAww8AIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh5gUBALYKACECAAAA2gIAID8AAOcCACAFpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5QUBALYKACHmBQEAtgoAIQIAAADdAgAgPwAA6QIAIAIAAADdAgAgPwAA6QIAIAMAAADaAgAgRgAA4gIAIEcAAOcCACABAAAA2gIAIAEAAADdAgAgAw0AAMAPACBMAADCDwAgTQAAwQ8AIAiiBQAAxQkAMKMFAADwAgAQpAUAAMUJADClBQEAywgAIbkFQADSCAAh2QVAANIIACHlBQEAywgAIeYFAQDLCAAhAwAAAN0CACABAADvAgAwSwAA8AIAIAMAAADdAgAgAQAA3gIAMAIAANoCACABAAAAWQAgAQAAAFkAIAMAAABXACABAABYADACAABZACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAUJAAC_DwAgHQAAkQ8AIKsFAQAAAAG5BUAAAAAB4wUBAAAAAQE_AAD4AgAgA6sFAQAAAAG5BUAAAAAB4wUBAAAAAQE_AAD6AgAwAT8AAPoCADAFCQAAvg8AIB0AAI8PACCrBQEAtgoAIbkFQAC8CgAh4wUBALYKACECAAAAWQAgPwAA_QIAIAOrBQEAtgoAIbkFQAC8CgAh4wUBALYKACECAAAAVwAgPwAA_wIAIAIAAABXACA_AAD_AgAgAwAAAFkAIEYAAPgCACBHAAD9AgAgAQAAAFkAIAEAAABXACADDQAAuw8AIEwAAL0PACBNAAC8DwAgBqIFAADECQAwowUAAIYDABCkBQAAxAkAMKsFAQDLCAAhuQVAANIIACHjBQEAywgAIQMAAABXACABAACFAwAwSwAAhgMAIAMAAABXACABAABYADACAABZACABAAAAGQAgAQAAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAICAKAAC1DwAgGAAAsw8AIBoAALQPACAcAAC2DwAgHgAAtw8AIB8AALgPACAgAAC5DwAgIQAAug8AIKUFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAdIGAQAAAAHTBgEAAAAB1AYCAAAAAdUGIAAAAAHWBiAAAAAB1wYgAAAAAQE_AACOAwAgGKUFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAdIGAQAAAAHTBgEAAAAB1AYCAAAAAdUGIAAAAAHWBiAAAAAB1wYgAAAAAQE_AACQAwAwAT8AAJADADABAAAAEQAgIAoAAOAOACAYAADeDgAgGgAA3w4AIBwAAOEOACAeAADiDgAgHwAA4w4AICAAAOQOACAhAADlDgAgpQUBALYKACG4BYAAAAABuQVAALwKACHZBUAAvAoAIeQFAQC3CgAh5gUBALYKACHqBQEAtwoAIesFAQC2CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHMBgEAtwoAIc0GAQC3CgAhzgYQAJgMACHPBhAAmAwAIdAGEACYDAAh0QYCAMgKACHSBgEAtwoAIdMGAQC3CgAh1AYCALsKACHVBiAAuQoAIdYGIAC5CgAh1wYgALkKACECAAAAGQAgPwAAlAMAIBilBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACHmBQEAtgoAIeoFAQC3CgAh6wUBALYKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcwGAQC3CgAhzQYBALcKACHOBhAAmAwAIc8GEACYDAAh0AYQAJgMACHRBgIAyAoAIdIGAQC3CgAh0wYBALcKACHUBgIAuwoAIdUGIAC5CgAh1gYgALkKACHXBiAAuQoAIQIAAAAXACA_AACWAwAgAgAAABcAID8AAJYDACABAAAAEQAgAwAAABkAIEYAAI4DACBHAACUAwAgAQAAABkAIAEAAAAXACATDQAA2Q4AIEwAANwOACBNAADbDgAgngEAANoOACCfAQAA3Q4AILgFAACwCgAg5AUAALAKACDqBQAAsAoAIPIFAACwCgAg8wUAALAKACD0BQAAsAoAIMwGAACwCgAgzQYAALAKACDOBgAAsAoAIM8GAACwCgAg0AYAALAKACDRBgAAsAoAINIGAACwCgAg0wYAALAKACAbogUAAMMJADCjBQAAngMAEKQFAADDCQAwpQUBAMsIACG4BQAA0QgAILkFQADSCAAh2QVAANIIACHkBQEAzAgAIeYFAQDLCAAh6gUBAMwIACHrBQEAywgAIfIFAQDMCAAh8wUBAMwIACH0BQEAzAgAIY8GIADOCAAhzAYBAMwIACHNBgEAzAgAIc4GEACUCQAhzwYQAJQJACHQBhAAlAkAIdEGAgDlCAAh0gYBAMwIACHTBgEAzAgAIdQGAgDQCAAh1QYgAM4IACHWBiAAzggAIdcGIADOCAAhAwAAABcAIAEAAJ0DADBLAACeAwAgAwAAABcAIAEAABgAMAIAABkAIAEAAABOACABAAAATgAgAwAAACAAIAEAAE0AMAIAAE4AIAMAAAAgACABAABNADACAABOACADAAAAIAAgAQAATQAwAgAATgAgCQkAANYOACAKAADXDgAgFwAA2A4AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHrBQEAAAABjwYgAAAAAQE_AACmAwAgBqUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHrBQEAAAABjwYgAAAAAQE_AACoAwAwAT8AAKgDADAJCQAAvg4AIAoAAL8OACAXAADADgAgpQUBALYKACGrBQEAtgoAIbkFQAC8CgAh2QVAALwKACHrBQEAtgoAIY8GIAC5CgAhAgAAAE4AID8AAKsDACAGpQUBALYKACGrBQEAtgoAIbkFQAC8CgAh2QVAALwKACHrBQEAtgoAIY8GIAC5CgAhAgAAACAAID8AAK0DACACAAAAIAAgPwAArQMAIAMAAABOACBGAACmAwAgRwAAqwMAIAEAAABOACABAAAAIAAgAw0AALsOACBMAAC9DgAgTQAAvA4AIAmiBQAAwgkAMKMFAAC0AwAQpAUAAMIJADClBQEAywgAIasFAQDLCAAhuQVAANIIACHZBUAA0ggAIesFAQDLCAAhjwYgAM4IACEDAAAAIAAgAQAAswMAMEsAALQDACADAAAAIAAgAQAATQAwAgAATgAgAQAAACUAIAEAAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACARCgAAuA4AIAsAALUOACAQAAC2DgAgEgAAtw4AIBQAALkOACAWAAC6DgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcsGAQAAAAHMBgEAAAABzQYBAAAAAc4GEAAAAAHPBhAAAAAB0AYQAAAAAdEGAgAAAAEBPwAAvAMAIAulBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABywYBAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQE_AAC-AwAwAT8AAL4DADARCgAA_w0AIAsAAPwNACAQAAD9DQAgEgAA_g0AIBQAAIAOACAWAACBDgAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAhjwYgALkKACHLBgEAtgoAIcwGAQC2CgAhzQYBALcKACHOBhAAlwwAIc8GEACYDAAh0AYQAJgMACHRBgIAuwoAIQIAAAAlACA_AADBAwAgC6UFAQC2CgAhuQVAALwKACHZBUAAvAoAIY8GIAC5CgAhywYBALYKACHMBgEAtgoAIc0GAQC3CgAhzgYQAJcMACHPBhAAmAwAIdAGEACYDAAh0QYCALsKACECAAAAIwAgPwAAwwMAIAIAAAAjACA_AADDAwAgAwAAACUAIEYAALwDACBHAADBAwAgAQAAACUAIAEAAAAjACAIDQAA9w0AIEwAAPoNACBNAAD5DQAgngEAAPgNACCfAQAA-w0AIM0GAACwCgAgzwYAALAKACDQBgAAsAoAIA6iBQAAwQkAMKMFAADKAwAQpAUAAMEJADClBQEAywgAIbkFQADSCAAh2QVAANIIACGPBiAAzggAIcsGAQDLCAAhzAYBAMsIACHNBgEAzAgAIc4GEACTCQAhzwYQAJQJACHQBhAAlAkAIdEGAgDQCAAhAwAAACMAIAEAAMkDADBLAADKAwAgAwAAACMAIAEAACQAMAIAACUAIAEAAAAdACABAAAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgEAkAAPMNACALAAD0DQAgDwAA9Q0AIBgAAPYNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAcoGAQAAAAEBPwAA0gMAIAylBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAcoGAQAAAAEBPwAA1AMAMAE_AADUAwAwAQAAABcAIAEAAAAgACABAAAAIwAgAQAAABEAIBAJAADvDQAgCwAA8A0AIA8AAPENACAYAADyDQAgpQUBALYKACGrBQEAtwoAIbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIfcFAQC3CgAhxQYBALYKACHGBgEAtwoAIccGAQC3CgAhyAYCALsKACHJBiAAuQoAIcoGAQC3CgAhAgAAAB0AID8AANsDACAMpQUBALYKACGrBQEAtwoAIbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIfcFAQC3CgAhxQYBALYKACHGBgEAtwoAIccGAQC3CgAhyAYCALsKACHJBiAAuQoAIcoGAQC3CgAhAgAAABsAID8AAN0DACACAAAAGwAgPwAA3QMAIAEAAAAXACABAAAAIAAgAQAAACMAIAEAAAARACADAAAAHQAgRgAA0gMAIEcAANsDACABAAAAHQAgAQAAABsAIAsNAADqDQAgTAAA7Q0AIE0AAOwNACCeAQAA6w0AIJ8BAADuDQAgqwUAALAKACDkBQAAsAoAIPcFAACwCgAgxgYAALAKACDHBgAAsAoAIMoGAACwCgAgD6IFAADACQAwowUAAOgDABCkBQAAwAkAMKUFAQDLCAAhqwUBAMwIACG5BUAA0ggAIdkFQADSCAAh5AUBAMwIACH3BQEAzAgAIcUGAQDLCAAhxgYBAMwIACHHBgEAzAgAIcgGAgDQCAAhyQYgAM4IACHKBgEAzAgAIQMAAAAbACABAADnAwAwSwAA6AMAIAMAAAAbACABAAAcADACAAAdACABAAAAUwAgAQAAAFMAIAMAAABRACABAABSADACAABTACADAAAAUQAgAQAAUgAwAgAAUwAgAwAAAFEAIAEAAFIAMAIAAFMAIBIDAADnDQAgCQAA6A0AIBsAAOkNACClBQEAAAABqAUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvQYCAAAAAb4GAQAAAAG_BiAAAAABwAYCAAAAAcEGAgAAAAHCBgEAAAABwwZAAAAAAcQGAQAAAAEBPwAA8AMAIA-lBQEAAAABqAUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvQYCAAAAAb4GAQAAAAG_BiAAAAABwAYCAAAAAcEGAgAAAAHCBgEAAAABwwZAAAAAAcQGAQAAAAEBPwAA8gMAMAE_AADyAwAwAQAAAFUAIBIDAADkDQAgCQAA5Q0AIBsAAOYNACClBQEAtgoAIagFAQC2CgAhqwUBALYKACG5BUAAvAoAIdkFQAC8CgAh4QUgALkKACHrBQEAtwoAIb0GAgC7CgAhvgYBALcKACG_BiAAuQoAIcAGAgC7CgAhwQYCALsKACHCBgEAtwoAIcMGQAC6CgAhxAYBALcKACECAAAAUwAgPwAA9gMAIA-lBQEAtgoAIagFAQC2CgAhqwUBALYKACG5BUAAvAoAIdkFQAC8CgAh4QUgALkKACHrBQEAtwoAIb0GAgC7CgAhvgYBALcKACG_BiAAuQoAIcAGAgC7CgAhwQYCALsKACHCBgEAtwoAIcMGQAC6CgAhxAYBALcKACECAAAAUQAgPwAA-AMAIAIAAABRACA_AAD4AwAgAQAAAFUAIAMAAABTACBGAADwAwAgRwAA9gMAIAEAAABTACABAAAAUQAgCg0AAN8NACBMAADiDQAgTQAA4Q0AIJ4BAADgDQAgnwEAAOMNACDrBQAAsAoAIL4GAACwCgAgwgYAALAKACDDBgAAsAoAIMQGAACwCgAgEqIFAAC_CQAwowUAAIAEABCkBQAAvwkAMKUFAQDLCAAhqAUBAMsIACGrBQEAywgAIbkFQADSCAAh2QVAANIIACHhBSAAzggAIesFAQDMCAAhvQYCANAIACG-BgEAzAgAIb8GIADOCAAhwAYCANAIACHBBgIA0AgAIcIGAQDMCAAhwwZAAM8IACHEBgEAzAgAIQMAAABRACABAAD_AwAwSwAAgAQAIAMAAABRACABAABSADACAABTACAJAwAAiQkAIAwAAL4JACCiBQAAvQkAMKMFAACYAQAQpAUAAL0JADClBQEAAAABqAUBAAAAAbkFQAD5CAAh2QVAAPkIACEBAAAAgwQAIAEAAACDBAAgAgMAAPkLACAMAADeDQAgAwAAAJgBACABAACGBAAwAgAAgwQAIAMAAACYAQAgAQAAhgQAMAIAAIMEACADAAAAmAEAIAEAAIYEADACAACDBAAgBgMAANwNACAMAADdDQAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAQE_AACKBAAgBKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAEBPwAAjAQAMAE_AACMBAAwBgMAAM4NACAMAADPDQAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACECAAAAgwQAID8AAI8EACAEpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACECAAAAmAEAID8AAJEEACACAAAAmAEAID8AAJEEACADAAAAgwQAIEYAAIoEACBHAACPBAAgAQAAAIMEACABAAAAmAEAIAMNAADLDQAgTAAAzQ0AIE0AAMwNACAHogUAALwJADCjBQAAmAQAEKQFAAC8CQAwpQUBAMsIACGoBQEAywgAIbkFQADSCAAh2QVAANIIACEDAAAAmAEAIAEAAJcEADBLAACYBAAgAwAAAJgBACABAACGBAAwAgAAgwQAIAEAAAApACABAAAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgCA4AAMkNACAPAADKDQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB9wUBAAAAAfwFAgAAAAG8BgEAAAABAT8AAKAEACAGpQUBAAAAAbkFQAAAAAHZBUAAAAAB9wUBAAAAAfwFAgAAAAG8BgEAAAABAT8AAKIEADABPwAAogQAMAgOAADHDQAgDwAAyA0AIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIfcFAQC2CgAh_AUCALsKACG8BgEAtgoAIQIAAAApACA_AAClBAAgBqUFAQC2CgAhuQVAALwKACHZBUAAvAoAIfcFAQC2CgAh_AUCALsKACG8BgEAtgoAIQIAAAAnACA_AACnBAAgAgAAACcAID8AAKcEACADAAAAKQAgRgAAoAQAIEcAAKUEACABAAAAKQAgAQAAACcAIAUNAADCDQAgTAAAxQ0AIE0AAMQNACCeAQAAww0AIJ8BAADGDQAgCaIFAAC7CQAwowUAAK4EABCkBQAAuwkAMKUFAQDLCAAhuQVAANIIACHZBUAA0ggAIfcFAQDLCAAh_AUCANAIACG8BgEAywgAIQMAAAAnACABAACtBAAwSwAArgQAIAMAAAAnACABAAAoADACAAApACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIB8DAAD4DAAgBAAA-QwAIAUAAMENACAMAAD6DAAgIAAA_gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQE_AAC2BAAgF6UFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQE_AAC4BAAwAT8AALgEADABAAAACwAgHwMAAKgMACAEAACpDAAgBQAAwA0AIAwAAKoMACAgAACuDAAgJAAAqwwAICUAAKwMACAoAACtDAAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2AUAAKYMpAYi2QVAALwKACGDBgEAtwoAIasGEACXDAAhrAYBALYKACGtBgEAtgoAIa4GgAAAAAGvBgEAtwoAIbAGAQC3CgAhsQYQAJcMACGyBhAAlwwAIbMGEACXDAAhtAYQAJcMACG1BgEAtwoAIbYGQAC8CgAhtwZAALoKACG4BkAAugoAIbkGQAC6CgAhugZAALoKACG7BkAAugoAIQIAAAAJACA_AAC8BAAgF6UFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACECAAAABwAgPwAAvgQAIAIAAAAHACA_AAC-BAAgAQAAAAsAIAMAAAAJACBGAAC2BAAgRwAAvAQAIAEAAAAJACABAAAABwAgDw0AALsNACBMAAC-DQAgTQAAvQ0AIJ4BAAC8DQAgnwEAAL8NACCDBgAAsAoAIK4GAACwCgAgrwYAALAKACCwBgAAsAoAILUGAACwCgAgtwYAALAKACC4BgAAsAoAILkGAACwCgAgugYAALAKACC7BgAAsAoAIBqiBQAAugkAMKMFAADGBAAQpAUAALoJADClBQEAywgAIagFAQDLCAAhuQVAANIIACHYBQAAtAmkBiLZBUAA0ggAIYMGAQDMCAAhqwYQAJMJACGsBgEAywgAIa0GAQDLCAAhrgYAANEIACCvBgEAzAgAIbAGAQDMCAAhsQYQAJMJACGyBhAAkwkAIbMGEACTCQAhtAYQAJMJACG1BgEAzAgAIbYGQADSCAAhtwZAAM8IACG4BkAAzwgAIbkGQADPCAAhugZAAM8IACG7BkAAzwgAIQMAAAAHACABAADFBAAwSwAAxgQAIAMAAAAHACABAAAIADACAAAJACABAAAALwAgAQAAAC8AIAMAAAAtACABAAAuADACAAAvACADAAAALQAgAQAALgAwAgAALwAgAwAAAC0AIAEAAC4AMAIAAC8AIA8PAAD2DAAgEQAAug0AIKUFAQAAAAGqBQEAAAABqwUBAAAAAbkFQAAAAAH3BQEAAAAB_AUCAAAAAaUGAQAAAAGmBgEAAAABpwYBAAAAAagGgAAAAAGpBhAAAAABqgYQAAAAAasGEAAAAAEBPwAAzgQAIA2lBQEAAAABqgUBAAAAAasFAQAAAAG5BUAAAAAB9wUBAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABAT8AANAEADABPwAA0AQAMA8PAAD0DAAgEQAAuQ0AIKUFAQC2CgAhqgUBALYKACGrBQEAtgoAIbkFQAC8CgAh9wUBALYKACH8BQIAuwoAIaUGAQC2CgAhpgYBALYKACGnBgEAtwoAIagGgAAAAAGpBhAAlwwAIaoGEACXDAAhqwYQAJcMACECAAAALwAgPwAA0wQAIA2lBQEAtgoAIaoFAQC2CgAhqwUBALYKACG5BUAAvAoAIfcFAQC2CgAh_AUCALsKACGlBgEAtgoAIaYGAQC2CgAhpwYBALcKACGoBoAAAAABqQYQAJcMACGqBhAAlwwAIasGEACXDAAhAgAAAC0AID8AANUEACACAAAALQAgPwAA1QQAIAMAAAAvACBGAADOBAAgRwAA0wQAIAEAAAAvACABAAAALQAgBg0AALQNACBMAAC3DQAgTQAAtg0AIJ4BAAC1DQAgnwEAALgNACCnBgAAsAoAIBCiBQAAtwkAMKMFAADcBAAQpAUAALcJADClBQEAywgAIaoFAQDLCAAhqwUBAMsIACG5BUAA0ggAIfcFAQDLCAAh_AUCANAIACGlBgEAywgAIaYGAQDLCAAhpwYBAMwIACGoBgAAuAkAIKkGEACTCQAhqgYQAJMJACGrBhAAkwkAIQMAAAAtACABAADbBAAwSwAA3AQAIAMAAAAtACABAAAuADACAAAvACABAAAAewAgAQAAAHsAIAMAAAB5ACABAAB6ADACAAB7ACADAAAAeQAgAQAAegAwAgAAewAgAwAAAHkAIAEAAHoAMAIAAHsAIAcRAACzDQAgpQUBAAAAAaoFAQAAAAG5BUAAAAAB2AUAAACkBgKBBgEAAAABpAYBAAAAAQE_AADkBAAgBqUFAQAAAAGqBQEAAAABuQVAAAAAAdgFAAAApAYCgQYBAAAAAaQGAQAAAAEBPwAA5gQAMAE_AADmBAAwBxEAALINACClBQEAtgoAIaoFAQC2CgAhuQVAALwKACHYBQAApgykBiKBBgEAtwoAIaQGAQC3CgAhAgAAAHsAID8AAOkEACAGpQUBALYKACGqBQEAtgoAIbkFQAC8CgAh2AUAAKYMpAYigQYBALcKACGkBgEAtwoAIQIAAAB5ACA_AADrBAAgAgAAAHkAID8AAOsEACADAAAAewAgRgAA5AQAIEcAAOkEACABAAAAewAgAQAAAHkAIAUNAACvDQAgTAAAsQ0AIE0AALANACCBBgAAsAoAIKQGAACwCgAgCaIFAACzCQAwowUAAPIEABCkBQAAswkAMKUFAQDLCAAhqgUBAMsIACG5BUAA0ggAIdgFAAC0CaQGIoEGAQDMCAAhpAYBAMwIACEDAAAAeQAgAQAA8QQAMEsAAPIEACADAAAAeQAgAQAAegAwAgAAewAgAQAAAH8AIAEAAAB_ACADAAAAfQAgAQAAfgAwAgAAfwAgAwAAAH0AIAEAAH4AMAIAAH8AIAMAAAB9ACABAAB-ADACAAB_ACAOEQAArg0AICcAANUMACClBQEAAAABqgUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAACjBgLZBUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGQAAAAAGhBkAAAAABAT8AAPoEACAMpQUBAAAAAaoFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAAowYC2QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAZ8GAQAAAAGgBkAAAAABoQZAAAAAAQE_AAD8BAAwAT8AAPwEADAOEQAArQ0AICcAAMcMACClBQEAtgoAIaoFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2AUAAMUMowYi2QVAALwKACGcBgEAtgoAIZ0GAQC2CgAhngYBALcKACGfBgEAtwoAIaAGQAC6CgAhoQZAALoKACECAAAAfwAgPwAA_wQAIAylBQEAtgoAIaoFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2AUAAMUMowYi2QVAALwKACGcBgEAtgoAIZ0GAQC2CgAhngYBALcKACGfBgEAtwoAIaAGQAC6CgAhoQZAALoKACECAAAAfQAgPwAAgQUAIAIAAAB9ACA_AACBBQAgAwAAAH8AIEYAAPoEACBHAAD_BAAgAQAAAH8AIAEAAAB9ACAIDQAAqg0AIEwAAKwNACBNAACrDQAguAUAALAKACCeBgAAsAoAIJ8GAACwCgAgoAYAALAKACChBgAAsAoAIA-iBQAArwkAMKMFAACIBQAQpAUAAK8JADClBQEAywgAIaoFAQDLCAAhuAUAANEIACC5BUAA0ggAIdgFAACwCaMGItkFQADSCAAhnAYBAMsIACGdBgEAywgAIZ4GAQDMCAAhnwYBAMwIACGgBkAAzwgAIaEGQADPCAAhAwAAAH0AIAEAAIcFADBLAACIBQAgAwAAAH0AIAEAAH4AMAIAAH8AIAEAAACDAQAgAQAAAIMBACADAAAAgQEAIAEAAIIBADACAACDAQAgAwAAAIEBACABAACCAQAwAgAAgwEAIAMAAACBAQAgAQAAggEAMAIAAIMBACAIJgAAqQ0AIKUFAQAAAAG5BUAAAAAB2AUBAAAAAeoFAQAAAAGZBgEAAAABmgYBAAAAAZsGQAAAAAEBPwAAkAUAIAelBQEAAAABuQVAAAAAAdgFAQAAAAHqBQEAAAABmQYBAAAAAZoGAQAAAAGbBkAAAAABAT8AAJIFADABPwAAkgUAMAgmAACoDQAgpQUBALYKACG5BUAAvAoAIdgFAQC2CgAh6gUBALcKACGZBgEAtgoAIZoGAQC3CgAhmwZAALwKACECAAAAgwEAID8AAJUFACAHpQUBALYKACG5BUAAvAoAIdgFAQC2CgAh6gUBALcKACGZBgEAtgoAIZoGAQC3CgAhmwZAALwKACECAAAAgQEAID8AAJcFACACAAAAgQEAID8AAJcFACADAAAAgwEAIEYAAJAFACBHAACVBQAgAQAAAIMBACABAAAAgQEAIAUNAAClDQAgTAAApw0AIE0AAKYNACDqBQAAsAoAIJoGAACwCgAgCqIFAACuCQAwowUAAJ4FABCkBQAArgkAMKUFAQDLCAAhuQVAANIIACHYBQEAywgAIeoFAQDMCAAhmQYBAMsIACGaBgEAzAgAIZsGQADSCAAhAwAAAIEBACABAACdBQAwSwAAngUAIAMAAACBAQAgAQAAggEAMAIAAIMBACAPEQAArQkAIKIFAACqCQAwowUAAHcAEKQFAACqCQAwpQUBAAAAAaoFAQAAAAG5BUAA-QgAIdgFAACsCZQGItkFQAD5CAAhkgYAAKsJkgYilAYQAJ0JACGVBgEA_QgAIZYGAACECQAglwZAAIEJACGYBgEA_QgAIQEAAAChBQAgAQAAAKEFACAFEQAApA0AIJUGAACwCgAglgYAALAKACCXBgAAsAoAIJgGAACwCgAgAwAAAHcAIAEAAKQFADACAAChBQAgAwAAAHcAIAEAAKQFADACAAChBQAgAwAAAHcAIAEAAKQFADACAAChBQAgDBEAAKMNACClBQEAAAABqgUBAAAAAbkFQAAAAAHYBQAAAJQGAtkFQAAAAAGSBgAAAJIGApQGEAAAAAGVBgEAAAABlgaAAAAAAZcGQAAAAAGYBgEAAAABAT8AAKgFACALpQUBAAAAAaoFAQAAAAG5BUAAAAAB2AUAAACUBgLZBUAAAAABkgYAAACSBgKUBhAAAAABlQYBAAAAAZYGgAAAAAGXBkAAAAABmAYBAAAAAQE_AACqBQAwAT8AAKoFADAMEQAAog0AIKUFAQC2CgAhqgUBALYKACG5BUAAvAoAIdgFAADoDJQGItkFQAC8CgAhkgYAAOcMkgYilAYQAJcMACGVBgEAtwoAIZYGgAAAAAGXBkAAugoAIZgGAQC3CgAhAgAAAKEFACA_AACtBQAgC6UFAQC2CgAhqgUBALYKACG5BUAAvAoAIdgFAADoDJQGItkFQAC8CgAhkgYAAOcMkgYilAYQAJcMACGVBgEAtwoAIZYGgAAAAAGXBkAAugoAIZgGAQC3CgAhAgAAAHcAID8AAK8FACACAAAAdwAgPwAArwUAIAMAAAChBQAgRgAAqAUAIEcAAK0FACABAAAAoQUAIAEAAAB3ACAJDQAAnQ0AIEwAAKANACBNAACfDQAgngEAAJ4NACCfAQAAoQ0AIJUGAACwCgAglgYAALAKACCXBgAAsAoAIJgGAACwCgAgDqIFAACjCQAwowUAALYFABCkBQAAowkAMKUFAQDLCAAhqgUBAMsIACG5BUAA0ggAIdgFAAClCZQGItkFQADSCAAhkgYAAKQJkgYilAYQAJMJACGVBgEAzAgAIZYGAADRCAAglwZAAM8IACGYBgEAzAgAIQMAAAB3ACABAAC1BQAwSwAAtgUAIAMAAAB3ACABAACkBQAwAgAAoQUAIBYIAACgCQAgIgAAoQkAICMAAKIJACCiBQAAmwkAMKMFAAALABCkBQAAmwkAMKUFAQAAAAG5BUAA-QgAIdkFQAD5CAAh6gUBAP0IACGEBgEAAAABhgYAAJwJhgYihwYQAJ0JACGIBhAAngkAIYkGEACeCQAhigYCAJ8JACGLBgIAgwkAIYwGAgCfCQAhjQZAAPkIACGOBkAA-QgAIY8GIACCCQAhkAYgAIIJACEBAAAAuQUAIAEAAAC5BQAgCAgAAJoNACAiAACbDQAgIwAAnA0AIOoFAACwCgAgiAYAALAKACCJBgAAsAoAIIoGAACwCgAgjAYAALAKACADAAAACwAgAQAAvAUAMAIAALkFACADAAAACwAgAQAAvAUAMAIAALkFACADAAAACwAgAQAAvAUAMAIAALkFACATCAAAlw0AICIAAJgNACAjAACZDQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6gUBAAAAAYQGAQAAAAGGBgAAAIYGAocGEAAAAAGIBhAAAAABiQYQAAAAAYoGAgAAAAGLBgIAAAABjAYCAAAAAY0GQAAAAAGOBkAAAAABjwYgAAAAAZAGIAAAAAEBPwAAwAUAIBClBQEAAAABuQVAAAAAAdkFQAAAAAHqBQEAAAABhAYBAAAAAYYGAAAAhgYChwYQAAAAAYgGEAAAAAGJBhAAAAABigYCAAAAAYsGAgAAAAGMBgIAAAABjQZAAAAAAY4GQAAAAAGPBiAAAAABkAYgAAAAAQE_AADCBQAwAT8AAMIFADATCAAAmQwAICIAAJoMACAjAACbDAAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh6gUBALcKACGEBgEAtgoAIYYGAACWDIYGIocGEACXDAAhiAYQAJgMACGJBhAAmAwAIYoGAgDICgAhiwYCALsKACGMBgIAyAoAIY0GQAC8CgAhjgZAALwKACGPBiAAuQoAIZAGIAC5CgAhAgAAALkFACA_AADFBQAgEKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeoFAQC3CgAhhAYBALYKACGGBgAAlgyGBiKHBhAAlwwAIYgGEACYDAAhiQYQAJgMACGKBgIAyAoAIYsGAgC7CgAhjAYCAMgKACGNBkAAvAoAIY4GQAC8CgAhjwYgALkKACGQBiAAuQoAIQIAAAALACA_AADHBQAgAgAAAAsAID8AAMcFACADAAAAuQUAIEYAAMAFACBHAADFBQAgAQAAALkFACABAAAACwAgCg0AAJEMACBMAACUDAAgTQAAkwwAIJ4BAACSDAAgnwEAAJUMACDqBQAAsAoAIIgGAACwCgAgiQYAALAKACCKBgAAsAoAIIwGAACwCgAgE6IFAACRCQAwowUAAM4FABCkBQAAkQkAMKUFAQDLCAAhuQVAANIIACHZBUAA0ggAIeoFAQDMCAAhhAYBAMsIACGGBgAAkgmGBiKHBhAAkwkAIYgGEACUCQAhiQYQAJQJACGKBgIA5QgAIYsGAgDQCAAhjAYCAOUIACGNBkAA0ggAIY4GQADSCAAhjwYgAM4IACGQBiAAzggAIQMAAAALACABAADNBQAwSwAAzgUAIAMAAAALACABAAC8BQAwAgAAuQUAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgBAUAAI8MACAJAACQDAAgqwUBAAAAAYMGAQAAAAEBPwAA1gUAIAKrBQEAAAABgwYBAAAAAQE_AADYBQAwAT8AANgFADAEBQAAjQwAIAkAAI4MACCrBQEAtgoAIYMGAQC2CgAhAgAAAA8AID8AANsFACACqwUBALYKACGDBgEAtgoAIQIAAAANACA_AADdBQAgAgAAAA0AID8AAN0FACADAAAADwAgRgAA1gUAIEcAANsFACABAAAADwAgAQAAAA0AIAMNAACKDAAgTAAAjAwAIE0AAIsMACAFogUAAJAJADCjBQAA5AUAEKQFAACQCQAwqwUBAMsIACGDBgEAywgAIQMAAAANACABAADjBQAwSwAA5AUAIAMAAAANACABAAAOADACAAAPACABAAAARwAgAQAAAEcAIAMAAABFACABAABGADACAABHACADAAAARQAgAQAARgAwAgAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIAQFAACIDAAgGAAAiQwAIOQFAQAAAAGDBgEAAAABAT8AAOwFACAC5AUBAAAAAYMGAQAAAAEBPwAA7gUAMAE_AADuBQAwBAUAAIYMACAYAACHDAAg5AUBALYKACGDBgEAtgoAIQIAAABHACA_AADxBQAgAuQFAQC2CgAhgwYBALYKACECAAAARQAgPwAA8wUAIAIAAABFACA_AADzBQAgAwAAAEcAIEYAAOwFACBHAADxBQAgAQAAAEcAIAEAAABFACADDQAAgwwAIEwAAIUMACBNAACEDAAgBaIFAACPCQAwowUAAPoFABCkBQAAjwkAMOQFAQDLCAAhgwYBAMsIACEDAAAARQAgAQAA-QUAMEsAAPoFACADAAAARQAgAQAARgAwAgAARwAgAQAAADQAIAEAAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACAMEwAAggwAIKUFAQAAAAG5BUAAAAAB9wUBAAAAAfsFAAAA-wUC_AUCAAAAAf0FAgAAAAH-BQIAAAAB_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAQE_AACCBgAgC6UFAQAAAAG5BUAAAAAB9wUBAAAAAfsFAAAA-wUC_AUCAAAAAf0FAgAAAAH-BQIAAAAB_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAQE_AACEBgAwAT8AAIQGADAMEwAAgQwAIKUFAQC2CgAhuQVAALwKACH3BQEAtgoAIfsFAACADPsFIvwFAgC7CgAh_QUCALsKACH-BQIAuwoAIf8FAQC3CgAhgAYBALcKACGBBgEAtwoAIYIGAQC3CgAhAgAAADQAID8AAIcGACALpQUBALYKACG5BUAAvAoAIfcFAQC2CgAh-wUAAIAM-wUi_AUCALsKACH9BQIAuwoAIf4FAgC7CgAh_wUBALcKACGABgEAtwoAIYEGAQC3CgAhggYBALcKACECAAAAMgAgPwAAiQYAIAIAAAAyACA_AACJBgAgAwAAADQAIEYAAIIGACBHAACHBgAgAQAAADQAIAEAAAAyACAJDQAA-wsAIEwAAP4LACBNAAD9CwAgngEAAPwLACCfAQAA_wsAIP8FAACwCgAggAYAALAKACCBBgAAsAoAIIIGAACwCgAgDqIFAACLCQAwowUAAJAGABCkBQAAiwkAMKUFAQDLCAAhuQVAANIIACH3BQEAywgAIfsFAACMCfsFIvwFAgDQCAAh_QUCANAIACH-BQIA0AgAIf8FAQDMCAAhgAYBAMwIACGBBgEAzAgAIYIGAQDMCAAhAwAAADIAIAEAAI8GADBLAACQBgAgAwAAADIAIAEAADMAMAIAADQAIAwDAACJCQAgDAAAigkAIKIFAACICQAwowUAAMQBABCkBQAAiAkAMKUFAQAAAAGoBQEAAAABuQVAAPkIACHZBUAA-QgAIeUFAQD4CAAh-AUgAIIJACH5BQEAAAABAQAAAJMGACABAAAAkwYAIAMDAAD5CwAgDAAA-gsAIPkFAACwCgAgAwAAAMQBACABAACWBgAwAgAAkwYAIAMAAADEAQAgAQAAlgYAMAIAAJMGACADAAAAxAEAIAEAAJYGADACAACTBgAgCQMAAPcLACAMAAD4CwAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAH4BSAAAAAB-QUBAAAAAQE_AACaBgAgB6UFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAHlBQEAAAAB-AUgAAAAAfkFAQAAAAEBPwAAnAYAMAE_AACcBgAwCQMAAOkLACAMAADqCwAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIfgFIAC5CgAh-QUBALcKACECAAAAkwYAID8AAJ8GACAHpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIfgFIAC5CgAh-QUBALcKACECAAAAxAEAID8AAKEGACACAAAAxAEAID8AAKEGACADAAAAkwYAIEYAAJoGACBHAACfBgAgAQAAAJMGACABAAAAxAEAIAQNAADmCwAgTAAA6AsAIE0AAOcLACD5BQAAsAoAIAqiBQAAhwkAMKMFAACoBgAQpAUAAIcJADClBQEAywgAIagFAQDLCAAhuQVAANIIACHZBUAA0ggAIeUFAQDLCAAh-AUgAM4IACH5BQEAzAgAIQMAAADEAQAgAQAApwYAMEsAAKgGACADAAAAxAEAIAEAAJYGADACAACTBgAgAQAAADgAIAEAAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACAGDwAA5QsAIBUAAOQLACClBQEAAAABuQVAAAAAAfYFAQAAAAH3BQEAAAABAT8AALAGACAEpQUBAAAAAbkFQAAAAAH2BQEAAAAB9wUBAAAAAQE_AACyBgAwAT8AALIGADAGDwAA4wsAIBUAAOILACClBQEAtgoAIbkFQAC8CgAh9gUBALYKACH3BQEAtgoAIQIAAAA4ACA_AAC1BgAgBKUFAQC2CgAhuQVAALwKACH2BQEAtgoAIfcFAQC2CgAhAgAAADYAID8AALcGACACAAAANgAgPwAAtwYAIAMAAAA4ACBGAACwBgAgRwAAtQYAIAEAAAA4ACABAAAANgAgAw0AAN8LACBMAADhCwAgTQAA4AsAIAeiBQAAhgkAMKMFAAC-BgAQpAUAAIYJADClBQEAywgAIbkFQADSCAAh9gUBAMsIACH3BQEAywgAIQMAAAA2ACABAAC9BgAwSwAAvgYAIAMAAAA2ACABAAA3ADACAAA4ACAXHgAA-ggAICIAAP4IACA3AACFCQAgogUAAIAJADCjBQAAxAYAEKQFAACACQAwpQUBAAAAAbgFAACECQAguQVAAPkIACHVBQEA-AgAIdkFQAD5CAAh5gUBAAAAAesFAQD4CAAh7AUBAP0IACHtBQEA_QgAIe4FAQD9CAAh7wVAAIEJACHwBSAAggkAIfEFAgCDCQAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAh9QUgAIIJACEBAAAAwQYAIAEAAADBBgAgFx4AAPoIACAiAAD-CAAgNwAAhQkAIKIFAACACQAwowUAAMQGABCkBQAAgAkAMKUFAQD4CAAhuAUAAIQJACC5BUAA-QgAIdUFAQD4CAAh2QVAAPkIACHmBQEA-AgAIesFAQD4CAAh7AUBAP0IACHtBQEA_QgAIe4FAQD9CAAh7wVAAIEJACHwBSAAggkAIfEFAgCDCQAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAh9QUgAIIJACELHgAApQsAICIAALcLACA3AADeCwAguAUAALAKACDsBQAAsAoAIO0FAACwCgAg7gUAALAKACDvBQAAsAoAIPIFAACwCgAg8wUAALAKACD0BQAAsAoAIAMAAADEBgAgAQAAxQYAMAIAAMEGACADAAAAxAYAIAEAAMUGADACAADBBgAgAwAAAMQGACABAADFBgAwAgAAwQYAIBQeAADcCwAgIgAA2wsAIDcAAN0LACClBQEAAAABuAWAAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAeYFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBQEAAAAB7wVAAAAAAfAFIAAAAAHxBQIAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUgAAAAAQE_AADJBgAgEaUFAQAAAAG4BYAAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB5gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FAQAAAAHvBUAAAAAB8AUgAAAAAfEFAgAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BSAAAAABAT8AAMsGADABPwAAywYAMBQeAAC-CwAgIgAAvQsAIDcAAL8LACClBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdUFAQC2CgAh2QVAALwKACHmBQEAtgoAIesFAQC2CgAh7AUBALcKACHtBQEAtwoAIe4FAQC3CgAh7wVAALoKACHwBSAAuQoAIfEFAgC7CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAh9QUgALkKACECAAAAwQYAID8AAM4GACARpQUBALYKACG4BYAAAAABuQVAALwKACHVBQEAtgoAIdkFQAC8CgAh5gUBALYKACHrBQEAtgoAIewFAQC3CgAh7QUBALcKACHuBQEAtwoAIe8FQAC6CgAh8AUgALkKACHxBQIAuwoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIfUFIAC5CgAhAgAAAMQGACA_AADQBgAgAgAAAMQGACA_AADQBgAgAwAAAMEGACBGAADJBgAgRwAAzgYAIAEAAADBBgAgAQAAAMQGACANDQAAuAsAIEwAALsLACBNAAC6CwAgngEAALkLACCfAQAAvAsAILgFAACwCgAg7AUAALAKACDtBQAAsAoAIO4FAACwCgAg7wUAALAKACDyBQAAsAoAIPMFAACwCgAg9AUAALAKACAUogUAAP8IADCjBQAA1wYAEKQFAAD_CAAwpQUBAMsIACG4BQAA0QgAILkFQADSCAAh1QUBAMsIACHZBUAA0ggAIeYFAQDLCAAh6wUBAMsIACHsBQEAzAgAIe0FAQDMCAAh7gUBAMwIACHvBUAAzwgAIfAFIADOCAAh8QUCANAIACHyBQEAzAgAIfMFAQDMCAAh9AUBAMwIACH1BSAAzggAIQMAAADEBgAgAQAA1gYAMEsAANcGACADAAAAxAYAIAEAAMUGADACAADBBgAgCjYAAP4IACCiBQAA_AgAMKMFAADdBgAQpAUAAPwIADClBQEAAAABuQVAAPkIACHZBUAA-QgAIeUFAQD4CAAh5gUBAAAAAeoFAQD9CAAhAQAAANoGACABAAAA2gYAIAo2AAD-CAAgogUAAPwIADCjBQAA3QYAEKQFAAD8CAAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh5QUBAPgIACHmBQEA-AgAIeoFAQD9CAAhAjYAALcLACDqBQAAsAoAIAMAAADdBgAgAQAA3gYAMAIAANoGACADAAAA3QYAIAEAAN4GADACAADaBgAgAwAAAN0GACABAADeBgAwAgAA2gYAIAc2AAC2CwAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAABAT8AAOIGACAGpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAABAT8AAOQGADABPwAA5AYAMAc2AACpCwAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5QUBALYKACHmBQEAtgoAIeoFAQC3CgAhAgAAANoGACA_AADnBgAgBqUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh5gUBALYKACHqBQEAtwoAIQIAAADdBgAgPwAA6QYAIAIAAADdBgAgPwAA6QYAIAMAAADaBgAgRgAA4gYAIEcAAOcGACABAAAA2gYAIAEAAADdBgAgBA0AAKYLACBMAACoCwAgTQAApwsAIOoFAACwCgAgCaIFAAD7CAAwowUAAPAGABCkBQAA-wgAMKUFAQDLCAAhuQVAANIIACHZBUAA0ggAIeUFAQDLCAAh5gUBAMsIACHqBQEAzAgAIQMAAADdBgAgAQAA7wYAMEsAAPAGACADAAAA3QYAIAEAAN4GADACAADaBgAgCTYAAPoIACCiBQAA9wgAMKMFAAD2BgAQpAUAAPcIADClBQEAAAABuQVAAPkIACHZBUAA-QgAIeUFAQAAAAHmBQEAAAABAQAAAPMGACABAAAA8wYAIAk2AAD6CAAgogUAAPcIADCjBQAA9gYAEKQFAAD3CAAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh5QUBAPgIACHmBQEA-AgAIQE2AAClCwAgAwAAAPYGACABAAD3BgAwAgAA8wYAIAMAAAD2BgAgAQAA9wYAMAIAAPMGACADAAAA9gYAIAEAAPcGADACAADzBgAgBjYAAKQLACClBQEAAAABuQVAAAAAAdkFQAAAAAHlBQEAAAAB5gUBAAAAAQE_AAD7BgAgBaUFAQAAAAG5BUAAAAAB2QVAAAAAAeUFAQAAAAHmBQEAAAABAT8AAP0GADABPwAA_QYAMAY2AACXCwAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5QUBALYKACHmBQEAtgoAIQIAAADzBgAgPwAAgAcAIAWlBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIeYFAQC2CgAhAgAAAPYGACA_AACCBwAgAgAAAPYGACA_AACCBwAgAwAAAPMGACBGAAD7BgAgRwAAgAcAIAEAAADzBgAgAQAAAPYGACADDQAAlAsAIEwAAJYLACBNAACVCwAgCKIFAAD2CAAwowUAAIkHABCkBQAA9ggAMKUFAQDLCAAhuQVAANIIACHZBUAA0ggAIeUFAQDLCAAh5gUBAMsIACEDAAAA9gYAIAEAAIgHADBLAACJBwAgAwAAAPYGACABAAD3BgAwAgAA8wYAIAEAAACxAQAgAQAAALEBACADAAAArwEAIAEAALABADACAACxAQAgAwAAAK8BACABAACwAQAwAgAAsQEAIAMAAACvAQAgAQAAsAEAMAIAALEBACAEGAAAkwsAIDUAAJILACDeBQEAAAAB5AUBAAAAAQE_AACRBwAgAt4FAQAAAAHkBQEAAAABAT8AAJMHADABPwAAkwcAMAQYAACRCwAgNQAAkAsAIN4FAQC2CgAh5AUBALYKACECAAAAsQEAID8AAJYHACAC3gUBALYKACHkBQEAtgoAIQIAAACvAQAgPwAAmAcAIAIAAACvAQAgPwAAmAcAIAMAAACxAQAgRgAAkQcAIEcAAJYHACABAAAAsQEAIAEAAACvAQAgAw0AAI0LACBMAACPCwAgTQAAjgsAIAWiBQAA9QgAMKMFAACfBwAQpAUAAPUIADDeBQEAywgAIeQFAQDLCAAhAwAAAK8BACABAACeBwAwSwAAnwcAIAMAAACvAQAgAQAAsAEAMAIAALEBACABAAAAtwEAIAEAAAC3AQAgAwAAALUBACABAAC2AQAwAgAAtwEAIAMAAAC1AQAgAQAAtgEAMAIAALcBACADAAAAtQEAIAEAALYBADACAAC3AQAgBB0AAIwLACA1AACLCwAg3gUBAAAAAeMFAQAAAAEBPwAApwcAIALeBQEAAAAB4wUBAAAAAQE_AACpBwAwAT8AAKkHADAEHQAAigsAIDUAAIkLACDeBQEAtgoAIeMFAQC2CgAhAgAAALcBACA_AACsBwAgAt4FAQC2CgAh4wUBALYKACECAAAAtQEAID8AAK4HACACAAAAtQEAID8AAK4HACADAAAAtwEAIEYAAKcHACBHAACsBwAgAQAAALcBACABAAAAtQEAIAMNAACGCwAgTAAAiAsAIE0AAIcLACAFogUAAPQIADCjBQAAtQcAEKQFAAD0CAAw3gUBAMsIACHjBQEAywgAIQMAAAC1AQAgAQAAtAcAMEsAALUHACADAAAAtQEAIAEAALYBADACAAC3AQAgAQAAAK0BACABAAAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIA4DAACDCwAgBgAAhQsAIDUAAIILACA4AACECwAgpQUBAAAAAagFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQE_AAC9BwAgCqUFAQAAAAGoBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAeIFAQAAAAEBPwAAvwcAMAE_AAC_BwAwAQAAAFUAIAEAAACrAQAgDgMAAPMKACAGAAD0CgAgNQAA8goAIDgAAPUKACClBQEAtgoAIagFAQC3CgAhuQVAALwKACHVBQEAtgoAIdkFQAC8CgAh3gUBALYKACHfBQEAtwoAIeAFAQC3CgAh4QUgALkKACHiBQEAtwoAIQIAAACtAQAgPwAAxAcAIAqlBQEAtgoAIagFAQC3CgAhuQVAALwKACHVBQEAtgoAIdkFQAC8CgAh3gUBALYKACHfBQEAtwoAIeAFAQC3CgAh4QUgALkKACHiBQEAtwoAIQIAAACrAQAgPwAAxgcAIAIAAACrAQAgPwAAxgcAIAEAAABVACABAAAAqwEAIAMAAACtAQAgRgAAvQcAIEcAAMQHACABAAAArQEAIAEAAACrAQAgBw0AAO8KACBMAADxCgAgTQAA8AoAIKgFAACwCgAg3wUAALAKACDgBQAAsAoAIOIFAACwCgAgDaIFAADzCAAwowUAAM8HABCkBQAA8wgAMKUFAQDLCAAhqAUBAMwIACG5BUAA0ggAIdUFAQDLCAAh2QVAANIIACHeBQEAywgAId8FAQDMCAAh4AUBAMwIACHhBSAAzggAIeIFAQDMCAAhAwAAAKsBACABAADOBwAwSwAAzwcAIAMAAACrAQAgAQAArAEAMAIAAK0BACABAAAAogEAIAEAAACiAQAgAwAAAKABACABAAChAQAwAgAAogEAIAMAAACgAQAgAQAAoQEAMAIAAKIBACADAAAAoAEAIAEAAKEBADACAACiAQAgCS0AAO0KACAuAADuCgAgpQUBAAAAAbkFQAAAAAHYBQAAAN0FAtkFQAAAAAHaBQEAAAAB2wUBAAAAAd0FAQAAAAEBPwAA1wcAIAelBQEAAAABuQVAAAAAAdgFAAAA3QUC2QVAAAAAAdoFAQAAAAHbBQEAAAAB3QUBAAAAAQE_AADZBwAwAT8AANkHADAJLQAA3woAIC4AAOAKACClBQEAtgoAIbkFQAC8CgAh2AUAAN4K3QUi2QVAALwKACHaBQEAtgoAIdsFAQC2CgAh3QUBALcKACECAAAAogEAID8AANwHACAHpQUBALYKACG5BUAAvAoAIdgFAADeCt0FItkFQAC8CgAh2gUBALYKACHbBQEAtgoAId0FAQC3CgAhAgAAAKABACA_AADeBwAgAgAAAKABACA_AADeBwAgAwAAAKIBACBGAADXBwAgRwAA3AcAIAEAAACiAQAgAQAAAKABACAEDQAA2woAIEwAAN0KACBNAADcCgAg3QUAALAKACAKogUAAO8IADCjBQAA5QcAEKQFAADvCAAwpQUBAMsIACG5BUAA0ggAIdgFAADwCN0FItkFQADSCAAh2gUBAMsIACHbBQEAywgAId0FAQDMCAAhAwAAAKABACABAADkBwAwSwAA5QcAIAMAAACgAQAgAQAAoQEAMAIAAKIBACABAAAAnAEAIAEAAACcAQAgAwAAAJoBACABAACbAQAwAgAAnAEAIAMAAACaAQAgAQAAmwEAMAIAAJwBACADAAAAmgEAIAEAAJsBADACAACcAQAgCy8AANkKACAwAADaCgAgpQUBAAAAAbkFQAAAAAHRBQEAAAAB0gUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAEBPwAA7QcAIAmlBQEAAAABuQVAAAAAAdEFAQAAAAHSBQEAAAAB1AUAAADUBQLVBQEAAAAB1gWAAAAAAdgFAAAA2AUC2QVAAAAAAQE_AADvBwAwAT8AAO8HADALLwAA1woAIDAAANgKACClBQEAtgoAIbkFQAC8CgAh0QUBALYKACHSBQEAtgoAIdQFAADVCtQFItUFAQC2CgAh1gWAAAAAAdgFAADWCtgFItkFQAC8CgAhAgAAAJwBACA_AADyBwAgCaUFAQC2CgAhuQVAALwKACHRBQEAtgoAIdIFAQC2CgAh1AUAANUK1AUi1QUBALYKACHWBYAAAAAB2AUAANYK2AUi2QVAALwKACECAAAAmgEAID8AAPQHACACAAAAmgEAID8AAPQHACADAAAAnAEAIEYAAO0HACBHAADyBwAgAQAAAJwBACABAAAAmgEAIAQNAADSCgAgTAAA1AoAIE0AANMKACDWBQAAsAoAIAyiBQAA6AgAMKMFAAD7BwAQpAUAAOgIADClBQEAywgAIbkFQADSCAAh0QUBAMsIACHSBQEAywgAIdQFAADpCNQFItUFAQDLCAAh1gUAANEIACDYBQAA6gjYBSLZBUAA0ggAIQMAAACaAQAgAQAA-gcAMEsAAPsHACADAAAAmgEAIAEAAJsBADACAACcAQAgAQAAAF8AIAEAAABfACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACAKAwAA0QoAIAkAANAKACClBQEAAAABqAUBAAAAAakFAQAAAAGrBQEAAAABsAUBAAAAAc4FAQAAAAHPBQEAAAAB0AVAAAAAAQE_AACDCAAgCKUFAQAAAAGoBQEAAAABqQUBAAAAAasFAQAAAAGwBQEAAAABzgUBAAAAAc8FAQAAAAHQBUAAAAABAT8AAIUIADABPwAAhQgAMAEAAABVACAKAwAAzwoAIAkAAM4KACClBQEAtgoAIagFAQC3CgAhqQUBALcKACGrBQEAtgoAIbAFAQC3CgAhzgUBALcKACHPBQEAtwoAIdAFQAC8CgAhAgAAAF8AID8AAIkIACAIpQUBALYKACGoBQEAtwoAIakFAQC3CgAhqwUBALYKACGwBQEAtwoAIc4FAQC3CgAhzwUBALcKACHQBUAAvAoAIQIAAABdACA_AACLCAAgAgAAAF0AID8AAIsIACABAAAAVQAgAwAAAF8AIEYAAIMIACBHAACJCAAgAQAAAF8AIAEAAABdACAIDQAAywoAIEwAAM0KACBNAADMCgAgqAUAALAKACCpBQAAsAoAILAFAACwCgAgzgUAALAKACDPBQAAsAoAIAuiBQAA5wgAMKMFAACTCAAQpAUAAOcIADClBQEAywgAIagFAQDMCAAhqQUBAMwIACGrBQEAywgAIbAFAQDMCAAhzgUBAMwIACHPBQEAzAgAIdAFQADSCAAhAwAAAF0AIAEAAJIIADBLAACTCAAgAwAAAF0AIAEAAF4AMAIAAF8AIAEAAACoAQAgAQAAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACAIAwAAygoAIKUFAQAAAAGoBQEAAAABqQUBAAAAAbkFQAAAAAHLBQEAAAABzAUCAAAAAc0FgAAAAAEBPwAAmwgAIAelBQEAAAABqAUBAAAAAakFAQAAAAG5BUAAAAABywUBAAAAAcwFAgAAAAHNBYAAAAABAT8AAJ0IADABPwAAnQgAMAEAAABVACAIAwAAyQoAIKUFAQC2CgAhqAUBALcKACGpBQEAtwoAIbkFQAC8CgAhywUBALYKACHMBQIAyAoAIc0FgAAAAAECAAAAqAEAID8AAKEIACAHpQUBALYKACGoBQEAtwoAIakFAQC3CgAhuQVAALwKACHLBQEAtgoAIcwFAgDICgAhzQWAAAAAAQIAAACmAQAgPwAAowgAIAIAAACmAQAgPwAAowgAIAEAAABVACADAAAAqAEAIEYAAJsIACBHAAChCAAgAQAAAKgBACABAAAApgEAIAkNAADDCgAgTAAAxgoAIE0AAMUKACCeAQAAxAoAIJ8BAADHCgAgqAUAALAKACCpBQAAsAoAIMwFAACwCgAgzQUAALAKACAKogUAAOQIADCjBQAAqwgAEKQFAADkCAAwpQUBAMsIACGoBQEAzAgAIakFAQDMCAAhuQVAANIIACHLBQEAywgAIcwFAgDlCAAhzQUAANEIACADAAAApgEAIAEAAKoIADBLAACrCAAgAwAAAKYBACABAACnAQAwAgAAqAEAIAEAAABkACABAAAAZAAgAwAAAGIAIAEAAGMAMAIAAGQAIAMAAABiACABAABjADACAABkACADAAAAYgAgAQAAYwAwAgAAZAAgGAMAAMAKACAJAADCCgAgEQAAwQoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGsBQgAAAABrQUBAAAAAa4FAQAAAAGvBQEAAAABsAUBAAAAAbEFIAAAAAGyBSAAAAABswVAAAAAAbQFQAAAAAG1BQIAAAABtgVAAAAAAbcFAQAAAAG4BYAAAAABuQVAAAAAAQE_AACzCAAgFaUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGsBQgAAAABrQUBAAAAAa4FAQAAAAGvBQEAAAABsAUBAAAAAbEFIAAAAAGyBSAAAAABswVAAAAAAbQFQAAAAAG1BQIAAAABtgVAAAAAAbcFAQAAAAG4BYAAAAABuQVAAAAAAQE_AAC1CAAwAT8AALUIADABAAAAVQAgAQAAAAcAIAEAAAAXACAYAwAAvQoAIAkAAL8KACARAAC-CgAgpQUBALYKACGmBQEAtgoAIacFAQC3CgAhqAUBALcKACGpBQEAtwoAIaoFAQC3CgAhqwUBALcKACGsBQgAuAoAIa0FAQC3CgAhrgUBALcKACGvBQEAtwoAIbAFAQC3CgAhsQUgALkKACGyBSAAuQoAIbMFQAC6CgAhtAVAALoKACG1BQIAuwoAIbYFQAC6CgAhtwUBALcKACG4BYAAAAABuQVAALwKACECAAAAZAAgPwAAuwgAIBWlBQEAtgoAIaYFAQC2CgAhpwUBALcKACGoBQEAtwoAIakFAQC3CgAhqgUBALcKACGrBQEAtwoAIawFCAC4CgAhrQUBALcKACGuBQEAtwoAIa8FAQC3CgAhsAUBALcKACGxBSAAuQoAIbIFIAC5CgAhswVAALoKACG0BUAAugoAIbUFAgC7CgAhtgVAALoKACG3BQEAtwoAIbgFgAAAAAG5BUAAvAoAIQIAAABiACA_AAC9CAAgAgAAAGIAID8AAL0IACABAAAAVQAgAQAAAAcAIAEAAAAXACADAAAAZAAgRgAAswgAIEcAALsIACABAAAAZAAgAQAAAGIAIBQNAACxCgAgTAAAtAoAIE0AALMKACCeAQAAsgoAIJ8BAAC1CgAgpwUAALAKACCoBQAAsAoAIKkFAACwCgAgqgUAALAKACCrBQAAsAoAIKwFAACwCgAgrQUAALAKACCuBQAAsAoAIK8FAACwCgAgsAUAALAKACCzBQAAsAoAILQFAACwCgAgtgUAALAKACC3BQAAsAoAILgFAACwCgAgGKIFAADKCAAwowUAAMcIABCkBQAAyggAMKUFAQDLCAAhpgUBAMsIACGnBQEAzAgAIagFAQDMCAAhqQUBAMwIACGqBQEAzAgAIasFAQDMCAAhrAUIAM0IACGtBQEAzAgAIa4FAQDMCAAhrwUBAMwIACGwBQEAzAgAIbEFIADOCAAhsgUgAM4IACGzBUAAzwgAIbQFQADPCAAhtQUCANAIACG2BUAAzwgAIbcFAQDMCAAhuAUAANEIACC5BUAA0ggAIQMAAABiACABAADGCAAwSwAAxwgAIAMAAABiACABAABjADACAABkACAYogUAAMoIADCjBQAAxwgAEKQFAADKCAAwpQUBAMsIACGmBQEAywgAIacFAQDMCAAhqAUBAMwIACGpBQEAzAgAIaoFAQDMCAAhqwUBAMwIACGsBQgAzQgAIa0FAQDMCAAhrgUBAMwIACGvBQEAzAgAIbAFAQDMCAAhsQUgAM4IACGyBSAAzggAIbMFQADPCAAhtAVAAM8IACG1BQIA0AgAIbYFQADPCAAhtwUBAMwIACG4BQAA0QgAILkFQADSCAAhDg0AANQIACBMAADjCAAgTQAA4wgAILoFAQAAAAG7BQEAAAAEvAUBAAAABL0FAQAAAAG-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEA4ggAIcgFAQAAAAHJBQEAAAABygUBAAAAAQ4NAADWCAAgTAAA4QgAIE0AAOEIACC6BQEAAAABuwUBAAAABbwFAQAAAAW9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOAIACHIBQEAAAAByQUBAAAAAcoFAQAAAAENDQAA1ggAIEwAAN8IACBNAADfCAAgngEAAN8IACCfAQAA3wgAILoFCAAAAAG7BQgAAAAFvAUIAAAABb0FCAAAAAG-BQgAAAABvwUIAAAAAcAFCAAAAAHBBQgA3ggAIQUNAADUCAAgTAAA3QgAIE0AAN0IACC6BSAAAAABwQUgANwIACELDQAA1ggAIEwAANsIACBNAADbCAAgugVAAAAAAbsFQAAAAAW8BUAAAAAFvQVAAAAAAb4FQAAAAAG_BUAAAAABwAVAAAAAAcEFQADaCAAhDQ0AANQIACBMAADUCAAgTQAA1AgAIJ4BAADZCAAgnwEAANQIACC6BQIAAAABuwUCAAAABLwFAgAAAAS9BQIAAAABvgUCAAAAAb8FAgAAAAHABQIAAAABwQUCANgIACEPDQAA1ggAIEwAANcIACBNAADXCAAgugWAAAAAAb0FgAAAAAG-BYAAAAABvwWAAAAAAcAFgAAAAAHBBYAAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQWAAAAAAcYFgAAAAAHHBYAAAAABCw0AANQIACBMAADVCAAgTQAA1QgAILoFQAAAAAG7BUAAAAAEvAVAAAAABL0FQAAAAAG-BUAAAAABvwVAAAAAAcAFQAAAAAHBBUAA0wgAIQsNAADUCAAgTAAA1QgAIE0AANUIACC6BUAAAAABuwVAAAAABLwFQAAAAAS9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAANMIACEIugUCAAAAAbsFAgAAAAS8BQIAAAAEvQUCAAAAAb4FAgAAAAG_BQIAAAABwAUCAAAAAcEFAgDUCAAhCLoFQAAAAAG7BUAAAAAEvAVAAAAABL0FQAAAAAG-BUAAAAABvwVAAAAAAcAFQAAAAAHBBUAA1QgAIQi6BQIAAAABuwUCAAAABbwFAgAAAAW9BQIAAAABvgUCAAAAAb8FAgAAAAHABQIAAAABwQUCANYIACEMugWAAAAAAb0FgAAAAAG-BYAAAAABvwWAAAAAAcAFgAAAAAHBBYAAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQWAAAAAAcYFgAAAAAHHBYAAAAABDQ0AANQIACBMAADUCAAgTQAA1AgAIJ4BAADZCAAgnwEAANQIACC6BQIAAAABuwUCAAAABLwFAgAAAAS9BQIAAAABvgUCAAAAAb8FAgAAAAHABQIAAAABwQUCANgIACEIugUIAAAAAbsFCAAAAAS8BQgAAAAEvQUIAAAAAb4FCAAAAAG_BQgAAAABwAUIAAAAAcEFCADZCAAhCw0AANYIACBMAADbCAAgTQAA2wgAILoFQAAAAAG7BUAAAAAFvAVAAAAABb0FQAAAAAG-BUAAAAABvwVAAAAAAcAFQAAAAAHBBUAA2ggAIQi6BUAAAAABuwVAAAAABbwFQAAAAAW9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAANsIACEFDQAA1AgAIEwAAN0IACBNAADdCAAgugUgAAAAAcEFIADcCAAhAroFIAAAAAHBBSAA3QgAIQ0NAADWCAAgTAAA3wgAIE0AAN8IACCeAQAA3wgAIJ8BAADfCAAgugUIAAAAAbsFCAAAAAW8BQgAAAAFvQUIAAAAAb4FCAAAAAG_BQgAAAABwAUIAAAAAcEFCADeCAAhCLoFCAAAAAG7BQgAAAAFvAUIAAAABb0FCAAAAAG-BQgAAAABvwUIAAAAAcAFCAAAAAHBBQgA3wgAIQ4NAADWCAAgTAAA4QgAIE0AAOEIACC6BQEAAAABuwUBAAAABbwFAQAAAAW9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOAIACHIBQEAAAAByQUBAAAAAcoFAQAAAAELugUBAAAAAbsFAQAAAAW8BQEAAAAFvQUBAAAAAb4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQDhCAAhyAUBAAAAAckFAQAAAAHKBQEAAAABDg0AANQIACBMAADjCAAgTQAA4wgAILoFAQAAAAG7BQEAAAAEvAUBAAAABL0FAQAAAAG-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEA4ggAIcgFAQAAAAHJBQEAAAABygUBAAAAAQu6BQEAAAABuwUBAAAABLwFAQAAAAS9BQEAAAABvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAOMIACHIBQEAAAAByQUBAAAAAcoFAQAAAAEKogUAAOQIADCjBQAAqwgAEKQFAADkCAAwpQUBAMsIACGoBQEAzAgAIakFAQDMCAAhuQVAANIIACHLBQEAywgAIcwFAgDlCAAhzQUAANEIACANDQAA1ggAIEwAANYIACBNAADWCAAgngEAAN8IACCfAQAA1ggAILoFAgAAAAG7BQIAAAAFvAUCAAAABb0FAgAAAAG-BQIAAAABvwUCAAAAAcAFAgAAAAHBBQIA5ggAIQ0NAADWCAAgTAAA1ggAIE0AANYIACCeAQAA3wgAIJ8BAADWCAAgugUCAAAAAbsFAgAAAAW8BQIAAAAFvQUCAAAAAb4FAgAAAAG_BQIAAAABwAUCAAAAAcEFAgDmCAAhC6IFAADnCAAwowUAAJMIABCkBQAA5wgAMKUFAQDLCAAhqAUBAMwIACGpBQEAzAgAIasFAQDLCAAhsAUBAMwIACHOBQEAzAgAIc8FAQDMCAAh0AVAANIIACEMogUAAOgIADCjBQAA-wcAEKQFAADoCAAwpQUBAMsIACG5BUAA0ggAIdEFAQDLCAAh0gUBAMsIACHUBQAA6QjUBSLVBQEAywgAIdYFAADRCAAg2AUAAOoI2AUi2QVAANIIACEHDQAA1AgAIEwAAO4IACBNAADuCAAgugUAAADUBQK7BQAAANQFCLwFAAAA1AUIwQUAAO0I1AUiBw0AANQIACBMAADsCAAgTQAA7AgAILoFAAAA2AUCuwUAAADYBQi8BQAAANgFCMEFAADrCNgFIgcNAADUCAAgTAAA7AgAIE0AAOwIACC6BQAAANgFArsFAAAA2AUIvAUAAADYBQjBBQAA6wjYBSIEugUAAADYBQK7BQAAANgFCLwFAAAA2AUIwQUAAOwI2AUiBw0AANQIACBMAADuCAAgTQAA7ggAILoFAAAA1AUCuwUAAADUBQi8BQAAANQFCMEFAADtCNQFIgS6BQAAANQFArsFAAAA1AUIvAUAAADUBQjBBQAA7gjUBSIKogUAAO8IADCjBQAA5QcAEKQFAADvCAAwpQUBAMsIACG5BUAA0ggAIdgFAADwCN0FItkFQADSCAAh2gUBAMsIACHbBQEAywgAId0FAQDMCAAhBw0AANQIACBMAADyCAAgTQAA8ggAILoFAAAA3QUCuwUAAADdBQi8BQAAAN0FCMEFAADxCN0FIgcNAADUCAAgTAAA8ggAIE0AAPIIACC6BQAAAN0FArsFAAAA3QUIvAUAAADdBQjBBQAA8QjdBSIEugUAAADdBQK7BQAAAN0FCLwFAAAA3QUIwQUAAPII3QUiDaIFAADzCAAwowUAAM8HABCkBQAA8wgAMKUFAQDLCAAhqAUBAMwIACG5BUAA0ggAIdUFAQDLCAAh2QVAANIIACHeBQEAywgAId8FAQDMCAAh4AUBAMwIACHhBSAAzggAIeIFAQDMCAAhBaIFAAD0CAAwowUAALUHABCkBQAA9AgAMN4FAQDLCAAh4wUBAMsIACEFogUAAPUIADCjBQAAnwcAEKQFAAD1CAAw3gUBAMsIACHkBQEAywgAIQiiBQAA9ggAMKMFAACJBwAQpAUAAPYIADClBQEAywgAIbkFQADSCAAh2QVAANIIACHlBQEAywgAIeYFAQDLCAAhCTYAAPoIACCiBQAA9wgAMKMFAAD2BgAQpAUAAPcIADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHlBQEA-AgAIeYFAQD4CAAhC7oFAQAAAAG7BQEAAAAEvAUBAAAABL0FAQAAAAG-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEA4wgAIcgFAQAAAAHJBQEAAAABygUBAAAAAQi6BUAAAAABuwVAAAAABLwFQAAAAAS9BUAAAAABvgVAAAAAAb8FQAAAAAHABUAAAAABwQVAANUIACED5wUAALUBACDoBQAAtQEAIOkFAAC1AQAgCaIFAAD7CAAwowUAAPAGABCkBQAA-wgAMKUFAQDLCAAhuQVAANIIACHZBUAA0ggAIeUFAQDLCAAh5gUBAMsIACHqBQEAzAgAIQo2AAD-CAAgogUAAPwIADCjBQAA3QYAEKQFAAD8CAAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh5QUBAPgIACHmBQEA-AgAIeoFAQD9CAAhC7oFAQAAAAG7BQEAAAAFvAUBAAAABb0FAQAAAAG-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEA4QgAIcgFAQAAAAHJBQEAAAABygUBAAAAAQPnBQAArwEAIOgFAACvAQAg6QUAAK8BACAUogUAAP8IADCjBQAA1wYAEKQFAAD_CAAwpQUBAMsIACG4BQAA0QgAILkFQADSCAAh1QUBAMsIACHZBUAA0ggAIeYFAQDLCAAh6wUBAMsIACHsBQEAzAgAIe0FAQDMCAAh7gUBAMwIACHvBUAAzwgAIfAFIADOCAAh8QUCANAIACHyBQEAzAgAIfMFAQDMCAAh9AUBAMwIACH1BSAAzggAIRceAAD6CAAgIgAA_ggAIDcAAIUJACCiBQAAgAkAMKMFAADEBgAQpAUAAIAJADClBQEA-AgAIbgFAACECQAguQVAAPkIACHVBQEA-AgAIdkFQAD5CAAh5gUBAPgIACHrBQEA-AgAIewFAQD9CAAh7QUBAP0IACHuBQEA_QgAIe8FQACBCQAh8AUgAIIJACHxBQIAgwkAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIfUFIACCCQAhCLoFQAAAAAG7BUAAAAAFvAVAAAAABb0FQAAAAAG-BUAAAAABvwVAAAAAAcAFQAAAAAHBBUAA2wgAIQK6BSAAAAABwQUgAN0IACEIugUCAAAAAbsFAgAAAAS8BQIAAAAEvQUCAAAAAb4FAgAAAAG_BQIAAAABwAUCAAAAAcEFAgDUCAAhDLoFgAAAAAG9BYAAAAABvgWAAAAAAb8FgAAAAAHABYAAAAABwQWAAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFgAAAAAHGBYAAAAABxwWAAAAAAQPnBQAAqwEAIOgFAACrAQAg6QUAAKsBACAHogUAAIYJADCjBQAAvgYAEKQFAACGCQAwpQUBAMsIACG5BUAA0ggAIfYFAQDLCAAh9wUBAMsIACEKogUAAIcJADCjBQAAqAYAEKQFAACHCQAwpQUBAMsIACGoBQEAywgAIbkFQADSCAAh2QVAANIIACHlBQEAywgAIfgFIADOCAAh-QUBAMwIACEMAwAAiQkAIAwAAIoJACCiBQAAiAkAMKMFAADEAQAQpAUAAIgJADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeUFAQD4CAAh-AUgAIIJACH5BQEA_QgAISMOAAD-CQAgFQAAgwoAIBwAAP0JACAfAACACgAgIAAAggoAICMAAKIJACApAAD5CQAgKgAA-gkAICsAAPsJACAsAAD8CQAgMQAA3wkAIDIAAP8JACAzAAD9CQAgNAAAgQoAIDkAAIUJACCiBQAA9wkAMKMFAABVABCkBQAA9wkAMKUFAQD4CAAhsAUBAP0IACG4BQAAhAkAILkFQAD5CAAh2AUAAPgJ8AYi2QVAAPkIACHlBQEA_QgAIdgGAQD9CAAh2wYBAP0IACHsBgEA-AgAIe0GIACCCQAh7gYAAOEJ1AUi8AZAAIEJACHxBgEA_QgAIfIGAQD9CAAh_gYAAFUAIP8GAABVACAD5wUAADYAIOgFAAA2ACDpBQAANgAgDqIFAACLCQAwowUAAJAGABCkBQAAiwkAMKUFAQDLCAAhuQVAANIIACH3BQEAywgAIfsFAACMCfsFIvwFAgDQCAAh_QUCANAIACH-BQIA0AgAIf8FAQDMCAAhgAYBAMwIACGBBgEAzAgAIYIGAQDMCAAhBw0AANQIACBMAACOCQAgTQAAjgkAILoFAAAA-wUCuwUAAAD7BQi8BQAAAPsFCMEFAACNCfsFIgcNAADUCAAgTAAAjgkAIE0AAI4JACC6BQAAAPsFArsFAAAA-wUIvAUAAAD7BQjBBQAAjQn7BSIEugUAAAD7BQK7BQAAAPsFCLwFAAAA-wUIwQUAAI4J-wUiBaIFAACPCQAwowUAAPoFABCkBQAAjwkAMOQFAQDLCAAhgwYBAMsIACEFogUAAJAJADCjBQAA5AUAEKQFAACQCQAwqwUBAMsIACGDBgEAywgAIROiBQAAkQkAMKMFAADOBQAQpAUAAJEJADClBQEAywgAIbkFQADSCAAh2QVAANIIACHqBQEAzAgAIYQGAQDLCAAhhgYAAJIJhgYihwYQAJMJACGIBhAAlAkAIYkGEACUCQAhigYCAOUIACGLBgIA0AgAIYwGAgDlCAAhjQZAANIIACGOBkAA0ggAIY8GIADOCAAhkAYgAM4IACEHDQAA1AgAIEwAAJoJACBNAACaCQAgugUAAACGBgK7BQAAAIYGCLwFAAAAhgYIwQUAAJkJhgYiDQ0AANQIACBMAACYCQAgTQAAmAkAIJ4BAACYCQAgnwEAAJgJACC6BRAAAAABuwUQAAAABLwFEAAAAAS9BRAAAAABvgUQAAAAAb8FEAAAAAHABRAAAAABwQUQAJcJACENDQAA1ggAIEwAAJYJACBNAACWCQAgngEAAJYJACCfAQAAlgkAILoFEAAAAAG7BRAAAAAFvAUQAAAABb0FEAAAAAG-BRAAAAABvwUQAAAAAcAFEAAAAAHBBRAAlQkAIQ0NAADWCAAgTAAAlgkAIE0AAJYJACCeAQAAlgkAIJ8BAACWCQAgugUQAAAAAbsFEAAAAAW8BRAAAAAFvQUQAAAAAb4FEAAAAAG_BRAAAAABwAUQAAAAAcEFEACVCQAhCLoFEAAAAAG7BRAAAAAFvAUQAAAABb0FEAAAAAG-BRAAAAABvwUQAAAAAcAFEAAAAAHBBRAAlgkAIQ0NAADUCAAgTAAAmAkAIE0AAJgJACCeAQAAmAkAIJ8BAACYCQAgugUQAAAAAbsFEAAAAAS8BRAAAAAEvQUQAAAAAb4FEAAAAAG_BRAAAAABwAUQAAAAAcEFEACXCQAhCLoFEAAAAAG7BRAAAAAEvAUQAAAABL0FEAAAAAG-BRAAAAABvwUQAAAAAcAFEAAAAAHBBRAAmAkAIQcNAADUCAAgTAAAmgkAIE0AAJoJACC6BQAAAIYGArsFAAAAhgYIvAUAAACGBgjBBQAAmQmGBiIEugUAAACGBgK7BQAAAIYGCLwFAAAAhgYIwQUAAJoJhgYiFggAAKAJACAiAAChCQAgIwAAogkAIKIFAACbCQAwowUAAAsAEKQFAACbCQAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh6gUBAP0IACGEBgEA-AgAIYYGAACcCYYGIocGEACdCQAhiAYQAJ4JACGJBhAAngkAIYoGAgCfCQAhiwYCAIMJACGMBgIAnwkAIY0GQAD5CAAhjgZAAPkIACGPBiAAggkAIZAGIACCCQAhBLoFAAAAhgYCuwUAAACGBgi8BQAAAIYGCMEFAACaCYYGIgi6BRAAAAABuwUQAAAABLwFEAAAAAS9BRAAAAABvgUQAAAAAb8FEAAAAAHABRAAAAABwQUQAJgJACEIugUQAAAAAbsFEAAAAAW8BRAAAAAFvQUQAAAAAb4FEAAAAAG_BRAAAAABwAUQAAAAAcEFEACWCQAhCLoFAgAAAAG7BQIAAAAFvAUCAAAABb0FAgAAAAG-BQIAAAABvwUCAAAAAcAFAgAAAAHBBQIA1ggAIQPnBQAADQAg6AUAAA0AIOkFAAANACAD5wUAAEUAIOgFAABFACDpBQAARQAgA-cFAAAHACDoBQAABwAg6QUAAAcAIA6iBQAAowkAMKMFAAC2BQAQpAUAAKMJADClBQEAywgAIaoFAQDLCAAhuQVAANIIACHYBQAApQmUBiLZBUAA0ggAIZIGAACkCZIGIpQGEACTCQAhlQYBAMwIACGWBgAA0QgAIJcGQADPCAAhmAYBAMwIACEHDQAA1AgAIEwAAKkJACBNAACpCQAgugUAAACSBgK7BQAAAJIGCLwFAAAAkgYIwQUAAKgJkgYiBw0AANQIACBMAACnCQAgTQAApwkAILoFAAAAlAYCuwUAAACUBgi8BQAAAJQGCMEFAACmCZQGIgcNAADUCAAgTAAApwkAIE0AAKcJACC6BQAAAJQGArsFAAAAlAYIvAUAAACUBgjBBQAApgmUBiIEugUAAACUBgK7BQAAAJQGCLwFAAAAlAYIwQUAAKcJlAYiBw0AANQIACBMAACpCQAgTQAAqQkAILoFAAAAkgYCuwUAAACSBgi8BQAAAJIGCMEFAACoCZIGIgS6BQAAAJIGArsFAAAAkgYIvAUAAACSBgjBBQAAqQmSBiIPEQAArQkAIKIFAACqCQAwowUAAHcAEKQFAACqCQAwpQUBAPgIACGqBQEA-AgAIbkFQAD5CAAh2AUAAKwJlAYi2QVAAPkIACGSBgAAqwmSBiKUBhAAnQkAIZUGAQD9CAAhlgYAAIQJACCXBkAAgQkAIZgGAQD9CAAhBLoFAAAAkgYCuwUAAACSBgi8BQAAAJIGCMEFAACpCZIGIgS6BQAAAJQGArsFAAAAlAYIvAUAAACUBgjBBQAApwmUBiIkAwAAiQkAIAQAAKoKACAFAACrCgAgDAAAmwoAICAAAIIKACAkAACsCgAgJQAArQoAICgAAK4KACCiBQAAqQoAMKMFAAAHABCkBQAAqQoAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdgFAADtCaQGItkFQAD5CAAhgwYBAP0IACGrBhAAnQkAIawGAQD4CAAhrQYBAPgIACGuBgAAhAkAIK8GAQD9CAAhsAYBAP0IACGxBhAAnQkAIbIGEACdCQAhswYQAJ0JACG0BhAAnQkAIbUGAQD9CAAhtgZAAPkIACG3BkAAgQkAIbgGQACBCQAhuQZAAIEJACG6BkAAgQkAIbsGQACBCQAh_gYAAAcAIP8GAAAHACAKogUAAK4JADCjBQAAngUAEKQFAACuCQAwpQUBAMsIACG5BUAA0ggAIdgFAQDLCAAh6gUBAMwIACGZBgEAywgAIZoGAQDMCAAhmwZAANIIACEPogUAAK8JADCjBQAAiAUAEKQFAACvCQAwpQUBAMsIACGqBQEAywgAIbgFAADRCAAguQVAANIIACHYBQAAsAmjBiLZBUAA0ggAIZwGAQDLCAAhnQYBAMsIACGeBgEAzAgAIZ8GAQDMCAAhoAZAAM8IACGhBkAAzwgAIQcNAADUCAAgTAAAsgkAIE0AALIJACC6BQAAAKMGArsFAAAAowYIvAUAAACjBgjBBQAAsQmjBiIHDQAA1AgAIEwAALIJACBNAACyCQAgugUAAACjBgK7BQAAAKMGCLwFAAAAowYIwQUAALEJowYiBLoFAAAAowYCuwUAAACjBgi8BQAAAKMGCMEFAACyCaMGIgmiBQAAswkAMKMFAADyBAAQpAUAALMJADClBQEAywgAIaoFAQDLCAAhuQVAANIIACHYBQAAtAmkBiKBBgEAzAgAIaQGAQDMCAAhBw0AANQIACBMAAC2CQAgTQAAtgkAILoFAAAApAYCuwUAAACkBgi8BQAAAKQGCMEFAAC1CaQGIgcNAADUCAAgTAAAtgkAIE0AALYJACC6BQAAAKQGArsFAAAApAYIvAUAAACkBgjBBQAAtQmkBiIEugUAAACkBgK7BQAAAKQGCLwFAAAApAYIwQUAALYJpAYiEKIFAAC3CQAwowUAANwEABCkBQAAtwkAMKUFAQDLCAAhqgUBAMsIACGrBQEAywgAIbkFQADSCAAh9wUBAMsIACH8BQIA0AgAIaUGAQDLCAAhpgYBAMsIACGnBgEAzAgAIagGAAC4CQAgqQYQAJMJACGqBhAAkwkAIasGEACTCQAhDw0AANQIACBMAAC5CQAgTQAAuQkAILoFgAAAAAG9BYAAAAABvgWAAAAAAb8FgAAAAAHABYAAAAABwQWAAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFgAAAAAHGBYAAAAABxwWAAAAAAQy6BYAAAAABvQWAAAAAAb4FgAAAAAG_BYAAAAABwAWAAAAAAcEFgAAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBYAAAAABxgWAAAAAAccFgAAAAAEaogUAALoJADCjBQAAxgQAEKQFAAC6CQAwpQUBAMsIACGoBQEAywgAIbkFQADSCAAh2AUAALQJpAYi2QVAANIIACGDBgEAzAgAIasGEACTCQAhrAYBAMsIACGtBgEAywgAIa4GAADRCAAgrwYBAMwIACGwBgEAzAgAIbEGEACTCQAhsgYQAJMJACGzBhAAkwkAIbQGEACTCQAhtQYBAMwIACG2BkAA0ggAIbcGQADPCAAhuAZAAM8IACG5BkAAzwgAIboGQADPCAAhuwZAAM8IACEJogUAALsJADCjBQAArgQAEKQFAAC7CQAwpQUBAMsIACG5BUAA0ggAIdkFQADSCAAh9wUBAMsIACH8BQIA0AgAIbwGAQDLCAAhB6IFAAC8CQAwowUAAJgEABCkBQAAvAkAMKUFAQDLCAAhqAUBAMsIACG5BUAA0ggAIdkFQADSCAAhCQMAAIkJACAMAAC-CQAgogUAAL0JADCjBQAAmAEAEKQFAAC9CQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACED5wUAACcAIOgFAAAnACDpBQAAJwAgEqIFAAC_CQAwowUAAIAEABCkBQAAvwkAMKUFAQDLCAAhqAUBAMsIACGrBQEAywgAIbkFQADSCAAh2QVAANIIACHhBSAAzggAIesFAQDMCAAhvQYCANAIACG-BgEAzAgAIb8GIADOCAAhwAYCANAIACHBBgIA0AgAIcIGAQDMCAAhwwZAAM8IACHEBgEAzAgAIQ-iBQAAwAkAMKMFAADoAwAQpAUAAMAJADClBQEAywgAIasFAQDMCAAhuQVAANIIACHZBUAA0ggAIeQFAQDMCAAh9wUBAMwIACHFBgEAywgAIcYGAQDMCAAhxwYBAMwIACHIBgIA0AgAIckGIADOCAAhygYBAMwIACEOogUAAMEJADCjBQAAygMAEKQFAADBCQAwpQUBAMsIACG5BUAA0ggAIdkFQADSCAAhjwYgAM4IACHLBgEAywgAIcwGAQDLCAAhzQYBAMwIACHOBhAAkwkAIc8GEACUCQAh0AYQAJQJACHRBgIA0AgAIQmiBQAAwgkAMKMFAAC0AwAQpAUAAMIJADClBQEAywgAIasFAQDLCAAhuQVAANIIACHZBUAA0ggAIesFAQDLCAAhjwYgAM4IACEbogUAAMMJADCjBQAAngMAEKQFAADDCQAwpQUBAMsIACG4BQAA0QgAILkFQADSCAAh2QVAANIIACHkBQEAzAgAIeYFAQDLCAAh6gUBAMwIACHrBQEAywgAIfIFAQDMCAAh8wUBAMwIACH0BQEAzAgAIY8GIADOCAAhzAYBAMwIACHNBgEAzAgAIc4GEACUCQAhzwYQAJQJACHQBhAAlAkAIdEGAgDlCAAh0gYBAMwIACHTBgEAzAgAIdQGAgDQCAAh1QYgAM4IACHWBiAAzggAIdcGIADOCAAhBqIFAADECQAwowUAAIYDABCkBQAAxAkAMKsFAQDLCAAhuQVAANIIACHjBQEAywgAIQiiBQAAxQkAMKMFAADwAgAQpAUAAMUJADClBQEAywgAIbkFQADSCAAh2QVAANIIACHlBQEAywgAIeYFAQDLCAAhCQgAAMcJACCiBQAAxgkAMKMFAADdAgAQpAUAAMYJADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHlBQEA-AgAIeYFAQD4CAAhA-cFAABXACDoBQAAVwAg6QUAAFcAIBCiBQAAyAkAMKMFAADXAgAQpAUAAMgJADClBQEAywgAIbkFQADSCAAh2QVAANIIACHiBQEAzAgAIeUFAQDLCAAh5gUBAMsIACHqBQEAzAgAIfIFAQDMCAAh8wUBAMwIACH0BQEAzAgAIY8GIADOCAAhyAYCANAIACHYBgEAzAgAIRCiBQAAyQkAMKMFAAC_AgAQpAUAAMkJADClBQEAywgAIagFAQDLCAAhuQVAANIIACHZBUAA0ggAIdkGAQDMCAAh2gYBAMwIACHbBgEAzAgAIdwGAQDLCAAh3QYBAMsIACHeBgEAzAgAId8GAQDMCAAh4AYBAMsIACHhBiAAzggAIQiiBQAAygkAMKMFAACpAgAQpAUAAMoJADClBQEAywgAIagFAQDLCAAhuQVAANIIACHZBUAA0ggAIeIGAQDLCAAhCQMAAIkJACCiBQAAywkAMKMFAACUAQAQpAUAAMsJADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeIGAQD4CAAhD6IFAADMCQAwowUAAJECABCkBQAAzAkAMKUFAQDLCAAhqAUBAMsIACG5BUAA0ggAIdkFQADSCAAh4wYBAMsIACHkBgEAywgAIeUGAQDMCAAh5gYBAMwIACHnBkAAzwgAIegGAQDMCAAh6QYBAMwIACHqBgEAzAgAIQuiBQAAzQkAMKMFAAD7AQAQpAUAAM0JADClBQEAywgAIagFAQDLCAAhrwUBAMwIACGwBQEAzAgAIbkFQADSCAAh2QVAANIIACHnBkAA0ggAIesGAQDLCAAhEqIFAADOCQAwowUAAOUBABCkBQAAzgkAMKUFAQDLCAAhsAUBAMwIACG4BQAA0QgAILkFQADSCAAh2AUAAM8J8AYi2QVAANIIACHlBQEAzAgAIdgGAQDMCAAh2wYBAMwIACHsBgEAywgAIe0GIADOCAAh7gYAAOkI1AUi8AZAAM8IACHxBgEAzAgAIfIGAQDMCAAhBw0AANQIACBMAADRCQAgTQAA0QkAILoFAAAA8AYCuwUAAADwBgi8BQAAAPAGCMEFAADQCfAGIgcNAADUCAAgTAAA0QkAIE0AANEJACC6BQAAAPAGArsFAAAA8AYIvAUAAADwBgjBBQAA0AnwBiIEugUAAADwBgK7BQAAAPAGCLwFAAAA8AYIwQUAANEJ8AYiAt4FAQAAAAHjBQEAAAABBx0AANUJACA1AADUCQAgogUAANMJADCjBQAAtQEAEKQFAADTCQAw3gUBAPgIACHjBQEA-AgAIRkeAAD6CAAgIgAA_ggAIDcAAIUJACCiBQAAgAkAMKMFAADEBgAQpAUAAIAJADClBQEA-AgAIbgFAACECQAguQVAAPkIACHVBQEA-AgAIdkFQAD5CAAh5gUBAPgIACHrBQEA-AgAIewFAQD9CAAh7QUBAP0IACHuBQEA_QgAIe8FQACBCQAh8AUgAIIJACHxBQIAgwkAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIfUFIACCCQAh_gYAAMQGACD_BgAAxAYAIAs2AAD6CAAgogUAAPcIADCjBQAA9gYAEKQFAAD3CAAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh5QUBAPgIACHmBQEA-AgAIf4GAAD2BgAg_wYAAPYGACAC3gUBAAAAAeQFAQAAAAEHGAAA2AkAIDUAANQJACCiBQAA1wkAMKMFAACvAQAQpAUAANcJADDeBQEA-AgAIeQFAQD4CAAhDDYAAP4IACCiBQAA_AgAMKMFAADdBgAQpAUAAPwIADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHlBQEA-AgAIeYFAQD4CAAh6gUBAP0IACH-BgAA3QYAIP8GAADdBgAgEQMAANoJACAGAADbCQAgNQAA1AkAIDgAAIUJACCiBQAA2QkAMKMFAACrAQAQpAUAANkJADClBQEA-AgAIagFAQD9CAAhuQVAAPkIACHVBQEA-AgAIdkFQAD5CAAh3gUBAPgIACHfBQEA_QgAIeAFAQD9CAAh4QUgAIIJACHiBQEA_QgAISMOAAD-CQAgFQAAgwoAIBwAAP0JACAfAACACgAgIAAAggoAICMAAKIJACApAAD5CQAgKgAA-gkAICsAAPsJACAsAAD8CQAgMQAA3wkAIDIAAP8JACAzAAD9CQAgNAAAgQoAIDkAAIUJACCiBQAA9wkAMKMFAABVABCkBQAA9wkAMKUFAQD4CAAhsAUBAP0IACG4BQAAhAkAILkFQAD5CAAh2AUAAPgJ8AYi2QVAAPkIACHlBQEA_QgAIdgGAQD9CAAh2wYBAP0IACHsBgEA-AgAIe0GIACCCQAh7gYAAOEJ1AUi8AZAAIEJACHxBgEA_QgAIfIGAQD9CAAh_gYAAFUAIP8GAABVACATAwAA2gkAIAYAANsJACA1AADUCQAgOAAAhQkAIKIFAADZCQAwowUAAKsBABCkBQAA2QkAMKUFAQD4CAAhqAUBAP0IACG5BUAA-QgAIdUFAQD4CAAh2QVAAPkIACHeBQEA-AgAId8FAQD9CAAh4AUBAP0IACHhBSAAggkAIeIFAQD9CAAh_gYAAKsBACD_BgAAqwEAIAsDAADaCQAgogUAANwJADCjBQAApgEAEKQFAADcCQAwpQUBAPgIACGoBQEA_QgAIakFAQD9CAAhuQVAAPkIACHLBQEA-AgAIcwFAgCfCQAhzQUAAIQJACAMLQAAiQkAIC4AAN8JACCiBQAA3QkAMKMFAACgAQAQpAUAAN0JADClBQEA-AgAIbkFQAD5CAAh2AUAAN4J3QUi2QVAAPkIACHaBQEA-AgAIdsFAQD4CAAh3QUBAP0IACEEugUAAADdBQK7BQAAAN0FCLwFAAAA3QUIwQUAAPII3QUiA-cFAACaAQAg6AUAAJoBACDpBQAAmgEAIA4vAADjCQAgMAAAiQkAIKIFAADgCQAwowUAAJoBABCkBQAA4AkAMKUFAQD4CAAhuQVAAPkIACHRBQEA-AgAIdIFAQD4CAAh1AUAAOEJ1AUi1QUBAPgIACHWBQAAhAkAINgFAADiCdgFItkFQAD5CAAhBLoFAAAA1AUCuwUAAADUBQi8BQAAANQFCMEFAADuCNQFIgS6BQAAANgFArsFAAAA2AUIvAUAAADYBQjBBQAA7AjYBSIOLQAAiQkAIC4AAN8JACCiBQAA3QkAMKMFAACgAQAQpAUAAN0JADClBQEA-AgAIbkFQAD5CAAh2AUAAN4J3QUi2QVAAPkIACHaBQEA-AgAIdsFAQD4CAAh3QUBAP0IACH-BgAAoAEAIP8GAACgAQAgAuMGAQAAAAHkBgEAAAABEAMAAIkJACCiBQAA5QkAMKMFAACQAQAQpAUAAOUJADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeMGAQD4CAAh5AYBAPgIACHlBgEA_QgAIeYGAQD9CAAh5wZAAIEJACHoBgEA_QgAIekGAQD9CAAh6gYBAP0IACEMAwAAiQkAIKIFAADmCQAwowUAAIwBABCkBQAA5gkAMKUFAQD4CAAhqAUBAPgIACGvBQEA_QgAIbAFAQD9CAAhuQVAAPkIACHZBUAA-QgAIecGQAD5CAAh6wYBAPgIACELJgAA6AkAIKIFAADnCQAwowUAAIEBABCkBQAA5wkAMKUFAQD4CAAhuQVAAPkIACHYBQEA-AgAIeoFAQD9CAAhmQYBAPgIACGaBgEA_QgAIZsGQAD5CAAhExEAAK0JACAnAADrCQAgogUAAOkJADCjBQAAfQAQpAUAAOkJADClBQEA-AgAIaoFAQD4CAAhuAUAAIQJACC5BUAA-QgAIdgFAADqCaMGItkFQAD5CAAhnAYBAPgIACGdBgEA-AgAIZ4GAQD9CAAhnwYBAP0IACGgBkAAgQkAIaEGQACBCQAh_gYAAH0AIP8GAAB9ACAREQAArQkAICcAAOsJACCiBQAA6QkAMKMFAAB9ABCkBQAA6QkAMKUFAQD4CAAhqgUBAPgIACG4BQAAhAkAILkFQAD5CAAh2AUAAOoJowYi2QVAAPkIACGcBgEA-AgAIZ0GAQD4CAAhngYBAP0IACGfBgEA_QgAIaAGQACBCQAhoQZAAIEJACEEugUAAACjBgK7BQAAAKMGCLwFAAAAowYIwQUAALIJowYiA-cFAACBAQAg6AUAAIEBACDpBQAAgQEAIAoRAACtCQAgogUAAOwJADCjBQAAeQAQpAUAAOwJADClBQEA-AgAIaoFAQD4CAAhuQVAAPkIACHYBQAA7QmkBiKBBgEA_QgAIaQGAQD9CAAhBLoFAAAApAYCuwUAAACkBgi8BQAAAKQGCMEFAAC2CaQGIhsDAADaCQAgCQAA8QkAIBEAAPAJACCiBQAA7gkAMKMFAABiABCkBQAA7gkAMKUFAQD4CAAhpgUBAPgIACGnBQEA_QgAIagFAQD9CAAhqQUBAP0IACGqBQEA_QgAIasFAQD9CAAhrAUIAO8JACGtBQEA_QgAIa4FAQD9CAAhrwUBAP0IACGwBQEA_QgAIbEFIACCCQAhsgUgAIIJACGzBUAAgQkAIbQFQACBCQAhtQUCAIMJACG2BUAAgQkAIbcFAQD9CAAhuAUAAIQJACC5BUAA-QgAIQi6BQgAAAABuwUIAAAABbwFCAAAAAW9BQgAAAABvgUIAAAAAb8FCAAAAAHABQgAAAABwQUIAN8IACEkAwAAiQkAIAQAAKoKACAFAACrCgAgDAAAmwoAICAAAIIKACAkAACsCgAgJQAArQoAICgAAK4KACCiBQAAqQoAMKMFAAAHABCkBQAAqQoAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdgFAADtCaQGItkFQAD5CAAhgwYBAP0IACGrBhAAnQkAIawGAQD4CAAhrQYBAPgIACGuBgAAhAkAIK8GAQD9CAAhsAYBAP0IACGxBhAAnQkAIbIGEACdCQAhswYQAJ0JACG0BhAAnQkAIbUGAQD9CAAhtgZAAPkIACG3BkAAgQkAIbgGQACBCQAhuQZAAIEJACG6BkAAgQkAIbsGQACBCQAh_gYAAAcAIP8GAAAHACAlCgAAhwoAIBgAAKAKACAaAACiCgAgHAAA_QkAIB4AAMcJACAfAACACgAgIAAAggoAICEAAKAJACCiBQAAoQoAMKMFAAAXABCkBQAAoQoAMKUFAQD4CAAhuAUAAIQJACC5BUAA-QgAIdkFQAD5CAAh5AUBAP0IACHmBQEA-AgAIeoFAQD9CAAh6wUBAPgIACHyBQEA_QgAIfMFAQD9CAAh9AUBAP0IACGPBiAAggkAIcwGAQD9CAAhzQYBAP0IACHOBhAAngkAIc8GEACeCQAh0AYQAJ4JACHRBgIAnwkAIdIGAQD9CAAh0wYBAP0IACHUBgIAgwkAIdUGIACCCQAh1gYgAIIJACHXBiAAggkAIf4GAAAXACD_BgAAFwAgDQMAANoJACAJAADzCQAgogUAAPIJADCjBQAAXQAQpAUAAPIJADClBQEA-AgAIagFAQD9CAAhqQUBAP0IACGrBQEA-AgAIbAFAQD9CAAhzgUBAP0IACHPBQEA_QgAIdAFQAD5CAAhJQoAAIcKACAYAACgCgAgGgAAogoAIBwAAP0JACAeAADHCQAgHwAAgAoAICAAAIIKACAhAACgCQAgogUAAKEKADCjBQAAFwAQpAUAAKEKADClBQEA-AgAIbgFAACECQAguQVAAPkIACHZBUAA-QgAIeQFAQD9CAAh5gUBAPgIACHqBQEA_QgAIesFAQD4CAAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAhjwYgAIIJACHMBgEA_QgAIc0GAQD9CAAhzgYQAJ4JACHPBhAAngkAIdAGEACeCQAh0QYCAJ8JACHSBgEA_QgAIdMGAQD9CAAh1AYCAIMJACHVBiAAggkAIdYGIACCCQAh1wYgAIIJACH-BgAAFwAg_wYAABcAIAKrBQEAAAAB4wUBAAAAAQgJAADzCQAgHQAA9gkAIKIFAAD1CQAwowUAAFcAEKQFAAD1CQAwqwUBAPgIACG5BUAA-QgAIeMFAQD4CAAhCwgAAMcJACCiBQAAxgkAMKMFAADdAgAQpAUAAMYJADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHlBQEA-AgAIeYFAQD4CAAh_gYAAN0CACD_BgAA3QIAICEOAAD-CQAgFQAAgwoAIBwAAP0JACAfAACACgAgIAAAggoAICMAAKIJACApAAD5CQAgKgAA-gkAICsAAPsJACAsAAD8CQAgMQAA3wkAIDIAAP8JACAzAAD9CQAgNAAAgQoAIDkAAIUJACCiBQAA9wkAMKMFAABVABCkBQAA9wkAMKUFAQD4CAAhsAUBAP0IACG4BQAAhAkAILkFQAD5CAAh2AUAAPgJ8AYi2QVAAPkIACHlBQEA_QgAIdgGAQD9CAAh2wYBAP0IACHsBgEA-AgAIe0GIACCCQAh7gYAAOEJ1AUi8AZAAIEJACHxBgEA_QgAIfIGAQD9CAAhBLoFAAAA8AYCuwUAAADwBgi8BQAAAPAGCMEFAADRCfAGIgPnBQAAAwAg6AUAAAMAIOkFAAADACAD5wUAAIwBACDoBQAAjAEAIOkFAACMAQAgA-cFAACQAQAg6AUAAJABACDpBQAAkAEAIAsDAACJCQAgogUAAMsJADCjBQAAlAEAEKQFAADLCQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHiBgEA-AgAIf4GAACUAQAg_wYAAJQBACAD5wUAAFEAIOgFAABRACDpBQAAUQAgCwMAAIkJACAMAAC-CQAgogUAAL0JADCjBQAAmAEAEKQFAAC9CQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACH-BgAAmAEAIP8GAACYAQAgA-cFAACgAQAg6AUAAKABACDpBQAAoAEAIAPnBQAAXQAg6AUAAF0AIOkFAABdACAD5wUAAKYBACDoBQAApgEAIOkFAACmAQAgA-cFAABiACDoBQAAYgAg6QUAAGIAIA4DAACJCQAgDAAAigkAIKIFAACICQAwowUAAMQBABCkBQAAiAkAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdkFQAD5CAAh5QUBAPgIACH4BSAAggkAIfkFAQD9CAAh_gYAAMQBACD_BgAAxAEAIAKoBQEAAAABqwUBAAAAARUDAACJCQAgCQAA8wkAIBsAANoJACCiBQAAhQoAMKMFAABRABCkBQAAhQoAMKUFAQD4CAAhqAUBAPgIACGrBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHhBSAAggkAIesFAQD9CAAhvQYCAIMJACG-BgEA_QgAIb8GIACCCQAhwAYCAIMJACHBBgIAgwkAIcIGAQD9CAAhwwZAAIEJACHEBgEA_QgAIQwJAADzCQAgCgAAhwoAIBcAAIgKACCiBQAAhgoAMKMFAAAgABCkBQAAhgoAMKUFAQD4CAAhqwUBAPgIACG5BUAA-QgAIdkFQAD5CAAh6wUBAPgIACGPBiAAggkAIQPnBQAAGwAg6AUAABsAIOkFAAAbACAD5wUAACMAIOgFAAAjACDpBQAAIwAgAuQFAQAAAAGDBgEAAAABBwUAAIsKACAYAACMCgAgogUAAIoKADCjBQAARQAQpAUAAIoKADDkBQEA-AgAIYMGAQD4CAAhGAgAAKAJACAiAAChCQAgIwAAogkAIKIFAACbCQAwowUAAAsAEKQFAACbCQAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh6gUBAP0IACGEBgEA-AgAIYYGAACcCYYGIocGEACdCQAhiAYQAJ4JACGJBhAAngkAIYoGAgCfCQAhiwYCAIMJACGMBgIAnwkAIY0GQAD5CAAhjgZAAPkIACGPBiAAggkAIZAGIACCCQAh_gYAAAsAIP8GAAALACAXBgAAoAoAIAcAAKUKACAIAACmCgAgCgAAhwoAIBkAAKEJACCiBQAApAoAMKMFAAARABCkBQAApAoAMKUFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeIFAQD9CAAh5QUBAPgIACHmBQEA-AgAIeoFAQD9CAAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAhjwYgAIIJACHIBgIAgwkAIdgGAQD9CAAh_gYAABEAIP8GAAARACAC9gUBAAAAAfcFAQAAAAEJDwAAkAoAIBUAAI8KACCiBQAAjgoAMKMFAAA2ABCkBQAAjgoAMKUFAQD4CAAhuQVAAPkIACH2BQEA-AgAIfcFAQD4CAAhDgMAAIkJACAMAACKCQAgogUAAIgJADCjBQAAxAEAEKQFAACICQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHlBQEA-AgAIfgFIACCCQAh-QUBAP0IACH-BgAAxAEAIP8GAADEAQAgFgoAAIcKACALAACaCgAgEAAAvgkAIBIAAJsKACAUAACcCgAgFgAAigkAIKIFAACZCgAwowUAACMAEKQFAACZCgAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAhjwYgAIIJACHLBgEA-AgAIcwGAQD4CAAhzQYBAP0IACHOBhAAnQkAIc8GEACeCQAh0AYQAJ4JACHRBgIAgwkAIf4GAAAjACD_BgAAIwAgDxMAAJAKACCiBQAAkQoAMKMFAAAyABCkBQAAkQoAMKUFAQD4CAAhuQVAAPkIACH3BQEA-AgAIfsFAACSCvsFIvwFAgCDCQAh_QUCAIMJACH-BQIAgwkAIf8FAQD9CAAhgAYBAP0IACGBBgEA_QgAIYIGAQD9CAAhBLoFAAAA-wUCuwUAAAD7BQi8BQAAAPsFCMEFAACOCfsFIhIPAACQCgAgEQAArQkAIKIFAACTCgAwowUAAC0AEKQFAACTCgAwpQUBAPgIACGqBQEA-AgAIasFAQD4CAAhuQVAAPkIACH3BQEA-AgAIfwFAgCDCQAhpQYBAPgIACGmBgEA-AgAIacGAQD9CAAhqAYAAJQKACCpBhAAnQkAIaoGEACdCQAhqwYQAJ0JACEMugWAAAAAAb0FgAAAAAG-BYAAAAABvwWAAAAAAcAFgAAAAAHBBYAAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQWAAAAAAcYFgAAAAAHHBYAAAAABAvcFAQAAAAG8BgEAAAABCw4AAJcKACAPAACQCgAgogUAAJYKADCjBQAAJwAQpAUAAJYKADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACH3BQEA-AgAIfwFAgCDCQAhvAYBAPgIACELAwAAiQkAIAwAAL4JACCiBQAAvQkAMKMFAACYAQAQpAUAAL0JADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIf4GAACYAQAg_wYAAJgBACACywYBAAAAAcwGAQAAAAEUCgAAhwoAIAsAAJoKACAQAAC-CQAgEgAAmwoAIBQAAJwKACAWAACKCQAgogUAAJkKADCjBQAAIwAQpAUAAJkKADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACGPBiAAggkAIcsGAQD4CAAhzAYBAPgIACHNBgEA_QgAIc4GEACdCQAhzwYQAJ4JACHQBhAAngkAIdEGAgCDCQAhDgkAAPMJACAKAACHCgAgFwAAiAoAIKIFAACGCgAwowUAACAAEKQFAACGCgAwpQUBAPgIACGrBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHrBQEA-AgAIY8GIACCCQAh_gYAACAAIP8GAAAgACAD5wUAAC0AIOgFAAAtACDpBQAALQAgA-cFAAAyACDoBQAAMgAg6QUAADIAIBMJAADxCQAgCwAAngoAIA8AAJ8KACAYAACgCgAgogUAAJ0KADCjBQAAGwAQpAUAAJ0KADClBQEA-AgAIasFAQD9CAAhuQVAAPkIACHZBUAA-QgAIeQFAQD9CAAh9wUBAP0IACHFBgEA-AgAIcYGAQD9CAAhxwYBAP0IACHIBgIAgwkAIckGIACCCQAhygYBAP0IACEOCQAA8wkAIAoAAIcKACAXAACICgAgogUAAIYKADCjBQAAIAAQpAUAAIYKADClBQEA-AgAIasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIesFAQD4CAAhjwYgAIIJACH-BgAAIAAg_wYAACAAIBYKAACHCgAgCwAAmgoAIBAAAL4JACASAACbCgAgFAAAnAoAIBYAAIoJACCiBQAAmQoAMKMFAAAjABCkBQAAmQoAMKUFAQD4CAAhuQVAAPkIACHZBUAA-QgAIY8GIACCCQAhywYBAPgIACHMBgEA-AgAIc0GAQD9CAAhzgYQAJ0JACHPBhAAngkAIdAGEACeCQAh0QYCAIMJACH-BgAAIwAg_wYAACMAIBcGAACgCgAgBwAApQoAIAgAAKYKACAKAACHCgAgGQAAoQkAIKIFAACkCgAwowUAABEAEKQFAACkCgAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4gUBAP0IACHlBQEA-AgAIeYFAQD4CAAh6gUBAP0IACHyBQEA_QgAIfMFAQD9CAAh9AUBAP0IACGPBiAAggkAIcgGAgCDCQAh2AYBAP0IACH-BgAAEQAg_wYAABEAICMKAACHCgAgGAAAoAoAIBoAAKIKACAcAAD9CQAgHgAAxwkAIB8AAIAKACAgAACCCgAgIQAAoAkAIKIFAAChCgAwowUAABcAEKQFAAChCgAwpQUBAPgIACG4BQAAhAkAILkFQAD5CAAh2QVAAPkIACHkBQEA_QgAIeYFAQD4CAAh6gUBAP0IACHrBQEA-AgAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIY8GIACCCQAhzAYBAP0IACHNBgEA_QgAIc4GEACeCQAhzwYQAJ4JACHQBhAAngkAIdEGAgCfCQAh0gYBAP0IACHTBgEA_QgAIdQGAgCDCQAh1QYgAIIJACHWBiAAggkAIdcGIACCCQAhA-cFAAAgACDoBQAAIAAg6QUAACAAIALiBQEAAAAB5QUBAAAAARUGAACgCgAgBwAApQoAIAgAAKYKACAKAACHCgAgGQAAoQkAIKIFAACkCgAwowUAABEAEKQFAACkCgAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4gUBAP0IACHlBQEA-AgAIeYFAQD4CAAh6gUBAP0IACHyBQEA_QgAIfMFAQD9CAAh9AUBAP0IACGPBiAAggkAIcgGAgCDCQAh2AYBAP0IACED5wUAABEAIOgFAAARACDpBQAAEQAgA-cFAAAXACDoBQAAFwAg6QUAABcAIAKrBQEAAAABgwYBAAAAAQcFAACLCgAgCQAA8wkAIKIFAACoCgAwowUAAA0AEKQFAACoCgAwqwUBAPgIACGDBgEA-AgAISIDAACJCQAgBAAAqgoAIAUAAKsKACAMAACbCgAgIAAAggoAICQAAKwKACAlAACtCgAgKAAArgoAIKIFAACpCgAwowUAAAcAEKQFAACpCgAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2AUAAO0JpAYi2QVAAPkIACGDBgEA_QgAIasGEACdCQAhrAYBAPgIACGtBgEA-AgAIa4GAACECQAgrwYBAP0IACGwBgEA_QgAIbEGEACdCQAhsgYQAJ0JACGzBhAAnQkAIbQGEACdCQAhtQYBAP0IACG2BkAA-QgAIbcGQACBCQAhuAZAAIEJACG5BkAAgQkAIboGQACBCQAhuwZAAIEJACEUAwAAiQkAICMAAKIJACCiBQAArwoAMKMFAAADABCkBQAArwoAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdkFQAD5CAAh2QYBAP0IACHaBgEA_QgAIdsGAQD9CAAh3AYBAPgIACHdBgEA-AgAId4GAQD9CAAh3wYBAP0IACHgBgEA-AgAIeEGIACCCQAh_gYAAAMAIP8GAAADACAYCAAAoAkAICIAAKEJACAjAACiCQAgogUAAJsJADCjBQAACwAQpAUAAJsJADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHqBQEA_QgAIYQGAQD4CAAhhgYAAJwJhgYihwYQAJ0JACGIBhAAngkAIYkGEACeCQAhigYCAJ8JACGLBgIAgwkAIYwGAgCfCQAhjQZAAPkIACGOBkAA-QgAIY8GIACCCQAhkAYgAIIJACH-BgAACwAg_wYAAAsAIBERAACtCQAgogUAAKoJADCjBQAAdwAQpAUAAKoJADClBQEA-AgAIaoFAQD4CAAhuQVAAPkIACHYBQAArAmUBiLZBUAA-QgAIZIGAACrCZIGIpQGEACdCQAhlQYBAP0IACGWBgAAhAkAIJcGQACBCQAhmAYBAP0IACH-BgAAdwAg_wYAAHcAIAPnBQAAeQAg6AUAAHkAIOkFAAB5ACAD5wUAAH0AIOgFAAB9ACDpBQAAfQAgEgMAAIkJACAjAACiCQAgogUAAK8KADCjBQAAAwAQpAUAAK8KADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIdkGAQD9CAAh2gYBAP0IACHbBgEA_QgAIdwGAQD4CAAh3QYBAPgIACHeBgEA_QgAId8GAQD9CAAh4AYBAPgIACHhBiAAggkAIQAAAAAAAAGDBwEAAAABAYMHAQAAAAEFgwcIAAAAAYkHCAAAAAGKBwgAAAABiwcIAAAAAYwHCAAAAAEBgwcgAAAAAQGDB0AAAAABBYMHAgAAAAGJBwIAAAABigcCAAAAAYsHAgAAAAGMBwIAAAABAYMHQAAAAAEHRgAAphQAIEcAAK8UACCABwAApxQAIIEHAACuFAAghAcAAFUAIIUHAABVACCGBwAAAQAgB0YAAKQUACBHAACsFAAggAcAAKUUACCBBwAAqxQAIIQHAAAHACCFBwAABwAghgcAAAkAIAdGAACiFAAgRwAAqRQAIIAHAACjFAAggQcAAKgUACCEBwAAFwAghQcAABcAIIYHAAAZACADRgAAphQAIIAHAACnFAAghgcAAAEAIANGAACkFAAggAcAAKUUACCGBwAACQAgA0YAAKIUACCABwAAoxQAIIYHAAAZACAAAAAAAAWDBwIAAAABiQcCAAAAAYoHAgAAAAGLBwIAAAABjAcCAAAAAQdGAACdFAAgRwAAoBQAIIAHAACeFAAggQcAAJ8UACCEBwAAVQAghQcAAFUAIIYHAAABACADRgAAnRQAIIAHAACeFAAghgcAAAEAIAAAAAVGAACVFAAgRwAAmxQAIIAHAACWFAAggQcAAJoUACCGBwAAGQAgB0YAAJMUACBHAACYFAAggAcAAJQUACCBBwAAlxQAIIQHAABVACCFBwAAVQAghgcAAAEAIANGAACVFAAggAcAAJYUACCGBwAAGQAgA0YAAJMUACCABwAAlBQAIIYHAAABACAAAAABgwcAAADUBQIBgwcAAADYBQIFRgAAixQAIEcAAJEUACCABwAAjBQAIIEHAACQFAAghgcAAKIBACAFRgAAiRQAIEcAAI4UACCABwAAihQAIIEHAACNFAAghgcAAAEAIANGAACLFAAggAcAAIwUACCGBwAAogEAIANGAACJFAAggAcAAIoUACCGBwAAAQAgAAAAAYMHAAAA3QUCBUYAAIMUACBHAACHFAAggAcAAIQUACCBBwAAhhQAIIYHAAABACALRgAA4QoAMEcAAOYKADCABwAA4goAMIEHAADjCgAwggcAAOQKACCDBwAA5QoAMIQHAADlCgAwhQcAAOUKADCGBwAA5QoAMIcHAADnCgAwiAcAAOgKADAJMAAA2goAIKUFAQAAAAG5BUAAAAAB0gUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAECAAAAnAEAIEYAAOwKACADAAAAnAEAIEYAAOwKACBHAADrCgAgAT8AAIUUADAOLwAA4wkAIDAAAIkJACCiBQAA4AkAMKMFAACaAQAQpAUAAOAJADClBQEAAAABuQVAAPkIACHRBQEA-AgAIdIFAQD4CAAh1AUAAOEJ1AUi1QUBAPgIACHWBQAAhAkAINgFAADiCdgFItkFQAD5CAAhAgAAAJwBACA_AADrCgAgAgAAAOkKACA_AADqCgAgDKIFAADoCgAwowUAAOkKABCkBQAA6AoAMKUFAQD4CAAhuQVAAPkIACHRBQEA-AgAIdIFAQD4CAAh1AUAAOEJ1AUi1QUBAPgIACHWBQAAhAkAINgFAADiCdgFItkFQAD5CAAhDKIFAADoCgAwowUAAOkKABCkBQAA6AoAMKUFAQD4CAAhuQVAAPkIACHRBQEA-AgAIdIFAQD4CAAh1AUAAOEJ1AUi1QUBAPgIACHWBQAAhAkAINgFAADiCdgFItkFQAD5CAAhCKUFAQC2CgAhuQVAALwKACHSBQEAtgoAIdQFAADVCtQFItUFAQC2CgAh1gWAAAAAAdgFAADWCtgFItkFQAC8CgAhCTAAANgKACClBQEAtgoAIbkFQAC8CgAh0gUBALYKACHUBQAA1QrUBSLVBQEAtgoAIdYFgAAAAAHYBQAA1grYBSLZBUAAvAoAIQkwAADaCgAgpQUBAAAAAbkFQAAAAAHSBQEAAAAB1AUAAADUBQLVBQEAAAAB1gWAAAAAAdgFAAAA2AUC2QVAAAAAAQNGAACDFAAggAcAAIQUACCGBwAAAQAgBEYAAOEKADCABwAA4goAMIIHAADkCgAghgcAAOUKADAAAAAFRgAA9xMAIEcAAIEUACCABwAA-BMAIIEHAACAFAAghgcAAMEGACAHRgAA9RMAIEcAAP4TACCABwAA9hMAIIEHAAD9EwAghAcAAFUAIIUHAABVACCGBwAAAQAgB0YAAPMTACBHAAD7EwAggAcAAPQTACCBBwAA-hMAIIQHAACrAQAghQcAAKsBACCGBwAArQEAIAtGAAD2CgAwRwAA-woAMIAHAAD3CgAwgQcAAPgKADCCBwAA-QoAIIMHAAD6CgAwhAcAAPoKADCFBwAA-goAMIYHAAD6CgAwhwcAAPwKADCIBwAA_QoAMAwDAACDCwAgNQAAggsAIDgAAIQLACClBQEAAAABqAUBAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAECAAAArQEAIEYAAIELACADAAAArQEAIEYAAIELACBHAACACwAgAT8AAPkTADARAwAA2gkAIAYAANsJACA1AADUCQAgOAAAhQkAIKIFAADZCQAwowUAAKsBABCkBQAA2QkAMKUFAQAAAAGoBQEA_QgAIbkFQAD5CAAh1QUBAPgIACHZBUAA-QgAId4FAQD4CAAh3wUBAP0IACHgBQEA_QgAIeEFIACCCQAh4gUBAP0IACECAAAArQEAID8AAIALACACAAAA_goAID8AAP8KACANogUAAP0KADCjBQAA_goAEKQFAAD9CgAwpQUBAPgIACGoBQEA_QgAIbkFQAD5CAAh1QUBAPgIACHZBUAA-QgAId4FAQD4CAAh3wUBAP0IACHgBQEA_QgAIeEFIACCCQAh4gUBAP0IACENogUAAP0KADCjBQAA_goAEKQFAAD9CgAwpQUBAPgIACGoBQEA_QgAIbkFQAD5CAAh1QUBAPgIACHZBUAA-QgAId4FAQD4CAAh3wUBAP0IACHgBQEA_QgAIeEFIACCCQAh4gUBAP0IACEJpQUBALYKACGoBQEAtwoAIbkFQAC8CgAh1QUBALYKACHZBUAAvAoAId4FAQC2CgAh3wUBALcKACHgBQEAtwoAIeEFIAC5CgAhDAMAAPMKACA1AADyCgAgOAAA9QoAIKUFAQC2CgAhqAUBALcKACG5BUAAvAoAIdUFAQC2CgAh2QVAALwKACHeBQEAtgoAId8FAQC3CgAh4AUBALcKACHhBSAAuQoAIQwDAACDCwAgNQAAggsAIDgAAIQLACClBQEAAAABqAUBAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAEDRgAA9xMAIIAHAAD4EwAghgcAAMEGACADRgAA9RMAIIAHAAD2EwAghgcAAAEAIARGAAD2CgAwgAcAAPcKADCCBwAA-QoAIIYHAAD6CgAwA0YAAPMTACCABwAA9BMAIIYHAACtAQAgAAAABUYAAOsTACBHAADxEwAggAcAAOwTACCBBwAA8BMAIIYHAADBBgAgBUYAAOkTACBHAADuEwAggAcAAOoTACCBBwAA7RMAIIYHAADzBgAgA0YAAOsTACCABwAA7BMAIIYHAADBBgAgA0YAAOkTACCABwAA6hMAIIYHAADzBgAgAAAABUYAAOETACBHAADnEwAggAcAAOITACCBBwAA5hMAIIYHAADBBgAgBUYAAN8TACBHAADkEwAggAcAAOATACCBBwAA4xMAIIYHAADaBgAgA0YAAOETACCABwAA4hMAIIYHAADBBgAgA0YAAN8TACCABwAA4BMAIIYHAADaBgAgAAAAC0YAAJgLADBHAACdCwAwgAcAAJkLADCBBwAAmgsAMIIHAACbCwAggwcAAJwLADCEBwAAnAsAMIUHAACcCwAwhgcAAJwLADCHBwAAngsAMIgHAACfCwAwAjUAAIsLACDeBQEAAAABAgAAALcBACBGAACjCwAgAwAAALcBACBGAACjCwAgRwAAogsAIAE_AADeEwAwCB0AANUJACA1AADUCQAgogUAANMJADCjBQAAtQEAEKQFAADTCQAw3gUBAPgIACHjBQEA-AgAIfMGAADSCQAgAgAAALcBACA_AACiCwAgAgAAAKALACA_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_EwAghgcAABUAIANGAAC9EwAggAcAAL4TACCGBwAAuQUAIANGAAC7EwAggAcAALwTACCGBwAAFQAgAAAABUYAALMTACBHAAC5EwAggAcAALQTACCBBwAAuBMAIIYHAAC5BQAgBUYAALETACBHAAC2EwAggAcAALITACCBBwAAtRMAIIYHAAAZACADRgAAsxMAIIAHAAC0EwAghgcAALkFACADRgAAsRMAIIAHAACyEwAghgcAABkAIAAAAAAAAYMHAAAAhgYCBYMHEAAAAAGJBxAAAAABigcQAAAAAYsHEAAAAAGMBxAAAAABBYMHEAAAAAGJBxAAAAABigcQAAAAAYsHEAAAAAGMBxAAAAABC0YAAIsNADBHAACQDQAwgAcAAIwNADCBBwAAjQ0AMIIHAACODQAggwcAAI8NADCEBwAAjw0AMIUHAACPDQAwhgcAAI8NADCHBwAAkQ0AMIgHAACSDQAwC0YAAP8MADBHAACEDQAwgAcAAIANADCBBwAAgQ0AMIIHAACCDQAggwcAAIMNADCEBwAAgw0AMIUHAACDDQAwhgcAAIMNADCHBwAAhQ0AMIgHAACGDQAwC0YAAJwMADBHAAChDAAwgAcAAJ0MADCBBwAAngwAMIIHAACfDAAggwcAAKAMADCEBwAAoAwAMIUHAACgDAAwhgcAAKAMADCHBwAAogwAMIgHAACjDAAwHQMAAPgMACAEAAD5DAAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAAD3DAAgAwAAAAkAIEYAAPcMACBHAACnDAAgAT8AALATADAiAwAAiQkAIAQAAKoKACAFAACrCgAgDAAAmwoAICAAAIIKACAkAACsCgAgJQAArQoAICgAAK4KACCiBQAAqQoAMKMFAAAHABCkBQAAqQoAMKUFAQAAAAGoBQEA-AgAIbkFQAD5CAAh2AUAAO0JpAYi2QVAAPkIACGDBgEA_QgAIasGEACdCQAhrAYBAAAAAa0GAQD4CAAhrgYAAIQJACCvBgEA_QgAIbAGAQD9CAAhsQYQAJ0JACGyBhAAnQkAIbMGEACdCQAhtAYQAJ0JACG1BgEA_QgAIbYGQAD5CAAhtwZAAIEJACG4BkAAgQkAIbkGQACBCQAhugZAAIEJACG7BkAAgQkAIQIAAAAJACA_AACnDAAgAgAAAKQMACA_AAClDAAgGqIFAACjDAAwowUAAKQMABCkBQAAowwAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdgFAADtCaQGItkFQAD5CAAhgwYBAP0IACGrBhAAnQkAIawGAQD4CAAhrQYBAPgIACGuBgAAhAkAIK8GAQD9CAAhsAYBAP0IACGxBhAAnQkAIbIGEACdCQAhswYQAJ0JACG0BhAAnQkAIbUGAQD9CAAhtgZAAPkIACG3BkAAgQkAIbgGQACBCQAhuQZAAIEJACG6BkAAgQkAIbsGQACBCQAhGqIFAACjDAAwowUAAKQMABCkBQAAowwAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdgFAADtCaQGItkFQAD5CAAhgwYBAP0IACGrBhAAnQkAIawGAQD4CAAhrQYBAPgIACGuBgAAhAkAIK8GAQD9CAAhsAYBAP0IACGxBhAAnQkAIbIGEACdCQAhswYQAJ0JACG0BhAAnQkAIbUGAQD9CAAhtgZAAPkIACG3BkAAgQkAIbgGQACBCQAhuQZAAIEJACG6BkAAgQkAIbsGQACBCQAhFqUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhqwYQAJcMACGsBgEAtgoAIa0GAQC2CgAhrgaAAAAAAa8GAQC3CgAhsAYBALcKACGxBhAAlwwAIbIGEACXDAAhswYQAJcMACG0BhAAlwwAIbUGAQC3CgAhtgZAALwKACG3BkAAugoAIbgGQAC6CgAhuQZAALoKACG6BkAAugoAIbsGQAC6CgAhAYMHAAAApAYCHQMAAKgMACAEAACpDAAgDAAAqgwAICAAAK4MACAkAACrDAAgJQAArAwAICgAAK0MACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHYBQAApgykBiLZBUAAvAoAIasGEACXDAAhrAYBALYKACGtBgEAtgoAIa4GgAAAAAGvBgEAtwoAIbAGAQC3CgAhsQYQAJcMACGyBhAAlwwAIbMGEACXDAAhtAYQAJcMACG1BgEAtwoAIbYGQAC8CgAhtwZAALoKACG4BkAAugoAIbkGQAC6CgAhugZAALoKACG7BkAAugoAIQVGAACeEwAgRwAArhMAIIAHAACfEwAggQcAAK0TACCGBwAAAQAgBUYAAJwTACBHAACrEwAggAcAAJ0TACCBBwAAqhMAIIYHAAAFACALRgAA6QwAMEcAAO4MADCABwAA6gwAMIEHAADrDAAwggcAAOwMACCDBwAA7QwAMIQHAADtDAAwhQcAAO0MADCGBwAA7QwAMIcHAADvDAAwiAcAAPAMADAHRgAA4gwAIEcAAOUMACCABwAA4wwAIIEHAADkDAAghAcAAHcAIIUHAAB3ACCGBwAAoQUAIAtGAADWDAAwRwAA2wwAMIAHAADXDAAwgQcAANgMADCCBwAA2QwAIIMHAADaDAAwhAcAANoMADCFBwAA2gwAMIYHAADaDAAwhwcAANwMADCIBwAA3QwAMAtGAAC7DAAwRwAAwAwAMIAHAAC8DAAwgQcAAL0MADCCBwAAvgwAIIMHAAC_DAAwhAcAAL8MADCFBwAAvwwAMIYHAAC_DAAwhwcAAMEMADCIBwAAwgwAMAtGAACvDAAwRwAAtAwAMIAHAACwDAAwgQcAALEMADCCBwAAsgwAIIMHAACzDAAwhAcAALMMADCFBwAAswwAMIYHAACzDAAwhwcAALUMADCIBwAAtgwAMBYDAADACgAgCQAAwgoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABAgAAAGQAIEYAALoMACADAAAAZAAgRgAAugwAIEcAALkMACABPwAAqRMAMBsDAADaCQAgCQAA8QkAIBEAAPAJACCiBQAA7gkAMKMFAABiABCkBQAA7gkAMKUFAQAAAAGmBQEA-AgAIacFAQAAAAGoBQEA_QgAIakFAQD9CAAhqgUBAP0IACGrBQEA_QgAIawFCADvCQAhrQUBAP0IACGuBQEA_QgAIa8FAQD9CAAhsAUBAP0IACGxBSAAggkAIbIFIACCCQAhswVAAIEJACG0BUAAgQkAIbUFAgCDCQAhtgVAAIEJACG3BQEA_QgAIbgFAACECQAguQVAAPkIACECAAAAZAAgPwAAuQwAIAIAAAC3DAAgPwAAuAwAIBiiBQAAtgwAMKMFAAC3DAAQpAUAALYMADClBQEA-AgAIaYFAQD4CAAhpwUBAP0IACGoBQEA_QgAIakFAQD9CAAhqgUBAP0IACGrBQEA_QgAIawFCADvCQAhrQUBAP0IACGuBQEA_QgAIa8FAQD9CAAhsAUBAP0IACGxBSAAggkAIbIFIACCCQAhswVAAIEJACG0BUAAgQkAIbUFAgCDCQAhtgVAAIEJACG3BQEA_QgAIbgFAACECQAguQVAAPkIACEYogUAALYMADCjBQAAtwwAEKQFAAC2DAAwpQUBAPgIACGmBQEA-AgAIacFAQD9CAAhqAUBAP0IACGpBQEA_QgAIaoFAQD9CAAhqwUBAP0IACGsBQgA7wkAIa0FAQD9CAAhrgUBAP0IACGvBQEA_QgAIbAFAQD9CAAhsQUgAIIJACGyBSAAggkAIbMFQACBCQAhtAVAAIEJACG1BQIAgwkAIbYFQACBCQAhtwUBAP0IACG4BQAAhAkAILkFQAD5CAAhFKUFAQC2CgAhpgUBALYKACGnBQEAtwoAIagFAQC3CgAhqQUBALcKACGrBQEAtwoAIawFCAC4CgAhrQUBALcKACGuBQEAtwoAIa8FAQC3CgAhsAUBALcKACGxBSAAuQoAIbIFIAC5CgAhswVAALoKACG0BUAAugoAIbUFAgC7CgAhtgVAALoKACG3BQEAtwoAIbgFgAAAAAG5BUAAvAoAIRYDAAC9CgAgCQAAvwoAIKUFAQC2CgAhpgUBALYKACGnBQEAtwoAIagFAQC3CgAhqQUBALcKACGrBQEAtwoAIawFCAC4CgAhrQUBALcKACGuBQEAtwoAIa8FAQC3CgAhsAUBALcKACGxBSAAuQoAIbIFIAC5CgAhswVAALoKACG0BUAAugoAIbUFAgC7CgAhtgVAALoKACG3BQEAtwoAIbgFgAAAAAG5BUAAvAoAIRYDAADACgAgCQAAwgoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABDCcAANUMACClBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAKMGAtkFQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAZAAAAAAaEGQAAAAAECAAAAfwAgRgAA1AwAIAMAAAB_ACBGAADUDAAgRwAAxgwAIAE_AACoEwAwEREAAK0JACAnAADrCQAgogUAAOkJADCjBQAAfQAQpAUAAOkJADClBQEAAAABqgUBAAAAAbgFAACECQAguQVAAPkIACHYBQAA6gmjBiLZBUAA-QgAIZwGAQD4CAAhnQYBAPgIACGeBgEA_QgAIZ8GAQD9CAAhoAZAAIEJACGhBkAAgQkAIQIAAAB_ACA_AADGDAAgAgAAAMMMACA_AADEDAAgD6IFAADCDAAwowUAAMMMABCkBQAAwgwAMKUFAQD4CAAhqgUBAPgIACG4BQAAhAkAILkFQAD5CAAh2AUAAOoJowYi2QVAAPkIACGcBgEA-AgAIZ0GAQD4CAAhngYBAP0IACGfBgEA_QgAIaAGQACBCQAhoQZAAIEJACEPogUAAMIMADCjBQAAwwwAEKQFAADCDAAwpQUBAPgIACGqBQEA-AgAIbgFAACECQAguQVAAPkIACHYBQAA6gmjBiLZBUAA-QgAIZwGAQD4CAAhnQYBAPgIACGeBgEA_QgAIZ8GAQD9CAAhoAZAAIEJACGhBkAAgQkAIQulBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdgFAADFDKMGItkFQAC8CgAhnAYBALYKACGdBgEAtgoAIZ4GAQC3CgAhnwYBALcKACGgBkAAugoAIaEGQAC6CgAhAYMHAAAAowYCDCcAAMcMACClBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdgFAADFDKMGItkFQAC8CgAhnAYBALYKACGdBgEAtgoAIZ4GAQC3CgAhnwYBALcKACGgBkAAugoAIaEGQAC6CgAhC0YAAMgMADBHAADNDAAwgAcAAMkMADCBBwAAygwAMIIHAADLDAAggwcAAMwMADCEBwAAzAwAMIUHAADMDAAwhgcAAMwMADCHBwAAzgwAMIgHAADPDAAwBqUFAQAAAAG5BUAAAAAB2AUBAAAAAeoFAQAAAAGaBgEAAAABmwZAAAAAAQIAAACDAQAgRgAA0wwAIAMAAACDAQAgRgAA0wwAIEcAANIMACABPwAApxMAMAsmAADoCQAgogUAAOcJADCjBQAAgQEAEKQFAADnCQAwpQUBAAAAAbkFQAD5CAAh2AUBAPgIACHqBQEA_QgAIZkGAQD4CAAhmgYBAP0IACGbBkAA-QgAIQIAAACDAQAgPwAA0gwAIAIAAADQDAAgPwAA0QwAIAqiBQAAzwwAMKMFAADQDAAQpAUAAM8MADClBQEA-AgAIbkFQAD5CAAh2AUBAPgIACHqBQEA_QgAIZkGAQD4CAAhmgYBAP0IACGbBkAA-QgAIQqiBQAAzwwAMKMFAADQDAAQpAUAAM8MADClBQEA-AgAIbkFQAD5CAAh2AUBAPgIACHqBQEA_QgAIZkGAQD4CAAhmgYBAP0IACGbBkAA-QgAIQalBQEAtgoAIbkFQAC8CgAh2AUBALYKACHqBQEAtwoAIZoGAQC3CgAhmwZAALwKACEGpQUBALYKACG5BUAAvAoAIdgFAQC2CgAh6gUBALcKACGaBgEAtwoAIZsGQAC8CgAhBqUFAQAAAAG5BUAAAAAB2AUBAAAAAeoFAQAAAAGaBgEAAAABmwZAAAAAAQwnAADVDAAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAACjBgLZBUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGQAAAAAGhBkAAAAABBEYAAMgMADCABwAAyQwAMIIHAADLDAAghgcAAMwMADAFpQUBAAAAAbkFQAAAAAHYBQAAAKQGAoEGAQAAAAGkBgEAAAABAgAAAHsAIEYAAOEMACADAAAAewAgRgAA4QwAIEcAAOAMACABPwAAphMAMAoRAACtCQAgogUAAOwJADCjBQAAeQAQpAUAAOwJADClBQEAAAABqgUBAPgIACG5BUAA-QgAIdgFAADtCaQGIoEGAQD9CAAhpAYBAP0IACECAAAAewAgPwAA4AwAIAIAAADeDAAgPwAA3wwAIAmiBQAA3QwAMKMFAADeDAAQpAUAAN0MADClBQEA-AgAIaoFAQD4CAAhuQVAAPkIACHYBQAA7QmkBiKBBgEA_QgAIaQGAQD9CAAhCaIFAADdDAAwowUAAN4MABCkBQAA3QwAMKUFAQD4CAAhqgUBAPgIACG5BUAA-QgAIdgFAADtCaQGIoEGAQD9CAAhpAYBAP0IACEFpQUBALYKACG5BUAAvAoAIdgFAACmDKQGIoEGAQC3CgAhpAYBALcKACEFpQUBALYKACG5BUAAvAoAIdgFAACmDKQGIoEGAQC3CgAhpAYBALcKACEFpQUBAAAAAbkFQAAAAAHYBQAAAKQGAoEGAQAAAAGkBgEAAAABCqUFAQAAAAG5BUAAAAAB2AUAAACUBgLZBUAAAAABkgYAAACSBgKUBhAAAAABlQYBAAAAAZYGgAAAAAGXBkAAAAABmAYBAAAAAQIAAAChBQAgRgAA4gwAIAMAAAB3ACBGAADiDAAgRwAA5gwAIAwAAAB3ACA_AADmDAAgpQUBALYKACG5BUAAvAoAIdgFAADoDJQGItkFQAC8CgAhkgYAAOcMkgYilAYQAJcMACGVBgEAtwoAIZYGgAAAAAGXBkAAugoAIZgGAQC3CgAhCqUFAQC2CgAhuQVAALwKACHYBQAA6AyUBiLZBUAAvAoAIZIGAADnDJIGIpQGEACXDAAhlQYBALcKACGWBoAAAAABlwZAALoKACGYBgEAtwoAIQGDBwAAAJIGAgGDBwAAAJQGAg0PAAD2DAAgpQUBAAAAAasFAQAAAAG5BUAAAAAB9wUBAAAAAfwFAgAAAAGlBgEAAAABpgYBAAAAAacGAQAAAAGoBoAAAAABqQYQAAAAAaoGEAAAAAGrBhAAAAABAgAAAC8AIEYAAPUMACADAAAALwAgRgAA9QwAIEcAAPMMACABPwAApRMAMBIPAACQCgAgEQAArQkAIKIFAACTCgAwowUAAC0AEKQFAACTCgAwpQUBAAAAAaoFAQD4CAAhqwUBAPgIACG5BUAA-QgAIfcFAQD4CAAh_AUCAIMJACGlBgEA-AgAIaYGAQD4CAAhpwYBAP0IACGoBgAAlAoAIKkGEACdCQAhqgYQAJ0JACGrBhAAnQkAIQIAAAAvACA_AADzDAAgAgAAAPEMACA_AADyDAAgEKIFAADwDAAwowUAAPEMABCkBQAA8AwAMKUFAQD4CAAhqgUBAPgIACGrBQEA-AgAIbkFQAD5CAAh9wUBAPgIACH8BQIAgwkAIaUGAQD4CAAhpgYBAPgIACGnBgEA_QgAIagGAACUCgAgqQYQAJ0JACGqBhAAnQkAIasGEACdCQAhEKIFAADwDAAwowUAAPEMABCkBQAA8AwAMKUFAQD4CAAhqgUBAPgIACGrBQEA-AgAIbkFQAD5CAAh9wUBAPgIACH8BQIAgwkAIaUGAQD4CAAhpgYBAPgIACGnBgEA_QgAIagGAACUCgAgqQYQAJ0JACGqBhAAnQkAIasGEACdCQAhDKUFAQC2CgAhqwUBALYKACG5BUAAvAoAIfcFAQC2CgAh_AUCALsKACGlBgEAtgoAIaYGAQC2CgAhpwYBALcKACGoBoAAAAABqQYQAJcMACGqBhAAlwwAIasGEACXDAAhDQ8AAPQMACClBQEAtgoAIasFAQC2CgAhuQVAALwKACH3BQEAtgoAIfwFAgC7CgAhpQYBALYKACGmBgEAtgoAIacGAQC3CgAhqAaAAAAAAakGEACXDAAhqgYQAJcMACGrBhAAlwwAIQVGAACgEwAgRwAAoxMAIIAHAAChEwAggQcAAKITACCGBwAAJQAgDQ8AAPYMACClBQEAAAABqwUBAAAAAbkFQAAAAAH3BQEAAAAB_AUCAAAAAaUGAQAAAAGmBgEAAAABpwYBAAAAAagGgAAAAAGpBhAAAAABqgYQAAAAAasGEAAAAAEDRgAAoBMAIIAHAAChEwAghgcAACUAIB0DAAD4DAAgBAAA-QwAIAwAAPoMACAgAAD-DAAgJAAA-wwAICUAAPwMACAoAAD9DAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABqwYQAAAAAawGAQAAAAGtBgEAAAABrgaAAAAAAa8GAQAAAAGwBgEAAAABsQYQAAAAAbIGEAAAAAGzBhAAAAABtAYQAAAAAbUGAQAAAAG2BkAAAAABtwZAAAAAAbgGQAAAAAG5BkAAAAABugZAAAAAAbsGQAAAAAEDRgAAnhMAIIAHAACfEwAghgcAAAEAIANGAACcEwAggAcAAJ0TACCGBwAABQAgBEYAAOkMADCABwAA6gwAMIIHAADsDAAghgcAAO0MADADRgAA4gwAIIAHAADjDAAghgcAAKEFACAERgAA1gwAMIAHAADXDAAwggcAANkMACCGBwAA2gwAMARGAAC7DAAwgAcAALwMADCCBwAAvgwAIIYHAAC_DAAwBEYAAK8MADCABwAAsAwAMIIHAACyDAAghgcAALMMADACGAAAiQwAIOQFAQAAAAECAAAARwAgRgAAig0AIAMAAABHACBGAACKDQAgRwAAiQ0AIAE_AACbEwAwCAUAAIsKACAYAACMCgAgogUAAIoKADCjBQAARQAQpAUAAIoKADDkBQEA-AgAIYMGAQD4CAAh-AYAAIkKACACAAAARwAgPwAAiQ0AIAIAAACHDQAgPwAAiA0AIAWiBQAAhg0AMKMFAACHDQAQpAUAAIYNADDkBQEA-AgAIYMGAQD4CAAhBaIFAACGDQAwowUAAIcNABCkBQAAhg0AMOQFAQD4CAAhgwYBAPgIACEB5AUBALYKACECGAAAhwwAIOQFAQC2CgAhAhgAAIkMACDkBQEAAAABAgkAAJAMACCrBQEAAAABAgAAAA8AIEYAAJYNACADAAAADwAgRgAAlg0AIEcAAJUNACABPwAAmhMAMAgFAACLCgAgCQAA8wkAIKIFAACoCgAwowUAAA0AEKQFAACoCgAwqwUBAPgIACGDBgEA-AgAIf0GAACnCgAgAgAAAA8AID8AAJUNACACAAAAkw0AID8AAJQNACAFogUAAJINADCjBQAAkw0AEKQFAACSDQAwqwUBAPgIACGDBgEA-AgAIQWiBQAAkg0AMKMFAACTDQAQpAUAAJINADCrBQEA-AgAIYMGAQD4CAAhAasFAQC2CgAhAgkAAI4MACCrBQEAtgoAIQIJAACQDAAgqwUBAAAAAQRGAACLDQAwgAcAAIwNADCCBwAAjg0AIIYHAACPDQAwBEYAAP8MADCABwAAgA0AMIIHAACCDQAghgcAAIMNADAERgAAnAwAMIAHAACdDAAwggcAAJ8MACCGBwAAoAwAMAAAAAAAAAAABUYAAJUTACBHAACYEwAggAcAAJYTACCBBwAAlxMAIIYHAAAJACADRgAAlRMAIIAHAACWEwAghgcAAAkAIBIDAAD5CwAgBAAA8xEAIAUAAOoRACAMAADuEQAgIAAA3REAICQAAPQRACAlAAD1EQAgKAAA9hEAIIMGAACwCgAgrgYAALAKACCvBgAAsAoAILAGAACwCgAgtQYAALAKACC3BgAAsAoAILgGAACwCgAguQYAALAKACC6BgAAsAoAILsGAACwCgAgAAAABUYAAJATACBHAACTEwAggAcAAJETACCBBwAAkhMAIIYHAAB_ACADRgAAkBMAIIAHAACREwAghgcAAH8AIAAAAAVGAACLEwAgRwAAjhMAIIAHAACMEwAggQcAAI0TACCGBwAACQAgA0YAAIsTACCABwAAjBMAIIYHAAAJACAAAAAFRgAAhhMAIEcAAIkTACCABwAAhxMAIIEHAACIEwAghgcAAAkAIANGAACGEwAggAcAAIcTACCGBwAACQAgAAAAAAAFRgAAgRMAIEcAAIQTACCABwAAghMAIIEHAACDEwAghgcAAAkAIANGAACBEwAggAcAAIITACCGBwAACQAgAAAAAAAHRgAA_BIAIEcAAP8SACCABwAA_RIAIIEHAAD-EgAghAcAAAsAIIUHAAALACCGBwAAuQUAIANGAAD8EgAggAcAAP0SACCGBwAAuQUAIAAAAAAABUYAAPQSACBHAAD6EgAggAcAAPUSACCBBwAA-RIAIIYHAACDBAAgBUYAAPISACBHAAD3EgAggAcAAPMSACCBBwAA9hIAIIYHAAAlACADRgAA9BIAIIAHAAD1EgAghgcAAIMEACADRgAA8hIAIIAHAADzEgAghgcAACUAIAAAAAVGAADsEgAgRwAA8BIAIIAHAADtEgAggQcAAO8SACCGBwAAAQAgC0YAANANADBHAADVDQAwgAcAANENADCBBwAA0g0AMIIHAADTDQAggwcAANQNADCEBwAA1A0AMIUHAADUDQAwhgcAANQNADCHBwAA1g0AMIgHAADXDQAwBg8AAMoNACClBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAAB_AUCAAAAAQIAAAApACBGAADbDQAgAwAAACkAIEYAANsNACBHAADaDQAgAT8AAO4SADAMDgAAlwoAIA8AAJAKACCiBQAAlgoAMKMFAAAnABCkBQAAlgoAMKUFAQAAAAG5BUAA-QgAIdkFQAD5CAAh9wUBAPgIACH8BQIAgwkAIbwGAQD4CAAh-gYAAJUKACACAAAAKQAgPwAA2g0AIAIAAADYDQAgPwAA2Q0AIAmiBQAA1w0AMKMFAADYDQAQpAUAANcNADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACH3BQEA-AgAIfwFAgCDCQAhvAYBAPgIACEJogUAANcNADCjBQAA2A0AEKQFAADXDQAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAh9wUBAPgIACH8BQIAgwkAIbwGAQD4CAAhBaUFAQC2CgAhuQVAALwKACHZBUAAvAoAIfcFAQC2CgAh_AUCALsKACEGDwAAyA0AIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIfcFAQC2CgAh_AUCALsKACEGDwAAyg0AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAfcFAQAAAAH8BQIAAAABA0YAAOwSACCABwAA7RIAIIYHAAABACAERgAA0A0AMIAHAADRDQAwggcAANMNACCGBwAA1A0AMAAAAAAAAAVGAADhEgAgRwAA6hIAIIAHAADiEgAggQcAAOkSACCGBwAAAQAgBUYAAN8SACBHAADnEgAggAcAAOASACCBBwAA5hIAIIYHAAAZACAHRgAA3RIAIEcAAOQSACCABwAA3hIAIIEHAADjEgAghAcAAFUAIIUHAABVACCGBwAAAQAgA0YAAOESACCABwAA4hIAIIYHAAABACADRgAA3xIAIIAHAADgEgAghgcAABkAIANGAADdEgAggAcAAN4SACCGBwAAAQAgAAAAAAAHRgAAzxIAIEcAANsSACCABwAA0BIAIIEHAADaEgAghAcAABcAIIUHAAAXACCGBwAAGQAgB0YAAM0SACBHAADYEgAggAcAAM4SACCBBwAA1xIAIIQHAAAgACCFBwAAIAAghgcAAE4AIAdGAADLEgAgRwAA1RIAIIAHAADMEgAggQcAANQSACCEBwAAIwAghQcAACMAIIYHAAAlACAHRgAAyRIAIEcAANISACCABwAAyhIAIIEHAADREgAghAcAABEAIIUHAAARACCGBwAAFQAgA0YAAM8SACCABwAA0BIAIIYHAAAZACADRgAAzRIAIIAHAADOEgAghgcAAE4AIANGAADLEgAggAcAAMwSACCGBwAAJQAgA0YAAMkSACCABwAAyhIAIIYHAAAVACAAAAAAAAVGAAC_EgAgRwAAxxIAIIAHAADAEgAggQcAAMYSACCGBwAATgAgC0YAAKwOADBHAACwDgAwgAcAAK0OADCBBwAArg4AMIIHAACvDgAggwcAANQNADCEBwAA1A0AMIUHAADUDQAwhgcAANQNADCHBwAAsQ4AMIgHAADXDQAwC0YAAKMOADBHAACnDgAwgAcAAKQOADCBBwAApQ4AMIIHAACmDgAggwcAAO0MADCEBwAA7QwAMIUHAADtDAAwhgcAAO0MADCHBwAAqA4AMIgHAADwDAAwC0YAAJcOADBHAACcDgAwgAcAAJgOADCBBwAAmQ4AMIIHAACaDgAggwcAAJsOADCEBwAAmw4AMIUHAACbDgAwhgcAAJsOADCHBwAAnQ4AMIgHAACeDgAwC0YAAIsOADBHAACQDgAwgAcAAIwOADCBBwAAjQ4AMIIHAACODgAggwcAAI8OADCEBwAAjw4AMIUHAACPDgAwhgcAAI8OADCHBwAAkQ4AMIgHAACSDgAwC0YAAIIOADBHAACGDgAwgAcAAIMOADCBBwAAhA4AMIIHAACFDgAggwcAAO8LADCEBwAA7wsAMIUHAADvCwAwhgcAAO8LADCHBwAAhw4AMIgHAADyCwAwBBUAAOQLACClBQEAAAABuQVAAAAAAfYFAQAAAAECAAAAOAAgRgAAig4AIAMAAAA4ACBGAACKDgAgRwAAiQ4AIAE_AADFEgAwAgAAADgAID8AAIkOACACAAAA8wsAID8AAIgOACADpQUBALYKACG5BUAAvAoAIfYFAQC2CgAhBBUAAOILACClBQEAtgoAIbkFQAC8CgAh9gUBALYKACEEFQAA5AsAIKUFAQAAAAG5BUAAAAAB9gUBAAAAAQqlBQEAAAABuQVAAAAAAfsFAAAA-wUC_AUCAAAAAf0FAgAAAAH-BQIAAAAB_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAQIAAAA0ACBGAACWDgAgAwAAADQAIEYAAJYOACBHAACVDgAgAT8AAMQSADAPEwAAkAoAIKIFAACRCgAwowUAADIAEKQFAACRCgAwpQUBAAAAAbkFQAD5CAAh9wUBAPgIACH7BQAAkgr7BSL8BQIAgwkAIf0FAgCDCQAh_gUCAIMJACH_BQEA_QgAIYAGAQD9CAAhgQYBAP0IACGCBgEA_QgAIQIAAAA0ACA_AACVDgAgAgAAAJMOACA_AACUDgAgDqIFAACSDgAwowUAAJMOABCkBQAAkg4AMKUFAQD4CAAhuQVAAPkIACH3BQEA-AgAIfsFAACSCvsFIvwFAgCDCQAh_QUCAIMJACH-BQIAgwkAIf8FAQD9CAAhgAYBAP0IACGBBgEA_QgAIYIGAQD9CAAhDqIFAACSDgAwowUAAJMOABCkBQAAkg4AMKUFAQD4CAAhuQVAAPkIACH3BQEA-AgAIfsFAACSCvsFIvwFAgCDCQAh_QUCAIMJACH-BQIAgwkAIf8FAQD9CAAhgAYBAP0IACGBBgEA_QgAIYIGAQD9CAAhCqUFAQC2CgAhuQVAALwKACH7BQAAgAz7BSL8BQIAuwoAIf0FAgC7CgAh_gUCALsKACH_BQEAtwoAIYAGAQC3CgAhgQYBALcKACGCBgEAtwoAIQqlBQEAtgoAIbkFQAC8CgAh-wUAAIAM-wUi_AUCALsKACH9BQIAuwoAIf4FAgC7CgAh_wUBALcKACGABgEAtwoAIYEGAQC3CgAhggYBALcKACEKpQUBAAAAAbkFQAAAAAH7BQAAAPsFAvwFAgAAAAH9BQIAAAAB_gUCAAAAAf8FAQAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAEOCQAA8w0AIAsAAPQNACAYAAD2DQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAcoGAQAAAAECAAAAHQAgRgAAog4AIAMAAAAdACBGAACiDgAgRwAAoQ4AIAE_AADDEgAwEwkAAPEJACALAACeCgAgDwAAnwoAIBgAAKAKACCiBQAAnQoAMKMFAAAbABCkBQAAnQoAMKUFAQAAAAGrBQEA_QgAIbkFQAD5CAAh2QVAAPkIACHkBQEA_QgAIfcFAQD9CAAhxQYBAPgIACHGBgEA_QgAIccGAQD9CAAhyAYCAIMJACHJBiAAggkAIcoGAQD9CAAhAgAAAB0AID8AAKEOACACAAAAnw4AID8AAKAOACAPogUAAJ4OADCjBQAAnw4AEKQFAACeDgAwpQUBAPgIACGrBQEA_QgAIbkFQAD5CAAh2QVAAPkIACHkBQEA_QgAIfcFAQD9CAAhxQYBAPgIACHGBgEA_QgAIccGAQD9CAAhyAYCAIMJACHJBiAAggkAIcoGAQD9CAAhD6IFAACeDgAwowUAAJ8OABCkBQAAng4AMKUFAQD4CAAhqwUBAP0IACG5BUAA-QgAIdkFQAD5CAAh5AUBAP0IACH3BQEA_QgAIcUGAQD4CAAhxgYBAP0IACHHBgEA_QgAIcgGAgCDCQAhyQYgAIIJACHKBgEA_QgAIQulBQEAtgoAIasFAQC3CgAhuQVAALwKACHZBUAAvAoAIeQFAQC3CgAhxQYBALYKACHGBgEAtwoAIccGAQC3CgAhyAYCALsKACHJBiAAuQoAIcoGAQC3CgAhDgkAAO8NACALAADwDQAgGAAA8g0AIKUFAQC2CgAhqwUBALcKACG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACHFBgEAtgoAIcYGAQC3CgAhxwYBALcKACHIBgIAuwoAIckGIAC5CgAhygYBALcKACEOCQAA8w0AIAsAAPQNACAYAAD2DQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAcoGAQAAAAENEQAAug0AIKUFAQAAAAGqBQEAAAABqwUBAAAAAbkFQAAAAAH8BQIAAAABpQYBAAAAAaYGAQAAAAGnBgEAAAABqAaAAAAAAakGEAAAAAGqBhAAAAABqwYQAAAAAQIAAAAvACBGAACrDgAgAwAAAC8AIEYAAKsOACBHAACqDgAgAT8AAMISADACAAAALwAgPwAAqg4AIAIAAADxDAAgPwAAqQ4AIAylBQEAtgoAIaoFAQC2CgAhqwUBALYKACG5BUAAvAoAIfwFAgC7CgAhpQYBALYKACGmBgEAtgoAIacGAQC3CgAhqAaAAAAAAakGEACXDAAhqgYQAJcMACGrBhAAlwwAIQ0RAAC5DQAgpQUBALYKACGqBQEAtgoAIasFAQC2CgAhuQVAALwKACH8BQIAuwoAIaUGAQC2CgAhpgYBALYKACGnBgEAtwoAIagGgAAAAAGpBhAAlwwAIaoGEACXDAAhqwYQAJcMACENEQAAug0AIKUFAQAAAAGqBQEAAAABqwUBAAAAAbkFQAAAAAH8BQIAAAABpQYBAAAAAaYGAQAAAAGnBgEAAAABqAaAAAAAAakGEAAAAAGqBhAAAAABqwYQAAAAAQYOAADJDQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB_AUCAAAAAbwGAQAAAAECAAAAKQAgRgAAtA4AIAMAAAApACBGAAC0DgAgRwAAsw4AIAE_AADBEgAwAgAAACkAID8AALMOACACAAAA2A0AID8AALIOACAFpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh_AUCALsKACG8BgEAtgoAIQYOAADHDQAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh_AUCALsKACG8BgEAtgoAIQYOAADJDQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB_AUCAAAAAbwGAQAAAAEDRgAAvxIAIIAHAADAEgAghgcAAE4AIARGAACsDgAwgAcAAK0OADCCBwAArw4AIIYHAADUDQAwBEYAAKMOADCABwAApA4AMIIHAACmDgAghgcAAO0MADAERgAAlw4AMIAHAACYDgAwggcAAJoOACCGBwAAmw4AMARGAACLDgAwgAcAAIwOADCCBwAAjg4AIIYHAACPDgAwBEYAAIIOADCABwAAgw4AMIIHAACFDgAghgcAAO8LADAAAAAFRgAAuBIAIEcAAL0SACCABwAAuRIAIIEHAAC8EgAghgcAABkAIAtGAADNDgAwRwAA0Q4AMIAHAADODgAwgQcAAM8OADCCBwAA0A4AIIMHAACbDgAwhAcAAJsOADCFBwAAmw4AMIYHAACbDgAwhwcAANIOADCIBwAAng4AMAtGAADBDgAwRwAAxg4AMIAHAADCDgAwgQcAAMMOADCCBwAAxA4AIIMHAADFDgAwhAcAAMUOADCFBwAAxQ4AMIYHAADFDgAwhwcAAMcOADCIBwAAyA4AMA8KAAC4DgAgEAAAtg4AIBIAALcOACAUAAC5DgAgFgAAug4AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAY8GIAAAAAHMBgEAAAABzQYBAAAAAc4GEAAAAAHPBhAAAAAB0AYQAAAAAdEGAgAAAAECAAAAJQAgRgAAzA4AIAMAAAAlACBGAADMDgAgRwAAyw4AIAE_AAC7EgAwFQoAAIcKACALAACaCgAgEAAAvgkAIBIAAJsKACAUAACcCgAgFgAAigkAIKIFAACZCgAwowUAACMAEKQFAACZCgAwpQUBAAAAAbkFQAD5CAAh2QVAAPkIACGPBiAAggkAIcsGAQD4CAAhzAYBAAAAAc0GAQD9CAAhzgYQAJ0JACHPBhAAngkAIdAGEACeCQAh0QYCAIMJACH7BgAAmAoAIAIAAAAlACA_AADLDgAgAgAAAMkOACA_AADKDgAgDqIFAADIDgAwowUAAMkOABCkBQAAyA4AMKUFAQD4CAAhuQVAAPkIACHZBUAA-QgAIY8GIACCCQAhywYBAPgIACHMBgEA-AgAIc0GAQD9CAAhzgYQAJ0JACHPBhAAngkAIdAGEACeCQAh0QYCAIMJACEOogUAAMgOADCjBQAAyQ4AEKQFAADIDgAwpQUBAPgIACG5BUAA-QgAIdkFQAD5CAAhjwYgAIIJACHLBgEA-AgAIcwGAQD4CAAhzQYBAP0IACHOBhAAnQkAIc8GEACeCQAh0AYQAJ4JACHRBgIAgwkAIQqlBQEAtgoAIbkFQAC8CgAh2QVAALwKACGPBiAAuQoAIcwGAQC2CgAhzQYBALcKACHOBhAAlwwAIc8GEACYDAAh0AYQAJgMACHRBgIAuwoAIQ8KAAD_DQAgEAAA_Q0AIBIAAP4NACAUAACADgAgFgAAgQ4AIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIY8GIAC5CgAhzAYBALYKACHNBgEAtwoAIc4GEACXDAAhzwYQAJgMACHQBhAAmAwAIdEGAgC7CgAhDwoAALgOACAQAAC2DgAgEgAAtw4AIBQAALkOACAWAAC6DgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQ4JAADzDQAgDwAA9Q0AIBgAAPYNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAQIAAAAdACBGAADVDgAgAwAAAB0AIEYAANUOACBHAADUDgAgAT8AALoSADACAAAAHQAgPwAA1A4AIAIAAACfDgAgPwAA0w4AIAulBQEAtgoAIasFAQC3CgAhuQVAALwKACHZBUAAvAoAIeQFAQC3CgAh9wUBALcKACHFBgEAtgoAIcYGAQC3CgAhxwYBALcKACHIBgIAuwoAIckGIAC5CgAhDgkAAO8NACAPAADxDQAgGAAA8g0AIKUFAQC2CgAhqwUBALcKACG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACH3BQEAtwoAIcUGAQC2CgAhxgYBALcKACHHBgEAtwoAIcgGAgC7CgAhyQYgALkKACEOCQAA8w0AIA8AAPUNACAYAAD2DQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAH3BQEAAAABxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYCAAAAAckGIAAAAAEDRgAAuBIAIIAHAAC5EgAghgcAABkAIARGAADNDgAwgAcAAM4OADCCBwAA0A4AIIYHAACbDgAwBEYAAMEOADCABwAAwg4AMIIHAADEDgAghgcAAMUOADAAAAAAAAdGAACnEgAgRwAAthIAIIAHAACoEgAggQcAALUSACCEBwAAEQAghQcAABEAIIYHAAAVACALRgAApw8AMEcAAKwPADCABwAAqA8AMIEHAACpDwAwggcAAKoPACCDBwAAqw8AMIQHAACrDwAwhQcAAKsPADCGBwAAqw8AMIcHAACtDwAwiAcAAK4PADALRgAAng8AMEcAAKIPADCABwAAnw8AMIEHAACgDwAwggcAAKEPACCDBwAAmw4AMIQHAACbDgAwhQcAAJsOADCGBwAAmw4AMIcHAACjDwAwiAcAAJ4OADALRgAAkg8AMEcAAJcPADCABwAAkw8AMIEHAACUDwAwggcAAJUPACCDBwAAlg8AMIQHAACWDwAwhQcAAJYPADCGBwAAlg8AMIcHAACYDwAwiAcAAJkPADALRgAAhA8AMEcAAIkPADCABwAAhQ8AMIEHAACGDwAwggcAAIcPACCDBwAAiA8AMIQHAACIDwAwhQcAAIgPADCGBwAAiA8AMIcHAACKDwAwiAcAAIsPADALRgAA-A4AMEcAAP0OADCABwAA-Q4AMIEHAAD6DgAwggcAAPsOACCDBwAA_A4AMIQHAAD8DgAwhQcAAPwOADCGBwAA_A4AMIcHAAD-DgAwiAcAAP8OADALRgAA7w4AMEcAAPMOADCABwAA8A4AMIEHAADxDgAwggcAAPIOACCDBwAAswwAMIQHAACzDAAwhQcAALMMADCGBwAAswwAMIcHAAD0DgAwiAcAALYMADALRgAA5g4AMEcAAOoOADCABwAA5w4AMIEHAADoDgAwggcAAOkOACCDBwAAjw0AMIQHAACPDQAwhQcAAI8NADCGBwAAjw0AMIcHAADrDgAwiAcAAJINADACBQAAjwwAIIMGAQAAAAECAAAADwAgRgAA7g4AIAMAAAAPACBGAADuDgAgRwAA7Q4AIAE_AAC0EgAwAgAAAA8AID8AAO0OACACAAAAkw0AID8AAOwOACABgwYBALYKACECBQAAjQwAIIMGAQC2CgAhAgUAAI8MACCDBgEAAAABFgMAAMAKACARAADBCgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAECAAAAZAAgRgAA9w4AIAMAAABkACBGAAD3DgAgRwAA9g4AIAE_AACzEgAwAgAAAGQAID8AAPYOACACAAAAtwwAID8AAPUOACAUpQUBALYKACGmBQEAtgoAIacFAQC3CgAhqAUBALcKACGpBQEAtwoAIaoFAQC3CgAhrAUIALgKACGtBQEAtwoAIa4FAQC3CgAhrwUBALcKACGwBQEAtwoAIbEFIAC5CgAhsgUgALkKACGzBUAAugoAIbQFQAC6CgAhtQUCALsKACG2BUAAugoAIbcFAQC3CgAhuAWAAAAAAbkFQAC8CgAhFgMAAL0KACARAAC-CgAgpQUBALYKACGmBQEAtgoAIacFAQC3CgAhqAUBALcKACGpBQEAtwoAIaoFAQC3CgAhrAUIALgKACGtBQEAtwoAIa4FAQC3CgAhrwUBALcKACGwBQEAtwoAIbEFIAC5CgAhsgUgALkKACGzBUAAugoAIbQFQAC6CgAhtQUCALsKACG2BUAAugoAIbcFAQC3CgAhuAWAAAAAAbkFQAC8CgAhFgMAAMAKACARAADBCgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEIAwAA0QoAIKUFAQAAAAGoBQEAAAABqQUBAAAAAbAFAQAAAAHOBQEAAAABzwUBAAAAAdAFQAAAAAECAAAAXwAgRgAAgw8AIAMAAABfACBGAACDDwAgRwAAgg8AIAE_AACyEgAwDQMAANoJACAJAADzCQAgogUAAPIJADCjBQAAXQAQpAUAAPIJADClBQEAAAABqAUBAP0IACGpBQEA_QgAIasFAQD4CAAhsAUBAP0IACHOBQEA_QgAIc8FAQD9CAAh0AVAAPkIACECAAAAXwAgPwAAgg8AIAIAAACADwAgPwAAgQ8AIAuiBQAA_w4AMKMFAACADwAQpAUAAP8OADClBQEA-AgAIagFAQD9CAAhqQUBAP0IACGrBQEA-AgAIbAFAQD9CAAhzgUBAP0IACHPBQEA_QgAIdAFQAD5CAAhC6IFAAD_DgAwowUAAIAPABCkBQAA_w4AMKUFAQD4CAAhqAUBAP0IACGpBQEA_QgAIasFAQD4CAAhsAUBAP0IACHOBQEA_QgAIc8FAQD9CAAh0AVAAPkIACEHpQUBALYKACGoBQEAtwoAIakFAQC3CgAhsAUBALcKACHOBQEAtwoAIc8FAQC3CgAh0AVAALwKACEIAwAAzwoAIKUFAQC2CgAhqAUBALcKACGpBQEAtwoAIbAFAQC3CgAhzgUBALcKACHPBQEAtwoAIdAFQAC8CgAhCAMAANEKACClBQEAAAABqAUBAAAAAakFAQAAAAGwBQEAAAABzgUBAAAAAc8FAQAAAAHQBUAAAAABAx0AAJEPACC5BUAAAAAB4wUBAAAAAQIAAABZACBGAACQDwAgAwAAAFkAIEYAAJAPACBHAACODwAgAT8AALESADAJCQAA8wkAIB0AAPYJACCiBQAA9QkAMKMFAABXABCkBQAA9QkAMKsFAQD4CAAhuQVAAPkIACHjBQEA-AgAIfYGAAD0CQAgAgAAAFkAID8AAI4PACACAAAAjA8AID8AAI0PACAGogUAAIsPADCjBQAAjA8AEKQFAACLDwAwqwUBAPgIACG5BUAA-QgAIeMFAQD4CAAhBqIFAACLDwAwowUAAIwPABCkBQAAiw8AMKsFAQD4CAAhuQVAAPkIACHjBQEA-AgAIQK5BUAAvAoAIeMFAQC2CgAhAx0AAI8PACC5BUAAvAoAIeMFAQC2CgAhBUYAAKwSACBHAACvEgAggAcAAK0SACCBBwAArhIAIIYHAADaAgAgAx0AAJEPACC5BUAAAAAB4wUBAAAAAQNGAACsEgAggAcAAK0SACCGBwAA2gIAIBADAADnDQAgGwAA6Q0AIKUFAQAAAAGoBQEAAAABuQVAAAAAAdkFQAAAAAHhBSAAAAAB6wUBAAAAAb0GAgAAAAG-BgEAAAABvwYgAAAAAcAGAgAAAAHBBgIAAAABwgYBAAAAAcMGQAAAAAHEBgEAAAABAgAAAFMAIEYAAJ0PACADAAAAUwAgRgAAnQ8AIEcAAJwPACABPwAAqxIAMBYDAACJCQAgCQAA8wkAIBsAANoJACCiBQAAhQoAMKMFAABRABCkBQAAhQoAMKUFAQAAAAGoBQEA-AgAIasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeEFIACCCQAh6wUBAP0IACG9BgIAgwkAIb4GAQD9CAAhvwYgAIIJACHABgIAgwkAIcEGAgCDCQAhwgYBAP0IACHDBkAAgQkAIcQGAQD9CAAh9wYAAIQKACACAAAAUwAgPwAAnA8AIAIAAACaDwAgPwAAmw8AIBKiBQAAmQ8AMKMFAACaDwAQpAUAAJkPADClBQEA-AgAIagFAQD4CAAhqwUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4QUgAIIJACHrBQEA_QgAIb0GAgCDCQAhvgYBAP0IACG_BiAAggkAIcAGAgCDCQAhwQYCAIMJACHCBgEA_QgAIcMGQACBCQAhxAYBAP0IACESogUAAJkPADCjBQAAmg8AEKQFAACZDwAwpQUBAPgIACGoBQEA-AgAIasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeEFIACCCQAh6wUBAP0IACG9BgIAgwkAIb4GAQD9CAAhvwYgAIIJACHABgIAgwkAIcEGAgCDCQAhwgYBAP0IACHDBkAAgQkAIcQGAQD9CAAhDqUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdkFQAC8CgAh4QUgALkKACHrBQEAtwoAIb0GAgC7CgAhvgYBALcKACG_BiAAuQoAIcAGAgC7CgAhwQYCALsKACHCBgEAtwoAIcMGQAC6CgAhxAYBALcKACEQAwAA5A0AIBsAAOYNACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHZBUAAvAoAIeEFIAC5CgAh6wUBALcKACG9BgIAuwoAIb4GAQC3CgAhvwYgALkKACHABgIAuwoAIcEGAgC7CgAhwgYBALcKACHDBkAAugoAIcQGAQC3CgAhEAMAAOcNACAbAADpDQAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvQYCAAAAAb4GAQAAAAG_BiAAAAABwAYCAAAAAcEGAgAAAAHCBgEAAAABwwZAAAAAAcQGAQAAAAEOCwAA9A0AIA8AAPUNACAYAAD2DQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAcoGAQAAAAECAAAAHQAgRgAApg8AIAMAAAAdACBGAACmDwAgRwAApQ8AIAE_AACqEgAwAgAAAB0AID8AAKUPACACAAAAnw4AID8AAKQPACALpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACH3BQEAtwoAIcUGAQC2CgAhxgYBALcKACHHBgEAtwoAIcgGAgC7CgAhyQYgALkKACHKBgEAtwoAIQ4LAADwDQAgDwAA8Q0AIBgAAPINACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIfcFAQC3CgAhxQYBALYKACHGBgEAtwoAIccGAQC3CgAhyAYCALsKACHJBiAAuQoAIcoGAQC3CgAhDgsAAPQNACAPAAD1DQAgGAAA9g0AIKUFAQAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAH3BQEAAAABxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYCAAAAAckGIAAAAAHKBgEAAAABBwoAANcOACAXAADYDgAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAECAAAATgAgRgAAsg8AIAMAAABOACBGAACyDwAgRwAAsQ8AIAE_AACpEgAwDAkAAPMJACAKAACHCgAgFwAAiAoAIKIFAACGCgAwowUAACAAEKQFAACGCgAwpQUBAAAAAasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIesFAQD4CAAhjwYgAIIJACECAAAATgAgPwAAsQ8AIAIAAACvDwAgPwAAsA8AIAmiBQAArg8AMKMFAACvDwAQpAUAAK4PADClBQEA-AgAIasFAQD4CAAhuQVAAPkIACHZBUAA-QgAIesFAQD4CAAhjwYgAIIJACEJogUAAK4PADCjBQAArw8AEKQFAACuDwAwpQUBAPgIACGrBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHrBQEA-AgAIY8GIACCCQAhBaUFAQC2CgAhuQVAALwKACHZBUAAvAoAIesFAQC2CgAhjwYgALkKACEHCgAAvw4AIBcAAMAOACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHrBQEAtgoAIY8GIAC5CgAhBwoAANcOACAXAADYDgAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAEDRgAApxIAIIAHAACoEgAghgcAABUAIARGAACnDwAwgAcAAKgPADCCBwAAqg8AIIYHAACrDwAwBEYAAJ4PADCABwAAnw8AMIIHAAChDwAghgcAAJsOADAERgAAkg8AMIAHAACTDwAwggcAAJUPACCGBwAAlg8AMARGAACEDwAwgAcAAIUPADCCBwAAhw8AIIYHAACIDwAwBEYAAPgOADCABwAA-Q4AMIIHAAD7DgAghgcAAPwOADAERgAA7w4AMIAHAADwDgAwggcAAPIOACCGBwAAswwAMARGAADmDgAwgAcAAOcOADCCBwAA6Q4AIIYHAACPDQAwAAAABUYAAKISACBHAAClEgAggAcAAKMSACCBBwAApBIAIIYHAAAZACADRgAAohIAIIAHAACjEgAghgcAABkAIAAAAAtGAADEDwAwRwAAyA8AMIAHAADFDwAwgQcAAMYPADCCBwAAxw8AIIMHAACIDwAwhAcAAIgPADCFBwAAiA8AMIYHAACIDwAwhwcAAMkPADCIBwAAiw8AMAMJAAC_DwAgqwUBAAAAAbkFQAAAAAECAAAAWQAgRgAAzA8AIAMAAABZACBGAADMDwAgRwAAyw8AIAE_AAChEgAwAgAAAFkAID8AAMsPACACAAAAjA8AID8AAMoPACACqwUBALYKACG5BUAAvAoAIQMJAAC-DwAgqwUBALYKACG5BUAAvAoAIQMJAAC_DwAgqwUBAAAAAbkFQAAAAAEERgAAxA8AMIAHAADFDwAwggcAAMcPACCGBwAAiA8AMAAAAAAAAAdGAACYEgAgRwAAnxIAIIAHAACZEgAggQcAAJ4SACCEBwAAEQAghQcAABEAIIYHAAAVACALRgAA9w8AMEcAAPwPADCABwAA-A8AMIEHAAD5DwAwggcAAPoPACCDBwAA-w8AMIQHAAD7DwAwhQcAAPsPADCGBwAA-w8AMIcHAAD9DwAwiAcAAP4PADALRgAA6w8AMEcAAPAPADCABwAA7A8AMIEHAADtDwAwggcAAO4PACCDBwAA7w8AMIQHAADvDwAwhQcAAO8PADCGBwAA7w8AMIcHAADxDwAwiAcAAPIPADALRgAA4g8AMEcAAOYPADCABwAA4w8AMIEHAADkDwAwggcAAOUPACCDBwAAmw4AMIQHAACbDgAwhQcAAJsOADCGBwAAmw4AMIcHAADnDwAwiAcAAJ4OADALRgAA2Q8AMEcAAN0PADCABwAA2g8AMIEHAADbDwAwggcAANwPACCDBwAAgw0AMIQHAACDDQAwhQcAAIMNADCGBwAAgw0AMIcHAADeDwAwiAcAAIYNADACBQAAiAwAIIMGAQAAAAECAAAARwAgRgAA4Q8AIAMAAABHACBGAADhDwAgRwAA4A8AIAE_AACdEgAwAgAAAEcAID8AAOAPACACAAAAhw0AID8AAN8PACABgwYBALYKACECBQAAhgwAIIMGAQC2CgAhAgUAAIgMACCDBgEAAAABDgkAAPMNACALAAD0DQAgDwAA9Q0AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAH3BQEAAAABxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYCAAAAAckGIAAAAAHKBgEAAAABAgAAAB0AIEYAAOoPACADAAAAHQAgRgAA6g8AIEcAAOkPACABPwAAnBIAMAIAAAAdACA_AADpDwAgAgAAAJ8OACA_AADoDwAgC6UFAQC2CgAhqwUBALcKACG5BUAAvAoAIdkFQAC8CgAh9wUBALcKACHFBgEAtgoAIcYGAQC3CgAhxwYBALcKACHIBgIAuwoAIckGIAC5CgAhygYBALcKACEOCQAA7w0AIAsAAPANACAPAADxDQAgpQUBALYKACGrBQEAtwoAIbkFQAC8CgAh2QVAALwKACH3BQEAtwoAIcUGAQC2CgAhxgYBALcKACHHBgEAtwoAIcgGAgC7CgAhyQYgALkKACHKBgEAtwoAIQ4JAADzDQAgCwAA9A0AIA8AAPUNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB9wUBAAAAAcUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAgAAAAHJBiAAAAABygYBAAAAAR4KAAC1DwAgGgAAtA8AIBwAALYPACAeAAC3DwAgHwAAuA8AICAAALkPACAhAAC6DwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeYFAQAAAAHqBQEAAAAB6wUBAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAY8GIAAAAAHMBgEAAAABzQYBAAAAAc4GEAAAAAHPBhAAAAAB0AYQAAAAAdEGAgAAAAHSBgEAAAAB0wYBAAAAAdQGAgAAAAHVBiAAAAAB1gYgAAAAAdcGIAAAAAECAAAAGQAgRgAA9g8AIAMAAAAZACBGAAD2DwAgRwAA9Q8AIAE_AACbEgAwIwoAAIcKACAYAACgCgAgGgAAogoAIBwAAP0JACAeAADHCQAgHwAAgAoAICAAAIIKACAhAACgCQAgogUAAKEKADCjBQAAFwAQpAUAAKEKADClBQEAAAABuAUAAIQJACC5BUAA-QgAIdkFQAD5CAAh5AUBAP0IACHmBQEAAAAB6gUBAP0IACHrBQEA-AgAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIY8GIACCCQAhzAYBAAAAAc0GAQD9CAAhzgYQAJ4JACHPBhAAngkAIdAGEACeCQAh0QYCAJ8JACHSBgEA_QgAIdMGAQD9CAAh1AYCAIMJACHVBiAAggkAIdYGIACCCQAh1wYgAIIJACECAAAAGQAgPwAA9Q8AIAIAAADzDwAgPwAA9A8AIBuiBQAA8g8AMKMFAADzDwAQpAUAAPIPADClBQEA-AgAIbgFAACECQAguQVAAPkIACHZBUAA-QgAIeQFAQD9CAAh5gUBAPgIACHqBQEA_QgAIesFAQD4CAAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAhjwYgAIIJACHMBgEA_QgAIc0GAQD9CAAhzgYQAJ4JACHPBhAAngkAIdAGEACeCQAh0QYCAJ8JACHSBgEA_QgAIdMGAQD9CAAh1AYCAIMJACHVBiAAggkAIdYGIACCCQAh1wYgAIIJACEbogUAAPIPADCjBQAA8w8AEKQFAADyDwAwpQUBAPgIACG4BQAAhAkAILkFQAD5CAAh2QVAAPkIACHkBQEA_QgAIeYFAQD4CAAh6gUBAP0IACHrBQEA-AgAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIY8GIACCCQAhzAYBAP0IACHNBgEA_QgAIc4GEACeCQAhzwYQAJ4JACHQBhAAngkAIdEGAgCfCQAh0gYBAP0IACHTBgEA_QgAIdQGAgCDCQAh1QYgAIIJACHWBiAAggkAIdcGIACCCQAhF6UFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2QVAALwKACHmBQEAtgoAIeoFAQC3CgAh6wUBALYKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcwGAQC3CgAhzQYBALcKACHOBhAAmAwAIc8GEACYDAAh0AYQAJgMACHRBgIAyAoAIdIGAQC3CgAh0wYBALcKACHUBgIAuwoAIdUGIAC5CgAh1gYgALkKACHXBiAAuQoAIR4KAADgDgAgGgAA3w4AIBwAAOEOACAeAADiDgAgHwAA4w4AICAAAOQOACAhAADlDgAgpQUBALYKACG4BYAAAAABuQVAALwKACHZBUAAvAoAIeYFAQC2CgAh6gUBALcKACHrBQEAtgoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhzAYBALcKACHNBgEAtwoAIc4GEACYDAAhzwYQAJgMACHQBhAAmAwAIdEGAgDICgAh0gYBALcKACHTBgEAtwoAIdQGAgC7CgAh1QYgALkKACHWBiAAuQoAIdcGIAC5CgAhHgoAALUPACAaAAC0DwAgHAAAtg8AIB4AALcPACAfAAC4DwAgIAAAuQ8AICEAALoPACClBQEAAAABuAWAAAAAAbkFQAAAAAHZBUAAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAdIGAQAAAAHTBgEAAAAB1AYCAAAAAdUGIAAAAAHWBiAAAAAB1wYgAAAAARAHAACDEAAgCAAAhBAAIAoAAIUQACAZAACGEAAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcgGAgAAAAHYBgEAAAABAgAAABUAIEYAAIIQACADAAAAFQAgRgAAghAAIEcAAIEQACABPwAAmhIAMBYGAACgCgAgBwAApQoAIAgAAKYKACAKAACHCgAgGQAAoQkAIKIFAACkCgAwowUAABEAEKQFAACkCgAwpQUBAAAAAbkFQAD5CAAh2QVAAPkIACHiBQEA_QgAIeUFAQD4CAAh5gUBAAAAAeoFAQD9CAAh8gUBAP0IACHzBQEA_QgAIfQFAQD9CAAhjwYgAIIJACHIBgIAgwkAIdgGAQD9CAAh_AYAAKMKACACAAAAFQAgPwAAgRAAIAIAAAD_DwAgPwAAgBAAIBCiBQAA_g8AMKMFAAD_DwAQpAUAAP4PADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHiBQEA_QgAIeUFAQD4CAAh5gUBAPgIACHqBQEA_QgAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIY8GIACCCQAhyAYCAIMJACHYBgEA_QgAIRCiBQAA_g8AMKMFAAD_DwAQpAUAAP4PADClBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHiBQEA_QgAIeUFAQD4CAAh5gUBAPgIACHqBQEA_QgAIfIFAQD9CAAh8wUBAP0IACH0BQEA_QgAIY8GIACCCQAhyAYCAIMJACHYBgEA_QgAIQylBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIeYFAQC2CgAh6gUBALcKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcgGAgC7CgAh2AYBALcKACEQBwAA1Q8AIAgAANYPACAKAADXDwAgGQAA2A8AIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh5gUBALYKACHqBQEAtwoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhyAYCALsKACHYBgEAtwoAIRAHAACDEAAgCAAAhBAAIAoAAIUQACAZAACGEAAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcgGAgAAAAHYBgEAAAABBEYAAPcPADCABwAA-A8AMIIHAAD6DwAghgcAAPsPADAERgAA6w8AMIAHAADsDwAwggcAAO4PACCGBwAA7w8AMARGAADiDwAwgAcAAOMPADCCBwAA5Q8AIIYHAACbDgAwBEYAANkPADCABwAA2g8AMIIHAADcDwAghgcAAIMNADADRgAAmBIAIIAHAACZEgAghgcAABUAIAAAAAVGAACSEgAgRwAAlhIAIIAHAACTEgAggQcAAJUSACCGBwAAAQAgC0YAAI0QADBHAACREAAwgAcAAI4QADCBBwAAjxAAMIIHAACQEAAggwcAAKAMADCEBwAAoAwAMIUHAACgDAAwhgcAAKAMADCHBwAAkhAAMIgHAACjDAAwHQMAAPgMACAFAADBDQAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGDBgEAAAABqwYQAAAAAawGAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAACVEAAgAwAAAAkAIEYAAJUQACBHAACUEAAgAT8AAJQSADACAAAACQAgPwAAlBAAIAIAAACkDAAgPwAAkxAAIBalBQEAtgoAIagFAQC2CgAhuQVAALwKACHYBQAApgykBiLZBUAAvAoAIYMGAQC3CgAhqwYQAJcMACGsBgEAtgoAIa4GgAAAAAGvBgEAtwoAIbAGAQC3CgAhsQYQAJcMACGyBhAAlwwAIbMGEACXDAAhtAYQAJcMACG1BgEAtwoAIbYGQAC8CgAhtwZAALoKACG4BkAAugoAIbkGQAC6CgAhugZAALoKACG7BkAAugoAIR0DAACoDAAgBQAAwA0AIAwAAKoMACAgAACuDAAgJAAAqwwAICUAAKwMACAoAACtDAAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2AUAAKYMpAYi2QVAALwKACGDBgEAtwoAIasGEACXDAAhrAYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEdAwAA-AwAIAUAAMENACAMAAD6DAAgIAAA_gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABA0YAAJISACCABwAAkxIAIIYHAAABACAERgAAjRAAMIAHAACOEAAwggcAAJAQACCGBwAAoAwAMAAAAAVGAACNEgAgRwAAkBIAIIAHAACOEgAggQcAAI8SACCGBwAAAQAgA0YAAI0SACCABwAAjhIAIIYHAAABACAAAAAFRgAAiBIAIEcAAIsSACCABwAAiRIAIIEHAACKEgAghgcAAAEAIANGAACIEgAggAcAAIkSACCGBwAAAQAgAAAABUYAAIMSACBHAACGEgAggAcAAIQSACCBBwAAhRIAIIYHAAABACADRgAAgxIAIIAHAACEEgAghgcAAAEAIAAAAAGDBwAAAPAGAgtGAAC4EQAwRwAAvREAMIAHAAC5EQAwgQcAALoRADCCBwAAuxEAIIMHAAC8EQAwhAcAALwRADCFBwAAvBEAMIYHAAC8EQAwhwcAAL4RADCIBwAAvxEAMAtGAACsEQAwRwAAsREAMIAHAACtEQAwgQcAAK4RADCCBwAArxEAIIMHAACwEQAwhAcAALARADCFBwAAsBEAMIYHAACwEQAwhwcAALIRADCIBwAAsxEAMAtGAACgEQAwRwAApREAMIAHAAChEQAwgQcAAKIRADCCBwAAoxEAIIMHAACkEQAwhAcAAKQRADCFBwAApBEAMIYHAACkEQAwhwcAAKYRADCIBwAApxEAMAdGAACbEQAgRwAAnhEAIIAHAACcEQAggQcAAJ0RACCEBwAAlAEAIIUHAACUAQAghgcAAJQCACALRgAAkhEAMEcAAJYRADCABwAAkxEAMIEHAACUEQAwggcAAJURACCDBwAAlg8AMIQHAACWDwAwhQcAAJYPADCGBwAAlg8AMIcHAACXEQAwiAcAAJkPADALRgAAiREAMEcAAI0RADCABwAAihEAMIEHAACLEQAwggcAAIwRACCDBwAAoAwAMIQHAACgDAAwhQcAAKAMADCGBwAAoAwAMIcHAACOEQAwiAcAAKMMADAHRgAAhBEAIEcAAIcRACCABwAAhREAIIEHAACGEQAghAcAAJgBACCFBwAAmAEAIIYHAACDBAAgC0YAAPsQADBHAAD_EAAwgAcAAPwQADCBBwAA_RAAMIIHAAD-EAAggwcAAOUKADCEBwAA5QoAMIUHAADlCgAwhgcAAOUKADCHBwAAgBEAMIgHAADoCgAwC0YAAO8QADBHAAD0EAAwgAcAAPAQADCBBwAA8RAAMIIHAADyEAAggwcAAPMQADCEBwAA8xAAMIUHAADzEAAwhgcAAPMQADCHBwAA9RAAMIgHAAD2EAAwC0YAAOYQADBHAADqEAAwgAcAAOcQADCBBwAA6BAAMIIHAADpEAAggwcAAJYPADCEBwAAlg8AMIUHAACWDwAwhgcAAJYPADCHBwAA6xAAMIgHAACZDwAwC0YAAN0QADBHAADhEAAwgAcAAN4QADCBBwAA3xAAMIIHAADgEAAggwcAAPwOADCEBwAA_A4AMIUHAAD8DgAwhgcAAPwOADCHBwAA4hAAMIgHAAD_DgAwC0YAANEQADBHAADWEAAwgAcAANIQADCBBwAA0xAAMIIHAADUEAAggwcAANUQADCEBwAA1RAAMIUHAADVEAAwhgcAANUQADCHBwAA1xAAMIgHAADYEAAwC0YAAMgQADBHAADMEAAwgAcAAMkQADCBBwAAyhAAMIIHAADLEAAggwcAAPoKADCEBwAA-goAMIUHAAD6CgAwhgcAAPoKADCHBwAAzRAAMIgHAAD9CgAwC0YAAL8QADBHAADDEAAwgAcAAMAQADCBBwAAwRAAMIIHAADCEAAggwcAALMMADCEBwAAswwAMIUHAACzDAAwhgcAALMMADCHBwAAxBAAMIgHAAC2DAAwB0YAALoQACBHAAC9EAAggAcAALsQACCBBwAAvBAAIIQHAADEAQAghQcAAMQBACCGBwAAkwYAIAcMAAD4CwAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAfgFIAAAAAH5BQEAAAABAgAAAJMGACBGAAC6EAAgAwAAAMQBACBGAAC6EAAgRwAAvhAAIAkAAADEAQAgDAAA6gsAID8AAL4QACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIfgFIAC5CgAh-QUBALcKACEHDAAA6gsAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh-AUgALkKACH5BQEAtwoAIRYJAADCCgAgEQAAwQoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABAgAAAGQAIEYAAMcQACADAAAAZAAgRgAAxxAAIEcAAMYQACABPwAAghIAMAIAAABkACA_AADGEAAgAgAAALcMACA_AADFEAAgFKUFAQC2CgAhpgUBALYKACGnBQEAtwoAIakFAQC3CgAhqgUBALcKACGrBQEAtwoAIawFCAC4CgAhrQUBALcKACGuBQEAtwoAIa8FAQC3CgAhsAUBALcKACGxBSAAuQoAIbIFIAC5CgAhswVAALoKACG0BUAAugoAIbUFAgC7CgAhtgVAALoKACG3BQEAtwoAIbgFgAAAAAG5BUAAvAoAIRYJAAC_CgAgEQAAvgoAIKUFAQC2CgAhpgUBALYKACGnBQEAtwoAIakFAQC3CgAhqgUBALcKACGrBQEAtwoAIawFCAC4CgAhrQUBALcKACGuBQEAtwoAIa8FAQC3CgAhsAUBALcKACGxBSAAuQoAIbIFIAC5CgAhswVAALoKACG0BUAAugoAIbUFAgC7CgAhtgVAALoKACG3BQEAtwoAIbgFgAAAAAG5BUAAvAoAIRYJAADCCgAgEQAAwQoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAawFCAAAAAGtBQEAAAABrgUBAAAAAa8FAQAAAAGwBQEAAAABsQUgAAAAAbIFIAAAAAGzBUAAAAABtAVAAAAAAbUFAgAAAAG2BUAAAAABtwUBAAAAAbgFgAAAAAG5BUAAAAABDAYAAIULACA1AACCCwAgOAAAhAsAIKUFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQIAAACtAQAgRgAA0BAAIAMAAACtAQAgRgAA0BAAIEcAAM8QACABPwAAgRIAMAIAAACtAQAgPwAAzxAAIAIAAAD-CgAgPwAAzhAAIAmlBQEAtgoAIbkFQAC8CgAh1QUBALYKACHZBUAAvAoAId4FAQC2CgAh3wUBALcKACHgBQEAtwoAIeEFIAC5CgAh4gUBALcKACEMBgAA9AoAIDUAAPIKACA4AAD1CgAgpQUBALYKACG5BUAAvAoAIdUFAQC2CgAh2QVAALwKACHeBQEAtgoAId8FAQC3CgAh4AUBALcKACHhBSAAuQoAIeIFAQC3CgAhDAYAAIULACA1AACCCwAgOAAAhAsAIKUFAQAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQalBQEAAAABqQUBAAAAAbkFQAAAAAHLBQEAAAABzAUCAAAAAc0FgAAAAAECAAAAqAEAIEYAANwQACADAAAAqAEAIEYAANwQACBHAADbEAAgAT8AAIASADALAwAA2gkAIKIFAADcCQAwowUAAKYBABCkBQAA3AkAMKUFAQAAAAGoBQEA_QgAIakFAQD9CAAhuQVAAPkIACHLBQEA-AgAIcwFAgCfCQAhzQUAAIQJACACAAAAqAEAID8AANsQACACAAAA2RAAID8AANoQACAKogUAANgQADCjBQAA2RAAEKQFAADYEAAwpQUBAPgIACGoBQEA_QgAIakFAQD9CAAhuQVAAPkIACHLBQEA-AgAIcwFAgCfCQAhzQUAAIQJACAKogUAANgQADCjBQAA2RAAEKQFAADYEAAwpQUBAPgIACGoBQEA_QgAIakFAQD9CAAhuQVAAPkIACHLBQEA-AgAIcwFAgCfCQAhzQUAAIQJACAGpQUBALYKACGpBQEAtwoAIbkFQAC8CgAhywUBALYKACHMBQIAyAoAIc0FgAAAAAEGpQUBALYKACGpBQEAtwoAIbkFQAC8CgAhywUBALYKACHMBQIAyAoAIc0FgAAAAAEGpQUBAAAAAakFAQAAAAG5BUAAAAABywUBAAAAAcwFAgAAAAHNBYAAAAABCAkAANAKACClBQEAAAABqQUBAAAAAasFAQAAAAGwBQEAAAABzgUBAAAAAc8FAQAAAAHQBUAAAAABAgAAAF8AIEYAAOUQACADAAAAXwAgRgAA5RAAIEcAAOQQACABPwAA_xEAMAIAAABfACA_AADkEAAgAgAAAIAPACA_AADjEAAgB6UFAQC2CgAhqQUBALcKACGrBQEAtgoAIbAFAQC3CgAhzgUBALcKACHPBQEAtwoAIdAFQAC8CgAhCAkAAM4KACClBQEAtgoAIakFAQC3CgAhqwUBALYKACGwBQEAtwoAIc4FAQC3CgAhzwUBALcKACHQBUAAvAoAIQgJAADQCgAgpQUBAAAAAakFAQAAAAGrBQEAAAABsAUBAAAAAc4FAQAAAAHPBQEAAAAB0AVAAAAAARADAADnDQAgCQAA6A0AIKUFAQAAAAGoBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB4QUgAAAAAesFAQAAAAG9BgIAAAABvgYBAAAAAb8GIAAAAAHABgIAAAABwQYCAAAAAcIGAQAAAAHDBkAAAAABAgAAAFMAIEYAAO4QACADAAAAUwAgRgAA7hAAIEcAAO0QACABPwAA_hEAMAIAAABTACA_AADtEAAgAgAAAJoPACA_AADsEAAgDqUFAQC2CgAhqAUBALYKACGrBQEAtgoAIbkFQAC8CgAh2QVAALwKACHhBSAAuQoAIesFAQC3CgAhvQYCALsKACG-BgEAtwoAIb8GIAC5CgAhwAYCALsKACHBBgIAuwoAIcIGAQC3CgAhwwZAALoKACEQAwAA5A0AIAkAAOUNACClBQEAtgoAIagFAQC2CgAhqwUBALYKACG5BUAAvAoAIdkFQAC8CgAh4QUgALkKACHrBQEAtwoAIb0GAgC7CgAhvgYBALcKACG_BiAAuQoAIcAGAgC7CgAhwQYCALsKACHCBgEAtwoAIcMGQAC6CgAhEAMAAOcNACAJAADoDQAgpQUBAAAAAagFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHhBSAAAAAB6wUBAAAAAb0GAgAAAAG-BgEAAAABvwYgAAAAAcAGAgAAAAHBBgIAAAABwgYBAAAAAcMGQAAAAAEHLgAA7goAIKUFAQAAAAG5BUAAAAAB2AUAAADdBQLZBUAAAAAB2wUBAAAAAd0FAQAAAAECAAAAogEAIEYAAPoQACADAAAAogEAIEYAAPoQACBHAAD5EAAgAT8AAP0RADAMLQAAiQkAIC4AAN8JACCiBQAA3QkAMKMFAACgAQAQpAUAAN0JADClBQEAAAABuQVAAPkIACHYBQAA3gndBSLZBUAA-QgAIdoFAQD4CAAh2wUBAPgIACHdBQEA_QgAIQIAAACiAQAgPwAA-RAAIAIAAAD3EAAgPwAA-BAAIAqiBQAA9hAAMKMFAAD3EAAQpAUAAPYQADClBQEA-AgAIbkFQAD5CAAh2AUAAN4J3QUi2QVAAPkIACHaBQEA-AgAIdsFAQD4CAAh3QUBAP0IACEKogUAAPYQADCjBQAA9xAAEKQFAAD2EAAwpQUBAPgIACG5BUAA-QgAIdgFAADeCd0FItkFQAD5CAAh2gUBAPgIACHbBQEA-AgAId0FAQD9CAAhBqUFAQC2CgAhuQVAALwKACHYBQAA3grdBSLZBUAAvAoAIdsFAQC2CgAh3QUBALcKACEHLgAA4AoAIKUFAQC2CgAhuQVAALwKACHYBQAA3grdBSLZBUAAvAoAIdsFAQC2CgAh3QUBALcKACEHLgAA7goAIKUFAQAAAAG5BUAAAAAB2AUAAADdBQLZBUAAAAAB2wUBAAAAAd0FAQAAAAEJLwAA2QoAIKUFAQAAAAG5BUAAAAAB0QUBAAAAAdQFAAAA1AUC1QUBAAAAAdYFgAAAAAHYBQAAANgFAtkFQAAAAAECAAAAnAEAIEYAAIMRACADAAAAnAEAIEYAAIMRACBHAACCEQAgAT8AAPwRADACAAAAnAEAID8AAIIRACACAAAA6QoAID8AAIERACAIpQUBALYKACG5BUAAvAoAIdEFAQC2CgAh1AUAANUK1AUi1QUBALYKACHWBYAAAAAB2AUAANYK2AUi2QVAALwKACEJLwAA1woAIKUFAQC2CgAhuQVAALwKACHRBQEAtgoAIdQFAADVCtQFItUFAQC2CgAh1gWAAAAAAdgFAADWCtgFItkFQAC8CgAhCS8AANkKACClBQEAAAABuQVAAAAAAdEFAQAAAAHUBQAAANQFAtUFAQAAAAHWBYAAAAAB2AUAAADYBQLZBUAAAAABBAwAAN0NACClBQEAAAABuQVAAAAAAdkFQAAAAAECAAAAgwQAIEYAAIQRACADAAAAmAEAIEYAAIQRACBHAACIEQAgBgAAAJgBACAMAADPDQAgPwAAiBEAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIQQMAADPDQAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAhHQQAAPkMACAFAADBDQAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAACREQAgAwAAAAkAIEYAAJERACBHAACQEQAgAT8AAPsRADACAAAACQAgPwAAkBEAIAIAAACkDAAgPwAAjxEAIBalBQEAtgoAIbkFQAC8CgAh2AUAAKYMpAYi2QVAALwKACGDBgEAtwoAIasGEACXDAAhrAYBALYKACGtBgEAtgoAIa4GgAAAAAGvBgEAtwoAIbAGAQC3CgAhsQYQAJcMACGyBhAAlwwAIbMGEACXDAAhtAYQAJcMACG1BgEAtwoAIbYGQAC8CgAhtwZAALoKACG4BkAAugoAIbkGQAC6CgAhugZAALoKACG7BkAAugoAIR0EAACpDAAgBQAAwA0AIAwAAKoMACAgAACuDAAgJAAAqwwAICUAAKwMACAoAACtDAAgpQUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEdBAAA-QwAIAUAAMENACAMAAD6DAAgIAAA_gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABEAkAAOgNACAbAADpDQAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvQYCAAAAAb4GAQAAAAG_BiAAAAABwAYCAAAAAcEGAgAAAAHCBgEAAAABwwZAAAAAAcQGAQAAAAECAAAAUwAgRgAAmhEAIAMAAABTACBGAACaEQAgRwAAmREAIAE_AAD6EQAwAgAAAFMAID8AAJkRACACAAAAmg8AID8AAJgRACAOpQUBALYKACGrBQEAtgoAIbkFQAC8CgAh2QVAALwKACHhBSAAuQoAIesFAQC3CgAhvQYCALsKACG-BgEAtwoAIb8GIAC5CgAhwAYCALsKACHBBgIAuwoAIcIGAQC3CgAhwwZAALoKACHEBgEAtwoAIRAJAADlDQAgGwAA5g0AIKUFAQC2CgAhqwUBALYKACG5BUAAvAoAIdkFQAC8CgAh4QUgALkKACHrBQEAtwoAIb0GAgC7CgAhvgYBALcKACG_BiAAuQoAIcAGAgC7CgAhwQYCALsKACHCBgEAtwoAIcMGQAC6CgAhxAYBALcKACEQCQAA6A0AIBsAAOkNACClBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB4QUgAAAAAesFAQAAAAG9BgIAAAABvgYBAAAAAb8GIAAAAAHABgIAAAABwQYCAAAAAcIGAQAAAAHDBkAAAAABxAYBAAAAAQSlBQEAAAABuQVAAAAAAdkFQAAAAAHiBgEAAAABAgAAAJQCACBGAACbEQAgAwAAAJQBACBGAACbEQAgRwAAnxEAIAYAAACUAQAgPwAAnxEAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeIGAQC2CgAhBKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeIGAQC2CgAhC6UFAQAAAAG5BUAAAAAB2QVAAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBkAAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAABAgAAAJIBACBGAACrEQAgAwAAAJIBACBGAACrEQAgRwAAqhEAIAE_AAD5EQAwEQMAAIkJACCiBQAA5QkAMKMFAACQAQAQpAUAAOUJADClBQEAAAABqAUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4wYBAPgIACHkBgEA-AgAIeUGAQD9CAAh5gYBAP0IACHnBkAAgQkAIegGAQD9CAAh6QYBAP0IACHqBgEA_QgAIfUGAADkCQAgAgAAAJIBACA_AACqEQAgAgAAAKgRACA_AACpEQAgD6IFAACnEQAwowUAAKgRABCkBQAApxEAMKUFAQD4CAAhqAUBAPgIACG5BUAA-QgAIdkFQAD5CAAh4wYBAPgIACHkBgEA-AgAIeUGAQD9CAAh5gYBAP0IACHnBkAAgQkAIegGAQD9CAAh6QYBAP0IACHqBgEA_QgAIQ-iBQAApxEAMKMFAACoEQAQpAUAAKcRADClBQEA-AgAIagFAQD4CAAhuQVAAPkIACHZBUAA-QgAIeMGAQD4CAAh5AYBAPgIACHlBgEA_QgAIeYGAQD9CAAh5wZAAIEJACHoBgEA_QgAIekGAQD9CAAh6gYBAP0IACELpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh4wYBALYKACHkBgEAtgoAIeUGAQC3CgAh5gYBALcKACHnBkAAugoAIegGAQC3CgAh6QYBALcKACHqBgEAtwoAIQulBQEAtgoAIbkFQAC8CgAh2QVAALwKACHjBgEAtgoAIeQGAQC2CgAh5QYBALcKACHmBgEAtwoAIecGQAC6CgAh6AYBALcKACHpBgEAtwoAIeoGAQC3CgAhC6UFAQAAAAG5BUAAAAAB2QVAAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBkAAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAABB6UFAQAAAAGvBQEAAAABsAUBAAAAAbkFQAAAAAHZBUAAAAAB5wZAAAAAAesGAQAAAAECAAAAjgEAIEYAALcRACADAAAAjgEAIEYAALcRACBHAAC2EQAgAT8AAPgRADAMAwAAiQkAIKIFAADmCQAwowUAAIwBABCkBQAA5gkAMKUFAQAAAAGoBQEA-AgAIa8FAQD9CAAhsAUBAP0IACG5BUAA-QgAIdkFQAD5CAAh5wZAAPkIACHrBgEAAAABAgAAAI4BACA_AAC2EQAgAgAAALQRACA_AAC1EQAgC6IFAACzEQAwowUAALQRABCkBQAAsxEAMKUFAQD4CAAhqAUBAPgIACGvBQEA_QgAIbAFAQD9CAAhuQVAAPkIACHZBUAA-QgAIecGQAD5CAAh6wYBAPgIACELogUAALMRADCjBQAAtBEAEKQFAACzEQAwpQUBAPgIACGoBQEA-AgAIa8FAQD9CAAhsAUBAP0IACG5BUAA-QgAIdkFQAD5CAAh5wZAAPkIACHrBgEA-AgAIQelBQEAtgoAIa8FAQC3CgAhsAUBALcKACG5BUAAvAoAIdkFQAC8CgAh5wZAALwKACHrBgEAtgoAIQelBQEAtgoAIa8FAQC3CgAhsAUBALcKACG5BUAAvAoAIdkFQAC8CgAh5wZAALwKACHrBgEAtgoAIQelBQEAAAABrwUBAAAAAbAFAQAAAAG5BUAAAAAB2QVAAAAAAecGQAAAAAHrBgEAAAABDSMAAJcQACClBQEAAAABuQVAAAAAAdkFQAAAAAHZBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAAB3QYBAAAAAd4GAQAAAAHfBgEAAAAB4AYBAAAAAeEGIAAAAAECAAAABQAgRgAAwxEAIAMAAAAFACBGAADDEQAgRwAAwhEAIAE_AAD3EQAwEgMAAIkJACAjAACiCQAgogUAAK8KADCjBQAAAwAQpAUAAK8KADClBQEAAAABqAUBAPgIACG5BUAA-QgAIdkFQAD5CAAh2QYBAP0IACHaBgEA_QgAIdsGAQD9CAAh3AYBAPgIACHdBgEA-AgAId4GAQD9CAAh3wYBAP0IACHgBgEA-AgAIeEGIACCCQAhAgAAAAUAID8AAMIRACACAAAAwBEAID8AAMERACAQogUAAL8RADCjBQAAwBEAEKQFAAC_EQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHZBgEA_QgAIdoGAQD9CAAh2wYBAP0IACHcBgEA-AgAId0GAQD4CAAh3gYBAP0IACHfBgEA_QgAIeAGAQD4CAAh4QYgAIIJACEQogUAAL8RADCjBQAAwBEAEKQFAAC_EQAwpQUBAPgIACGoBQEA-AgAIbkFQAD5CAAh2QVAAPkIACHZBgEA_QgAIdoGAQD9CAAh2wYBAP0IACHcBgEA-AgAId0GAQD4CAAh3gYBAP0IACHfBgEA_QgAIeAGAQD4CAAh4QYgAIIJACEMpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh2QYBALcKACHaBgEAtwoAIdsGAQC3CgAh3AYBALYKACHdBgEAtgoAId4GAQC3CgAh3wYBALcKACHgBgEAtgoAIeEGIAC5CgAhDSMAAIwQACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHZBgEAtwoAIdoGAQC3CgAh2wYBALcKACHcBgEAtgoAId0GAQC2CgAh3gYBALcKACHfBgEAtwoAIeAGAQC2CgAh4QYgALkKACENIwAAlxAAIKUFAQAAAAG5BUAAAAAB2QVAAAAAAdkGAQAAAAHaBgEAAAAB2wYBAAAAAdwGAQAAAAHdBgEAAAAB3gYBAAAAAd8GAQAAAAHgBgEAAAAB4QYgAAAAAQRGAAC4EQAwgAcAALkRADCCBwAAuxEAIIYHAAC8EQAwBEYAAKwRADCABwAArREAMIIHAACvEQAghgcAALARADAERgAAoBEAMIAHAAChEQAwggcAAKMRACCGBwAApBEAMANGAACbEQAggAcAAJwRACCGBwAAlAIAIARGAACSEQAwgAcAAJMRADCCBwAAlREAIIYHAACWDwAwBEYAAIkRADCABwAAihEAMIIHAACMEQAghgcAAKAMADADRgAAhBEAIIAHAACFEQAghgcAAIMEACAERgAA-xAAMIAHAAD8EAAwggcAAP4QACCGBwAA5QoAMARGAADvEAAwgAcAAPAQADCCBwAA8hAAIIYHAADzEAAwBEYAAOYQADCABwAA5xAAMIIHAADpEAAghgcAAJYPADAERgAA3RAAMIAHAADeEAAwggcAAOAQACCGBwAA_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_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_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_AACmEgAgpQUBALYKACG4BYAAAAABuQVAALwKACHZBUAAvAoAIeQFAQC3CgAh5gUBALYKACHqBQEAtwoAIesFAQC2CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHMBgEAtwoAIc0GAQC3CgAhzgYQAJgMACHPBhAAmAwAIdAGEACYDAAh0QYCAMgKACHSBgEAtwoAIdMGAQC3CgAh1AYCALsKACHVBiAAuQoAIdYGIAC5CgAh1wYgALkKACEfCgAA4A4AIBgAAN4OACAaAADfDgAgHAAA4Q4AIB8AAOMOACAgAADkDgAgIQAA5Q4AIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIeYFAQC2CgAh6gUBALcKACHrBQEAtgoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhzAYBALcKACHNBgEAtwoAIc4GEACYDAAhzwYQAJgMACHQBhAAmAwAIdEGAgDICgAh0gYBALcKACHTBgEAtwoAIdQGAgC7CgAh1QYgALkKACHWBiAAuQoAIdcGIAC5CgAhEQYAAIcQACAHAACDEAAgCgAAhRAAIBkAAIYQACClBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcgGAgAAAAHYBgEAAAABAgAAABUAIEYAAKcSACAFpQUBAAAAAbkFQAAAAAHZBUAAAAAB6wUBAAAAAY8GIAAAAAELpQUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAfcFAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgIAAAAByQYgAAAAAcoGAQAAAAEOpQUBAAAAAagFAQAAAAG5BUAAAAAB2QVAAAAAAeEFIAAAAAHrBQEAAAABvQYCAAAAAb4GAQAAAAG_BiAAAAABwAYCAAAAAcEGAgAAAAHCBgEAAAABwwZAAAAAAcQGAQAAAAEFpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAECAAAA2gIAIEYAAKwSACADAAAA3QIAIEYAAKwSACBHAACwEgAgBwAAAN0CACA_AACwEgAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5QUBALYKACHmBQEAtgoAIQWlBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIeYFAQC2CgAhArkFQAAAAAHjBQEAAAABB6UFAQAAAAGoBQEAAAABqQUBAAAAAbAFAQAAAAHOBQEAAAABzwUBAAAAAdAFQAAAAAEUpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEBgwYBAAAAAQMAAAARACBGAACnEgAgRwAAtxIAIBMAAAARACAGAADUDwAgBwAA1Q8AIAoAANcPACAZAADYDwAgPwAAtxIAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeIFAQC3CgAh5QUBALYKACHmBQEAtgoAIeoFAQC3CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHIBgIAuwoAIdgGAQC3CgAhEQYAANQPACAHAADVDwAgCgAA1w8AIBkAANgPACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHiBQEAtwoAIeUFAQC2CgAh5gUBALYKACHqBQEAtwoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhyAYCALsKACHYBgEAtwoAIR8KAAC1DwAgGAAAsw8AIBwAALYPACAeAAC3DwAgHwAAuA8AICAAALkPACAhAAC6DwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzAYBAAAAAc0GAQAAAAHOBhAAAAABzwYQAAAAAdAGEAAAAAHRBgIAAAAB0gYBAAAAAdMGAQAAAAHUBgIAAAAB1QYgAAAAAdYGIAAAAAHXBiAAAAABAgAAABkAIEYAALgSACALpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAH3BQEAAAABxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYCAAAAAckGIAAAAAEKpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQMAAAAXACBGAAC4EgAgRwAAvhIAICEAAAAXACAKAADgDgAgGAAA3g4AIBwAAOEOACAeAADiDgAgHwAA4w4AICAAAOQOACAhAADlDgAgPwAAvhIAIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIeYFAQC2CgAh6gUBALcKACHrBQEAtgoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhzAYBALcKACHNBgEAtwoAIc4GEACYDAAhzwYQAJgMACHQBhAAmAwAIdEGAgDICgAh0gYBALcKACHTBgEAtwoAIdQGAgC7CgAh1QYgALkKACHWBiAAuQoAIdcGIAC5CgAhHwoAAOAOACAYAADeDgAgHAAA4Q4AIB4AAOIOACAfAADjDgAgIAAA5A4AICEAAOUOACClBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACHmBQEAtgoAIeoFAQC3CgAh6wUBALYKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcwGAQC3CgAhzQYBALcKACHOBhAAmAwAIc8GEACYDAAh0AYQAJgMACHRBgIAyAoAIdIGAQC3CgAh0wYBALcKACHUBgIAuwoAIdUGIAC5CgAh1gYgALkKACHXBiAAuQoAIQgJAADWDgAgCgAA1w4AIKUFAQAAAAGrBQEAAAABuQVAAAAAAdkFQAAAAAHrBQEAAAABjwYgAAAAAQIAAABOACBGAAC_EgAgBaUFAQAAAAG5BUAAAAAB2QVAAAAAAfwFAgAAAAG8BgEAAAABDKUFAQAAAAGqBQEAAAABqwUBAAAAAbkFQAAAAAH8BQIAAAABpQYBAAAAAaYGAQAAAAGnBgEAAAABqAaAAAAAAakGEAAAAAGqBhAAAAABqwYQAAAAAQulBQEAAAABqwUBAAAAAbkFQAAAAAHZBUAAAAAB5AUBAAAAAcUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAgAAAAHJBiAAAAABygYBAAAAAQqlBQEAAAABuQVAAAAAAfsFAAAA-wUC_AUCAAAAAf0FAgAAAAH-BQIAAAAB_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAQOlBQEAAAABuQVAAAAAAfYFAQAAAAEDAAAAIAAgRgAAvxIAIEcAAMgSACAKAAAAIAAgCQAAvg4AIAoAAL8OACA_AADIEgAgpQUBALYKACGrBQEAtgoAIbkFQAC8CgAh2QVAALwKACHrBQEAtgoAIY8GIAC5CgAhCAkAAL4OACAKAAC_DgAgpQUBALYKACGrBQEAtgoAIbkFQAC8CgAh2QVAALwKACHrBQEAtgoAIY8GIAC5CgAhEQYAAIcQACAHAACDEAAgCAAAhBAAIBkAAIYQACClBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcgGAgAAAAHYBgEAAAABAgAAABUAIEYAAMkSACAQCwAAtQ4AIBAAALYOACASAAC3DgAgFAAAuQ4AIBYAALoOACClBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABywYBAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQIAAAAlACBGAADLEgAgCAkAANYOACAXAADYDgAgpQUBAAAAAasFAQAAAAG5BUAAAAAB2QVAAAAAAesFAQAAAAGPBiAAAAABAgAAAE4AIEYAAM0SACAfGAAAsw8AIBoAALQPACAcAAC2DwAgHgAAtw8AIB8AALgPACAgAAC5DwAgIQAAug8AIKUFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAdIGAQAAAAHTBgEAAAAB1AYCAAAAAdUGIAAAAAHWBiAAAAAB1wYgAAAAAQIAAAAZACBGAADPEgAgAwAAABEAIEYAAMkSACBHAADTEgAgEwAAABEAIAYAANQPACAHAADVDwAgCAAA1g8AIBkAANgPACA_AADTEgAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh4gUBALcKACHlBQEAtgoAIeYFAQC2CgAh6gUBALcKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcgGAgC7CgAh2AYBALcKACERBgAA1A8AIAcAANUPACAIAADWDwAgGQAA2A8AIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeIFAQC3CgAh5QUBALYKACHmBQEAtgoAIeoFAQC3CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHIBgIAuwoAIdgGAQC3CgAhAwAAACMAIEYAAMsSACBHAADWEgAgEgAAACMAIAsAAPwNACAQAAD9DQAgEgAA_g0AIBQAAIAOACAWAACBDgAgPwAA1hIAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIY8GIAC5CgAhywYBALYKACHMBgEAtgoAIc0GAQC3CgAhzgYQAJcMACHPBhAAmAwAIdAGEACYDAAh0QYCALsKACEQCwAA_A0AIBAAAP0NACASAAD-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_AADxEgAgpQUBALYKACGwBQEAtwoAIbgFgAAAAAG5BUAAvAoAIdgFAACqEPAGItkFQAC8CgAh5QUBALcKACHYBgEAtwoAIdsGAQC3CgAh7AYBALYKACHtBiAAuQoAIe4GAADVCtQFIvAGQAC6CgAh8QYBALcKACHyBgEAtwoAIR0VAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhsAUBALcKACG4BYAAAAABuQVAALwKACHYBQAAqhDwBiLZBUAAvAoAIeUFAQC3CgAh2AYBALcKACHbBgEAtwoAIewGAQC2CgAh7QYgALkKACHuBgAA1QrUBSLwBkAAugoAIfEGAQC3CgAh8gYBALcKACEQCgAAuA4AIAsAALUOACASAAC3DgAgFAAAuQ4AIBYAALoOACClBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABywYBAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQIAAAAlACBGAADyEgAgBQMAANwNACClBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAABAgAAAIMEACBGAAD0EgAgAwAAACMAIEYAAPISACBHAAD4EgAgEgAAACMAIAoAAP8NACALAAD8DQAgEgAA_g0AIBQAAIAOACAWAACBDgAgPwAA-BIAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIY8GIAC5CgAhywYBALYKACHMBgEAtgoAIc0GAQC3CgAhzgYQAJcMACHPBhAAmAwAIdAGEACYDAAh0QYCALsKACEQCgAA_w0AIAsAAPwNACASAAD-DQAgFAAAgA4AIBYAAIEOACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACGPBiAAuQoAIcsGAQC2CgAhzAYBALYKACHNBgEAtwoAIc4GEACXDAAhzwYQAJgMACHQBhAAmAwAIdEGAgC7CgAhAwAAAJgBACBGAAD0EgAgRwAA-xIAIAcAAACYAQAgAwAAzg0AID8AAPsSACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHZBUAAvAoAIQUDAADODQAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACESCAAAlw0AICIAAJgNACClBQEAAAABuQVAAAAAAdkFQAAAAAHqBQEAAAABhAYBAAAAAYYGAAAAhgYChwYQAAAAAYgGEAAAAAGJBhAAAAABigYCAAAAAYsGAgAAAAGMBgIAAAABjQZAAAAAAY4GQAAAAAGPBiAAAAABkAYgAAAAAQIAAAC5BQAgRgAA_BIAIAMAAAALACBGAAD8EgAgRwAAgBMAIBQAAAALACAIAACZDAAgIgAAmgwAID8AAIATACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHqBQEAtwoAIYQGAQC2CgAhhgYAAJYMhgYihwYQAJcMACGIBhAAmAwAIYkGEACYDAAhigYCAMgKACGLBgIAuwoAIYwGAgDICgAhjQZAALwKACGOBkAAvAoAIY8GIAC5CgAhkAYgALkKACESCAAAmQwAICIAAJoMACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHqBQEAtwoAIYQGAQC2CgAhhgYAAJYMhgYihwYQAJcMACGIBhAAmAwAIYkGEACYDAAhigYCAMgKACGLBgIAuwoAIYwGAgDICgAhjQZAALwKACGOBkAAvAoAIY8GIAC5CgAhkAYgALkKACEeAwAA-AwAIAQAAPkMACAFAADBDQAgIAAA_gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAACBEwAgAwAAAAcAIEYAAIETACBHAACFEwAgIAAAAAcAIAMAAKgMACAEAACpDAAgBQAAwA0AICAAAK4MACAkAACrDAAgJQAArAwAICgAAK0MACA_AACFEwAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2AUAAKYMpAYi2QVAALwKACGDBgEAtwoAIasGEACXDAAhrAYBALYKACGtBgEAtgoAIa4GgAAAAAGvBgEAtwoAIbAGAQC3CgAhsQYQAJcMACGyBhAAlwwAIbMGEACXDAAhtAYQAJcMACG1BgEAtwoAIbYGQAC8CgAhtwZAALoKACG4BkAAugoAIbkGQAC6CgAhugZAALoKACG7BkAAugoAIR4DAACoDAAgBAAAqQwAIAUAAMANACAgAACuDAAgJAAAqwwAICUAAKwMACAoAACtDAAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2AUAAKYMpAYi2QVAALwKACGDBgEAtwoAIasGEACXDAAhrAYBALYKACGtBgEAtgoAIa4GgAAAAAGvBgEAtwoAIbAGAQC3CgAhsQYQAJcMACGyBhAAlwwAIbMGEACXDAAhtAYQAJcMACG1BgEAtwoAIbYGQAC8CgAhtwZAALoKACG4BkAAugoAIbkGQAC6CgAhugZAALoKACG7BkAAugoAIR4DAAD4DAAgBAAA-QwAIAUAAMENACAMAAD6DAAgIAAA_gwAICQAAPsMACAoAAD9DAAgpQUBAAAAAagFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABgwYBAAAAAasGEAAAAAGsBgEAAAABrQYBAAAAAa4GgAAAAAGvBgEAAAABsAYBAAAAAbEGEAAAAAGyBhAAAAABswYQAAAAAbQGEAAAAAG1BgEAAAABtgZAAAAAAbcGQAAAAAG4BkAAAAABuQZAAAAAAboGQAAAAAG7BkAAAAABAgAAAAkAIEYAAIYTACADAAAABwAgRgAAhhMAIEcAAIoTACAgAAAABwAgAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICAAAK4MACAkAACrDAAgKAAArQwAID8AAIoTACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHYBQAApgykBiLZBUAAvAoAIYMGAQC3CgAhqwYQAJcMACGsBgEAtgoAIa0GAQC2CgAhrgaAAAAAAa8GAQC3CgAhsAYBALcKACGxBhAAlwwAIbIGEACXDAAhswYQAJcMACG0BhAAlwwAIbUGAQC3CgAhtgZAALwKACG3BkAAugoAIbgGQAC6CgAhuQZAALoKACG6BkAAugoAIbsGQAC6CgAhHgMAAKgMACAEAACpDAAgBQAAwA0AIAwAAKoMACAgAACuDAAgJAAAqwwAICgAAK0MACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHYBQAApgykBiLZBUAAvAoAIYMGAQC3CgAhqwYQAJcMACGsBgEAtgoAIa0GAQC2CgAhrgaAAAAAAa8GAQC3CgAhsAYBALcKACGxBhAAlwwAIbIGEACXDAAhswYQAJcMACG0BhAAlwwAIbUGAQC3CgAhtgZAALwKACG3BkAAugoAIbgGQAC6CgAhuQZAALoKACG6BkAAugoAIbsGQAC6CgAhHgMAAPgMACAEAAD5DAAgBQAAwQ0AIAwAAPoMACAgAAD-DAAgJAAA-wwAICUAAPwMACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGDBgEAAAABqwYQAAAAAawGAQAAAAGtBgEAAAABrgaAAAAAAa8GAQAAAAGwBgEAAAABsQYQAAAAAbIGEAAAAAGzBhAAAAABtAYQAAAAAbUGAQAAAAG2BkAAAAABtwZAAAAAAbgGQAAAAAG5BkAAAAABugZAAAAAAbsGQAAAAAECAAAACQAgRgAAixMAIAMAAAAHACBGAACLEwAgRwAAjxMAICAAAAAHACADAACoDAAgBAAAqQwAIAUAAMANACAMAACqDAAgIAAArgwAICQAAKsMACAlAACsDAAgPwAAjxMAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEeAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICAAAK4MACAkAACrDAAgJQAArAwAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACENEQAArg0AIKUFAQAAAAGqBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAKMGAtkFQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAZAAAAAAaEGQAAAAAECAAAAfwAgRgAAkBMAIAMAAAB9ACBGAACQEwAgRwAAlBMAIA8AAAB9ACARAACtDQAgPwAAlBMAIKUFAQC2CgAhqgUBALYKACG4BYAAAAABuQVAALwKACHYBQAAxQyjBiLZBUAAvAoAIZwGAQC2CgAhnQYBALYKACGeBgEAtwoAIZ8GAQC3CgAhoAZAALoKACGhBkAAugoAIQ0RAACtDQAgpQUBALYKACGqBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdgFAADFDKMGItkFQAC8CgAhnAYBALYKACGdBgEAtgoAIZ4GAQC3CgAhnwYBALcKACGgBkAAugoAIaEGQAC6CgAhHgMAAPgMACAEAAD5DAAgBQAAwQ0AIAwAAPoMACAgAAD-DAAgJQAA_AwAICgAAP0MACClBQEAAAABqAUBAAAAAbkFQAAAAAHYBQAAAKQGAtkFQAAAAAGDBgEAAAABqwYQAAAAAawGAQAAAAGtBgEAAAABrgaAAAAAAa8GAQAAAAGwBgEAAAABsQYQAAAAAbIGEAAAAAGzBhAAAAABtAYQAAAAAbUGAQAAAAG2BkAAAAABtwZAAAAAAbgGQAAAAAG5BkAAAAABugZAAAAAAbsGQAAAAAECAAAACQAgRgAAlRMAIAMAAAAHACBGAACVEwAgRwAAmRMAICAAAAAHACADAACoDAAgBAAAqQwAIAUAAMANACAMAACqDAAgIAAArgwAICUAAKwMACAoAACtDAAgPwAAmRMAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEeAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICAAAK4MACAlAACsDAAgKAAArQwAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEBqwUBAAAAAQHkBQEAAAABDgMAAJYQACClBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB2QYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAd0GAQAAAAHeBgEAAAAB3wYBAAAAAeAGAQAAAAHhBiAAAAABAgAAAAUAIEYAAJwTACAdDgAAyhEAIBUAANIRACAcAADIEQAgHwAAzhEAICAAANERACApAADEEQAgKgAAxREAICsAAMYRACAsAADHEQAgMQAAyxEAIDIAAMwRACAzAADNEQAgNAAAzxEAIDkAANARACClBQEAAAABsAUBAAAAAbgFgAAAAAG5BUAAAAAB2AUAAADwBgLZBUAAAAAB5QUBAAAAAdgGAQAAAAHbBgEAAAAB7AYBAAAAAe0GIAAAAAHuBgAAANQFAvAGQAAAAAHxBgEAAAAB8gYBAAAAAQIAAAABACBGAACeEwAgEAoAALgOACALAAC1DgAgEAAAtg4AIBQAALkOACAWAAC6DgAgpQUBAAAAAbkFQAAAAAHZBUAAAAABjwYgAAAAAcsGAQAAAAHMBgEAAAABzQYBAAAAAc4GEAAAAAHPBhAAAAAB0AYQAAAAAdEGAgAAAAECAAAAJQAgRgAAoBMAIAMAAAAjACBGAACgEwAgRwAApBMAIBIAAAAjACAKAAD_DQAgCwAA_A0AIBAAAP0NACAUAACADgAgFgAAgQ4AID8AAKQTACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACGPBiAAuQoAIcsGAQC2CgAhzAYBALYKACHNBgEAtwoAIc4GEACXDAAhzwYQAJgMACHQBhAAmAwAIdEGAgC7CgAhEAoAAP8NACALAAD8DQAgEAAA_Q0AIBQAAIAOACAWAACBDgAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAhjwYgALkKACHLBgEAtgoAIcwGAQC2CgAhzQYBALcKACHOBhAAlwwAIc8GEACYDAAh0AYQAJgMACHRBgIAuwoAIQylBQEAAAABqwUBAAAAAbkFQAAAAAH3BQEAAAAB_AUCAAAAAaUGAQAAAAGmBgEAAAABpwYBAAAAAagGgAAAAAGpBhAAAAABqgYQAAAAAasGEAAAAAEFpQUBAAAAAbkFQAAAAAHYBQAAAKQGAoEGAQAAAAGkBgEAAAABBqUFAQAAAAG5BUAAAAAB2AUBAAAAAeoFAQAAAAGaBgEAAAABmwZAAAAAAQulBQEAAAABuAWAAAAAAbkFQAAAAAHYBQAAAKMGAtkFQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAZAAAAAAaEGQAAAAAEUpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGrBQEAAAABrAUIAAAAAa0FAQAAAAGuBQEAAAABrwUBAAAAAbAFAQAAAAGxBSAAAAABsgUgAAAAAbMFQAAAAAG0BUAAAAABtQUCAAAAAbYFQAAAAAG3BQEAAAABuAWAAAAAAbkFQAAAAAEDAAAAAwAgRgAAnBMAIEcAAKwTACAQAAAAAwAgAwAAixAAID8AAKwTACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHZBUAAvAoAIdkGAQC3CgAh2gYBALcKACHbBgEAtwoAIdwGAQC2CgAh3QYBALYKACHeBgEAtwoAId8GAQC3CgAh4AYBALYKACHhBiAAuQoAIQ4DAACLEAAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHZBgEAtwoAIdoGAQC3CgAh2wYBALcKACHcBgEAtgoAId0GAQC2CgAh3gYBALcKACHfBgEAtwoAIeAGAQC2CgAh4QYgALkKACEDAAAAVQAgRgAAnhMAIEcAAK8TACAfAAAAVQAgDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACA_AACvEwAgpQUBALYKACGwBQEAtwoAIbgFgAAAAAG5BUAAvAoAIdgFAACqEPAGItkFQAC8CgAh5QUBALcKACHYBgEAtwoAIdsGAQC3CgAh7AYBALYKACHtBiAAuQoAIe4GAADVCtQFIvAGQAC6CgAh8QYBALcKACHyBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhsAUBALcKACG4BYAAAAABuQVAALwKACHYBQAAqhDwBiLZBUAAvAoAIeUFAQC3CgAh2AYBALcKACHbBgEAtwoAIewGAQC2CgAh7QYgALkKACHuBgAA1QrUBSLwBkAAugoAIfEGAQC3CgAh8gYBALcKACEWpQUBAAAAAagFAQAAAAG5BUAAAAAB2AUAAACkBgLZBUAAAAABqwYQAAAAAawGAQAAAAGtBgEAAAABrgaAAAAAAa8GAQAAAAGwBgEAAAABsQYQAAAAAbIGEAAAAAGzBhAAAAABtAYQAAAAAbUGAQAAAAG2BkAAAAABtwZAAAAAAbgGQAAAAAG5BkAAAAABugZAAAAAAbsGQAAAAAEfCgAAtQ8AIBgAALMPACAaAAC0DwAgHAAAtg8AIB4AALcPACAfAAC4DwAgIAAAuQ8AIKUFAQAAAAG4BYAAAAABuQVAAAAAAdkFQAAAAAHkBQEAAAAB5gUBAAAAAeoFAQAAAAHrBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAdIGAQAAAAHTBgEAAAAB1AYCAAAAAdUGIAAAAAHWBiAAAAAB1wYgAAAAAQIAAAAZACBGAACxEwAgEiIAAJgNACAjAACZDQAgpQUBAAAAAbkFQAAAAAHZBUAAAAAB6gUBAAAAAYQGAQAAAAGGBgAAAIYGAocGEAAAAAGIBhAAAAABiQYQAAAAAYoGAgAAAAGLBgIAAAABjAYCAAAAAY0GQAAAAAGOBkAAAAABjwYgAAAAAZAGIAAAAAECAAAAuQUAIEYAALMTACADAAAAFwAgRgAAsRMAIEcAALcTACAhAAAAFwAgCgAA4A4AIBgAAN4OACAaAADfDgAgHAAA4Q4AIB4AAOIOACAfAADjDgAgIAAA5A4AID8AALcTACClBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACHmBQEAtgoAIeoFAQC3CgAh6wUBALYKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcwGAQC3CgAhzQYBALcKACHOBhAAmAwAIc8GEACYDAAh0AYQAJgMACHRBgIAyAoAIdIGAQC3CgAh0wYBALcKACHUBgIAuwoAIdUGIAC5CgAh1gYgALkKACHXBiAAuQoAIR8KAADgDgAgGAAA3g4AIBoAAN8OACAcAADhDgAgHgAA4g4AIB8AAOMOACAgAADkDgAgpQUBALYKACG4BYAAAAABuQVAALwKACHZBUAAvAoAIeQFAQC3CgAh5gUBALYKACHqBQEAtwoAIesFAQC2CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHMBgEAtwoAIc0GAQC3CgAhzgYQAJgMACHPBhAAmAwAIdAGEACYDAAh0QYCAMgKACHSBgEAtwoAIdMGAQC3CgAh1AYCALsKACHVBiAAuQoAIdYGIAC5CgAh1wYgALkKACEDAAAACwAgRgAAsxMAIEcAALoTACAUAAAACwAgIgAAmgwAICMAAJsMACA_AAC6EwAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh6gUBALcKACGEBgEAtgoAIYYGAACWDIYGIocGEACXDAAhiAYQAJgMACGJBhAAmAwAIYoGAgDICgAhiwYCALsKACGMBgIAyAoAIY0GQAC8CgAhjgZAALwKACGPBiAAuQoAIZAGIAC5CgAhEiIAAJoMACAjAACbDAAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh6gUBALcKACGEBgEAtgoAIYYGAACWDIYGIocGEACXDAAhiAYQAJgMACGJBhAAmAwAIYoGAgDICgAhiwYCALsKACGMBgIAyAoAIY0GQAC8CgAhjgZAALwKACGPBiAAuQoAIZAGIAC5CgAhEQYAAIcQACAHAACDEAAgCAAAhBAAIAoAAIUQACClBQEAAAABuQVAAAAAAdkFQAAAAAHiBQEAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAAB8gUBAAAAAfMFAQAAAAH0BQEAAAABjwYgAAAAAcgGAgAAAAHYBgEAAAABAgAAABUAIEYAALsTACASCAAAlw0AICMAAJkNACClBQEAAAABuQVAAAAAAdkFQAAAAAHqBQEAAAABhAYBAAAAAYYGAAAAhgYChwYQAAAAAYgGEAAAAAGJBhAAAAABigYCAAAAAYsGAgAAAAGMBgIAAAABjQZAAAAAAY4GQAAAAAGPBiAAAAABkAYgAAAAAQIAAAC5BQAgRgAAvRMAIAMAAAARACBGAAC7EwAgRwAAwRMAIBMAAAARACAGAADUDwAgBwAA1Q8AIAgAANYPACAKAADXDwAgPwAAwRMAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeIFAQC3CgAh5QUBALYKACHmBQEAtgoAIeoFAQC3CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHIBgIAuwoAIdgGAQC3CgAhEQYAANQPACAHAADVDwAgCAAA1g8AIAoAANcPACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHiBQEAtwoAIeUFAQC2CgAh5gUBALYKACHqBQEAtwoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhyAYCALsKACHYBgEAtwoAIQMAAAALACBGAAC9EwAgRwAAxBMAIBQAAAALACAIAACZDAAgIwAAmwwAID8AAMQTACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHqBQEAtwoAIYQGAQC2CgAhhgYAAJYMhgYihwYQAJcMACGIBhAAmAwAIYkGEACYDAAhigYCAMgKACGLBgIAuwoAIYwGAgDICgAhjQZAALwKACGOBkAAvAoAIY8GIAC5CgAhkAYgALkKACESCAAAmQwAICMAAJsMACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACHqBQEAtwoAIYQGAQC2CgAhhgYAAJYMhgYihwYQAJcMACGIBhAAmAwAIYkGEACYDAAhigYCAMgKACGLBgIAuwoAIYwGAgDICgAhjQZAALwKACGOBkAAvAoAIY8GIAC5CgAhkAYgALkKACEQCgAAuA4AIAsAALUOACAQAAC2DgAgEgAAtw4AIBYAALoOACClBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABywYBAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQIAAAAlACBGAADFEwAgAwAAACMAIEYAAMUTACBHAADJEwAgEgAAACMAIAoAAP8NACALAAD8DQAgEAAA_Q0AIBIAAP4NACAWAACBDgAgPwAAyRMAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIY8GIAC5CgAhywYBALYKACHMBgEAtgoAIc0GAQC3CgAhzgYQAJcMACHPBhAAmAwAIdAGEACYDAAh0QYCALsKACEQCgAA_w0AIAsAAPwNACAQAAD9DQAgEgAA_g0AIBYAAIEOACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACGPBiAAuQoAIcsGAQC2CgAhzAYBALYKACHNBgEAtwoAIc4GEACXDAAhzwYQAJgMACHQBhAAmAwAIdEGAgC7CgAhHQ4AAMoRACAcAADIEQAgHwAAzhEAICAAANERACAjAADJEQAgKQAAxBEAICoAAMURACArAADGEQAgLAAAxxEAIDEAAMsRACAyAADMEQAgMwAAzREAIDQAAM8RACA5AADQEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8AYC2QVAAAAAAeUFAQAAAAHYBgEAAAAB2wYBAAAAAewGAQAAAAHtBiAAAAAB7gYAAADUBQLwBkAAAAAB8QYBAAAAAfIGAQAAAAECAAAAAQAgRgAAyhMAIAOlBQEAAAABuQVAAAAAAfcFAQAAAAEDAAAAVQAgRgAAyhMAIEcAAM8TACAfAAAAVQAgDgAAsRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACA_AADPEwAgpQUBALYKACGwBQEAtwoAIbgFgAAAAAG5BUAAvAoAIdgFAACqEPAGItkFQAC8CgAh5QUBALcKACHYBgEAtwoAIdsGAQC3CgAh7AYBALYKACHtBiAAuQoAIe4GAADVCtQFIvAGQAC6CgAh8QYBALcKACHyBgEAtwoAIR0OAACxEAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhsAUBALcKACG4BYAAAAABuQVAALwKACHYBQAAqhDwBiLZBUAAvAoAIeUFAQC3CgAh2AYBALcKACHbBgEAtwoAIewGAQC2CgAh7QYgALkKACHuBgAA1QrUBSLwBkAAugoAIfEGAQC3CgAh8gYBALcKACEQCgAAuA4AIAsAALUOACAQAAC2DgAgEgAAtw4AIBQAALkOACClBQEAAAABuQVAAAAAAdkFQAAAAAGPBiAAAAABywYBAAAAAcwGAQAAAAHNBgEAAAABzgYQAAAAAc8GEAAAAAHQBhAAAAAB0QYCAAAAAQIAAAAlACBGAADQEwAgCAMAAPcLACClBQEAAAABqAUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAfgFIAAAAAH5BQEAAAABAgAAAJMGACBGAADSEwAgAwAAACMAIEYAANATACBHAADWEwAgEgAAACMAIAoAAP8NACALAAD8DQAgEAAA_Q0AIBIAAP4NACAUAACADgAgPwAA1hMAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIY8GIAC5CgAhywYBALYKACHMBgEAtgoAIc0GAQC3CgAhzgYQAJcMACHPBhAAmAwAIdAGEACYDAAh0QYCALsKACEQCgAA_w0AIAsAAPwNACAQAAD9DQAgEgAA_g0AIBQAAIAOACClBQEAtgoAIbkFQAC8CgAh2QVAALwKACGPBiAAuQoAIcsGAQC2CgAhzAYBALYKACHNBgEAtwoAIc4GEACXDAAhzwYQAJgMACHQBhAAmAwAIdEGAgC7CgAhAwAAAMQBACBGAADSEwAgRwAA2RMAIAoAAADEAQAgAwAA6QsAID8AANkTACClBQEAtgoAIagFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh-AUgALkKACH5BQEAtwoAIQgDAADpCwAgpQUBALYKACGoBQEAtgoAIbkFQAC8CgAh2QVAALwKACHlBQEAtgoAIfgFIAC5CgAh-QUBALcKACEB5AUBAAAAAQHjBQEAAAABCaUFAQAAAAGoBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3wUBAAAAAeAFAQAAAAHhBSAAAAAB4gUBAAAAAQHeBQEAAAABAd4FAQAAAAEGpQUBAAAAAbkFQAAAAAHZBUAAAAAB5QUBAAAAAeYFAQAAAAHqBQEAAAABAgAAANoGACBGAADfEwAgEx4AANwLACA3AADdCwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB1QUBAAAAAdkFQAAAAAHmBQEAAAAB6wUBAAAAAewFAQAAAAHtBQEAAAAB7gUBAAAAAe8FQAAAAAHwBSAAAAAB8QUCAAAAAfIFAQAAAAHzBQEAAAAB9AUBAAAAAfUFIAAAAAECAAAAwQYAIEYAAOETACADAAAA3QYAIEYAAN8TACBHAADlEwAgCAAAAN0GACA_AADlEwAgpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5QUBALYKACHmBQEAtgoAIeoFAQC3CgAhBqUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh5gUBALYKACHqBQEAtwoAIQMAAADEBgAgRgAA4RMAIEcAAOgTACAVAAAAxAYAIB4AAL4LACA3AAC_CwAgPwAA6BMAIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh1QUBALYKACHZBUAAvAoAIeYFAQC2CgAh6wUBALYKACHsBQEAtwoAIe0FAQC3CgAh7gUBALcKACHvBUAAugoAIfAFIAC5CgAh8QUCALsKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACH1BSAAuQoAIRMeAAC-CwAgNwAAvwsAIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh1QUBALYKACHZBUAAvAoAIeYFAQC2CgAh6wUBALYKACHsBQEAtwoAIe0FAQC3CgAh7gUBALcKACHvBUAAugoAIfAFIAC5CgAh8QUCALsKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACH1BSAAuQoAIQWlBQEAAAABuQVAAAAAAdkFQAAAAAHlBQEAAAAB5gUBAAAAAQIAAADzBgAgRgAA6RMAIBMiAADbCwAgNwAA3QsAIKUFAQAAAAG4BYAAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB5gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FAQAAAAHvBUAAAAAB8AUgAAAAAfEFAgAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BSAAAAABAgAAAMEGACBGAADrEwAgAwAAAPYGACBGAADpEwAgRwAA7xMAIAcAAAD2BgAgPwAA7xMAIKUFAQC2CgAhuQVAALwKACHZBUAAvAoAIeUFAQC2CgAh5gUBALYKACEFpQUBALYKACG5BUAAvAoAIdkFQAC8CgAh5QUBALYKACHmBQEAtgoAIQMAAADEBgAgRgAA6xMAIEcAAPITACAVAAAAxAYAICIAAL0LACA3AAC_CwAgPwAA8hMAIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh1QUBALYKACHZBUAAvAoAIeYFAQC2CgAh6wUBALYKACHsBQEAtwoAIe0FAQC3CgAh7gUBALcKACHvBUAAugoAIfAFIAC5CgAh8QUCALsKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACH1BSAAuQoAIRMiAAC9CwAgNwAAvwsAIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh1QUBALYKACHZBUAAvAoAIeYFAQC2CgAh6wUBALYKACHsBQEAtwoAIe0FAQC3CgAh7gUBALcKACHvBUAAugoAIfAFIAC5CgAh8QUCALsKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACH1BSAAuQoAIQ0DAACDCwAgBgAAhQsAIDUAAIILACClBQEAAAABqAUBAAAAAbkFQAAAAAHVBQEAAAAB2QVAAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFIAAAAAHiBQEAAAABAgAAAK0BACBGAADzEwAgHQ4AAMoRACAVAADSEQAgHAAAyBEAIB8AAM4RACAgAADREQAgIwAAyREAICkAAMQRACAqAADFEQAgKwAAxhEAICwAAMcRACAxAADLEQAgMgAAzBEAIDMAAM0RACA0AADPEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8AYC2QVAAAAAAeUFAQAAAAHYBgEAAAAB2wYBAAAAAewGAQAAAAHtBiAAAAAB7gYAAADUBQLwBkAAAAAB8QYBAAAAAfIGAQAAAAECAAAAAQAgRgAA9RMAIBMeAADcCwAgIgAA2wsAIKUFAQAAAAG4BYAAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB5gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FAQAAAAHvBUAAAAAB8AUgAAAAAfEFAgAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BSAAAAABAgAAAMEGACBGAAD3EwAgCaUFAQAAAAGoBQEAAAABuQVAAAAAAdUFAQAAAAHZBUAAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUgAAAAAQMAAACrAQAgRgAA8xMAIEcAAPwTACAPAAAAqwEAIAMAAPMKACAGAAD0CgAgNQAA8goAID8AAPwTACClBQEAtgoAIagFAQC3CgAhuQVAALwKACHVBQEAtgoAIdkFQAC8CgAh3gUBALYKACHfBQEAtwoAIeAFAQC3CgAh4QUgALkKACHiBQEAtwoAIQ0DAADzCgAgBgAA9AoAIDUAAPIKACClBQEAtgoAIagFAQC3CgAhuQVAALwKACHVBQEAtgoAIdkFQAC8CgAh3gUBALYKACHfBQEAtwoAIeAFAQC3CgAh4QUgALkKACHiBQEAtwoAIQMAAABVACBGAAD1EwAgRwAA_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_AACcFAAgpQUBALYKACG4BYAAAAABuQVAALwKACHZBUAAvAoAIeQFAQC3CgAh5gUBALYKACHqBQEAtwoAIesFAQC2CgAh8gUBALcKACHzBQEAtwoAIfQFAQC3CgAhjwYgALkKACHMBgEAtwoAIc0GAQC3CgAhzgYQAJgMACHPBhAAmAwAIdAGEACYDAAh0QYCAMgKACHSBgEAtwoAIdMGAQC3CgAh1AYCALsKACHVBiAAuQoAIdYGIAC5CgAh1wYgALkKACEfCgAA4A4AIBgAAN4OACAaAADfDgAgHAAA4Q4AIB4AAOIOACAgAADkDgAgIQAA5Q4AIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIeYFAQC2CgAh6gUBALcKACHrBQEAtgoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhzAYBALcKACHNBgEAtwoAIc4GEACYDAAhzwYQAJgMACHQBhAAmAwAIdEGAgDICgAh0gYBALcKACHTBgEAtwoAIdQGAgC7CgAh1QYgALkKACHWBiAAuQoAIdcGIAC5CgAhHQ4AAMoRACAVAADSEQAgHAAAyBEAIB8AAM4RACAgAADREQAgIwAAyREAICkAAMQRACAqAADFEQAgKwAAxhEAICwAAMcRACAxAADLEQAgMgAAzBEAIDMAAM0RACA5AADQEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8AYC2QVAAAAAAeUFAQAAAAHYBgEAAAAB2wYBAAAAAewGAQAAAAHtBiAAAAAB7gYAAADUBQLwBkAAAAAB8QYBAAAAAfIGAQAAAAECAAAAAQAgRgAAnRQAIAMAAABVACBGAACdFAAgRwAAoRQAIB8AAABVACAOAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgOQAAtxAAID8AAKEUACClBQEAtgoAIbAFAQC3CgAhuAWAAAAAAbkFQAC8CgAh2AUAAKoQ8AYi2QVAALwKACHlBQEAtwoAIdgGAQC3CgAh2wYBALcKACHsBgEAtgoAIe0GIAC5CgAh7gYAANUK1AUi8AZAALoKACHxBgEAtwoAIfIGAQC3CgAhHQ4AALEQACAVAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA5AAC3EAAgpQUBALYKACGwBQEAtwoAIbgFgAAAAAG5BUAAvAoAIdgFAACqEPAGItkFQAC8CgAh5QUBALcKACHYBgEAtwoAIdsGAQC3CgAh7AYBALYKACHtBiAAuQoAIe4GAADVCtQFIvAGQAC6CgAh8QYBALcKACHyBgEAtwoAIR8KAAC1DwAgGAAAsw8AIBoAALQPACAcAAC2DwAgHgAAtw8AIB8AALgPACAhAAC6DwAgpQUBAAAAAbgFgAAAAAG5BUAAAAAB2QVAAAAAAeQFAQAAAAHmBQEAAAAB6gUBAAAAAesFAQAAAAHyBQEAAAAB8wUBAAAAAfQFAQAAAAGPBiAAAAABzAYBAAAAAc0GAQAAAAHOBhAAAAABzwYQAAAAAdAGEAAAAAHRBgIAAAAB0gYBAAAAAdMGAQAAAAHUBgIAAAAB1QYgAAAAAdYGIAAAAAHXBiAAAAABAgAAABkAIEYAAKIUACAeAwAA-AwAIAQAAPkMACAFAADBDQAgDAAA-gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAGoBQEAAAABuQVAAAAAAdgFAAAApAYC2QVAAAAAAYMGAQAAAAGrBhAAAAABrAYBAAAAAa0GAQAAAAGuBoAAAAABrwYBAAAAAbAGAQAAAAGxBhAAAAABsgYQAAAAAbMGEAAAAAG0BhAAAAABtQYBAAAAAbYGQAAAAAG3BkAAAAABuAZAAAAAAbkGQAAAAAG6BkAAAAABuwZAAAAAAQIAAAAJACBGAACkFAAgHQ4AAMoRACAVAADSEQAgHAAAyBEAIB8AAM4RACAjAADJEQAgKQAAxBEAICoAAMURACArAADGEQAgLAAAxxEAIDEAAMsRACAyAADMEQAgMwAAzREAIDQAAM8RACA5AADQEQAgpQUBAAAAAbAFAQAAAAG4BYAAAAABuQVAAAAAAdgFAAAA8AYC2QVAAAAAAeUFAQAAAAHYBgEAAAAB2wYBAAAAAewGAQAAAAHtBiAAAAAB7gYAAADUBQLwBkAAAAAB8QYBAAAAAfIGAQAAAAECAAAAAQAgRgAAphQAIAMAAAAXACBGAACiFAAgRwAAqhQAICEAAAAXACAKAADgDgAgGAAA3g4AIBoAAN8OACAcAADhDgAgHgAA4g4AIB8AAOMOACAhAADlDgAgPwAAqhQAIKUFAQC2CgAhuAWAAAAAAbkFQAC8CgAh2QVAALwKACHkBQEAtwoAIeYFAQC2CgAh6gUBALcKACHrBQEAtgoAIfIFAQC3CgAh8wUBALcKACH0BQEAtwoAIY8GIAC5CgAhzAYBALcKACHNBgEAtwoAIc4GEACYDAAhzwYQAJgMACHQBhAAmAwAIdEGAgDICgAh0gYBALcKACHTBgEAtwoAIdQGAgC7CgAh1QYgALkKACHWBiAAuQoAIdcGIAC5CgAhHwoAAOAOACAYAADeDgAgGgAA3w4AIBwAAOEOACAeAADiDgAgHwAA4w4AICEAAOUOACClBQEAtgoAIbgFgAAAAAG5BUAAvAoAIdkFQAC8CgAh5AUBALcKACHmBQEAtgoAIeoFAQC3CgAh6wUBALYKACHyBQEAtwoAIfMFAQC3CgAh9AUBALcKACGPBiAAuQoAIcwGAQC3CgAhzQYBALcKACHOBhAAmAwAIc8GEACYDAAh0AYQAJgMACHRBgIAyAoAIdIGAQC3CgAh0wYBALcKACHUBgIAuwoAIdUGIAC5CgAh1gYgALkKACHXBiAAuQoAIQMAAAAHACBGAACkFAAgRwAArRQAICAAAAAHACADAACoDAAgBAAAqQwAIAUAAMANACAMAACqDAAgJAAAqwwAICUAAKwMACAoAACtDAAgPwAArRQAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEeAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICQAAKsMACAlAACsDAAgKAAArQwAIKUFAQC2CgAhqAUBALYKACG5BUAAvAoAIdgFAACmDKQGItkFQAC8CgAhgwYBALcKACGrBhAAlwwAIawGAQC2CgAhrQYBALYKACGuBoAAAAABrwYBALcKACGwBgEAtwoAIbEGEACXDAAhsgYQAJcMACGzBhAAlwwAIbQGEACXDAAhtQYBALcKACG2BkAAvAoAIbcGQAC6CgAhuAZAALoKACG5BkAAugoAIboGQAC6CgAhuwZAALoKACEDAAAAVQAgRgAAphQAIEcAALAUACAfAAAAVQAgDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACA_AACwFAAgpQUBALYKACGwBQEAtwoAIbgFgAAAAAG5BUAAvAoAIdgFAACqEPAGItkFQAC8CgAh5QUBALcKACHYBgEAtwoAIdsGAQC3CgAh7AYBALYKACHtBiAAuQoAIe4GAADVCtQFIvAGQAC6CgAh8QYBALcKACHyBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhsAUBALcKACG4BYAAAAABuQVAALwKACHYBQAAqhDwBiLZBUAAvAoAIeUFAQC3CgAh2AYBALcKACHbBgEAtwoAIewGAQC2CgAh7QYgALkKACHuBgAA1QrUBSLwBkAAugoAIfEGAQC3CgAh8gYBALcKACEQDQA3DpkBDBXFAREclgEXH6UBGyDDARwjlwEDKQYCKo8BJiuTAScslQEoMZ0BKTKjASozpAEXNKkBLDmuAS0DAwABDQAlIwoDCQMAAQQAAgUMBAx2Dg0AJCCGARwkeB8lfCAogAEhBAgQBQ0AHiJxFSNyAwIFAAQJAAYJClAIDQAdGBIHGk8JHFQXHloYH2AbIGUcIWkFBgYTBwcWBwgaBgoeCA0AFhlIFQQJHwYLIQkPQwoYRAcECQAGCiIIDQAUFyYKBwoxCAsACQ0AExAqCxIwDhQ1DxY5EAIOAAwPAAoDAwABDCsLDQANAQwsAAIPAAoRAAMBEwAKAg8AChUAEQMDAAEMOhANABIBDDsABQo-ABA8ABI9ABQ_ABZAAAIKQQAXQgACBQAEGAAHBAdJAAhKAApLABlMAAMDAAEJAAYbVgECCQAGHQAZAghbGA0AGgEIXAACA2EBCQAGAwNmAQloBhFnAwcKawAaagAcbAAebQAfbgAgbwAhcAADCHMAInQAI3UAAREAAwERAAMDDQAjEQADJ4QBIgEmACEBJ4UBAAQMhwEAIIoBACWIAQAoiQEAASOLAQABAwABAQMAAQEDAAECLwAqMAABAw0AKy0AAS6eASkBLp8BAAEDqgEBBQO_AQEGwAEtDQA2NQAuOMEBLQQNADUeuAEyIrIBLze7AS0CGAAwNQAuAg0AMTazAS8BNrQBAAIdADM1AC4CDQA0NrkBMgE2ugEAAx69AQAivAEAN74BAAE4wgEADBzJAQAfzgEAINEBACPKAQApxgEAKscBACvIAQAxywEAMswBADPNAQA0zwEAOdABAAAAAAMNADxMAD1NAD4AAAADDQA8TAA9TQA-AQMAAQEDAAEDDQBDTABETQBFAAAAAw0AQ0wARE0ARQEDAAEBAwABAw0ASkwAS00ATAAAAAMNAEpMAEtNAEwBAwABAQMAAQMNAFFMAFJNAFMAAAADDQBRTABSTQBTAQMAAQEDAAEDDQBYTABZTQBaAAAAAw0AWEwAWU0AWgEGzAIHAQbSAgcFDQBfTABiTQBjngEAYJ8BAGEAAAAAAAUNAF9MAGJNAGOeAQBgnwEAYQAAAw0AaEwAaU0AagAAAAMNAGhMAGlNAGoCCQAGHQAZAgkABh0AGQMNAG9MAHBNAHEAAAADDQBvTABwTQBxARiTAwcBGJkDBwUNAHZMAHlNAHqeAQB3nwEAeAAAAAAABQ0AdkwAeU0Aep4BAHefAQB4AQkABgEJAAYDDQB_TACAAU0AgQEAAAADDQB_TACAAU0AgQEBCwAJAQsACQUNAIYBTACJAU0AigGeAQCHAZ8BAIgBAAAAAAAFDQCGAUwAiQFNAIoBngEAhwGfAQCIAQQJ1wMGC9gDCQ_ZAwoY2gMHBAngAwYL4QMJD-IDChjjAwcFDQCPAUwAkgFNAJMBngEAkAGfAQCRAQAAAAAABQ0AjwFMAJIBTQCTAZ4BAJABnwEAkQEDAwABCQAGG_UDAQMDAAEJAAYb-wMBBQ0AmAFMAJsBTQCcAZ4BAJkBnwEAmgEAAAAAAAUNAJgBTACbAU0AnAGeAQCZAZ8BAJoBAQMAAQEDAAEDDQChAUwAogFNAKMBAAAAAw0AoQFMAKIBTQCjAQIOAAwPAAoCDgAMDwAKBQ0AqAFMAKsBTQCsAZ4BAKkBnwEAqgEAAAAAAAUNAKgBTACrAU0ArAGeAQCpAZ8BAKoBAwMAAQQAAgW7BAQDAwABBAACBcEEBAUNALEBTAC0AU0AtQGeAQCyAZ8BALMBAAAAAAAFDQCxAUwAtAFNALUBngEAsgGfAQCzAQIPAAoRAAMCDwAKEQADBQ0AugFMAL0BTQC-AZ4BALsBnwEAvAEAAAAAAAUNALoBTAC9AU0AvgGeAQC7AZ8BALwBAREAAwERAAMDDQDDAUwAxAFNAMUBAAAAAw0AwwFMAMQBTQDFAQERAAMBEQADAw0AygFMAMsBTQDMAQAAAAMNAMoBTADLAU0AzAEBJgAhASYAIQMNANEBTADSAU0A0wEAAAADDQDRAUwA0gFNANMBAREAAwERAAMFDQDYAUwA2wFNANwBngEA2QGfAQDaAQAAAAAABQ0A2AFMANsBTQDcAZ4BANkBnwEA2gEAAAUNAOEBTADkAU0A5QGeAQDiAZ8BAOMBAAAAAAAFDQDhAUwA5AFNAOUBngEA4gGfAQDjAQIFAAQJAAYCBQAECQAGAw0A6gFMAOsBTQDsAQAAAAMNAOoBTADrAU0A7AECBQAEGAAHAgUABBgABwMNAPEBTADyAU0A8wEAAAADDQDxAUwA8gFNAPMBARMACgETAAoFDQD4AUwA-wFNAPwBngEA-QGfAQD6AQAAAAAABQ0A-AFMAPsBTQD8AZ4BAPkBnwEA-gEBAwABAQMAAQMNAIECTACCAk0AgwIAAAADDQCBAkwAggJNAIMCAg8AChUAEQIPAAoVABEDDQCIAkwAiQJNAIoCAAAAAw0AiAJMAIkCTQCKAgAABQ0AjwJMAJICTQCTAp4BAJACnwEAkQIAAAAAAAUNAI8CTACSAk0AkwKeAQCQAp8BAJECAAADDQCYAkwAmQJNAJoCAAAAAw0AmAJMAJkCTQCaAgAAAw0AnwJMAKACTQChAgAAAAMNAJ8CTACgAk0AoQICGAAwNQAuAhgAMDUALgMNAKYCTACnAk0AqAIAAAADDQCmAkwApwJNAKgCAh0AMzUALgIdADM1AC4DDQCtAkwArgJNAK8CAAAAAw0ArQJMAK4CTQCvAgMDwgcBBsMHLTUALgMDyQcBBsoHLTUALgMNALQCTAC1Ak0AtgIAAAADDQC0AkwAtQJNALYCAS0AAQEtAAEDDQC7AkwAvAJNAL0CAAAAAw0AuwJMALwCTQC9AgIvACowAAECLwAqMAABAw0AwgJMAMMCTQDEAgAAAAMNAMICTADDAk0AxAICA4gIAQkABgIDjggBCQAGAw0AyQJMAMoCTQDLAgAAAAMNAMkCTADKAk0AywIBA6AIAQEDpggBBQ0A0AJMANMCTQDUAp4BANECnwEA0gIAAAAAAAUNANACTADTAk0A1AKeAQDRAp8BANICAwO4CAEJuggGEbkIAwMDwAgBCcIIBhHBCAMFDQDZAkwA3AJNAN0CngEA2gKfAQDbAgAAAAAABQ0A2QJMANwCTQDdAp4BANoCnwEA2wI6AgE70gEBPNQBAT3VAQE-1gEBQNgBAUHaAThC2wE5Q90BAUTfAThF4AE6SOEBAUniAQFK4wE4TuYBO0_nAT9Q6AEmUekBJlLqASZT6wEmVOwBJlXuASZW8AE4V_EBQFjzASZZ9QE4WvYBQVv3ASZc-AEmXfkBOF78AUJf_QFGYP4BJ2H_ASdigAInY4ECJ2SCAidlhAInZoYCOGeHAkdoiQInaYsCOGqMAkhrjQInbI4CJ22PAjhukgJJb5MCTXCVAihxlgIocpgCKHOZAih0mgIodZwCKHaeAjh3nwJOeKECKHmjAjh6pAJPe6UCKHymAih9pwI4fqoCUH-rAlSAAawCAoEBrQICggGuAgKDAa8CAoQBsAIChQGyAgKGAbQCOIcBtQJViAG3AgKJAbkCOIoBugJWiwG7AgKMAbwCAo0BvQI4jgHAAlePAcECW5ABwgIHkQHDAgeSAcQCB5MBxQIHlAHGAgeVAcgCB5YBygI4lwHLAlyYAc4CB5kB0AI4mgHRAl2bAdMCB5wB1AIHnQHVAjigAdgCXqEB2QJkogHbAhmjAdwCGaQB3wIZpQHgAhmmAeECGacB4wIZqAHlAjipAeYCZaoB6AIZqwHqAjisAesCZq0B7AIZrgHtAhmvAe4COLAB8QJnsQHyAmuyAfMCGLMB9AIYtAH1Ahi1AfYCGLYB9wIYtwH5Ahi4AfsCOLkB_AJsugH-Ahi7AYADOLwBgQNtvQGCAxi-AYMDGL8BhAM4wAGHA27BAYgDcsIBiQMGwwGKAwbEAYsDBsUBjAMGxgGNAwbHAY8DBsgBkQM4yQGSA3PKAZUDBssBlwM4zAGYA3TNAZoDBs4BmwMGzwGcAzjQAZ8DddEBoAN70gGhAwnTAaIDCdQBowMJ1QGkAwnWAaUDCdcBpwMJ2AGpAzjZAaoDfNoBrAMJ2wGuAzjcAa8Dfd0BsAMJ3gGxAwnfAbIDOOABtQN-4QG2A4IB4gG3AwrjAbgDCuQBuQMK5QG6AwrmAbsDCucBvQMK6AG_AzjpAcADgwHqAcIDCusBxAM47AHFA4QB7QHGAwruAccDCu8ByAM48AHLA4UB8QHMA4sB8gHNAwjzAc4DCPQBzwMI9QHQAwj2AdEDCPcB0wMI-AHVAzj5AdYDjAH6AdwDCPsB3gM4_AHfA40B_QHkAwj-AeUDCP8B5gM4gALpA44BgQLqA5QBggLrAxeDAuwDF4QC7QMXhQLuAxeGAu8DF4cC8QMXiALzAziJAvQDlQGKAvcDF4sC-QM4jAL6A5YBjQL8AxeOAv0DF48C_gM4kAKBBJcBkQKCBJ0BkgKEBAyTAoUEDJQChwQMlQKIBAyWAokEDJcCiwQMmAKNBDiZAo4EngGaApAEDJsCkgQ4nAKTBJ8BnQKUBAyeApUEDJ8ClgQ4oAKZBKABoQKaBKQBogKbBAujApwEC6QCnQQLpQKeBAumAp8EC6cCoQQLqAKjBDipAqQEpQGqAqYEC6sCqAQ4rAKpBKYBrQKqBAuuAqsEC68CrAQ4sAKvBKcBsQKwBK0BsgKxBAOzArIEA7QCswQDtQK0BAO2ArUEA7cCtwQDuAK5BDi5AroErgG6Ar0EA7sCvwQ4vALABK8BvQLCBAO-AsMEA78CxAQ4wALHBLABwQLIBLYBwgLJBA7DAsoEDsQCywQOxQLMBA7GAs0EDscCzwQOyALRBDjJAtIEtwHKAtQEDssC1gQ4zALXBLgBzQLYBA7OAtkEDs8C2gQ40ALdBLkB0QLeBL8B0gLfBCDTAuAEINQC4QQg1QLiBCDWAuMEINcC5QQg2ALnBDjZAugEwAHaAuoEINsC7AQ43ALtBMEB3QLuBCDeAu8EIN8C8AQ44ALzBMIB4QL0BMYB4gL1BCHjAvYEIeQC9wQh5QL4BCHmAvkEIecC-wQh6AL9BDjpAv4ExwHqAoAFIesCggU47AKDBcgB7QKEBSHuAoUFIe8ChgU48AKJBckB8QKKBc0B8gKLBSLzAowFIvQCjQUi9QKOBSL2Ao8FIvcCkQUi-AKTBTj5ApQFzgH6ApYFIvsCmAU4_AKZBc8B_QKaBSL-ApsFIv8CnAU4gAOfBdABgQOgBdQBggOiBR-DA6MFH4QDpQUfhQOmBR-GA6cFH4cDqQUfiAOrBTiJA6wF1QGKA64FH4sDsAU4jAOxBdYBjQOyBR-OA7MFH48DtAU4kAO3BdcBkQO4Bd0BkgO6BQSTA7sFBJQDvQUElQO-BQSWA78FBJcDwQUEmAPDBTiZA8QF3gGaA8YFBJsDyAU4nAPJBd8BnQPKBQSeA8sFBJ8DzAU4oAPPBeABoQPQBeYBogPRBQWjA9IFBaQD0wUFpQPUBQWmA9UFBacD1wUFqAPZBTipA9oF5wGqA9wFBasD3gU4rAPfBegBrQPgBQWuA-EFBa8D4gU4sAPlBekBsQPmBe0BsgPnBRWzA-gFFbQD6QUVtQPqBRW2A-sFFbcD7QUVuAPvBTi5A_AF7gG6A_IFFbsD9AU4vAP1Be8BvQP2BRW-A_cFFb8D-AU4wAP7BfABwQP8BfQBwgP9BQ_DA_4FD8QD_wUPxQOABg_GA4EGD8cDgwYPyAOFBjjJA4YG9QHKA4gGD8sDigY4zAOLBvYBzQOMBg_OA40GD88DjgY40AORBvcB0QOSBv0B0gOUBhHTA5UGEdQDlwYR1QOYBhHWA5kGEdcDmwYR2AOdBjjZA54G_gHaA6AGEdsDogY43AOjBv8B3QOkBhHeA6UGEd8DpgY44AOpBoAC4QOqBoQC4gOrBhDjA6wGEOQDrQYQ5QOuBhDmA68GEOcDsQYQ6AOzBjjpA7QGhQLqA7YGEOsDuAY47AO5BoYC7QO6BhDuA7sGEO8DvAY48AO_BocC8QPABosC8gPCBi7zA8MGLvQDxgYu9QPHBi72A8gGLvcDygYu-APMBjj5A80GjAL6A88GLvsD0QY4_APSBo0C_QPTBi7-A9QGLv8D1QY4gATYBo4CgQTZBpQCggTbBjCDBNwGMIQE3wYwhQTgBjCGBOEGMIcE4wYwiATlBjiJBOYGlQKKBOgGMIsE6gY4jATrBpYCjQTsBjCOBO0GMI8E7gY4kATxBpcCkQTyBpsCkgT0BjOTBPUGM5QE-AYzlQT5BjOWBPoGM5cE_AYzmAT-BjiZBP8GnAKaBIEHM5sEgwc4nASEB50CnQSFBzOeBIYHM58Ehwc4oASKB54CoQSLB6ICogSMBy-jBI0HL6QEjgcvpQSPBy-mBJAHL6cEkgcvqASUBzipBJUHowKqBJcHL6sEmQc4rASaB6QCrQSbBy-uBJwHL68EnQc4sASgB6UCsQShB6kCsgSiBzKzBKMHMrQEpAcytQSlBzK2BKYHMrcEqAcyuASqBzi5BKsHqgK6BK0HMrsErwc4vASwB6sCvQSxBzK-BLIHMr8Eswc4wAS2B6wCwQS3B7ACwgS4By3DBLkHLcQEugctxQS7By3GBLwHLccEvgctyATABzjJBMEHsQLKBMUHLcsExwc4zATIB7ICzQTLBy3OBMwHLc8EzQc40ATQB7MC0QTRB7cC0gTSByrTBNMHKtQE1Acq1QTVByrWBNYHKtcE2Acq2ATaBzjZBNsHuALaBN0HKtsE3wc43ATgB7kC3QThByreBOIHKt8E4wc44ATmB7oC4QTnB74C4gToBynjBOkHKeQE6gcp5QTrBynmBOwHKecE7gcp6ATwBzjpBPEHvwLqBPMHKesE9Qc47AT2B8AC7QT3BynuBPgHKe8E-Qc48AT8B8EC8QT9B8UC8gT-BxvzBP8HG_QEgAgb9QSBCBv2BIIIG_cEhAgb-ASGCDj5BIcIxgL6BIoIG_sEjAg4_ASNCMcC_QSPCBv-BJAIG_8EkQg4gAWUCMgCgQWVCMwCggWWCCyDBZcILIQFmAgshQWZCCyGBZoILIcFnAgsiAWeCDiJBZ8IzQKKBaIILIsFpAg4jAWlCM4CjQWnCCyOBagILI8FqQg4kAWsCM8CkQWtCNUCkgWuCByTBa8IHJQFsAgclQWxCByWBbIIHJcFtAgcmAW2CDiZBbcI1gKaBbwIHJsFvgg4nAW_CNcCnQXDCByeBcQIHJ8FxQg4oAXICNgCoQXJCN4C"
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
import { Router as Router7 } from "express";

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

// src/app/modules/tracking/tracking.route.ts
import { Router as Router6 } from "express";

// src/app/modules/tracking/tracking.controller.ts
import httpStatus17 from "http-status-codes";

// src/app/modules/tracking/tracking.service.ts
import { randomUUID } from "crypto";
import httpStatus16 from "http-status-codes";

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
  throw new AppError_default(httpStatus16.BAD_REQUEST, `${key} must be true or false`);
};
var parseDateQuery = (value, key) => {
  if (!value) {
    return void 0;
  }
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError_default(httpStatus16.BAD_REQUEST, `${key} must be a valid date`);
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
// src/app/modules/review/review.route.ts
import { Router as Router6 } from "express";

// src/app/modules/review/review.controller.ts
import httpStatus17 from "http-status-codes";

// src/app/modules/review/review.service.ts
import httpStatus16 from "http-status-codes";
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
var parseBooleanQuery2 = (value, key) => {
  if (value !== "true" && value !== "false") {
    throw new AppError_default(httpStatus16.BAD_REQUEST, `${key} query must be true or false`);
  }
  return value === "true";
};
var parseRatingQuery = (value, key) => {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError_default(httpStatus16.BAD_REQUEST, `${key} query must be an integer between 1 and 5`);
  }
  return rating;
};
var buildOrderBy3 = (sort) => {
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
      httpStatus16.BAD_REQUEST,
      "minRating cannot be greater than maxRating"
    );
  }
  if (ratingFilter.gte !== void 0 || ratingFilter.lte !== void 0) {
    where.rating = ratingFilter;
  }
};
var ensureProductExists = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!product) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Product not found");
  }
};
var ensureOrderExists = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true }
  });
  if (!order) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Order not found");
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
var createReview = async (userId, payload) => {
  await ensureProductExists(payload.productId);
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId: payload.productId
    },
    select: { id: true }
  });
  if (existingReview) {
    throw new AppError_default(
      httpStatus16.CONFLICT,
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
  await ensureProductExists(productId);
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
      orderBy: buildOrderBy3(query.sort),
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
    where.isApproved = parseBooleanQuery2(query.isApproved, "isApproved");
  }
  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy3(query.sort),
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
    throw new AppError_default(httpStatus16.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(
      httpStatus16.FORBIDDEN,
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
    throw new AppError_default(httpStatus16.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(
      httpStatus16.FORBIDDEN,
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
    where.isApproved = parseBooleanQuery2(query.isApproved, "isApproved");
  }
  if (query.isVerifiedPurchase !== void 0) {
    where.isVerifiedPurchase = parseBooleanQuery2(
      query.isVerifiedPurchase,
      "isVerifiedPurchase"
    );
  }
  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy3(query.sort),
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
var getTrackingEventById = async (id) => {
  const event = await prisma.conversionEvent.findUnique({
    where: { id },
    select: conversionEventSelect
  });
  if (!event) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Tracking event not found");
  }
  return event;
};
var retryTrackingEvent = async (id) => {
  const existingEvent = await prisma.conversionEvent.findUnique({
    where: { id },
    select: conversionEventSelect
  });
  if (!existingEvent) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Tracking event not found");
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
var getReviewByIdForAdmin = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: adminReviewSelect
  });
  if (!review) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Review not found");
  }
  return review;
};
var moderateReview = async (reviewId, payload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true }
  });
  if (!review) {
    throw new AppError_default(httpStatus16.NOT_FOUND, "Review not found");
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
    throw new AppError_default(httpStatus16.NOT_FOUND, "Review not found");
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
    throw new AppError_default(httpStatus16.NOT_FOUND, "Review not found");
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
var getParamAsString5 = (value, key) => {
  if (!value || Array.isArray(value)) {
    throw new AppError_default(httpStatus17.BAD_REQUEST, `${key} is required`);
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
    statusCode: httpStatus17.CREATED,
    message: result.deduplicated ? "Tracking event processed (deduplicated)" : "Tracking event processed successfully",
    data: result
  });
});
var getTrackingEvents2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await TrackingService.getTrackingEvents(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Tracking events retrieved successfully",
var getAuthUserId = (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError_default(httpStatus17.UNAUTHORIZED, "User not authenticated");
  }
  return userId;
};
var createReview2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const payload = req.body;
  const result = await ReviewService.createReview(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.CREATED,
    message: "Review submitted successfully",
    data: result
  });
});
var getPublicReviewsByProduct2 = catchAsync(async (req, res) => {
  const productId = getParamAsString5(req.params.productId, "Product id");
  const query = req.query;
  const result = await ReviewService.getPublicReviewsByProduct(productId, query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
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
    statusCode: httpStatus17.OK,
    message: "My reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateMyReview2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const reviewId = getParamAsString5(req.params.id, "Review id");
  const payload = req.body;
  const result = await ReviewService.updateMyReview(userId, reviewId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Review updated successfully",
    data: result
  });
});
var deleteMyReview2 = catchAsync(async (req, res) => {
  const userId = getAuthUserId(req);
  const reviewId = getParamAsString5(req.params.id, "Review id");
  await ReviewService.deleteMyReview(userId, reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Review deleted successfully",
    data: null
  });
});
var getAllReviews2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ReviewService.getAllReviews(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "All reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getTrackingEventById2 = catchAsync(async (req, res) => {
  const id = getParamAsString5(req.params.id, "Tracking event id");
  const result = await TrackingService.getTrackingEventById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Tracking event retrieved successfully",
    data: result
  });
});
var retryTrackingEvent2 = catchAsync(async (req, res) => {
  const id = getParamAsString5(req.params.id, "Tracking event id");
  const result = await TrackingService.retryTrackingEvent(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
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
import { z as z6 } from "zod";
var optionalTrimmedText = (maxLength) => z6.string().trim().min(1, { message: "Value cannot be empty" }).max(maxLength, { message: `Value cannot exceed ${maxLength} characters` }).optional();
var trackingItemZodSchema = z6.object({
  itemId: z6.string().trim().min(1, { message: "itemId is required" }).max(100, { message: "itemId cannot exceed 100 characters" }),
  itemName: optionalTrimmedText(255),
  itemBrand: optionalTrimmedText(100),
  itemCategory: optionalTrimmedText(100),
  itemVariant: optionalTrimmedText(100),
  price: z6.coerce.number().nonnegative({ message: "price cannot be negative" }).optional(),
  quantity: z6.coerce.number().int({ message: "quantity must be an integer" }).positive({ message: "quantity must be greater than 0" }).optional()
});
var trackingUserDataZodSchema = z6.object({
  email: z6.string().trim().email({ message: "Invalid email address" }).optional(),
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
var trackEventZodSchema = z6.object({
  eventType: z6.string().trim().min(1, { message: "eventType is required" }).max(100, { message: "eventType cannot exceed 100 characters" }),
  eventId: z6.string().uuid({ message: "eventId must be a valid UUID" }).optional(),
  sessionId: optionalTrimmedText(120),
  orderId: z6.string().uuid({ message: "orderId must be a valid UUID" }).optional(),
  productId: z6.string().uuid({ message: "productId must be a valid UUID" }).optional(),
  value: z6.coerce.number().nonnegative({ message: "value cannot be negative" }).optional(),
  currency: z6.string().trim().length(3, { message: "currency must be 3 characters (ISO code)" }).transform((value) => value.toUpperCase()).optional(),
  sourceUrl: z6.string().trim().url({ message: "sourceUrl must be a valid URL" }).optional(),
  metadata: z6.record(z6.string(), z6.unknown()).optional(),
  userData: trackingUserDataZodSchema.optional(),
  items: z6.array(trackingItemZodSchema).optional()
}).superRefine((payload, ctx) => {
  if (payload.eventType === "Purchase" && !payload.orderId) {
    ctx.addIssue({
      code: z6.ZodIssueCode.custom,
      path: ["orderId"],
      message: "orderId is required for Purchase event"
    });
  }
});

// src/app/modules/tracking/tracking.route.ts
var router6 = Router6();
router6.post("/", validateRequest(trackEventZodSchema), TrackingControllers.trackEvent);
router6.get(
  "/",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  TrackingControllers.getTrackingEvents
);
router6.get(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  TrackingControllers.getTrackingEventById
);
router6.post(
  "/:id/retry",
  checkAuth("ADMIN" /* ADMIN */, "MANAGER" /* MANAGER */),
  TrackingControllers.retryTrackingEvent
);
var TrackingRoutes = router6;
var getReviewByIdForAdmin2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString5(req.params.id, "Review id");
  const result = await ReviewService.getReviewByIdForAdmin(reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Review retrieved successfully",
    data: result
  });
});
var moderateReview2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString5(req.params.id, "Review id");
  const payload = req.body;
  const result = await ReviewService.moderateReview(reviewId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Review moderated successfully",
    data: result
  });
});
var replyReview2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString5(req.params.id, "Review id");
  const adminId = getAuthUserId(req);
  const payload = req.body;
  const result = await ReviewService.replyReview(reviewId, payload, adminId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
    message: "Review reply updated successfully",
    data: result
  });
});
var deleteReviewByAdmin2 = catchAsync(async (req, res) => {
  const reviewId = getParamAsString5(req.params.id, "Review id");
  await ReviewService.deleteReviewByAdmin(reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus17.OK,
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
import { z as z6 } from "zod";
var optionalText3 = (max) => z6.string().trim().min(1, { message: "Value cannot be empty" }).max(max, { message: `Value cannot exceed ${max} characters` }).optional();
var ratingSchema = z6.coerce.number().int({ message: "Rating must be an integer" }).min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" });
var createReviewZodSchema = z6.object({
  productId: z6.string().uuid({ message: "Product id must be a valid UUID" }),
  rating: ratingSchema,
  title: optionalText3(255),
  comment: optionalText3(2e3)
});
var updateMyReviewZodSchema = z6.object({
  rating: ratingSchema.optional(),
  title: optionalText3(255),
  comment: optionalText3(2e3)
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one field is required for update"
});
var moderateReviewZodSchema = z6.object({
  isApproved: z6.coerce.boolean().optional(),
  isVerifiedPurchase: z6.coerce.boolean().optional()
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one moderation field is required"
});
var adminReplyValueSchema = z6.preprocess(
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
  z6.string().max(2e3, { message: "Admin reply cannot exceed 2000 characters" }).nullable()
);
var replyReviewZodSchema = z6.object({
  adminReply: adminReplyValueSchema
});

// src/app/modules/review/review.route.ts
var router6 = Router6();
router6.get("/product/:productId", ReviewControllers.getPublicReviewsByProduct);
router6.post(
  "/",
  checkAuth("USER" /* USER */),
  validateRequest(createReviewZodSchema),
  ReviewControllers.createReview
);
router6.get(
  "/my-reviews",
  checkAuth("USER" /* USER */),
  ReviewControllers.getMyReviews
);
router6.patch(
  "/:id",
  checkAuth("USER" /* USER */),
  validateRequest(updateMyReviewZodSchema),
  ReviewControllers.updateMyReview
);
router6.put(
  "/:id",
  checkAuth("USER" /* USER */),
  validateRequest(updateMyReviewZodSchema),
  ReviewControllers.updateMyReview
);
router6.delete(
  "/:id",
  checkAuth("USER" /* USER */),
  ReviewControllers.deleteMyReview
);
router6.get("/", checkAuth("ADMIN" /* ADMIN */), ReviewControllers.getAllReviews);
router6.get("/:id/admin", checkAuth("ADMIN" /* ADMIN */), ReviewControllers.getReviewByIdForAdmin);
router6.patch(
  "/:id/moderate",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(moderateReviewZodSchema),
  ReviewControllers.moderateReview
);
router6.patch(
  "/:id/reply",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(replyReviewZodSchema),
  ReviewControllers.replyReview
);
router6.delete(
  "/:id/admin",
  checkAuth("ADMIN" /* ADMIN */),
  ReviewControllers.deleteReviewByAdmin
);
var ReviewRoutes = router6;

// src/app/routes/index.ts
var router7 = Router7();
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
    path: "/tracking",
    route: TrackingRoutes
    path: "/review",
    route: ReviewRoutes
  }
];
moduleRoutes.forEach((route) => {
  router7.use(route.path, route.route);
});

// src/app/middlewares/globalErrorHandler.ts
import httpStatus18 from "http-status-codes";
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
    statusCode = httpStatus18.BAD_REQUEST;
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
import httpStatus19 from "http-status-codes";
var notFound = (req, res) => {
  res.status(httpStatus19.NOT_FOUND).json({
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
app.use("/api", router7);
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
