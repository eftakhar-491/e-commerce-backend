import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CategoryService } from "./category.service";
import httpStatus from "http-status-codes";

const createCategory = catchAsync(async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  console.log("req.files:", req.files);
  const { name, slug, description, parentId, isActive, imageId } = req.body;

  if (!name || !slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name and slug are required");
  }

  const result = await CategoryService.createCategory(
    {
      name,
      slug,
      description,
      parentId,
      isActive,
      imageId,
    },
    req,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
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
  const categoryId = req.params.id as string;

  if (!categoryId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required");
  }

  const result = await CategoryService.updateCategory(
    categoryId,
    req.body,
    req,
  );

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
  updateCategory,
};
