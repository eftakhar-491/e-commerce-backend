import type { Prisma } from "../../../../generated/prisma/client";

export interface IBlogPostQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sort?: string;
  categoryId?: string;
  categorySlug?: string;
  tagId?: string;
  tagSlug?: string;
  isPublished?: string;
  authorId?: string;
}

export interface ICreateBlogPostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  categoryIds?: string[];
  tagIds?: string[];
  isPublished?: boolean;
  publishedAt?: Date;
  allowComments?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface IUpdateBlogPostPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  categoryIds?: string[];
  tagIds?: string[];
  isPublished?: boolean;
  publishedAt?: Date;
  allowComments?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface ICreateBlogCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface IUpdateBlogCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
}

export interface ICreateBlogTagPayload {
  name: string;
  slug: string;
}

export interface IUpdateBlogTagPayload {
  name?: string;
  slug?: string;
}

export interface IBlogCommentQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sort?: string;
  postId?: string;
  isApproved?: string;
  userId?: string;
}

export interface ICreateBlogCommentPayload {
  content: string;
  parentId?: string | null;
}

export interface IModerateBlogCommentPayload {
  isApproved: boolean;
}
