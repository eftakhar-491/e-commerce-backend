import { z } from "zod";

const paymentMethodValues = [
  "CASH_ON_DELIVERY",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "CREDIT_CARD",
  "BANK_TRANSFER",
] as const;

const orderStatusValues = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: "Value cannot be empty" })
    .max(max, { message: `Value cannot exceed ${max} characters` })
    .optional();

export const createOrderZodSchema = z.object({
  shippingAddressId: z
    .string()
    .uuid({ message: "shippingAddressId must be a valid UUID" }),
  paymentMethod: z.enum(paymentMethodValues, {
    message: "Unsupported payment method",
  }),
  notes: optionalText(2000),
  billingAddress: z.record(z.string(), z.unknown()).optional(),
  shippingCost: z.coerce
    .number()
    .min(0, { message: "shippingCost cannot be negative" })
    .optional(),
  tax: z.coerce.number().min(0, { message: "tax cannot be negative" }).optional(),
});

export const updateOrderStatusZodSchema = z.object({
  status: z.enum(orderStatusValues, {
    message: "Unsupported order status",
  }),
  note: optionalText(500),
});
