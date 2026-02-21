import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Role } from "../user/user.interface";
import { PaymentService } from "./payment.service";
import { sslValidationZodSchema } from "./payment.validation";

const getAuthenticatedUserId = (req: Request) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  return userId;
};

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const pickSingleString = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const parseSslPayload = (
  req: Request,
  statusOverride?: "success" | "fail" | "cancel",
) => {
  const payload = sslValidationZodSchema.parse({
    tran_id:
      pickSingleString(req.body?.tran_id) ??
      pickSingleString(req.query?.tran_id) ??
      pickSingleString(req.body?.tranId) ??
      pickSingleString(req.query?.tranId),
    transactionId:
      pickSingleString(req.body?.transactionId) ??
      pickSingleString(req.query?.transactionId),
    val_id:
      pickSingleString(req.body?.val_id) ?? pickSingleString(req.query?.val_id),
    status:
      statusOverride ??
      pickSingleString(req.body?.status) ??
      pickSingleString(req.query?.status),
    amount:
      pickSingleString(req.body?.amount) ?? pickSingleString(req.query?.amount),
  });

  return {
    tranId: payload.tran_id ?? payload.transactionId!,
    valId: payload.val_id,
    status: payload.status,
    amount:
      payload.amount === undefined ? undefined : String(payload.amount),
  };
};

const canAccessAdminResources = (req: Request) => {
  const role = req.user?.role;

  return role === Role.ADMIN || role === Role.MANAGER;
};

const getMyPaymentByOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const orderId = getParamAsString(req.params.orderId, "Order id");
  const result = await PaymentService.getOwnedPaymentByOrder(orderId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const getPaymentByOrderForAdmin = catchAsync(async (req: Request, res: Response) => {
  const orderId = getParamAsString(req.params.orderId, "Order id");
  const result = await PaymentService.getPaymentByOrderForAdmin(orderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const orderId = getParamAsString(req.params.orderId, "Order id");

  const result = await PaymentService.initiatePayment({
    orderId,
    userId,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment initiation processed successfully",
    data: result,
  });
});

const initPayment = initiatePayment;

const validateSslCallback = catchAsync(async (req: Request, res: Response) => {
  const payload = parseSslPayload(req);
  const result = await PaymentService.validateSslPayment(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.success
      ? "SSLCommerz payment validated successfully"
      : "SSLCommerz payment marked as failed",
    data: result,
  });
});

const sslSuccess = catchAsync(async (req: Request, res: Response) => {
  const payload = parseSslPayload(req, "success");
  const result = await PaymentService.validateSslPayment(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SSLCommerz success callback processed",
    data: result,
  });
});

const successPayment = sslSuccess;

const sslFail = catchAsync(async (req: Request, res: Response) => {
  const payload = parseSslPayload(req, "fail");
  const result = await PaymentService.validateSslPayment(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SSLCommerz fail callback processed",
    data: result,
  });
});

const failPayment = sslFail;

const sslCancel = catchAsync(async (req: Request, res: Response) => {
  const payload = parseSslPayload(req, "cancel");
  const result = await PaymentService.validateSslPayment(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SSLCommerz cancel callback processed",
    data: result,
  });
});

const cancelPayment = sslCancel;

const validatePayment = validateSslCallback;

const getInvoiceDownloadUrl = catchAsync(async (req: Request, res: Response) => {
  const paymentId = getParamAsString(req.params.paymentId, "Payment id");

  const invoice = canAccessAdminResources(req)
    ? await PaymentService.getInvoiceForAdmin(paymentId)
    : await PaymentService.getInvoiceForUser(paymentId, getAuthenticatedUserId(req));

  const downloadUrl = `${req.protocol}://${req.get("host")}/api/payment/invoice/${paymentId}/download`;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Invoice URL generated successfully",
    data: {
      paymentId,
      invoiceNumber: invoice.invoiceNumber,
      downloadUrl,
      invoice,
    },
  });
});

const downloadInvoice = catchAsync(async (req: Request, res: Response) => {
  const paymentId = getParamAsString(req.params.paymentId, "Payment id");

  const invoicePayload = canAccessAdminResources(req)
    ? await PaymentService.getInvoiceDownloadForAdmin(paymentId)
    : await PaymentService.getInvoiceDownloadForUser(
        paymentId,
        getAuthenticatedUserId(req),
      );

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${invoicePayload.fileName}"`,
  );
  res.status(httpStatus.OK).send(invoicePayload.html);
});

export const PaymentControllers = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  validatePayment,
  getMyPaymentByOrder,
  getPaymentByOrderForAdmin,
  initiatePayment,
  validateSslCallback,
  sslSuccess,
  sslFail,
  sslCancel,
  getInvoiceDownloadUrl,
  downloadInvoice,
};
