import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { ImageService } from "./image.service";
import { sendResponse } from "../../utils/sendResponse";

const createImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, variantOptionId, categoryId, altText, isPrimary } =
      req.body || {};

    const { storageType } = req.query;

    // normalize uploaded images

    const images =
      req.uploadedImages?.map((img) => ({
        src: img.src!,
        publicId: img.publicId!,
        altText,
        isPrimary,
      })) ?? [];

    const result = await ImageService.createImages({
      productId,
      variantOptionId,
      categoryId,
      images,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Images created successfully",
      data: result,
    });
  },
);
const getAllImages = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await ImageService.getAllImages(query as Record<string, any>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images retrieved successfully",
    data: result,
  });
});
const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const imageId = req.params.id as string;
  const { src, publicId } = req.body as { src?: string; publicId?: string };
  const { storageType } = req.query as {
    storageType: "local" | "cloudinary" | "custom";
  };
  const _result = await ImageService.deleteImage(imageId, storageType, {
    ...(src !== undefined && { src }),
    ...(publicId !== undefined && { publicId }),
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image deleted successfully",
    data: null,
  });
});
export const ImageController = {
  createImages,
  getAllImages,
  deleteImage,
};
