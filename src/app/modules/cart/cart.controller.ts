import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  IAddCartItemPayload,
  IUpdateCartItemPayload,
} from "./cart.interface";
import { CartService } from "./cart.service";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const getAuthenticatedUserId = (req: Request) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  return userId;
};

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const result = await CartService.getMyCart(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart retrieved successfully",
    data: result,
  });
});

const addItemToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const payload = req.body as IAddCartItemPayload;
  const result = await CartService.addItemToCart(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Item added to cart successfully",
    data: result,
  });
});

const updateCartItemQuantity = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const itemId = getParamAsString(req.params.itemId, "Cart item id");
  const payload = req.body as IUpdateCartItemPayload;
  const result = await CartService.updateCartItemQuantity(userId, itemId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart item updated successfully",
    data: result,
  });
});

const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const itemId = getParamAsString(req.params.itemId, "Cart item id");
  const result = await CartService.removeCartItem(userId, itemId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart item removed successfully",
    data: result,
  });
});

const clearMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const result = await CartService.clearMyCart(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart cleared successfully",
    data: result,
  });
});

export const CartControllers = {
  getMyCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart,
};
