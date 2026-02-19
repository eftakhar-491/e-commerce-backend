import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CategoryService } from "./category.service";
import type {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ICreateCategoryPayload;
  const result = await CategoryService.createCategory(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string | undefined>;
  const result = await CategoryService.getCategories(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getPublicCollections = catchAsync(async (_: Request, res: Response) => {
  const result = await CategoryService.getPublicCollections();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Collections retrieved successfully",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const categoryId = getParamAsString(req.params.id, "Category id");
  const result = await CategoryService.getCategoryById(categoryId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = getParamAsString(req.params.id, "Category id");
  const payload = req.body as IUpdateCategoryPayload;
  const result = await CategoryService.updateCategory(categoryId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategories,
  getPublicCollections,
  getCategoryById,
  updateCategory,
};
