import { createHash } from "crypto";
import { envVars } from "../../config/env";
import type { IMetaPixelTrackResult } from "./metaPixel.interface";
import type { ITrackingItem } from "../tracking/tracking.interface";
import type { IMetaPixelTrackPayload } from "./metaPixel.interface";

const META_GRAPH_API_VERSION = "v21.0";
const META_TIMEOUT_MS = 8000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hashValue = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

const normalizeText = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  return normalized || undefined;
};

const normalizePhone = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/[^0-9]/g, "");

  return normalized || undefined;
};

const hashNormalizedValue = (value?: string) => {
  const normalized = normalizeText(value);

  if (!normalized) {
    return undefined;
  }

  return hashValue(normalized);
};

const hashPhoneValue = (value?: string) => {
  const normalizedPhone = normalizePhone(value);

  if (!normalizedPhone) {
    return undefined;
  }

  return hashValue(normalizedPhone);
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

const buildMetaContents = (items?: ITrackingItem[]) => {
  if (!items?.length) {
    return undefined;
  }

  const contents = items.map((item) => {
    const content: Record<string, unknown> = {
      id: item.itemId,
    };

    if (item.quantity !== undefined) {
      content.quantity = item.quantity;
    }

    if (item.price !== undefined) {
      content.item_price = item.price;
    }

    return content;
  });

  return contents.length ? contents : undefined;
};

const buildMetaPayload = (payload: IMetaPixelTrackPayload) => {
  const normalizedIpAddress = normalizeIpAddress(payload.ipAddress);
  const userData: Record<string, unknown> = {};

  if (normalizedIpAddress) {
    userData.client_ip_address = normalizedIpAddress;
  }

  if (payload.userAgent) {
    userData.client_user_agent = payload.userAgent;
  }

  const hashedEmail = hashNormalizedValue(payload.userData?.email);
  const hashedPhone = hashPhoneValue(payload.userData?.phone);
  const hashedFirstName = hashNormalizedValue(payload.userData?.firstName);
  const hashedLastName = hashNormalizedValue(payload.userData?.lastName);
  const hashedCity = hashNormalizedValue(payload.userData?.city);
  const hashedState = hashNormalizedValue(payload.userData?.state);
  const hashedCountry = hashNormalizedValue(payload.userData?.country);
  const hashedZip = hashNormalizedValue(payload.userData?.zip);
  const hashedExternalId = hashNormalizedValue(
    payload.userData?.externalId ?? payload.userId,
  );

  if (hashedEmail) {
    userData.em = [hashedEmail];
  }

  if (hashedPhone) {
    userData.ph = [hashedPhone];
  }

  if (hashedFirstName) {
    userData.fn = [hashedFirstName];
  }

  if (hashedLastName) {
    userData.ln = [hashedLastName];
  }

  if (hashedCity) {
    userData.ct = [hashedCity];
  }

  if (hashedState) {
    userData.st = [hashedState];
  }

  if (hashedCountry) {
    userData.country = [hashedCountry];
  }

  if (hashedZip) {
    userData.zp = [hashedZip];
  }

  if (hashedExternalId) {
    userData.external_id = [hashedExternalId];
  }

  if (payload.userData?.fbp) {
    userData.fbp = payload.userData.fbp;
  }

  if (payload.userData?.fbc) {
    userData.fbc = payload.userData.fbc;
  }

  const contents = buildMetaContents(payload.items);
  const contentIds = payload.items?.map((item) => item.itemId) ?? [];
  const totalItems =
    payload.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;
  const inferredValue = payload.items?.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0,
  );

  const hasInferredValue =
    typeof inferredValue === "number" && Number.isFinite(inferredValue) && inferredValue > 0;
  const value = payload.value ?? (hasInferredValue ? inferredValue : undefined);

  const customData: Record<string, unknown> = {};

  if (payload.currency) {
    customData.currency = payload.currency;
  }

  if (value !== undefined) {
    customData.value = value;
  }

  if (payload.orderId) {
    customData.order_id = payload.orderId;
  }

  if (contentIds.length > 0) {
    customData.content_ids = contentIds;
    customData.content_type = "product";
  }

  if (contents?.length) {
    customData.contents = contents;
  }

  if (totalItems > 0) {
    customData.num_items = totalItems;
  }

  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    customData.custom_properties = payload.metadata;
  }

  const eventData: Record<string, unknown> = {
    event_name: payload.eventType,
    event_time: Math.floor(payload.createdAt.getTime() / 1000),
    event_id: payload.eventId,
    action_source: "website",
  };

  if (payload.sourceUrl) {
    eventData.event_source_url = payload.sourceUrl;
  }

  if (Object.keys(userData).length > 0) {
    eventData.user_data = userData;
  }

  if (Object.keys(customData).length > 0) {
    eventData.custom_data = customData;
  }

  const requestBody: Record<string, unknown> = {
    data: [eventData],
  };

  if (envVars.META_TEST_EVENT_CODE) {
    requestBody.test_event_code = envVars.META_TEST_EVENT_CODE;
  }

  return requestBody;
};

const sendEvent = async (
  payload: IMetaPixelTrackPayload,
): Promise<IMetaPixelTrackResult> => {
  if (!envVars.META_PIXEL_ID || !envVars.META_CAPI_ACCESS_TOKEN) {
    return {
      provider: "meta",
      success: false,
      message: "Meta Pixel credentials are not configured",
    };
  }

  try {
    const endpoint = new URL(
      `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${envVars.META_PIXEL_ID}/events`,
    );

    endpoint.searchParams.set("access_token", envVars.META_CAPI_ACCESS_TOKEN);

    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildMetaPayload(payload)),
      signal: AbortSignal.timeout(META_TIMEOUT_MS),
    });

    const responseText = await response.text();
    let parsedResponse: unknown = null;

    if (responseText) {
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = responseText;
      }
    }

    if (!response.ok) {
      return {
        provider: "meta",
        success: false,
        message: `Meta CAPI request failed with status ${response.status}`,
        response: parsedResponse,
      };
    }

    if (isRecord(parsedResponse) && "error" in parsedResponse) {
      const errorValue = parsedResponse.error;

      if (isRecord(errorValue) && typeof errorValue.message === "string") {
        return {
          provider: "meta",
          success: false,
          message: errorValue.message,
          response: parsedResponse,
        };
      }

      return {
        provider: "meta",
        success: false,
        message: "Meta CAPI returned an unknown error",
        response: parsedResponse,
      };
    }

    return {
      provider: "meta",
      success: true,
      message: "Meta event sent successfully",
      response: parsedResponse,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send Meta event";

    return {
      provider: "meta",
      success: false,
      message,
    };
  }
};

export const MetaPixelService = {
  sendEvent,
};
