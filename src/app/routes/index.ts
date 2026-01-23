import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProductRoutes } from "../modules/product/product.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },

  // {
  //   path: "/user",
  //   route: UserRoutes,
  // },
  //   {
  //     path: "/auth",
  //     route: AuthRoutes,
  //   },
  //   {
  //     path: "/otp",
  //     route: OtpRoutes,
  //   },
  //   {
  //     path: "/ride",
  //     route: RideRoutes,
  //   },
  //   {
  //     path: "/driver",
  //     route: DriverRoutes,
  //   },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
