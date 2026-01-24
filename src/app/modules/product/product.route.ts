import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createProductZodSchema } from "./product.validetion";
import { ProductController } from "./product.controller";

// /api/product/

const router = Router();
// admin route

router.post(
  "/create",
  checkAuth(Role.ADMIN),

  validateRequest(createProductZodSchema),
  ProductController.createProduct,
);

export const ProductRoutes = router;
