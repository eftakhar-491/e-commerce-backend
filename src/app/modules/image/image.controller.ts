import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { ImageService } from "./image.service";
import { sendResponse } from "../../utils/sendResponse";
import type {
  ICreateMediaPayload,
  ICreateMediaRequestBody,
  IUploadedMedia,
} from "./image.interface";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const createImages = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ICreateMediaRequestBody;
  const uploadedImages = (req.uploadedImages ?? []) as IUploadedMedia[];

  if (!uploadedImages.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "No media received");
  }

  const createPayload: ICreateMediaPayload = {
    ...(payload.productId !== undefined && { productId: payload.productId }),
    ...(payload.variantOptionId !== undefined && {
      variantOptionId: payload.variantOptionId,
    }),
    ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
    images: uploadedImages.map((media) => ({
      src: media.src,
      ...(media.publicId !== undefined && { publicId: media.publicId }),
      ...(payload.altText !== undefined && { altText: payload.altText }),
      ...(payload.isPrimary !== undefined && { isPrimary: payload.isPrimary }),
    })),
  };

  const result = await ImageService.createImages(createPayload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Media uploaded successfully",
    data: result,
  });
});

const getAllImages = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string | undefined>;
  const result = await ImageService.getAllImages(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const imageId = getParamAsString(req.params.id, "Image id");

  await ImageService.deleteImage(imageId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media deleted successfully",
    data: null,
  });
});

export const ImageController = {
  createImages,
  getAllImages,
  deleteImage,
};
