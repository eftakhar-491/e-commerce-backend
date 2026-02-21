import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import { envVars } from "../../config/env";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/sendEmail";
import type {
  ICreateOrderPaymentPayload,
  IInitiatePaymentPayload,
  IInvoiceSummary,
  ISslCommerzValidationPayload,
  TOrderStatus,
  TPaymentMethod,
} from "./payment.interface";
import type {
  ISslCommerzConfig,
  ISslCommerzInitPayload,
} from "./providers/sslCommerz.interface";
import { SslCommerzService } from "./providers/sslCommerz.service";

const sslMethodSet = new Set<TPaymentMethod>([
  "BKASH",
  "NAGAD",
  "ROCKET",
  "CREDIT_CARD",
  "BANK_TRANSFER",
]);

const paymentSelect = {
  id: true,
  orderId: true,
  method: true,
  status: true,
  amount: true,
  transactionId: true,
  gatewayResponse: true,
  paidAt: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true,
  order: {
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      subtotal: true,
      discountTotal: true,
      shippingCost: true,
      tax: true,
      placedAt: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      address: {
        select: {
          id: true,
          street: true,
          city: true,
          state: true,
          zipCode: true,
          country: true,
        },
      },
      items: {
        orderBy: [{ createdAt: "asc" }],
        select: {
          id: true,
          productName: true,
          productSku: true,
          quantity: true,
          unitPrice: true,
          total: true,
        },
      },
    },
  },
} satisfies Prisma.PaymentSelect;

type TPaymentRecord = Prisma.PaymentGetPayload<{ select: typeof paymentSelect }>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumberOrNull = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const mergeGatewayResponse = (
  current: Prisma.JsonValue | null,
  patch: Record<string, unknown>,
) => {
  if (isRecord(current)) {
    return {
      ...current,
      ...patch,
    } as Prisma.InputJsonValue;
  }

  return patch as Prisma.InputJsonValue;
};

const ensureSslConfig = (): ISslCommerzConfig => {
  const missingKeys: string[] = [];

  if (!envVars.SSL?.STORE_ID) {
    missingKeys.push("SSL_STORE_ID");
  }

  if (!envVars.SSL?.STORE_PASS) {
    missingKeys.push("SSL_STORE_PASS");
  }

  if (!envVars.SSL?.PAYMENT_API) {
    missingKeys.push("SSL_PAYMENT_API");
  }

  if (!envVars.SSL?.VALIDATION_API) {
    missingKeys.push("SSL_VALIDATION_API");
  }

  if (!envVars.SSL?.SUCCESS_BACKEND_URL) {
    missingKeys.push("SSL_SUCCESS_BACKEND_URL");
  }

  if (!envVars.SSL?.FAIL_BACKEND_URL) {
    missingKeys.push("SSL_FAIL_BACKEND_URL");
  }

  if (!envVars.SSL?.CANCEL_BACKEND_URL) {
    missingKeys.push("SSL_CANCEL_BACKEND_URL");
  }

  if (!envVars.SSL?.IPN_URL) {
    missingKeys.push("SSL_IPN_URL");
  }

  if (missingKeys.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `SSLCommerz credentials are missing: ${missingKeys.join(", ")}`,
    );
  }

  return {
    storeId: envVars.SSL.STORE_ID!,
    storePass: envVars.SSL.STORE_PASS!,
    paymentApi: envVars.SSL.PAYMENT_API!,
    validationApi: envVars.SSL.VALIDATION_API!,
    successBackendUrl: envVars.SSL.SUCCESS_BACKEND_URL!,
    failBackendUrl: envVars.SSL.FAIL_BACKEND_URL!,
    cancelBackendUrl: envVars.SSL.CANCEL_BACKEND_URL!,
    ipnUrl: envVars.SSL.IPN_URL!,
  };
};

const buildSslCustomerAddress = (payment: TPaymentRecord) => {
  const addressParts = [
    payment.order.address.street,
    payment.order.address.city,
    payment.order.address.state,
  ].filter(Boolean);

  if (addressParts.length === 0) {
    return "N/A";
  }

  return addressParts.join(", ");
};

const getProviderInvoice = (
  gatewayResponse: Prisma.JsonValue | null,
): Record<string, unknown> | null => {
  if (!isRecord(gatewayResponse)) {
    return null;
  }

  const providerData: Record<string, unknown> = {};

  if ("sslInit" in gatewayResponse) {
    providerData.sslInit = gatewayResponse.sslInit;
  }

  if ("sslValidation" in gatewayResponse) {
    providerData.sslValidation = gatewayResponse.sslValidation;
  }

  if (Object.keys(providerData).length === 0) {
    return null;
  }

  return providerData;
};

const buildInvoiceSummary = (payment: TPaymentRecord): IInvoiceSummary => {
  const issuedAt = payment.paidAt ?? payment.createdAt;
  const invoiceNumber = `INV-${payment.order.orderNumber}`;

  return {
    paymentId: payment.id,
    invoiceNumber,
    orderId: payment.order.id,
    orderNumber: payment.order.orderNumber,
    customerName: payment.order.user.name ?? "Customer",
    customerEmail: payment.order.user.email,
    paymentMethod: payment.method as TPaymentMethod,
    paymentStatus: payment.status,
    transactionId: payment.transactionId,
    orderStatus: payment.order.status,
    issuedAt: issuedAt.toISOString(),
    paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
    subtotal: payment.order.subtotal.toString(),
    discountTotal: payment.order.discountTotal.toString(),
    shippingCost: payment.order.shippingCost.toString(),
    tax: payment.order.tax.toString(),
    total: payment.order.total.toString(),
    items: payment.order.items.map((item) => ({
      productName: item.productName,
      productSku: item.productSku,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      total: item.total.toString(),
    })),
    providerInvoice: getProviderInvoice(payment.gatewayResponse),
  };
};

const renderInvoiceHtml = (invoice: IInvoiceSummary) => {
  const rows = invoice.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.productName)}</td>
          <td>${escapeHtml(item.productSku)}</td>
          <td>${item.quantity}</td>
          <td>${item.unitPrice}</td>
          <td>${item.total}</td>
        </tr>
      `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(invoice.invoiceNumber)}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 32px; color: #111; }
      h1 { margin-bottom: 8px; }
      p { margin: 2px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #d4d4d4; padding: 8px; text-align: left; }
      th { background: #f3f3f3; }
      .meta { margin-bottom: 16px; }
      .summary { margin-top: 16px; }
      .summary p { font-weight: 600; }
    </style>
  </head>
  <body>
    <h1>Invoice ${escapeHtml(invoice.invoiceNumber)}</h1>
    <div class="meta">
      <p><strong>Order:</strong> ${escapeHtml(invoice.orderNumber)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(invoice.customerName)} (${escapeHtml(
        invoice.customerEmail,
      )})</p>
      <p><strong>Payment:</strong> ${escapeHtml(invoice.paymentMethod)} / ${escapeHtml(
        invoice.paymentStatus,
      )}</p>
      <p><strong>Transaction:</strong> ${escapeHtml(invoice.transactionId ?? "N/A")}</p>
      <p><strong>Issued At:</strong> ${escapeHtml(invoice.issuedAt)}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div class="summary">
      <p>Subtotal: ${escapeHtml(invoice.subtotal)}</p>
      <p>Discount: ${escapeHtml(invoice.discountTotal)}</p>
      <p>Shipping: ${escapeHtml(invoice.shippingCost)}</p>
      <p>Tax: ${escapeHtml(invoice.tax)}</p>
      <p>Grand Total: ${escapeHtml(invoice.total)}</p>
    </div>
  </body>
</html>
  `.trim();
};

const getPaymentByIdForUser = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      order: {
        userId,
      },
    },
    select: paymentSelect,
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

const getPaymentByIdForAdmin = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: paymentSelect,
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

const getOwnedPaymentByOrder = async (orderId: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      orderId,
      order: {
        userId,
      },
    },
    select: paymentSelect,
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

const getPaymentByOrderForAdmin = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
    select: paymentSelect,
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

const createOrderPayment = async (
  tx: Prisma.TransactionClient,
  payload: ICreateOrderPaymentPayload,
) => {
  const payment = await tx.payment.create({
    data: {
      orderId: payload.orderId,
      method: payload.method,
      status: "PENDING",
      amount: payload.amount,
      transactionId: null,
      paidAt: null,
      errorMessage: null,
    },
    select: {
      id: true,
      orderId: true,
      method: true,
      status: true,
      amount: true,
      transactionId: true,
      paidAt: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return payment;
};

const getInvoiceForUser = async (paymentId: string, userId: string) => {
  const payment = await getPaymentByIdForUser(paymentId, userId);

  return buildInvoiceSummary(payment);
};

const getInvoiceForAdmin = async (paymentId: string) => {
  const payment = await getPaymentByIdForAdmin(paymentId);

  return buildInvoiceSummary(payment);
};

const getInvoiceDownloadForUser = async (paymentId: string, userId: string) => {
  const invoice = await getInvoiceForUser(paymentId, userId);
  const html = renderInvoiceHtml(invoice);

  return {
    invoice,
    html,
    fileName: `${invoice.invoiceNumber}.html`,
  };
};

const getInvoiceDownloadForAdmin = async (paymentId: string) => {
  const invoice = await getInvoiceForAdmin(paymentId);
  const html = renderInvoiceHtml(invoice);

  return {
    invoice,
    html,
    fileName: `${invoice.invoiceNumber}.html`,
  };
};

const sendInvoiceEmailInternal = async (
  payment: TPaymentRecord,
  reason: "PAYMENT_SUCCESS" | "COD_ORDER_PLACED",
) => {
  const invoice = buildInvoiceSummary(payment);
  const invoiceHtml = renderInvoiceHtml(invoice);

  const existingInvoiceMeta =
    isRecord(payment.gatewayResponse) && isRecord(payment.gatewayResponse.invoice)
      ? payment.gatewayResponse.invoice
      : null;

  if (existingInvoiceMeta && typeof existingInvoiceMeta.emailSentAt === "string") {
    return;
  }

  const paymentNote =
    reason === "COD_ORDER_PLACED"
      ? "Cash on delivery selected. Please pay while receiving your order."
      : "Your payment has been completed successfully.";

  await sendEmail({
    to: invoice.customerEmail,
    subject: `Invoice ${invoice.invoiceNumber} - ${invoice.orderNumber}`,
    templateName: "orderInvoice",
    templateData: {
      customerName: invoice.customerName,
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: invoice.orderNumber,
      paymentMethod: invoice.paymentMethod,
      paymentStatus: invoice.paymentStatus,
      transactionId: invoice.transactionId ?? "N/A",
      issuedAt: invoice.issuedAt,
      total: invoice.total,
      paymentNote,
      items: invoice.items,
    },
    attachments: [
      {
        filename: `${invoice.invoiceNumber}.html`,
        content: invoiceHtml,
        contentType: "text/html",
      },
    ],
  });

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      gatewayResponse: mergeGatewayResponse(payment.gatewayResponse, {
        invoice: {
          emailSentAt: new Date().toISOString(),
          reason,
          invoiceNumber: invoice.invoiceNumber,
        },
      }),
    },
  });
};

const sendInvoiceEmailForOrder = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
    select: paymentSelect,
  });

  if (!payment) {
    return;
  }

  if (payment.method !== "CASH_ON_DELIVERY") {
    return;
  }

  await sendInvoiceEmailInternal(payment, "COD_ORDER_PLACED");
};

const sendInvoiceEmailForPaymentSuccess = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: paymentSelect,
  });

  if (!payment) {
    return;
  }

  if (payment.status !== "SUCCESS") {
    return;
  }

  await sendInvoiceEmailInternal(payment, "PAYMENT_SUCCESS");
};

const syncPaymentWithOrderStatus = async (
  tx: Prisma.TransactionClient,
  orderId: string,
  nextStatus: TOrderStatus,
) => {
  const payment = await tx.payment.findUnique({
    where: { orderId },
    select: {
      id: true,
      method: true,
      status: true,
    },
  });

  if (!payment) {
    return null;
  }

  if (payment.method !== "CASH_ON_DELIVERY") {
    return payment;
  }

  if (nextStatus === "DELIVERED" && payment.status === "PENDING") {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
        errorMessage: null,
      },
      select: {
        id: true,
        method: true,
        status: true,
        paidAt: true,
      },
    });
  }

  if (nextStatus === "CANCELLED" && payment.status === "PENDING") {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        errorMessage: "Order cancelled before payment collection",
      },
      select: {
        id: true,
        method: true,
        status: true,
        paidAt: true,
      },
    });
  }

  if (
    nextStatus === "REFUNDED" &&
    (payment.status === "SUCCESS" || payment.status === "PROCESSING")
  ) {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
      },
      select: {
        id: true,
        method: true,
        status: true,
        paidAt: true,
      },
    });
  }

  return payment;
};

const initiatePayment = async (payload: IInitiatePaymentPayload) => {
  const payment = await getOwnedPaymentByOrder(payload.orderId, payload.userId);

  if (payment.status === "SUCCESS") {
    return {
      payment,
      requiresRedirect: false,
      gatewayPageUrl: null,
      message: "Payment is already completed",
    };
  }

  if (payment.method === "CASH_ON_DELIVERY") {
    return {
      payment,
      requiresRedirect: false,
      gatewayPageUrl: null,
      message: "Cash on delivery does not require gateway payment",
    };
  }

  if (!sslMethodSet.has(payment.method as TPaymentMethod)) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      `${payment.method} payment initiation is not implemented yet`,
    );
  }

  const transactionId =
    payment.transactionId ?? `SSL-${payment.order.orderNumber}-${Date.now()}`;

  const sslPayload: ISslCommerzInitPayload = {
    amount: Number(payment.amount),
    transactionId,
    name: payment.order.user.name ?? "Customer",
    email: payment.order.user.email,
    phoneNumber: payment.order.user.phone ?? "N/A",
    address: buildSslCustomerAddress(payment),
  };

  const sslResult = await SslCommerzService.initPayment(
    sslPayload,
    ensureSslConfig(),
  );

  if (!sslResult.gatewayPageUrl) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "SSLCommerz did not return a gateway redirect URL",
    );
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "PROCESSING",
      transactionId,
      gatewayResponse: mergeGatewayResponse(payment.gatewayResponse, {
        sslInit: sslResult.rawResponse,
      }),
      errorMessage: null,
    },
    select: paymentSelect,
  });

  return {
    payment: updatedPayment,
    requiresRedirect: true,
    gatewayPageUrl: sslResult.gatewayPageUrl,
    message: "Payment initiated successfully",
  };
};

const validateSslPayment = async (payload: ISslCommerzValidationPayload) => {
  const tranId = payload.tranId.trim();

  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: tranId,
    },
    select: paymentSelect,
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found for transaction");
  }

  if (payment.method === "CASH_ON_DELIVERY") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This transaction does not belong to an online payment method",
    );
  }

  if (payment.status === "SUCCESS") {
    return {
      payment,
      success: true,
      validationResponse: null,
    };
  }

  const callbackStatus = SslCommerzService.normalizeStatus(payload.status);

  if (
    (callbackStatus === "SUCCESS" ||
      callbackStatus === "VALID" ||
      callbackStatus === "VALIDATED") &&
    !payload.valId
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "val_id is required for successful payment validation",
    );
  }

  const sslConfig = ensureSslConfig();
  const validationResult = payload.valId
    ? await SslCommerzService.validatePayment(payload.valId, {
        validationApi: sslConfig.validationApi,
        storeId: sslConfig.storeId,
        storePass: sslConfig.storePass,
      })
    : null;

  const validationStatus = validationResult?.normalizedStatus;
  const validationPayload = validationResult?.rawResponse;

  if (validationPayload && isRecord(validationPayload)) {
    const validatedTranId = validationPayload.tran_id;

    if (typeof validatedTranId === "string" && validatedTranId !== tranId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Transaction id mismatch in validation response",
      );
    }

    const validatedAmount = toNumberOrNull(validationPayload.amount);

    if (validatedAmount !== null) {
      const expectedAmount = Number(payment.amount);

      if (Math.abs(validatedAmount - expectedAmount) > 0.01) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Payment amount mismatch in validation response",
        );
      }
    }
  }

  const isSuccess =
    validationStatus === "VALID" ||
    validationStatus === "VALIDATED" ||
    validationStatus === "SUCCESS" ||
    (!validationStatus &&
      (callbackStatus === "VALID" ||
        callbackStatus === "VALIDATED" ||
        callbackStatus === "SUCCESS"));

  const isCancelled = callbackStatus === "CANCEL" || callbackStatus === "CANCELED";

  const errorMessage = isSuccess
    ? null
    : isCancelled
      ? "Payment was cancelled by customer"
      : `Payment validation failed${callbackStatus ? ` (${callbackStatus})` : ""}`;

  const now = new Date();

  const updatedPayment = await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: isSuccess ? "SUCCESS" : "FAILED",
        paidAt: isSuccess ? now : null,
        errorMessage,
        gatewayResponse: mergeGatewayResponse(payment.gatewayResponse, {
          sslCallback: {
            tran_id: tranId,
            val_id: payload.valId ?? null,
            status: payload.status ?? null,
            amount: payload.amount ?? null,
          },
          sslValidation: validationResult?.rawResponse ?? null,
        }),
      },
      select: paymentSelect,
    });

    if (isSuccess && payment.order.status === "PENDING") {
      await tx.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          status: "CONFIRMED",
          processedAt: now,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: payment.orderId,
          status: "CONFIRMED",
          note: "Online payment confirmed",
          changedBy: "system",
        },
      });
    }

    const refreshedPayment = await tx.payment.findUnique({
      where: {
        id: payment.id,
      },
      select: paymentSelect,
    });

    if (!refreshedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    return refreshedPayment;
  });

  if (isSuccess) {
    try {
      await sendInvoiceEmailForPaymentSuccess(updatedPayment.id);
    } catch (error) {
      console.error("Failed to send payment success invoice email", error);
    }
  }

  return {
    payment: updatedPayment,
    success: isSuccess,
    validationResponse: validationResult?.rawResponse ?? null,
  };
};

export const PaymentService = {
  createOrderPayment,
  syncPaymentWithOrderStatus,
  initiatePayment,
  validateSslPayment,
  getOwnedPaymentByOrder,
  getPaymentByOrderForAdmin,
  getInvoiceForUser,
  getInvoiceForAdmin,
  getInvoiceDownloadForUser,
  getInvoiceDownloadForAdmin,
  sendInvoiceEmailForOrder,
  sendInvoiceEmailForPaymentSuccess,
};
