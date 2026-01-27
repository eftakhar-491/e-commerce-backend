import { catchAsync } from "../../utils/catchAsync";

import httpStatus from "http-status-codes";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../helper/AppError";

const createProduct = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await ProductServices.createProduct(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const result = await ProductServices.updateProduct(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// const updateProduct = catchAsync(async (req, res) => {
//   const productId = req.params.id as string;
//   const payload = req.body;
//   const result = await ProductServices.updateProduct(productId, payload);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Product updated successfully",
//     data: result,
//   });
// });

const getAllProducts = catchAsync(async (req, res) => {
  const query = req.query as Record<string, string>;
  const result = await ProductServices.getAllProducts(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const productId = req.params.id as string;
  const result = await ProductServices.getProductById(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});



export const ProductController = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  
};
