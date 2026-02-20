export interface ITrackingItem {
  itemId: string;
  itemName?: string;
  itemBrand?: string;
  itemCategory?: string;
  itemVariant?: string;
  price?: number;
  quantity?: number;
}

export interface ITrackingUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  externalId?: string;
  fbp?: string;
  fbc?: string;
  clientId?: string;
}

export interface ITrackEventPayload {
  eventType: string;
  eventId?: string;
  sessionId?: string;
  orderId?: string;
  productId?: string;
  value?: number;
  currency?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
  userData?: ITrackingUserData;
  items?: ITrackingItem[];
}

export interface ITrackingRequestContext {
  authenticatedUserId?: string;
  ipAddress?: string;
  userAgent?: string;
  sourceUrl?: string;
}

export interface ITrackingDispatchPayload {
  eventType: string;
  eventId: string;
  userId?: string;
  sessionId?: string;
  orderId?: string;
  productId?: string;
  value?: number;
  currency: string;
  sourceUrl?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  userData?: ITrackingUserData;
  items?: ITrackingItem[];
  createdAt: Date;
}

export interface ITrackingProviderResult {
  provider: "meta" | "ga4";
  success: boolean;
  message: string;
  response?: unknown;
}

export interface ITrackingDeliveryResult {
  meta: ITrackingProviderResult;
  ga4: ITrackingProviderResult;
}

export interface ITrackEventResult {
  event: unknown;
  delivery: ITrackingDeliveryResult;
  deduplicated: boolean;
}

export interface ITrackingEventQuery {
  searchTerm?: string;
  eventType?: string;
  userId?: string;
  orderId?: string;
  productId?: string;
  sessionId?: string;
  sentToMeta?: string;
  sentToGa4?: string;
  fromDate?: string;
  toDate?: string;
  sort?: string;
  page?: string;
  limit?: string;
}
