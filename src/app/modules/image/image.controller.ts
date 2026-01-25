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
export const ImageController = {
  createImages,
};
