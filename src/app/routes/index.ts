import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ImageRoutes } from "../modules/image/image.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { TrackingRoutes } from "../modules/tracking/tracking.route";
import { ReviewRoutes } from "../modules/review/review.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },

  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/image",
    route: ImageRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
  {
    path: "/tracking",
    route: TrackingRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
