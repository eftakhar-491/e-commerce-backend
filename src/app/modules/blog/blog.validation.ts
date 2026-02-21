import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: "Value cannot be empty" })
    .max(max, { message: `Value cannot exceed ${max} characters` })
    .optional();

const optionalUuidArray = (fieldName: string) =>
  z
    .array(
      z.string().uuid({ message: `Each ${fieldName} id must be a valid UUID` }),
    )
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
            message: `Duplicate ${fieldName} id is not allowed`,
          });
          return;
        }

        seen.add(id);
      });
    });

const optionalParentCommentIdSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed || trimmed.toLowerCase() === "null") {
        return undefined;
      }

      return trimmed;
    }

    return value;
  },
  z.string().uuid({ message: "parentId must be a valid UUID" }).optional(),
);

export const createBlogPostZodSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(200, { message: "Title cannot exceed 200 characters" }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long" })
    .max(200, { message: "Slug cannot exceed 200 characters" })
    .regex(slugRegex, {
      message:
        "Slug can contain lowercase letters, numbers, and single hyphens only",
    }),
  excerpt: optionalText(500),
  content: z
    .string()
    .trim()
    .min(10, { message: "Content must be at least 10 characters long" })
    .max(100000, { message: "Content cannot exceed 100000 characters" }),
  featuredImage: optionalText(1000),
  categoryIds: optionalUuidArray("category"),
  tagIds: optionalUuidArray("tag"),
  isPublished: z.coerce.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  allowComments: z.coerce.boolean().optional(),
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  metaKeywords: optionalText(500),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateBlogPostZodSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(200, { message: "Title cannot exceed 200 characters" })
      .optional(),
    slug: z
      .string()
      .trim()
      .min(2, { message: "Slug must be at least 2 characters long" })
      .max(200, { message: "Slug cannot exceed 200 characters" })
      .regex(slugRegex, {
        message:
          "Slug can contain lowercase letters, numbers, and single hyphens only",
      })
      .optional(),
    excerpt: optionalText(500),
    content: z
      .string()
      .trim()
      .min(10, { message: "Content must be at least 10 characters long" })
      .max(100000, { message: "Content cannot exceed 100000 characters" })
      .optional(),
    featuredImage: optionalText(1000),
    categoryIds: optionalUuidArray("category"),
    tagIds: optionalUuidArray("tag"),
    isPublished: z.coerce.boolean().optional(),
    publishedAt: z.coerce.date().optional(),
    allowComments: z.coerce.boolean().optional(),
    metaTitle: optionalText(255),
    metaDescription: optionalText(500),
    metaKeywords: optionalText(500),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

export const createBlogCategoryZodSchema = z.object({
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
});

export const updateBlogCategoryZodSchema = z
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
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

export const createBlogTagZodSchema = z.object({
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
});

export const updateBlogTagZodSchema = z
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
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

export const createBlogCommentZodSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, { message: "Comment must be at least 2 characters long" })
    .max(5000, { message: "Comment cannot exceed 5000 characters" }),
  parentId: optionalParentCommentIdSchema,
});

export const moderateBlogCommentZodSchema = z.object({
  isApproved: z.coerce.boolean(),
});
