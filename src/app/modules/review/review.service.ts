import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  ICreateReviewPayload,
  IModerateReviewPayload,
  IReplyReviewPayload,
  IReviewQuery,
  IUpdateMyReviewPayload,
} from "./review.interface";

const sortableFields = ["createdAt", "updatedAt", "rating"] as const;

const publicReviewSelect = {
  id: true,
  productId: true,
  rating: true,
  title: true,
  comment: true,
  isVerifiedPurchase: true,
  helpfulVotes: true,
  notHelpfulVotes: true,
  adminReply: true,
  adminRepliedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.ReviewSelect;

const myReviewSelect = {
  ...publicReviewSelect,
  isApproved: true,
  product: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
} satisfies Prisma.ReviewSelect;

const adminReviewSelect = {
  id: true,
  userId: true,
  productId: true,
  rating: true,
  title: true,
  comment: true,
  isApproved: true,
  isVerifiedPurchase: true,
  helpfulVotes: true,
  notHelpfulVotes: true,
  adminReply: true,
  adminRepliedAt: true,
  adminRepliedBy: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  product: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  admin: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ReviewSelect;

const getPagination = (query: IReviewQuery) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const parseBooleanQuery = (value: string, key: string) => {
  if (value !== "true" && value !== "false") {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} query must be true or false`);
  }

  return value === "true";
};

const parseRatingQuery = (value: string, key: string) => {
  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} query must be an integer between 1 and 5`);
  }

  return rating;
};

const buildOrderBy = (
  sort: string | undefined,
): Prisma.ReviewOrderByWithRelationInput[] => {
  if (!sort) {
    return [{ createdAt: "desc" }];
  }

  const orderBy = sort
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const direction = field.startsWith("-") ? "desc" : "asc";
      const normalizedField = field.replace(/^-/, "");

      if (!sortableFields.includes(normalizedField as (typeof sortableFields)[number])) {
        return null;
      }

      return {
        [normalizedField]: direction,
      } as Prisma.ReviewOrderByWithRelationInput;
    })
    .filter(
      (value): value is Prisma.ReviewOrderByWithRelationInput =>
        value !== null,
    );

  if (!orderBy.length) {
    return [{ createdAt: "desc" }];
  }

  return orderBy;
};

const addSearchFilter = (where: Prisma.ReviewWhereInput, searchTerm?: string) => {
  if (!searchTerm?.trim()) {
    return;
  }

  where.OR = [
    {
      title: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    {
      comment: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
  ];
};

const addRatingFilters = (where: Prisma.ReviewWhereInput, query: IReviewQuery) => {
  if (query.rating !== undefined) {
    where.rating = parseRatingQuery(query.rating, "rating");
    return;
  }

  const ratingFilter: Prisma.IntFilter = {};

  if (query.minRating !== undefined) {
    ratingFilter.gte = parseRatingQuery(query.minRating, "minRating");
  }

  if (query.maxRating !== undefined) {
    ratingFilter.lte = parseRatingQuery(query.maxRating, "maxRating");
  }

  if (
    ratingFilter.gte !== undefined &&
    ratingFilter.lte !== undefined &&
    ratingFilter.gte > ratingFilter.lte
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "minRating cannot be greater than maxRating",
    );
  }

  if (ratingFilter.gte !== undefined || ratingFilter.lte !== undefined) {
    where.rating = ratingFilter;
  }
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

const createReview = async (userId: string, payload: ICreateReviewPayload) => {
  await ensureProductExists(payload.productId);

  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId: payload.productId,
    },
    select: { id: true },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this product",
    );
  }

  const orderedItem = await prisma.orderItem.findFirst({
    where: {
      productId: payload.productId,
      order: {
        userId,
      },
    },
    select: { id: true },
  });

  const createdReview = await prisma.review.create({
    data: {
      userId,
      productId: payload.productId,
      rating: payload.rating,
      title: payload.title ?? null,
      comment: payload.comment ?? null,
      isVerifiedPurchase: Boolean(orderedItem),
    },
    select: myReviewSelect,
  });

  return createdReview;
};

const getPublicReviewsByProduct = async (
  productId: string,
  query: IReviewQuery,
) => {
  await ensureProductExists(productId);

  const { page, limit, skip } = getPagination(query);

  const where: Prisma.ReviewWhereInput = {
    productId,
    isApproved: true,
  };

  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);

  const [data, total, aggregate, grouped] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: publicReviewSelect,
    }),
    prisma.review.count({ where }),
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where,
      _count: { _all: true },
    }),
  ]);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: grouped.find((item) => item.rating === rating)?._count._all ?? 0,
  }));

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    summary: {
      totalReviews: aggregate._count._all,
      averageRating: aggregate._avg.rating
        ? Number(aggregate._avg.rating.toFixed(2))
        : 0,
      ratingBreakdown,
    },
    data,
  };
};

const getMyReviews = async (userId: string, query: IReviewQuery) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.ReviewWhereInput = {
    userId,
  };

  if (query.productId !== undefined) {
    where.productId = query.productId;
  }

  if (query.isApproved !== undefined) {
    where.isApproved = parseBooleanQuery(query.isApproved, "isApproved");
  }

  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: myReviewSelect,
    }),
    prisma.review.count({ where }),
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

const updateMyReview = async (
  userId: string,
  reviewId: string,
  payload: IUpdateMyReviewPayload,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this review",
    );
  }

  const updateData: Prisma.ReviewUncheckedUpdateInput = {
    isApproved: false,
    adminReply: null,
    adminRepliedAt: null,
    adminRepliedBy: null,
  };

  if (payload.rating !== undefined) {
    updateData.rating = payload.rating;
  }

  if (payload.title !== undefined) {
    updateData.title = payload.title;
  }

  if (payload.comment !== undefined) {
    updateData.comment = payload.comment;
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    select: myReviewSelect,
  });

  return updatedReview;
};

const deleteMyReview = async (userId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this review",
    );
  }

  await prisma.review.delete({
    where: { id: review.id },
  });
};

const getAllReviews = async (query: IReviewQuery) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.ReviewWhereInput = {};

  if (query.productId !== undefined) {
    where.productId = query.productId;
  }

  if (query.userId !== undefined) {
    where.userId = query.userId;
  }

  if (query.isApproved !== undefined) {
    where.isApproved = parseBooleanQuery(query.isApproved, "isApproved");
  }

  if (query.isVerifiedPurchase !== undefined) {
    where.isVerifiedPurchase = parseBooleanQuery(
      query.isVerifiedPurchase,
      "isVerifiedPurchase",
    );
  }

  addSearchFilter(where, query.searchTerm);
  addRatingFilters(where, query);

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: adminReviewSelect,
    }),
    prisma.review.count({ where }),
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

const getReviewByIdForAdmin = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: adminReviewSelect,
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  return review;
};

const moderateReview = async (
  reviewId: string,
  payload: IModerateReviewPayload,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(payload.isApproved !== undefined && { isApproved: payload.isApproved }),
      ...(payload.isVerifiedPurchase !== undefined && {
        isVerifiedPurchase: payload.isVerifiedPurchase,
      }),
    },
    select: adminReviewSelect,
  });

  return updatedReview;
};

const replyReview = async (
  reviewId: string,
  payload: IReplyReviewPayload,
  adminId: string,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data:
      payload.adminReply === null
        ? {
            adminReply: null,
            adminRepliedAt: null,
            adminRepliedBy: null,
          }
        : {
            adminReply: payload.adminReply,
            adminRepliedAt: new Date(),
            adminRepliedBy: adminId,
          },
    select: adminReviewSelect,
  });

  return updatedReview;
};

const deleteReviewByAdmin = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  await prisma.review.delete({
    where: { id: review.id },
  });
};

export const ReviewService = {
  createReview,
  getPublicReviewsByProduct,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
  getAllReviews,
  getReviewByIdForAdmin,
  moderateReview,
  replyReview,
  deleteReviewByAdmin,
};
