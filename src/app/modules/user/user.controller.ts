import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  IAdminUpdateUserPayload,
  ICreateAddressPayload,
  IUpdateAddressPayload,
  IUpdateMePayload,
} from "./user.interface";
import { UserServices } from "./user.service";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const users = await UserServices.getAllUsers(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: users.data,
    meta: users.meta,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const user = await UserServices.getMe(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: user,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const payload = req.body as IUpdateMePayload;
  const updatedUser = await UserServices.updateMe(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = getParamAsString(req.params.id, "User id");

  const user = await UserServices.getSingleUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = getParamAsString(req.params.id, "User id");

  const payload = req.body as IAdminUpdateUserPayload;
  const user = await UserServices.updateUser(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: user,
  });
});

const createAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const payload = req.body as ICreateAddressPayload;
  const address = await UserServices.createAddress(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Address created successfully",
    data: address,
  });
});

const getMyAddresses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const addresses = await UserServices.getMyAddresses(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Addresses retrieved successfully",
    data: addresses,
  });
});

const updateMyAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const addressId = getParamAsString(req.params.addressId, "Address id");

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const payload = req.body as IUpdateAddressPayload;
  const updatedAddress = await UserServices.updateMyAddress(
    userId,
    addressId,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Address updated successfully",
    data: updatedAddress,
  });
});

const deleteMyAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const addressId = getParamAsString(req.params.addressId, "Address id");

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  await UserServices.deleteMyAddress(userId, addressId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Address deleted successfully",
    data: null,
  });
});

const setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const addressId = getParamAsString(req.params.addressId, "Address id");

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const address = await UserServices.setDefaultAddress(userId, addressId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Default address updated successfully",
    data: address,
  });
});

export const UserControllers = {
  getAllUsers,
  updateMe,
  getSingleUser,
  getMe,
  updateUser,
  createAddress,
  getMyAddresses,
  updateMyAddress,
  deleteMyAddress,
  setDefaultAddress,
};
