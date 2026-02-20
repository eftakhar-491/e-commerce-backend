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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"credential","kind":"object","type":"UserCredential","relationName":"UserToUserCredential"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"MessageSender"},{"name":"customerConversations","kind":"object","type":"Conversation","relationName":"CustomerConversations"},{"name":"adminReviewReplies","kind":"object","type":"Review","relationName":"AdminReviewReplies"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductViewToUser"},{"name":"searchQueries","kind":"object","type":"SearchQuery","relationName":"SearchQueryToUser"},{"name":"blogComments","kind":"object","type":"BlogComment","relationName":"BlogCommentToUser"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToUser"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"UserToWishlist"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"lastIp","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referralSource","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"User"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sessions"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"tokenType","kind":"scalar","type":"String"},{"name":"scope","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"accounts"},"UserCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserCredential"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_credentials"},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"recipient","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"CategoryToProductImage"},{"name":"couponCategories","kind":"object","type":"CouponCategory","relationName":"CategoryToCouponCategory"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Tag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"ProductTag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tags"},"ProductTag":{"fields":[{"name":"productId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductTag"},{"name":"tag","kind":"object","type":"Tag","relationName":"ProductTagToTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"product_tags"},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"brand","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"lowStockThreshold","kind":"scalar","type":"Int"},{"name":"hasVariants","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"isDigital","kind":"scalar","type":"Boolean"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"variants","kind":"object","type":"ProductVariant","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"tags","kind":"object","type":"ProductTag","relationName":"ProductToProductTag"},{"name":"productViews","kind":"object","type":"ProductView","relationName":"ProductToProductView"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToProduct"},{"name":"couponProducts","kind":"object","type":"CouponProduct","relationName":"CouponProductToProduct"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"products"},"ProductVariant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductVariant"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToProductVariant"},{"name":"options","kind":"object","type":"VariantOption","relationName":"ProductVariantToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_variants"},"VariantOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productVariantId","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"barcode","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"compareAtPrice","kind":"scalar","type":"Decimal"},{"name":"costPrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductVariantToVariantOption"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToVariantOption"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToVariantOption"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductImageToVariantOption"},{"name":"inventoryTransactions","kind":"object","type":"InventoryTransaction","relationName":"InventoryTransactionToVariantOption"},{"name":"wishlistItems","kind":"object","type":"WishlistItem","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"variant_options"},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"src","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"productId","kind":"scalar","type":"String"},{"name":"variantId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"},{"name":"variant","kind":"object","type":"ProductVariant","relationName":"ProductImageToProductVariant"},{"name":"option","kind":"object","type":"VariantOption","relationName":"ProductImageToVariantOption"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProductImage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_images"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"helpfulVotes","kind":"scalar","type":"Int"},{"name":"notHelpfulVotes","kind":"scalar","type":"Int"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"adminRepliedAt","kind":"scalar","type":"DateTime"},{"name":"adminRepliedBy","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"User","relationName":"AdminReviewReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"CartItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"shippingAddressId","kind":"scalar","type":"String"},{"name":"billingAddress","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"adminNotes","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"discountTotal","kind":"scalar","type":"Decimal"},{"name":"shippingCost","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"couponCode","kind":"scalar","type":"String"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"shippedAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"returnedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"statusHistory","kind":"object","type":"OrderStatusHistory","relationName":"OrderToOrderStatusHistory"},{"name":"shipments","kind":"object","type":"Shipment","relationName":"OrderToShipment"},{"name":"conversionEvents","kind":"object","type":"ConversionEvent","relationName":"ConversionEventToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"productName","kind":"scalar","type":"String"},{"name":"productSku","kind":"scalar","type":"String"},{"name":"productImage","kind":"scalar","type":"String"},{"name":"variantSnapshot","kind":"scalar","type":"Json"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"OrderItemToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"OrderStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"changedBy","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderStatusHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_status_history"},"Shipment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"carrier","kind":"scalar","type":"String"},{"name":"trackingNumber","kind":"scalar","type":"String"},{"name":"trackingUrl","kind":"scalar","type":"String"},{"name":"shippingMethod","kind":"scalar","type":"String"},{"name":"estimatedDelivery","kind":"scalar","type":"DateTime"},{"name":"actualDelivery","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"ShipmentStatus"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToShipment"},{"name":"events","kind":"object","type":"ShipmentEvent","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"shipments"},"ShipmentEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"occurredAt","kind":"scalar","type":"DateTime"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"ShipmentToShipmentEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"shipment_events"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"discountType","kind":"enum","type":"DiscountType"},{"name":"discountValue","kind":"scalar","type":"Decimal"},{"name":"minPurchase","kind":"scalar","type":"Decimal"},{"name":"maxDiscount","kind":"scalar","type":"Decimal"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usageCount","kind":"scalar","type":"Int"},{"name":"perUserLimit","kind":"scalar","type":"Int"},{"name":"validFrom","kind":"scalar","type":"DateTime"},{"name":"validUntil","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"appliesToAll","kind":"scalar","type":"Boolean"},{"name":"products","kind":"object","type":"CouponProduct","relationName":"CouponToCouponProduct"},{"name":"categories","kind":"object","type":"CouponCategory","relationName":"CouponToCouponCategory"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"CouponProduct":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponProduct"},{"name":"product","kind":"object","type":"Product","relationName":"CouponProductToProduct"}],"dbName":"coupon_products"},"CouponCategory":{"fields":[{"name":"couponId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToCouponCategory"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToCouponCategory"}],"dbName":"coupon_categories"},"InventoryTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InventoryTransactionType"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"previousStock","kind":"scalar","type":"Int"},{"name":"newStock","kind":"scalar","type":"Int"},{"name":"referenceId","kind":"scalar","type":"String"},{"name":"referenceType","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"variantOption","kind":"object","type":"VariantOption","relationName":"InventoryTransactionToVariantOption"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"inventory_transactions"},"Wishlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareToken","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToWishlist"},{"name":"items","kind":"object","type":"WishlistItem","relationName":"WishlistToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlists"},"WishlistItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"wishlistId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"wishlist","kind":"object","type":"Wishlist","relationName":"WishlistToWishlistItem"},{"name":"option","kind":"object","type":"VariantOption","relationName":"VariantOptionToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlist_items"},"BlogPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"featuredImage","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"views","kind":"scalar","type":"Int"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"categories","kind":"object","type":"BlogPostCategory","relationName":"BlogPostToBlogPostCategory"},{"name":"tags","kind":"object","type":"BlogPostTag","relationName":"BlogPostToBlogPostTag"},{"name":"comments","kind":"object","type":"BlogComment","relationName":"BlogCommentToBlogPost"},{"name":"allowComments","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_posts"},"BlogCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostCategory","relationName":"BlogCategoryToBlogPostCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_categories"},"BlogTag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"posts","kind":"object","type":"BlogPostTag","relationName":"BlogPostTagToBlogTag"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_tags"},"BlogPostCategory":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostCategory"},{"name":"category","kind":"object","type":"BlogCategory","relationName":"BlogCategoryToBlogPostCategory"}],"dbName":"blog_post_categories"},"BlogPostTag":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostTag"},{"name":"tag","kind":"object","type":"BlogTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_post_tags"},"BlogComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"postId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"authorName","kind":"scalar","type":"String"},{"name":"authorEmail","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogCommentToBlogPost"},{"name":"user","kind":"object","type":"User","relationName":"BlogCommentToUser"},{"name":"parent","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"BlogComment","relationName":"CommentReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_comments"},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConversationStatus"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerConversations"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"conversations"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"senderRole","kind":"enum","type":"UserRole"},{"name":"content","kind":"scalar","type":"String"},{"name":"attachments","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"MessageStatus"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"sender","kind":"object","type":"User","relationName":"MessageSender"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"ProductView":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductView"},{"name":"user","kind":"object","type":"User","relationName":"ProductViewToUser"},{"name":"viewedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_views"},"SearchQuery":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"query","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"resultCount","kind":"scalar","type":"Int"},{"name":"filters","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"SearchQueryToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"search_queries"},"ConversionEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"ConversionEventToUser"},{"name":"order","kind":"object","type":"Order","relationName":"ConversionEventToOrder"},{"name":"product","kind":"object","type":"Product","relationName":"ConversionEventToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"conversion_events"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","address","coupon","parent","children","products","product","images","variant","items","_count","cart","option","cartItems","order","orderItems","variantOption","inventoryTransactions","wishlist","wishlistItems","options","category","couponCategories","variants","admin","reviews","tag","tags","productViews","conversionEvents","couponProducts","categories","orders","payment","statusHistory","shipment","events","shipments","addresses","sessions","accounts","credential","customer","messages","conversation","sender","sentMessages","customerConversations","adminReviewReplies","searchQueries","post","posts","comments","replies","blogComments","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","UserCredential.findUnique","UserCredential.findUniqueOrThrow","UserCredential.findFirst","UserCredential.findFirstOrThrow","UserCredential.findMany","UserCredential.createOne","UserCredential.createMany","UserCredential.createManyAndReturn","UserCredential.updateOne","UserCredential.updateMany","UserCredential.updateManyAndReturn","UserCredential.upsertOne","UserCredential.deleteOne","UserCredential.deleteMany","UserCredential.groupBy","UserCredential.aggregate","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","Address.upsertOne","Address.deleteOne","Address.deleteMany","Address.groupBy","Address.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","_avg","_sum","Category.groupBy","Category.aggregate","Tag.findUnique","Tag.findUniqueOrThrow","Tag.findFirst","Tag.findFirstOrThrow","Tag.findMany","Tag.createOne","Tag.createMany","Tag.createManyAndReturn","Tag.updateOne","Tag.updateMany","Tag.updateManyAndReturn","Tag.upsertOne","Tag.deleteOne","Tag.deleteMany","Tag.groupBy","Tag.aggregate","ProductTag.findUnique","ProductTag.findUniqueOrThrow","ProductTag.findFirst","ProductTag.findFirstOrThrow","ProductTag.findMany","ProductTag.createOne","ProductTag.createMany","ProductTag.createManyAndReturn","ProductTag.updateOne","ProductTag.updateMany","ProductTag.updateManyAndReturn","ProductTag.upsertOne","ProductTag.deleteOne","ProductTag.deleteMany","ProductTag.groupBy","ProductTag.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","ProductVariant.findUnique","ProductVariant.findUniqueOrThrow","ProductVariant.findFirst","ProductVariant.findFirstOrThrow","ProductVariant.findMany","ProductVariant.createOne","ProductVariant.createMany","ProductVariant.createManyAndReturn","ProductVariant.updateOne","ProductVariant.updateMany","ProductVariant.updateManyAndReturn","ProductVariant.upsertOne","ProductVariant.deleteOne","ProductVariant.deleteMany","ProductVariant.groupBy","ProductVariant.aggregate","VariantOption.findUnique","VariantOption.findUniqueOrThrow","VariantOption.findFirst","VariantOption.findFirstOrThrow","VariantOption.findMany","VariantOption.createOne","VariantOption.createMany","VariantOption.createManyAndReturn","VariantOption.updateOne","VariantOption.updateMany","VariantOption.updateManyAndReturn","VariantOption.upsertOne","VariantOption.deleteOne","VariantOption.deleteMany","VariantOption.groupBy","VariantOption.aggregate","ProductImage.findUnique","ProductImage.findUniqueOrThrow","ProductImage.findFirst","ProductImage.findFirstOrThrow","ProductImage.findMany","ProductImage.createOne","ProductImage.createMany","ProductImage.createManyAndReturn","ProductImage.updateOne","ProductImage.updateMany","ProductImage.updateManyAndReturn","ProductImage.upsertOne","ProductImage.deleteOne","ProductImage.deleteMany","ProductImage.groupBy","ProductImage.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","OrderStatusHistory.findUnique","OrderStatusHistory.findUniqueOrThrow","OrderStatusHistory.findFirst","OrderStatusHistory.findFirstOrThrow","OrderStatusHistory.findMany","OrderStatusHistory.createOne","OrderStatusHistory.createMany","OrderStatusHistory.createManyAndReturn","OrderStatusHistory.updateOne","OrderStatusHistory.updateMany","OrderStatusHistory.updateManyAndReturn","OrderStatusHistory.upsertOne","OrderStatusHistory.deleteOne","OrderStatusHistory.deleteMany","OrderStatusHistory.groupBy","OrderStatusHistory.aggregate","Shipment.findUnique","Shipment.findUniqueOrThrow","Shipment.findFirst","Shipment.findFirstOrThrow","Shipment.findMany","Shipment.createOne","Shipment.createMany","Shipment.createManyAndReturn","Shipment.updateOne","Shipment.updateMany","Shipment.updateManyAndReturn","Shipment.upsertOne","Shipment.deleteOne","Shipment.deleteMany","Shipment.groupBy","Shipment.aggregate","ShipmentEvent.findUnique","ShipmentEvent.findUniqueOrThrow","ShipmentEvent.findFirst","ShipmentEvent.findFirstOrThrow","ShipmentEvent.findMany","ShipmentEvent.createOne","ShipmentEvent.createMany","ShipmentEvent.createManyAndReturn","ShipmentEvent.updateOne","ShipmentEvent.updateMany","ShipmentEvent.updateManyAndReturn","ShipmentEvent.upsertOne","ShipmentEvent.deleteOne","ShipmentEvent.deleteMany","ShipmentEvent.groupBy","ShipmentEvent.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Coupon.findUnique","Coupon.findUniqueOrThrow","Coupon.findFirst","Coupon.findFirstOrThrow","Coupon.findMany","Coupon.createOne","Coupon.createMany","Coupon.createManyAndReturn","Coupon.updateOne","Coupon.updateMany","Coupon.updateManyAndReturn","Coupon.upsertOne","Coupon.deleteOne","Coupon.deleteMany","Coupon.groupBy","Coupon.aggregate","CouponProduct.findUnique","CouponProduct.findUniqueOrThrow","CouponProduct.findFirst","CouponProduct.findFirstOrThrow","CouponProduct.findMany","CouponProduct.createOne","CouponProduct.createMany","CouponProduct.createManyAndReturn","CouponProduct.updateOne","CouponProduct.updateMany","CouponProduct.updateManyAndReturn","CouponProduct.upsertOne","CouponProduct.deleteOne","CouponProduct.deleteMany","CouponProduct.groupBy","CouponProduct.aggregate","CouponCategory.findUnique","CouponCategory.findUniqueOrThrow","CouponCategory.findFirst","CouponCategory.findFirstOrThrow","CouponCategory.findMany","CouponCategory.createOne","CouponCategory.createMany","CouponCategory.createManyAndReturn","CouponCategory.updateOne","CouponCategory.updateMany","CouponCategory.updateManyAndReturn","CouponCategory.upsertOne","CouponCategory.deleteOne","CouponCategory.deleteMany","CouponCategory.groupBy","CouponCategory.aggregate","InventoryTransaction.findUnique","InventoryTransaction.findUniqueOrThrow","InventoryTransaction.findFirst","InventoryTransaction.findFirstOrThrow","InventoryTransaction.findMany","InventoryTransaction.createOne","InventoryTransaction.createMany","InventoryTransaction.createManyAndReturn","InventoryTransaction.updateOne","InventoryTransaction.updateMany","InventoryTransaction.updateManyAndReturn","InventoryTransaction.upsertOne","InventoryTransaction.deleteOne","InventoryTransaction.deleteMany","InventoryTransaction.groupBy","InventoryTransaction.aggregate","Wishlist.findUnique","Wishlist.findUniqueOrThrow","Wishlist.findFirst","Wishlist.findFirstOrThrow","Wishlist.findMany","Wishlist.createOne","Wishlist.createMany","Wishlist.createManyAndReturn","Wishlist.updateOne","Wishlist.updateMany","Wishlist.updateManyAndReturn","Wishlist.upsertOne","Wishlist.deleteOne","Wishlist.deleteMany","Wishlist.groupBy","Wishlist.aggregate","WishlistItem.findUnique","WishlistItem.findUniqueOrThrow","WishlistItem.findFirst","WishlistItem.findFirstOrThrow","WishlistItem.findMany","WishlistItem.createOne","WishlistItem.createMany","WishlistItem.createManyAndReturn","WishlistItem.updateOne","WishlistItem.updateMany","WishlistItem.updateManyAndReturn","WishlistItem.upsertOne","WishlistItem.deleteOne","WishlistItem.deleteMany","WishlistItem.groupBy","WishlistItem.aggregate","BlogPost.findUnique","BlogPost.findUniqueOrThrow","BlogPost.findFirst","BlogPost.findFirstOrThrow","BlogPost.findMany","BlogPost.createOne","BlogPost.createMany","BlogPost.createManyAndReturn","BlogPost.updateOne","BlogPost.updateMany","BlogPost.updateManyAndReturn","BlogPost.upsertOne","BlogPost.deleteOne","BlogPost.deleteMany","BlogPost.groupBy","BlogPost.aggregate","BlogCategory.findUnique","BlogCategory.findUniqueOrThrow","BlogCategory.findFirst","BlogCategory.findFirstOrThrow","BlogCategory.findMany","BlogCategory.createOne","BlogCategory.createMany","BlogCategory.createManyAndReturn","BlogCategory.updateOne","BlogCategory.updateMany","BlogCategory.updateManyAndReturn","BlogCategory.upsertOne","BlogCategory.deleteOne","BlogCategory.deleteMany","BlogCategory.groupBy","BlogCategory.aggregate","BlogTag.findUnique","BlogTag.findUniqueOrThrow","BlogTag.findFirst","BlogTag.findFirstOrThrow","BlogTag.findMany","BlogTag.createOne","BlogTag.createMany","BlogTag.createManyAndReturn","BlogTag.updateOne","BlogTag.updateMany","BlogTag.updateManyAndReturn","BlogTag.upsertOne","BlogTag.deleteOne","BlogTag.deleteMany","BlogTag.groupBy","BlogTag.aggregate","BlogPostCategory.findUnique","BlogPostCategory.findUniqueOrThrow","BlogPostCategory.findFirst","BlogPostCategory.findFirstOrThrow","BlogPostCategory.findMany","BlogPostCategory.createOne","BlogPostCategory.createMany","BlogPostCategory.createManyAndReturn","BlogPostCategory.updateOne","BlogPostCategory.updateMany","BlogPostCategory.updateManyAndReturn","BlogPostCategory.upsertOne","BlogPostCategory.deleteOne","BlogPostCategory.deleteMany","BlogPostCategory.groupBy","BlogPostCategory.aggregate","BlogPostTag.findUnique","BlogPostTag.findUniqueOrThrow","BlogPostTag.findFirst","BlogPostTag.findFirstOrThrow","BlogPostTag.findMany","BlogPostTag.createOne","BlogPostTag.createMany","BlogPostTag.createManyAndReturn","BlogPostTag.updateOne","BlogPostTag.updateMany","BlogPostTag.updateManyAndReturn","BlogPostTag.upsertOne","BlogPostTag.deleteOne","BlogPostTag.deleteMany","BlogPostTag.groupBy","BlogPostTag.aggregate","BlogComment.findUnique","BlogComment.findUniqueOrThrow","BlogComment.findFirst","BlogComment.findFirstOrThrow","BlogComment.findMany","BlogComment.createOne","BlogComment.createMany","BlogComment.createManyAndReturn","BlogComment.updateOne","BlogComment.updateMany","BlogComment.updateManyAndReturn","BlogComment.upsertOne","BlogComment.deleteOne","BlogComment.deleteMany","BlogComment.groupBy","BlogComment.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","ProductView.findUnique","ProductView.findUniqueOrThrow","ProductView.findFirst","ProductView.findFirstOrThrow","ProductView.findMany","ProductView.createOne","ProductView.createMany","ProductView.createManyAndReturn","ProductView.updateOne","ProductView.updateMany","ProductView.updateManyAndReturn","ProductView.upsertOne","ProductView.deleteOne","ProductView.deleteMany","ProductView.groupBy","ProductView.aggregate","SearchQuery.findUnique","SearchQuery.findUniqueOrThrow","SearchQuery.findFirst","SearchQuery.findFirstOrThrow","SearchQuery.findMany","SearchQuery.createOne","SearchQuery.createMany","SearchQuery.createManyAndReturn","SearchQuery.updateOne","SearchQuery.updateMany","SearchQuery.updateManyAndReturn","SearchQuery.upsertOne","SearchQuery.deleteOne","SearchQuery.deleteMany","SearchQuery.groupBy","SearchQuery.aggregate","ConversionEvent.findUnique","ConversionEvent.findUniqueOrThrow","ConversionEvent.findFirst","ConversionEvent.findFirstOrThrow","ConversionEvent.findMany","ConversionEvent.createOne","ConversionEvent.createMany","ConversionEvent.createManyAndReturn","ConversionEvent.updateOne","ConversionEvent.updateMany","ConversionEvent.updateManyAndReturn","ConversionEvent.upsertOne","ConversionEvent.deleteOne","ConversionEvent.deleteMany","ConversionEvent.groupBy","ConversionEvent.aggregate","AND","OR","NOT","id","eventType","userId","sessionId","orderId","productId","value","currency","metadata","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","query","resultCount","filters","ip","userAgent","referrer","viewedAt","conversationId","senderId","UserRole","senderRole","content","attachments","MessageStatus","status","updatedAt","customerId","subject","ConversationStatus","assignedTo","postId","authorName","authorEmail","isApproved","parentId","tagId","categoryId","name","slug","every","some","none","description","title","excerpt","featuredImage","authorId","publishedAt","isPublished","views","metaTitle","metaDescription","metaKeywords","allowComments","wishlistId","variantOptionId","isPublic","shareToken","InventoryTransactionType","type","quantity","previousStock","newStock","referenceId","referenceType","note","createdBy","couponId","code","DiscountType","discountType","discountValue","minPurchase","maxDiscount","usageLimit","usageCount","perUserLimit","validFrom","validUntil","isActive","appliesToAll","PaymentMethod","method","PaymentStatus","amount","transactionId","gatewayResponse","paidAt","errorMessage","shipmentId","location","occurredAt","carrier","trackingNumber","trackingUrl","shippingMethod","estimatedDelivery","actualDelivery","ShipmentStatus","OrderStatus","changedBy","productName","productSku","productImage","variantSnapshot","unitPrice","discountAmount","total","orderNumber","shippingAddressId","billingAddress","notes","adminNotes","subtotal","discountTotal","shippingCost","tax","couponCode","placedAt","processedAt","shippedAt","deliveredAt","cancelledAt","returnedAt","cartId","rating","comment","isVerifiedPurchase","helpfulVotes","notHelpfulVotes","adminReply","adminRepliedAt","adminRepliedBy","src","publicId","altText","sortOrder","isPrimary","variantId","productVariantId","sku","barcode","price","compareAtPrice","costPrice","stock","shortDesc","brand","lowStockThreshold","hasVariants","isFeatured","isDigital","image","label","recipient","phone","street","city","state","zipCode","country","isDefault","passwordHash","providerId","providerAccountId","accessToken","refreshToken","expiresAt","tokenType","scope","idToken","token","ipAddress","email","emailVerified","role","UserStatus","lastLoginAt","lastIp","referralSource","postId_tagId","postId_categoryId","providerId_providerAccountId","productId_tagId","userId_productId","couponId_categoryId","wishlistId_variantOptionId","cartId_variantOptionId","productVariantId_sku","parentId_name","couponId_productId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "sBTeAuAEIQ4AAP4JACAVAACDCgAgHAAA_QkAIB8AAIAKACAgAACCCgAgIwAAogkAICkAAPkJACAqAAD6CQAgKwAA-wkAICwAAPwJACAxAADfCQAgMgAA_wkAIDMAAP0JACA0AACBCgAgOQAAhQkAIKIFAAD3CQAwowUAAFUAEKQFAAD3CQAwpQUBAAAAAa0FAACECQAgrgVAAPMIACHEBQEA9wgAIc4FAAD4CecGIs8FQADzCAAh2wUBAPcIACHOBgEA9wgAIdEGAQAAAAHjBgEAAAAB5AYgAIIJACHlBgAA4QnKBSLnBkAAgQkAIegGAQD3CAAh6QYBAPcIACEBAAAAAQAgEgMAAIkJACAjAACiCQAgogUAAK8KADCjBQAAAwAQpAUAAK8KADClBQEA8ggAIacFAQDyCAAhrgVAAPMIACHPBUAA8wgAIc8GAQD3CAAh0AYBAPcIACHRBgEA9wgAIdIGAQDyCAAh0wYBAPIIACHUBgEA9wgAIdUGAQD3CAAh1gYBAPIIACHXBiAAggkAIQcDAAD5CwAgIwAAnA0AIM8GAACwCgAg0AYAALAKACDRBgAAsAoAINQGAACwCgAg1QYAALAKACASAwAAiQkAICMAAKIJACCiBQAArwoAMKMFAAADABCkBQAArwoAMKUFAQAAAAGnBQEA8ggAIa4FQADzCAAhzwVAAPMIACHPBgEA9wgAIdAGAQD3CAAh0QYBAPcIACHSBgEA8ggAIdMGAQDyCAAh1AYBAPcIACHVBgEA9wgAIdYGAQDyCAAh1wYgAIIJACEDAAAAAwAgAQAABAAwAgAABQAgIgMAAIkJACAEAACqCgAgBQAAqwoAIAwAAJsKACAgAACCCgAgJAAArAoAICUAAK0KACAoAACuCgAgogUAAKkKADCjBQAABwAQpAUAAKkKADClBQEA8ggAIacFAQDyCAAhrgVAAPMIACHOBQAA7QmaBiLPBUAA8wgAIfkFAQD3CAAhoQYQAJ0JACGiBgEA8ggAIaMGAQDyCAAhpAYAAIQJACClBgEA9wgAIaYGAQD3CAAhpwYQAJ0JACGoBhAAnQkAIakGEACdCQAhqgYQAJ0JACGrBgEA9wgAIawGQADzCAAhrQZAAIEJACGuBkAAgQkAIa8GQACBCQAhsAZAAIEJACGxBkAAgQkAIRIDAAD5CwAgBAAA8xEAIAUAAOoRACAMAADuEQAgIAAA3REAICQAAPQRACAlAAD1EQAgKAAA9hEAIPkFAACwCgAgpAYAALAKACClBgAAsAoAIKYGAACwCgAgqwYAALAKACCtBgAAsAoAIK4GAACwCgAgrwYAALAKACCwBgAAsAoAILEGAACwCgAgIgMAAIkJACAEAACqCgAgBQAAqwoAIAwAAJsKACAgAACCCgAgJAAArAoAICUAAK0KACAoAACuCgAgogUAAKkKADCjBQAABwAQpAUAAKkKADClBQEAAAABpwUBAPIIACGuBUAA8wgAIc4FAADtCZoGIs8FQADzCAAh-QUBAPcIACGhBhAAnQkAIaIGAQAAAAGjBgEA8ggAIaQGAACECQAgpQYBAPcIACGmBgEA9wgAIacGEACdCQAhqAYQAJ0JACGpBhAAnQkAIaoGEACdCQAhqwYBAPcIACGsBkAA8wgAIa0GQACBCQAhrgZAAIEJACGvBkAAgQkAIbAGQACBCQAhsQZAAIEJACEDAAAABwAgAQAACAAwAgAACQAgFggAAKAJACAiAAChCQAgIwAAogkAIKIFAACbCQAwowUAAAsAEKQFAACbCQAwpQUBAPIIACGuBUAA8wgAIc8FQADzCAAh4AUBAPcIACH6BQEA8ggAIfwFAACcCfwFIv0FEACdCQAh_gUQAJ4JACH_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_BiAAggkAIcAGAQD3CAAhAwAAABsAIAEAABwAMAIAAB0AIAEAAAAXACAMCQAA8wkAIAoAAIcKACAXAACICgAgogUAAIYKADCjBQAAIAAQpAUAAIYKADClBQEA8ggAIaoFAQDyCAAhrgVAAPMIACHPBUAA8wgAIeEFAQDyCAAhhQYgAIIJACEBAAAAIAAgAwAAABsAIAEAABwAMAIAAB0AIBQKAACHCgAgCwAAmgoAIBAAAL4JACASAACbCgAgFAAAnAoAIBYAAIoJACCiBQAAmQoAMKMFAAAjABCkBQAAmQoAMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIYUGIACCCQAhwQYBAPIIACHCBgEA8ggAIcMGAQD3CAAhxAYQAJ0JACHFBhAAngkAIcYGEACeCQAhxwYCAIMJACEJCgAA6BEAIAsAAO0RACAQAADeDQAgEgAA7hEAIBQAAO8RACAWAAD6CwAgwwYAALAKACDFBgAAsAoAIMYGAACwCgAgFQoAAIcKACALAACaCgAgEAAAvgkAIBIAAJsKACAUAACcCgAgFgAAigkAIKIFAACZCgAwowUAACMAEKQFAACZCgAwpQUBAAAAAa4FQADzCAAhzwVAAPMIACGFBiAAggkAIcEGAQDyCAAhwgYBAAAAAcMGAQD3CAAhxAYQAJ0JACHFBhAAngkAIcYGEACeCQAhxwYCAIMJACHyBgAAmAoAIAMAAAAjACABAAAkADACAAAlACALDgAAlwoAIA8AAJAKACCiBQAAlgoAMKMFAAAnABCkBQAAlgoAMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIe0FAQDyCAAh8gUCAIMJACGyBgEA8ggAIQIOAADYEQAgDwAA7BEAIAwOAACXCgAgDwAAkAoAIKIFAACWCgAwowUAACcAEKQFAACWCgAwpQUBAAAAAa4FQADzCAAhzwVAAPMIACHtBQEA8ggAIfIFAgCDCQAhsgYBAPIIACHxBgAAlQoAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAACcAIBIPAACQCgAgEQAArQkAIKIFAACTCgAwowUAAC0AEKQFAACTCgAwpQUBAPIIACGpBQEA8ggAIaoFAQDyCAAhrgVAAPMIACHtBQEA8ggAIfIFAgCDCQAhmwYBAPIIACGcBgEA8ggAIZ0GAQD3CAAhngYAAJQKACCfBhAAnQkAIaAGEACdCQAhoQYQAJ0JACEDDwAA7BEAIBEAAKQNACCdBgAAsAoAIBIPAACQCgAgEQAArQkAIKIFAACTCgAwowUAAC0AEKQFAACTCgAwpQUBAAAAAakFAQDyCAAhqgUBAPIIACGuBUAA8wgAIe0FAQDyCAAh8gUCAIMJACGbBgEA8ggAIZwGAQDyCAAhnQYBAPcIACGeBgAAlAoAIJ8GEACdCQAhoAYQAJ0JACGhBhAAnQkAIQMAAAAtACABAAAuADACAAAvACADAAAAGwAgAQAAHAAwAgAAHQAgDxMAAJAKACCiBQAAkQoAMKMFAAAyABCkBQAAkQoAMKUFAQDyCAAhrgVAAPMIACHtBQEA8ggAIfEFAACSCvEFIvIFAgCDCQAh8wUCAIMJACH0BQIAgwkAIfUFAQD3CAAh9gUBAPcIACH3BQEA9wgAIfgFAQD3CAAhBRMAAOwRACD1BQAAsAoAIPYFAACwCgAg9wUAALAKACD4BQAAsAoAIA8TAACQCgAgogUAAJEKADCjBQAAMgAQpAUAAJEKADClBQEAAAABrgVAAPMIACHtBQEA8ggAIfEFAACSCvEFIvIFAgCDCQAh8wUCAIMJACH0BQIAgwkAIfUFAQD3CAAh9gUBAPcIACH3BQEA9wgAIfgFAQD3CAAhAwAAADIAIAEAADMAMAIAADQAIAkPAACQCgAgFQAAjwoAIKIFAACOCgAwowUAADYAEKQFAACOCgAwpQUBAPIIACGuBUAA8wgAIewFAQDyCAAh7QUBAPIIACECDwAA7BEAIBUAAN4RACAKDwAAkAoAIBUAAI8KACCiBQAAjgoAMKMFAAA2ABCkBQAAjgoAMKUFAQAAAAGuBUAA8wgAIewFAQDyCAAh7QUBAPIIACHwBgAAjQoAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAQAAADYAIAEAAAAnACABAAAALQAgAQAAABsAIAEAAAAyACABAAAANgAgAQAAABsAIAEAAAAjACABAAAAIwAgAQAAABEAIAcFAACLCgAgGAAAjAoAIKIFAACKCgAwowUAAEUAEKQFAACKCgAw2gUBAPIIACH5BQEA8ggAIQIFAADqEQAgGAAA6xEAIAgFAACLCgAgGAAAjAoAIKIFAACKCgAwowUAAEUAEKQFAACKCgAw2gUBAPIIACH5BQEA8ggAIe8GAACJCgAgAwAAAEUAIAEAAEYAMAIAAEcAIAEAAAARACABAAAAFwAgAQAAABsAIAEAAABFACADCQAA5hEAIAoAAOgRACAXAADpEQAgDAkAAPMJACAKAACHCgAgFwAAiAoAIKIFAACGCgAwowUAACAAEKQFAACGCgAwpQUBAAAAAaoFAQDyCAAhrgVAAPMIACHPBUAA8wgAIeEFAQDyCAAhhQYgAIIJACEDAAAAIAAgAQAATQAwAgAATgAgAwAAABsAIAEAABwAMAIAAB0AIBUDAACJCQAgCQAA8wkAIBsAANoJACCiBQAAhQoAMKMFAABRABCkBQAAhQoAMKUFAQDyCAAhpwUBAPIIACGqBQEA8ggAIa4FQADzCAAhzwVAAPMIACHXBSAAggkAIeEFAQD3CAAhswYCAIMJACG0BgEA9wgAIbUGIACCCQAhtgYCAIMJACG3BgIAgwkAIbgGAQD3CAAhuQZAAIEJACG6BgEA9wgAIQgDAAD5CwAgCQAA5hEAIBsAAPkLACDhBQAAsAoAILQGAACwCgAguAYAALAKACC5BgAAsAoAILoGAACwCgAgFgMAAIkJACAJAADzCQAgGwAA2gkAIKIFAACFCgAwowUAAFEAEKQFAACFCgAwpQUBAAAAAacFAQDyCAAhqgUBAPIIACGuBUAA8wgAIc8FQADzCAAh1wUgAIIJACHhBQEA9wgAIbMGAgCDCQAhtAYBAPcIACG1BiAAggkAIbYGAgCDCQAhtwYCAIMJACG4BgEA9wgAIbkGQACBCQAhugYBAPcIACHuBgAAhAoAIAMAAABRACABAABSADACAABTACAhDgAA_gkAIBUAAIMKACAcAAD9CQAgHwAAgAoAICAAAIIKACAjAACiCQAgKQAA-QkAICoAAPoJACArAAD7CQAgLAAA_AkAIDEAAN8JACAyAAD_CQAgMwAA_QkAIDQAAIEKACA5AACFCQAgogUAAPcJADCjBQAAVQAQpAUAAPcJADClBQEA8ggAIa0FAACECQAgrgVAAPMIACHEBQEA9wgAIc4FAAD4CecGIs8FQADzCAAh2wUBAPcIACHOBgEA9wgAIdEGAQD3CAAh4wYBAPIIACHkBiAAggkAIeUGAADhCcoFIucGQACBCQAh6AYBAPcIACHpBgEA9wgAIQEAAABVACAICQAA8wkAIB0AAPYJACCiBQAA9QkAMKMFAABXABCkBQAA9QkAMKoFAQDyCAAhrgVAAPMIACHZBQEA8ggAIQIJAADmEQAgHQAA5xEAIAkJAADzCQAgHQAA9gkAIKIFAAD1CQAwowUAAFcAEKQFAAD1CQAwqgUBAPIIACGuBUAA8wgAIdkFAQDyCAAh7QYAAPQJACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAEAAABXACANAwAA2gkAIAkAAPMJACCiBQAA8gkAMKMFAABdABCkBQAA8gkAMKUFAQDyCAAhpwUBAPcIACGoBQEA9wgAIaoFAQDyCAAhwwUBAPcIACHEBQEA9wgAIcUFAQD3CAAhxgVAAPMIACEHAwAA-QsAIAkAAOYRACCnBQAAsAoAIKgFAACwCgAgwwUAALAKACDEBQAAsAoAIMUFAACwCgAgDQMAANoJACAJAADzCQAgogUAAPIJADCjBQAAXQAQpAUAAPIJADClBQEAAAABpwUBAPcIACGoBQEA9wgAIaoFAQDyCAAhwwUBAPcIACHEBQEA9wgAIcUFAQD3CAAhxgVAAPMIACEDAAAAXQAgAQAAXgAwAgAAXwAgAQAAAFUAIBADAADaCQAgCQAA8QkAIBEAAPAJACCiBQAA7gkAMKMFAABiABCkBQAA7gkAMKUFAQDyCAAhpgUBAPIIACGnBQEA9wgAIagFAQD3CAAhqQUBAPcIACGqBQEA9wgAIasFCADvCQAhrAUBAPcIACGtBQAAhAkAIK4FQADzCAAhCgMAAPkLACAJAADmEQAgEQAApA0AIKcFAACwCgAgqAUAALAKACCpBQAAsAoAIKoFAACwCgAgqwUAALAKACCsBQAAsAoAIK0FAACwCgAgEAMAANoJACAJAADxCQAgEQAA8AkAIKIFAADuCQAwowUAAGIAEKQFAADuCQAwpQUBAAAAAaYFAQDyCAAhpwUBAPcIACGoBQEA9wgAIakFAQD3CAAhqgUBAPcIACGrBQgA7wkAIawFAQD3CAAhrQUAAIQJACCuBUAA8wgAIQMAAABiACABAABjADACAABkACABAAAAVQAgAQAAAAcAIAEAAAAXACADAAAADQAgAQAADgAwAgAADwAgAQAAACAAIAEAAAAbACABAAAAUQAgAQAAAFcAIAEAAABdACABAAAAYgAgAQAAAA0AIAMAAABFACABAABGADACAABHACADAAAABwAgAQAACAAwAgAACQAgAQAAAA0AIAEAAABFACABAAAABwAgAwAAAC0AIAEAAC4AMAIAAC8AIA8RAACtCQAgogUAAKoJADCjBQAAdwAQpAUAAKoJADClBQEA8ggAIakFAQDyCAAhrgVAAPMIACHOBQAArAmKBiLPBUAA8wgAIYgGAACrCYgGIooGEACdCQAhiwYBAPcIACGMBgAAhAkAII0GQACBCQAhjgYBAPcIACEBAAAAdwAgChEAAK0JACCiBQAA7AkAMKMFAAB5ABCkBQAA7AkAMKUFAQDyCAAhqQUBAPIIACGuBUAA8wgAIc4FAADtCZoGIvcFAQD3CAAhmgYBAPcIACEDEQAApA0AIPcFAACwCgAgmgYAALAKACAKEQAArQkAIKIFAADsCQAwowUAAHkAEKQFAADsCQAwpQUBAAAAAakFAQDyCAAhrgVAAPMIACHOBQAA7QmaBiL3BQEA9wgAIZoGAQD3CAAhAwAAAHkAIAEAAHoAMAIAAHsAIBERAACtCQAgJwAA6wkAIKIFAADpCQAwowUAAH0AEKQFAADpCQAwpQUBAPIIACGpBQEA8ggAIa0FAACECQAgrgVAAPMIACHOBQAA6gmZBiLPBUAA8wgAIZIGAQDyCAAhkwYBAPIIACGUBgEA9wgAIZUGAQD3CAAhlgZAAIEJACGXBkAAgQkAIQcRAACkDQAgJwAA5REAIK0FAACwCgAglAYAALAKACCVBgAAsAoAIJYGAACwCgAglwYAALAKACAREQAArQkAICcAAOsJACCiBQAA6QkAMKMFAAB9ABCkBQAA6QkAMKUFAQAAAAGpBQEAAAABrQUAAIQJACCuBUAA8wgAIc4FAADqCZkGIs8FQADzCAAhkgYBAPIIACGTBgEA8ggAIZQGAQD3CAAhlQYBAPcIACGWBkAAgQkAIZcGQACBCQAhAwAAAH0AIAEAAH4AMAIAAH8AIAsmAADoCQAgogUAAOcJADCjBQAAgQEAEKQFAADnCQAwpQUBAPIIACGuBUAA8wgAIc4FAQDyCAAh4AUBAPcIACGPBgEA8ggAIZAGAQD3CAAhkQZAAPMIACEDJgAA5BEAIOAFAACwCgAgkAYAALAKACALJgAA6AkAIKIFAADnCQAwowUAAIEBABCkBQAA5wkAMKUFAQAAAAGuBUAA8wgAIc4FAQDyCAAh4AUBAPcIACGPBgEA8ggAIZAGAQD3CAAhkQZAAPMIACEDAAAAgQEAIAEAAIIBADACAACDAQAgAQAAAIEBACADAAAAYgAgAQAAYwAwAgAAZAAgAQAAAC0AIAEAAAB5ACABAAAAfQAgAQAAAGIAIAEAAAAHACAMAwAAiQkAIKIFAADmCQAwowUAAIwBABCkBQAA5gkAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIcQFAQD3CAAhzwVAAPMIACHdBkAA8wgAIeEGAQDyCAAh4gYBAPcIACEDAwAA-QsAIMQFAACwCgAg4gYAALAKACAMAwAAiQkAIKIFAADmCQAwowUAAIwBABCkBQAA5gkAMKUFAQAAAAGnBQEA8ggAIa4FQADzCAAhxAUBAPcIACHPBUAA8wgAId0GQADzCAAh4QYBAAAAAeIGAQD3CAAhAwAAAIwBACABAACNAQAwAgAAjgEAIBADAACJCQAgogUAAOUJADCjBQAAkAEAEKQFAADlCQAwpQUBAPIIACGnBQEA8ggAIa4FQADzCAAhzwVAAPMIACHZBgEA8ggAIdoGAQDyCAAh2wYBAPcIACHcBgEA9wgAId0GQACBCQAh3gYBAPcIACHfBgEA9wgAIeAGAQD3CAAhBwMAAPkLACDbBgAAsAoAINwGAACwCgAg3QYAALAKACDeBgAAsAoAIN8GAACwCgAg4AYAALAKACARAwAAiQkAIKIFAADlCQAwowUAAJABABCkBQAA5QkAMKUFAQAAAAGnBQEA8ggAIa4FQADzCAAhzwVAAPMIACHZBgEA8ggAIdoGAQDyCAAh2wYBAPcIACHcBgEA9wgAId0GQACBCQAh3gYBAPcIACHfBgEA9wgAIeAGAQD3CAAh7AYAAOQJACADAAAAkAEAIAEAAJEBADACAACSAQAgCQMAAIkJACCiBQAAywkAMKMFAACUAQAQpAUAAMsJADClBQEA8ggAIacFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdgGAQDyCAAhAQAAAJQBACADAAAAUQAgAQAAUgAwAgAAUwAgAwAAAAcAIAEAAAgAMAIAAAkAIAkDAACJCQAgDAAAvgkAIKIFAAC9CQAwowUAAJgBABCkBQAAvQkAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc8FQADzCAAhAQAAAJgBACAOLwAA4wkAIDAAAIkJACCiBQAA4AkAMKMFAACaAQAQpAUAAOAJADClBQEA8ggAIa4FQADzCAAhxwUBAPIIACHIBQEA8ggAIcoFAADhCcoFIssFAQDyCAAhzAUAAIQJACDOBQAA4gnOBSLPBUAA8wgAIQMvAADjEQAgMAAA-QsAIMwFAACwCgAgDi8AAOMJACAwAACJCQAgogUAAOAJADCjBQAAmgEAEKQFAADgCQAwpQUBAAAAAa4FQADzCAAhxwUBAPIIACHIBQEA8ggAIcoFAADhCcoFIssFAQDyCAAhzAUAAIQJACDOBQAA4gnOBSLPBUAA8wgAIQMAAACaAQAgAQAAmwEAMAIAAJwBACADAAAAmgEAIAEAAJsBADACAACcAQAgAQAAAJoBACAMLQAAiQkAIC4AAN8JACCiBQAA3QkAMKMFAACgAQAQpAUAAN0JADClBQEA8ggAIa4FQADzCAAhzgUAAN4J0wUizwVAAPMIACHQBQEA8ggAIdEFAQDyCAAh0wUBAPcIACEDLQAA-QsAIC4AANkRACDTBQAAsAoAIAwtAACJCQAgLgAA3wkAIKIFAADdCQAwowUAAKABABCkBQAA3QkAMKUFAQAAAAGuBUAA8wgAIc4FAADeCdMFIs8FQADzCAAh0AUBAPIIACHRBQEA8ggAIdMFAQD3CAAhAwAAAKABACABAAChAQAwAgAAogEAIAMAAABRACABAABSADACAABTACADAAAAXQAgAQAAXgAwAgAAXwAgCwMAANoJACCiBQAA3AkAMKMFAACmAQAQpAUAANwJADClBQEA8ggAIacFAQD3CAAhqAUBAPcIACGuBUAA8wgAIcAFAQDyCAAhwQUCAJ8JACHCBQAAhAkAIAUDAAD5CwAgpwUAALAKACCoBQAAsAoAIMEFAACwCgAgwgUAALAKACALAwAA2gkAIKIFAADcCQAwowUAAKYBABCkBQAA3AkAMKUFAQAAAAGnBQEA9wgAIagFAQD3CAAhrgVAAPMIACHABQEA8ggAIcEFAgCfCQAhwgUAAIQJACADAAAApgEAIAEAAKcBADACAACoAQAgAQAAAFUAIBEDAADaCQAgBgAA2wkAIDUAANQJACA4AACFCQAgogUAANkJADCjBQAAqwEAEKQFAADZCQAwpQUBAPIIACGnBQEA9wgAIa4FQADzCAAhywUBAPIIACHPBUAA8wgAIdQFAQDyCAAh1QUBAPcIACHWBQEA9wgAIdcFIACCCQAh2AUBAPcIACEIAwAA-QsAIAYAAOIRACA1AADfEQAgOAAA3gsAIKcFAACwCgAg1QUAALAKACDWBQAAsAoAINgFAACwCgAgEQMAANoJACAGAADbCQAgNQAA1AkAIDgAAIUJACCiBQAA2QkAMKMFAACrAQAQpAUAANkJADClBQEAAAABpwUBAPcIACGuBUAA8wgAIcsFAQDyCAAhzwVAAPMIACHUBQEA8ggAIdUFAQD3CAAh1gUBAPcIACHXBSAAggkAIdgFAQD3CAAhAwAAAKsBACABAACsAQAwAgAArQEAIAcYAADYCQAgNQAA1AkAIKIFAADXCQAwowUAAK8BABCkBQAA1wkAMNQFAQDyCAAh2gUBAPIIACECGAAA4REAIDUAAN8RACAIGAAA2AkAIDUAANQJACCiBQAA1wkAMKMFAACvAQAQpAUAANcJADDUBQEA8ggAIdoFAQDyCAAh6wYAANYJACADAAAArwEAIAEAALABADACAACxAQAgAwAAAK8BACABAACwAQAwAgAAsQEAIAEAAACvAQAgBx0AANUJACA1AADUCQAgogUAANMJADCjBQAAtQEAEKQFAADTCQAw1AUBAPIIACHZBQEA8ggAIQIdAADgEQAgNQAA3xEAIAgdAADVCQAgNQAA1AkAIKIFAADTCQAwowUAALUBABCkBQAA0wkAMNQFAQDyCAAh2QUBAPIIACHqBgAA0gkAIAMAAAC1AQAgAQAAtgEAMAIAALcBACADAAAAtQEAIAEAALYBADACAAC3AQAgAQAAALUBACADAAAAqwEAIAEAAKwBADACAACtAQAgAQAAAK8BACABAAAAtQEAIAEAAACrAQAgAQAAAFUAIAEAAACrAQAgAwAAAKsBACABAACsAQAwAgAArQEAIAEAAACrAQAgAwAAAGIAIAEAAGMAMAIAAGQAIAwDAACJCQAgDAAAigkAIKIFAACICQAwowUAAMQBABCkBQAAiAkAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc8FQADzCAAh2wUBAPIIACHuBSAAggkAIe8FAQD3CAAhAQAAAMQBACABAAAAAwAgAQAAAIwBACABAAAAkAEAIAEAAABRACABAAAABwAgAQAAAJoBACABAAAAoAEAIAEAAABRACABAAAAXQAgAQAAAKYBACABAAAAqwEAIAEAAABiACABAAAAAQAgFw4AANgRACAVAADeEQAgHAAA1xEAIB8AANsRACAgAADdEQAgIwAAnA0AICkAANMRACAqAADUEQAgKwAA1REAICwAANYRACAxAADZEQAgMgAA2hEAIDMAANcRACA0AADcEQAgOQAA3gsAIK0FAACwCgAgxAUAALAKACDbBQAAsAoAIM4GAACwCgAg0QYAALAKACDnBgAAsAoAIOgGAACwCgAg6QYAALAKACADAAAAVQAgAQAA0wEAMAIAAAEAIAMAAABVACABAADTAQAwAgAAAQAgAwAAAFUAIAEAANMBADACAAABACAeDgAAyhEAIBUAANIRACAcAADIEQAgHwAAzhEAICAAANERACAjAADJEQAgKQAAxBEAICoAAMURACArAADGEQAgLAAAxxEAIDEAAMsRACAyAADMEQAgMwAAzREAIDQAAM8RACA5AADQEQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5wYCzwVAAAAAAdsFAQAAAAHOBgEAAAAB0QYBAAAAAeMGAQAAAAHkBiAAAAAB5QYAAADKBQLnBkAAAAAB6AYBAAAAAekGAQAAAAEBPwAA1wEAIA-lBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADnBgLPBUAAAAAB2wUBAAAAAc4GAQAAAAHRBgEAAAAB4wYBAAAAAeQGIAAAAAHlBgAAAMoFAucGQAAAAAHoBgEAAAAB6QYBAAAAAQE_AADZAQAwAT8AANkBADAeDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACAjAACwEAAgKQAAqxAAICoAAKwQACArAACtEAAgLAAArhAAIDEAALIQACAyAACzEAAgMwAAtBAAIDQAALYQACA5AAC3EAAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIQIAAAABACA_AADcAQAgD6UFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACECAAAAVQAgPwAA3gEAIAIAAABVACA_AADeAQAgAwAAAAEAIEYAANcBACBHAADcAQAgAQAAAAEAIAEAAABVACALDQAApxAAIEwAAKkQACBNAACoEAAgrQUAALAKACDEBQAAsAoAINsFAACwCgAgzgYAALAKACDRBgAAsAoAIOcGAACwCgAg6AYAALAKACDpBgAAsAoAIBKiBQAAzgkAMKMFAADlAQAQpAUAAM4JADClBQEAywgAIa0FAADOCAAgrgVAAM8IACHEBQEAzAgAIc4FAADPCecGIs8FQADPCAAh2wUBAMwIACHOBgEAzAgAIdEGAQDMCAAh4wYBAMsIACHkBiAA6wgAIeUGAADgCMoFIucGQAD6CAAh6AYBAMwIACHpBgEAzAgAIQMAAABVACABAADkAQAwSwAA5QEAIAMAAABVACABAADTAQAwAgAAAQAgAQAAAI4BACABAAAAjgEAIAMAAACMAQAgAQAAjQEAMAIAAI4BACADAAAAjAEAIAEAAI0BADACAACOAQAgAwAAAIwBACABAACNAQAwAgAAjgEAIAkDAACmEAAgpQUBAAAAAacFAQAAAAGuBUAAAAABxAUBAAAAAc8FQAAAAAHdBkAAAAAB4QYBAAAAAeIGAQAAAAEBPwAA7QEAIAilBQEAAAABpwUBAAAAAa4FQAAAAAHEBQEAAAABzwVAAAAAAd0GQAAAAAHhBgEAAAAB4gYBAAAAAQE_AADvAQAwAT8AAO8BADAJAwAApRAAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIcQFAQC3CgAhzwVAALkKACHdBkAAuQoAIeEGAQC2CgAh4gYBALcKACECAAAAjgEAID8AAPIBACAIpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhxAUBALcKACHPBUAAuQoAId0GQAC5CgAh4QYBALYKACHiBgEAtwoAIQIAAACMAQAgPwAA9AEAIAIAAACMAQAgPwAA9AEAIAMAAACOAQAgRgAA7QEAIEcAAPIBACABAAAAjgEAIAEAAACMAQAgBQ0AAKIQACBMAACkEAAgTQAAoxAAIMQFAACwCgAg4gYAALAKACALogUAAM0JADCjBQAA-wEAEKQFAADNCQAwpQUBAMsIACGnBQEAywgAIa4FQADPCAAhxAUBAMwIACHPBUAAzwgAId0GQADPCAAh4QYBAMsIACHiBgEAzAgAIQMAAACMAQAgAQAA-gEAMEsAAPsBACADAAAAjAEAIAEAAI0BADACAACOAQAgAQAAAJIBACABAAAAkgEAIAMAAACQAQAgAQAAkQEAMAIAAJIBACADAAAAkAEAIAEAAJEBADACAACSAQAgAwAAAJABACABAACRAQAwAgAAkgEAIA0DAAChEAAgpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAdkGAQAAAAHaBgEAAAAB2wYBAAAAAdwGAQAAAAHdBkAAAAAB3gYBAAAAAd8GAQAAAAHgBgEAAAABAT8AAIMCACAMpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAdkGAQAAAAHaBgEAAAAB2wYBAAAAAdwGAQAAAAHdBkAAAAAB3gYBAAAAAd8GAQAAAAHgBgEAAAABAT8AAIUCADABPwAAhQIAMA0DAACgEAAgpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzwVAALkKACHZBgEAtgoAIdoGAQC2CgAh2wYBALcKACHcBgEAtwoAId0GQAC7CwAh3gYBALcKACHfBgEAtwoAIeAGAQC3CgAhAgAAAJIBACA_AACIAgAgDKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAh2QYBALYKACHaBgEAtgoAIdsGAQC3CgAh3AYBALcKACHdBkAAuwsAId4GAQC3CgAh3wYBALcKACHgBgEAtwoAIQIAAACQAQAgPwAAigIAIAIAAACQAQAgPwAAigIAIAMAAACSAQAgRgAAgwIAIEcAAIgCACABAAAAkgEAIAEAAACQAQAgCQ0AAJ0QACBMAACfEAAgTQAAnhAAINsGAACwCgAg3AYAALAKACDdBgAAsAoAIN4GAACwCgAg3wYAALAKACDgBgAAsAoAIA-iBQAAzAkAMKMFAACRAgAQpAUAAMwJADClBQEAywgAIacFAQDLCAAhrgVAAM8IACHPBUAAzwgAIdkGAQDLCAAh2gYBAMsIACHbBgEAzAgAIdwGAQDMCAAh3QZAAPoIACHeBgEAzAgAId8GAQDMCAAh4AYBAMwIACEDAAAAkAEAIAEAAJACADBLAACRAgAgAwAAAJABACABAACRAQAwAgAAkgEAIAkDAACJCQAgogUAAMsJADCjBQAAlAEAEKQFAADLCQAwpQUBAAAAAacFAQAAAAGuBUAA8wgAIc8FQADzCAAh2AYBAPIIACEBAAAAlAIAIAEAAACUAgAgAQMAAPkLACADAAAAlAEAIAEAAJcCADACAACUAgAgAwAAAJQBACABAACXAgAwAgAAlAIAIAMAAACUAQAgAQAAlwIAMAIAAJQCACAGAwAAnBAAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHYBgEAAAABAT8AAJsCACAFpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAdgGAQAAAAEBPwAAnQIAMAE_AACdAgAwBgMAAJsQACClBQEAtgoAIacFAQC2CgAhrgVAALkKACHPBUAAuQoAIdgGAQC2CgAhAgAAAJQCACA_AACgAgAgBaUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAh2AYBALYKACECAAAAlAEAID8AAKICACACAAAAlAEAID8AAKICACADAAAAlAIAIEYAAJsCACBHAACgAgAgAQAAAJQCACABAAAAlAEAIAMNAACYEAAgTAAAmhAAIE0AAJkQACAIogUAAMoJADCjBQAAqQIAEKQFAADKCQAwpQUBAMsIACGnBQEAywgAIa4FQADPCAAhzwVAAM8IACHYBgEAywgAIQMAAACUAQAgAQAAqAIAMEsAAKkCACADAAAAlAEAIAEAAJcCADACAACUAgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAPAwAAlhAAICMAAJcQACClBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAABzwYBAAAAAdAGAQAAAAHRBgEAAAAB0gYBAAAAAdMGAQAAAAHUBgEAAAAB1QYBAAAAAdYGAQAAAAHXBiAAAAABAT8AALECACANpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAc8GAQAAAAHQBgEAAAAB0QYBAAAAAdIGAQAAAAHTBgEAAAAB1AYBAAAAAdUGAQAAAAHWBgEAAAAB1wYgAAAAAQE_AACzAgAwAT8AALMCADAPAwAAixAAICMAAIwQACClBQEAtgoAIacFAQC2CgAhrgVAALkKACHPBUAAuQoAIc8GAQC3CgAh0AYBALcKACHRBgEAtwoAIdIGAQC2CgAh0wYBALYKACHUBgEAtwoAIdUGAQC3CgAh1gYBALYKACHXBiAA7woAIQIAAAAFACA_AAC2AgAgDaUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAhzwYBALcKACHQBgEAtwoAIdEGAQC3CgAh0gYBALYKACHTBgEAtgoAIdQGAQC3CgAh1QYBALcKACHWBgEAtgoAIdcGIADvCgAhAgAAAAMAID8AALgCACACAAAAAwAgPwAAuAIAIAMAAAAFACBGAACxAgAgRwAAtgIAIAEAAAAFACABAAAAAwAgCA0AAIgQACBMAACKEAAgTQAAiRAAIM8GAACwCgAg0AYAALAKACDRBgAAsAoAINQGAACwCgAg1QYAALAKACAQogUAAMkJADCjBQAAvwIAEKQFAADJCQAwpQUBAMsIACGnBQEAywgAIa4FQADPCAAhzwVAAM8IACHPBgEAzAgAIdAGAQDMCAAh0QYBAMwIACHSBgEAywgAIdMGAQDLCAAh1AYBAMwIACHVBgEAzAgAIdYGAQDLCAAh1wYgAOsIACEDAAAAAwAgAQAAvgIAMEsAAL8CACADAAAAAwAgAQAABAAwAgAABQAgAQAAABUAIAEAAAAVACADAAAAEQAgAQAAFAAwAgAAFQAgAwAAABEAIAEAABQAMAIAABUAIAMAAAARACABAAAUADACAAAVACASBgAAhxAAIAcAAIMQACAIAACEEAAgCgAAhRAAIBkAAIYQACClBQEAAAABrgVAAAAAAc8FQAAAAAHYBQEAAAAB2wUBAAAAAdwFAQAAAAHgBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAb4GAgAAAAHOBgEAAAABAT8AAMcCACANpQUBAAAAAa4FQAAAAAHPBUAAAAAB2AUBAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAG-BgIAAAABzgYBAAAAAQE_AADJAgAwAT8AAMkCADABAAAAEQAgEgYAANQPACAHAADVDwAgCAAA1g8AIAoAANcPACAZAADYDwAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2AUBALcKACHbBQEAtgoAIdwFAQC2CgAh4AUBALcKACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACGFBiAA7woAIb4GAgC8CwAhzgYBALcKACECAAAAFQAgPwAAzQIAIA2lBQEAtgoAIa4FQAC5CgAhzwVAALkKACHYBQEAtwoAIdsFAQC2CgAh3AUBALYKACHgBQEAtwoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhvgYCALwLACHOBgEAtwoAIQIAAAARACA_AADPAgAgAgAAABEAID8AAM8CACABAAAAEQAgAwAAABUAIEYAAMcCACBHAADNAgAgAQAAABUAIAEAAAARACALDQAAzw8AIEwAANIPACBNAADRDwAgngEAANAPACCfAQAA0w8AINgFAACwCgAg4AUAALAKACDoBQAAsAoAIOkFAACwCgAg6gUAALAKACDOBgAAsAoAIBCiBQAAyAkAMKMFAADXAgAQpAUAAMgJADClBQEAywgAIa4FQADPCAAhzwVAAM8IACHYBQEAzAgAIdsFAQDLCAAh3AUBAMsIACHgBQEAzAgAIegFAQDMCAAh6QUBAMwIACHqBQEAzAgAIYUGIADrCAAhvgYCAPsIACHOBgEAzAgAIQMAAAARACABAADWAgAwSwAA1wIAIAMAAAARACABAAAUADACAAAVACAJCAAAxwkAIKIFAADGCQAwowUAAN0CABCkBQAAxgkAMKUFAQAAAAGuBUAA8wgAIc8FQADzCAAh2wUBAAAAAdwFAQAAAAEBAAAA2gIAIAEAAADaAgAgCQgAAMcJACCiBQAAxgkAMKMFAADdAgAQpAUAAMYJADClBQEA8ggAIa4FQADzCAAhzwVAAPMIACHbBQEA8ggAIdwFAQDyCAAhAQgAAM4PACADAAAA3QIAIAEAAN4CADACAADaAgAgAwAAAN0CACABAADeAgAwAgAA2gIAIAMAAADdAgAgAQAA3gIAMAIAANoCACAGCAAAzQ8AIKUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAABAT8AAOICACAFpQUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAdwFAQAAAAEBPwAA5AIAMAE_AADkAgAwBggAAMMPACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHbBQEAtgoAIdwFAQC2CgAhAgAAANoCACA_AADnAgAgBaUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdsFAQC2CgAh3AUBALYKACECAAAA3QIAID8AAOkCACACAAAA3QIAID8AAOkCACADAAAA2gIAIEYAAOICACBHAADnAgAgAQAAANoCACABAAAA3QIAIAMNAADADwAgTAAAwg8AIE0AAMEPACAIogUAAMUJADCjBQAA8AIAEKQFAADFCQAwpQUBAMsIACGuBUAAzwgAIc8FQADPCAAh2wUBAMsIACHcBQEAywgAIQMAAADdAgAgAQAA7wIAMEsAAPACACADAAAA3QIAIAEAAN4CADACAADaAgAgAQAAAFkAIAEAAABZACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACAFCQAAvw8AIB0AAJEPACCqBQEAAAABrgVAAAAAAdkFAQAAAAEBPwAA-AIAIAOqBQEAAAABrgVAAAAAAdkFAQAAAAEBPwAA-gIAMAE_AAD6AgAwBQkAAL4PACAdAACPDwAgqgUBALYKACGuBUAAuQoAIdkFAQC2CgAhAgAAAFkAID8AAP0CACADqgUBALYKACGuBUAAuQoAIdkFAQC2CgAhAgAAAFcAID8AAP8CACACAAAAVwAgPwAA_wIAIAMAAABZACBGAAD4AgAgRwAA_QIAIAEAAABZACABAAAAVwAgAw0AALsPACBMAAC9DwAgTQAAvA8AIAaiBQAAxAkAMKMFAACGAwAQpAUAAMQJADCqBQEAywgAIa4FQADPCAAh2QUBAMsIACEDAAAAVwAgAQAAhQMAMEsAAIYDACADAAAAVwAgAQAAWAAwAgAAWQAgAQAAABkAIAEAAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACAgCgAAtQ8AIBgAALMPACAaAAC0DwAgHAAAtg8AIB4AALcPACAfAAC4DwAgIAAAuQ8AICEAALoPACClBQEAAAABrQWAAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAdwFAQAAAAHgBQEAAAAB4QUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAHIBgEAAAAByQYBAAAAAcoGAgAAAAHLBiAAAAABzAYgAAAAAc0GIAAAAAEBPwAAjgMAIBilBQEAAAABrQWAAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAdwFAQAAAAHgBQEAAAAB4QUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAHIBgEAAAAByQYBAAAAAcoGAgAAAAHLBiAAAAABzAYgAAAAAc0GIAAAAAEBPwAAkAMAMAE_AACQAwAwAQAAABEAICAKAADgDgAgGAAA3g4AIBoAAN8OACAcAADhDgAgHgAA4g4AIB8AAOMOACAgAADkDgAgIQAA5Q4AIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhzwVAALkKACHaBQEAtwoAIdwFAQC2CgAh4AUBALcKACHhBQEAtgoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhwgYBALcKACHDBgEAtwoAIcQGEACYDAAhxQYQAJgMACHGBhAAmAwAIccGAgDFCgAhyAYBALcKACHJBgEAtwoAIcoGAgC8CwAhywYgAO8KACHMBiAA7woAIc0GIADvCgAhAgAAABkAID8AAJQDACAYpQUBALYKACGtBYAAAAABrgVAALkKACHPBUAAuQoAIdoFAQC3CgAh3AUBALYKACHgBQEAtwoAIeEFAQC2CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACHCBgEAtwoAIcMGAQC3CgAhxAYQAJgMACHFBhAAmAwAIcYGEACYDAAhxwYCAMUKACHIBgEAtwoAIckGAQC3CgAhygYCALwLACHLBiAA7woAIcwGIADvCgAhzQYgAO8KACECAAAAFwAgPwAAlgMAIAIAAAAXACA_AACWAwAgAQAAABEAIAMAAAAZACBGAACOAwAgRwAAlAMAIAEAAAAZACABAAAAFwAgEw0AANkOACBMAADcDgAgTQAA2w4AIJ4BAADaDgAgnwEAAN0OACCtBQAAsAoAINoFAACwCgAg4AUAALAKACDoBQAAsAoAIOkFAACwCgAg6gUAALAKACDCBgAAsAoAIMMGAACwCgAgxAYAALAKACDFBgAAsAoAIMYGAACwCgAgxwYAALAKACDIBgAAsAoAIMkGAACwCgAgG6IFAADDCQAwowUAAJ4DABCkBQAAwwkAMKUFAQDLCAAhrQUAAM4IACCuBUAAzwgAIc8FQADPCAAh2gUBAMwIACHcBQEAywgAIeAFAQDMCAAh4QUBAMsIACHoBQEAzAgAIekFAQDMCAAh6gUBAMwIACGFBiAA6wgAIcIGAQDMCAAhwwYBAMwIACHEBhAAlAkAIcUGEACUCQAhxgYQAJQJACHHBgIA3AgAIcgGAQDMCAAhyQYBAMwIACHKBgIA-wgAIcsGIADrCAAhzAYgAOsIACHNBiAA6wgAIQMAAAAXACABAACdAwAwSwAAngMAIAMAAAAXACABAAAYADACAAAZACABAAAATgAgAQAAAE4AIAMAAAAgACABAABNADACAABOACADAAAAIAAgAQAATQAwAgAATgAgAwAAACAAIAEAAE0AMAIAAE4AIAkJAADWDgAgCgAA1w4AIBcAANgOACClBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAEBPwAApgMAIAalBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB4QUBAAAAAYUGIAAAAAEBPwAAqAMAMAE_AACoAwAwCQkAAL4OACAKAAC_DgAgFwAAwA4AIKUFAQC2CgAhqgUBALYKACGuBUAAuQoAIc8FQAC5CgAh4QUBALYKACGFBiAA7woAIQIAAABOACA_AACrAwAgBqUFAQC2CgAhqgUBALYKACGuBUAAuQoAIc8FQAC5CgAh4QUBALYKACGFBiAA7woAIQIAAAAgACA_AACtAwAgAgAAACAAID8AAK0DACADAAAATgAgRgAApgMAIEcAAKsDACABAAAATgAgAQAAACAAIAMNAAC7DgAgTAAAvQ4AIE0AALwOACAJogUAAMIJADCjBQAAtAMAEKQFAADCCQAwpQUBAMsIACGqBQEAywgAIa4FQADPCAAhzwVAAM8IACHhBQEAywgAIYUGIADrCAAhAwAAACAAIAEAALMDADBLAAC0AwAgAwAAACAAIAEAAE0AMAIAAE4AIAEAAAAlACABAAAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgEQoAALgOACALAAC1DgAgEAAAtg4AIBIAALcOACAUAAC5DgAgFgAAug4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAYUGIAAAAAHBBgEAAAABwgYBAAAAAcMGAQAAAAHEBhAAAAABxQYQAAAAAcYGEAAAAAHHBgIAAAABAT8AALwDACALpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcEGAQAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAEBPwAAvgMAMAE_AAC-AwAwEQoAAP8NACALAAD8DQAgEAAA_Q0AIBIAAP4NACAUAACADgAgFgAAgQ4AIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIYUGIADvCgAhwQYBALYKACHCBgEAtgoAIcMGAQC3CgAhxAYQAJcMACHFBhAAmAwAIcYGEACYDAAhxwYCALwLACECAAAAJQAgPwAAwQMAIAulBQEAtgoAIa4FQAC5CgAhzwVAALkKACGFBiAA7woAIcEGAQC2CgAhwgYBALYKACHDBgEAtwoAIcQGEACXDAAhxQYQAJgMACHGBhAAmAwAIccGAgC8CwAhAgAAACMAID8AAMMDACACAAAAIwAgPwAAwwMAIAMAAAAlACBGAAC8AwAgRwAAwQMAIAEAAAAlACABAAAAIwAgCA0AAPcNACBMAAD6DQAgTQAA-Q0AIJ4BAAD4DQAgnwEAAPsNACDDBgAAsAoAIMUGAACwCgAgxgYAALAKACAOogUAAMEJADCjBQAAygMAEKQFAADBCQAwpQUBAMsIACGuBUAAzwgAIc8FQADPCAAhhQYgAOsIACHBBgEAywgAIcIGAQDLCAAhwwYBAMwIACHEBhAAkwkAIcUGEACUCQAhxgYQAJQJACHHBgIA-wgAIQMAAAAjACABAADJAwAwSwAAygMAIAMAAAAjACABAAAkADACAAAlACABAAAAHQAgAQAAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIBAJAADzDQAgCwAA9A0AIA8AAPUNACAYAAD2DQAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHtBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAHABgEAAAABAT8AANIDACAMpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHtBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAHABgEAAAABAT8AANQDADABPwAA1AMAMAEAAAAXACABAAAAIAAgAQAAACMAIAEAAAARACAQCQAA7w0AIAsAAPANACAPAADxDQAgGAAA8g0AIKUFAQC2CgAhqgUBALcKACGuBUAAuQoAIc8FQAC5CgAh2gUBALcKACHtBQEAtwoAIbsGAQC2CgAhvAYBALcKACG9BgEAtwoAIb4GAgC8CwAhvwYgAO8KACHABgEAtwoAIQIAAAAdACA_AADbAwAgDKUFAQC2CgAhqgUBALcKACGuBUAAuQoAIc8FQAC5CgAh2gUBALcKACHtBQEAtwoAIbsGAQC2CgAhvAYBALcKACG9BgEAtwoAIb4GAgC8CwAhvwYgAO8KACHABgEAtwoAIQIAAAAbACA_AADdAwAgAgAAABsAID8AAN0DACABAAAAFwAgAQAAACAAIAEAAAAjACABAAAAEQAgAwAAAB0AIEYAANIDACBHAADbAwAgAQAAAB0AIAEAAAAbACALDQAA6g0AIEwAAO0NACBNAADsDQAgngEAAOsNACCfAQAA7g0AIKoFAACwCgAg2gUAALAKACDtBQAAsAoAILwGAACwCgAgvQYAALAKACDABgAAsAoAIA-iBQAAwAkAMKMFAADoAwAQpAUAAMAJADClBQEAywgAIaoFAQDMCAAhrgVAAM8IACHPBUAAzwgAIdoFAQDMCAAh7QUBAMwIACG7BgEAywgAIbwGAQDMCAAhvQYBAMwIACG-BgIA-wgAIb8GIADrCAAhwAYBAMwIACEDAAAAGwAgAQAA5wMAMEsAAOgDACADAAAAGwAgAQAAHAAwAgAAHQAgAQAAAFMAIAEAAABTACADAAAAUQAgAQAAUgAwAgAAUwAgAwAAAFEAIAEAAFIAMAIAAFMAIAMAAABRACABAABSADACAABTACASAwAA5w0AIAkAAOgNACAbAADpDQAgpQUBAAAAAacFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAG6BgEAAAABAT8AAPADACAPpQUBAAAAAacFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAG6BgEAAAABAT8AAPIDADABPwAA8gMAMAEAAABVACASAwAA5A0AIAkAAOUNACAbAADmDQAgpQUBALYKACGnBQEAtgoAIaoFAQC2CgAhrgVAALkKACHPBUAAuQoAIdcFIADvCgAh4QUBALcKACGzBgIAvAsAIbQGAQC3CgAhtQYgAO8KACG2BgIAvAsAIbcGAgC8CwAhuAYBALcKACG5BkAAuwsAIboGAQC3CgAhAgAAAFMAID8AAPYDACAPpQUBALYKACGnBQEAtgoAIaoFAQC2CgAhrgVAALkKACHPBUAAuQoAIdcFIADvCgAh4QUBALcKACGzBgIAvAsAIbQGAQC3CgAhtQYgAO8KACG2BgIAvAsAIbcGAgC8CwAhuAYBALcKACG5BkAAuwsAIboGAQC3CgAhAgAAAFEAID8AAPgDACACAAAAUQAgPwAA-AMAIAEAAABVACADAAAAUwAgRgAA8AMAIEcAAPYDACABAAAAUwAgAQAAAFEAIAoNAADfDQAgTAAA4g0AIE0AAOENACCeAQAA4A0AIJ8BAADjDQAg4QUAALAKACC0BgAAsAoAILgGAACwCgAguQYAALAKACC6BgAAsAoAIBKiBQAAvwkAMKMFAACABAAQpAUAAL8JADClBQEAywgAIacFAQDLCAAhqgUBAMsIACGuBUAAzwgAIc8FQADPCAAh1wUgAOsIACHhBQEAzAgAIbMGAgD7CAAhtAYBAMwIACG1BiAA6wgAIbYGAgD7CAAhtwYCAPsIACG4BgEAzAgAIbkGQAD6CAAhugYBAMwIACEDAAAAUQAgAQAA_wMAMEsAAIAEACADAAAAUQAgAQAAUgAwAgAAUwAgCQMAAIkJACAMAAC-CQAgogUAAL0JADCjBQAAmAEAEKQFAAC9CQAwpQUBAAAAAacFAQAAAAGuBUAA8wgAIc8FQADzCAAhAQAAAIMEACABAAAAgwQAIAIDAAD5CwAgDAAA3g0AIAMAAACYAQAgAQAAhgQAMAIAAIMEACADAAAAmAEAIAEAAIYEADACAACDBAAgAwAAAJgBACABAACGBAAwAgAAgwQAIAYDAADcDQAgDAAA3Q0AIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAEBPwAAigQAIASlBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAABAT8AAIwEADABPwAAjAQAMAYDAADODQAgDAAAzw0AIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAhAgAAAIMEACA_AACPBAAgBKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAhAgAAAJgBACA_AACRBAAgAgAAAJgBACA_AACRBAAgAwAAAIMEACBGAACKBAAgRwAAjwQAIAEAAACDBAAgAQAAAJgBACADDQAAyw0AIEwAAM0NACBNAADMDQAgB6IFAAC8CQAwowUAAJgEABCkBQAAvAkAMKUFAQDLCAAhpwUBAMsIACGuBUAAzwgAIc8FQADPCAAhAwAAAJgBACABAACXBAAwSwAAmAQAIAMAAACYAQAgAQAAhgQAMAIAAIMEACABAAAAKQAgAQAAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAgOAADJDQAgDwAAyg0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAHyBQIAAAABsgYBAAAAAQE_AACgBAAgBqUFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAHyBQIAAAABsgYBAAAAAQE_AACiBAAwAT8AAKIEADAIDgAAxw0AIA8AAMgNACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHtBQEAtgoAIfIFAgC8CwAhsgYBALYKACECAAAAKQAgPwAApQQAIAalBQEAtgoAIa4FQAC5CgAhzwVAALkKACHtBQEAtgoAIfIFAgC8CwAhsgYBALYKACECAAAAJwAgPwAApwQAIAIAAAAnACA_AACnBAAgAwAAACkAIEYAAKAEACBHAAClBAAgAQAAACkAIAEAAAAnACAFDQAAwg0AIEwAAMUNACBNAADEDQAgngEAAMMNACCfAQAAxg0AIAmiBQAAuwkAMKMFAACuBAAQpAUAALsJADClBQEAywgAIa4FQADPCAAhzwVAAM8IACHtBQEAywgAIfIFAgD7CAAhsgYBAMsIACEDAAAAJwAgAQAArQQAMEsAAK4EACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAfAwAA-AwAIAQAAPkMACAFAADBDQAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAEBPwAAtgQAIBelBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAEBPwAAuAQAMAE_AAC4BAAwAQAAAAsAIB8DAACoDAAgBAAAqQwAIAUAAMANACAMAACqDAAgIAAArgwAICQAAKsMACAlAACsDAAgKAAArQwAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhowYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACECAAAACQAgPwAAvAQAIBelBQEAtgoAIacFAQC2CgAhrgVAALkKACHOBQAApgyaBiLPBUAAuQoAIfkFAQC3CgAhoQYQAJcMACGiBgEAtgoAIaMGAQC2CgAhpAaAAAAAAaUGAQC3CgAhpgYBALcKACGnBhAAlwwAIagGEACXDAAhqQYQAJcMACGqBhAAlwwAIasGAQC3CgAhrAZAALkKACGtBkAAuwsAIa4GQAC7CwAhrwZAALsLACGwBkAAuwsAIbEGQAC7CwAhAgAAAAcAID8AAL4EACACAAAABwAgPwAAvgQAIAEAAAALACADAAAACQAgRgAAtgQAIEcAALwEACABAAAACQAgAQAAAAcAIA8NAAC7DQAgTAAAvg0AIE0AAL0NACCeAQAAvA0AIJ8BAAC_DQAg-QUAALAKACCkBgAAsAoAIKUGAACwCgAgpgYAALAKACCrBgAAsAoAIK0GAACwCgAgrgYAALAKACCvBgAAsAoAILAGAACwCgAgsQYAALAKACAaogUAALoJADCjBQAAxgQAEKQFAAC6CQAwpQUBAMsIACGnBQEAywgAIa4FQADPCAAhzgUAALQJmgYizwVAAM8IACH5BQEAzAgAIaEGEACTCQAhogYBAMsIACGjBgEAywgAIaQGAADOCAAgpQYBAMwIACGmBgEAzAgAIacGEACTCQAhqAYQAJMJACGpBhAAkwkAIaoGEACTCQAhqwYBAMwIACGsBkAAzwgAIa0GQAD6CAAhrgZAAPoIACGvBkAA-ggAIbAGQAD6CAAhsQZAAPoIACEDAAAABwAgAQAAxQQAMEsAAMYEACADAAAABwAgAQAACAAwAgAACQAgAQAAAC8AIAEAAAAvACADAAAALQAgAQAALgAwAgAALwAgAwAAAC0AIAEAAC4AMAIAAC8AIAMAAAAtACABAAAuADACAAAvACAPDwAA9gwAIBEAALoNACClBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB7QUBAAAAAfIFAgAAAAGbBgEAAAABnAYBAAAAAZ0GAQAAAAGeBoAAAAABnwYQAAAAAaAGEAAAAAGhBhAAAAABAT8AAM4EACANpQUBAAAAAakFAQAAAAGqBQEAAAABrgVAAAAAAe0FAQAAAAHyBQIAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABngaAAAAAAZ8GEAAAAAGgBhAAAAABoQYQAAAAAQE_AADQBAAwAT8AANAEADAPDwAA9AwAIBEAALkNACClBQEAtgoAIakFAQC2CgAhqgUBALYKACGuBUAAuQoAIe0FAQC2CgAh8gUCALwLACGbBgEAtgoAIZwGAQC2CgAhnQYBALcKACGeBoAAAAABnwYQAJcMACGgBhAAlwwAIaEGEACXDAAhAgAAAC8AID8AANMEACANpQUBALYKACGpBQEAtgoAIaoFAQC2CgAhrgVAALkKACHtBQEAtgoAIfIFAgC8CwAhmwYBALYKACGcBgEAtgoAIZ0GAQC3CgAhngaAAAAAAZ8GEACXDAAhoAYQAJcMACGhBhAAlwwAIQIAAAAtACA_AADVBAAgAgAAAC0AID8AANUEACADAAAALwAgRgAAzgQAIEcAANMEACABAAAALwAgAQAAAC0AIAYNAAC0DQAgTAAAtw0AIE0AALYNACCeAQAAtQ0AIJ8BAAC4DQAgnQYAALAKACAQogUAALcJADCjBQAA3AQAEKQFAAC3CQAwpQUBAMsIACGpBQEAywgAIaoFAQDLCAAhrgVAAM8IACHtBQEAywgAIfIFAgD7CAAhmwYBAMsIACGcBgEAywgAIZ0GAQDMCAAhngYAALgJACCfBhAAkwkAIaAGEACTCQAhoQYQAJMJACEDAAAALQAgAQAA2wQAMEsAANwEACADAAAALQAgAQAALgAwAgAALwAgAQAAAHsAIAEAAAB7ACADAAAAeQAgAQAAegAwAgAAewAgAwAAAHkAIAEAAHoAMAIAAHsAIAMAAAB5ACABAAB6ADACAAB7ACAHEQAAsw0AIKUFAQAAAAGpBQEAAAABrgVAAAAAAc4FAAAAmgYC9wUBAAAAAZoGAQAAAAEBPwAA5AQAIAalBQEAAAABqQUBAAAAAa4FQAAAAAHOBQAAAJoGAvcFAQAAAAGaBgEAAAABAT8AAOYEADABPwAA5gQAMAcRAACyDQAgpQUBALYKACGpBQEAtgoAIa4FQAC5CgAhzgUAAKYMmgYi9wUBALcKACGaBgEAtwoAIQIAAAB7ACA_AADpBAAgBqUFAQC2CgAhqQUBALYKACGuBUAAuQoAIc4FAACmDJoGIvcFAQC3CgAhmgYBALcKACECAAAAeQAgPwAA6wQAIAIAAAB5ACA_AADrBAAgAwAAAHsAIEYAAOQEACBHAADpBAAgAQAAAHsAIAEAAAB5ACAFDQAArw0AIEwAALENACBNAACwDQAg9wUAALAKACCaBgAAsAoAIAmiBQAAswkAMKMFAADyBAAQpAUAALMJADClBQEAywgAIakFAQDLCAAhrgVAAM8IACHOBQAAtAmaBiL3BQEAzAgAIZoGAQDMCAAhAwAAAHkAIAEAAPEEADBLAADyBAAgAwAAAHkAIAEAAHoAMAIAAHsAIAEAAAB_ACABAAAAfwAgAwAAAH0AIAEAAH4AMAIAAH8AIAMAAAB9ACABAAB-ADACAAB_ACADAAAAfQAgAQAAfgAwAgAAfwAgDhEAAK4NACAnAADVDAAgpQUBAAAAAakFAQAAAAGtBYAAAAABrgVAAAAAAc4FAAAAmQYCzwVAAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAQE_AAD6BAAgDKUFAQAAAAGpBQEAAAABrQWAAAAAAa4FQAAAAAHOBQAAAJkGAs8FQAAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAEBPwAA_AQAMAE_AAD8BAAwDhEAAK0NACAnAADHDAAgpQUBALYKACGpBQEAtgoAIa0FgAAAAAGuBUAAuQoAIc4FAADFDJkGIs8FQAC5CgAhkgYBALYKACGTBgEAtgoAIZQGAQC3CgAhlQYBALcKACGWBkAAuwsAIZcGQAC7CwAhAgAAAH8AID8AAP8EACAMpQUBALYKACGpBQEAtgoAIa0FgAAAAAGuBUAAuQoAIc4FAADFDJkGIs8FQAC5CgAhkgYBALYKACGTBgEAtgoAIZQGAQC3CgAhlQYBALcKACGWBkAAuwsAIZcGQAC7CwAhAgAAAH0AID8AAIEFACACAAAAfQAgPwAAgQUAIAMAAAB_ACBGAAD6BAAgRwAA_wQAIAEAAAB_ACABAAAAfQAgCA0AAKoNACBMAACsDQAgTQAAqw0AIK0FAACwCgAglAYAALAKACCVBgAAsAoAIJYGAACwCgAglwYAALAKACAPogUAAK8JADCjBQAAiAUAEKQFAACvCQAwpQUBAMsIACGpBQEAywgAIa0FAADOCAAgrgVAAM8IACHOBQAAsAmZBiLPBUAAzwgAIZIGAQDLCAAhkwYBAMsIACGUBgEAzAgAIZUGAQDMCAAhlgZAAPoIACGXBkAA-ggAIQMAAAB9ACABAACHBQAwSwAAiAUAIAMAAAB9ACABAAB-ADACAAB_ACABAAAAgwEAIAEAAACDAQAgAwAAAIEBACABAACCAQAwAgAAgwEAIAMAAACBAQAgAQAAggEAMAIAAIMBACADAAAAgQEAIAEAAIIBADACAACDAQAgCCYAAKkNACClBQEAAAABrgVAAAAAAc4FAQAAAAHgBQEAAAABjwYBAAAAAZAGAQAAAAGRBkAAAAABAT8AAJAFACAHpQUBAAAAAa4FQAAAAAHOBQEAAAAB4AUBAAAAAY8GAQAAAAGQBgEAAAABkQZAAAAAAQE_AACSBQAwAT8AAJIFADAIJgAAqA0AIKUFAQC2CgAhrgVAALkKACHOBQEAtgoAIeAFAQC3CgAhjwYBALYKACGQBgEAtwoAIZEGQAC5CgAhAgAAAIMBACA_AACVBQAgB6UFAQC2CgAhrgVAALkKACHOBQEAtgoAIeAFAQC3CgAhjwYBALYKACGQBgEAtwoAIZEGQAC5CgAhAgAAAIEBACA_AACXBQAgAgAAAIEBACA_AACXBQAgAwAAAIMBACBGAACQBQAgRwAAlQUAIAEAAACDAQAgAQAAAIEBACAFDQAApQ0AIEwAAKcNACBNAACmDQAg4AUAALAKACCQBgAAsAoAIAqiBQAArgkAMKMFAACeBQAQpAUAAK4JADClBQEAywgAIa4FQADPCAAhzgUBAMsIACHgBQEAzAgAIY8GAQDLCAAhkAYBAMwIACGRBkAAzwgAIQMAAACBAQAgAQAAnQUAMEsAAJ4FACADAAAAgQEAIAEAAIIBADACAACDAQAgDxEAAK0JACCiBQAAqgkAMKMFAAB3ABCkBQAAqgkAMKUFAQAAAAGpBQEAAAABrgVAAPMIACHOBQAArAmKBiLPBUAA8wgAIYgGAACrCYgGIooGEACdCQAhiwYBAPcIACGMBgAAhAkAII0GQACBCQAhjgYBAPcIACEBAAAAoQUAIAEAAAChBQAgBREAAKQNACCLBgAAsAoAIIwGAACwCgAgjQYAALAKACCOBgAAsAoAIAMAAAB3ACABAACkBQAwAgAAoQUAIAMAAAB3ACABAACkBQAwAgAAoQUAIAMAAAB3ACABAACkBQAwAgAAoQUAIAwRAACjDQAgpQUBAAAAAakFAQAAAAGuBUAAAAABzgUAAACKBgLPBUAAAAABiAYAAACIBgKKBhAAAAABiwYBAAAAAYwGgAAAAAGNBkAAAAABjgYBAAAAAQE_AACoBQAgC6UFAQAAAAGpBQEAAAABrgVAAAAAAc4FAAAAigYCzwVAAAAAAYgGAAAAiAYCigYQAAAAAYsGAQAAAAGMBoAAAAABjQZAAAAAAY4GAQAAAAEBPwAAqgUAMAE_AACqBQAwDBEAAKINACClBQEAtgoAIakFAQC2CgAhrgVAALkKACHOBQAA6AyKBiLPBUAAuQoAIYgGAADnDIgGIooGEACXDAAhiwYBALcKACGMBoAAAAABjQZAALsLACGOBgEAtwoAIQIAAAChBQAgPwAArQUAIAulBQEAtgoAIakFAQC2CgAhrgVAALkKACHOBQAA6AyKBiLPBUAAuQoAIYgGAADnDIgGIooGEACXDAAhiwYBALcKACGMBoAAAAABjQZAALsLACGOBgEAtwoAIQIAAAB3ACA_AACvBQAgAgAAAHcAID8AAK8FACADAAAAoQUAIEYAAKgFACBHAACtBQAgAQAAAKEFACABAAAAdwAgCQ0AAJ0NACBMAACgDQAgTQAAnw0AIJ4BAACeDQAgnwEAAKENACCLBgAAsAoAIIwGAACwCgAgjQYAALAKACCOBgAAsAoAIA6iBQAAowkAMKMFAAC2BQAQpAUAAKMJADClBQEAywgAIakFAQDLCAAhrgVAAM8IACHOBQAApQmKBiLPBUAAzwgAIYgGAACkCYgGIooGEACTCQAhiwYBAMwIACGMBgAAzggAII0GQAD6CAAhjgYBAMwIACEDAAAAdwAgAQAAtQUAMEsAALYFACADAAAAdwAgAQAApAUAMAIAAKEFACAWCAAAoAkAICIAAKEJACAjAACiCQAgogUAAJsJADCjBQAACwAQpAUAAJsJADClBQEAAAABrgVAAPMIACHPBUAA8wgAIeAFAQD3CAAh-gUBAAAAAfwFAACcCfwFIv0FEACdCQAh_gUQAJ4JACH_BRAAngkAIYAGAgCfCQAhgQYCAIMJACGCBgIAnwkAIYMGQADzCAAhhAZAAPMIACGFBiAAggkAIYYGIACCCQAhAQAAALkFACABAAAAuQUAIAgIAACaDQAgIgAAmw0AICMAAJwNACDgBQAAsAoAIP4FAACwCgAg_wUAALAKACCABgAAsAoAIIIGAACwCgAgAwAAAAsAIAEAALwFADACAAC5BQAgAwAAAAsAIAEAALwFADACAAC5BQAgAwAAAAsAIAEAALwFADACAAC5BQAgEwgAAJcNACAiAACYDQAgIwAAmQ0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAeAFAQAAAAH6BQEAAAAB_AUAAAD8BQL9BRAAAAAB_gUQAAAAAf8FEAAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBkAAAAABhAZAAAAAAYUGIAAAAAGGBiAAAAABAT8AAMAFACAQpQUBAAAAAa4FQAAAAAHPBUAAAAAB4AUBAAAAAfoFAQAAAAH8BQAAAPwFAv0FEAAAAAH-BRAAAAAB_wUQAAAAAYAGAgAAAAGBBgIAAAABggYCAAAAAYMGQAAAAAGEBkAAAAABhQYgAAAAAYYGIAAAAAEBPwAAwgUAMAE_AADCBQAwEwgAAJkMACAiAACaDAAgIwAAmwwAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIeAFAQC3CgAh-gUBALYKACH8BQAAlgz8BSL9BRAAlwwAIf4FEACYDAAh_wUQAJgMACGABgIAxQoAIYEGAgC8CwAhggYCAMUKACGDBkAAuQoAIYQGQAC5CgAhhQYgAO8KACGGBiAA7woAIQIAAAC5BQAgPwAAxQUAIBClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHgBQEAtwoAIfoFAQC2CgAh_AUAAJYM_AUi_QUQAJcMACH-BRAAmAwAIf8FEACYDAAhgAYCAMUKACGBBgIAvAsAIYIGAgDFCgAhgwZAALkKACGEBkAAuQoAIYUGIADvCgAhhgYgAO8KACECAAAACwAgPwAAxwUAIAIAAAALACA_AADHBQAgAwAAALkFACBGAADABQAgRwAAxQUAIAEAAAC5BQAgAQAAAAsAIAoNAACRDAAgTAAAlAwAIE0AAJMMACCeAQAAkgwAIJ8BAACVDAAg4AUAALAKACD-BQAAsAoAIP8FAACwCgAggAYAALAKACCCBgAAsAoAIBOiBQAAkQkAMKMFAADOBQAQpAUAAJEJADClBQEAywgAIa4FQADPCAAhzwVAAM8IACHgBQEAzAgAIfoFAQDLCAAh_AUAAJIJ_AUi_QUQAJMJACH-BRAAlAkAIf8FEACUCQAhgAYCANwIACGBBgIA-wgAIYIGAgDcCAAhgwZAAM8IACGEBkAAzwgAIYUGIADrCAAhhgYgAOsIACEDAAAACwAgAQAAzQUAMEsAAM4FACADAAAACwAgAQAAvAUAMAIAALkFACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAQFAACPDAAgCQAAkAwAIKoFAQAAAAH5BQEAAAABAT8AANYFACACqgUBAAAAAfkFAQAAAAEBPwAA2AUAMAE_AADYBQAwBAUAAI0MACAJAACODAAgqgUBALYKACH5BQEAtgoAIQIAAAAPACA_AADbBQAgAqoFAQC2CgAh-QUBALYKACECAAAADQAgPwAA3QUAIAIAAAANACA_AADdBQAgAwAAAA8AIEYAANYFACBHAADbBQAgAQAAAA8AIAEAAAANACADDQAAigwAIEwAAIwMACBNAACLDAAgBaIFAACQCQAwowUAAOQFABCkBQAAkAkAMKoFAQDLCAAh-QUBAMsIACEDAAAADQAgAQAA4wUAMEsAAOQFACADAAAADQAgAQAADgAwAgAADwAgAQAAAEcAIAEAAABHACADAAAARQAgAQAARgAwAgAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAABFACABAABGADACAABHACAEBQAAiAwAIBgAAIkMACDaBQEAAAAB-QUBAAAAAQE_AADsBQAgAtoFAQAAAAH5BQEAAAABAT8AAO4FADABPwAA7gUAMAQFAACGDAAgGAAAhwwAINoFAQC2CgAh-QUBALYKACECAAAARwAgPwAA8QUAIALaBQEAtgoAIfkFAQC2CgAhAgAAAEUAID8AAPMFACACAAAARQAgPwAA8wUAIAMAAABHACBGAADsBQAgRwAA8QUAIAEAAABHACABAAAARQAgAw0AAIMMACBMAACFDAAgTQAAhAwAIAWiBQAAjwkAMKMFAAD6BQAQpAUAAI8JADDaBQEAywgAIfkFAQDLCAAhAwAAAEUAIAEAAPkFADBLAAD6BQAgAwAAAEUAIAEAAEYAMAIAAEcAIAEAAAA0ACABAAAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgDBMAAIIMACClBQEAAAABrgVAAAAAAe0FAQAAAAHxBQAAAPEFAvIFAgAAAAHzBQIAAAAB9AUCAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAEBPwAAggYAIAulBQEAAAABrgVAAAAAAe0FAQAAAAHxBQAAAPEFAvIFAgAAAAHzBQIAAAAB9AUCAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAEBPwAAhAYAMAE_AACEBgAwDBMAAIEMACClBQEAtgoAIa4FQAC5CgAh7QUBALYKACHxBQAAgAzxBSLyBQIAvAsAIfMFAgC8CwAh9AUCALwLACH1BQEAtwoAIfYFAQC3CgAh9wUBALcKACH4BQEAtwoAIQIAAAA0ACA_AACHBgAgC6UFAQC2CgAhrgVAALkKACHtBQEAtgoAIfEFAACADPEFIvIFAgC8CwAh8wUCALwLACH0BQIAvAsAIfUFAQC3CgAh9gUBALcKACH3BQEAtwoAIfgFAQC3CgAhAgAAADIAID8AAIkGACACAAAAMgAgPwAAiQYAIAMAAAA0ACBGAACCBgAgRwAAhwYAIAEAAAA0ACABAAAAMgAgCQ0AAPsLACBMAAD-CwAgTQAA_QsAIJ4BAAD8CwAgnwEAAP8LACD1BQAAsAoAIPYFAACwCgAg9wUAALAKACD4BQAAsAoAIA6iBQAAiwkAMKMFAACQBgAQpAUAAIsJADClBQEAywgAIa4FQADPCAAh7QUBAMsIACHxBQAAjAnxBSLyBQIA-wgAIfMFAgD7CAAh9AUCAPsIACH1BQEAzAgAIfYFAQDMCAAh9wUBAMwIACH4BQEAzAgAIQMAAAAyACABAACPBgAwSwAAkAYAIAMAAAAyACABAAAzADACAAA0ACAMAwAAiQkAIAwAAIoJACCiBQAAiAkAMKMFAADEAQAQpAUAAIgJADClBQEAAAABpwUBAAAAAa4FQADzCAAhzwVAAPMIACHbBQEA8ggAIe4FIACCCQAh7wUBAAAAAQEAAACTBgAgAQAAAJMGACADAwAA-QsAIAwAAPoLACDvBQAAsAoAIAMAAADEAQAgAQAAlgYAMAIAAJMGACADAAAAxAEAIAEAAJYGADACAACTBgAgAwAAAMQBACABAACWBgAwAgAAkwYAIAkDAAD3CwAgDAAA-AsAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB7gUgAAAAAe8FAQAAAAEBPwAAmgYAIAelBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAe4FIAAAAAHvBQEAAAABAT8AAJwGADABPwAAnAYAMAkDAADpCwAgDAAA6gsAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAh2wUBALYKACHuBSAA7woAIe8FAQC3CgAhAgAAAJMGACA_AACfBgAgB6UFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAh2wUBALYKACHuBSAA7woAIe8FAQC3CgAhAgAAAMQBACA_AAChBgAgAgAAAMQBACA_AAChBgAgAwAAAJMGACBGAACaBgAgRwAAnwYAIAEAAACTBgAgAQAAAMQBACAEDQAA5gsAIEwAAOgLACBNAADnCwAg7wUAALAKACAKogUAAIcJADCjBQAAqAYAEKQFAACHCQAwpQUBAMsIACGnBQEAywgAIa4FQADPCAAhzwVAAM8IACHbBQEAywgAIe4FIADrCAAh7wUBAMwIACEDAAAAxAEAIAEAAKcGADBLAACoBgAgAwAAAMQBACABAACWBgAwAgAAkwYAIAEAAAA4ACABAAAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgBg8AAOULACAVAADkCwAgpQUBAAAAAa4FQAAAAAHsBQEAAAAB7QUBAAAAAQE_AACwBgAgBKUFAQAAAAGuBUAAAAAB7AUBAAAAAe0FAQAAAAEBPwAAsgYAMAE_AACyBgAwBg8AAOMLACAVAADiCwAgpQUBALYKACGuBUAAuQoAIewFAQC2CgAh7QUBALYKACECAAAAOAAgPwAAtQYAIASlBQEAtgoAIa4FQAC5CgAh7AUBALYKACHtBQEAtgoAIQIAAAA2ACA_AAC3BgAgAgAAADYAID8AALcGACADAAAAOAAgRgAAsAYAIEcAALUGACABAAAAOAAgAQAAADYAIAMNAADfCwAgTAAA4QsAIE0AAOALACAHogUAAIYJADCjBQAAvgYAEKQFAACGCQAwpQUBAMsIACGuBUAAzwgAIewFAQDLCAAh7QUBAMsIACEDAAAANgAgAQAAvQYAMEsAAL4GACADAAAANgAgAQAANwAwAgAAOAAgFx4AAPQIACAiAAD4CAAgNwAAhQkAIKIFAACACQAwowUAAMQGABCkBQAAgAkAMKUFAQAAAAGtBQAAhAkAIK4FQADzCAAhywUBAPIIACHPBUAA8wgAIdwFAQAAAAHhBQEA8ggAIeIFAQD3CAAh4wUBAPcIACHkBQEA9wgAIeUFQACBCQAh5gUgAIIJACHnBQIAgwkAIegFAQD3CAAh6QUBAPcIACHqBQEA9wgAIesFIACCCQAhAQAAAMEGACABAAAAwQYAIBceAAD0CAAgIgAA-AgAIDcAAIUJACCiBQAAgAkAMKMFAADEBgAQpAUAAIAJADClBQEA8ggAIa0FAACECQAgrgVAAPMIACHLBQEA8ggAIc8FQADzCAAh3AUBAPIIACHhBQEA8ggAIeIFAQD3CAAh4wUBAPcIACHkBQEA9wgAIeUFQACBCQAh5gUgAIIJACHnBQIAgwkAIegFAQD3CAAh6QUBAPcIACHqBQEA9wgAIesFIACCCQAhCx4AAKMLACAiAAC1CwAgNwAA3gsAIK0FAACwCgAg4gUAALAKACDjBQAAsAoAIOQFAACwCgAg5QUAALAKACDoBQAAsAoAIOkFAACwCgAg6gUAALAKACADAAAAxAYAIAEAAMUGADACAADBBgAgAwAAAMQGACABAADFBgAwAgAAwQYAIAMAAADEBgAgAQAAxQYAMAIAAMEGACAUHgAA3AsAICIAANsLACA3AADdCwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHcBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFQAAAAAHmBSAAAAAB5wUCAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAesFIAAAAAEBPwAAyQYAIBGlBQEAAAABrQWAAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdwFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBQEAAAAB5QVAAAAAAeYFIAAAAAHnBQIAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAAB6wUgAAAAAQE_AADLBgAwAT8AAMsGADAUHgAAvgsAICIAAL0LACA3AAC_CwAgpQUBALYKACGtBYAAAAABrgVAALkKACHLBQEAtgoAIc8FQAC5CgAh3AUBALYKACHhBQEAtgoAIeIFAQC3CgAh4wUBALcKACHkBQEAtwoAIeUFQAC7CwAh5gUgAO8KACHnBQIAvAsAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIesFIADvCgAhAgAAAMEGACA_AADOBgAgEaUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhywUBALYKACHPBUAAuQoAIdwFAQC2CgAh4QUBALYKACHiBQEAtwoAIeMFAQC3CgAh5AUBALcKACHlBUAAuwsAIeYFIADvCgAh5wUCALwLACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACHrBSAA7woAIQIAAADEBgAgPwAA0AYAIAIAAADEBgAgPwAA0AYAIAMAAADBBgAgRgAAyQYAIEcAAM4GACABAAAAwQYAIAEAAADEBgAgDQ0AALYLACBMAAC5CwAgTQAAuAsAIJ4BAAC3CwAgnwEAALoLACCtBQAAsAoAIOIFAACwCgAg4wUAALAKACDkBQAAsAoAIOUFAACwCgAg6AUAALAKACDpBQAAsAoAIOoFAACwCgAgFKIFAAD5CAAwowUAANcGABCkBQAA-QgAMKUFAQDLCAAhrQUAAM4IACCuBUAAzwgAIcsFAQDLCAAhzwVAAM8IACHcBQEAywgAIeEFAQDLCAAh4gUBAMwIACHjBQEAzAgAIeQFAQDMCAAh5QVAAPoIACHmBSAA6wgAIecFAgD7CAAh6AUBAMwIACHpBQEAzAgAIeoFAQDMCAAh6wUgAOsIACEDAAAAxAYAIAEAANYGADBLAADXBgAgAwAAAMQGACABAADFBgAwAgAAwQYAIAo2AAD4CAAgogUAAPYIADCjBQAA3QYAEKQFAAD2CAAwpQUBAAAAAa4FQADzCAAhzwVAAPMIACHbBQEA8ggAIdwFAQAAAAHgBQEA9wgAIQEAAADaBgAgAQAAANoGACAKNgAA-AgAIKIFAAD2CAAwowUAAN0GABCkBQAA9ggAMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdsFAQDyCAAh3AUBAPIIACHgBQEA9wgAIQI2AAC1CwAg4AUAALAKACADAAAA3QYAIAEAAN4GADACAADaBgAgAwAAAN0GACABAADeBgAwAgAA2gYAIAMAAADdBgAgAQAA3gYAMAIAANoGACAHNgAAtAsAIKUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAQE_AADiBgAgBqUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAQE_AADkBgAwAT8AAOQGADAHNgAApwsAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdsFAQC2CgAh3AUBALYKACHgBQEAtwoAIQIAAADaBgAgPwAA5wYAIAalBQEAtgoAIa4FQAC5CgAhzwVAALkKACHbBQEAtgoAIdwFAQC2CgAh4AUBALcKACECAAAA3QYAID8AAOkGACACAAAA3QYAID8AAOkGACADAAAA2gYAIEYAAOIGACBHAADnBgAgAQAAANoGACABAAAA3QYAIAQNAACkCwAgTAAApgsAIE0AAKULACDgBQAAsAoAIAmiBQAA9QgAMKMFAADwBgAQpAUAAPUIADClBQEAywgAIa4FQADPCAAhzwVAAM8IACHbBQEAywgAIdwFAQDLCAAh4AUBAMwIACEDAAAA3QYAIAEAAO8GADBLAADwBgAgAwAAAN0GACABAADeBgAwAgAA2gYAIAk2AAD0CAAgogUAAPEIADCjBQAA9gYAEKQFAADxCAAwpQUBAAAAAa4FQADzCAAhzwVAAPMIACHbBQEAAAAB3AUBAAAAAQEAAADzBgAgAQAAAPMGACAJNgAA9AgAIKIFAADxCAAwowUAAPYGABCkBQAA8QgAMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdsFAQDyCAAh3AUBAPIIACEBNgAAowsAIAMAAAD2BgAgAQAA9wYAMAIAAPMGACADAAAA9gYAIAEAAPcGADACAADzBgAgAwAAAPYGACABAAD3BgAwAgAA8wYAIAY2AACiCwAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2wUBAAAAAdwFAQAAAAEBPwAA-wYAIAWlBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB3AUBAAAAAQE_AAD9BgAwAT8AAP0GADAGNgAAlQsAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdsFAQC2CgAh3AUBALYKACECAAAA8wYAID8AAIAHACAFpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2wUBALYKACHcBQEAtgoAIQIAAAD2BgAgPwAAggcAIAIAAAD2BgAgPwAAggcAIAMAAADzBgAgRgAA-wYAIEcAAIAHACABAAAA8wYAIAEAAAD2BgAgAw0AAJILACBMAACUCwAgTQAAkwsAIAiiBQAA8AgAMKMFAACJBwAQpAUAAPAIADClBQEAywgAIa4FQADPCAAhzwVAAM8IACHbBQEAywgAIdwFAQDLCAAhAwAAAPYGACABAACIBwAwSwAAiQcAIAMAAAD2BgAgAQAA9wYAMAIAAPMGACABAAAAsQEAIAEAAACxAQAgAwAAAK8BACABAACwAQAwAgAAsQEAIAMAAACvAQAgAQAAsAEAMAIAALEBACADAAAArwEAIAEAALABADACAACxAQAgBBgAAJELACA1AACQCwAg1AUBAAAAAdoFAQAAAAEBPwAAkQcAIALUBQEAAAAB2gUBAAAAAQE_AACTBwAwAT8AAJMHADAEGAAAjwsAIDUAAI4LACDUBQEAtgoAIdoFAQC2CgAhAgAAALEBACA_AACWBwAgAtQFAQC2CgAh2gUBALYKACECAAAArwEAID8AAJgHACACAAAArwEAID8AAJgHACADAAAAsQEAIEYAAJEHACBHAACWBwAgAQAAALEBACABAAAArwEAIAMNAACLCwAgTAAAjQsAIE0AAIwLACAFogUAAO8IADCjBQAAnwcAEKQFAADvCAAw1AUBAMsIACHaBQEAywgAIQMAAACvAQAgAQAAngcAMEsAAJ8HACADAAAArwEAIAEAALABADACAACxAQAgAQAAALcBACABAAAAtwEAIAMAAAC1AQAgAQAAtgEAMAIAALcBACADAAAAtQEAIAEAALYBADACAAC3AQAgAwAAALUBACABAAC2AQAwAgAAtwEAIAQdAACKCwAgNQAAiQsAINQFAQAAAAHZBQEAAAABAT8AAKcHACAC1AUBAAAAAdkFAQAAAAEBPwAAqQcAMAE_AACpBwAwBB0AAIgLACA1AACHCwAg1AUBALYKACHZBQEAtgoAIQIAAAC3AQAgPwAArAcAIALUBQEAtgoAIdkFAQC2CgAhAgAAALUBACA_AACuBwAgAgAAALUBACA_AACuBwAgAwAAALcBACBGAACnBwAgRwAArAcAIAEAAAC3AQAgAQAAALUBACADDQAAhAsAIEwAAIYLACBNAACFCwAgBaIFAADuCAAwowUAALUHABCkBQAA7ggAMNQFAQDLCAAh2QUBAMsIACEDAAAAtQEAIAEAALQHADBLAAC1BwAgAwAAALUBACABAAC2AQAwAgAAtwEAIAEAAACtAQAgAQAAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACAOAwAAgQsAIAYAAIMLACA1AACACwAgOAAAggsAIKUFAQAAAAGnBQEAAAABrgVAAAAAAcsFAQAAAAHPBUAAAAAB1AUBAAAAAdUFAQAAAAHWBQEAAAAB1wUgAAAAAdgFAQAAAAEBPwAAvQcAIAqlBQEAAAABpwUBAAAAAa4FQAAAAAHLBQEAAAABzwVAAAAAAdQFAQAAAAHVBQEAAAAB1gUBAAAAAdcFIAAAAAHYBQEAAAABAT8AAL8HADABPwAAvwcAMAEAAABVACABAAAAqwEAIA4DAADxCgAgBgAA8goAIDUAAPAKACA4AADzCgAgpQUBALYKACGnBQEAtwoAIa4FQAC5CgAhywUBALYKACHPBUAAuQoAIdQFAQC2CgAh1QUBALcKACHWBQEAtwoAIdcFIADvCgAh2AUBALcKACECAAAArQEAID8AAMQHACAKpQUBALYKACGnBQEAtwoAIa4FQAC5CgAhywUBALYKACHPBUAAuQoAIdQFAQC2CgAh1QUBALcKACHWBQEAtwoAIdcFIADvCgAh2AUBALcKACECAAAAqwEAID8AAMYHACACAAAAqwEAID8AAMYHACABAAAAVQAgAQAAAKsBACADAAAArQEAIEYAAL0HACBHAADEBwAgAQAAAK0BACABAAAAqwEAIAcNAADsCgAgTAAA7goAIE0AAO0KACCnBQAAsAoAINUFAACwCgAg1gUAALAKACDYBQAAsAoAIA2iBQAA6ggAMKMFAADPBwAQpAUAAOoIADClBQEAywgAIacFAQDMCAAhrgVAAM8IACHLBQEAywgAIc8FQADPCAAh1AUBAMsIACHVBQEAzAgAIdYFAQDMCAAh1wUgAOsIACHYBQEAzAgAIQMAAACrAQAgAQAAzgcAMEsAAM8HACADAAAAqwEAIAEAAKwBADACAACtAQAgAQAAAKIBACABAAAAogEAIAMAAACgAQAgAQAAoQEAMAIAAKIBACADAAAAoAEAIAEAAKEBADACAACiAQAgAwAAAKABACABAAChAQAwAgAAogEAIAktAADqCgAgLgAA6woAIKUFAQAAAAGuBUAAAAABzgUAAADTBQLPBUAAAAAB0AUBAAAAAdEFAQAAAAHTBQEAAAABAT8AANcHACAHpQUBAAAAAa4FQAAAAAHOBQAAANMFAs8FQAAAAAHQBQEAAAAB0QUBAAAAAdMFAQAAAAEBPwAA2QcAMAE_AADZBwAwCS0AANwKACAuAADdCgAgpQUBALYKACGuBUAAuQoAIc4FAADbCtMFIs8FQAC5CgAh0AUBALYKACHRBQEAtgoAIdMFAQC3CgAhAgAAAKIBACA_AADcBwAgB6UFAQC2CgAhrgVAALkKACHOBQAA2wrTBSLPBUAAuQoAIdAFAQC2CgAh0QUBALYKACHTBQEAtwoAIQIAAACgAQAgPwAA3gcAIAIAAACgAQAgPwAA3gcAIAMAAACiAQAgRgAA1wcAIEcAANwHACABAAAAogEAIAEAAACgAQAgBA0AANgKACBMAADaCgAgTQAA2QoAINMFAACwCgAgCqIFAADmCAAwowUAAOUHABCkBQAA5ggAMKUFAQDLCAAhrgVAAM8IACHOBQAA5wjTBSLPBUAAzwgAIdAFAQDLCAAh0QUBAMsIACHTBQEAzAgAIQMAAACgAQAgAQAA5AcAMEsAAOUHACADAAAAoAEAIAEAAKEBADACAACiAQAgAQAAAJwBACABAAAAnAEAIAMAAACaAQAgAQAAmwEAMAIAAJwBACADAAAAmgEAIAEAAJsBADACAACcAQAgAwAAAJoBACABAACbAQAwAgAAnAEAIAsvAADWCgAgMAAA1woAIKUFAQAAAAGuBUAAAAABxwUBAAAAAcgFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABAT8AAO0HACAJpQUBAAAAAa4FQAAAAAHHBQEAAAAByAUBAAAAAcoFAAAAygUCywUBAAAAAcwFgAAAAAHOBQAAAM4FAs8FQAAAAAEBPwAA7wcAMAE_AADvBwAwCy8AANQKACAwAADVCgAgpQUBALYKACGuBUAAuQoAIccFAQC2CgAhyAUBALYKACHKBQAA0grKBSLLBQEAtgoAIcwFgAAAAAHOBQAA0wrOBSLPBUAAuQoAIQIAAACcAQAgPwAA8gcAIAmlBQEAtgoAIa4FQAC5CgAhxwUBALYKACHIBQEAtgoAIcoFAADSCsoFIssFAQC2CgAhzAWAAAAAAc4FAADTCs4FIs8FQAC5CgAhAgAAAJoBACA_AAD0BwAgAgAAAJoBACA_AAD0BwAgAwAAAJwBACBGAADtBwAgRwAA8gcAIAEAAACcAQAgAQAAAJoBACAEDQAAzwoAIEwAANEKACBNAADQCgAgzAUAALAKACAMogUAAN8IADCjBQAA-wcAEKQFAADfCAAwpQUBAMsIACGuBUAAzwgAIccFAQDLCAAhyAUBAMsIACHKBQAA4AjKBSLLBQEAywgAIcwFAADOCAAgzgUAAOEIzgUizwVAAM8IACEDAAAAmgEAIAEAAPoHADBLAAD7BwAgAwAAAJoBACABAACbAQAwAgAAnAEAIAEAAABfACABAAAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgCgMAAM4KACAJAADNCgAgpQUBAAAAAacFAQAAAAGoBQEAAAABqgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAEBPwAAgwgAIAilBQEAAAABpwUBAAAAAagFAQAAAAGqBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAQE_AACFCAAwAT8AAIUIADABAAAAVQAgCgMAAMwKACAJAADLCgAgpQUBALYKACGnBQEAtwoAIagFAQC3CgAhqgUBALYKACHDBQEAtwoAIcQFAQC3CgAhxQUBALcKACHGBUAAuQoAIQIAAABfACA_AACJCAAgCKUFAQC2CgAhpwUBALcKACGoBQEAtwoAIaoFAQC2CgAhwwUBALcKACHEBQEAtwoAIcUFAQC3CgAhxgVAALkKACECAAAAXQAgPwAAiwgAIAIAAABdACA_AACLCAAgAQAAAFUAIAMAAABfACBGAACDCAAgRwAAiQgAIAEAAABfACABAAAAXQAgCA0AAMgKACBMAADKCgAgTQAAyQoAIKcFAACwCgAgqAUAALAKACDDBQAAsAoAIMQFAACwCgAgxQUAALAKACALogUAAN4IADCjBQAAkwgAEKQFAADeCAAwpQUBAMsIACGnBQEAzAgAIagFAQDMCAAhqgUBAMsIACHDBQEAzAgAIcQFAQDMCAAhxQUBAMwIACHGBUAAzwgAIQMAAABdACABAACSCAAwSwAAkwgAIAMAAABdACABAABeADACAABfACABAAAAqAEAIAEAAACoAQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgCAMAAMcKACClBQEAAAABpwUBAAAAAagFAQAAAAGuBUAAAAABwAUBAAAAAcEFAgAAAAHCBYAAAAABAT8AAJsIACAHpQUBAAAAAacFAQAAAAGoBQEAAAABrgVAAAAAAcAFAQAAAAHBBQIAAAABwgWAAAAAAQE_AACdCAAwAT8AAJ0IADABAAAAVQAgCAMAAMYKACClBQEAtgoAIacFAQC3CgAhqAUBALcKACGuBUAAuQoAIcAFAQC2CgAhwQUCAMUKACHCBYAAAAABAgAAAKgBACA_AAChCAAgB6UFAQC2CgAhpwUBALcKACGoBQEAtwoAIa4FQAC5CgAhwAUBALYKACHBBQIAxQoAIcIFgAAAAAECAAAApgEAID8AAKMIACACAAAApgEAID8AAKMIACABAAAAVQAgAwAAAKgBACBGAACbCAAgRwAAoQgAIAEAAACoAQAgAQAAAKYBACAJDQAAwAoAIEwAAMMKACBNAADCCgAgngEAAMEKACCfAQAAxAoAIKcFAACwCgAgqAUAALAKACDBBQAAsAoAIMIFAACwCgAgCqIFAADbCAAwowUAAKsIABCkBQAA2wgAMKUFAQDLCAAhpwUBAMwIACGoBQEAzAgAIa4FQADPCAAhwAUBAMsIACHBBQIA3AgAIcIFAADOCAAgAwAAAKYBACABAACqCAAwSwAAqwgAIAMAAACmAQAgAQAApwEAMAIAAKgBACABAAAAZAAgAQAAAGQAIAMAAABiACABAABjADACAABkACADAAAAYgAgAQAAYwAwAgAAZAAgAwAAAGIAIAEAAGMAMAIAAGQAIA0DAAC9CgAgCQAAvwoAIBEAAL4KACClBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABqQUBAAAAAaoFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABAT8AALMIACAKpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQE_AAC1CAAwAT8AALUIADABAAAAVQAgAQAAAAcAIAEAAAAXACANAwAAugoAIAkAALwKACARAAC7CgAgpQUBALYKACGmBQEAtgoAIacFAQC3CgAhqAUBALcKACGpBQEAtwoAIaoFAQC3CgAhqwUIALgKACGsBQEAtwoAIa0FgAAAAAGuBUAAuQoAIQIAAABkACA_AAC7CAAgCqUFAQC2CgAhpgUBALYKACGnBQEAtwoAIagFAQC3CgAhqQUBALcKACGqBQEAtwoAIasFCAC4CgAhrAUBALcKACGtBYAAAAABrgVAALkKACECAAAAYgAgPwAAvQgAIAIAAABiACA_AAC9CAAgAQAAAFUAIAEAAAAHACABAAAAFwAgAwAAAGQAIEYAALMIACBHAAC7CAAgAQAAAGQAIAEAAABiACAMDQAAsQoAIEwAALQKACBNAACzCgAgngEAALIKACCfAQAAtQoAIKcFAACwCgAgqAUAALAKACCpBQAAsAoAIKoFAACwCgAgqwUAALAKACCsBQAAsAoAIK0FAACwCgAgDaIFAADKCAAwowUAAMcIABCkBQAAyggAMKUFAQDLCAAhpgUBAMsIACGnBQEAzAgAIagFAQDMCAAhqQUBAMwIACGqBQEAzAgAIasFCADNCAAhrAUBAMwIACGtBQAAzggAIK4FQADPCAAhAwAAAGIAIAEAAMYIADBLAADHCAAgAwAAAGIAIAEAAGMAMAIAAGQAIA2iBQAAyggAMKMFAADHCAAQpAUAAMoIADClBQEAywgAIaYFAQDLCAAhpwUBAMwIACGoBQEAzAgAIakFAQDMCAAhqgUBAMwIACGrBQgAzQgAIawFAQDMCAAhrQUAAM4IACCuBUAAzwgAIQ4NAADRCAAgTAAA2ggAIE0AANoIACCvBQEAAAABsAUBAAAABLEFAQAAAASyBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtgUBANkIACG9BQEAAAABvgUBAAAAAb8FAQAAAAEODQAA0wgAIEwAANgIACBNAADYCAAgrwUBAAAAAbAFAQAAAAWxBQEAAAAFsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDXCAAhvQUBAAAAAb4FAQAAAAG_BQEAAAABDQ0AANMIACBMAADWCAAgTQAA1ggAIJ4BAADWCAAgnwEAANYIACCvBQgAAAABsAUIAAAABbEFCAAAAAWyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIANUIACEPDQAA0wgAIEwAANQIACBNAADUCAAgrwWAAAAAAbIFgAAAAAGzBYAAAAABtAWAAAAAAbUFgAAAAAG2BYAAAAABtwUBAAAAAbgFAQAAAAG5BQEAAAABugWAAAAAAbsFgAAAAAG8BYAAAAABCw0AANEIACBMAADSCAAgTQAA0ggAIK8FQAAAAAGwBUAAAAAEsQVAAAAABLIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA0AgAIQsNAADRCAAgTAAA0ggAIE0AANIIACCvBUAAAAABsAVAAAAABLEFQAAAAASyBUAAAAABswVAAAAAAbQFQAAAAAG1BUAAAAABtgVAANAIACEIrwUCAAAAAbAFAgAAAASxBQIAAAAEsgUCAAAAAbMFAgAAAAG0BQIAAAABtQUCAAAAAbYFAgDRCAAhCK8FQAAAAAGwBUAAAAAEsQVAAAAABLIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA0ggAIQivBQIAAAABsAUCAAAABbEFAgAAAAWyBQIAAAABswUCAAAAAbQFAgAAAAG1BQIAAAABtgUCANMIACEMrwWAAAAAAbIFgAAAAAGzBYAAAAABtAWAAAAAAbUFgAAAAAG2BYAAAAABtwUBAAAAAbgFAQAAAAG5BQEAAAABugWAAAAAAbsFgAAAAAG8BYAAAAABDQ0AANMIACBMAADWCAAgTQAA1ggAIJ4BAADWCAAgnwEAANYIACCvBQgAAAABsAUIAAAABbEFCAAAAAWyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIANUIACEIrwUIAAAAAbAFCAAAAAWxBQgAAAAFsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCADWCAAhDg0AANMIACBMAADYCAAgTQAA2AgAIK8FAQAAAAGwBQEAAAAFsQUBAAAABbIFAQAAAAGzBQEAAAABtAUBAAAAAbUFAQAAAAG2BQEA1wgAIb0FAQAAAAG-BQEAAAABvwUBAAAAAQuvBQEAAAABsAUBAAAABbEFAQAAAAWyBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtgUBANgIACG9BQEAAAABvgUBAAAAAb8FAQAAAAEODQAA0QgAIEwAANoIACBNAADaCAAgrwUBAAAAAbAFAQAAAASxBQEAAAAEsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDZCAAhvQUBAAAAAb4FAQAAAAG_BQEAAAABC68FAQAAAAGwBQEAAAAEsQUBAAAABLIFAQAAAAGzBQEAAAABtAUBAAAAAbUFAQAAAAG2BQEA2ggAIb0FAQAAAAG-BQEAAAABvwUBAAAAAQqiBQAA2wgAMKMFAACrCAAQpAUAANsIADClBQEAywgAIacFAQDMCAAhqAUBAMwIACGuBUAAzwgAIcAFAQDLCAAhwQUCANwIACHCBQAAzggAIA0NAADTCAAgTAAA0wgAIE0AANMIACCeAQAA1ggAIJ8BAADTCAAgrwUCAAAAAbAFAgAAAAWxBQIAAAAFsgUCAAAAAbMFAgAAAAG0BQIAAAABtQUCAAAAAbYFAgDdCAAhDQ0AANMIACBMAADTCAAgTQAA0wgAIJ4BAADWCAAgnwEAANMIACCvBQIAAAABsAUCAAAABbEFAgAAAAWyBQIAAAABswUCAAAAAbQFAgAAAAG1BQIAAAABtgUCAN0IACELogUAAN4IADCjBQAAkwgAEKQFAADeCAAwpQUBAMsIACGnBQEAzAgAIagFAQDMCAAhqgUBAMsIACHDBQEAzAgAIcQFAQDMCAAhxQUBAMwIACHGBUAAzwgAIQyiBQAA3wgAMKMFAAD7BwAQpAUAAN8IADClBQEAywgAIa4FQADPCAAhxwUBAMsIACHIBQEAywgAIcoFAADgCMoFIssFAQDLCAAhzAUAAM4IACDOBQAA4QjOBSLPBUAAzwgAIQcNAADRCAAgTAAA5QgAIE0AAOUIACCvBQAAAMoFArAFAAAAygUIsQUAAADKBQi2BQAA5AjKBSIHDQAA0QgAIEwAAOMIACBNAADjCAAgrwUAAADOBQKwBQAAAM4FCLEFAAAAzgUItgUAAOIIzgUiBw0AANEIACBMAADjCAAgTQAA4wgAIK8FAAAAzgUCsAUAAADOBQixBQAAAM4FCLYFAADiCM4FIgSvBQAAAM4FArAFAAAAzgUIsQUAAADOBQi2BQAA4wjOBSIHDQAA0QgAIEwAAOUIACBNAADlCAAgrwUAAADKBQKwBQAAAMoFCLEFAAAAygUItgUAAOQIygUiBK8FAAAAygUCsAUAAADKBQixBQAAAMoFCLYFAADlCMoFIgqiBQAA5ggAMKMFAADlBwAQpAUAAOYIADClBQEAywgAIa4FQADPCAAhzgUAAOcI0wUizwVAAM8IACHQBQEAywgAIdEFAQDLCAAh0wUBAMwIACEHDQAA0QgAIEwAAOkIACBNAADpCAAgrwUAAADTBQKwBQAAANMFCLEFAAAA0wUItgUAAOgI0wUiBw0AANEIACBMAADpCAAgTQAA6QgAIK8FAAAA0wUCsAUAAADTBQixBQAAANMFCLYFAADoCNMFIgSvBQAAANMFArAFAAAA0wUIsQUAAADTBQi2BQAA6QjTBSINogUAAOoIADCjBQAAzwcAEKQFAADqCAAwpQUBAMsIACGnBQEAzAgAIa4FQADPCAAhywUBAMsIACHPBUAAzwgAIdQFAQDLCAAh1QUBAMwIACHWBQEAzAgAIdcFIADrCAAh2AUBAMwIACEFDQAA0QgAIEwAAO0IACBNAADtCAAgrwUgAAAAAbYFIADsCAAhBQ0AANEIACBMAADtCAAgTQAA7QgAIK8FIAAAAAG2BSAA7AgAIQKvBSAAAAABtgUgAO0IACEFogUAAO4IADCjBQAAtQcAEKQFAADuCAAw1AUBAMsIACHZBQEAywgAIQWiBQAA7wgAMKMFAACfBwAQpAUAAO8IADDUBQEAywgAIdoFAQDLCAAhCKIFAADwCAAwowUAAIkHABCkBQAA8AgAMKUFAQDLCAAhrgVAAM8IACHPBUAAzwgAIdsFAQDLCAAh3AUBAMsIACEJNgAA9AgAIKIFAADxCAAwowUAAPYGABCkBQAA8QgAMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdsFAQDyCAAh3AUBAPIIACELrwUBAAAAAbAFAQAAAASxBQEAAAAEsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDaCAAhvQUBAAAAAb4FAQAAAAG_BQEAAAABCK8FQAAAAAGwBUAAAAAEsQVAAAAABLIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA0ggAIQPdBQAAtQEAIN4FAAC1AQAg3wUAALUBACAJogUAAPUIADCjBQAA8AYAEKQFAAD1CAAwpQUBAMsIACGuBUAAzwgAIc8FQADPCAAh2wUBAMsIACHcBQEAywgAIeAFAQDMCAAhCjYAAPgIACCiBQAA9ggAMKMFAADdBgAQpAUAAPYIADClBQEA8ggAIa4FQADzCAAhzwVAAPMIACHbBQEA8ggAIdwFAQDyCAAh4AUBAPcIACELrwUBAAAAAbAFAQAAAAWxBQEAAAAFsgUBAAAAAbMFAQAAAAG0BQEAAAABtQUBAAAAAbYFAQDYCAAhvQUBAAAAAb4FAQAAAAG_BQEAAAABA90FAACvAQAg3gUAAK8BACDfBQAArwEAIBSiBQAA-QgAMKMFAADXBgAQpAUAAPkIADClBQEAywgAIa0FAADOCAAgrgVAAM8IACHLBQEAywgAIc8FQADPCAAh3AUBAMsIACHhBQEAywgAIeIFAQDMCAAh4wUBAMwIACHkBQEAzAgAIeUFQAD6CAAh5gUgAOsIACHnBQIA-wgAIegFAQDMCAAh6QUBAMwIACHqBQEAzAgAIesFIADrCAAhCw0AANMIACBMAAD_CAAgTQAA_wgAIK8FQAAAAAGwBUAAAAAFsQVAAAAABbIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA_ggAIQ0NAADRCAAgTAAA0QgAIE0AANEIACCeAQAA_QgAIJ8BAADRCAAgrwUCAAAAAbAFAgAAAASxBQIAAAAEsgUCAAAAAbMFAgAAAAG0BQIAAAABtQUCAAAAAbYFAgD8CAAhDQ0AANEIACBMAADRCAAgTQAA0QgAIJ4BAAD9CAAgnwEAANEIACCvBQIAAAABsAUCAAAABLEFAgAAAASyBQIAAAABswUCAAAAAbQFAgAAAAG1BQIAAAABtgUCAPwIACEIrwUIAAAAAbAFCAAAAASxBQgAAAAEsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCAD9CAAhCw0AANMIACBMAAD_CAAgTQAA_wgAIK8FQAAAAAGwBUAAAAAFsQVAAAAABbIFQAAAAAGzBUAAAAABtAVAAAAAAbUFQAAAAAG2BUAA_ggAIQivBUAAAAABsAVAAAAABbEFQAAAAAWyBUAAAAABswVAAAAAAbQFQAAAAAG1BUAAAAABtgVAAP8IACEXHgAA9AgAICIAAPgIACA3AACFCQAgogUAAIAJADCjBQAAxAYAEKQFAACACQAwpQUBAPIIACGtBQAAhAkAIK4FQADzCAAhywUBAPIIACHPBUAA8wgAIdwFAQDyCAAh4QUBAPIIACHiBQEA9wgAIeMFAQD3CAAh5AUBAPcIACHlBUAAgQkAIeYFIACCCQAh5wUCAIMJACHoBQEA9wgAIekFAQD3CAAh6gUBAPcIACHrBSAAggkAIQivBUAAAAABsAVAAAAABbEFQAAAAAWyBUAAAAABswVAAAAAAbQFQAAAAAG1BUAAAAABtgVAAP8IACECrwUgAAAAAbYFIADtCAAhCK8FAgAAAAGwBQIAAAAEsQUCAAAABLIFAgAAAAGzBQIAAAABtAUCAAAAAbUFAgAAAAG2BQIA0QgAIQyvBYAAAAABsgWAAAAAAbMFgAAAAAG0BYAAAAABtQWAAAAAAbYFgAAAAAG3BQEAAAABuAUBAAAAAbkFAQAAAAG6BYAAAAABuwWAAAAAAbwFgAAAAAED3QUAAKsBACDeBQAAqwEAIN8FAACrAQAgB6IFAACGCQAwowUAAL4GABCkBQAAhgkAMKUFAQDLCAAhrgVAAM8IACHsBQEAywgAIe0FAQDLCAAhCqIFAACHCQAwowUAAKgGABCkBQAAhwkAMKUFAQDLCAAhpwUBAMsIACGuBUAAzwgAIc8FQADPCAAh2wUBAMsIACHuBSAA6wgAIe8FAQDMCAAhDAMAAIkJACAMAACKCQAgogUAAIgJADCjBQAAxAEAEKQFAACICQAwpQUBAPIIACGnBQEA8ggAIa4FQADzCAAhzwVAAPMIACHbBQEA8ggAIe4FIACCCQAh7wUBAPcIACEjDgAA_gkAIBUAAIMKACAcAAD9CQAgHwAAgAoAICAAAIIKACAjAACiCQAgKQAA-QkAICoAAPoJACArAAD7CQAgLAAA_AkAIDEAAN8JACAyAAD_CQAgMwAA_QkAIDQAAIEKACA5AACFCQAgogUAAPcJADCjBQAAVQAQpAUAAPcJADClBQEA8ggAIa0FAACECQAgrgVAAPMIACHEBQEA9wgAIc4FAAD4CecGIs8FQADzCAAh2wUBAPcIACHOBgEA9wgAIdEGAQD3CAAh4wYBAPIIACHkBiAAggkAIeUGAADhCcoFIucGQACBCQAh6AYBAPcIACHpBgEA9wgAIfUGAABVACD2BgAAVQAgA90FAAA2ACDeBQAANgAg3wUAADYAIA6iBQAAiwkAMKMFAACQBgAQpAUAAIsJADClBQEAywgAIa4FQADPCAAh7QUBAMsIACHxBQAAjAnxBSLyBQIA-wgAIfMFAgD7CAAh9AUCAPsIACH1BQEAzAgAIfYFAQDMCAAh9wUBAMwIACH4BQEAzAgAIQcNAADRCAAgTAAAjgkAIE0AAI4JACCvBQAAAPEFArAFAAAA8QUIsQUAAADxBQi2BQAAjQnxBSIHDQAA0QgAIEwAAI4JACBNAACOCQAgrwUAAADxBQKwBQAAAPEFCLEFAAAA8QUItgUAAI0J8QUiBK8FAAAA8QUCsAUAAADxBQixBQAAAPEFCLYFAACOCfEFIgWiBQAAjwkAMKMFAAD6BQAQpAUAAI8JADDaBQEAywgAIfkFAQDLCAAhBaIFAACQCQAwowUAAOQFABCkBQAAkAkAMKoFAQDLCAAh-QUBAMsIACETogUAAJEJADCjBQAAzgUAEKQFAACRCQAwpQUBAMsIACGuBUAAzwgAIc8FQADPCAAh4AUBAMwIACH6BQEAywgAIfwFAACSCfwFIv0FEACTCQAh_gUQAJQJACH_BRAAlAkAIYAGAgDcCAAhgQYCAPsIACGCBgIA3AgAIYMGQADPCAAhhAZAAM8IACGFBiAA6wgAIYYGIADrCAAhBw0AANEIACBMAACaCQAgTQAAmgkAIK8FAAAA_AUCsAUAAAD8BQixBQAAAPwFCLYFAACZCfwFIg0NAADRCAAgTAAAmAkAIE0AAJgJACCeAQAAmAkAIJ8BAACYCQAgrwUQAAAAAbAFEAAAAASxBRAAAAAEsgUQAAAAAbMFEAAAAAG0BRAAAAABtQUQAAAAAbYFEACXCQAhDQ0AANMIACBMAACWCQAgTQAAlgkAIJ4BAACWCQAgnwEAAJYJACCvBRAAAAABsAUQAAAABbEFEAAAAAWyBRAAAAABswUQAAAAAbQFEAAAAAG1BRAAAAABtgUQAJUJACENDQAA0wgAIEwAAJYJACBNAACWCQAgngEAAJYJACCfAQAAlgkAIK8FEAAAAAGwBRAAAAAFsQUQAAAABbIFEAAAAAGzBRAAAAABtAUQAAAAAbUFEAAAAAG2BRAAlQkAIQivBRAAAAABsAUQAAAABbEFEAAAAAWyBRAAAAABswUQAAAAAbQFEAAAAAG1BRAAAAABtgUQAJYJACENDQAA0QgAIEwAAJgJACBNAACYCQAgngEAAJgJACCfAQAAmAkAIK8FEAAAAAGwBRAAAAAEsQUQAAAABLIFEAAAAAGzBRAAAAABtAUQAAAAAbUFEAAAAAG2BRAAlwkAIQivBRAAAAABsAUQAAAABLEFEAAAAASyBRAAAAABswUQAAAAAbQFEAAAAAG1BRAAAAABtgUQAJgJACEHDQAA0QgAIEwAAJoJACBNAACaCQAgrwUAAAD8BQKwBQAAAPwFCLEFAAAA_AUItgUAAJkJ_AUiBK8FAAAA_AUCsAUAAAD8BQixBQAAAPwFCLYFAACaCfwFIhYIAACgCQAgIgAAoQkAICMAAKIJACCiBQAAmwkAMKMFAAALABCkBQAAmwkAMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIeAFAQD3CAAh-gUBAPIIACH8BQAAnAn8BSL9BRAAnQkAIf4FEACeCQAh_wUQAJ4JACGABgIAnwkAIYEGAgCDCQAhggYCAJ8JACGDBkAA8wgAIYQGQADzCAAhhQYgAIIJACGGBiAAggkAIQSvBQAAAPwFArAFAAAA_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-ggAIa4GQAD6CAAhrwZAAPoIACGwBkAA-ggAIbEGQAD6CAAhCaIFAAC7CQAwowUAAK4EABCkBQAAuwkAMKUFAQDLCAAhrgVAAM8IACHPBUAAzwgAIe0FAQDLCAAh8gUCAPsIACGyBgEAywgAIQeiBQAAvAkAMKMFAACYBAAQpAUAALwJADClBQEAywgAIacFAQDLCAAhrgVAAM8IACHPBUAAzwgAIQkDAACJCQAgDAAAvgkAIKIFAAC9CQAwowUAAJgBABCkBQAAvQkAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc8FQADzCAAhA90FAAAnACDeBQAAJwAg3wUAACcAIBKiBQAAvwkAMKMFAACABAAQpAUAAL8JADClBQEAywgAIacFAQDLCAAhqgUBAMsIACGuBUAAzwgAIc8FQADPCAAh1wUgAOsIACHhBQEAzAgAIbMGAgD7CAAhtAYBAMwIACG1BiAA6wgAIbYGAgD7CAAhtwYCAPsIACG4BgEAzAgAIbkGQAD6CAAhugYBAMwIACEPogUAAMAJADCjBQAA6AMAEKQFAADACQAwpQUBAMsIACGqBQEAzAgAIa4FQADPCAAhzwVAAM8IACHaBQEAzAgAIe0FAQDMCAAhuwYBAMsIACG8BgEAzAgAIb0GAQDMCAAhvgYCAPsIACG_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_gkAIBUAAIMKACAcAAD9CQAgHwAAgAoAICAAAIIKACAjAACiCQAgKQAA-QkAICoAAPoJACArAAD7CQAgLAAA_AkAIDEAAN8JACAyAAD_CQAgMwAA_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_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_gUQAJ4JACH_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_AUAAJwJ_AUi_QUQAJ0JACH-BRAAngkAIf8FEACeCQAhgAYCAJ8JACGBBgIAgwkAIYIGAgCfCQAhgwZAAPMIACGEBkAA8wgAIYUGIACCCQAhhgYgAIIJACH1BgAACwAg9gYAAAsAIBERAACtCQAgogUAAKoJADCjBQAAdwAQpAUAAKoJADClBQEA8ggAIakFAQDyCAAhrgVAAPMIACHOBQAArAmKBiLPBUAA8wgAIYgGAACrCYgGIooGEACdCQAhiwYBAPcIACGMBgAAhAkAII0GQACBCQAhjgYBAPcIACH1BgAAdwAg9gYAAHcAIAPdBQAAeQAg3gUAAHkAIN8FAAB5ACAD3QUAAH0AIN4FAAB9ACDfBQAAfQAgEgMAAIkJACAjAACiCQAgogUAAK8KADCjBQAAAwAQpAUAAK8KADClBQEA8ggAIacFAQDyCAAhrgVAAPMIACHPBUAA8wgAIc8GAQD3CAAh0AYBAPcIACHRBgEA9wgAIdIGAQDyCAAh0wYBAPIIACHUBgEA9wgAIdUGAQD3CAAh1gYBAPIIACHXBiAAggkAIQAAAAAAAAH6BgEAAAABAfoGAQAAAAEF-gYIAAAAAYAHCAAAAAGBBwgAAAABggcIAAAAAYMHCAAAAAEB-gZAAAAAAQdGAACmFAAgRwAArxQAIPcGAACnFAAg-AYAAK4UACD7BgAAVQAg_AYAAFUAIP0GAAABACAHRgAApBQAIEcAAKwUACD3BgAApRQAIPgGAACrFAAg-wYAAAcAIPwGAAAHACD9BgAACQAgB0YAAKIUACBHAACpFAAg9wYAAKMUACD4BgAAqBQAIPsGAAAXACD8BgAAFwAg_QYAABkAIANGAACmFAAg9wYAAKcUACD9BgAAAQAgA0YAAKQUACD3BgAApRQAIP0GAAAJACADRgAAohQAIPcGAACjFAAg_QYAABkAIAAAAAAABfoGAgAAAAGABwIAAAABgQcCAAAAAYIHAgAAAAGDBwIAAAABB0YAAJ0UACBHAACgFAAg9wYAAJ4UACD4BgAAnxQAIPsGAABVACD8BgAAVQAg_QYAAAEAIANGAACdFAAg9wYAAJ4UACD9BgAAAQAgAAAABUYAAJUUACBHAACbFAAg9wYAAJYUACD4BgAAmhQAIP0GAAAZACAHRgAAkxQAIEcAAJgUACD3BgAAlBQAIPgGAACXFAAg-wYAAFUAIPwGAABVACD9BgAAAQAgA0YAAJUUACD3BgAAlhQAIP0GAAAZACADRgAAkxQAIPcGAACUFAAg_QYAAAEAIAAAAAH6BgAAAMoFAgH6BgAAAM4FAgVGAACLFAAgRwAAkRQAIPcGAACMFAAg-AYAAJAUACD9BgAAogEAIAVGAACJFAAgRwAAjhQAIPcGAACKFAAg-AYAAI0UACD9BgAAAQAgA0YAAIsUACD3BgAAjBQAIP0GAACiAQAgA0YAAIkUACD3BgAAihQAIP0GAAABACAAAAAB-gYAAADTBQIFRgAAgxQAIEcAAIcUACD3BgAAhBQAIPgGAACGFAAg_QYAAAEAIAtGAADeCgAwRwAA4woAMPcGAADfCgAw-AYAAOAKADD5BgAA4QoAIPoGAADiCgAw-wYAAOIKADD8BgAA4goAMP0GAADiCgAw_gYAAOQKADD_BgAA5QoAMAkwAADXCgAgpQUBAAAAAa4FQAAAAAHIBQEAAAABygUAAADKBQLLBQEAAAABzAWAAAAAAc4FAAAAzgUCzwVAAAAAAQIAAACcAQAgRgAA6QoAIAMAAACcAQAgRgAA6QoAIEcAAOgKACABPwAAhRQAMA4vAADjCQAgMAAAiQkAIKIFAADgCQAwowUAAJoBABCkBQAA4AkAMKUFAQAAAAGuBUAA8wgAIccFAQDyCAAhyAUBAPIIACHKBQAA4QnKBSLLBQEA8ggAIcwFAACECQAgzgUAAOIJzgUizwVAAPMIACECAAAAnAEAID8AAOgKACACAAAA5goAID8AAOcKACAMogUAAOUKADCjBQAA5goAEKQFAADlCgAwpQUBAPIIACGuBUAA8wgAIccFAQDyCAAhyAUBAPIIACHKBQAA4QnKBSLLBQEA8ggAIcwFAACECQAgzgUAAOIJzgUizwVAAPMIACEMogUAAOUKADCjBQAA5goAEKQFAADlCgAwpQUBAPIIACGuBUAA8wgAIccFAQDyCAAhyAUBAPIIACHKBQAA4QnKBSLLBQEA8ggAIcwFAACECQAgzgUAAOIJzgUizwVAAPMIACEIpQUBALYKACGuBUAAuQoAIcgFAQC2CgAhygUAANIKygUiywUBALYKACHMBYAAAAABzgUAANMKzgUizwVAALkKACEJMAAA1QoAIKUFAQC2CgAhrgVAALkKACHIBQEAtgoAIcoFAADSCsoFIssFAQC2CgAhzAWAAAAAAc4FAADTCs4FIs8FQAC5CgAhCTAAANcKACClBQEAAAABrgVAAAAAAcgFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABA0YAAIMUACD3BgAAhBQAIP0GAAABACAERgAA3goAMPcGAADfCgAw-QYAAOEKACD9BgAA4goAMAAAAAH6BiAAAAABBUYAAPcTACBHAACBFAAg9wYAAPgTACD4BgAAgBQAIP0GAADBBgAgB0YAAPUTACBHAAD-EwAg9wYAAPYTACD4BgAA_RMAIPsGAABVACD8BgAAVQAg_QYAAAEAIAdGAADzEwAgRwAA-xMAIPcGAAD0EwAg-AYAAPoTACD7BgAAqwEAIPwGAACrAQAg_QYAAK0BACALRgAA9AoAMEcAAPkKADD3BgAA9QoAMPgGAAD2CgAw-QYAAPcKACD6BgAA-AoAMPsGAAD4CgAw_AYAAPgKADD9BgAA-AoAMP4GAAD6CgAw_wYAAPsKADAMAwAAgQsAIDUAAIALACA4AACCCwAgpQUBAAAAAacFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAABAgAAAK0BACBGAAD_CgAgAwAAAK0BACBGAAD_CgAgRwAA_goAIAE_AAD5EwAwEQMAANoJACAGAADbCQAgNQAA1AkAIDgAAIUJACCiBQAA2QkAMKMFAACrAQAQpAUAANkJADClBQEAAAABpwUBAPcIACGuBUAA8wgAIcsFAQDyCAAhzwVAAPMIACHUBQEA8ggAIdUFAQD3CAAh1gUBAPcIACHXBSAAggkAIdgFAQD3CAAhAgAAAK0BACA_AAD-CgAgAgAAAPwKACA_AAD9CgAgDaIFAAD7CgAwowUAAPwKABCkBQAA-woAMKUFAQDyCAAhpwUBAPcIACGuBUAA8wgAIcsFAQDyCAAhzwVAAPMIACHUBQEA8ggAIdUFAQD3CAAh1gUBAPcIACHXBSAAggkAIdgFAQD3CAAhDaIFAAD7CgAwowUAAPwKABCkBQAA-woAMKUFAQDyCAAhpwUBAPcIACGuBUAA8wgAIcsFAQDyCAAhzwVAAPMIACHUBQEA8ggAIdUFAQD3CAAh1gUBAPcIACHXBSAAggkAIdgFAQD3CAAhCaUFAQC2CgAhpwUBALcKACGuBUAAuQoAIcsFAQC2CgAhzwVAALkKACHUBQEAtgoAIdUFAQC3CgAh1gUBALcKACHXBSAA7woAIQwDAADxCgAgNQAA8AoAIDgAAPMKACClBQEAtgoAIacFAQC3CgAhrgVAALkKACHLBQEAtgoAIc8FQAC5CgAh1AUBALYKACHVBQEAtwoAIdYFAQC3CgAh1wUgAO8KACEMAwAAgQsAIDUAAIALACA4AACCCwAgpQUBAAAAAacFAQAAAAGuBUAAAAABywUBAAAAAc8FQAAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAABA0YAAPcTACD3BgAA-BMAIP0GAADBBgAgA0YAAPUTACD3BgAA9hMAIP0GAAABACAERgAA9AoAMPcGAAD1CgAw-QYAAPcKACD9BgAA-AoAMANGAADzEwAg9wYAAPQTACD9BgAArQEAIAAAAAVGAADrEwAgRwAA8RMAIPcGAADsEwAg-AYAAPATACD9BgAAwQYAIAVGAADpEwAgRwAA7hMAIPcGAADqEwAg-AYAAO0TACD9BgAA8wYAIANGAADrEwAg9wYAAOwTACD9BgAAwQYAIANGAADpEwAg9wYAAOoTACD9BgAA8wYAIAAAAAVGAADhEwAgRwAA5xMAIPcGAADiEwAg-AYAAOYTACD9BgAAwQYAIAVGAADfEwAgRwAA5BMAIPcGAADgEwAg-AYAAOMTACD9BgAA2gYAIANGAADhEwAg9wYAAOITACD9BgAAwQYAIANGAADfEwAg9wYAAOATACD9BgAA2gYAIAAAAAtGAACWCwAwRwAAmwsAMPcGAACXCwAw-AYAAJgLADD5BgAAmQsAIPoGAACaCwAw-wYAAJoLADD8BgAAmgsAMP0GAACaCwAw_gYAAJwLADD_BgAAnQsAMAI1AACJCwAg1AUBAAAAAQIAAAC3AQAgRgAAoQsAIAMAAAC3AQAgRgAAoQsAIEcAAKALACABPwAA3hMAMAgdAADVCQAgNQAA1AkAIKIFAADTCQAwowUAALUBABCkBQAA0wkAMNQFAQDyCAAh2QUBAPIIACHqBgAA0gkAIAIAAAC3AQAgPwAAoAsAIAIAAACeCwAgPwAAnwsAIAWiBQAAnQsAMKMFAACeCwAQpAUAAJ0LADDUBQEA8ggAIdkFAQDyCAAhBaIFAACdCwAwowUAAJ4LABCkBQAAnQsAMNQFAQDyCAAh2QUBAPIIACEB1AUBALYKACECNQAAhwsAINQFAQC2CgAhAjUAAIkLACDUBQEAAAABBEYAAJYLADD3BgAAlwsAMPkGAACZCwAg_QYAAJoLADAAAAAAC0YAAKgLADBHAACtCwAw9wYAAKkLADD4BgAAqgsAMPkGAACrCwAg-gYAAKwLADD7BgAArAsAMPwGAACsCwAw_QYAAKwLADD-BgAArgsAMP8GAACvCwAwAjUAAJALACDUBQEAAAABAgAAALEBACBGAACzCwAgAwAAALEBACBGAACzCwAgRwAAsgsAIAE_AADdEwAwCBgAANgJACA1AADUCQAgogUAANcJADCjBQAArwEAEKQFAADXCQAw1AUBAPIIACHaBQEA8ggAIesGAADWCQAgAgAAALEBACA_AACyCwAgAgAAALALACA_AACxCwAgBaIFAACvCwAwowUAALALABCkBQAArwsAMNQFAQDyCAAh2gUBAPIIACEFogUAAK8LADCjBQAAsAsAEKQFAACvCwAw1AUBAPIIACHaBQEA8ggAIQHUBQEAtgoAIQI1AACOCwAg1AUBALYKACECNQAAkAsAINQFAQAAAAEERgAAqAsAMPcGAACpCwAw-QYAAKsLACD9BgAArAsAMAAAAAAAAAH6BkAAAAABBfoGAgAAAAGABwIAAAABgQcCAAAAAYIHAgAAAAGDBwIAAAABC0YAANILADBHAADWCwAw9wYAANMLADD4BgAA1AsAMPkGAADVCwAg-gYAAKwLADD7BgAArAsAMPwGAACsCwAw_QYAAKwLADD-BgAA1wsAMP8GAACvCwAwC0YAAMkLADBHAADNCwAw9wYAAMoLADD4BgAAywsAMPkGAADMCwAg-gYAAJoLADD7BgAAmgsAMPwGAACaCwAw_QYAAJoLADD-BgAAzgsAMP8GAACdCwAwC0YAAMALADBHAADECwAw9wYAAMELADD4BgAAwgsAMPkGAADDCwAg-gYAAPgKADD7BgAA-AoAMPwGAAD4CgAw_QYAAPgKADD-BgAAxQsAMP8GAAD7CgAwDAMAAIELACAGAACDCwAgOAAAggsAIKUFAQAAAAGnBQEAAAABrgVAAAAAAcsFAQAAAAHPBUAAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAAB2AUBAAAAAQIAAACtAQAgRgAAyAsAIAMAAACtAQAgRgAAyAsAIEcAAMcLACABPwAA3BMAMAIAAACtAQAgPwAAxwsAIAIAAAD8CgAgPwAAxgsAIAmlBQEAtgoAIacFAQC3CgAhrgVAALkKACHLBQEAtgoAIc8FQAC5CgAh1QUBALcKACHWBQEAtwoAIdcFIADvCgAh2AUBALcKACEMAwAA8QoAIAYAAPIKACA4AADzCgAgpQUBALYKACGnBQEAtwoAIa4FQAC5CgAhywUBALYKACHPBUAAuQoAIdUFAQC3CgAh1gUBALcKACHXBSAA7woAIdgFAQC3CgAhDAMAAIELACAGAACDCwAgOAAAggsAIKUFAQAAAAGnBQEAAAABrgVAAAAAAcsFAQAAAAHPBUAAAAAB1QUBAAAAAdYFAQAAAAHXBSAAAAAB2AUBAAAAAQIdAACKCwAg2QUBAAAAAQIAAAC3AQAgRgAA0QsAIAMAAAC3AQAgRgAA0QsAIEcAANALACABPwAA2xMAMAIAAAC3AQAgPwAA0AsAIAIAAACeCwAgPwAAzwsAIAHZBQEAtgoAIQIdAACICwAg2QUBALYKACECHQAAigsAINkFAQAAAAECGAAAkQsAINoFAQAAAAECAAAAsQEAIEYAANoLACADAAAAsQEAIEYAANoLACBHAADZCwAgAT8AANoTADACAAAAsQEAID8AANkLACACAAAAsAsAID8AANgLACAB2gUBALYKACECGAAAjwsAINoFAQC2CgAhAhgAAJELACDaBQEAAAABBEYAANILADD3BgAA0wsAMPkGAADVCwAg_QYAAKwLADAERgAAyQsAMPcGAADKCwAw-QYAAMwLACD9BgAAmgsAMARGAADACwAw9wYAAMELADD5BgAAwwsAIP0GAAD4CgAwAAAAAAVGAADSEwAgRwAA2BMAIPcGAADTEwAg-AYAANcTACD9BgAAkwYAIAVGAADQEwAgRwAA1RMAIPcGAADREwAg-AYAANQTACD9BgAAJQAgA0YAANITACD3BgAA0xMAIP0GAACTBgAgA0YAANATACD3BgAA0RMAIP0GAAAlACAAAAAFRgAAyhMAIEcAAM4TACD3BgAAyxMAIPgGAADNEwAg_QYAAAEAIAtGAADrCwAwRwAA8AsAMPcGAADsCwAw-AYAAO0LADD5BgAA7gsAIPoGAADvCwAw-wYAAO8LADD8BgAA7wsAMP0GAADvCwAw_gYAAPELADD_BgAA8gsAMAQPAADlCwAgpQUBAAAAAa4FQAAAAAHtBQEAAAABAgAAADgAIEYAAPYLACADAAAAOAAgRgAA9gsAIEcAAPULACABPwAAzBMAMAoPAACQCgAgFQAAjwoAIKIFAACOCgAwowUAADYAEKQFAACOCgAwpQUBAAAAAa4FQADzCAAh7AUBAPIIACHtBQEA8ggAIfAGAACNCgAgAgAAADgAID8AAPULACACAAAA8wsAID8AAPQLACAHogUAAPILADCjBQAA8wsAEKQFAADyCwAwpQUBAPIIACGuBUAA8wgAIewFAQDyCAAh7QUBAPIIACEHogUAAPILADCjBQAA8wsAEKQFAADyCwAwpQUBAPIIACGuBUAA8wgAIewFAQDyCAAh7QUBAPIIACEDpQUBALYKACGuBUAAuQoAIe0FAQC2CgAhBA8AAOMLACClBQEAtgoAIa4FQAC5CgAh7QUBALYKACEEDwAA5QsAIKUFAQAAAAGuBUAAAAAB7QUBAAAAAQNGAADKEwAg9wYAAMsTACD9BgAAAQAgBEYAAOsLADD3BgAA7AsAMPkGAADuCwAg_QYAAO8LADAXDgAA2BEAIBUAAN4RACAcAADXEQAgHwAA2xEAICAAAN0RACAjAACcDQAgKQAA0xEAICoAANQRACArAADVEQAgLAAA1hEAIDEAANkRACAyAADaEQAgMwAA1xEAIDQAANwRACA5AADeCwAgrQUAALAKACDEBQAAsAoAINsFAACwCgAgzgYAALAKACDRBgAAsAoAIOcGAACwCgAg6AYAALAKACDpBgAAsAoAIAAAAAAAAAH6BgAAAPEFAgVGAADFEwAgRwAAyBMAIPcGAADGEwAg-AYAAMcTACD9BgAAJQAgA0YAAMUTACD3BgAAxhMAIP0GAAAlACAAAAAFRgAAvRMAIEcAAMMTACD3BgAAvhMAIPgGAADCEwAg_QYAALkFACAFRgAAuxMAIEcAAMATACD3BgAAvBMAIPgGAAC_EwAg_QYAABUAIANGAAC9EwAg9wYAAL4TACD9BgAAuQUAIANGAAC7EwAg9wYAALwTACD9BgAAFQAgAAAABUYAALMTACBHAAC5EwAg9wYAALQTACD4BgAAuBMAIP0GAAC5BQAgBUYAALETACBHAAC2EwAg9wYAALITACD4BgAAtRMAIP0GAAAZACADRgAAsxMAIPcGAAC0EwAg_QYAALkFACADRgAAsRMAIPcGAACyEwAg_QYAABkAIAAAAAAAAfoGAAAA_AUCBfoGEAAAAAGABxAAAAABgQcQAAAAAYIHEAAAAAGDBxAAAAABBfoGEAAAAAGABxAAAAABgQcQAAAAAYIHEAAAAAGDBxAAAAABC0YAAIsNADBHAACQDQAw9wYAAIwNADD4BgAAjQ0AMPkGAACODQAg-gYAAI8NADD7BgAAjw0AMPwGAACPDQAw_QYAAI8NADD-BgAAkQ0AMP8GAACSDQAwC0YAAP8MADBHAACEDQAw9wYAAIANADD4BgAAgQ0AMPkGAACCDQAg-gYAAIMNADD7BgAAgw0AMPwGAACDDQAw_QYAAIMNADD-BgAAhQ0AMP8GAACGDQAwC0YAAJwMADBHAAChDAAw9wYAAJ0MADD4BgAAngwAMPkGAACfDAAg-gYAAKAMADD7BgAAoAwAMPwGAACgDAAw_QYAAKAMADD-BgAAogwAMP8GAACjDAAwHQMAAPgMACAEAAD5DAAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAGhBhAAAAABogYBAAAAAaMGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQIAAAAJACBGAAD3DAAgAwAAAAkAIEYAAPcMACBHAACnDAAgAT8AALATADAiAwAAiQkAIAQAAKoKACAFAACrCgAgDAAAmwoAICAAAIIKACAkAACsCgAgJQAArQoAICgAAK4KACCiBQAAqQoAMKMFAAAHABCkBQAAqQoAMKUFAQAAAAGnBQEA8ggAIa4FQADzCAAhzgUAAO0JmgYizwVAAPMIACH5BQEA9wgAIaEGEACdCQAhogYBAAAAAaMGAQDyCAAhpAYAAIQJACClBgEA9wgAIaYGAQD3CAAhpwYQAJ0JACGoBhAAnQkAIakGEACdCQAhqgYQAJ0JACGrBgEA9wgAIawGQADzCAAhrQZAAIEJACGuBkAAgQkAIa8GQACBCQAhsAZAAIEJACGxBkAAgQkAIQIAAAAJACA_AACnDAAgAgAAAKQMACA_AAClDAAgGqIFAACjDAAwowUAAKQMABCkBQAAowwAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc4FAADtCZoGIs8FQADzCAAh-QUBAPcIACGhBhAAnQkAIaIGAQDyCAAhowYBAPIIACGkBgAAhAkAIKUGAQD3CAAhpgYBAPcIACGnBhAAnQkAIagGEACdCQAhqQYQAJ0JACGqBhAAnQkAIasGAQD3CAAhrAZAAPMIACGtBkAAgQkAIa4GQACBCQAhrwZAAIEJACGwBkAAgQkAIbEGQACBCQAhGqIFAACjDAAwowUAAKQMABCkBQAAowwAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc4FAADtCZoGIs8FQADzCAAh-QUBAPcIACGhBhAAnQkAIaIGAQDyCAAhowYBAPIIACGkBgAAhAkAIKUGAQD3CAAhpgYBAPcIACGnBhAAnQkAIagGEACdCQAhqQYQAJ0JACGqBhAAnQkAIasGAQD3CAAhrAZAAPMIACGtBkAAgQkAIa4GQACBCQAhrwZAAIEJACGwBkAAgQkAIbEGQACBCQAhFqUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAhoQYQAJcMACGiBgEAtgoAIaMGAQC2CgAhpAaAAAAAAaUGAQC3CgAhpgYBALcKACGnBhAAlwwAIagGEACXDAAhqQYQAJcMACGqBhAAlwwAIasGAQC3CgAhrAZAALkKACGtBkAAuwsAIa4GQAC7CwAhrwZAALsLACGwBkAAuwsAIbEGQAC7CwAhAfoGAAAAmgYCHQMAAKgMACAEAACpDAAgDAAAqgwAICAAAK4MACAkAACrDAAgJQAArAwAICgAAK0MACClBQEAtgoAIacFAQC2CgAhrgVAALkKACHOBQAApgyaBiLPBUAAuQoAIaEGEACXDAAhogYBALYKACGjBgEAtgoAIaQGgAAAAAGlBgEAtwoAIaYGAQC3CgAhpwYQAJcMACGoBhAAlwwAIakGEACXDAAhqgYQAJcMACGrBgEAtwoAIawGQAC5CgAhrQZAALsLACGuBkAAuwsAIa8GQAC7CwAhsAZAALsLACGxBkAAuwsAIQVGAACeEwAgRwAArhMAIPcGAACfEwAg-AYAAK0TACD9BgAAAQAgBUYAAJwTACBHAACrEwAg9wYAAJ0TACD4BgAAqhMAIP0GAAAFACALRgAA6QwAMEcAAO4MADD3BgAA6gwAMPgGAADrDAAw-QYAAOwMACD6BgAA7QwAMPsGAADtDAAw_AYAAO0MADD9BgAA7QwAMP4GAADvDAAw_wYAAPAMADAHRgAA4gwAIEcAAOUMACD3BgAA4wwAIPgGAADkDAAg-wYAAHcAIPwGAAB3ACD9BgAAoQUAIAtGAADWDAAwRwAA2wwAMPcGAADXDAAw-AYAANgMADD5BgAA2QwAIPoGAADaDAAw-wYAANoMADD8BgAA2gwAMP0GAADaDAAw_gYAANwMADD_BgAA3QwAMAtGAAC7DAAwRwAAwAwAMPcGAAC8DAAw-AYAAL0MADD5BgAAvgwAIPoGAAC_DAAw-wYAAL8MADD8BgAAvwwAMP0GAAC_DAAw_gYAAMEMADD_BgAAwgwAMAtGAACvDAAwRwAAtAwAMPcGAACwDAAw-AYAALEMADD5BgAAsgwAIPoGAACzDAAw-wYAALMMADD8BgAAswwAMP0GAACzDAAw_gYAALUMADD_BgAAtgwAMAsDAAC9CgAgCQAAvwoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGqBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQIAAABkACBGAAC6DAAgAwAAAGQAIEYAALoMACBHAAC5DAAgAT8AAKkTADAQAwAA2gkAIAkAAPEJACARAADwCQAgogUAAO4JADCjBQAAYgAQpAUAAO4JADClBQEAAAABpgUBAPIIACGnBQEA9wgAIagFAQD3CAAhqQUBAPcIACGqBQEA9wgAIasFCADvCQAhrAUBAPcIACGtBQAAhAkAIK4FQADzCAAhAgAAAGQAID8AALkMACACAAAAtwwAID8AALgMACANogUAALYMADCjBQAAtwwAEKQFAAC2DAAwpQUBAPIIACGmBQEA8ggAIacFAQD3CAAhqAUBAPcIACGpBQEA9wgAIaoFAQD3CAAhqwUIAO8JACGsBQEA9wgAIa0FAACECQAgrgVAAPMIACENogUAALYMADCjBQAAtwwAEKQFAAC2DAAwpQUBAPIIACGmBQEA8ggAIacFAQD3CAAhqAUBAPcIACGpBQEA9wgAIaoFAQD3CAAhqwUIAO8JACGsBQEA9wgAIa0FAACECQAgrgVAAPMIACEJpQUBALYKACGmBQEAtgoAIacFAQC3CgAhqAUBALcKACGqBQEAtwoAIasFCAC4CgAhrAUBALcKACGtBYAAAAABrgVAALkKACELAwAAugoAIAkAALwKACClBQEAtgoAIaYFAQC2CgAhpwUBALcKACGoBQEAtwoAIaoFAQC3CgAhqwUIALgKACGsBQEAtwoAIa0FgAAAAAGuBUAAuQoAIQsDAAC9CgAgCQAAvwoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGqBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQwnAADVDAAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzgUAAACZBgLPBUAAAAABkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAZYGQAAAAAGXBkAAAAABAgAAAH8AIEYAANQMACADAAAAfwAgRgAA1AwAIEcAAMYMACABPwAAqBMAMBERAACtCQAgJwAA6wkAIKIFAADpCQAwowUAAH0AEKQFAADpCQAwpQUBAAAAAakFAQAAAAGtBQAAhAkAIK4FQADzCAAhzgUAAOoJmQYizwVAAPMIACGSBgEA8ggAIZMGAQDyCAAhlAYBAPcIACGVBgEA9wgAIZYGQACBCQAhlwZAAIEJACECAAAAfwAgPwAAxgwAIAIAAADDDAAgPwAAxAwAIA-iBQAAwgwAMKMFAADDDAAQpAUAAMIMADClBQEA8ggAIakFAQDyCAAhrQUAAIQJACCuBUAA8wgAIc4FAADqCZkGIs8FQADzCAAhkgYBAPIIACGTBgEA8ggAIZQGAQD3CAAhlQYBAPcIACGWBkAAgQkAIZcGQACBCQAhD6IFAADCDAAwowUAAMMMABCkBQAAwgwAMKUFAQDyCAAhqQUBAPIIACGtBQAAhAkAIK4FQADzCAAhzgUAAOoJmQYizwVAAPMIACGSBgEA8ggAIZMGAQDyCAAhlAYBAPcIACGVBgEA9wgAIZYGQACBCQAhlwZAAIEJACELpQUBALYKACGtBYAAAAABrgVAALkKACHOBQAAxQyZBiLPBUAAuQoAIZIGAQC2CgAhkwYBALYKACGUBgEAtwoAIZUGAQC3CgAhlgZAALsLACGXBkAAuwsAIQH6BgAAAJkGAgwnAADHDAAgpQUBALYKACGtBYAAAAABrgVAALkKACHOBQAAxQyZBiLPBUAAuQoAIZIGAQC2CgAhkwYBALYKACGUBgEAtwoAIZUGAQC3CgAhlgZAALsLACGXBkAAuwsAIQtGAADIDAAwRwAAzQwAMPcGAADJDAAw-AYAAMoMADD5BgAAywwAIPoGAADMDAAw-wYAAMwMADD8BgAAzAwAMP0GAADMDAAw_gYAAM4MADD_BgAAzwwAMAalBQEAAAABrgVAAAAAAc4FAQAAAAHgBQEAAAABkAYBAAAAAZEGQAAAAAECAAAAgwEAIEYAANMMACADAAAAgwEAIEYAANMMACBHAADSDAAgAT8AAKcTADALJgAA6AkAIKIFAADnCQAwowUAAIEBABCkBQAA5wkAMKUFAQAAAAGuBUAA8wgAIc4FAQDyCAAh4AUBAPcIACGPBgEA8ggAIZAGAQD3CAAhkQZAAPMIACECAAAAgwEAID8AANIMACACAAAA0AwAID8AANEMACAKogUAAM8MADCjBQAA0AwAEKQFAADPDAAwpQUBAPIIACGuBUAA8wgAIc4FAQDyCAAh4AUBAPcIACGPBgEA8ggAIZAGAQD3CAAhkQZAAPMIACEKogUAAM8MADCjBQAA0AwAEKQFAADPDAAwpQUBAPIIACGuBUAA8wgAIc4FAQDyCAAh4AUBAPcIACGPBgEA8ggAIZAGAQD3CAAhkQZAAPMIACEGpQUBALYKACGuBUAAuQoAIc4FAQC2CgAh4AUBALcKACGQBgEAtwoAIZEGQAC5CgAhBqUFAQC2CgAhrgVAALkKACHOBQEAtgoAIeAFAQC3CgAhkAYBALcKACGRBkAAuQoAIQalBQEAAAABrgVAAAAAAc4FAQAAAAHgBQEAAAABkAYBAAAAAZEGQAAAAAEMJwAA1QwAIKUFAQAAAAGtBYAAAAABrgVAAAAAAc4FAAAAmQYCzwVAAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAQRGAADIDAAw9wYAAMkMADD5BgAAywwAIP0GAADMDAAwBaUFAQAAAAGuBUAAAAABzgUAAACaBgL3BQEAAAABmgYBAAAAAQIAAAB7ACBGAADhDAAgAwAAAHsAIEYAAOEMACBHAADgDAAgAT8AAKYTADAKEQAArQkAIKIFAADsCQAwowUAAHkAEKQFAADsCQAwpQUBAAAAAakFAQDyCAAhrgVAAPMIACHOBQAA7QmaBiL3BQEA9wgAIZoGAQD3CAAhAgAAAHsAID8AAOAMACACAAAA3gwAID8AAN8MACAJogUAAN0MADCjBQAA3gwAEKQFAADdDAAwpQUBAPIIACGpBQEA8ggAIa4FQADzCAAhzgUAAO0JmgYi9wUBAPcIACGaBgEA9wgAIQmiBQAA3QwAMKMFAADeDAAQpAUAAN0MADClBQEA8ggAIakFAQDyCAAhrgVAAPMIACHOBQAA7QmaBiL3BQEA9wgAIZoGAQD3CAAhBaUFAQC2CgAhrgVAALkKACHOBQAApgyaBiL3BQEAtwoAIZoGAQC3CgAhBaUFAQC2CgAhrgVAALkKACHOBQAApgyaBiL3BQEAtwoAIZoGAQC3CgAhBaUFAQAAAAGuBUAAAAABzgUAAACaBgL3BQEAAAABmgYBAAAAAQqlBQEAAAABrgVAAAAAAc4FAAAAigYCzwVAAAAAAYgGAAAAiAYCigYQAAAAAYsGAQAAAAGMBoAAAAABjQZAAAAAAY4GAQAAAAECAAAAoQUAIEYAAOIMACADAAAAdwAgRgAA4gwAIEcAAOYMACAMAAAAdwAgPwAA5gwAIKUFAQC2CgAhrgVAALkKACHOBQAA6AyKBiLPBUAAuQoAIYgGAADnDIgGIooGEACXDAAhiwYBALcKACGMBoAAAAABjQZAALsLACGOBgEAtwoAIQqlBQEAtgoAIa4FQAC5CgAhzgUAAOgMigYizwVAALkKACGIBgAA5wyIBiKKBhAAlwwAIYsGAQC3CgAhjAaAAAAAAY0GQAC7CwAhjgYBALcKACEB-gYAAACIBgIB-gYAAACKBgINDwAA9gwAIKUFAQAAAAGqBQEAAAABrgVAAAAAAe0FAQAAAAHyBQIAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABngaAAAAAAZ8GEAAAAAGgBhAAAAABoQYQAAAAAQIAAAAvACBGAAD1DAAgAwAAAC8AIEYAAPUMACBHAADzDAAgAT8AAKUTADASDwAAkAoAIBEAAK0JACCiBQAAkwoAMKMFAAAtABCkBQAAkwoAMKUFAQAAAAGpBQEA8ggAIaoFAQDyCAAhrgVAAPMIACHtBQEA8ggAIfIFAgCDCQAhmwYBAPIIACGcBgEA8ggAIZ0GAQD3CAAhngYAAJQKACCfBhAAnQkAIaAGEACdCQAhoQYQAJ0JACECAAAALwAgPwAA8wwAIAIAAADxDAAgPwAA8gwAIBCiBQAA8AwAMKMFAADxDAAQpAUAAPAMADClBQEA8ggAIakFAQDyCAAhqgUBAPIIACGuBUAA8wgAIe0FAQDyCAAh8gUCAIMJACGbBgEA8ggAIZwGAQDyCAAhnQYBAPcIACGeBgAAlAoAIJ8GEACdCQAhoAYQAJ0JACGhBhAAnQkAIRCiBQAA8AwAMKMFAADxDAAQpAUAAPAMADClBQEA8ggAIakFAQDyCAAhqgUBAPIIACGuBUAA8wgAIe0FAQDyCAAh8gUCAIMJACGbBgEA8ggAIZwGAQDyCAAhnQYBAPcIACGeBgAAlAoAIJ8GEACdCQAhoAYQAJ0JACGhBhAAnQkAIQylBQEAtgoAIaoFAQC2CgAhrgVAALkKACHtBQEAtgoAIfIFAgC8CwAhmwYBALYKACGcBgEAtgoAIZ0GAQC3CgAhngaAAAAAAZ8GEACXDAAhoAYQAJcMACGhBhAAlwwAIQ0PAAD0DAAgpQUBALYKACGqBQEAtgoAIa4FQAC5CgAh7QUBALYKACHyBQIAvAsAIZsGAQC2CgAhnAYBALYKACGdBgEAtwoAIZ4GgAAAAAGfBhAAlwwAIaAGEACXDAAhoQYQAJcMACEFRgAAoBMAIEcAAKMTACD3BgAAoRMAIPgGAACiEwAg_QYAACUAIA0PAAD2DAAgpQUBAAAAAaoFAQAAAAGuBUAAAAAB7QUBAAAAAfIFAgAAAAGbBgEAAAABnAYBAAAAAZ0GAQAAAAGeBoAAAAABnwYQAAAAAaAGEAAAAAGhBhAAAAABA0YAAKATACD3BgAAoRMAIP0GAAAlACAdAwAA-AwAIAQAAPkMACAMAAD6DAAgIAAA_gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAaEGEAAAAAGiBgEAAAABowYBAAAAAaQGgAAAAAGlBgEAAAABpgYBAAAAAacGEAAAAAGoBhAAAAABqQYQAAAAAaoGEAAAAAGrBgEAAAABrAZAAAAAAa0GQAAAAAGuBkAAAAABrwZAAAAAAbAGQAAAAAGxBkAAAAABA0YAAJ4TACD3BgAAnxMAIP0GAAABACADRgAAnBMAIPcGAACdEwAg_QYAAAUAIARGAADpDAAw9wYAAOoMADD5BgAA7AwAIP0GAADtDAAwA0YAAOIMACD3BgAA4wwAIP0GAAChBQAgBEYAANYMADD3BgAA1wwAMPkGAADZDAAg_QYAANoMADAERgAAuwwAMPcGAAC8DAAw-QYAAL4MACD9BgAAvwwAMARGAACvDAAw9wYAALAMADD5BgAAsgwAIP0GAACzDAAwAhgAAIkMACDaBQEAAAABAgAAAEcAIEYAAIoNACADAAAARwAgRgAAig0AIEcAAIkNACABPwAAmxMAMAgFAACLCgAgGAAAjAoAIKIFAACKCgAwowUAAEUAEKQFAACKCgAw2gUBAPIIACH5BQEA8ggAIe8GAACJCgAgAgAAAEcAID8AAIkNACACAAAAhw0AID8AAIgNACAFogUAAIYNADCjBQAAhw0AEKQFAACGDQAw2gUBAPIIACH5BQEA8ggAIQWiBQAAhg0AMKMFAACHDQAQpAUAAIYNADDaBQEA8ggAIfkFAQDyCAAhAdoFAQC2CgAhAhgAAIcMACDaBQEAtgoAIQIYAACJDAAg2gUBAAAAAQIJAACQDAAgqgUBAAAAAQIAAAAPACBGAACWDQAgAwAAAA8AIEYAAJYNACBHAACVDQAgAT8AAJoTADAIBQAAiwoAIAkAAPMJACCiBQAAqAoAMKMFAAANABCkBQAAqAoAMKoFAQDyCAAh-QUBAPIIACH0BgAApwoAIAIAAAAPACA_AACVDQAgAgAAAJMNACA_AACUDQAgBaIFAACSDQAwowUAAJMNABCkBQAAkg0AMKoFAQDyCAAh-QUBAPIIACEFogUAAJINADCjBQAAkw0AEKQFAACSDQAwqgUBAPIIACH5BQEA8ggAIQGqBQEAtgoAIQIJAACODAAgqgUBALYKACECCQAAkAwAIKoFAQAAAAEERgAAiw0AMPcGAACMDQAw-QYAAI4NACD9BgAAjw0AMARGAAD_DAAw9wYAAIANADD5BgAAgg0AIP0GAACDDQAwBEYAAJwMADD3BgAAnQwAMPkGAACfDAAg_QYAAKAMADAAAAAAAAAAAAVGAACVEwAgRwAAmBMAIPcGAACWEwAg-AYAAJcTACD9BgAACQAgA0YAAJUTACD3BgAAlhMAIP0GAAAJACASAwAA-QsAIAQAAPMRACAFAADqEQAgDAAA7hEAICAAAN0RACAkAAD0EQAgJQAA9REAICgAAPYRACD5BQAAsAoAIKQGAACwCgAgpQYAALAKACCmBgAAsAoAIKsGAACwCgAgrQYAALAKACCuBgAAsAoAIK8GAACwCgAgsAYAALAKACCxBgAAsAoAIAAAAAVGAACQEwAgRwAAkxMAIPcGAACREwAg-AYAAJITACD9BgAAfwAgA0YAAJATACD3BgAAkRMAIP0GAAB_ACAAAAAFRgAAixMAIEcAAI4TACD3BgAAjBMAIPgGAACNEwAg_QYAAAkAIANGAACLEwAg9wYAAIwTACD9BgAACQAgAAAABUYAAIYTACBHAACJEwAg9wYAAIcTACD4BgAAiBMAIP0GAAAJACADRgAAhhMAIPcGAACHEwAg_QYAAAkAIAAAAAAABUYAAIETACBHAACEEwAg9wYAAIITACD4BgAAgxMAIP0GAAAJACADRgAAgRMAIPcGAACCEwAg_QYAAAkAIAAAAAAAB0YAAPwSACBHAAD_EgAg9wYAAP0SACD4BgAA_hIAIPsGAAALACD8BgAACwAg_QYAALkFACADRgAA_BIAIPcGAAD9EgAg_QYAALkFACAAAAAAAAVGAAD0EgAgRwAA-hIAIPcGAAD1EgAg-AYAAPkSACD9BgAAgwQAIAVGAADyEgAgRwAA9xIAIPcGAADzEgAg-AYAAPYSACD9BgAAJQAgA0YAAPQSACD3BgAA9RIAIP0GAACDBAAgA0YAAPISACD3BgAA8xIAIP0GAAAlACAAAAAFRgAA7BIAIEcAAPASACD3BgAA7RIAIPgGAADvEgAg_QYAAAEAIAtGAADQDQAwRwAA1Q0AMPcGAADRDQAw-AYAANINADD5BgAA0w0AIPoGAADUDQAw-wYAANQNADD8BgAA1A0AMP0GAADUDQAw_gYAANYNADD_BgAA1w0AMAYPAADKDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB7QUBAAAAAfIFAgAAAAECAAAAKQAgRgAA2w0AIAMAAAApACBGAADbDQAgRwAA2g0AIAE_AADuEgAwDA4AAJcKACAPAACQCgAgogUAAJYKADCjBQAAJwAQpAUAAJYKADClBQEAAAABrgVAAPMIACHPBUAA8wgAIe0FAQDyCAAh8gUCAIMJACGyBgEA8ggAIfEGAACVCgAgAgAAACkAID8AANoNACACAAAA2A0AID8AANkNACAJogUAANcNADCjBQAA2A0AEKQFAADXDQAwpQUBAPIIACGuBUAA8wgAIc8FQADzCAAh7QUBAPIIACHyBQIAgwkAIbIGAQDyCAAhCaIFAADXDQAwowUAANgNABCkBQAA1w0AMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIe0FAQDyCAAh8gUCAIMJACGyBgEA8ggAIQWlBQEAtgoAIa4FQAC5CgAhzwVAALkKACHtBQEAtgoAIfIFAgC8CwAhBg8AAMgNACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHtBQEAtgoAIfIFAgC8CwAhBg8AAMoNACClBQEAAAABrgVAAAAAAc8FQAAAAAHtBQEAAAAB8gUCAAAAAQNGAADsEgAg9wYAAO0SACD9BgAAAQAgBEYAANANADD3BgAA0Q0AMPkGAADTDQAg_QYAANQNADAAAAAAAAAFRgAA4RIAIEcAAOoSACD3BgAA4hIAIPgGAADpEgAg_QYAAAEAIAVGAADfEgAgRwAA5xIAIPcGAADgEgAg-AYAAOYSACD9BgAAGQAgB0YAAN0SACBHAADkEgAg9wYAAN4SACD4BgAA4xIAIPsGAABVACD8BgAAVQAg_QYAAAEAIANGAADhEgAg9wYAAOISACD9BgAAAQAgA0YAAN8SACD3BgAA4BIAIP0GAAAZACADRgAA3RIAIPcGAADeEgAg_QYAAAEAIAAAAAAAB0YAAM8SACBHAADbEgAg9wYAANASACD4BgAA2hIAIPsGAAAXACD8BgAAFwAg_QYAABkAIAdGAADNEgAgRwAA2BIAIPcGAADOEgAg-AYAANcSACD7BgAAIAAg_AYAACAAIP0GAABOACAHRgAAyxIAIEcAANUSACD3BgAAzBIAIPgGAADUEgAg-wYAACMAIPwGAAAjACD9BgAAJQAgB0YAAMkSACBHAADSEgAg9wYAAMoSACD4BgAA0RIAIPsGAAARACD8BgAAEQAg_QYAABUAIANGAADPEgAg9wYAANASACD9BgAAGQAgA0YAAM0SACD3BgAAzhIAIP0GAABOACADRgAAyxIAIPcGAADMEgAg_QYAACUAIANGAADJEgAg9wYAAMoSACD9BgAAFQAgAAAAAAAFRgAAvxIAIEcAAMcSACD3BgAAwBIAIPgGAADGEgAg_QYAAE4AIAtGAACsDgAwRwAAsA4AMPcGAACtDgAw-AYAAK4OADD5BgAArw4AIPoGAADUDQAw-wYAANQNADD8BgAA1A0AMP0GAADUDQAw_gYAALEOADD_BgAA1w0AMAtGAACjDgAwRwAApw4AMPcGAACkDgAw-AYAAKUOADD5BgAApg4AIPoGAADtDAAw-wYAAO0MADD8BgAA7QwAMP0GAADtDAAw_gYAAKgOADD_BgAA8AwAMAtGAACXDgAwRwAAnA4AMPcGAACYDgAw-AYAAJkOADD5BgAAmg4AIPoGAACbDgAw-wYAAJsOADD8BgAAmw4AMP0GAACbDgAw_gYAAJ0OADD_BgAAng4AMAtGAACLDgAwRwAAkA4AMPcGAACMDgAw-AYAAI0OADD5BgAAjg4AIPoGAACPDgAw-wYAAI8OADD8BgAAjw4AMP0GAACPDgAw_gYAAJEOADD_BgAAkg4AMAtGAACCDgAwRwAAhg4AMPcGAACDDgAw-AYAAIQOADD5BgAAhQ4AIPoGAADvCwAw-wYAAO8LADD8BgAA7wsAMP0GAADvCwAw_gYAAIcOADD_BgAA8gsAMAQVAADkCwAgpQUBAAAAAa4FQAAAAAHsBQEAAAABAgAAADgAIEYAAIoOACADAAAAOAAgRgAAig4AIEcAAIkOACABPwAAxRIAMAIAAAA4ACA_AACJDgAgAgAAAPMLACA_AACIDgAgA6UFAQC2CgAhrgVAALkKACHsBQEAtgoAIQQVAADiCwAgpQUBALYKACGuBUAAuQoAIewFAQC2CgAhBBUAAOQLACClBQEAAAABrgVAAAAAAewFAQAAAAEKpQUBAAAAAa4FQAAAAAHxBQAAAPEFAvIFAgAAAAHzBQIAAAAB9AUCAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAECAAAANAAgRgAAlg4AIAMAAAA0ACBGAACWDgAgRwAAlQ4AIAE_AADEEgAwDxMAAJAKACCiBQAAkQoAMKMFAAAyABCkBQAAkQoAMKUFAQAAAAGuBUAA8wgAIe0FAQDyCAAh8QUAAJIK8QUi8gUCAIMJACHzBQIAgwkAIfQFAgCDCQAh9QUBAPcIACH2BQEA9wgAIfcFAQD3CAAh-AUBAPcIACECAAAANAAgPwAAlQ4AIAIAAACTDgAgPwAAlA4AIA6iBQAAkg4AMKMFAACTDgAQpAUAAJIOADClBQEA8ggAIa4FQADzCAAh7QUBAPIIACHxBQAAkgrxBSLyBQIAgwkAIfMFAgCDCQAh9AUCAIMJACH1BQEA9wgAIfYFAQD3CAAh9wUBAPcIACH4BQEA9wgAIQ6iBQAAkg4AMKMFAACTDgAQpAUAAJIOADClBQEA8ggAIa4FQADzCAAh7QUBAPIIACHxBQAAkgrxBSLyBQIAgwkAIfMFAgCDCQAh9AUCAIMJACH1BQEA9wgAIfYFAQD3CAAh9wUBAPcIACH4BQEA9wgAIQqlBQEAtgoAIa4FQAC5CgAh8QUAAIAM8QUi8gUCALwLACHzBQIAvAsAIfQFAgC8CwAh9QUBALcKACH2BQEAtwoAIfcFAQC3CgAh-AUBALcKACEKpQUBALYKACGuBUAAuQoAIfEFAACADPEFIvIFAgC8CwAh8wUCALwLACH0BQIAvAsAIfUFAQC3CgAh9gUBALcKACH3BQEAtwoAIfgFAQC3CgAhCqUFAQAAAAGuBUAAAAAB8QUAAADxBQLyBQIAAAAB8wUCAAAAAfQFAgAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAABDgkAAPMNACALAAD0DQAgGAAA9g0AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAHABgEAAAABAgAAAB0AIEYAAKIOACADAAAAHQAgRgAAog4AIEcAAKEOACABPwAAwxIAMBMJAADxCQAgCwAAngoAIA8AAJ8KACAYAACgCgAgogUAAJ0KADCjBQAAGwAQpAUAAJ0KADClBQEAAAABqgUBAPcIACGuBUAA8wgAIc8FQADzCAAh2gUBAPcIACHtBQEA9wgAIbsGAQDyCAAhvAYBAPcIACG9BgEA9wgAIb4GAgCDCQAhvwYgAIIJACHABgEA9wgAIQIAAAAdACA_AAChDgAgAgAAAJ8OACA_AACgDgAgD6IFAACeDgAwowUAAJ8OABCkBQAAng4AMKUFAQDyCAAhqgUBAPcIACGuBUAA8wgAIc8FQADzCAAh2gUBAPcIACHtBQEA9wgAIbsGAQDyCAAhvAYBAPcIACG9BgEA9wgAIb4GAgCDCQAhvwYgAIIJACHABgEA9wgAIQ-iBQAAng4AMKMFAACfDgAQpAUAAJ4OADClBQEA8ggAIaoFAQD3CAAhrgVAAPMIACHPBUAA8wgAIdoFAQD3CAAh7QUBAPcIACG7BgEA8ggAIbwGAQD3CAAhvQYBAPcIACG-BgIAgwkAIb8GIACCCQAhwAYBAPcIACELpQUBALYKACGqBQEAtwoAIa4FQAC5CgAhzwVAALkKACHaBQEAtwoAIbsGAQC2CgAhvAYBALcKACG9BgEAtwoAIb4GAgC8CwAhvwYgAO8KACHABgEAtwoAIQ4JAADvDQAgCwAA8A0AIBgAAPINACClBQEAtgoAIaoFAQC3CgAhrgVAALkKACHPBUAAuQoAIdoFAQC3CgAhuwYBALYKACG8BgEAtwoAIb0GAQC3CgAhvgYCALwLACG_BiAA7woAIcAGAQC3CgAhDgkAAPMNACALAAD0DQAgGAAA9g0AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAHABgEAAAABDREAALoNACClBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAECAAAALwAgRgAAqw4AIAMAAAAvACBGAACrDgAgRwAAqg4AIAE_AADCEgAwAgAAAC8AID8AAKoOACACAAAA8QwAID8AAKkOACAMpQUBALYKACGpBQEAtgoAIaoFAQC2CgAhrgVAALkKACHyBQIAvAsAIZsGAQC2CgAhnAYBALYKACGdBgEAtwoAIZ4GgAAAAAGfBhAAlwwAIaAGEACXDAAhoQYQAJcMACENEQAAuQ0AIKUFAQC2CgAhqQUBALYKACGqBQEAtgoAIa4FQAC5CgAh8gUCALwLACGbBgEAtgoAIZwGAQC2CgAhnQYBALcKACGeBoAAAAABnwYQAJcMACGgBhAAlwwAIaEGEACXDAAhDREAALoNACClBQEAAAABqQUBAAAAAaoFAQAAAAGuBUAAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAEGDgAAyQ0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAfIFAgAAAAGyBgEAAAABAgAAACkAIEYAALQOACADAAAAKQAgRgAAtA4AIEcAALMOACABPwAAwRIAMAIAAAApACA_AACzDgAgAgAAANgNACA_AACyDgAgBaUFAQC2CgAhrgVAALkKACHPBUAAuQoAIfIFAgC8CwAhsgYBALYKACEGDgAAxw0AIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIfIFAgC8CwAhsgYBALYKACEGDgAAyQ0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAfIFAgAAAAGyBgEAAAABA0YAAL8SACD3BgAAwBIAIP0GAABOACAERgAArA4AMPcGAACtDgAw-QYAAK8OACD9BgAA1A0AMARGAACjDgAw9wYAAKQOADD5BgAApg4AIP0GAADtDAAwBEYAAJcOADD3BgAAmA4AMPkGAACaDgAg_QYAAJsOADAERgAAiw4AMPcGAACMDgAw-QYAAI4OACD9BgAAjw4AMARGAACCDgAw9wYAAIMOADD5BgAAhQ4AIP0GAADvCwAwAAAABUYAALgSACBHAAC9EgAg9wYAALkSACD4BgAAvBIAIP0GAAAZACALRgAAzQ4AMEcAANEOADD3BgAAzg4AMPgGAADPDgAw-QYAANAOACD6BgAAmw4AMPsGAACbDgAw_AYAAJsOADD9BgAAmw4AMP4GAADSDgAw_wYAAJ4OADALRgAAwQ4AMEcAAMYOADD3BgAAwg4AMPgGAADDDgAw-QYAAMQOACD6BgAAxQ4AMPsGAADFDgAw_AYAAMUOADD9BgAAxQ4AMP4GAADHDgAw_wYAAMgOADAPCgAAuA4AIBAAALYOACASAAC3DgAgFAAAuQ4AIBYAALoOACClBQEAAAABrgVAAAAAAc8FQAAAAAGFBiAAAAABwgYBAAAAAcMGAQAAAAHEBhAAAAABxQYQAAAAAcYGEAAAAAHHBgIAAAABAgAAACUAIEYAAMwOACADAAAAJQAgRgAAzA4AIEcAAMsOACABPwAAuxIAMBUKAACHCgAgCwAAmgoAIBAAAL4JACASAACbCgAgFAAAnAoAIBYAAIoJACCiBQAAmQoAMKMFAAAjABCkBQAAmQoAMKUFAQAAAAGuBUAA8wgAIc8FQADzCAAhhQYgAIIJACHBBgEA8ggAIcIGAQAAAAHDBgEA9wgAIcQGEACdCQAhxQYQAJ4JACHGBhAAngkAIccGAgCDCQAh8gYAAJgKACACAAAAJQAgPwAAyw4AIAIAAADJDgAgPwAAyg4AIA6iBQAAyA4AMKMFAADJDgAQpAUAAMgOADClBQEA8ggAIa4FQADzCAAhzwVAAPMIACGFBiAAggkAIcEGAQDyCAAhwgYBAPIIACHDBgEA9wgAIcQGEACdCQAhxQYQAJ4JACHGBhAAngkAIccGAgCDCQAhDqIFAADIDgAwowUAAMkOABCkBQAAyA4AMKUFAQDyCAAhrgVAAPMIACHPBUAA8wgAIYUGIACCCQAhwQYBAPIIACHCBgEA8ggAIcMGAQD3CAAhxAYQAJ0JACHFBhAAngkAIcYGEACeCQAhxwYCAIMJACEKpQUBALYKACGuBUAAuQoAIc8FQAC5CgAhhQYgAO8KACHCBgEAtgoAIcMGAQC3CgAhxAYQAJcMACHFBhAAmAwAIcYGEACYDAAhxwYCALwLACEPCgAA_w0AIBAAAP0NACASAAD-DQAgFAAAgA4AIBYAAIEOACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACGFBiAA7woAIcIGAQC2CgAhwwYBALcKACHEBhAAlwwAIcUGEACYDAAhxgYQAJgMACHHBgIAvAsAIQ8KAAC4DgAgEAAAtg4AIBIAALcOACAUAAC5DgAgFgAAug4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAYUGIAAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAEOCQAA8w0AIA8AAPUNACAYAAD2DQAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHtBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAECAAAAHQAgRgAA1Q4AIAMAAAAdACBGAADVDgAgRwAA1A4AIAE_AAC6EgAwAgAAAB0AID8AANQOACACAAAAnw4AID8AANMOACALpQUBALYKACGqBQEAtwoAIa4FQAC5CgAhzwVAALkKACHaBQEAtwoAIe0FAQC3CgAhuwYBALYKACG8BgEAtwoAIb0GAQC3CgAhvgYCALwLACG_BiAA7woAIQ4JAADvDQAgDwAA8Q0AIBgAAPINACClBQEAtgoAIaoFAQC3CgAhrgVAALkKACHPBUAAuQoAIdoFAQC3CgAh7QUBALcKACG7BgEAtgoAIbwGAQC3CgAhvQYBALcKACG-BgIAvAsAIb8GIADvCgAhDgkAAPMNACAPAAD1DQAgGAAA9g0AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAAB7QUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABA0YAALgSACD3BgAAuRIAIP0GAAAZACAERgAAzQ4AMPcGAADODgAw-QYAANAOACD9BgAAmw4AMARGAADBDgAw9wYAAMIOADD5BgAAxA4AIP0GAADFDgAwAAAAAAAHRgAApxIAIEcAALYSACD3BgAAqBIAIPgGAAC1EgAg-wYAABEAIPwGAAARACD9BgAAFQAgC0YAAKcPADBHAACsDwAw9wYAAKgPADD4BgAAqQ8AMPkGAACqDwAg-gYAAKsPADD7BgAAqw8AMPwGAACrDwAw_QYAAKsPADD-BgAArQ8AMP8GAACuDwAwC0YAAJ4PADBHAACiDwAw9wYAAJ8PADD4BgAAoA8AMPkGAAChDwAg-gYAAJsOADD7BgAAmw4AMPwGAACbDgAw_QYAAJsOADD-BgAAow8AMP8GAACeDgAwC0YAAJIPADBHAACXDwAw9wYAAJMPADD4BgAAlA8AMPkGAACVDwAg-gYAAJYPADD7BgAAlg8AMPwGAACWDwAw_QYAAJYPADD-BgAAmA8AMP8GAACZDwAwC0YAAIQPADBHAACJDwAw9wYAAIUPADD4BgAAhg8AMPkGAACHDwAg-gYAAIgPADD7BgAAiA8AMPwGAACIDwAw_QYAAIgPADD-BgAAig8AMP8GAACLDwAwC0YAAPgOADBHAAD9DgAw9wYAAPkOADD4BgAA-g4AMPkGAAD7DgAg-gYAAPwOADD7BgAA_A4AMPwGAAD8DgAw_QYAAPwOADD-BgAA_g4AMP8GAAD_DgAwC0YAAO8OADBHAADzDgAw9wYAAPAOADD4BgAA8Q4AMPkGAADyDgAg-gYAALMMADD7BgAAswwAMPwGAACzDAAw_QYAALMMADD-BgAA9A4AMP8GAAC2DAAwC0YAAOYOADBHAADqDgAw9wYAAOcOADD4BgAA6A4AMPkGAADpDgAg-gYAAI8NADD7BgAAjw0AMPwGAACPDQAw_QYAAI8NADD-BgAA6w4AMP8GAACSDQAwAgUAAI8MACD5BQEAAAABAgAAAA8AIEYAAO4OACADAAAADwAgRgAA7g4AIEcAAO0OACABPwAAtBIAMAIAAAAPACA_AADtDgAgAgAAAJMNACA_AADsDgAgAfkFAQC2CgAhAgUAAI0MACD5BQEAtgoAIQIFAACPDAAg-QUBAAAAAQsDAAC9CgAgEQAAvgoAIKUFAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQIAAABkACBGAAD3DgAgAwAAAGQAIEYAAPcOACBHAAD2DgAgAT8AALMSADACAAAAZAAgPwAA9g4AIAIAAAC3DAAgPwAA9Q4AIAmlBQEAtgoAIaYFAQC2CgAhpwUBALcKACGoBQEAtwoAIakFAQC3CgAhqwUIALgKACGsBQEAtwoAIa0FgAAAAAGuBUAAuQoAIQsDAAC6CgAgEQAAuwoAIKUFAQC2CgAhpgUBALYKACGnBQEAtwoAIagFAQC3CgAhqQUBALcKACGrBQgAuAoAIawFAQC3CgAhrQWAAAAAAa4FQAC5CgAhCwMAAL0KACARAAC-CgAgpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABCAMAAM4KACClBQEAAAABpwUBAAAAAagFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABAgAAAF8AIEYAAIMPACADAAAAXwAgRgAAgw8AIEcAAIIPACABPwAAshIAMA0DAADaCQAgCQAA8wkAIKIFAADyCQAwowUAAF0AEKQFAADyCQAwpQUBAAAAAacFAQD3CAAhqAUBAPcIACGqBQEA8ggAIcMFAQD3CAAhxAUBAPcIACHFBQEA9wgAIcYFQADzCAAhAgAAAF8AID8AAIIPACACAAAAgA8AID8AAIEPACALogUAAP8OADCjBQAAgA8AEKQFAAD_DgAwpQUBAPIIACGnBQEA9wgAIagFAQD3CAAhqgUBAPIIACHDBQEA9wgAIcQFAQD3CAAhxQUBAPcIACHGBUAA8wgAIQuiBQAA_w4AMKMFAACADwAQpAUAAP8OADClBQEA8ggAIacFAQD3CAAhqAUBAPcIACGqBQEA8ggAIcMFAQD3CAAhxAUBAPcIACHFBQEA9wgAIcYFQADzCAAhB6UFAQC2CgAhpwUBALcKACGoBQEAtwoAIcMFAQC3CgAhxAUBALcKACHFBQEAtwoAIcYFQAC5CgAhCAMAAMwKACClBQEAtgoAIacFAQC3CgAhqAUBALcKACHDBQEAtwoAIcQFAQC3CgAhxQUBALcKACHGBUAAuQoAIQgDAADOCgAgpQUBAAAAAacFAQAAAAGoBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAQMdAACRDwAgrgVAAAAAAdkFAQAAAAECAAAAWQAgRgAAkA8AIAMAAABZACBGAACQDwAgRwAAjg8AIAE_AACxEgAwCQkAAPMJACAdAAD2CQAgogUAAPUJADCjBQAAVwAQpAUAAPUJADCqBQEA8ggAIa4FQADzCAAh2QUBAPIIACHtBgAA9AkAIAIAAABZACA_AACODwAgAgAAAIwPACA_AACNDwAgBqIFAACLDwAwowUAAIwPABCkBQAAiw8AMKoFAQDyCAAhrgVAAPMIACHZBQEA8ggAIQaiBQAAiw8AMKMFAACMDwAQpAUAAIsPADCqBQEA8ggAIa4FQADzCAAh2QUBAPIIACECrgVAALkKACHZBQEAtgoAIQMdAACPDwAgrgVAALkKACHZBQEAtgoAIQVGAACsEgAgRwAArxIAIPcGAACtEgAg-AYAAK4SACD9BgAA2gIAIAMdAACRDwAgrgVAAAAAAdkFAQAAAAEDRgAArBIAIPcGAACtEgAg_QYAANoCACAQAwAA5w0AIBsAAOkNACClBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABugYBAAAAAQIAAABTACBGAACdDwAgAwAAAFMAIEYAAJ0PACBHAACcDwAgAT8AAKsSADAWAwAAiQkAIAkAAPMJACAbAADaCQAgogUAAIUKADCjBQAAUQAQpAUAAIUKADClBQEAAAABpwUBAPIIACGqBQEA8ggAIa4FQADzCAAhzwVAAPMIACHXBSAAggkAIeEFAQD3CAAhswYCAIMJACG0BgEA9wgAIbUGIACCCQAhtgYCAIMJACG3BgIAgwkAIbgGAQD3CAAhuQZAAIEJACG6BgEA9wgAIe4GAACECgAgAgAAAFMAID8AAJwPACACAAAAmg8AID8AAJsPACASogUAAJkPADCjBQAAmg8AEKQFAACZDwAwpQUBAPIIACGnBQEA8ggAIaoFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdcFIACCCQAh4QUBAPcIACGzBgIAgwkAIbQGAQD3CAAhtQYgAIIJACG2BgIAgwkAIbcGAgCDCQAhuAYBAPcIACG5BkAAgQkAIboGAQD3CAAhEqIFAACZDwAwowUAAJoPABCkBQAAmQ8AMKUFAQDyCAAhpwUBAPIIACGqBQEA8ggAIa4FQADzCAAhzwVAAPMIACHXBSAAggkAIeEFAQD3CAAhswYCAIMJACG0BgEA9wgAIbUGIACCCQAhtgYCAIMJACG3BgIAgwkAIbgGAQD3CAAhuQZAAIEJACG6BgEA9wgAIQ6lBQEAtgoAIacFAQC2CgAhrgVAALkKACHPBUAAuQoAIdcFIADvCgAh4QUBALcKACGzBgIAvAsAIbQGAQC3CgAhtQYgAO8KACG2BgIAvAsAIbcGAgC8CwAhuAYBALcKACG5BkAAuwsAIboGAQC3CgAhEAMAAOQNACAbAADmDQAgpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzwVAALkKACHXBSAA7woAIeEFAQC3CgAhswYCALwLACG0BgEAtwoAIbUGIADvCgAhtgYCALwLACG3BgIAvAsAIbgGAQC3CgAhuQZAALsLACG6BgEAtwoAIRADAADnDQAgGwAA6Q0AIKUFAQAAAAGnBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAG6BgEAAAABDgsAAPQNACAPAAD1DQAgGAAA9g0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHtBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAHABgEAAAABAgAAAB0AIEYAAKYPACADAAAAHQAgRgAApg8AIEcAAKUPACABPwAAqhIAMAIAAAAdACA_AAClDwAgAgAAAJ8OACA_AACkDwAgC6UFAQC2CgAhrgVAALkKACHPBUAAuQoAIdoFAQC3CgAh7QUBALcKACG7BgEAtgoAIbwGAQC3CgAhvQYBALcKACG-BgIAvAsAIb8GIADvCgAhwAYBALcKACEOCwAA8A0AIA8AAPENACAYAADyDQAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2gUBALcKACHtBQEAtwoAIbsGAQC2CgAhvAYBALcKACG9BgEAtwoAIb4GAgC8CwAhvwYgAO8KACHABgEAtwoAIQ4LAAD0DQAgDwAA9Q0AIBgAAPYNACClBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAAB7QUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABwAYBAAAAAQcKAADXDgAgFwAA2A4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAeEFAQAAAAGFBiAAAAABAgAAAE4AIEYAALIPACADAAAATgAgRgAAsg8AIEcAALEPACABPwAAqRIAMAwJAADzCQAgCgAAhwoAIBcAAIgKACCiBQAAhgoAMKMFAAAgABCkBQAAhgoAMKUFAQAAAAGqBQEA8ggAIa4FQADzCAAhzwVAAPMIACHhBQEA8ggAIYUGIACCCQAhAgAAAE4AID8AALEPACACAAAArw8AID8AALAPACAJogUAAK4PADCjBQAArw8AEKQFAACuDwAwpQUBAPIIACGqBQEA8ggAIa4FQADzCAAhzwVAAPMIACHhBQEA8ggAIYUGIACCCQAhCaIFAACuDwAwowUAAK8PABCkBQAArg8AMKUFAQDyCAAhqgUBAPIIACGuBUAA8wgAIc8FQADzCAAh4QUBAPIIACGFBiAAggkAIQWlBQEAtgoAIa4FQAC5CgAhzwVAALkKACHhBQEAtgoAIYUGIADvCgAhBwoAAL8OACAXAADADgAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh4QUBALYKACGFBiAA7woAIQcKAADXDgAgFwAA2A4AIKUFAQAAAAGuBUAAAAABzwVAAAAAAeEFAQAAAAGFBiAAAAABA0YAAKcSACD3BgAAqBIAIP0GAAAVACAERgAApw8AMPcGAACoDwAw-QYAAKoPACD9BgAAqw8AMARGAACeDwAw9wYAAJ8PADD5BgAAoQ8AIP0GAACbDgAwBEYAAJIPADD3BgAAkw8AMPkGAACVDwAg_QYAAJYPADAERgAAhA8AMPcGAACFDwAw-QYAAIcPACD9BgAAiA8AMARGAAD4DgAw9wYAAPkOADD5BgAA-w4AIP0GAAD8DgAwBEYAAO8OADD3BgAA8A4AMPkGAADyDgAg_QYAALMMADAERgAA5g4AMPcGAADnDgAw-QYAAOkOACD9BgAAjw0AMAAAAAVGAACiEgAgRwAApRIAIPcGAACjEgAg-AYAAKQSACD9BgAAGQAgA0YAAKISACD3BgAAoxIAIP0GAAAZACAAAAALRgAAxA8AMEcAAMgPADD3BgAAxQ8AMPgGAADGDwAw-QYAAMcPACD6BgAAiA8AMPsGAACIDwAw_AYAAIgPADD9BgAAiA8AMP4GAADJDwAw_wYAAIsPADADCQAAvw8AIKoFAQAAAAGuBUAAAAABAgAAAFkAIEYAAMwPACADAAAAWQAgRgAAzA8AIEcAAMsPACABPwAAoRIAMAIAAABZACA_AADLDwAgAgAAAIwPACA_AADKDwAgAqoFAQC2CgAhrgVAALkKACEDCQAAvg8AIKoFAQC2CgAhrgVAALkKACEDCQAAvw8AIKoFAQAAAAGuBUAAAAABBEYAAMQPADD3BgAAxQ8AMPkGAADHDwAg_QYAAIgPADAAAAAAAAAHRgAAmBIAIEcAAJ8SACD3BgAAmRIAIPgGAACeEgAg-wYAABEAIPwGAAARACD9BgAAFQAgC0YAAPcPADBHAAD8DwAw9wYAAPgPADD4BgAA-Q8AMPkGAAD6DwAg-gYAAPsPADD7BgAA-w8AMPwGAAD7DwAw_QYAAPsPADD-BgAA_Q8AMP8GAAD-DwAwC0YAAOsPADBHAADwDwAw9wYAAOwPADD4BgAA7Q8AMPkGAADuDwAg-gYAAO8PADD7BgAA7w8AMPwGAADvDwAw_QYAAO8PADD-BgAA8Q8AMP8GAADyDwAwC0YAAOIPADBHAADmDwAw9wYAAOMPADD4BgAA5A8AMPkGAADlDwAg-gYAAJsOADD7BgAAmw4AMPwGAACbDgAw_QYAAJsOADD-BgAA5w8AMP8GAACeDgAwC0YAANkPADBHAADdDwAw9wYAANoPADD4BgAA2w8AMPkGAADcDwAg-gYAAIMNADD7BgAAgw0AMPwGAACDDQAw_QYAAIMNADD-BgAA3g8AMP8GAACGDQAwAgUAAIgMACD5BQEAAAABAgAAAEcAIEYAAOEPACADAAAARwAgRgAA4Q8AIEcAAOAPACABPwAAnRIAMAIAAABHACA_AADgDwAgAgAAAIcNACA_AADfDwAgAfkFAQC2CgAhAgUAAIYMACD5BQEAtgoAIQIFAACIDAAg-QUBAAAAAQ4JAADzDQAgCwAA9A0AIA8AAPUNACClBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB7QUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABwAYBAAAAAQIAAAAdACBGAADqDwAgAwAAAB0AIEYAAOoPACBHAADpDwAgAT8AAJwSADACAAAAHQAgPwAA6Q8AIAIAAACfDgAgPwAA6A8AIAulBQEAtgoAIaoFAQC3CgAhrgVAALkKACHPBUAAuQoAIe0FAQC3CgAhuwYBALYKACG8BgEAtwoAIb0GAQC3CgAhvgYCALwLACG_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_w8AID8AAIAQACAQogUAAP4PADCjBQAA_w8AEKQFAAD-DwAwpQUBAPIIACGuBUAA8wgAIc8FQADzCAAh2AUBAPcIACHbBQEA8ggAIdwFAQDyCAAh4AUBAPcIACHoBQEA9wgAIekFAQD3CAAh6gUBAPcIACGFBiAAggkAIb4GAgCDCQAhzgYBAPcIACEQogUAAP4PADCjBQAA_w8AEKQFAAD-DwAwpQUBAPIIACGuBUAA8wgAIc8FQADzCAAh2AUBAPcIACHbBQEA8ggAIdwFAQDyCAAh4AUBAPcIACHoBQEA9wgAIekFAQD3CAAh6gUBAPcIACGFBiAAggkAIb4GAgCDCQAhzgYBAPcIACEMpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2wUBALYKACHcBQEAtgoAIeAFAQC3CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACG-BgIAvAsAIc4GAQC3CgAhEAcAANUPACAIAADWDwAgCgAA1w8AIBkAANgPACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHbBQEAtgoAIdwFAQC2CgAh4AUBALcKACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACGFBiAA7woAIb4GAgC8CwAhzgYBALcKACEQBwAAgxAAIAgAAIQQACAKAACFEAAgGQAAhhAAIKUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAG-BgIAAAABzgYBAAAAAQRGAAD3DwAw9wYAAPgPADD5BgAA-g8AIP0GAAD7DwAwBEYAAOsPADD3BgAA7A8AMPkGAADuDwAg_QYAAO8PADAERgAA4g8AMPcGAADjDwAw-QYAAOUPACD9BgAAmw4AMARGAADZDwAw9wYAANoPADD5BgAA3A8AIP0GAACDDQAwA0YAAJgSACD3BgAAmRIAIP0GAAAVACAAAAAFRgAAkhIAIEcAAJYSACD3BgAAkxIAIPgGAACVEgAg_QYAAAEAIAtGAACNEAAwRwAAkRAAMPcGAACOEAAw-AYAAI8QADD5BgAAkBAAIPoGAACgDAAw-wYAAKAMADD8BgAAoAwAMP0GAACgDAAw_gYAAJIQADD_BgAAowwAMB0DAAD4DAAgBQAAwQ0AIAwAAPoMACAgAAD-DAAgJAAA-wwAICUAAPwMACAoAAD9DAAgpQUBAAAAAacFAQAAAAGuBUAAAAABzgUAAACaBgLPBUAAAAAB-QUBAAAAAaEGEAAAAAGiBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAECAAAACQAgRgAAlRAAIAMAAAAJACBGAACVEAAgRwAAlBAAIAE_AACUEgAwAgAAAAkAID8AAJQQACACAAAApAwAID8AAJMQACAWpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzgUAAKYMmgYizwVAALkKACH5BQEAtwoAIaEGEACXDAAhogYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACEdAwAAqAwAIAUAAMANACAMAACqDAAgIAAArgwAICQAAKsMACAlAACsDAAgKAAArQwAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhpAaAAAAAAaUGAQC3CgAhpgYBALcKACGnBhAAlwwAIagGEACXDAAhqQYQAJcMACGqBhAAlwwAIasGAQC3CgAhrAZAALkKACGtBkAAuwsAIa4GQAC7CwAhrwZAALsLACGwBkAAuwsAIbEGQAC7CwAhHQMAAPgMACAFAADBDQAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQNGAACSEgAg9wYAAJMSACD9BgAAAQAgBEYAAI0QADD3BgAAjhAAMPkGAACQEAAg_QYAAKAMADAAAAAFRgAAjRIAIEcAAJASACD3BgAAjhIAIPgGAACPEgAg_QYAAAEAIANGAACNEgAg9wYAAI4SACD9BgAAAQAgAAAABUYAAIgSACBHAACLEgAg9wYAAIkSACD4BgAAihIAIP0GAAABACADRgAAiBIAIPcGAACJEgAg_QYAAAEAIAAAAAVGAACDEgAgRwAAhhIAIPcGAACEEgAg-AYAAIUSACD9BgAAAQAgA0YAAIMSACD3BgAAhBIAIP0GAAABACAAAAAB-gYAAADnBgILRgAAuBEAMEcAAL0RADD3BgAAuREAMPgGAAC6EQAw-QYAALsRACD6BgAAvBEAMPsGAAC8EQAw_AYAALwRADD9BgAAvBEAMP4GAAC-EQAw_wYAAL8RADALRgAArBEAMEcAALERADD3BgAArREAMPgGAACuEQAw-QYAAK8RACD6BgAAsBEAMPsGAACwEQAw_AYAALARADD9BgAAsBEAMP4GAACyEQAw_wYAALMRADALRgAAoBEAMEcAAKURADD3BgAAoREAMPgGAACiEQAw-QYAAKMRACD6BgAApBEAMPsGAACkEQAw_AYAAKQRADD9BgAApBEAMP4GAACmEQAw_wYAAKcRADAHRgAAmxEAIEcAAJ4RACD3BgAAnBEAIPgGAACdEQAg-wYAAJQBACD8BgAAlAEAIP0GAACUAgAgC0YAAJIRADBHAACWEQAw9wYAAJMRADD4BgAAlBEAMPkGAACVEQAg-gYAAJYPADD7BgAAlg8AMPwGAACWDwAw_QYAAJYPADD-BgAAlxEAMP8GAACZDwAwC0YAAIkRADBHAACNEQAw9wYAAIoRADD4BgAAixEAMPkGAACMEQAg-gYAAKAMADD7BgAAoAwAMPwGAACgDAAw_QYAAKAMADD-BgAAjhEAMP8GAACjDAAwB0YAAIQRACBHAACHEQAg9wYAAIURACD4BgAAhhEAIPsGAACYAQAg_AYAAJgBACD9BgAAgwQAIAtGAAD7EAAwRwAA_xAAMPcGAAD8EAAw-AYAAP0QADD5BgAA_hAAIPoGAADiCgAw-wYAAOIKADD8BgAA4goAMP0GAADiCgAw_gYAAIARADD_BgAA5QoAMAtGAADvEAAwRwAA9BAAMPcGAADwEAAw-AYAAPEQADD5BgAA8hAAIPoGAADzEAAw-wYAAPMQADD8BgAA8xAAMP0GAADzEAAw_gYAAPUQADD_BgAA9hAAMAtGAADmEAAwRwAA6hAAMPcGAADnEAAw-AYAAOgQADD5BgAA6RAAIPoGAACWDwAw-wYAAJYPADD8BgAAlg8AMP0GAACWDwAw_gYAAOsQADD_BgAAmQ8AMAtGAADdEAAwRwAA4RAAMPcGAADeEAAw-AYAAN8QADD5BgAA4BAAIPoGAAD8DgAw-wYAAPwOADD8BgAA_A4AMP0GAAD8DgAw_gYAAOIQADD_BgAA_w4AMAtGAADREAAwRwAA1hAAMPcGAADSEAAw-AYAANMQADD5BgAA1BAAIPoGAADVEAAw-wYAANUQADD8BgAA1RAAMP0GAADVEAAw_gYAANcQADD_BgAA2BAAMAtGAADIEAAwRwAAzBAAMPcGAADJEAAw-AYAAMoQADD5BgAAyxAAIPoGAAD4CgAw-wYAAPgKADD8BgAA-AoAMP0GAAD4CgAw_gYAAM0QADD_BgAA-woAMAtGAAC_EAAwRwAAwxAAMPcGAADAEAAw-AYAAMEQADD5BgAAwhAAIPoGAACzDAAw-wYAALMMADD8BgAAswwAMP0GAACzDAAw_gYAAMQQADD_BgAAtgwAMAdGAAC6EAAgRwAAvRAAIPcGAAC7EAAg-AYAALwQACD7BgAAxAEAIPwGAADEAQAg_QYAAJMGACAHDAAA-AsAIKUFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHuBSAAAAAB7wUBAAAAAQIAAACTBgAgRgAAuhAAIAMAAADEAQAgRgAAuhAAIEcAAL4QACAJAAAAxAEAIAwAAOoLACA_AAC-EAAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2wUBALYKACHuBSAA7woAIe8FAQC3CgAhBwwAAOoLACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHbBQEAtgoAIe4FIADvCgAh7wUBALcKACELCQAAvwoAIBEAAL4KACClBQEAAAABpgUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFCAAAAAGsBQEAAAABrQWAAAAAAa4FQAAAAAECAAAAZAAgRgAAxxAAIAMAAABkACBGAADHEAAgRwAAxhAAIAE_AACCEgAwAgAAAGQAID8AAMYQACACAAAAtwwAID8AAMUQACAJpQUBALYKACGmBQEAtgoAIagFAQC3CgAhqQUBALcKACGqBQEAtwoAIasFCAC4CgAhrAUBALcKACGtBYAAAAABrgVAALkKACELCQAAvAoAIBEAALsKACClBQEAtgoAIaYFAQC2CgAhqAUBALcKACGpBQEAtwoAIaoFAQC3CgAhqwUIALgKACGsBQEAtwoAIa0FgAAAAAGuBUAAuQoAIQsJAAC_CgAgEQAAvgoAIKUFAQAAAAGmBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUIAAAAAawFAQAAAAGtBYAAAAABrgVAAAAAAQwGAACDCwAgNQAAgAsAIDgAAIILACClBQEAAAABrgVAAAAAAcsFAQAAAAHPBUAAAAAB1AUBAAAAAdUFAQAAAAHWBQEAAAAB1wUgAAAAAdgFAQAAAAECAAAArQEAIEYAANAQACADAAAArQEAIEYAANAQACBHAADPEAAgAT8AAIESADACAAAArQEAID8AAM8QACACAAAA_AoAID8AAM4QACAJpQUBALYKACGuBUAAuQoAIcsFAQC2CgAhzwVAALkKACHUBQEAtgoAIdUFAQC3CgAh1gUBALcKACHXBSAA7woAIdgFAQC3CgAhDAYAAPIKACA1AADwCgAgOAAA8woAIKUFAQC2CgAhrgVAALkKACHLBQEAtgoAIc8FQAC5CgAh1AUBALYKACHVBQEAtwoAIdYFAQC3CgAh1wUgAO8KACHYBQEAtwoAIQwGAACDCwAgNQAAgAsAIDgAAIILACClBQEAAAABrgVAAAAAAcsFAQAAAAHPBUAAAAAB1AUBAAAAAdUFAQAAAAHWBQEAAAAB1wUgAAAAAdgFAQAAAAEGpQUBAAAAAagFAQAAAAGuBUAAAAABwAUBAAAAAcEFAgAAAAHCBYAAAAABAgAAAKgBACBGAADcEAAgAwAAAKgBACBGAADcEAAgRwAA2xAAIAE_AACAEgAwCwMAANoJACCiBQAA3AkAMKMFAACmAQAQpAUAANwJADClBQEAAAABpwUBAPcIACGoBQEA9wgAIa4FQADzCAAhwAUBAPIIACHBBQIAnwkAIcIFAACECQAgAgAAAKgBACA_AADbEAAgAgAAANkQACA_AADaEAAgCqIFAADYEAAwowUAANkQABCkBQAA2BAAMKUFAQDyCAAhpwUBAPcIACGoBQEA9wgAIa4FQADzCAAhwAUBAPIIACHBBQIAnwkAIcIFAACECQAgCqIFAADYEAAwowUAANkQABCkBQAA2BAAMKUFAQDyCAAhpwUBAPcIACGoBQEA9wgAIa4FQADzCAAhwAUBAPIIACHBBQIAnwkAIcIFAACECQAgBqUFAQC2CgAhqAUBALcKACGuBUAAuQoAIcAFAQC2CgAhwQUCAMUKACHCBYAAAAABBqUFAQC2CgAhqAUBALcKACGuBUAAuQoAIcAFAQC2CgAhwQUCAMUKACHCBYAAAAABBqUFAQAAAAGoBQEAAAABrgVAAAAAAcAFAQAAAAHBBQIAAAABwgWAAAAAAQgJAADNCgAgpQUBAAAAAagFAQAAAAGqBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAQIAAABfACBGAADlEAAgAwAAAF8AIEYAAOUQACBHAADkEAAgAT8AAP8RADACAAAAXwAgPwAA5BAAIAIAAACADwAgPwAA4xAAIAelBQEAtgoAIagFAQC3CgAhqgUBALYKACHDBQEAtwoAIcQFAQC3CgAhxQUBALcKACHGBUAAuQoAIQgJAADLCgAgpQUBALYKACGoBQEAtwoAIaoFAQC2CgAhwwUBALcKACHEBQEAtwoAIcUFAQC3CgAhxgVAALkKACEICQAAzQoAIKUFAQAAAAGoBQEAAAABqgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAEQAwAA5w0AIAkAAOgNACClBQEAAAABpwUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdcFIAAAAAHhBQEAAAABswYCAAAAAbQGAQAAAAG1BiAAAAABtgYCAAAAAbcGAgAAAAG4BgEAAAABuQZAAAAAAQIAAABTACBGAADuEAAgAwAAAFMAIEYAAO4QACBHAADtEAAgAT8AAP4RADACAAAAUwAgPwAA7RAAIAIAAACaDwAgPwAA7BAAIA6lBQEAtgoAIacFAQC2CgAhqgUBALYKACGuBUAAuQoAIc8FQAC5CgAh1wUgAO8KACHhBQEAtwoAIbMGAgC8CwAhtAYBALcKACG1BiAA7woAIbYGAgC8CwAhtwYCALwLACG4BgEAtwoAIbkGQAC7CwAhEAMAAOQNACAJAADlDQAgpQUBALYKACGnBQEAtgoAIaoFAQC2CgAhrgVAALkKACHPBUAAuQoAIdcFIADvCgAh4QUBALcKACGzBgIAvAsAIbQGAQC3CgAhtQYgAO8KACG2BgIAvAsAIbcGAgC8CwAhuAYBALcKACG5BkAAuwsAIRADAADnDQAgCQAA6A0AIKUFAQAAAAGnBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABBy4AAOsKACClBQEAAAABrgVAAAAAAc4FAAAA0wUCzwVAAAAAAdEFAQAAAAHTBQEAAAABAgAAAKIBACBGAAD6EAAgAwAAAKIBACBGAAD6EAAgRwAA-RAAIAE_AAD9EQAwDC0AAIkJACAuAADfCQAgogUAAN0JADCjBQAAoAEAEKQFAADdCQAwpQUBAAAAAa4FQADzCAAhzgUAAN4J0wUizwVAAPMIACHQBQEA8ggAIdEFAQDyCAAh0wUBAPcIACECAAAAogEAID8AAPkQACACAAAA9xAAID8AAPgQACAKogUAAPYQADCjBQAA9xAAEKQFAAD2EAAwpQUBAPIIACGuBUAA8wgAIc4FAADeCdMFIs8FQADzCAAh0AUBAPIIACHRBQEA8ggAIdMFAQD3CAAhCqIFAAD2EAAwowUAAPcQABCkBQAA9hAAMKUFAQDyCAAhrgVAAPMIACHOBQAA3gnTBSLPBUAA8wgAIdAFAQDyCAAh0QUBAPIIACHTBQEA9wgAIQalBQEAtgoAIa4FQAC5CgAhzgUAANsK0wUizwVAALkKACHRBQEAtgoAIdMFAQC3CgAhBy4AAN0KACClBQEAtgoAIa4FQAC5CgAhzgUAANsK0wUizwVAALkKACHRBQEAtgoAIdMFAQC3CgAhBy4AAOsKACClBQEAAAABrgVAAAAAAc4FAAAA0wUCzwVAAAAAAdEFAQAAAAHTBQEAAAABCS8AANYKACClBQEAAAABrgVAAAAAAccFAQAAAAHKBQAAAMoFAssFAQAAAAHMBYAAAAABzgUAAADOBQLPBUAAAAABAgAAAJwBACBGAACDEQAgAwAAAJwBACBGAACDEQAgRwAAghEAIAE_AAD8EQAwAgAAAJwBACA_AACCEQAgAgAAAOYKACA_AACBEQAgCKUFAQC2CgAhrgVAALkKACHHBQEAtgoAIcoFAADSCsoFIssFAQC2CgAhzAWAAAAAAc4FAADTCs4FIs8FQAC5CgAhCS8AANQKACClBQEAtgoAIa4FQAC5CgAhxwUBALYKACHKBQAA0grKBSLLBQEAtgoAIcwFgAAAAAHOBQAA0wrOBSLPBUAAuQoAIQkvAADWCgAgpQUBAAAAAa4FQAAAAAHHBQEAAAABygUAAADKBQLLBQEAAAABzAWAAAAAAc4FAAAAzgUCzwVAAAAAAQQMAADdDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAABAgAAAIMEACBGAACEEQAgAwAAAJgBACBGAACEEQAgRwAAiBEAIAYAAACYAQAgDAAAzw0AID8AAIgRACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACEEDAAAzw0AIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIR0EAAD5DAAgBQAAwQ0AIAwAAPoMACAgAAD-DAAgJAAA-wwAICUAAPwMACAoAAD9DAAgpQUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAECAAAACQAgRgAAkREAIAMAAAAJACBGAACREQAgRwAAkBEAIAE_AAD7EQAwAgAAAAkAID8AAJARACACAAAApAwAID8AAI8RACAWpQUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhowYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACEdBAAAqQwAIAUAAMANACAMAACqDAAgIAAArgwAICQAAKsMACAlAACsDAAgKAAArQwAIKUFAQC2CgAhrgVAALkKACHOBQAApgyaBiLPBUAAuQoAIfkFAQC3CgAhoQYQAJcMACGiBgEAtgoAIaMGAQC2CgAhpAaAAAAAAaUGAQC3CgAhpgYBALcKACGnBhAAlwwAIagGEACXDAAhqQYQAJcMACGqBhAAlwwAIasGAQC3CgAhrAZAALkKACGtBkAAuwsAIa4GQAC7CwAhrwZAALsLACGwBkAAuwsAIbEGQAC7CwAhHQQAAPkMACAFAADBDQAgDAAA-gwAICAAAP4MACAkAAD7DAAgJQAA_AwAICgAAP0MACClBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAfkFAQAAAAGhBhAAAAABogYBAAAAAaMGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAARAJAADoDQAgGwAA6Q0AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHXBSAAAAAB4QUBAAAAAbMGAgAAAAG0BgEAAAABtQYgAAAAAbYGAgAAAAG3BgIAAAABuAYBAAAAAbkGQAAAAAG6BgEAAAABAgAAAFMAIEYAAJoRACADAAAAUwAgRgAAmhEAIEcAAJkRACABPwAA-hEAMAIAAABTACA_AACZEQAgAgAAAJoPACA_AACYEQAgDqUFAQC2CgAhqgUBALYKACGuBUAAuQoAIc8FQAC5CgAh1wUgAO8KACHhBQEAtwoAIbMGAgC8CwAhtAYBALcKACG1BiAA7woAIbYGAgC8CwAhtwYCALwLACG4BgEAtwoAIbkGQAC7CwAhugYBALcKACEQCQAA5Q0AIBsAAOYNACClBQEAtgoAIaoFAQC2CgAhrgVAALkKACHPBUAAuQoAIdcFIADvCgAh4QUBALcKACGzBgIAvAsAIbQGAQC3CgAhtQYgAO8KACG2BgIAvAsAIbcGAgC8CwAhuAYBALcKACG5BkAAuwsAIboGAQC3CgAhEAkAAOgNACAbAADpDQAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdcFIAAAAAHhBQEAAAABswYCAAAAAbQGAQAAAAG1BiAAAAABtgYCAAAAAbcGAgAAAAG4BgEAAAABuQZAAAAAAboGAQAAAAEEpQUBAAAAAa4FQAAAAAHPBUAAAAAB2AYBAAAAAQIAAACUAgAgRgAAmxEAIAMAAACUAQAgRgAAmxEAIEcAAJ8RACAGAAAAlAEAID8AAJ8RACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHYBgEAtgoAIQSlBQEAtgoAIa4FQAC5CgAhzwVAALkKACHYBgEAtgoAIQulBQEAAAABrgVAAAAAAc8FQAAAAAHZBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAAB3QZAAAAAAd4GAQAAAAHfBgEAAAAB4AYBAAAAAQIAAACSAQAgRgAAqxEAIAMAAACSAQAgRgAAqxEAIEcAAKoRACABPwAA-REAMBEDAACJCQAgogUAAOUJADCjBQAAkAEAEKQFAADlCQAwpQUBAAAAAacFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdkGAQDyCAAh2gYBAPIIACHbBgEA9wgAIdwGAQD3CAAh3QZAAIEJACHeBgEA9wgAId8GAQD3CAAh4AYBAPcIACHsBgAA5AkAIAIAAACSAQAgPwAAqhEAIAIAAACoEQAgPwAAqREAIA-iBQAApxEAMKMFAACoEQAQpAUAAKcRADClBQEA8ggAIacFAQDyCAAhrgVAAPMIACHPBUAA8wgAIdkGAQDyCAAh2gYBAPIIACHbBgEA9wgAIdwGAQD3CAAh3QZAAIEJACHeBgEA9wgAId8GAQD3CAAh4AYBAPcIACEPogUAAKcRADCjBQAAqBEAEKQFAACnEQAwpQUBAPIIACGnBQEA8ggAIa4FQADzCAAhzwVAAPMIACHZBgEA8ggAIdoGAQDyCAAh2wYBAPcIACHcBgEA9wgAId0GQACBCQAh3gYBAPcIACHfBgEA9wgAIeAGAQD3CAAhC6UFAQC2CgAhrgVAALkKACHPBUAAuQoAIdkGAQC2CgAh2gYBALYKACHbBgEAtwoAIdwGAQC3CgAh3QZAALsLACHeBgEAtwoAId8GAQC3CgAh4AYBALcKACELpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2QYBALYKACHaBgEAtgoAIdsGAQC3CgAh3AYBALcKACHdBkAAuwsAId4GAQC3CgAh3wYBALcKACHgBgEAtwoAIQulBQEAAAABrgVAAAAAAc8FQAAAAAHZBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAAB3QZAAAAAAd4GAQAAAAHfBgEAAAAB4AYBAAAAAQelBQEAAAABrgVAAAAAAcQFAQAAAAHPBUAAAAAB3QZAAAAAAeEGAQAAAAHiBgEAAAABAgAAAI4BACBGAAC3EQAgAwAAAI4BACBGAAC3EQAgRwAAthEAIAE_AAD4EQAwDAMAAIkJACCiBQAA5gkAMKMFAACMAQAQpAUAAOYJADClBQEAAAABpwUBAPIIACGuBUAA8wgAIcQFAQD3CAAhzwVAAPMIACHdBkAA8wgAIeEGAQAAAAHiBgEA9wgAIQIAAACOAQAgPwAAthEAIAIAAAC0EQAgPwAAtREAIAuiBQAAsxEAMKMFAAC0EQAQpAUAALMRADClBQEA8ggAIacFAQDyCAAhrgVAAPMIACHEBQEA9wgAIc8FQADzCAAh3QZAAPMIACHhBgEA8ggAIeIGAQD3CAAhC6IFAACzEQAwowUAALQRABCkBQAAsxEAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIcQFAQD3CAAhzwVAAPMIACHdBkAA8wgAIeEGAQDyCAAh4gYBAPcIACEHpQUBALYKACGuBUAAuQoAIcQFAQC3CgAhzwVAALkKACHdBkAAuQoAIeEGAQC2CgAh4gYBALcKACEHpQUBALYKACGuBUAAuQoAIcQFAQC3CgAhzwVAALkKACHdBkAAuQoAIeEGAQC2CgAh4gYBALcKACEHpQUBAAAAAa4FQAAAAAHEBQEAAAABzwVAAAAAAd0GQAAAAAHhBgEAAAAB4gYBAAAAAQ0jAACXEAAgpQUBAAAAAa4FQAAAAAHPBUAAAAABzwYBAAAAAdAGAQAAAAHRBgEAAAAB0gYBAAAAAdMGAQAAAAHUBgEAAAAB1QYBAAAAAdYGAQAAAAHXBiAAAAABAgAAAAUAIEYAAMMRACADAAAABQAgRgAAwxEAIEcAAMIRACABPwAA9xEAMBIDAACJCQAgIwAAogkAIKIFAACvCgAwowUAAAMAEKQFAACvCgAwpQUBAAAAAacFAQDyCAAhrgVAAPMIACHPBUAA8wgAIc8GAQD3CAAh0AYBAPcIACHRBgEA9wgAIdIGAQDyCAAh0wYBAPIIACHUBgEA9wgAIdUGAQD3CAAh1gYBAPIIACHXBiAAggkAIQIAAAAFACA_AADCEQAgAgAAAMARACA_AADBEQAgEKIFAAC_EQAwowUAAMARABCkBQAAvxEAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc8FQADzCAAhzwYBAPcIACHQBgEA9wgAIdEGAQD3CAAh0gYBAPIIACHTBgEA8ggAIdQGAQD3CAAh1QYBAPcIACHWBgEA8ggAIdcGIACCCQAhEKIFAAC_EQAwowUAAMARABCkBQAAvxEAMKUFAQDyCAAhpwUBAPIIACGuBUAA8wgAIc8FQADzCAAhzwYBAPcIACHQBgEA9wgAIdEGAQD3CAAh0gYBAPIIACHTBgEA8ggAIdQGAQD3CAAh1QYBAPcIACHWBgEA8ggAIdcGIACCCQAhDKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIc8GAQC3CgAh0AYBALcKACHRBgEAtwoAIdIGAQC2CgAh0wYBALYKACHUBgEAtwoAIdUGAQC3CgAh1gYBALYKACHXBiAA7woAIQ0jAACMEAAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAhzwYBALcKACHQBgEAtwoAIdEGAQC3CgAh0gYBALYKACHTBgEAtgoAIdQGAQC3CgAh1QYBALcKACHWBgEAtgoAIdcGIADvCgAhDSMAAJcQACClBQEAAAABrgVAAAAAAc8FQAAAAAHPBgEAAAAB0AYBAAAAAdEGAQAAAAHSBgEAAAAB0wYBAAAAAdQGAQAAAAHVBgEAAAAB1gYBAAAAAdcGIAAAAAEERgAAuBEAMPcGAAC5EQAw-QYAALsRACD9BgAAvBEAMARGAACsEQAw9wYAAK0RADD5BgAArxEAIP0GAACwEQAwBEYAAKARADD3BgAAoREAMPkGAACjEQAg_QYAAKQRADADRgAAmxEAIPcGAACcEQAg_QYAAJQCACAERgAAkhEAMPcGAACTEQAw-QYAAJURACD9BgAAlg8AMARGAACJEQAw9wYAAIoRADD5BgAAjBEAIP0GAACgDAAwA0YAAIQRACD3BgAAhREAIP0GAACDBAAgBEYAAPsQADD3BgAA_BAAMPkGAAD-EAAg_QYAAOIKADAERgAA7xAAMPcGAADwEAAw-QYAAPIQACD9BgAA8xAAMARGAADmEAAw9wYAAOcQADD5BgAA6RAAIP0GAACWDwAwBEYAAN0QADD3BgAA3hAAMPkGAADgEAAg_QYAAPwOADAERgAA0RAAMPcGAADSEAAw-QYAANQQACD9BgAA1RAAMARGAADIEAAw9wYAAMkQADD5BgAAyxAAIP0GAAD4CgAwBEYAAL8QADD3BgAAwBAAMPkGAADCEAAg_QYAALMMADADRgAAuhAAIPcGAAC7EAAg_QYAAJMGACAAAAABAwAA-QsAIAACAwAA-QsAIAwAAN4NACAAAAAAAAMDAAD5CwAgDAAA-gsAIO8FAACwCgAgCx4AAKMLACAiAAC1CwAgNwAA3gsAIK0FAACwCgAg4gUAALAKACDjBQAAsAoAIOQFAACwCgAg5QUAALAKACDoBQAAsAoAIOkFAACwCgAg6gUAALAKACABNgAAowsAIAI2AAC1CwAg4AUAALAKACAIAwAA-QsAIAYAAOIRACA1AADfEQAgOAAA3gsAIKcFAACwCgAg1QUAALAKACDWBQAAsAoAINgFAACwCgAgAy0AAPkLACAuAADZEQAg0wUAALAKACAHEQAApA0AICcAAOURACCtBQAAsAoAIJQGAACwCgAglQYAALAKACCWBgAAsAoAIJcGAACwCgAgABYKAADoEQAgGAAA6xEAIBoAAPARACAcAADXEQAgHgAAzg8AIB8AANsRACAgAADdEQAgIQAAmg0AIK0FAACwCgAg2gUAALAKACDgBQAAsAoAIOgFAACwCgAg6QUAALAKACDqBQAAsAoAIMIGAACwCgAgwwYAALAKACDEBgAAsAoAIMUGAACwCgAgxgYAALAKACDHBgAAsAoAIMgGAACwCgAgyQYAALAKACABCAAAzg8AIAAACAgAAJoNACAiAACbDQAgIwAAnA0AIOAFAACwCgAg_gUAALAKACD_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_AACHEgAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEdDgAAyhEAIBUAANIRACAcAADIEQAgHwAAzhEAICAAANERACAjAADJEQAgKQAAxBEAICoAAMURACAsAADHEQAgMQAAyxEAIDIAAMwRACAzAADNEQAgNAAAzxEAIDkAANARACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADnBgLPBUAAAAAB2wUBAAAAAc4GAQAAAAHRBgEAAAAB4wYBAAAAAeQGIAAAAAHlBgAAAMoFAucGQAAAAAHoBgEAAAAB6QYBAAAAAQIAAAABACBGAACIEgAgAwAAAFUAIEYAAIgSACBHAACMEgAgHwAAAFUAIA4AALEQACAVAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgLAAArhAAIDEAALIQACAyAACzEAAgMwAAtBAAIDQAALYQACA5AAC3EAAgPwAAjBIAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEdDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACAjAACwEAAgKQAAqxAAICoAAKwQACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcQFAQC3CgAhzgUAAKoQ5wYizwVAALkKACHbBQEAtwoAIc4GAQC3CgAh0QYBALcKACHjBgEAtgoAIeQGIADvCgAh5QYAANIKygUi5wZAALsLACHoBgEAtwoAIekGAQC3CgAhHQ4AAMoRACAVAADSEQAgHAAAyBEAIB8AAM4RACAgAADREQAgIwAAyREAICkAAMQRACAqAADFEQAgKwAAxhEAIDEAAMsRACAyAADMEQAgMwAAzREAIDQAAM8RACA5AADQEQAgpQUBAAAAAa0FgAAAAAGuBUAAAAABxAUBAAAAAc4FAAAA5wYCzwVAAAAAAdsFAQAAAAHOBgEAAAAB0QYBAAAAAeMGAQAAAAHkBiAAAAAB5QYAAADKBQLnBkAAAAAB6AYBAAAAAekGAQAAAAECAAAAAQAgRgAAjRIAIAMAAABVACBGAACNEgAgRwAAkRIAIB8AAABVACAOAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAID8AAJESACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcQFAQC3CgAhzgUAAKoQ5wYizwVAALkKACHbBQEAtwoAIc4GAQC3CgAh0QYBALcKACHjBgEAtgoAIeQGIADvCgAh5QYAANIKygUi5wZAALsLACHoBgEAtwoAIekGAQC3CgAhHQ4AALEQACAVAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAIDEAALIQACAyAACzEAAgMwAAtBAAIDQAALYQACA5AAC3EAAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0OAADKEQAgFQAA0hEAIBwAAMgRACAfAADOEQAgIAAA0REAICMAAMkRACAqAADFEQAgKwAAxhEAICwAAMcRACAxAADLEQAgMgAAzBEAIDMAAM0RACA0AADPEQAgOQAA0BEAIKUFAQAAAAGtBYAAAAABrgVAAAAAAcQFAQAAAAHOBQAAAOcGAs8FQAAAAAHbBQEAAAABzgYBAAAAAdEGAQAAAAHjBgEAAAAB5AYgAAAAAeUGAAAAygUC5wZAAAAAAegGAQAAAAHpBgEAAAABAgAAAAEAIEYAAJISACAWpQUBAAAAAacFAQAAAAGuBUAAAAABzgUAAACaBgLPBUAAAAAB-QUBAAAAAaEGEAAAAAGiBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAEDAAAAVQAgRgAAkhIAIEcAAJcSACAfAAAAVQAgDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACAjAACwEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACA_AACXEgAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACERBgAAhxAAIAgAAIQQACAKAACFEAAgGQAAhhAAIKUFAQAAAAGuBUAAAAABzwVAAAAAAdgFAQAAAAHbBQEAAAAB3AUBAAAAAeAFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABvgYCAAAAAc4GAQAAAAECAAAAFQAgRgAAmBIAIAylBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB3AUBAAAAAeAFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABvgYCAAAAAc4GAQAAAAEXpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdwFAQAAAAHgBQEAAAAB4QUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAHIBgEAAAAByQYBAAAAAcoGAgAAAAHLBiAAAAABzAYgAAAAAc0GIAAAAAELpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAe0FAQAAAAG7BgEAAAABvAYBAAAAAb0GAQAAAAG-BgIAAAABvwYgAAAAAcAGAQAAAAEB-QUBAAAAAQMAAAARACBGAACYEgAgRwAAoBIAIBMAAAARACAGAADUDwAgCAAA1g8AIAoAANcPACAZAADYDwAgPwAAoBIAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdgFAQC3CgAh2wUBALYKACHcBQEAtgoAIeAFAQC3CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACG-BgIAvAsAIc4GAQC3CgAhEQYAANQPACAIAADWDwAgCgAA1w8AIBkAANgPACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHYBQEAtwoAIdsFAQC2CgAh3AUBALYKACHgBQEAtwoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhvgYCALwLACHOBgEAtwoAIQKqBQEAAAABrgVAAAAAAR8KAAC1DwAgGAAAsw8AIBoAALQPACAcAAC2DwAgHwAAuA8AICAAALkPACAhAAC6DwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHcBQEAAAAB4AUBAAAAAeEFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABwgYBAAAAAcMGAQAAAAHEBhAAAAABxQYQAAAAAcYGEAAAAAHHBgIAAAAByAYBAAAAAckGAQAAAAHKBgIAAAABywYgAAAAAcwGIAAAAAHNBiAAAAABAgAAABkAIEYAAKISACADAAAAFwAgRgAAohIAIEcAAKYSACAhAAAAFwAgCgAA4A4AIBgAAN4OACAaAADfDgAgHAAA4Q4AIB8AAOMOACAgAADkDgAgIQAA5Q4AID8AAKYSACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIc8FQAC5CgAh2gUBALcKACHcBQEAtgoAIeAFAQC3CgAh4QUBALYKACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACGFBiAA7woAIcIGAQC3CgAhwwYBALcKACHEBhAAmAwAIcUGEACYDAAhxgYQAJgMACHHBgIAxQoAIcgGAQC3CgAhyQYBALcKACHKBgIAvAsAIcsGIADvCgAhzAYgAO8KACHNBiAA7woAIR8KAADgDgAgGAAA3g4AIBoAAN8OACAcAADhDgAgHwAA4w4AICAAAOQOACAhAADlDgAgpQUBALYKACGtBYAAAAABrgVAALkKACHPBUAAuQoAIdoFAQC3CgAh3AUBALYKACHgBQEAtwoAIeEFAQC2CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACHCBgEAtwoAIcMGAQC3CgAhxAYQAJgMACHFBhAAmAwAIcYGEACYDAAhxwYCAMUKACHIBgEAtwoAIckGAQC3CgAhygYCALwLACHLBiAA7woAIcwGIADvCgAhzQYgAO8KACERBgAAhxAAIAcAAIMQACAKAACFEAAgGQAAhhAAIKUFAQAAAAGuBUAAAAABzwVAAAAAAdgFAQAAAAHbBQEAAAAB3AUBAAAAAeAFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABvgYCAAAAAc4GAQAAAAECAAAAFQAgRgAApxIAIAWlBQEAAAABrgVAAAAAAc8FQAAAAAHhBQEAAAABhQYgAAAAAQulBQEAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAAB7QUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABwAYBAAAAAQ6lBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAAB1wUgAAAAAeEFAQAAAAGzBgIAAAABtAYBAAAAAbUGIAAAAAG2BgIAAAABtwYCAAAAAbgGAQAAAAG5BkAAAAABugYBAAAAAQWlBQEAAAABrgVAAAAAAc8FQAAAAAHbBQEAAAAB3AUBAAAAAQIAAADaAgAgRgAArBIAIAMAAADdAgAgRgAArBIAIEcAALASACAHAAAA3QIAID8AALASACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHbBQEAtgoAIdwFAQC2CgAhBaUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdsFAQC2CgAh3AUBALYKACECrgVAAAAAAdkFAQAAAAEHpQUBAAAAAacFAQAAAAGoBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAQmlBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABqQUBAAAAAasFCAAAAAGsBQEAAAABrQWAAAAAAa4FQAAAAAEB-QUBAAAAAQMAAAARACBGAACnEgAgRwAAtxIAIBMAAAARACAGAADUDwAgBwAA1Q8AIAoAANcPACAZAADYDwAgPwAAtxIAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdgFAQC3CgAh2wUBALYKACHcBQEAtgoAIeAFAQC3CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACG-BgIAvAsAIc4GAQC3CgAhEQYAANQPACAHAADVDwAgCgAA1w8AIBkAANgPACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHYBQEAtwoAIdsFAQC2CgAh3AUBALYKACHgBQEAtwoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhvgYCALwLACHOBgEAtwoAIR8KAAC1DwAgGAAAsw8AIBwAALYPACAeAAC3DwAgHwAAuA8AICAAALkPACAhAAC6DwAgpQUBAAAAAa0FgAAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHcBQEAAAAB4AUBAAAAAeEFAQAAAAHoBQEAAAAB6QUBAAAAAeoFAQAAAAGFBiAAAAABwgYBAAAAAcMGAQAAAAHEBhAAAAABxQYQAAAAAcYGEAAAAAHHBgIAAAAByAYBAAAAAckGAQAAAAHKBgIAAAABywYgAAAAAcwGIAAAAAHNBiAAAAABAgAAABkAIEYAALgSACALpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAdoFAQAAAAHtBQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYCAAAAAb8GIAAAAAEKpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcIGAQAAAAHDBgEAAAABxAYQAAAAAcUGEAAAAAHGBhAAAAABxwYCAAAAAQMAAAAXACBGAAC4EgAgRwAAvhIAICEAAAAXACAKAADgDgAgGAAA3g4AIBwAAOEOACAeAADiDgAgHwAA4w4AICAAAOQOACAhAADlDgAgPwAAvhIAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhzwVAALkKACHaBQEAtwoAIdwFAQC2CgAh4AUBALcKACHhBQEAtgoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhwgYBALcKACHDBgEAtwoAIcQGEACYDAAhxQYQAJgMACHGBhAAmAwAIccGAgDFCgAhyAYBALcKACHJBgEAtwoAIcoGAgC8CwAhywYgAO8KACHMBiAA7woAIc0GIADvCgAhHwoAAOAOACAYAADeDgAgHAAA4Q4AIB4AAOIOACAfAADjDgAgIAAA5A4AICEAAOUOACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIc8FQAC5CgAh2gUBALcKACHcBQEAtgoAIeAFAQC3CgAh4QUBALYKACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACGFBiAA7woAIcIGAQC3CgAhwwYBALcKACHEBhAAmAwAIcUGEACYDAAhxgYQAJgMACHHBgIAxQoAIcgGAQC3CgAhyQYBALcKACHKBgIAvAsAIcsGIADvCgAhzAYgAO8KACHNBiAA7woAIQgJAADWDgAgCgAA1w4AIKUFAQAAAAGqBQEAAAABrgVAAAAAAc8FQAAAAAHhBQEAAAABhQYgAAAAAQIAAABOACBGAAC_EgAgBaUFAQAAAAGuBUAAAAABzwVAAAAAAfIFAgAAAAGyBgEAAAABDKUFAQAAAAGpBQEAAAABqgUBAAAAAa4FQAAAAAHyBQIAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABngaAAAAAAZ8GEAAAAAGgBhAAAAABoQYQAAAAAQulBQEAAAABqgUBAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAgAAAAG_BiAAAAABwAYBAAAAAQqlBQEAAAABrgVAAAAAAfEFAAAA8QUC8gUCAAAAAfMFAgAAAAH0BQIAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAQOlBQEAAAABrgVAAAAAAewFAQAAAAEDAAAAIAAgRgAAvxIAIEcAAMgSACAKAAAAIAAgCQAAvg4AIAoAAL8OACA_AADIEgAgpQUBALYKACGqBQEAtgoAIa4FQAC5CgAhzwVAALkKACHhBQEAtgoAIYUGIADvCgAhCAkAAL4OACAKAAC_DgAgpQUBALYKACGqBQEAtgoAIa4FQAC5CgAhzwVAALkKACHhBQEAtgoAIYUGIADvCgAhEQYAAIcQACAHAACDEAAgCAAAhBAAIBkAAIYQACClBQEAAAABrgVAAAAAAc8FQAAAAAHYBQEAAAAB2wUBAAAAAdwFAQAAAAHgBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAb4GAgAAAAHOBgEAAAABAgAAABUAIEYAAMkSACAQCwAAtQ4AIBAAALYOACASAAC3DgAgFAAAuQ4AIBYAALoOACClBQEAAAABrgVAAAAAAc8FQAAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBgEAAAABxAYQAAAAAcUGEAAAAAHGBhAAAAABxwYCAAAAAQIAAAAlACBGAADLEgAgCAkAANYOACAXAADYDgAgpQUBAAAAAaoFAQAAAAGuBUAAAAABzwVAAAAAAeEFAQAAAAGFBiAAAAABAgAAAE4AIEYAAM0SACAfGAAAsw8AIBoAALQPACAcAAC2DwAgHgAAtw8AIB8AALgPACAgAAC5DwAgIQAAug8AIKUFAQAAAAGtBYAAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAAB3AUBAAAAAeAFAQAAAAHhBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAcIGAQAAAAHDBgEAAAABxAYQAAAAAcUGEAAAAAHGBhAAAAABxwYCAAAAAcgGAQAAAAHJBgEAAAABygYCAAAAAcsGIAAAAAHMBiAAAAABzQYgAAAAAQIAAAAZACBGAADPEgAgAwAAABEAIEYAAMkSACBHAADTEgAgEwAAABEAIAYAANQPACAHAADVDwAgCAAA1g8AIBkAANgPACA_AADTEgAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2AUBALcKACHbBQEAtgoAIdwFAQC2CgAh4AUBALcKACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACGFBiAA7woAIb4GAgC8CwAhzgYBALcKACERBgAA1A8AIAcAANUPACAIAADWDwAgGQAA2A8AIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIdgFAQC3CgAh2wUBALYKACHcBQEAtgoAIeAFAQC3CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACG-BgIAvAsAIc4GAQC3CgAhAwAAACMAIEYAAMsSACBHAADWEgAgEgAAACMAIAsAAPwNACAQAAD9DQAgEgAA_g0AIBQAAIAOACAWAACBDgAgPwAA1hIAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIYUGIADvCgAhwQYBALYKACHCBgEAtgoAIcMGAQC3CgAhxAYQAJcMACHFBhAAmAwAIcYGEACYDAAhxwYCALwLACEQCwAA_A0AIBAAAP0NACASAAD-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_AADxEgAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0VAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAxAACyEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEQCgAAuA4AIAsAALUOACASAAC3DgAgFAAAuQ4AIBYAALoOACClBQEAAAABrgVAAAAAAc8FQAAAAAGFBiAAAAABwQYBAAAAAcIGAQAAAAHDBgEAAAABxAYQAAAAAcUGEAAAAAHGBhAAAAABxwYCAAAAAQIAAAAlACBGAADyEgAgBQMAANwNACClBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAABAgAAAIMEACBGAAD0EgAgAwAAACMAIEYAAPISACBHAAD4EgAgEgAAACMAIAoAAP8NACALAAD8DQAgEgAA_g0AIBQAAIAOACAWAACBDgAgPwAA-BIAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIYUGIADvCgAhwQYBALYKACHCBgEAtgoAIcMGAQC3CgAhxAYQAJcMACHFBhAAmAwAIcYGEACYDAAhxwYCALwLACEQCgAA_w0AIAsAAPwNACASAAD-DQAgFAAAgA4AIBYAAIEOACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACGFBiAA7woAIcEGAQC2CgAhwgYBALYKACHDBgEAtwoAIcQGEACXDAAhxQYQAJgMACHGBhAAmAwAIccGAgC8CwAhAwAAAJgBACBGAAD0EgAgRwAA-xIAIAcAAACYAQAgAwAAzg0AID8AAPsSACClBQEAtgoAIacFAQC2CgAhrgVAALkKACHPBUAAuQoAIQUDAADODQAgpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzwVAALkKACESCAAAlw0AICIAAJgNACClBQEAAAABrgVAAAAAAc8FQAAAAAHgBQEAAAAB-gUBAAAAAfwFAAAA_AUC_QUQAAAAAf4FEAAAAAH_BRAAAAABgAYCAAAAAYEGAgAAAAGCBgIAAAABgwZAAAAAAYQGQAAAAAGFBiAAAAABhgYgAAAAAQIAAAC5BQAgRgAA_BIAIAMAAAALACBGAAD8EgAgRwAAgBMAIBQAAAALACAIAACZDAAgIgAAmgwAID8AAIATACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHgBQEAtwoAIfoFAQC2CgAh_AUAAJYM_AUi_QUQAJcMACH-BRAAmAwAIf8FEACYDAAhgAYCAMUKACGBBgIAvAsAIYIGAgDFCgAhgwZAALkKACGEBkAAuQoAIYUGIADvCgAhhgYgAO8KACESCAAAmQwAICIAAJoMACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHgBQEAtwoAIfoFAQC2CgAh_AUAAJYM_AUi_QUQAJcMACH-BRAAmAwAIf8FEACYDAAhgAYCAMUKACGBBgIAvAsAIYIGAgDFCgAhgwZAALkKACGEBkAAuQoAIYUGIADvCgAhhgYgAO8KACEeAwAA-AwAIAQAAPkMACAFAADBDQAgIAAA_gwAICQAAPsMACAlAAD8DAAgKAAA_QwAIKUFAQAAAAGnBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAfkFAQAAAAGhBhAAAAABogYBAAAAAaMGAQAAAAGkBoAAAAABpQYBAAAAAaYGAQAAAAGnBhAAAAABqAYQAAAAAakGEAAAAAGqBhAAAAABqwYBAAAAAawGQAAAAAGtBkAAAAABrgZAAAAAAa8GQAAAAAGwBkAAAAABsQZAAAAAAQIAAAAJACBGAACBEwAgAwAAAAcAIEYAAIETACBHAACFEwAgIAAAAAcAIAMAAKgMACAEAACpDAAgBQAAwA0AICAAAK4MACAkAACrDAAgJQAArAwAICgAAK0MACA_AACFEwAgpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzgUAAKYMmgYizwVAALkKACH5BQEAtwoAIaEGEACXDAAhogYBALYKACGjBgEAtgoAIaQGgAAAAAGlBgEAtwoAIaYGAQC3CgAhpwYQAJcMACGoBhAAlwwAIakGEACXDAAhqgYQAJcMACGrBgEAtwoAIawGQAC5CgAhrQZAALsLACGuBkAAuwsAIa8GQAC7CwAhsAZAALsLACGxBkAAuwsAIR4DAACoDAAgBAAAqQwAIAUAAMANACAgAACuDAAgJAAAqwwAICUAAKwMACAoAACtDAAgpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzgUAAKYMmgYizwVAALkKACH5BQEAtwoAIaEGEACXDAAhogYBALYKACGjBgEAtgoAIaQGgAAAAAGlBgEAtwoAIaYGAQC3CgAhpwYQAJcMACGoBhAAlwwAIakGEACXDAAhqgYQAJcMACGrBgEAtwoAIawGQAC5CgAhrQZAALsLACGuBkAAuwsAIa8GQAC7CwAhsAZAALsLACGxBkAAuwsAIR4DAAD4DAAgBAAA-QwAIAUAAMENACAMAAD6DAAgIAAA_gwAICQAAPsMACAoAAD9DAAgpQUBAAAAAacFAQAAAAGuBUAAAAABzgUAAACaBgLPBUAAAAAB-QUBAAAAAaEGEAAAAAGiBgEAAAABowYBAAAAAaQGgAAAAAGlBgEAAAABpgYBAAAAAacGEAAAAAGoBhAAAAABqQYQAAAAAaoGEAAAAAGrBgEAAAABrAZAAAAAAa0GQAAAAAGuBkAAAAABrwZAAAAAAbAGQAAAAAGxBkAAAAABAgAAAAkAIEYAAIYTACADAAAABwAgRgAAhhMAIEcAAIoTACAgAAAABwAgAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICAAAK4MACAkAACrDAAgKAAArQwAID8AAIoTACClBQEAtgoAIacFAQC2CgAhrgVAALkKACHOBQAApgyaBiLPBUAAuQoAIfkFAQC3CgAhoQYQAJcMACGiBgEAtgoAIaMGAQC2CgAhpAaAAAAAAaUGAQC3CgAhpgYBALcKACGnBhAAlwwAIagGEACXDAAhqQYQAJcMACGqBhAAlwwAIasGAQC3CgAhrAZAALkKACGtBkAAuwsAIa4GQAC7CwAhrwZAALsLACGwBkAAuwsAIbEGQAC7CwAhHgMAAKgMACAEAACpDAAgBQAAwA0AIAwAAKoMACAgAACuDAAgJAAAqwwAICgAAK0MACClBQEAtgoAIacFAQC2CgAhrgVAALkKACHOBQAApgyaBiLPBUAAuQoAIfkFAQC3CgAhoQYQAJcMACGiBgEAtgoAIaMGAQC2CgAhpAaAAAAAAaUGAQC3CgAhpgYBALcKACGnBhAAlwwAIagGEACXDAAhqQYQAJcMACGqBhAAlwwAIasGAQC3CgAhrAZAALkKACGtBkAAuwsAIa4GQAC7CwAhrwZAALsLACGwBkAAuwsAIbEGQAC7CwAhHgMAAPgMACAEAAD5DAAgBQAAwQ0AIAwAAPoMACAgAAD-DAAgJAAA-wwAICUAAPwMACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAECAAAACQAgRgAAixMAIAMAAAAHACBGAACLEwAgRwAAjxMAICAAAAAHACADAACoDAAgBAAAqQwAIAUAAMANACAMAACqDAAgIAAArgwAICQAAKsMACAlAACsDAAgPwAAjxMAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhowYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACEeAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICAAAK4MACAkAACrDAAgJQAArAwAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhowYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACENEQAArg0AIKUFAQAAAAGpBQEAAAABrQWAAAAAAa4FQAAAAAHOBQAAAJkGAs8FQAAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAECAAAAfwAgRgAAkBMAIAMAAAB9ACBGAACQEwAgRwAAlBMAIA8AAAB9ACARAACtDQAgPwAAlBMAIKUFAQC2CgAhqQUBALYKACGtBYAAAAABrgVAALkKACHOBQAAxQyZBiLPBUAAuQoAIZIGAQC2CgAhkwYBALYKACGUBgEAtwoAIZUGAQC3CgAhlgZAALsLACGXBkAAuwsAIQ0RAACtDQAgpQUBALYKACGpBQEAtgoAIa0FgAAAAAGuBUAAuQoAIc4FAADFDJkGIs8FQAC5CgAhkgYBALYKACGTBgEAtgoAIZQGAQC3CgAhlQYBALcKACGWBkAAuwsAIZcGQAC7CwAhHgMAAPgMACAEAAD5DAAgBQAAwQ0AIAwAAPoMACAgAAD-DAAgJQAA_AwAICgAAP0MACClBQEAAAABpwUBAAAAAa4FQAAAAAHOBQAAAJoGAs8FQAAAAAH5BQEAAAABoQYQAAAAAaIGAQAAAAGjBgEAAAABpAaAAAAAAaUGAQAAAAGmBgEAAAABpwYQAAAAAagGEAAAAAGpBhAAAAABqgYQAAAAAasGAQAAAAGsBkAAAAABrQZAAAAAAa4GQAAAAAGvBkAAAAABsAZAAAAAAbEGQAAAAAECAAAACQAgRgAAlRMAIAMAAAAHACBGAACVEwAgRwAAmRMAICAAAAAHACADAACoDAAgBAAAqQwAIAUAAMANACAMAACqDAAgIAAArgwAICUAAKwMACAoAACtDAAgPwAAmRMAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhowYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACEeAwAAqAwAIAQAAKkMACAFAADADQAgDAAAqgwAICAAAK4MACAlAACsDAAgKAAArQwAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc4FAACmDJoGIs8FQAC5CgAh-QUBALcKACGhBhAAlwwAIaIGAQC2CgAhowYBALYKACGkBoAAAAABpQYBALcKACGmBgEAtwoAIacGEACXDAAhqAYQAJcMACGpBhAAlwwAIaoGEACXDAAhqwYBALcKACGsBkAAuQoAIa0GQAC7CwAhrgZAALsLACGvBkAAuwsAIbAGQAC7CwAhsQZAALsLACEBqgUBAAAAAQHaBQEAAAABDgMAAJYQACClBQEAAAABpwUBAAAAAa4FQAAAAAHPBUAAAAABzwYBAAAAAdAGAQAAAAHRBgEAAAAB0gYBAAAAAdMGAQAAAAHUBgEAAAAB1QYBAAAAAdYGAQAAAAHXBiAAAAABAgAAAAUAIEYAAJwTACAdDgAAyhEAIBUAANIRACAcAADIEQAgHwAAzhEAICAAANERACApAADEEQAgKgAAxREAICsAAMYRACAsAADHEQAgMQAAyxEAIDIAAMwRACAzAADNEQAgNAAAzxEAIDkAANARACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADnBgLPBUAAAAAB2wUBAAAAAc4GAQAAAAHRBgEAAAAB4wYBAAAAAeQGIAAAAAHlBgAAAMoFAucGQAAAAAHoBgEAAAAB6QYBAAAAAQIAAAABACBGAACeEwAgEAoAALgOACALAAC1DgAgEAAAtg4AIBQAALkOACAWAAC6DgAgpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcEGAQAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAECAAAAJQAgRgAAoBMAIAMAAAAjACBGAACgEwAgRwAApBMAIBIAAAAjACAKAAD_DQAgCwAA_A0AIBAAAP0NACAUAACADgAgFgAAgQ4AID8AAKQTACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACGFBiAA7woAIcEGAQC2CgAhwgYBALYKACHDBgEAtwoAIcQGEACXDAAhxQYQAJgMACHGBhAAmAwAIccGAgC8CwAhEAoAAP8NACALAAD8DQAgEAAA_Q0AIBQAAIAOACAWAACBDgAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAhhQYgAO8KACHBBgEAtgoAIcIGAQC2CgAhwwYBALcKACHEBhAAlwwAIcUGEACYDAAhxgYQAJgMACHHBgIAvAsAIQylBQEAAAABqgUBAAAAAa4FQAAAAAHtBQEAAAAB8gUCAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GgAAAAAGfBhAAAAABoAYQAAAAAaEGEAAAAAEFpQUBAAAAAa4FQAAAAAHOBQAAAJoGAvcFAQAAAAGaBgEAAAABBqUFAQAAAAGuBUAAAAABzgUBAAAAAeAFAQAAAAGQBgEAAAABkQZAAAAAAQulBQEAAAABrQWAAAAAAa4FQAAAAAHOBQAAAJkGAs8FQAAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAEJpQUBAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAaoFAQAAAAGrBQgAAAABrAUBAAAAAa0FgAAAAAGuBUAAAAABAwAAAAMAIEYAAJwTACBHAACsEwAgEAAAAAMAIAMAAIsQACA_AACsEwAgpQUBALYKACGnBQEAtgoAIa4FQAC5CgAhzwVAALkKACHPBgEAtwoAIdAGAQC3CgAh0QYBALcKACHSBgEAtgoAIdMGAQC2CgAh1AYBALcKACHVBgEAtwoAIdYGAQC2CgAh1wYgAO8KACEOAwAAixAAIKUFAQC2CgAhpwUBALYKACGuBUAAuQoAIc8FQAC5CgAhzwYBALcKACHQBgEAtwoAIdEGAQC3CgAh0gYBALYKACHTBgEAtgoAIdQGAQC3CgAh1QYBALcKACHWBgEAtgoAIdcGIADvCgAhAwAAAFUAIEYAAJ4TACBHAACvEwAgHwAAAFUAIA4AALEQACAVAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgKQAAqxAAICoAAKwQACArAACtEAAgLAAArhAAIDEAALIQACAyAACzEAAgMwAAtBAAIDQAALYQACA5AAC3EAAgPwAArxMAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEdDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcQFAQC3CgAhzgUAAKoQ5wYizwVAALkKACHbBQEAtwoAIc4GAQC3CgAh0QYBALcKACHjBgEAtgoAIeQGIADvCgAh5QYAANIKygUi5wZAALsLACHoBgEAtwoAIekGAQC3CgAhFqUFAQAAAAGnBQEAAAABrgVAAAAAAc4FAAAAmgYCzwVAAAAAAaEGEAAAAAGiBgEAAAABowYBAAAAAaQGgAAAAAGlBgEAAAABpgYBAAAAAacGEAAAAAGoBhAAAAABqQYQAAAAAaoGEAAAAAGrBgEAAAABrAZAAAAAAa0GQAAAAAGuBkAAAAABrwZAAAAAAbAGQAAAAAGxBkAAAAABHwoAALUPACAYAACzDwAgGgAAtA8AIBwAALYPACAeAAC3DwAgHwAAuA8AICAAALkPACClBQEAAAABrQWAAAAAAa4FQAAAAAHPBUAAAAAB2gUBAAAAAdwFAQAAAAHgBQEAAAAB4QUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAHIBgEAAAAByQYBAAAAAcoGAgAAAAHLBiAAAAABzAYgAAAAAc0GIAAAAAECAAAAGQAgRgAAsRMAIBIiAACYDQAgIwAAmQ0AIKUFAQAAAAGuBUAAAAABzwVAAAAAAeAFAQAAAAH6BQEAAAAB_AUAAAD8BQL9BRAAAAAB_gUQAAAAAf8FEAAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBkAAAAABhAZAAAAAAYUGIAAAAAGGBiAAAAABAgAAALkFACBGAACzEwAgAwAAABcAIEYAALETACBHAAC3EwAgIQAAABcAIAoAAOAOACAYAADeDgAgGgAA3w4AIBwAAOEOACAeAADiDgAgHwAA4w4AICAAAOQOACA_AAC3EwAgpQUBALYKACGtBYAAAAABrgVAALkKACHPBUAAuQoAIdoFAQC3CgAh3AUBALYKACHgBQEAtwoAIeEFAQC2CgAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAhhQYgAO8KACHCBgEAtwoAIcMGAQC3CgAhxAYQAJgMACHFBhAAmAwAIcYGEACYDAAhxwYCAMUKACHIBgEAtwoAIckGAQC3CgAhygYCALwLACHLBiAA7woAIcwGIADvCgAhzQYgAO8KACEfCgAA4A4AIBgAAN4OACAaAADfDgAgHAAA4Q4AIB4AAOIOACAfAADjDgAgIAAA5A4AIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhzwVAALkKACHaBQEAtwoAIdwFAQC2CgAh4AUBALcKACHhBQEAtgoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhwgYBALcKACHDBgEAtwoAIcQGEACYDAAhxQYQAJgMACHGBhAAmAwAIccGAgDFCgAhyAYBALcKACHJBgEAtwoAIcoGAgC8CwAhywYgAO8KACHMBiAA7woAIc0GIADvCgAhAwAAAAsAIEYAALMTACBHAAC6EwAgFAAAAAsAICIAAJoMACAjAACbDAAgPwAAuhMAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIeAFAQC3CgAh-gUBALYKACH8BQAAlgz8BSL9BRAAlwwAIf4FEACYDAAh_wUQAJgMACGABgIAxQoAIYEGAgC8CwAhggYCAMUKACGDBkAAuQoAIYQGQAC5CgAhhQYgAO8KACGGBiAA7woAIRIiAACaDAAgIwAAmwwAIKUFAQC2CgAhrgVAALkKACHPBUAAuQoAIeAFAQC3CgAh-gUBALYKACH8BQAAlgz8BSL9BRAAlwwAIf4FEACYDAAh_wUQAJgMACGABgIAxQoAIYEGAgC8CwAhggYCAMUKACGDBkAAuQoAIYQGQAC5CgAhhQYgAO8KACGGBiAA7woAIREGAACHEAAgBwAAgxAAIAgAAIQQACAKAACFEAAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB2AUBAAAAAdsFAQAAAAHcBQEAAAAB4AUBAAAAAegFAQAAAAHpBQEAAAAB6gUBAAAAAYUGIAAAAAG-BgIAAAABzgYBAAAAAQIAAAAVACBGAAC7EwAgEggAAJcNACAjAACZDQAgpQUBAAAAAa4FQAAAAAHPBUAAAAAB4AUBAAAAAfoFAQAAAAH8BQAAAPwFAv0FEAAAAAH-BRAAAAAB_wUQAAAAAYAGAgAAAAGBBgIAAAABggYCAAAAAYMGQAAAAAGEBkAAAAABhQYgAAAAAYYGIAAAAAECAAAAuQUAIEYAAL0TACADAAAAEQAgRgAAuxMAIEcAAMETACATAAAAEQAgBgAA1A8AIAcAANUPACAIAADWDwAgCgAA1w8AID8AAMETACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACHYBQEAtwoAIdsFAQC2CgAh3AUBALYKACHgBQEAtwoAIegFAQC3CgAh6QUBALcKACHqBQEAtwoAIYUGIADvCgAhvgYCALwLACHOBgEAtwoAIREGAADUDwAgBwAA1Q8AIAgAANYPACAKAADXDwAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh2AUBALcKACHbBQEAtgoAIdwFAQC2CgAh4AUBALcKACHoBQEAtwoAIekFAQC3CgAh6gUBALcKACGFBiAA7woAIb4GAgC8CwAhzgYBALcKACEDAAAACwAgRgAAvRMAIEcAAMQTACAUAAAACwAgCAAAmQwAICMAAJsMACA_AADEEwAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh4AUBALcKACH6BQEAtgoAIfwFAACWDPwFIv0FEACXDAAh_gUQAJgMACH_BRAAmAwAIYAGAgDFCgAhgQYCALwLACGCBgIAxQoAIYMGQAC5CgAhhAZAALkKACGFBiAA7woAIYYGIADvCgAhEggAAJkMACAjAACbDAAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAh4AUBALcKACH6BQEAtgoAIfwFAACWDPwFIv0FEACXDAAh_gUQAJgMACH_BRAAmAwAIYAGAgDFCgAhgQYCALwLACGCBgIAxQoAIYMGQAC5CgAhhAZAALkKACGFBiAA7woAIYYGIADvCgAhEAoAALgOACALAAC1DgAgEAAAtg4AIBIAALcOACAWAAC6DgAgpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcEGAQAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAECAAAAJQAgRgAAxRMAIAMAAAAjACBGAADFEwAgRwAAyRMAIBIAAAAjACAKAAD_DQAgCwAA_A0AIBAAAP0NACASAAD-DQAgFgAAgQ4AID8AAMkTACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACGFBiAA7woAIcEGAQC2CgAhwgYBALYKACHDBgEAtwoAIcQGEACXDAAhxQYQAJgMACHGBhAAmAwAIccGAgC8CwAhEAoAAP8NACALAAD8DQAgEAAA_Q0AIBIAAP4NACAWAACBDgAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAhhQYgAO8KACHBBgEAtgoAIcIGAQC2CgAhwwYBALcKACHEBhAAlwwAIcUGEACYDAAhxgYQAJgMACHHBgIAvAsAIR0OAADKEQAgHAAAyBEAIB8AAM4RACAgAADREQAgIwAAyREAICkAAMQRACAqAADFEQAgKwAAxhEAICwAAMcRACAxAADLEQAgMgAAzBEAIDMAAM0RACA0AADPEQAgOQAA0BEAIKUFAQAAAAGtBYAAAAABrgVAAAAAAcQFAQAAAAHOBQAAAOcGAs8FQAAAAAHbBQEAAAABzgYBAAAAAdEGAQAAAAHjBgEAAAAB5AYgAAAAAeUGAAAAygUC5wZAAAAAAegGAQAAAAHpBgEAAAABAgAAAAEAIEYAAMoTACADpQUBAAAAAa4FQAAAAAHtBQEAAAABAwAAAFUAIEYAAMoTACBHAADPEwAgHwAAAFUAIA4AALEQACAcAACvEAAgHwAAtRAAICAAALgQACAjAACwEAAgKQAAqxAAICoAAKwQACArAACtEAAgLAAArhAAIDEAALIQACAyAACzEAAgMwAAtBAAIDQAALYQACA5AAC3EAAgPwAAzxMAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEdDgAAsRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIDkAALcQACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcQFAQC3CgAhzgUAAKoQ5wYizwVAALkKACHbBQEAtwoAIc4GAQC3CgAh0QYBALcKACHjBgEAtgoAIeQGIADvCgAh5QYAANIKygUi5wZAALsLACHoBgEAtwoAIekGAQC3CgAhEAoAALgOACALAAC1DgAgEAAAtg4AIBIAALcOACAUAAC5DgAgpQUBAAAAAa4FQAAAAAHPBUAAAAABhQYgAAAAAcEGAQAAAAHCBgEAAAABwwYBAAAAAcQGEAAAAAHFBhAAAAABxgYQAAAAAccGAgAAAAECAAAAJQAgRgAA0BMAIAgDAAD3CwAgpQUBAAAAAacFAQAAAAGuBUAAAAABzwVAAAAAAdsFAQAAAAHuBSAAAAAB7wUBAAAAAQIAAACTBgAgRgAA0hMAIAMAAAAjACBGAADQEwAgRwAA1hMAIBIAAAAjACAKAAD_DQAgCwAA_A0AIBAAAP0NACASAAD-DQAgFAAAgA4AID8AANYTACClBQEAtgoAIa4FQAC5CgAhzwVAALkKACGFBiAA7woAIcEGAQC2CgAhwgYBALYKACHDBgEAtwoAIcQGEACXDAAhxQYQAJgMACHGBhAAmAwAIccGAgC8CwAhEAoAAP8NACALAAD8DQAgEAAA_Q0AIBIAAP4NACAUAACADgAgpQUBALYKACGuBUAAuQoAIc8FQAC5CgAhhQYgAO8KACHBBgEAtgoAIcIGAQC2CgAhwwYBALcKACHEBhAAlwwAIcUGEACYDAAhxgYQAJgMACHHBgIAvAsAIQMAAADEAQAgRgAA0hMAIEcAANkTACAKAAAAxAEAIAMAAOkLACA_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_AAD8EwAgpQUBALYKACGnBQEAtwoAIa4FQAC5CgAhywUBALYKACHPBUAAuQoAIdQFAQC2CgAh1QUBALcKACHWBQEAtwoAIdcFIADvCgAh2AUBALcKACENAwAA8QoAIAYAAPIKACA1AADwCgAgpQUBALYKACGnBQEAtwoAIa4FQAC5CgAhywUBALYKACHPBUAAuQoAIdQFAQC2CgAh1QUBALcKACHWBQEAtwoAIdcFIADvCgAh2AUBALcKACEDAAAAVQAgRgAA9RMAIEcAAP8TACAfAAAAVQAgDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACAjAACwEAAgKQAAqxAAICoAAKwQACArAACtEAAgLAAArhAAIDEAALIQACAyAACzEAAgMwAAtBAAIDQAALYQACA_AAD_EwAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgNAAAthAAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEDAAAAxAYAIEYAAPcTACBHAACCFAAgFQAAAMQGACAeAAC-CwAgIgAAvQsAID8AAIIUACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcsFAQC2CgAhzwVAALkKACHcBQEAtgoAIeEFAQC2CgAh4gUBALcKACHjBQEAtwoAIeQFAQC3CgAh5QVAALsLACHmBSAA7woAIecFAgC8CwAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAh6wUgAO8KACETHgAAvgsAICIAAL0LACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcsFAQC2CgAhzwVAALkKACHcBQEAtgoAIeEFAQC2CgAh4gUBALcKACHjBQEAtwoAIeQFAQC3CgAh5QVAALsLACHmBSAA7woAIecFAgC8CwAh6AUBALcKACHpBQEAtwoAIeoFAQC3CgAh6wUgAO8KACEdDgAAyhEAIBUAANIRACAcAADIEQAgHwAAzhEAICAAANERACAjAADJEQAgKQAAxBEAICoAAMURACArAADGEQAgLAAAxxEAIDEAAMsRACAzAADNEQAgNAAAzxEAIDkAANARACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADnBgLPBUAAAAAB2wUBAAAAAc4GAQAAAAHRBgEAAAAB4wYBAAAAAeQGIAAAAAHlBgAAAMoFAucGQAAAAAHoBgEAAAAB6QYBAAAAAQIAAAABACBGAACDFAAgCKUFAQAAAAGuBUAAAAAByAUBAAAAAcoFAAAAygUCywUBAAAAAcwFgAAAAAHOBQAAAM4FAs8FQAAAAAEDAAAAVQAgRgAAgxQAIEcAAIgUACAfAAAAVQAgDgAAsRAAIBUAALkQACAcAACvEAAgHwAAtRAAICAAALgQACAjAACwEAAgKQAAqxAAICoAAKwQACArAACtEAAgLAAArhAAIDEAALIQACAzAAC0EAAgNAAAthAAIDkAALcQACA_AACIFAAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDMAALQQACA0AAC2EAAgOQAAtxAAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEdDgAAyhEAIBUAANIRACAcAADIEQAgHwAAzhEAICAAANERACAjAADJEQAgKQAAxBEAICoAAMURACArAADGEQAgLAAAxxEAIDIAAMwRACAzAADNEQAgNAAAzxEAIDkAANARACClBQEAAAABrQWAAAAAAa4FQAAAAAHEBQEAAAABzgUAAADnBgLPBUAAAAAB2wUBAAAAAc4GAQAAAAHRBgEAAAAB4wYBAAAAAeQGIAAAAAHlBgAAAMoFAucGQAAAAAHoBgEAAAAB6QYBAAAAAQIAAAABACBGAACJFAAgCC0AAOoKACClBQEAAAABrgVAAAAAAc4FAAAA0wUCzwVAAAAAAdAFAQAAAAHRBQEAAAAB0wUBAAAAAQIAAACiAQAgRgAAixQAIAMAAABVACBGAACJFAAgRwAAjxQAIB8AAABVACAOAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMgAAsxAAIDMAALQQACA0AAC2EAAgOQAAtxAAID8AAI8UACClBQEAtgoAIa0FgAAAAAGuBUAAuQoAIcQFAQC3CgAhzgUAAKoQ5wYizwVAALkKACHbBQEAtwoAIc4GAQC3CgAh0QYBALcKACHjBgEAtgoAIeQGIADvCgAh5QYAANIKygUi5wZAALsLACHoBgEAtwoAIekGAQC3CgAhHQ4AALEQACAVAAC5EAAgHAAArxAAIB8AALUQACAgAAC4EAAgIwAAsBAAICkAAKsQACAqAACsEAAgKwAArRAAICwAAK4QACAyAACzEAAgMwAAtBAAIDQAALYQACA5AAC3EAAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIQMAAACgAQAgRgAAixQAIEcAAJIUACAKAAAAoAEAIC0AANwKACA_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_AAChFAAgpQUBALYKACGtBYAAAAABrgVAALkKACHEBQEAtwoAIc4FAACqEOcGIs8FQAC5CgAh2wUBALcKACHOBgEAtwoAIdEGAQC3CgAh4wYBALYKACHkBiAA7woAIeUGAADSCsoFIucGQAC7CwAh6AYBALcKACHpBgEAtwoAIR0OAACxEAAgFQAAuRAAIBwAAK8QACAfAAC1EAAgIAAAuBAAICMAALAQACApAACrEAAgKgAArBAAICsAAK0QACAsAACuEAAgMQAAshAAIDIAALMQACAzAAC0EAAgOQAAtxAAIKUFAQC2CgAhrQWAAAAAAa4FQAC5CgAhxAUBALcKACHOBQAAqhDnBiLPBUAAuQoAIdsFAQC3CgAhzgYBALcKACHRBgEAtwoAIeMGAQC2CgAh5AYgAO8KACHlBgAA0grKBSLnBkAAuwsAIegGAQC3CgAh6QYBALcKACEfCgAAtQ8AIBgAALMPACAaAAC0DwAgHAAAtg8AIB4AALcPACAfAAC4DwAgIQAAug8AIKUFAQAAAAGtBYAAAAABrgVAAAAAAc8FQAAAAAHaBQEAAAAB3AUBAAAAAeAFAQAAAAHhBQEAAAAB6AUBAAAAAekFAQAAAAHqBQEAAAABhQYgAAAAAcIGAQAAAAHDBgEAAAABxAYQAAAAAcUGEAAAAAHGBhAAAAABxwYCAAAAAcgGAQAAAAHJBgEAAAABygYCAAAAAcsGIAAAAAHMBiAAAAABzQYgAAAAAQIAAAAZACBGAACiFAAgHgMAAPgMACAEAAD5DAAgBQAAwQ0AIAwAAPoMACAkAAD7DAAgJQAA_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-EDCQ_iAwoY4wMHBQ0AjwFMAJIBTQCTAZ4BAJABnwEAkQEAAAAAAAUNAI8BTACSAU0AkwGeAQCQAZ8BAJEBAwMAAQkABhv1AwEDAwABCQAGG_sDAQUNAJgBTACbAU0AnAGeAQCZAZ8BAJoBAAAAAAAFDQCYAUwAmwFNAJwBngEAmQGfAQCaAQEDAAEBAwABAw0AoQFMAKIBTQCjAQAAAAMNAKEBTACiAU0AowECDgAMDwAKAg4ADA8ACgUNAKgBTACrAU0ArAGeAQCpAZ8BAKoBAAAAAAAFDQCoAUwAqwFNAKwBngEAqQGfAQCqAQMDAAEEAAIFuwQEAwMAAQQAAgXBBAQFDQCxAUwAtAFNALUBngEAsgGfAQCzAQAAAAAABQ0AsQFMALQBTQC1AZ4BALIBnwEAswECDwAKEQADAg8AChEAAwUNALoBTAC9AU0AvgGeAQC7AZ8BALwBAAAAAAAFDQC6AUwAvQFNAL4BngEAuwGfAQC8AQERAAMBEQADAw0AwwFMAMQBTQDFAQAAAAMNAMMBTADEAU0AxQEBEQADAREAAwMNAMoBTADLAU0AzAEAAAADDQDKAUwAywFNAMwBASYAIQEmACEDDQDRAUwA0gFNANMBAAAAAw0A0QFMANIBTQDTAQERAAMBEQADBQ0A2AFMANsBTQDcAZ4BANkBnwEA2gEAAAAAAAUNANgBTADbAU0A3AGeAQDZAZ8BANoBAAAFDQDhAUwA5AFNAOUBngEA4gGfAQDjAQAAAAAABQ0A4QFMAOQBTQDlAZ4BAOIBnwEA4wECBQAECQAGAgUABAkABgMNAOoBTADrAU0A7AEAAAADDQDqAUwA6wFNAOwBAgUABBgABwIFAAQYAAcDDQDxAUwA8gFNAPMBAAAAAw0A8QFMAPIBTQDzAQETAAoBEwAKBQ0A-AFMAPsBTQD8AZ4BAPkBnwEA-gEAAAAAAAUNAPgBTAD7AU0A_AGeAQD5AZ8BAPoBAQMAAQEDAAEDDQCBAkwAggJNAIMCAAAAAw0AgQJMAIICTQCDAgIPAAoVABECDwAKFQARAw0AiAJMAIkCTQCKAgAAAAMNAIgCTACJAk0AigIAAAUNAI8CTACSAk0AkwKeAQCQAp8BAJECAAAAAAAFDQCPAkwAkgJNAJMCngEAkAKfAQCRAgAAAw0AmAJMAJkCTQCaAgAAAAMNAJgCTACZAk0AmgIAAAMNAJ8CTACgAk0AoQIAAAADDQCfAkwAoAJNAKECAhgAMDUALgIYADA1AC4DDQCmAkwApwJNAKgCAAAAAw0ApgJMAKcCTQCoAgIdADM1AC4CHQAzNQAuAw0ArQJMAK4CTQCvAgAAAAMNAK0CTACuAk0ArwIDA8IHAQbDBy01AC4DA8kHAQbKBy01AC4DDQC0AkwAtQJNALYCAAAAAw0AtAJMALUCTQC2AgEtAAEBLQABAw0AuwJMALwCTQC9AgAAAAMNALsCTAC8Ak0AvQICLwAqMAABAi8AKjAAAQMNAMICTADDAk0AxAIAAAADDQDCAkwAwwJNAMQCAgOICAEJAAYCA44IAQkABgMNAMkCTADKAk0AywIAAAADDQDJAkwAygJNAMsCAQOgCAEBA6YIAQUNANACTADTAk0A1AKeAQDRAp8BANICAAAAAAAFDQDQAkwA0wJNANQCngEA0QKfAQDSAgMDuAgBCboIBhG5CAMDA8AIAQnCCAYRwQgDBQ0A2QJMANwCTQDdAp4BANoCnwEA2wIAAAAAAAUNANkCTADcAk0A3QKeAQDaAp8BANsCOgIBO9IBATzUAQE91QEBPtYBAUDYAQFB2gE4QtsBOUPdAQFE3wE4ReABOkjhAQFJ4gEBSuMBOE7mATtP5wE_UOgBJlHpASZS6gEmU-sBJlTsASZV7gEmVvABOFfxAUBY8wEmWfUBOFr2AUFb9wEmXPgBJl35AThe_AFCX_0BRmD-ASdh_wEnYoACJ2OBAidkggInZYQCJ2aGAjhnhwJHaIkCJ2mLAjhqjAJIa40CJ2yOAidtjwI4bpICSW-TAk1wlQIocZYCKHKYAihzmQIodJoCKHWcAih2ngI4d58CTnihAih5owI4eqQCT3ulAih8pgIofacCOH6qAlB_qwJUgAGsAgKBAa0CAoIBrgICgwGvAgKEAbACAoUBsgIChgG0AjiHAbUCVYgBtwICiQG5AjiKAboCVosBuwICjAG8AgKNAb0COI4BwAJXjwHBAluQAcICB5EBwwIHkgHEAgeTAcUCB5QBxgIHlQHIAgeWAcoCOJcBywJcmAHOAgeZAdACOJoB0QJdmwHTAgecAdQCB50B1QI4oAHYAl6hAdkCZKIB2wIZowHcAhmkAd8CGaUB4AIZpgHhAhmnAeMCGagB5QI4qQHmAmWqAegCGasB6gI4rAHrAmatAewCGa4B7QIZrwHuAjiwAfECZ7EB8gJrsgHzAhizAfQCGLQB9QIYtQH2Ahi2AfcCGLcB-QIYuAH7Aji5AfwCbLoB_gIYuwGAAzi8AYEDbb0BggMYvgGDAxi_AYQDOMABhwNuwQGIA3LCAYkDBsMBigMGxAGLAwbFAYwDBsYBjQMGxwGPAwbIAZEDOMkBkgNzygGVAwbLAZcDOMwBmAN0zQGaAwbOAZsDBs8BnAM40AGfA3XRAaADe9IBoQMJ0wGiAwnUAaMDCdUBpAMJ1gGlAwnXAacDCdgBqQM42QGqA3zaAawDCdsBrgM43AGvA33dAbADCd4BsQMJ3wGyAzjgAbUDfuEBtgOCAeIBtwMK4wG4AwrkAbkDCuUBugMK5gG7AwrnAb0DCugBvwM46QHAA4MB6gHCAwrrAcQDOOwBxQOEAe0BxgMK7gHHAwrvAcgDOPABywOFAfEBzAOLAfIBzQMI8wHOAwj0Ac8DCPUB0AMI9gHRAwj3AdMDCPgB1QM4-QHWA4wB-gHcAwj7Ad4DOPwB3wONAf0B5AMI_gHlAwj_AeYDOIAC6QOOAYEC6gOUAYIC6wMXgwLsAxeEAu0DF4UC7gMXhgLvAxeHAvEDF4gC8wM4iQL0A5UBigL3AxeLAvkDOIwC-gOWAY0C_AMXjgL9AxePAv4DOJACgQSXAZECggSdAZIChAQMkwKFBAyUAocEDJUCiAQMlgKJBAyXAosEDJgCjQQ4mQKOBJ4BmgKQBAybApIEOJwCkwSfAZ0ClAQMngKVBAyfApYEOKACmQSgAaECmgSkAaICmwQLowKcBAukAp0EC6UCngQLpgKfBAunAqEEC6gCowQ4qQKkBKUBqgKmBAurAqgEOKwCqQSmAa0CqgQLrgKrBAuvAqwEOLACrwSnAbECsAStAbICsQQDswKyBAO0ArMEA7UCtAQDtgK1BAO3ArcEA7gCuQQ4uQK6BK4BugK9BAO7Ar8EOLwCwASvAb0CwgQDvgLDBAO_AsQEOMACxwSwAcECyAS2AcICyQQOwwLKBA7EAssEDsUCzAQOxgLNBA7HAs8EDsgC0QQ4yQLSBLcBygLUBA7LAtYEOMwC1wS4Ac0C2AQOzgLZBA7PAtoEONAC3QS5AdEC3gS_AdIC3wQg0wLgBCDUAuEEINUC4gQg1gLjBCDXAuUEINgC5wQ42QLoBMAB2gLqBCDbAuwEONwC7QTBAd0C7gQg3gLvBCDfAvAEOOAC8wTCAeEC9ATGAeIC9QQh4wL2BCHkAvcEIeUC-AQh5gL5BCHnAvsEIegC_QQ46QL-BMcB6gKABSHrAoIFOOwCgwXIAe0ChAUh7gKFBSHvAoYFOPACiQXJAfECigXNAfICiwUi8wKMBSL0Ao0FIvUCjgUi9gKPBSL3ApEFIvgCkwU4-QKUBc4B-gKWBSL7ApgFOPwCmQXPAf0CmgUi_gKbBSL_ApwFOIADnwXQAYEDoAXUAYIDogUfgwOjBR-EA6UFH4UDpgUfhgOnBR-HA6kFH4gDqwU4iQOsBdUBigOuBR-LA7AFOIwDsQXWAY0DsgUfjgOzBR-PA7QFOJADtwXXAZEDuAXdAZIDugUEkwO7BQSUA70FBJUDvgUElgO_BQSXA8EFBJgDwwU4mQPEBd4BmgPGBQSbA8gFOJwDyQXfAZ0DygUEngPLBQSfA8wFOKADzwXgAaED0AXmAaID0QUFowPSBQWkA9MFBaUD1AUFpgPVBQWnA9cFBagD2QU4qQPaBecBqgPcBQWrA94FOKwD3wXoAa0D4AUFrgPhBQWvA-IFOLAD5QXpAbED5gXtAbID5wUVswPoBRW0A-kFFbUD6gUVtgPrBRW3A-0FFbgD7wU4uQPwBe4BugPyBRW7A_QFOLwD9QXvAb0D9gUVvgP3BRW_A_gFOMAD-wXwAcED_AX0AcID_QUPwwP-BQ_EA_8FD8UDgAYPxgOBBg_HA4MGD8gDhQY4yQOGBvUBygOIBg_LA4oGOMwDiwb2Ac0DjAYPzgONBg_PA44GONADkQb3AdEDkgb9AdIDlAYR0wOVBhHUA5cGEdUDmAYR1gOZBhHXA5sGEdgDnQY42QOeBv4B2gOgBhHbA6IGONwDowb_Ad0DpAYR3gOlBhHfA6YGOOADqQaAAuEDqgaEAuIDqwYQ4wOsBhDkA60GEOUDrgYQ5gOvBhDnA7EGEOgDswY46QO0BoUC6gO2BhDrA7gGOOwDuQaGAu0DugYQ7gO7BhDvA7wGOPADvwaHAvEDwAaLAvIDwgYu8wPDBi70A8YGLvUDxwYu9gPIBi73A8oGLvgDzAY4-QPNBowC-gPPBi77A9EGOPwD0gaNAv0D0wYu_gPUBi7_A9UGOIAE2AaOAoEE2QaUAoIE2wYwgwTcBjCEBN8GMIUE4AYwhgThBjCHBOMGMIgE5QY4iQTmBpUCigToBjCLBOoGOIwE6waWAo0E7AYwjgTtBjCPBO4GOJAE8QaXApEE8gabApIE9AYzkwT1BjOUBPgGM5UE-QYzlgT6BjOXBPwGM5gE_gY4mQT_BpwCmgSBBzObBIMHOJwEhAedAp0EhQczngSGBzOfBIcHOKAEigeeAqEEiweiAqIEjAcvowSNBy-kBI4HL6UEjwcvpgSQBy-nBJIHL6gElAc4qQSVB6MCqgSXBy-rBJkHOKwEmgekAq0EmwcvrgScBy-vBJ0HOLAEoAelArEEoQepArIEogcyswSjBzK0BKQHMrUEpQcytgSmBzK3BKgHMrgEqgc4uQSrB6oCugStBzK7BK8HOLwEsAerAr0EsQcyvgSyBzK_BLMHOMAEtgesAsEEtwewAsIEuActwwS5By3EBLoHLcUEuwctxgS8By3HBL4HLcgEwAc4yQTBB7ECygTFBy3LBMcHOMwEyAeyAs0EywctzgTMBy3PBM0HONAE0AezAtEE0Qe3AtIE0gcq0wTTByrUBNQHKtUE1Qcq1gTWByrXBNgHKtgE2gc42QTbB7gC2gTdByrbBN8HONwE4Ae5At0E4Qcq3gTiByrfBOMHOOAE5ge6AuEE5we-AuIE6Acp4wTpBynkBOoHKeUE6wcp5gTsBynnBO4HKegE8Ac46QTxB78C6gTzBynrBPUHOOwE9gfAAu0E9wcp7gT4BynvBPkHOPAE_AfBAvEE_QfFAvIE_gcb8wT_Bxv0BIAIG_UEgQgb9gSCCBv3BIQIG_gEhgg4-QSHCMYC-gSKCBv7BIwIOPwEjQjHAv0Ejwgb_gSQCBv_BJEIOIAFlAjIAoEFlQjMAoIFlggsgwWXCCyEBZgILIUFmQgshgWaCCyHBZwILIgFngg4iQWfCM0CigWiCCyLBaQIOIwFpQjOAo0FpwgsjgWoCCyPBakIOJAFrAjPApEFrQjVApIFrggckwWvCByUBbAIHJUFsQgclgWyCByXBbQIHJgFtgg4mQW3CNYCmgW8CBybBb4IOJwFvwjXAp0FwwgcngXECByfBcUIOKAFyAjYAqEFyQjeAg"
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
  const productPrice = hasVariants ? null : payload.price ?? null;
  if (hasVariants && !variants.length) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Variants are required when hasVariants is true"
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
      hasVariants: true
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
    if (nextHasVariants) {
      updateData.price = null;
    } else if (payload.price !== void 0) {
      updateData.price = payload.price;
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
  price: z3.coerce.number().min(0, { message: "Price cannot be negative" }),
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
  price: z3.coerce.number().min(0, { message: "Price cannot be negative" }).optional(),
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
  price: z3.coerce.number().min(0, { message: "Price cannot be negative" }).optional(),
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
