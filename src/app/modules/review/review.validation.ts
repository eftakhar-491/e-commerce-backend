import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: "Value cannot be empty" })
    .max(max, { message: `Value cannot exceed ${max} characters` })
    .optional();

const ratingSchema = z.coerce
  .number()
  .int({ message: "Rating must be an integer" })
  .min(1, { message: "Rating must be between 1 and 5" })
  .max(5, { message: "Rating must be between 1 and 5" });

export const createReviewZodSchema = z.object({
  productId: z.string().uuid({ message: "Product id must be a valid UUID" }),
  rating: ratingSchema,
  title: optionalText(255),
  comment: optionalText(2000),
});

export const updateMyReviewZodSchema = z
  .object({
    rating: ratingSchema.optional(),
    title: optionalText(255),
    comment: optionalText(2000),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

export const moderateReviewZodSchema = z
  .object({
    isApproved: z.coerce.boolean().optional(),
    isVerifiedPurchase: z.coerce.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one moderation field is required",
  });

const adminReplyValueSchema = z.preprocess(
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
  z
    .string()
    .max(2000, { message: "Admin reply cannot exceed 2000 characters" })
    .nullable(),
);

export const replyReviewZodSchema = z.object({
  adminReply: adminReplyValueSchema,
});
