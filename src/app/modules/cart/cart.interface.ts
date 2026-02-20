export interface IAddCartItemPayload {
  productId: string;
  variantOptionId: string;
  quantity?: number;
}

export interface IUpdateCartItemPayload {
  quantity: number;
}
