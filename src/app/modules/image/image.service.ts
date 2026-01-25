import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";

type CreateImagePayload = {
  productId?: string;
  variantOptionId?: string;
  categoryId?: string;
  images: {
    src: string;
    publicId: string;
    altText?: string;
    isPrimary?: boolean;
  }[];
};

const createImages = async (payload: CreateImagePayload) => {
  const { productId, variantOptionId, categoryId, images } = payload;

  if (!images?.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Images are required");
  }

  // 🔒 safety: at least one relation
  //   if (!productId && !variantOptionId && !categoryId) {
  //     throw new AppError(
  //       httpStatus.BAD_REQUEST,
  //       "productId or variantOptionId or categoryId required",
  //     );
  //   }

  const createdImages = await prisma.productImage.createManyAndReturn({
    data: images.map((img) => ({
      src: img.src,
      publicId: img.publicId,
      altText: img.altText ?? null,
      isPrimary: img.isPrimary ?? false,

      productId: productId ?? null,
      variantOptionId: variantOptionId ?? null,
      categoryId: categoryId ?? null,
    })),
    select: {
      id: true,
      src: true,
      publicId: true,
      altText: true,
      isPrimary: true,
      productId: true,
      variantOptionId: true,
      categoryId: true,
      createdAt: true,
    },
  });

  return createdImages;

  //   const created = await prisma.productImage.createMany({
  //     data: images.map((img) => ({
  //       src: img.src,
  //       publicId: img.publicId,
  //       altText: img.altText ?? null,
  //       isPrimary: img.isPrimary ?? false,

  //       productId: productId ?? null,
  //       variantOptionId: variantOptionId ?? null,
  //       categoryId: categoryId ?? null,
  //     })),

  //   });
};

export const ImageService = {
  createImages,
};
