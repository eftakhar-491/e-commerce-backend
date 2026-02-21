import httpStatus from "http-status-codes";
import AppError from "../../../helper/AppError";
import type {
  ISslCommerzConfig,
  ISslCommerzInitPayload,
  ISslCommerzInitResult,
  ISslCommerzValidationResult,
} from "./sslCommerz.interface";

const SSL_TIMEOUT_MS = 12000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseJsonSafely = (raw: string): unknown => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const normalizeStatus = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();

  return normalized || undefined;
};

const buildInitPayload = (
  payload: ISslCommerzInitPayload,
  config: ISslCommerzConfig,
) => {
  const successUrl = new URL(config.successBackendUrl);
  successUrl.searchParams.set("tran_id", payload.transactionId);
  successUrl.searchParams.set("status", "success");

  const failUrl = new URL(config.failBackendUrl);
  failUrl.searchParams.set("tran_id", payload.transactionId);
  failUrl.searchParams.set("status", "fail");

  const cancelUrl = new URL(config.cancelBackendUrl);
  cancelUrl.searchParams.set("tran_id", payload.transactionId);
  cancelUrl.searchParams.set("status", "cancel");

  return new URLSearchParams({
    store_id: config.storeId,
    store_passwd: config.storePass,
    total_amount: payload.amount.toFixed(2),
    currency: "BDT",
    tran_id: payload.transactionId,
    success_url: successUrl.toString(),
    fail_url: failUrl.toString(),
    cancel_url: cancelUrl.toString(),
    ipn_url: config.ipnUrl,
    shipping_method: "N/A",
    product_name: "E-Commerce Order",
    product_category: "General",
    product_profile: "general",
    cus_name: payload.name || "Customer",
    cus_email: payload.email,
    cus_add1: payload.address || "N/A",
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payload.phoneNumber || "N/A",
    cus_fax: "N/A",
    ship_name: payload.name || "Customer",
    ship_add1: payload.address || "N/A",
    ship_add2: "N/A",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  });
};

const initPayment = async (
  payload: ISslCommerzInitPayload,
  config: ISslCommerzConfig,
): Promise<ISslCommerzInitResult> => {
  const formData = buildInitPayload(payload, config);

  const response = await fetch(config.paymentApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    signal: AbortSignal.timeout(SSL_TIMEOUT_MS),
  });

  const rawText = await response.text();
  const parsed = parseJsonSafely(rawText);

  if (!response.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `SSLCommerz init failed with status ${response.status}`,
    );
  }

  const gatewayPageUrl =
    isRecord(parsed) && typeof parsed.GatewayPageURL === "string"
      ? parsed.GatewayPageURL
      : null;

  return {
    rawResponse: parsed,
    gatewayPageUrl,
  };
};

const validatePayment = async (
  valId: string,
  config: Pick<ISslCommerzConfig, "validationApi" | "storeId" | "storePass">,
): Promise<ISslCommerzValidationResult> => {
  const validationUrl = new URL(config.validationApi);
  validationUrl.searchParams.set("val_id", valId);
  validationUrl.searchParams.set("store_id", config.storeId);
  validationUrl.searchParams.set("store_passwd", config.storePass);
  validationUrl.searchParams.set("v", "1");
  validationUrl.searchParams.set("format", "json");

  const response = await fetch(validationUrl.toString(), {
    method: "GET",
    signal: AbortSignal.timeout(SSL_TIMEOUT_MS),
  });

  const rawText = await response.text();
  const parsed = parseJsonSafely(rawText);

  if (!response.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `SSLCommerz validation failed with status ${response.status}`,
    );
  }

  return {
    rawResponse: parsed,
    normalizedStatus: isRecord(parsed) ? normalizeStatus(parsed.status) : undefined,
  };
};

export const SslCommerzService = {
  initPayment,
  validatePayment,
  normalizeStatus,
};
