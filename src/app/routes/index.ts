import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: AuthRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
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
