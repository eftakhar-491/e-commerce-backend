import type { CreateCategoryDTO, ICategory } from "./category.interface";

import { prisma } from "../../lib/prisma";
import AppError from "../../helper/AppError";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { Prisma } from "../../../../generated/prisma/browser";
import cloudinary from "../../lib/cloudinary";
import type { Request } from "express";
import { uploadCategoryImageIfAny } from "../../helper/uploadCategoryImageIfAny";
import { deleteUploadedImage } from "../../utils/deleteUploadedImage";

const createCategory = async (payload: CreateCategoryDTO, req: Request) => {
  // ✅ BUSINESS VALIDATION FIRST
  if (payload.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: payload.parentId },
    });

    if (!parent) {
      throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
    }
  }

  const existsNameOrSlug = await prisma.category.findFirst({
    where: {
      OR: [{ slug: payload.slug }, { name: payload.name }],
    },
  });

  if (existsNameOrSlug) {
    throw new AppError(httpStatus.CONFLICT, "Name or slug already exists");
  }

  // ✅ TRANSACTION
  return prisma.$transaction(async (tx: any) => {
    const category = await tx.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description ?? null,
        parentId: payload.parentId ?? null,
        isActive: payload.isActive ?? true,
      },
    });

    await tx.productImage.update({
      where: { id: payload.imageId },
      data: {
        src: req.file ? req.file.path : req.body.src,
        publicId: req.file ? req.file.filename : req.body.publicId,
        altText: req.file ? req.file.originalname : req.body.altText || null,
        isPrimary: true,
        category: {
          connect: { id: category.id },
        },
      },
    });

    return tx.category.findUnique({
      where: { id: category.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        parentId: true,
        isActive: true,
        images: true,
        children: true,
        products: true,
      },
    });
  });
};

const getCategories = async (query: Record<string, string | undefined>) => {
  const qb = new QueryBuilder<
    Prisma.CategoryWhereInput,
    Prisma.CategorySelect,
    Prisma.CategoryOrderByWithRelationInput[]
  >(query)
    .search(["name", "slug"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = qb.build();

  const categories = await prisma.category.findMany({
    ...prismaQuery,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      isActive: true,
      images: true,
      children: true,
      products: true,
    },
  });

  const meta = await qb.getMeta(prisma.category);

  return {
    meta,
    data: categories,
  };
};

// const updateCategory = async (

//   categoryId: string,
//   payload: Partial<CreateCategoryDTO>,
//   req: Request,
// ) => {
//   const existingCategory = await prisma.category.findUnique({
//     where: { id: categoryId },
//     include: { images: true, children: true, products: true },
//   });

//   if (!existingCategory) {
//     throw new AppError(httpStatus.NOT_FOUND, "Category not found");
//   }
//   if (
//     existingCategory.name === payload.name ||
//     existingCategory.slug === payload.slug
//   ) {
//     throw new AppError(
//       httpStatus.CONFLICT,
//       "Category with the same name or slug already exists",
//     );
//   }

//   if (payload.parentId === categoryId) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "A category cannot be its own parent",
//     );
//   }

//   if (payload.slug && payload.slug == existingCategory.slug) {
//     throw new AppError(httpStatus.CONFLICT, "Slug already exists");
//   }

//   const data: Prisma.CategoryUpdateInput = {};
//   if (payload.name !== undefined) data.name = payload.name;
//   if (payload.slug !== undefined) data.slug = payload.slug;
//   if (payload.description !== undefined) data.description = payload.description;
//   if (payload.isActive !== undefined) data.isActive = payload.isActive;
//   if (payload.parentId !== undefined) {
//     data.parent = payload.parentId
//       ? { connect: { id: payload.parentId } }
//       : { disconnect: true };
//   }

//   return prisma.$transaction(async (tx: any) => {
//     await tx.category.update({
//       where: { id: categoryId },
//       data,
//     });
//     if (payload.imageId) {

//       prisma.productImage.update({
//         where: { id: payload.imageId },
//         data: {
//           src: req.file ? req.file.path : req.body.src,
//           publicId: req.file ? req.file.filename : req.body.publicId,
//           altText: req.file ? req.file.originalname : req.body.altText || null,
//           isPrimary: true,
//           category: {
//             connect: { id: categoryId },
//           },
//         },
//       });
//     }

//     // await tx.productImage.create({
//     //   data: {
//     //     src: req.file.path ? req.file.path : req.body.src,
//     //     publicId: req.file.filename ? req.file.filename : req.body.publicId,
//     //     altText: req.body.altText || req.body.name || null,
//     //     isPrimary: true,
//     //     category: {
//     //       connect: { id: categoryId },
//     //     },
//     //   },
//     // });

//     return tx.category.findUnique({
//       where: { id: categoryId },
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         description: true,
//         parentId: true,
//         isActive: true,
//         images: true,
//       },
//     });
//   });
// };
const updateCategory = async (
  categoryId: string,
  payload: Partial<CreateCategoryDTO>,
  req: Request,
) => {
  /* ---------------------------------------------
     1️⃣ Check if category exists
  ---------------------------------------------- */
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { images: true },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  /* ---------------------------------------------
     2️⃣ Prevent self-parent
  ---------------------------------------------- */
  if (payload.parentId === categoryId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A category cannot be its own parent",
    );
  }

  /* ---------------------------------------------
     3️⃣ Prevent duplicate name or slug
  ---------------------------------------------- */
  if (payload.name || payload.slug) {
    const orConditions: Prisma.CategoryWhereInput[] = [];
    if (payload.name) orConditions.push({ name: payload.name });
    if (payload.slug) orConditions.push({ slug: payload.slug });

    const duplicateCategory = await prisma.category.findFirst({
      where: {
        AND: [{ id: { not: categoryId } }, { OR: orConditions }],
      },
    });

    if (duplicateCategory) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Category with the same name or slug already exists",
      );
    }
  }

  /* ---------------------------------------------
     4️⃣ Prevent circular parent assignment
  ---------------------------------------------- */
  if (payload.parentId) {
    const invalidParent = await prisma.category.findFirst({
      where: {
        id: payload.parentId,
        parentId: categoryId,
      },
    });

    if (invalidParent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot assign a child category as parent",
      );
    }
  }

  /* ---------------------------------------------
     5️⃣ Build update payload safely
  ---------------------------------------------- */
  const data: Prisma.CategoryUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.slug !== undefined) data.slug = payload.slug;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;

  if (payload.parentId !== undefined) {
    data.parent = payload.parentId
      ? { connect: { id: payload.parentId } }
      : { disconnect: true };
  }

  /* ---------------------------------------------
     6️⃣ Transaction
  ---------------------------------------------- */
  return prisma.$transaction(async (tx) => {
    /* Update category */
    await tx.category.update({
      where: { id: categoryId },
      data,
    });

    /* -----------------------------------------
       7️⃣ Update category image (if provided)
    ------------------------------------------ */
    if (payload.imageId) {
      // Remove previous primary images
      await tx.productImage.updateMany({
        where: { categoryId },
        data: { isPrimary: false },
      });

      await tx.productImage.update({
        where: { id: payload.imageId },
        data: {
          src: req.file?.path ?? req.body.src,
          publicId: req.file?.filename ?? req.body.publicId,
          altText:
            req.file?.originalname ??
            req.body.altText ??
            existingCategory.name ??
            null,
          isPrimary: true,
          category: {
            connect: { id: categoryId },
          },
        },
      });
    }

    /* -----------------------------------------
       8️⃣ Return updated category
    ------------------------------------------ */
    return tx.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        parentId: true,
        isActive: true,
        images: true,
        products: true,
        children: true,
      },
    });
  });
};

const getCategorie = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      isActive: true,
      images: true,
      children: true,
      products: true,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

export const CategoryService = {
  createCategory,
  getCategories,
  updateCategory,
  getCategorie,
};
