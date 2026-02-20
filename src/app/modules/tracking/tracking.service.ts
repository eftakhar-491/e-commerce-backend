import { randomUUID } from "crypto";
import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { GoogleAnalyticsService } from "../google-analytics/googleAnalytics.service";
import { MetaPixelService } from "../meta-pixel/metaPixel.service";
import type {
  ITrackEventPayload,
  ITrackEventResult,
  ITrackingDeliveryResult,
  ITrackingDispatchPayload,
  ITrackingEventQuery,
  ITrackingItem,
  ITrackingRequestContext,
  ITrackingUserData,
} from "./tracking.interface";

const conversionEventSelect = {
  id: true,
  eventId: true,
  eventType: true,
  userId: true,
  sessionId: true,
  orderId: true,
  productId: true,
  value: true,
  currency: true,
  sourceUrl: true,
  ipAddress: true,
  userAgent: true,
  sentToMeta: true,
  sentToGa4: true,
  metaLastSentAt: true,
  ga4LastSentAt: true,
  attemptCount: true,
  lastAttemptAt: true,
  lastError: true,
  metadata: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
  order: {
    select: {
      id: true,
      orderNumber: true,
    },
  },
  product: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
} satisfies Prisma.ConversionEventSelect;

type TConversionEventRecord = Prisma.ConversionEventGetPayload<{
  select: typeof conversionEventSelect;
}>;

interface IStoredTrackingMetadata {
  custom?: Record<string, unknown>;
  userData?: ITrackingUserData;
  items?: ITrackingItem[];
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeText = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();

  return normalized || undefined;
};

const parseStoredMetadata = (
  metadata: Prisma.JsonValue | null,
): IStoredTrackingMetadata => {
  if (!isPlainObject(metadata)) {
    return {};
  }

  const parsedMetadata: IStoredTrackingMetadata = {};

  if (isPlainObject(metadata.custom)) {
    parsedMetadata.custom = metadata.custom as Record<string, unknown>;
  }

  if (isPlainObject(metadata.userData)) {
    parsedMetadata.userData = metadata.userData as ITrackingUserData;
  }

  if (Array.isArray(metadata.items)) {
    parsedMetadata.items = metadata.items as unknown as ITrackingItem[];
  }

  return parsedMetadata;
};

const buildStoredMetadata = (payload: ITrackEventPayload) => {
  const metadata: Record<string, unknown> = {};

  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    metadata.custom = payload.metadata;
  }

  if (payload.userData) {
    metadata.userData = payload.userData;
  }

  if (payload.items?.length) {
    metadata.items = payload.items;
  }

  if (Object.keys(metadata).length === 0) {
    return undefined;
  }

  return metadata as Prisma.InputJsonValue;
};

const parseBooleanQuery = (value: string | undefined, key: string) => {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new AppError(httpStatus.BAD_REQUEST, `${key} must be true or false`);
};

const parseDateQuery = (value: string | undefined, key: string) => {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} must be a valid date`);
  }

  return parsedDate;
};

const buildWhere = (
  query: ITrackingEventQuery,
): Prisma.ConversionEventWhereInput => {
  const where: Prisma.ConversionEventWhereInput = {};
  const searchTerm = query.searchTerm?.trim();

  if (searchTerm) {
    where.OR = [
      {
        eventType: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        eventId: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        sessionId: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.eventType?.trim()) {
    where.eventType = query.eventType.trim();
  }

  if (query.userId?.trim()) {
    where.userId = query.userId.trim();
  }

  if (query.orderId?.trim()) {
    where.orderId = query.orderId.trim();
  }

  if (query.productId?.trim()) {
    where.productId = query.productId.trim();
  }

  if (query.sessionId?.trim()) {
    where.sessionId = query.sessionId.trim();
  }

  const sentToMeta = parseBooleanQuery(query.sentToMeta, "sentToMeta");

  if (sentToMeta !== undefined) {
    where.sentToMeta = sentToMeta;
  }

  const sentToGa4 = parseBooleanQuery(query.sentToGa4, "sentToGa4");

  if (sentToGa4 !== undefined) {
    where.sentToGa4 = sentToGa4;
  }

  const fromDate = parseDateQuery(query.fromDate, "fromDate");
  const toDate = parseDateQuery(query.toDate, "toDate");

  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return where;
};

const allowedSortFields = new Set([
  "createdAt",
  "eventType",
  "value",
  "attemptCount",
  "lastAttemptAt",
]);

const buildOrderBy = (
  sort: string | undefined,
): Prisma.ConversionEventOrderByWithRelationInput[] => {
  if (!sort?.trim()) {
    return [{ createdAt: "desc" }];
  }

  const orderBy = sort
    .split(",")
    .map((rawField) => rawField.trim())
    .filter(Boolean)
    .map((field) => {
      const isDescending = field.startsWith("-");
      const normalizedField = isDescending ? field.slice(1) : field;

      if (!allowedSortFields.has(normalizedField)) {
        return null;
      }

      return {
        [normalizedField]: isDescending ? "desc" : "asc",
      } as Prisma.ConversionEventOrderByWithRelationInput;
    })
    .filter(Boolean) as Prisma.ConversionEventOrderByWithRelationInput[];

  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }

  return orderBy;
};

const ensureProductExists = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
};

const ensureOrderExists = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
};

const buildDispatchPayload = (
  event: TConversionEventRecord,
): ITrackingDispatchPayload => {
  const parsedMetadata = parseStoredMetadata(event.metadata);
  const eventId = event.eventId ?? randomUUID();

  return {
    eventType: event.eventType,
    eventId,
    ...(event.userId && { userId: event.userId }),
    ...(event.sessionId && { sessionId: event.sessionId }),
    ...(event.orderId && { orderId: event.orderId }),
    ...(event.productId && { productId: event.productId }),
    ...(event.value !== null && { value: event.value }),
    currency: event.currency ?? "BDT",
    ...(event.sourceUrl && { sourceUrl: event.sourceUrl }),
    ...(event.ipAddress && { ipAddress: event.ipAddress }),
    ...(event.userAgent && { userAgent: event.userAgent }),
    ...(parsedMetadata.custom && { metadata: parsedMetadata.custom }),
    ...(parsedMetadata.userData && { userData: parsedMetadata.userData }),
    ...(parsedMetadata.items && { items: parsedMetadata.items }),
    createdAt: event.createdAt,
  };
};

const dispatchToProviders = async (
  payload: ITrackingDispatchPayload,
  options?: {
    skipMeta?: boolean;
    skipGa4?: boolean;
  },
): Promise<ITrackingDeliveryResult> => {
  const [metaResult, ga4Result] = await Promise.all([
    options?.skipMeta
      ? Promise.resolve({
          provider: "meta" as const,
          success: true,
          message: "Meta delivery skipped (already sent)",
        })
      : MetaPixelService.sendEvent(payload),
    options?.skipGa4
      ? Promise.resolve({
          provider: "ga4" as const,
          success: true,
          message: "GA4 delivery skipped (already sent)",
        })
      : GoogleAnalyticsService.sendEvent(payload),
  ]);

  return {
    meta: metaResult,
    ga4: ga4Result,
  };
};

const getDeliveryErrorMessage = (delivery: ITrackingDeliveryResult) => {
  const errors: string[] = [];

  if (!delivery.meta.success) {
    errors.push(`META: ${delivery.meta.message}`);
  }

  if (!delivery.ga4.success) {
    errors.push(`GA4: ${delivery.ga4.message}`);
  }

  if (!errors.length) {
    return null;
  }

  return errors.join(" | ");
};

const updateEventAfterDelivery = async (
  event: TConversionEventRecord,
  delivery: ITrackingDeliveryResult,
  dispatchedEventId: string,
) => {
  const now = new Date();

  const updateData: Prisma.ConversionEventUpdateInput = {
    sentToMeta: event.sentToMeta || delivery.meta.success,
    sentToGa4: event.sentToGa4 || delivery.ga4.success,
    attemptCount: {
      increment: 1,
    },
    lastAttemptAt: now,
    lastError: getDeliveryErrorMessage(delivery),
  };

  if (!event.eventId) {
    updateData.eventId = dispatchedEventId;
  }

  if (delivery.meta.success) {
    updateData.metaLastSentAt = now;
  }

  if (delivery.ga4.success) {
    updateData.ga4LastSentAt = now;
  }

  const updatedEvent = await prisma.conversionEvent.update({
    where: { id: event.id },
    data: updateData,
    select: conversionEventSelect,
  });

  return updatedEvent;
};

const trackEvent = async (
  payload: ITrackEventPayload,
  context: ITrackingRequestContext,
): Promise<ITrackEventResult> => {
  const sessionId = normalizeText(payload.sessionId);
  const sourceUrl = normalizeText(payload.sourceUrl ?? context.sourceUrl);
  const currency = payload.currency?.trim().toUpperCase() ?? "BDT";
  const userId = context.authenticatedUserId;
  const storedMetadata = buildStoredMetadata(payload);

  if (payload.productId) {
    await ensureProductExists(payload.productId);
  }

  if (payload.orderId) {
    await ensureOrderExists(payload.orderId);
  }

  if (payload.eventId) {
    const existingEvent = await prisma.conversionEvent.findUnique({
      where: { eventId: payload.eventId },
      select: conversionEventSelect,
    });

    if (existingEvent) {
      if (existingEvent.sentToMeta && existingEvent.sentToGa4) {
        return {
          event: existingEvent,
          deduplicated: true,
          delivery: {
            meta: {
              provider: "meta",
              success: true,
              message: "Meta already received this event",
            },
            ga4: {
              provider: "ga4",
              success: true,
              message: "GA4 already received this event",
            },
          },
        };
      }

      const dispatchPayload = buildDispatchPayload(existingEvent);
      const delivery = await dispatchToProviders(dispatchPayload, {
        skipMeta: existingEvent.sentToMeta,
        skipGa4: existingEvent.sentToGa4,
      });
      const updatedEvent = await updateEventAfterDelivery(
        existingEvent,
        delivery,
        dispatchPayload.eventId,
      );

      return {
        event: updatedEvent,
        deduplicated: true,
        delivery,
      };
    }
  }

  const createdEvent = await prisma.conversionEvent.create({
    data: {
      eventType: payload.eventType,
      eventId: payload.eventId ?? randomUUID(),
      ...(userId && { user: { connect: { id: userId } } }),
      ...(sessionId && { sessionId }),
      ...(payload.orderId && { order: { connect: { id: payload.orderId } } }),
      ...(payload.productId && {
        product: { connect: { id: payload.productId } },
      }),
      ...(payload.value !== undefined && { value: payload.value }),
      currency,
      ...(sourceUrl && { sourceUrl }),
      ...(context.ipAddress && { ipAddress: context.ipAddress }),
      ...(context.userAgent && { userAgent: context.userAgent }),
      ...(storedMetadata && { metadata: storedMetadata }),
    },
    select: conversionEventSelect,
  });

  const dispatchPayload = buildDispatchPayload(createdEvent);
  const delivery = await dispatchToProviders(dispatchPayload);
  const updatedEvent = await updateEventAfterDelivery(
    createdEvent,
    delivery,
    dispatchPayload.eventId,
  );

  return {
    event: updatedEvent,
    deduplicated: false,
    delivery,
  };
};

const getTrackingEvents = async (query: ITrackingEventQuery) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const where = buildWhere(query);
  const orderBy = buildOrderBy(query.sort);

  const [data, total] = await Promise.all([
    prisma.conversionEvent.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: conversionEventSelect,
    }),
    prisma.conversionEvent.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const getTrackingEventById = async (id: string) => {
  const event = await prisma.conversionEvent.findUnique({
    where: { id },
    select: conversionEventSelect,
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracking event not found");
  }

  return event;
};

const retryTrackingEvent = async (id: string) => {
  const existingEvent = await prisma.conversionEvent.findUnique({
    where: { id },
    select: conversionEventSelect,
  });

  if (!existingEvent) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracking event not found");
  }

  const dispatchPayload = buildDispatchPayload(existingEvent);
  const delivery = await dispatchToProviders(dispatchPayload, {
    skipMeta: existingEvent.sentToMeta,
    skipGa4: existingEvent.sentToGa4,
  });
  const updatedEvent = await updateEventAfterDelivery(
    existingEvent,
    delivery,
    dispatchPayload.eventId,
  );

  return {
    event: updatedEvent,
    delivery,
  };
};

export const TrackingService = {
  trackEvent,
  getTrackingEvents,
  getTrackingEventById,
  retryTrackingEvent,
};
