import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { CartControllers } from "./cart.controller";
import { addCartItemZodSchema, updateCartItemZodSchema } from "./cart.validation";

// /api/cart

const router = Router();

router.get("/", checkAuth(...Object.values(Role)), CartControllers.getMyCart);

router.post(
  "/items",
  checkAuth(...Object.values(Role)),
  validateRequest(addCartItemZodSchema),
  CartControllers.addItemToCart,
);

router.patch(
  "/items/:itemId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateCartItemZodSchema),
  CartControllers.updateCartItemQuantity,
);

router.delete(
  "/items/:itemId",
  checkAuth(...Object.values(Role)),
  CartControllers.removeCartItem,
);

router.delete(
  "/clear",
  checkAuth(...Object.values(Role)),
  CartControllers.clearMyCart,
);

export const CartRoutes = router;
