import type { CreateCategoryDTO, ICategory } from "./category.interface";

import { prisma } from "../../lib/prisma";
import AppError from "../../helper/AppError";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { Prisma } from "../../../../generated/prisma/browser";

const createCategory = async (payload: CreateCategoryDTO) => {
  // Optional: check parent category exists
  if (payload.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: payload.parentId },
    });

    if (!parent) {
      throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
    }
  }

  // Prevent duplicate slug
  const existing = await prisma.category.findUnique({
    where: { slug: payload.slug },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Slug already exists");
  }

  const data = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description ?? null,
    parentId: payload.parentId ?? null,
    isActive: payload.isActive ?? true,
  };

  const result = await prisma.category.create({
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      isActive: true,
    },
  });
  return result;
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
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.parentId === categoryId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A category cannot be its own parent",
    );
  }

  if (payload.slug && payload.slug !== existingCategory.slug) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: payload.slug },
    });
    if (slugExists) {
      throw new AppError(httpStatus.CONFLICT, "Slug already exists");
    }
  }

  const data: Partial<CreateCategoryDTO> = {};
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.slug !== undefined) data.slug = payload.slug;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.parentId !== undefined) data.parentId = payload.parentId;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      isActive: true,
    },
  });

  return updatedCategory;
};

export const CategoryService = {
  createCategory,
  getCategories,
  updateCategory,
};
