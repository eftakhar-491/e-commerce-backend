export interface ISslCommerzInitPayload {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface ISslCommerzConfig {
  storeId: string;
  storePass: string;
  paymentApi: string;
  validationApi: string;
  successBackendUrl: string;
  failBackendUrl: string;
  cancelBackendUrl: string;
  ipnUrl: string;
}

export interface ISslCommerzInitResult {
  rawResponse: unknown;
  gatewayPageUrl: string | null;
}

export interface ISslCommerzValidationResult {
  rawResponse: unknown;
  normalizedStatus?: string | undefined;
}
