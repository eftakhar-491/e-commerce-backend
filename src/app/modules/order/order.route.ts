import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { OrderControllers } from "./order.controller";
import { createOrderZodSchema, updateOrderStatusZodSchema } from "./order.validation";

// /api/order

const router = Router();

router.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(createOrderZodSchema),
  OrderControllers.createOrderFromCart,
);

router.get(
  "/my-orders",
  checkAuth(Role.USER),
  OrderControllers.getMyOrders,
);

router.get(
  "/my-orders/:id",
  checkAuth(Role.USER),
  OrderControllers.getMyOrderById,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER),
  OrderControllers.getAllOrders,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  OrderControllers.getOrderByIdForAdmin,
);

router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateOrderStatusZodSchema),
  OrderControllers.updateOrderStatus,
);

export const OrderRoutes = router;
