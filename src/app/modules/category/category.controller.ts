import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CategoryService } from "./category.service";
import httpStatus from "http-status-codes";
const createCategory = catchAsync(async (req, res) => {
  const { name, slug, description, parentId, isActive } = req.body;

  if (!name || !slug)
    throw new AppError(httpStatus.BAD_REQUEST, `Name and slug are required`);

  const category = await CategoryService.createCategory({
    name,
    slug,
    description,
    parentId,
    isActive,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category Created Successfully",
    data: category,
  });
});
const getCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategories(
    req.query as Record<string, string | undefined>,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
const updateCategory = catchAsync(async (req, res) => {
  const { name, slug, description, parentId, isActive } = req.body;
  const categoryId = req.params.id as string;
  if (!categoryId) {
    throw new AppError(httpStatus.BAD_REQUEST, `Category ID is required`);
  }

  const categories = await CategoryService.updateCategory(categoryId, {
    name,
    slug,
    description,
    parentId,
    isActive,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: categories,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategories,
  updateCategory,
};
