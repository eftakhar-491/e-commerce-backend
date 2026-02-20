import { envVars } from "../../config/env";
import { ga4EventNameMap } from "../tracking/tracking.constant";
import type {
  IGoogleAnalyticsTrackPayload,
  IGoogleAnalyticsTrackResult,
} from "./googleAnalytics.interface";

const GA4_TIMEOUT_MS = 8000;
const GA4_DEFAULT_ENDPOINT = "https://www.google-analytics.com/mp/collect";

const sanitizeGa4EventName = (eventType: string) => {
  const mappedEvent = ga4EventNameMap[eventType];

  if (mappedEvent) {
    return mappedEvent;
  }

  const normalized = eventType
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "custom_event";
};

const normalizeIpAddress = (ipAddress?: string) => {
  if (!ipAddress) {
    return undefined;
  }

  const normalized = ipAddress.trim();

  if (!normalized) {
    return undefined;
  }

  if (normalized.startsWith("::ffff:")) {
    return normalized.slice(7);
  }

  return normalized;
};

const getPrimitiveMetadata = (metadata?: Record<string, unknown>) => {
  if (!metadata) {
    return undefined;
  }

  const normalizedMetadata: Record<string, string | number | boolean> = {};

  Object.entries(metadata).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      normalizedMetadata[key] = value;
    }
  });

  if (Object.keys(normalizedMetadata).length === 0) {
    return undefined;
  }

  return normalizedMetadata;
};

const resolveClientId = (payload: IGoogleAnalyticsTrackPayload) => {
  const maybeClientId = payload.userData?.clientId?.trim();

  if (maybeClientId) {
    return maybeClientId;
  }

  const maybeSessionId = payload.sessionId?.trim();

  if (maybeSessionId) {
    return `${Date.now()}.${Math.abs(hashCode(maybeSessionId))}`;
  }

  return `${Date.now()}.${Math.abs(hashCode(payload.eventId))}`;
};

const hashCode = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return hash;
};

const buildGa4Payload = (payload: IGoogleAnalyticsTrackPayload) => {
  const params: Record<string, unknown> = {
    event_id: payload.eventId,
    currency: payload.currency,
    engagement_time_msec: 100,
  };

  if (payload.value !== undefined) {
    params.value = payload.value;
  }

  if (payload.orderId) {
    params.transaction_id = payload.orderId;
  }

  if (payload.sourceUrl) {
    params.page_location = payload.sourceUrl;
  }

  if (payload.productId) {
    params.item_id = payload.productId;
  }

  if (payload.items?.length) {
    params.items = payload.items.map((item) => {
      const itemPayload: Record<string, unknown> = {
        item_id: item.itemId,
      };

      if (item.itemName) {
        itemPayload.item_name = item.itemName;
      }

      if (item.itemBrand) {
        itemPayload.item_brand = item.itemBrand;
      }

      if (item.itemCategory) {
        itemPayload.item_category = item.itemCategory;
      }

      if (item.itemVariant) {
        itemPayload.item_variant = item.itemVariant;
      }

      if (item.price !== undefined) {
        itemPayload.price = item.price;
      }

      if (item.quantity !== undefined) {
        itemPayload.quantity = item.quantity;
      }

      return itemPayload;
    });
  }

  const customMetadata = getPrimitiveMetadata(payload.metadata);

  if (customMetadata) {
    Object.assign(params, customMetadata);
  }

  const requestBody: Record<string, unknown> = {
    client_id: resolveClientId(payload),
    timestamp_micros: payload.createdAt.getTime() * 1000,
    events: [
      {
        name: sanitizeGa4EventName(payload.eventType),
        params,
      },
    ],
  };

  if (payload.userId) {
    requestBody.user_id = payload.userId;
  }

  const ipOverride = normalizeIpAddress(payload.ipAddress);

  if (ipOverride) {
    requestBody.ip_override = ipOverride;
  }

  return requestBody;
};

const sendEvent = async (
  payload: IGoogleAnalyticsTrackPayload,
): Promise<IGoogleAnalyticsTrackResult> => {
  if (!envVars.GA4_MEASUREMENT_ID || !envVars.GA4_API_SECRET) {
    return {
      provider: "ga4",
      success: false,
      message: "GA4 credentials are not configured",
    };
  }

  try {
    const endpoint = new URL(envVars.GA4_ENDPOINT ?? GA4_DEFAULT_ENDPOINT);

    endpoint.searchParams.set("measurement_id", envVars.GA4_MEASUREMENT_ID);
    endpoint.searchParams.set("api_secret", envVars.GA4_API_SECRET);

    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildGa4Payload(payload)),
      signal: AbortSignal.timeout(GA4_TIMEOUT_MS),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return {
        provider: "ga4",
        success: false,
        message: `GA4 request failed with status ${response.status}`,
        response: responseText || null,
      };
    }

    return {
      provider: "ga4",
      success: true,
      message: "GA4 event sent successfully",
      response: responseText || null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send GA4 event";

    return {
      provider: "ga4",
      success: false,
      message,
    };
  }
};

export const GoogleAnalyticsService = {
  sendEvent,
};
