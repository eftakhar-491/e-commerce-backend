export interface ICreateReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface IUpdateMyReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface IModerateReviewPayload {
  isApproved?: boolean;
  isVerifiedPurchase?: boolean;
}

export interface IReplyReviewPayload {
  adminReply: string | null;
}

export interface IReviewQuery {
  page?: string;
  limit?: string;
  sort?: string;
  searchTerm?: string;
  productId?: string;
  userId?: string;
  isApproved?: string;
  isVerifiedPurchase?: string;
  rating?: string;
  minRating?: string;
  maxRating?: string;
}
