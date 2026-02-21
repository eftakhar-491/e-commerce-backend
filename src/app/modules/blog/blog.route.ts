import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { BlogControllers } from "./blog.controller";
import {
  createBlogCategoryZodSchema,
  createBlogCommentZodSchema,
  createBlogPostZodSchema,
  createBlogTagZodSchema,
  moderateBlogCommentZodSchema,
  updateBlogCategoryZodSchema,
  updateBlogPostZodSchema,
  updateBlogTagZodSchema,
} from "./blog.validation";

// /api/blog

const router = Router();

router.get("/posts", BlogControllers.getPublicPosts);
router.get("/posts/:slug/comments", BlogControllers.getPublicCommentsByPost);
router.get("/posts/:slug", BlogControllers.getPublicPostBySlug);
router.get("/categories", BlogControllers.getCategories);
router.get("/tags", BlogControllers.getTags);

router.post(
  "/posts/:postId/comments",
  checkAuth(...Object.values(Role)),
  validateRequest(createBlogCommentZodSchema),
  BlogControllers.createComment,
);

router.get(
  "/admin/posts",
  checkAuth(Role.ADMIN, Role.MANAGER),
  BlogControllers.getAllPostsForAdmin,
);
router.get(
  "/admin/posts/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  BlogControllers.getPostByIdForAdmin,
);
router.get(
  "/admin/comments",
  checkAuth(Role.ADMIN, Role.MANAGER),
  BlogControllers.getAllCommentsForAdmin,
);

router.post(
  "/posts",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(createBlogPostZodSchema),
  BlogControllers.createPost,
);
router.patch(
  "/posts/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateBlogPostZodSchema),
  BlogControllers.updatePost,
);
router.put(
  "/posts/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateBlogPostZodSchema),
  BlogControllers.updatePost,
);

router.post(
  "/categories",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(createBlogCategoryZodSchema),
  BlogControllers.createCategory,
);
router.patch(
  "/categories/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateBlogCategoryZodSchema),
  BlogControllers.updateCategory,
);
router.put(
  "/categories/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateBlogCategoryZodSchema),
  BlogControllers.updateCategory,
);

router.post(
  "/tags",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(createBlogTagZodSchema),
  BlogControllers.createTag,
);
router.patch(
  "/tags/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateBlogTagZodSchema),
  BlogControllers.updateTag,
);
router.put(
  "/tags/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateBlogTagZodSchema),
  BlogControllers.updateTag,
);

router.patch(
  "/comments/:id/moderate",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(moderateBlogCommentZodSchema),
  BlogControllers.moderateComment,
);

router.delete("/posts/:id", checkAuth(Role.ADMIN), BlogControllers.deletePostByAdmin);
router.delete(
  "/categories/:id",
  checkAuth(Role.ADMIN),
  BlogControllers.deleteCategoryByAdmin,
);
router.delete("/tags/:id", checkAuth(Role.ADMIN), BlogControllers.deleteTagByAdmin);
router.delete(
  "/comments/:id",
  checkAuth(Role.ADMIN),
  BlogControllers.deleteCommentByAdmin,
);

export const BlogRoutes = router;
