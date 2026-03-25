import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: "Value cannot be empty" })
    .max(max, { message: `Value cannot exceed ${max} characters` })
    .optional();

const nullableUuidSchema = z.preprocess(
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

const imageIdsZodSchema = z
  .array(z.string().uuid({ message: "Each image id must be a valid UUID" }))
  .optional()
  .superRefine((ids, ctx) => {
    if (!ids?.length) {
      return;
    }

    const seen = new Set<string>();

    ids.forEach((id, index) => {
      if (seen.has(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index],
          message: "Duplicate image id is not allowed",
        });
        return;
      }

      seen.add(id);
    });
  });

const variantOptionInputZodSchema = z
  .object({
    sku: z
      .string()
      .trim()
      .min(1, { message: "Option SKU is required" })
      .max(100, { message: "Option SKU cannot exceed 100 characters" }),
    barcode: optionalText(100),
    price: z.coerce
      .number()
      .min(0, { message: "Variant additional price cannot be negative" }),
    compareAtPrice: z.coerce
      .number()
      .min(0, { message: "Compare at price cannot be negative" })
      .optional(),
    costPrice: z.coerce
      .number()
      .min(0, { message: "Cost price cannot be negative" })
      .optional(),
    stock: z.coerce
      .number()
      .int({ message: "Stock must be an integer" })
      .min(0, { message: "Stock cannot be negative" })
      .optional(),
    isActive: z.coerce.boolean().optional(),
    imageIds: imageIdsZodSchema,
  })
  .superRefine((option, ctx) => {
    if (
      option.compareAtPrice !== undefined &&
      option.compareAtPrice < option.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message: "Compare at price must be greater than or equal to price",
      });
    }

  });

const productVariantInputZodSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Variant title is required" })
    .max(150, { message: "Variant title cannot exceed 150 characters" }),
  isActive: z.coerce.boolean().optional(),
  imageIds: imageIdsZodSchema,
  options: z
    .array(variantOptionInputZodSchema)
    .min(1, { message: "At least one option is required for each variant" }),
});

const validateVariantSkus = (
  variants: z.infer<typeof productVariantInputZodSchema>[] | undefined,
  ctx: z.RefinementCtx,
) => {
  if (!variants?.length) {
    return;
  }

  const seenSkus = new Set<string>();

  variants.forEach((variant, variantIndex) => {
    variant.options.forEach((option, optionIndex) => {
      const normalizedSku = option.sku.trim().toLowerCase();

      if (seenSkus.has(normalizedSku)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", variantIndex, "options", optionIndex, "sku"],
          message: "Duplicate SKU found in variants payload",
        });
        return;
      }

      seenSkus.add(normalizedSku);
    });
  });
};

export const createProductZodSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, { message: "Title must be at least 2 characters long" })
      .max(255, { message: "Title cannot exceed 255 characters" }),
    slug: z
      .string()
      .trim()
      .min(2, { message: "Slug must be at least 2 characters long" })
      .max(255, { message: "Slug cannot exceed 255 characters" })
      .regex(slugRegex, {
        message:
          "Slug can contain lowercase letters, numbers, and single hyphens only",
      }),
    description: optionalText(5000),
    shortDesc: optionalText(500),
    brand: optionalText(100),
    categoryId: nullableUuidSchema,
    price: z.coerce
      .number()
      .min(0, { message: "Base product price cannot be negative" })
      .optional(),
    compareAtPrice: z.coerce
      .number()
      .min(0, { message: "Compare at price cannot be negative" })
      .optional(),
    costPrice: z.coerce
      .number()
      .min(0, { message: "Cost price cannot be negative" })
      .optional(),
    sku: optionalText(100),
    barcode: optionalText(100),
    stock: z.coerce
      .number()
      .int({ message: "Stock must be an integer" })
      .min(0, { message: "Stock cannot be negative" })
      .optional(),
    lowStockThreshold: z.coerce
      .number()
      .int({ message: "Low stock threshold must be an integer" })
      .min(0, { message: "Low stock threshold cannot be negative" })
      .optional(),
    hasVariants: z.coerce.boolean().optional(),
    isActive: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional(),
    isDigital: z.coerce.boolean().optional(),
    metaTitle: optionalText(255),
    metaDescription: optionalText(500),
    metaKeywords: optionalText(500),
    metadata: z.unknown().optional(),
    imageIds: imageIdsZodSchema,
    variants: z.array(productVariantInputZodSchema).optional(),
  })
  .superRefine((payload, ctx) => {
    const hasVariants = payload.hasVariants ?? false;

    if (hasVariants && !payload.variants?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "Variants are required when hasVariants is true",
      });
    }

    if (hasVariants && payload.price === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message:
          "Base product price is required when hasVariants is true",
      });
    }

    if (!hasVariants && payload.variants?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hasVariants"],
        message: "Set hasVariants to true to submit variants",
      });
    }

    if (payload.compareAtPrice !== undefined && payload.price !== undefined) {
      if (payload.compareAtPrice < payload.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["compareAtPrice"],
          message: "Compare at price must be greater than or equal to price",
        });
      }
    }

    validateVariantSkus(payload.variants, ctx);
  });

export const updateProductZodSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, { message: "Title must be at least 2 characters long" })
      .max(255, { message: "Title cannot exceed 255 characters" })
      .optional(),
    slug: z
      .string()
      .trim()
      .min(2, { message: "Slug must be at least 2 characters long" })
      .max(255, { message: "Slug cannot exceed 255 characters" })
      .regex(slugRegex, {
        message:
          "Slug can contain lowercase letters, numbers, and single hyphens only",
      })
      .optional(),
    description: optionalText(5000),
    shortDesc: optionalText(500),
    brand: optionalText(100),
    categoryId: nullableUuidSchema,
    price: z.coerce
      .number()
      .min(0, { message: "Base product price cannot be negative" })
      .optional(),
    compareAtPrice: z.coerce
      .number()
      .min(0, { message: "Compare at price cannot be negative" })
      .optional(),
    costPrice: z.coerce
      .number()
      .min(0, { message: "Cost price cannot be negative" })
      .optional(),
    sku: optionalText(100),
    barcode: optionalText(100),
    stock: z.coerce
      .number()
      .int({ message: "Stock must be an integer" })
      .min(0, { message: "Stock cannot be negative" })
      .optional(),
    lowStockThreshold: z.coerce
      .number()
      .int({ message: "Low stock threshold must be an integer" })
      .min(0, { message: "Low stock threshold cannot be negative" })
      .optional(),
    hasVariants: z.coerce.boolean().optional(),
    isActive: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional(),
    isDigital: z.coerce.boolean().optional(),
    metaTitle: optionalText(255),
    metaDescription: optionalText(500),
    metaKeywords: optionalText(500),
    metadata: z.unknown().optional(),
    imageIds: imageIdsZodSchema,
    variants: z.array(productVariantInputZodSchema).optional(),
  })
  .superRefine((payload, ctx) => {
    if (Object.keys(payload).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field is required for update",
      });
    }

    if (payload.hasVariants === true && !payload.variants?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "Variants are required when hasVariants is true",
      });
    }

    if (payload.hasVariants === false && payload.variants?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hasVariants"],
        message: "Cannot submit variants while hasVariants is false",
      });
    }

    if (payload.compareAtPrice !== undefined && payload.price !== undefined) {
      if (payload.compareAtPrice < payload.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["compareAtPrice"],
          message: "Compare at price must be greater than or equal to price",
        });
      }
    }

    validateVariantSkus(payload.variants, ctx);
  });
