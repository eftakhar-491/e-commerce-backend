import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { CategoryControllers } from "./category.controller";
import { Role } from "../user/user.interface";

import { uploadImage } from "../../middlewares/uploadImage";

// /api/category/

const router = Router();
// admin route

router.post(
  "/create",
  checkAuth(Role.ADMIN),
  uploadImage,
  CategoryControllers.createCategory,
);

router.get(
  "/",
  checkAuth(...Object.values(Role)),
  CategoryControllers.getCategories,
);

router.patch(
  "/update/:id",
  checkAuth(Role.ADMIN),
  uploadImage,
  CategoryControllers.updateCategory,
);

export const CategoryRoutes = router;
