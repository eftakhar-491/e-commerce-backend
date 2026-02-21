import type { Prisma } from "../../../../generated/prisma/client";

export type TPaymentMethod =
  | "CASH_ON_DELIVERY"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "CREDIT_CARD"
  | "BANK_TRANSFER";

export type TPaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type TOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export interface ICreateOrderPaymentPayload {
  orderId: string;
  method: TPaymentMethod;
  amount: Prisma.Decimal;
}

export interface IPaymentProviderCreateResult {
  status: TPaymentStatus;
  transactionId?: string | null;
  gatewayResponse?: Prisma.InputJsonValue;
  paidAt?: Date | null;
  errorMessage?: string | null;
}

export interface IPaymentProvider {
  method: TPaymentMethod;
  createPayment(
    payload: ICreateOrderPaymentPayload,
  ): Promise<IPaymentProviderCreateResult>;
}

export interface IInitiatePaymentPayload {
  orderId: string;
  userId: string;
}

export interface ISslCommerzValidationPayload {
  tranId: string;
  valId?: string | undefined;
  status?: string | undefined;
  amount?: string | undefined;
}

export interface IInvoiceItem {
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface IInvoiceSummary {
  paymentId: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;
  transactionId: string | null;
  orderStatus: string;
  issuedAt: string;
  paidAt: string | null;
  subtotal: string;
  discountTotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  items: IInvoiceItem[];
  providerInvoice?: Record<string, unknown> | null;
}
