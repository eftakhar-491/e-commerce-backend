import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user-pre/user.interface";
import { CategoryControllers } from "./category.controller";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validation";

// /api/category

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createCategoryZodSchema),
  CategoryControllers.createCategory,
);
// falsy route
router.get(
  "/",
  checkAuth(...Object.values(Role)),
  CategoryControllers.getCategories,
);

router.get("/collections", CategoryControllers.getPublicCollections);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateCategoryZodSchema),
  CategoryControllers.updateCategory,
);

router.get(
  "/:id",
  CategoryControllers.getCategoryById,
);

export const CategoryRoutes = router;
