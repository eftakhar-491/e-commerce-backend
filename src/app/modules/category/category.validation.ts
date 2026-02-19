import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: "Value cannot be empty" })
    .max(max, { message: `Value cannot exceed ${max} characters` })
    .optional();

const optionalParentIdSchema = z.preprocess(
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
  z.string().uuid().nullable().optional(),
);

export const createCategoryZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long" })
    .max(100, { message: "Slug cannot exceed 100 characters" })
    .regex(slugRegex, {
      message:
        "Slug can contain lowercase letters, numbers, and single hyphens only",
    }),
  description: optionalText(1000),
  image: optionalText(500),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce
    .number()
    .int({ message: "Sort order must be an integer" })
    .min(0, { message: "Sort order cannot be negative" })
    .optional(),
  parentId: optionalParentIdSchema,
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  metaKeywords: optionalText(500),
});

export const updateCategoryZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(100, { message: "Name cannot exceed 100 characters" })
      .optional(),
    slug: z
      .string()
      .trim()
      .min(2, { message: "Slug must be at least 2 characters long" })
      .max(100, { message: "Slug cannot exceed 100 characters" })
      .regex(slugRegex, {
        message:
          "Slug can contain lowercase letters, numbers, and single hyphens only",
      })
      .optional(),
    description: optionalText(1000),
    image: optionalText(500),
    isActive: z.coerce.boolean().optional(),
    sortOrder: z.coerce
      .number()
      .int({ message: "Sort order must be an integer" })
      .min(0, { message: "Sort order cannot be negative" })
      .optional(),
    parentId: optionalParentIdSchema,
    metaTitle: optionalText(255),
    metaDescription: optionalText(500),
    metaKeywords: optionalText(500),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });
