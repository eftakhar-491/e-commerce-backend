import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { CategoryControllers } from "./category.controller";
import { Role } from "../user-pre/user.interface";

// /api/category/

const router = Router();
// admin route

router.post(
  "/create",
  checkAuth(Role.ADMIN),

  CategoryControllers.createCategory,
);

router.get(
  "/",
  checkAuth(...Object.values(Role)),
  CategoryControllers.getCategories,
);
router.get(
  "/id",
  CategoryControllers.getCategorie,
);

router.patch(
  "/update/:id",
  checkAuth(Role.ADMIN),

  CategoryControllers.updateCategory,
);

export const CategoryRoutes = router;
