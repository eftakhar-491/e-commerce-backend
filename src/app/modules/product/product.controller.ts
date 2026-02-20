import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  ICreateProductPayload,
  IProductQuery,
  IUpdateProductPayload,
} from "./product.interface";
import { ProductService } from "./product.service";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ICreateProductPayload;
  const result = await ProductService.createProduct(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IProductQuery;
  const result = await ProductService.getProducts(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const productId = getParamAsString(req.params.id, "Product id");
  const result = await ProductService.getProductById(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = getParamAsString(req.params.id, "Product id");
  const payload = req.body as IUpdateProductPayload;
  const result = await ProductService.updateProduct(productId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = getParamAsString(req.params.id, "Product id");
  await ProductService.deleteProduct(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: null,
  });
});

export const ProductControllers = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
