import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { ImageService } from "./image.service";

const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  const image = await ImageService.saveImage({
    src: req.file.path,
    public_id: req.file.filename,
    altText: req.body.alt || null,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Image uploaded successfully",
    data: image,
  });
});

export const ImageControllers = {
  uploadImage,
};
