import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ProductControllers } from "./product.controller";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.validation";

// /api/product

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(createProductZodSchema),
  ProductControllers.createProduct,
);

router.get("/", ProductControllers.getProducts);

router.get("/:id", ProductControllers.getProductById);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateProductZodSchema),
  ProductControllers.updateProduct,
);

router.delete("/:id", checkAuth(Role.ADMIN), ProductControllers.deleteProduct);

export const ProductRoutes = router;
