import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  ICreateProductPayload,
  IProductQuery,
  IProductVariantInput,
  IUpdateProductPayload,
} from "./product.interface";

const productSearchableFields = ["title", "slug", "brand"] as const;
const allowedSortFields = [
  "createdAt",
  "updatedAt",
  "title",
  "slug",
  "price",
  "isActive",
  "isFeatured",
] as const;

const productImageSelect = {
  id: true,
  src: true,
  publicId: true,
  altText: true,
  sortOrder: true,
  isPrimary: true,
  productId: true,
  variantId: true,
  variantOptionId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductImageSelect;

const variantOptionSelect = {
  id: true,
  productVariantId: true,
  sku: true,
  barcode: true,
  price: true,
  compareAtPrice: true,
  costPrice: true,
  stock: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productImageSelect,
  },
} satisfies Prisma.VariantOptionSelect;

const productVariantSelect = {
  id: true,
  productId: true,
  title: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productImageSelect,
  },
  options: {
    orderBy: [{ createdAt: "asc" }],
    select: variantOptionSelect,
  },
} satisfies Prisma.ProductVariantSelect;

const productDetailsSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  shortDesc: true,
  brand: true,
  categoryId: true,
  price: true,
  compareAtPrice: true,
  costPrice: true,
  sku: true,
  barcode: true,
  stock: true,
  lowStockThreshold: true,
  hasVariants: true,
  isActive: true,
  isFeatured: true,
  isDigital: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
    },
  },
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productImageSelect,
  },
  variants: {
    orderBy: [{ createdAt: "asc" }],
    select: productVariantSelect,
  },
} satisfies Prisma.ProductSelect;

const parseBooleanQuery = (value: string, key: string) => {
  if (value !== "true" && value !== "false") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${key} query must be true or false`,
    );
  }

  return value === "true";
};

const buildOrderBy = (
  sort: string | undefined,
): Prisma.ProductOrderByWithRelationInput[] => {
  if (!sort) {
    return [{ createdAt: "desc" }];
  }

  const orderBy = sort
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const direction = field.startsWith("-") ? "desc" : "asc";
      const normalizedField = field.replace(/^-/, "");

      if (
        !allowedSortFields.includes(
          normalizedField as (typeof allowedSortFields)[number],
        )
      ) {
        return null;
      }

      return {
        [normalizedField]: direction,
      } as Prisma.ProductOrderByWithRelationInput;
    })
    .filter(
      (value): value is Prisma.ProductOrderByWithRelationInput =>
        value !== null,
    );

  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }

  return orderBy;
};

const buildWhere = (query: IProductQuery): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (query.searchTerm?.trim()) {
    where.OR = productSearchableFields.map((field) => ({
      [field]: {
        contains: query.searchTerm,
        mode: "insensitive",
      },
    }));
  }

  if (query.categoryId !== undefined) {
    const normalizedCategoryId = query.categoryId.trim().toLowerCase();

    if (!normalizedCategoryId || normalizedCategoryId === "null") {
      where.categoryId = null;
    } else {
      where.categoryId = query.categoryId;
    }
  }

  if (query.brand?.trim()) {
    where.brand = {
      contains: query.brand.trim(),
      mode: "insensitive",
    };
  }

  if (query.isActive !== undefined) {
    where.isActive = parseBooleanQuery(query.isActive, "isActive");
  }

  if (query.hasVariants !== undefined) {
    where.hasVariants = parseBooleanQuery(query.hasVariants, "hasVariants");
  }

  if (query.isFeatured !== undefined) {
    where.isFeatured = parseBooleanQuery(query.isFeatured, "isFeatured");
  }

  return where;
};

const collectVariantSkus = (variants: IProductVariantInput[] | undefined) => {
  if (!variants?.length) {
    return [];
  }

  return variants.flatMap((variant) =>
    variant.options.map((option) => option.sku.trim()),
  );
};

const ensureCategoryExists = async (categoryId?: string | null) => {
  if (!categoryId) {
    return;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
};

const ensureSlugUnique = async (slug: string, excludedProductId?: string) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      slug,
      ...(excludedProductId && { id: { not: excludedProductId } }),
    },
    select: { id: true },
  });

  if (existingProduct) {
    throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
  }
};

const ensureProductSkuUnique = async (
  sku: string | undefined,
  excludedId?: string,
) => {
  if (!sku) {
    return;
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      sku,
      ...(excludedId && { id: { not: excludedId } }),
    },
    select: { id: true },
  });

  if (existingProduct) {
    throw new AppError(httpStatus.CONFLICT, "Product SKU already exists");
  }
};

const ensureVariantSkusAvailable = async (
  skus: string[],
  currentProductId?: string,
) => {
  const uniqueSkus = [...new Set(skus)];

  if (!uniqueSkus.length) {
    return;
  }

  const existingOptions = await prisma.variantOption.findMany({
    where: {
      sku: {
        in: uniqueSkus,
      },
    },
    select: {
      sku: true,
      variant: {
        select: {
          productId: true,
        },
      },
    },
  });

  const conflict = existingOptions.find((option) => {
    if (!currentProductId) {
      return true;
    }

    return option.variant.productId !== currentProductId;
  });

  if (conflict) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Variant option SKU '${conflict.sku}' already exists`,
    );
  }
};

const attachImagesToProduct = async (
  tx: Prisma.TransactionClient,
  productId: string,
  imageIds: string[] | undefined,
) => {
  if (!imageIds?.length) {
    return;
  }

  const uniqueImageIds = [...new Set(imageIds)];

  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        productId: true,
      },
    });

    if (!image) {
      throw new AppError(httpStatus.BAD_REQUEST, `Image '${imageId}' not found`);
    }

    if (image.productId === productId) {
      continue;
    }

    if (image.productId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { productId },
      });
      continue;
    }

    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        productId,
      },
    });
  }
};

const attachImagesToVariant = async (
  tx: Prisma.TransactionClient,
  variantId: string,
  imageIds: string[] | undefined,
) => {
  if (!imageIds?.length) {
    return;
  }

  const uniqueImageIds = [...new Set(imageIds)];

  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        variantId: true,
      },
    });

    if (!image) {
      throw new AppError(httpStatus.BAD_REQUEST, `Image '${imageId}' not found`);
    }

    if (image.variantId === variantId) {
      continue;
    }

    if (image.variantId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { variantId },
      });
      continue;
    }

    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        variantId,
      },
    });
  }
};

const attachImagesToVariantOption = async (
  tx: Prisma.TransactionClient,
  variantOptionId: string,
  imageIds: string[] | undefined,
) => {
  if (!imageIds?.length) {
    return;
  }

  const uniqueImageIds = [...new Set(imageIds)];

  for (const imageId of uniqueImageIds) {
    const image = await tx.productImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        src: true,
        publicId: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        variantOptionId: true,
      },
    });

    if (!image) {
      throw new AppError(httpStatus.BAD_REQUEST, `Image '${imageId}' not found`);
    }

    if (image.variantOptionId === variantOptionId) {
      continue;
    }

    if (image.variantOptionId === null) {
      await tx.productImage.update({
        where: { id: image.id },
        data: { variantOptionId },
      });
      continue;
    }

    await tx.productImage.create({
      data: {
        src: image.src,
        publicId: image.publicId,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
        variantOptionId,
      },
    });
  }
};

const detachImagesFromProduct = async (
  tx: Prisma.TransactionClient,
  productId: string,
) => {
  await tx.productImage.updateMany({
    where: { productId },
    data: { productId: null },
  });
};

const detachImagesFromVariants = async (
  tx: Prisma.TransactionClient,
  variantIds: string[],
) => {
  if (!variantIds.length) {
    return;
  }

  await tx.productImage.updateMany({
    where: {
      variantId: {
        in: variantIds,
      },
    },
    data: {
      variantId: null,
    },
  });
};

const detachImagesFromVariantOptions = async (
  tx: Prisma.TransactionClient,
  optionIds: string[],
) => {
  if (!optionIds.length) {
    return;
  }

  await tx.productImage.updateMany({
    where: {
      variantOptionId: {
        in: optionIds,
      },
    },
    data: {
      variantOptionId: null,
    },
  });
};

const createVariantTree = async (
  tx: Prisma.TransactionClient,
  productId: string,
  variants: IProductVariantInput[],
) => {
  for (const variant of variants) {
    const createdVariant = await tx.productVariant.create({
      data: {
        productId,
        title: variant.title,
        isActive: variant.isActive ?? true,
      },
      select: {
        id: true,
      },
    });

    await attachImagesToVariant(tx, createdVariant.id, variant.imageIds);

    for (const option of variant.options) {
      const createdOption = await tx.variantOption.create({
        data: {
          productVariantId: createdVariant.id,
          sku: option.sku,
          barcode: option.barcode ?? null,
          price: option.price,
          compareAtPrice: option.compareAtPrice ?? null,
          costPrice: option.costPrice ?? null,
          stock: option.stock ?? 0,
          isActive: option.isActive ?? true,
        },
        select: {
          id: true,
        },
      });

      await attachImagesToVariantOption(tx, createdOption.id, option.imageIds);
    }
  }
};

const createProduct = async (payload: ICreateProductPayload) => {
  const hasVariants = payload.hasVariants ?? false;
  const variants = hasVariants ? (payload.variants ?? []) : [];
  const productPrice = hasVariants ? null : (payload.price ?? null);

  if (hasVariants && !variants.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Variants are required when hasVariants is true",
    );
  }

  await Promise.all([
    ensureCategoryExists(payload.categoryId),
    ensureSlugUnique(payload.slug),
    ensureProductSkuUnique(payload.sku),
    ensureVariantSkusAvailable(collectVariantSkus(variants)),
  ]);

  const createdProduct = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        description: payload.description ?? null,
        shortDesc: payload.shortDesc ?? null,
        brand: payload.brand ?? null,
        categoryId: payload.categoryId ?? null,
        price: productPrice,
        compareAtPrice: payload.compareAtPrice ?? null,
        costPrice: payload.costPrice ?? null,
        sku: payload.sku ?? null,
        barcode: payload.barcode ?? null,
        stock: payload.stock ?? null,
        lowStockThreshold: payload.lowStockThreshold ?? 5,
        hasVariants,
        isActive: payload.isActive ?? true,
        isFeatured: payload.isFeatured ?? false,
        isDigital: payload.isDigital ?? false,
        metaTitle: payload.metaTitle ?? null,
        metaDescription: payload.metaDescription ?? null,
        metaKeywords: payload.metaKeywords ?? null,
        ...(payload.metadata !== undefined &&
          payload.metadata !== null && {
            metadata: payload.metadata as Prisma.InputJsonValue,
          }),
      },
      select: {
        id: true,
      },
    });

    await attachImagesToProduct(tx, product.id, payload.imageIds);

    if (variants.length) {
      await createVariantTree(tx, product.id, variants);
    }

    const fullProduct = await tx.product.findUnique({
      where: { id: product.id },
      select: productDetailsSelect,
    });

    if (!fullProduct) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    return fullProduct;
  });

  return createdProduct;
};

const getProducts = async (query: IProductQuery) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const where = buildWhere(query);

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: productDetailsSelect,
    }),
    prisma.product.count({ where }),
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

const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: productDetailsSelect,
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

const updateProduct = async (
  productId: string,
  payload: IUpdateProductPayload,
) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      hasVariants: true,
    },
  });

  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.hasVariants === true && !payload.variants?.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Variants are required when hasVariants is true",
    );
  }

  if (payload.hasVariants === false && payload.variants?.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot submit variants when hasVariants is false",
    );
  }

  await Promise.all([
    payload.categoryId !== undefined
      ? ensureCategoryExists(payload.categoryId)
      : Promise.resolve(),
    payload.slug ? ensureSlugUnique(payload.slug, productId) : Promise.resolve(),
    payload.sku !== undefined
      ? ensureProductSkuUnique(payload.sku, productId)
      : Promise.resolve(),
    payload.variants
      ? ensureVariantSkusAvailable(
          collectVariantSkus(payload.variants),
          productId,
        )
      : Promise.resolve(),
  ]);

  const updatedProduct = await prisma.$transaction(async (tx) => {
    const updateData: Prisma.ProductUncheckedUpdateInput = {};
    const nextHasVariants =
      payload.hasVariants !== undefined
        ? payload.hasVariants
        : payload.variants !== undefined
          ? payload.variants.length > 0
          : existingProduct.hasVariants;

    if (payload.title !== undefined) {
      updateData.title = payload.title;
    }

    if (payload.slug !== undefined) {
      updateData.slug = payload.slug;
    }

    if (payload.description !== undefined) {
      updateData.description = payload.description;
    }

    if (payload.shortDesc !== undefined) {
      updateData.shortDesc = payload.shortDesc;
    }

    if (payload.brand !== undefined) {
      updateData.brand = payload.brand;
    }

    if (payload.categoryId !== undefined) {
      updateData.categoryId = payload.categoryId;
    }

    if (nextHasVariants) {
      updateData.price = null;
    } else if (payload.price !== undefined) {
      updateData.price = payload.price;
    }

    if (payload.compareAtPrice !== undefined) {
      updateData.compareAtPrice = payload.compareAtPrice;
    }

    if (payload.costPrice !== undefined) {
      updateData.costPrice = payload.costPrice;
    }

    if (payload.sku !== undefined) {
      updateData.sku = payload.sku;
    }

    if (payload.barcode !== undefined) {
      updateData.barcode = payload.barcode;
    }

    if (payload.stock !== undefined) {
      updateData.stock = payload.stock;
    }

    if (payload.lowStockThreshold !== undefined) {
      updateData.lowStockThreshold = payload.lowStockThreshold;
    }

    if (payload.hasVariants !== undefined) {
      updateData.hasVariants = payload.hasVariants;
    }

    if (payload.isActive !== undefined) {
      updateData.isActive = payload.isActive;
    }

    if (payload.isFeatured !== undefined) {
      updateData.isFeatured = payload.isFeatured;
    }

    if (payload.isDigital !== undefined) {
      updateData.isDigital = payload.isDigital;
    }

    if (payload.metaTitle !== undefined) {
      updateData.metaTitle = payload.metaTitle;
    }

    if (payload.metaDescription !== undefined) {
      updateData.metaDescription = payload.metaDescription;
    }

    if (payload.metaKeywords !== undefined) {
      updateData.metaKeywords = payload.metaKeywords;
    }

    if (payload.metadata !== undefined && payload.metadata !== null) {
      updateData.metadata = payload.metadata as Prisma.InputJsonValue;
    }

    if (payload.variants !== undefined && payload.hasVariants === undefined) {
      updateData.hasVariants = payload.variants.length > 0;
    }

    if (Object.keys(updateData).length) {
      await tx.product.update({
        where: { id: productId },
        data: updateData,
      });
    }

    if (payload.imageIds !== undefined) {
      await detachImagesFromProduct(tx, productId);
      await attachImagesToProduct(tx, productId, payload.imageIds);
    }

    const shouldReplaceVariants =
      payload.variants !== undefined || payload.hasVariants === false;

    if (shouldReplaceVariants) {
      const existingVariants = await tx.productVariant.findMany({
        where: { productId },
        select: {
          id: true,
          options: {
            select: { id: true },
          },
        },
      });

      const existingVariantIds = existingVariants.map((variant) => variant.id);
      const existingOptionIds = existingVariants.flatMap((variant) =>
        variant.options.map((option) => option.id),
      );

      await detachImagesFromVariantOptions(tx, existingOptionIds);
      await detachImagesFromVariants(tx, existingVariantIds);

      await tx.productVariant.deleteMany({
        where: { productId },
      });

      const nextVariants = payload.variants ?? [];

      if (nextVariants.length) {
        await createVariantTree(tx, productId, nextVariants);
      }
    }

    const product = await tx.product.findUnique({
      where: { id: productId },
      select: productDetailsSelect,
    });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    return product;
  });

  return updatedProduct;
};

const deleteProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  await prisma.$transaction(async (tx) => {
    const variants = await tx.productVariant.findMany({
      where: { productId },
      select: {
        id: true,
        options: {
          select: { id: true },
        },
      },
    });

    const variantIds = variants.map((variant) => variant.id);
    const optionIds = variants.flatMap((variant) =>
      variant.options.map((option) => option.id),
    );

    await detachImagesFromVariantOptions(tx, optionIds);
    await detachImagesFromVariants(tx, variantIds);
    await detachImagesFromProduct(tx, productId);

    await tx.product.delete({
      where: { id: productId },
    });
  });
};

export const ProductService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
