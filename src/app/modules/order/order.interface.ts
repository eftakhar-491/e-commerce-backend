import type { TOrderStatus, TPaymentMethod } from "../payment/payment.interface";

export interface ICreateOrderPayload {
  shippingAddressId: string;
  paymentMethod: TPaymentMethod;
  notes?: string;
  billingAddress?: Record<string, unknown>;
  shippingCost?: number;
  tax?: number;
}

export interface IOrderQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sort?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IUpdateOrderStatusPayload {
  status: TOrderStatus;
  note?: string;
}
