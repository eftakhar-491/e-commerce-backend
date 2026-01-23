import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
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
