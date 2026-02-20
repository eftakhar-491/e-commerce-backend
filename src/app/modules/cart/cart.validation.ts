import { z } from "zod";

export const addCartItemZodSchema = z.object({
  productId: z.string().uuid({ message: "productId must be a valid UUID" }),
  variantOptionId: z
    .string()
    .uuid({ message: "variantOptionId must be a valid UUID" }),
  quantity: z.coerce
    .number()
    .int({ message: "quantity must be an integer" })
    .min(1, { message: "quantity must be at least 1" })
    .max(100, { message: "quantity cannot exceed 100" })
    .optional(),
});

export const updateCartItemZodSchema = z.object({
  quantity: z.coerce
    .number()
    .int({ message: "quantity must be an integer" })
    .min(1, { message: "quantity must be at least 1" })
    .max(100, { message: "quantity cannot exceed 100" }),
});
