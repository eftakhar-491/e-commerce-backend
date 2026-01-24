import { z } from "zod";

const uuidSchema = z.string().uuid();
const booleanDefault = z.boolean().default(false);

export const productImageZodSchema = z.object({
  productId: uuidSchema.optional(),
  variantId: uuidSchema.optional(),
  variantOptionId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
  src: z.string().url("Image src must be a valid URL"),
  altText: z.string().optional(),
  publicId: z.string().optional(),
  isPrimary: booleanDefault,
});

export const variantOptionZodSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().min(0),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  isActive: booleanDefault,
  images: z.array(productImageZodSchema).optional(),
});

export const productVariantZodSchema = z.object({
  title: z.string().min(1),
  isActive: booleanDefault,

  options: z
    .array(variantOptionZodSchema)
    .min(1, "At least one variant option is required"),

  images: z.array(productImageZodSchema).optional(),
});

interface ProductRefineContext {
  parent: {
    hasVariants: boolean;
  };
}

type ProductVariant = z.infer<typeof productVariantZodSchema>;

export const createProductZodSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().min(1),

    description: z.string().optional(),
    shortDesc: z.string().optional(),

    categoryId: uuidSchema,
    brand: z.string().optional(),

    hasVariants: z.boolean(),
    isActive: booleanDefault,
    isFeatured: booleanDefault,

    images: z.array(productImageZodSchema).optional(),

    variants: z.array(productVariantZodSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.hasVariants && (!data.variants || data.variants.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Variants are required when hasVariants is true",
      path: ["variants"],
    },
  );
