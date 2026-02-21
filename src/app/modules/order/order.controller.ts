import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  ICreateOrderPayload,
  IOrderQuery,
  IUpdateOrderStatusPayload,
} from "./order.interface";
import { OrderService } from "./order.service";

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

const createOrderFromCart = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const payload = req.body as ICreateOrderPayload;
  const result = await OrderService.createOrderFromCart(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const query = req.query as IOrderQuery;
  const result = await OrderService.getMyOrders(userId, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const orderId = getParamAsString(req.params.id, "Order id");
  const result = await OrderService.getMyOrderById(userId, orderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IOrderQuery;
  const result = await OrderService.getAllOrders(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getOrderByIdForAdmin = catchAsync(async (req: Request, res: Response) => {
  const orderId = getParamAsString(req.params.id, "Order id");
  const result = await OrderService.getOrderByIdForAdmin(orderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = getParamAsString(req.params.id, "Order id");
  const payload = req.body as IUpdateOrderStatusPayload;
  const changedBy = getAuthenticatedUserId(req);
  const result = await OrderService.updateOrderStatus(orderId, payload, changedBy);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdForAdmin,
  updateOrderStatus,
};
