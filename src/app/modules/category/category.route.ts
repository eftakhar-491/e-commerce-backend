import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { CategoryControllers } from "./category.controller";
import { Role } from "../user/user.interface";
import { uploadProductImage } from "../../lib/multer";
import { uploadImage } from "../../middlewares/uploadImage";

// /api/category/

const router = Router();
// admin route

router.post(
  "/create",
  checkAuth(Role.ADMIN),
  uploadImage,
  // uploadProductImage.single("image"),
  CategoryControllers.createCategory,
);

router.get(
  "/",
  checkAuth(...Object.values(Role)),
  CategoryControllers.getCategories,
);
// router.patch("/:id", checkAuth(Role.ADMIN), CategoryControllers.updateCategory);
router.patch(
  "/update/:id",
  checkAuth(Role.ADMIN),
  uploadImage,
  CategoryControllers.updateCategory,
);

// public route
// router.get("/", CategoryControllers.getCategories);

export const CategoryRoutes = router;
