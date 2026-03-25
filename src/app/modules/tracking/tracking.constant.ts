export const trackingSearchableFields = [
  "eventType",
  "eventId",
  "sessionId",
] as const;

export const ga4EventNameMap: Record<string, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  Search: "search",
  AddToCart: "add_to_cart",
  AddToWishlist: "add_to_wishlist",
  InitiateCheckout: "begin_checkout",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
  CompleteRegistration: "sign_up",
  Lead: "generate_lead",
  Contact: "contact",
};
