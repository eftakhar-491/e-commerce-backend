import { z } from "zod";

const uuidSchema = z.string().uuid();

const mediaUrlsSchema = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return undefined;
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
}, z.array(z.string().url({ message: "Each media URL must be valid" })).optional());

export const createMediaZodSchema = z.object({
  productId: uuidSchema.optional(),
  variantId: uuidSchema.optional(),
  variantOptionId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
  altText: z
    .string()
    .min(1, { message: "altText cannot be empty" })
    .max(255, { message: "altText cannot exceed 255 characters" })
    .optional(),
  isPrimary: z.coerce.boolean().optional(),
  mediaUrl: z.string().url({ message: "mediaUrl must be a valid URL" }).optional(),
  mediaUrls: mediaUrlsSchema,
});
