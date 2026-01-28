import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { cleanupImages } from "../../utils/cleanupImage";

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
// const getAllImages = async () => {
//   const images = await prisma.productImage.findMany({
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   return images;
// };
const getAllImages = async (query: Record<string, any>) => {
  const qb = new QueryBuilder<any, any, any>({ ...query, limit: "12" })
    .filter()
    .search(["altText", "src", "publicId"])
    .sort()
    .fields()
    .paginate();

  const prismaQuery = qb.build();

  const data = await prisma.productImage.findMany(prismaQuery);

  const meta = await qb.getMeta(prisma.productImage);

  return {
    meta,
    data,
  };
};

const deleteImage = async (
  imageId: string,
  storageType: "local" | "cloudinary" | "custom",
  payload: { src?: string; publicId?: string },
) => {
  console.log(payload);
  await cleanupImages([
    {
      storageType,
      ...(payload?.publicId !== undefined && { publicId: payload.publicId }),
      ...(payload?.src !== undefined && { src: payload.src }),
    },
  ]);
  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });
};

export const ImageService = {
  createImages,
  getAllImages,
  deleteImage,
};
