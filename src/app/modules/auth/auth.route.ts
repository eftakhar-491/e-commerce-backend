import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user-pre/user.interface";
import { AuthControllers } from "./auth.controller";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  registerZodSchema,
  resetPasswordZodSchema,
  setPasswordZodSchema,
} from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(registerZodSchema), AuthControllers.register);

router.post("/login", validateRequest(loginZodSchema), AuthControllers.credentialsLogin);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenZodSchema),
  AuthControllers.getNewAccessToken,
);

router.post("/logout", AuthControllers.logout);

router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validateRequest(changePasswordZodSchema),
  AuthControllers.changePassword,
);

// router.post(
//   "/set-password",
//   checkAuth(...Object.values(Role)),
//   validateRequest(setPasswordZodSchema),
//   AuthControllers.setPassword,
// );

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgotPassword,
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword,
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";

    await passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
      session: false,
    })(req, res, next);
  },
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=Authentication failed`,
    session: false,
  }),
  AuthControllers.googleCallbackController,
);

export const AuthRoutes = router;
