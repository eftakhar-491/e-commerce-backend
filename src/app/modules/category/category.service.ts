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
      req.file &&
        req.query.storageType !== "custom" &&
        (await deleteUploadedImage(
          req.file,
          req.query.storageType as "local" | "cloudinary",
        ));
      throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
    }
  }

  const existsNameOrSlug = await prisma.category.findFirst({
    where: {
      OR: [{ slug: payload.slug }, { name: payload.name }],
    },
  });

  if (existsNameOrSlug) {
    req.file &&
      req.query.storageType !== "custom" &&
      (await deleteUploadedImage(
        req.file,
        req.query.storageType as "local" | "cloudinary",
      ));
    throw new AppError(httpStatus.CONFLICT, "Name or slug already exists");
  }

  if (req.query.storageType == "custom") {
    if (!req.body.src || !req.body.publicId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Custom image src and publicId required",
      );
    }
  }

  if (!req.file && req.query.storageType !== "custom") {
    throw new AppError(httpStatus.BAD_REQUEST, "Category image is required");
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

    await tx.productImage.create({
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
    },
  });

  const meta = await qb.getMeta(prisma.category);

  return {
    meta,
    data: categories,
  };
};

const updateCategory = async (
  categoryId: string,
  payload: Partial<CreateCategoryDTO>,
  req: Request,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { images: true },
  });

  if (!existingCategory) {
    req.file &&
      req.query.storageType !== "custom" &&
      (await deleteUploadedImage(
        req.file,
        req.query.storageType as "local" | "cloudinary",
      ));
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.parentId === categoryId) {
    req.file &&
      req.query.storageType !== "custom" &&
      (await deleteUploadedImage(
        req.file,
        req.query.storageType as "local" | "cloudinary",
      ));
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A category cannot be its own parent",
    );
  }

  if (payload.slug && payload.slug == existingCategory.slug) {
    req.file &&
      req.query.storageType !== "custom" &&
      (await deleteUploadedImage(
        req.file,
        req.query.storageType as "local" | "cloudinary",
      ));

    throw new AppError(httpStatus.CONFLICT, "Slug already exists");
  }

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

  return prisma.$transaction(async (tx: any) => {
    await tx.category.update({
      where: { id: categoryId },
      data,
    });

    if (req.file) {
      const oldImage = existingCategory.images.find((i: any) => i.isPrimary);

      if (oldImage?.publicId) {
        await cloudinary.uploader.destroy(oldImage.publicId);
      }

      await tx.productImage.deleteMany({
        where: { categoryId },
      });

      await tx.productImage.create({
        data: {
          src: req.file.path ? req.file.path : req.body.src,
          publicId: req.file.filename ? req.file.filename : req.body.publicId,
          altText: req.body.altText || req.body.name || null,
          isPrimary: true,
          category: {
            connect: { id: categoryId },
          },
        },
      });
    }

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
      },
    });
  });
};
export const CategoryService = {
  createCategory,
  getCategories,
  updateCategory,
};
