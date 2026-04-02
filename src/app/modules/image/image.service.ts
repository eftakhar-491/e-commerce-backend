import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { cleanupImages } from "../../utils/cleanupImage";
import type { ICreateMediaPayload, MediaStorageType } from "./image.interface";

const mediaSelect = {
  id: true,
  src: true,
  publicId: true,
  altText: true,
  isPrimary: true,
  productId: true,
  variantId: true,
  variantOptionId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductImageSelect;

const videoExtensions = new Set([
  ".mp4",
  ".mov",
  ".avi",
  ".webm",
  ".mkv",
  ".m4v",
]);

const getMediaType = (src: string) => {
  const normalized = src.split("?")[0]?.split("#")[0] ?? src;

  for (const ext of videoExtensions) {
    if (normalized.toLowerCase().endsWith(ext)) {
      return "video" as const;
    }
  }

  return "image" as const;
};

const resolveStorageType = (image: { src: string; publicId: string | null }) => {
  const publicId = image.publicId ?? "";

  if (publicId.startsWith("link:")) {
    return "link" as MediaStorageType;
  }

  if (publicId.startsWith("local:")) {
    return "local" as MediaStorageType;
  }

  if (publicId.startsWith("cloudinary:")) {
    return "cloudinary" as MediaStorageType;
  }

  if (publicId.startsWith("supabase:")) {
    return "supabase" as MediaStorageType;
  }

  if (image.src.startsWith("/api/uploads/")) {
    return "local" as MediaStorageType;
  }

  if (image.src.includes("res.cloudinary.com")) {
    return "cloudinary" as MediaStorageType;
  }

  if (image.src.includes("supabase.co/storage/v1/object/public")) {
    return "supabase" as MediaStorageType;
  }

  return "link" as MediaStorageType;
};

const ensureRelationsExist = async (payload: ICreateMediaPayload) => {
  const [product, variant, variantOption, category] = await Promise.all([
    payload.productId
      ? prisma.product.findUnique({
          where: { id: payload.productId },
          select: { id: true },
        })
      : Promise.resolve(null),
    payload.variantId
      ? prisma.productVariant.findUnique({
          where: { id: payload.variantId },
          select: { id: true },
        })
      : Promise.resolve(null),
    payload.variantOptionId
      ? prisma.variantOption.findUnique({
          where: { id: payload.variantOptionId },
          select: { id: true },
        })
      : Promise.resolve(null),
    payload.categoryId
      ? prisma.category.findUnique({
          where: { id: payload.categoryId },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  if (payload.productId && !product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.variantId && !variant) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant not found");
  }

  if (payload.variantOptionId && !variantOption) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant option not found");
  }

  if (payload.categoryId && !category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
};

const createImages = async (payload: ICreateMediaPayload) => {
  if (!payload.images.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Media files are required");
  }

  await ensureRelationsExist(payload);

  const createdImages = await prisma.productImage.createManyAndReturn({
    data: payload.images.map((media) => ({
      src: media.src,
      publicId: media.publicId ?? null,
      altText: media.altText ?? null,
      isPrimary: media.isPrimary ?? false,
      productId: payload.productId ?? null,
      variantId: payload.variantId ?? null,
      variantOptionId: payload.variantOptionId ?? null,
      categoryId: payload.categoryId ?? null,
    })),
    select: mediaSelect,
  });

  return createdImages.map((media) => ({
    ...media,
    mediaType: getMediaType(media.src),
  }));
};

const getAllImages = async (query: Record<string, string | undefined>) => {
  const qb = new QueryBuilder<
    Prisma.ProductImageWhereInput,
    Prisma.ProductImageSelect,
    Prisma.ProductImageOrderByWithRelationInput[]
  >({ ...query })
    .filter()
    .search(["altText", "src", "publicId"])
    .sort()
    .fields()
    .paginate();

  const builtQuery = qb.build() as Prisma.ProductImageFindManyArgs;

  const [rows, meta] = await Promise.all([
    prisma.productImage.findMany({
      ...builtQuery,
      select: builtQuery.select ?? mediaSelect,
    }),
    qb.getMeta(prisma.productImage),
  ]);

  return {
    meta,
    data: rows.map((media) => ({
      ...media,
      mediaType: getMediaType(media.src),
    })),
  };
};

const deleteImage = async (imageId: string) => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      src: true,
      publicId: true,
    },
  });

  if (!image) {
    throw new AppError(httpStatus.NOT_FOUND, "Media not found");
  }

  await cleanupImages([
    {
      storageType: resolveStorageType(image),
      src: image.src,
      ...(image.publicId !== null && { publicId: image.publicId }),
    },
  ]);

  await prisma.productImage.delete({
    where: { id: image.id },
  });
};

export const ImageService = {
  createImages,
  getAllImages,
  deleteImage,
};
