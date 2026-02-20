import type {
  ITrackingDispatchPayload,
  ITrackingProviderResult,
} from "../tracking/tracking.interface";

export type IGoogleAnalyticsTrackPayload = ITrackingDispatchPayload;

export interface IGoogleAnalyticsTrackResult extends ITrackingProviderResult {
  provider: "ga4";
}
