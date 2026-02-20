import { z } from "zod";

const optionalTrimmedText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, { message: "Value cannot be empty" })
    .max(maxLength, { message: `Value cannot exceed ${maxLength} characters` })
    .optional();

const trackingItemZodSchema = z.object({
  itemId: z
    .string()
    .trim()
    .min(1, { message: "itemId is required" })
    .max(100, { message: "itemId cannot exceed 100 characters" }),
  itemName: optionalTrimmedText(255),
  itemBrand: optionalTrimmedText(100),
  itemCategory: optionalTrimmedText(100),
  itemVariant: optionalTrimmedText(100),
  price: z.coerce
    .number()
    .nonnegative({ message: "price cannot be negative" })
    .optional(),
  quantity: z.coerce
    .number()
    .int({ message: "quantity must be an integer" })
    .positive({ message: "quantity must be greater than 0" })
    .optional(),
});

const trackingUserDataZodSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).optional(),
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
  clientId: optionalTrimmedText(120),
});

export const trackEventZodSchema = z
  .object({
    eventType: z
      .string()
      .trim()
      .min(1, { message: "eventType is required" })
      .max(100, { message: "eventType cannot exceed 100 characters" }),
    eventId: z.string().uuid({ message: "eventId must be a valid UUID" }).optional(),
    sessionId: optionalTrimmedText(120),
    orderId: z.string().uuid({ message: "orderId must be a valid UUID" }).optional(),
    productId: z
      .string()
      .uuid({ message: "productId must be a valid UUID" })
      .optional(),
    value: z.coerce
      .number()
      .nonnegative({ message: "value cannot be negative" })
      .optional(),
    currency: z
      .string()
      .trim()
      .length(3, { message: "currency must be 3 characters (ISO code)" })
      .transform((value) => value.toUpperCase())
      .optional(),
    sourceUrl: z.string().trim().url({ message: "sourceUrl must be a valid URL" }).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    userData: trackingUserDataZodSchema.optional(),
    items: z.array(trackingItemZodSchema).optional(),
  })
  .superRefine((payload, ctx) => {
    if (payload.eventType === "Purchase" && !payload.orderId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["orderId"],
        message: "orderId is required for Purchase event",
      });
    }
  });
