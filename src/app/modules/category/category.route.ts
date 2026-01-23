import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { CategoryControllers } from "./category.controller";
import { Role } from "../user/user.interface";

// /api/category/

const router = Router();
// admin route

router.post("/", checkAuth(Role.ADMIN), CategoryControllers.createCategory);
router.get("/", checkAuth(Role.ADMIN), CategoryControllers.getCategories);
router.patch("/:id", checkAuth(Role.ADMIN), CategoryControllers.updateCategory);

// public route
// router.get("/", CategoryControllers.getCategories);

export const CategoryRoutes = router;
