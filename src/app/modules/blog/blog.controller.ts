import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Role } from "../user/user.interface";
import type {
  IBlogCommentQuery,
  IBlogPostQuery,
  ICreateBlogCategoryPayload,
  ICreateBlogCommentPayload,
  ICreateBlogPostPayload,
  ICreateBlogTagPayload,
  IModerateBlogCommentPayload,
  IUpdateBlogCategoryPayload,
  IUpdateBlogPostPayload,
  IUpdateBlogTagPayload,
} from "./blog.interface";
import { BlogService } from "./blog.service";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const getAuthenticatedUser = (req: Request) => {
  if (!req.user?.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  return {
    id: req.user.id,
    role: req.user.role as Role,
    name: req.user.name,
    email: req.user.email,
  };
};

const createPost = catchAsync(async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const payload = req.body as ICreateBlogPostPayload;
  const result = await BlogService.createPost(user.id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Blog post created successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = getParamAsString(req.params.id, "Post id");
  const payload = req.body as IUpdateBlogPostPayload;
  const result = await BlogService.updatePost(postId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog post updated successfully",
    data: result,
  });
});

const deletePostByAdmin = catchAsync(async (req: Request, res: Response) => {
  const postId = getParamAsString(req.params.id, "Post id");
  await BlogService.deletePostByAdmin(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog post deleted successfully",
    data: null,
  });
});

const getPublicPosts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IBlogPostQuery;
  const result = await BlogService.getPublicPosts(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog posts retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getPublicPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = getParamAsString(req.params.slug, "Post slug");
  const result = await BlogService.getPublicPostBySlug(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog post retrieved successfully",
    data: result,
  });
});

const getAllPostsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IBlogPostQuery;
  const result = await BlogService.getAllPostsForAdmin(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog posts retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getPostByIdForAdmin = catchAsync(async (req: Request, res: Response) => {
  const postId = getParamAsString(req.params.id, "Post id");
  const result = await BlogService.getPostByIdForAdmin(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog post retrieved successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as { page?: string; limit?: string; searchTerm?: string };
  const result = await BlogService.getCategories(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog categories retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ICreateBlogCategoryPayload;
  const result = await BlogService.createCategory(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Blog category created successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = getParamAsString(req.params.id, "Category id");
  const payload = req.body as IUpdateBlogCategoryPayload;
  const result = await BlogService.updateCategory(categoryId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog category updated successfully",
    data: result,
  });
});

const deleteCategoryByAdmin = catchAsync(async (req: Request, res: Response) => {
  const categoryId = getParamAsString(req.params.id, "Category id");
  await BlogService.deleteCategoryByAdmin(categoryId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog category deleted successfully",
    data: null,
  });
});

const getTags = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as { page?: string; limit?: string; searchTerm?: string };
  const result = await BlogService.getTags(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog tags retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const createTag = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ICreateBlogTagPayload;
  const result = await BlogService.createTag(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Blog tag created successfully",
    data: result,
  });
});

const updateTag = catchAsync(async (req: Request, res: Response) => {
  const tagId = getParamAsString(req.params.id, "Tag id");
  const payload = req.body as IUpdateBlogTagPayload;
  const result = await BlogService.updateTag(tagId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog tag updated successfully",
    data: result,
  });
});

const deleteTagByAdmin = catchAsync(async (req: Request, res: Response) => {
  const tagId = getParamAsString(req.params.id, "Tag id");
  await BlogService.deleteTagByAdmin(tagId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog tag deleted successfully",
    data: null,
  });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
  const postId = getParamAsString(req.params.postId, "Post id");
  const payload = req.body as ICreateBlogCommentPayload;
  const user = getAuthenticatedUser(req);
  const result = await BlogService.createComment(postId, payload, user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment submitted successfully",
    data: result,
  });
});

const getPublicCommentsByPost = catchAsync(async (req: Request, res: Response) => {
  const slug = getParamAsString(req.params.slug, "Post slug");
  const query = req.query as IBlogCommentQuery;
  const result = await BlogService.getPublicCommentsByPostSlug(slug, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog comments retrieved successfully",
    data: {
      post: result.post,
      comments: result.data,
    },
    meta: result.meta,
  });
});

const getAllCommentsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IBlogCommentQuery;
  const result = await BlogService.getAllCommentsForAdmin(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog comments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const moderateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = getParamAsString(req.params.id, "Comment id");
  const payload = req.body as IModerateBlogCommentPayload;
  const result = await BlogService.moderateComment(commentId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog comment moderated successfully",
    data: result,
  });
});

const deleteCommentByAdmin = catchAsync(async (req: Request, res: Response) => {
  const commentId = getParamAsString(req.params.id, "Comment id");
  await BlogService.deleteCommentByAdmin(commentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blog comment deleted successfully",
    data: null,
  });
});

export const BlogControllers = {
  createPost,
  updatePost,
  deletePostByAdmin,
  getPublicPosts,
  getPublicPostBySlug,
  getAllPostsForAdmin,
  getPostByIdForAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategoryByAdmin,
  getTags,
  createTag,
  updateTag,
  deleteTagByAdmin,
  createComment,
  getPublicCommentsByPost,
  getAllCommentsForAdmin,
  moderateComment,
  deleteCommentByAdmin,
};
