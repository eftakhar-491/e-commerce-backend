import type {
  ITrackingDispatchPayload,
  ITrackingProviderResult,
} from "../tracking/tracking.interface";

export type IMetaPixelTrackPayload = ITrackingDispatchPayload;

export interface IMetaPixelTrackResult extends ITrackingProviderResult {
  provider: "meta";
}
