import AppError from "../../helper/AppError";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CategoryService } from "./category.service";
import httpStatus from "http-status-codes";

const createCategory = catchAsync(async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  console.log("req.files:", req.files);
  const {
    name,
    slug,
    description,
    parentId,
    isActive: status,
  } = req.body || {};

  const isActive = status === "true" ? true : false;

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
// const updateCategory = catchAsync(async (req, res) => {
//   const { name, slug, description, images, parentId, isActive } = req.body;
//   const categoryId = req.params.id as string;
//   if (!categoryId) {
//     throw new AppError(httpStatus.BAD_REQUEST, `Category ID is required`);
//   }

//   const categories = await CategoryService.updateCategory(categoryId, {
//     name,
//     slug,
//     description,
//     images,
//     parentId,
//     isActive,
//   });
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Category updated successfully",
//     data: categories,
//   });
// });
// const updateCategory = catchAsync(async (req, res) => {
//   const { name, slug, description, parentId, isActive } = req.body || {};

//   const categoryId = req.params.id as string;

//   if (!categoryId) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required");
//   }

//   let image;
//   if (req.file) {
//     image = {
//       src: req.file.path,
//       publicId: req.file.filename,
//       altText: name,
//     };
//   } else if (req.query.storageType === "custom") {
//     image = {
//       src: req.body.src || null,
//       publicId: req.body.publicId || null,
//       altText: req.body.altText || name,
//     };
//   }

//   const category = await CategoryService.updateCategory(
//     categoryId,
//     {
//       name,
//       slug,
//       description,
//       parentId,
//       isActive,
//     },
//     image,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Category updated successfully",
//     data: category,
//   });
// });
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
