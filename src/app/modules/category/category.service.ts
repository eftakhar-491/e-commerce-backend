import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { categorySearchableFields } from "./category.constant";
import type {
  ICategoryCollectionNode,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const categoryBaseSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

const categoryListSelect = {
  ...categoryBaseSelect,
  parent: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  _count: {
    select: {
      children: true,
      products: true,
    },
  },
} satisfies Prisma.CategorySelect;

const categoryDetailsSelect = {
  ...categoryListSelect,
  children: {
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      sortOrder: true,
      parentId: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  },
} satisfies Prisma.CategorySelect;

const collectionCategorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  products: {
    where: {
      isActive: true,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      brand: true,
      price: true,
      compareAtPrice: true,
      hasVariants: true,
      isFeatured: true,
      images: {
        where: {
          isPrimary: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          id: true,
          src: true,
          altText: true,
          isPrimary: true,
        },
      },
    },
  },
} satisfies Prisma.CategorySelect;

const ensureParentExists = async (parentId: string) => {
  const parent = await prisma.category.findUnique({
    where: { id: parentId },
    select: { id: true },
  });

  if (!parent) {
    throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
  }
};

const ensureSlugUnique = async (slug: string, excludedCategoryId?: string) => {
  const existing = await prisma.category.findFirst({
    where: {
      slug,
      ...(excludedCategoryId && { id: { not: excludedCategoryId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Category slug already exists");
  }
};

const ensureNameUniqueWithinParent = async (
  name: string,
  parentId: string | null,
  excludedCategoryId?: string,
) => {
  const existing = await prisma.category.findFirst({
    where: {
      name,
      parentId,
      ...(excludedCategoryId && { id: { not: excludedCategoryId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category name already exists under this parent",
    );
  }
};

const ensureNoCircularParent = async (
  categoryId: string,
  nextParentId: string,
) => {
  let currentParentId: string | null = nextParentId;

  while (currentParentId) {
    if (currentParentId === categoryId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Circular parent relationship is not allowed",
      );
    }

    const parentCategory: { parentId: string | null } | null =
      await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
      });

    currentParentId = parentCategory?.parentId ?? null;
  }
};

const buildOrderBy = (
  sort: string | undefined,
): Prisma.CategoryOrderByWithRelationInput[] => {
  if (!sort) {
    return [{ sortOrder: "asc" }, { createdAt: "desc" }];
  }

  return sort
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      if (field.startsWith("-")) {
        return { [field.slice(1)]: "desc" };
      }

      return { [field]: "asc" };
    }) as Prisma.CategoryOrderByWithRelationInput[];
};

const buildWhere = (query: Record<string, string | undefined>) => {
  const where: Prisma.CategoryWhereInput = {};

  if (query.searchTerm) {
    where.OR = categorySearchableFields.map((field) => ({
      [field]: {
        contains: query.searchTerm,
        mode: "insensitive",
      },
    }));
  }

  if (query.parentId !== undefined) {
    const parentId = query.parentId.trim().toLowerCase();

    if (parentId === "" || parentId === "null" || parentId === "root") {
      where.parentId = null;
    } else {
      where.parentId = query.parentId;
    }
  }

  if (query.isActive !== undefined) {
    if (query.isActive !== "true" && query.isActive !== "false") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "isActive query must be true or false",
      );
    }

    where.isActive = query.isActive === "true";
  }

  return where;
};

const createCategory = async (payload: ICreateCategoryPayload) => {
  const parentId = payload.parentId ?? null;

  if (parentId) {
    await ensureParentExists(parentId);
  }

  await Promise.all([
    ensureSlugUnique(payload.slug),
    ensureNameUniqueWithinParent(payload.name, parentId),
  ]);

  const createdCategory = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.image !== undefined && { image: payload.image }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
      ...(payload.sortOrder !== undefined && { sortOrder: payload.sortOrder }),
      ...(parentId && { parent: { connect: { id: parentId } } }),
      ...(payload.metaTitle !== undefined && { metaTitle: payload.metaTitle }),
      ...(payload.metaDescription !== undefined && {
        metaDescription: payload.metaDescription,
      }),
      ...(payload.metaKeywords !== undefined && {
        metaKeywords: payload.metaKeywords,
      }),
    },
    select: categoryDetailsSelect,
  });

  return createdCategory;
};

const getCategories = async (query: Record<string, string | undefined>) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const where = buildWhere(query);
  const orderBy = buildOrderBy(query.sort);

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: categoryListSelect,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const sortCollectionTree = (nodes: ICategoryCollectionNode[]) => {
  nodes.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    return a.name.localeCompare(b.name);
  });

  nodes.forEach((node) => sortCollectionTree(node.children));
};

const getPublicCollections = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: collectionCategorySelect,
  });

  const nodeMap = new Map<string, ICategoryCollectionNode>();

  categories.forEach((category) => {
    nodeMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: category.parentId,
      products: category.products,
      children: [],
    });
  });

  const roots: ICategoryCollectionNode[] = [];

  nodeMap.forEach((node) => {
    if (!node.parentId) {
      roots.push(node);
      return;
    }

    const parentNode = nodeMap.get(node.parentId);

    if (!parentNode) {
      roots.push(node);
      return;
    }

    parentNode.children.push(node);
  });

  sortCollectionTree(roots);

  return roots;
};

const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: categoryDetailsSelect,
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategory = async (
  categoryId: string,
  payload: IUpdateCategoryPayload,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
    },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one field is required to update category",
    );
  }

  if (payload.parentId !== undefined && payload.parentId === categoryId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A category cannot be its own parent",
    );
  }

  if (payload.parentId !== undefined && payload.parentId !== null) {
    await ensureParentExists(payload.parentId);
    await ensureNoCircularParent(categoryId, payload.parentId);
  }

  const nextParentId =
    payload.parentId !== undefined ? payload.parentId : existingCategory.parentId;
  const nextName = payload.name ?? existingCategory.name;

  if (payload.slug !== undefined && payload.slug !== existingCategory.slug) {
    await ensureSlugUnique(payload.slug, categoryId);
  }

  if (payload.name !== undefined || payload.parentId !== undefined) {
    await ensureNameUniqueWithinParent(nextName, nextParentId ?? null, categoryId);
  }

  const updateData: Prisma.CategoryUpdateInput = {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.slug !== undefined && { slug: payload.slug }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.image !== undefined && { image: payload.image }),
    ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    ...(payload.sortOrder !== undefined && { sortOrder: payload.sortOrder }),
    ...(payload.metaTitle !== undefined && { metaTitle: payload.metaTitle }),
    ...(payload.metaDescription !== undefined && {
      metaDescription: payload.metaDescription,
    }),
    ...(payload.metaKeywords !== undefined && {
      metaKeywords: payload.metaKeywords,
    }),
  };

  if (payload.parentId !== undefined) {
    updateData.parent = payload.parentId
      ? { connect: { id: payload.parentId } }
      : { disconnect: true };
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
    select: categoryDetailsSelect,
  });

  return updatedCategory;
};

export const CategoryService = {
  createCategory,
  getCategories,
  getPublicCollections,
  getCategoryById,
  updateCategory,
};
