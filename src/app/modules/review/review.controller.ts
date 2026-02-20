import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  ICreateReviewPayload,
  IModerateReviewPayload,
  IReplyReviewPayload,
  IReviewQuery,
  IUpdateMyReviewPayload,
} from "./review.interface";
import { ReviewService } from "./review.service";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const getAuthUserId = (req: Request) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  return userId;
};

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const payload = req.body as ICreateReviewPayload;
  const result = await ReviewService.createReview(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

const getPublicReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = getParamAsString(req.params.productId, "Product id");
  const query = req.query as IReviewQuery;
  const result = await ReviewService.getPublicReviewsByProduct(productId, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product reviews retrieved successfully",
    data: {
      reviews: result.data,
      summary: result.summary,
    },
    meta: result.meta,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const query = req.query as IReviewQuery;
  const result = await ReviewService.getMyReviews(userId, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateMyReview = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const reviewId = getParamAsString(req.params.id, "Review id");
  const payload = req.body as IUpdateMyReviewPayload;
  const result = await ReviewService.updateMyReview(userId, reviewId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteMyReview = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const reviewId = getParamAsString(req.params.id, "Review id");
  await ReviewService.deleteMyReview(userId, reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IReviewQuery;
  const result = await ReviewService.getAllReviews(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getReviewByIdForAdmin = catchAsync(async (req: Request, res: Response) => {
  const reviewId = getParamAsString(req.params.id, "Review id");
  const result = await ReviewService.getReviewByIdForAdmin(reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const moderateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = getParamAsString(req.params.id, "Review id");
  const payload = req.body as IModerateReviewPayload;
  const result = await ReviewService.moderateReview(reviewId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review moderated successfully",
    data: result,
  });
});

const replyReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = getParamAsString(req.params.id, "Review id");
  const adminId = getAuthUserId(req);
  const payload = req.body as IReplyReviewPayload;
  const result = await ReviewService.replyReview(reviewId, payload, adminId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review reply updated successfully",
    data: result,
  });
});

const deleteReviewByAdmin = catchAsync(async (req: Request, res: Response) => {
  const reviewId = getParamAsString(req.params.id, "Review id");
  await ReviewService.deleteReviewByAdmin(reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewControllers = {
  createReview,
  getPublicReviewsByProduct,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
  getAllReviews,
  getReviewByIdForAdmin,
  moderateReview,
  replyReview,
  deleteReviewByAdmin,
};
