import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import passport from "passport";
import { envVars } from "../../config/env";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AuthServices } from "./auth.service";
import type {
  IAuthUser,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  ISetPasswordPayload,
} from "./auth.interface";

const register = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IRegisterPayload;
  const createdUser = await AuthServices.register(payload);
  const tokens = createUserTokens(createdUser);

  setAuthCookie(res, tokens);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user: createdUser,
      ...tokens,
    },
  });
});

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: unknown, user: Express.User | false, info?: { message?: string }) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return next(
            new AppError(
              httpStatus.UNAUTHORIZED,
              info?.message || "Invalid email or password",
            ),
          );
        }

        const typedUser = user as IAuthUser;
        const tokens = createUserTokens(typedUser);

        setAuthCookie(res, tokens);

        return sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User logged in successfully",
          data: {
            user: typedUser,
            ...tokens,
          },
        });
      },
    )(req, res, next);
  },
);

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken =
    (req.cookies.refreshToken as string | undefined) ||
    (req.body?.refreshToken as string | undefined);

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received");
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New access token retrieved successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (_: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged out successfully",
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IChangePasswordPayload;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  await AuthServices.changePassword(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: null,
  });
});

const setPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ISetPasswordPayload;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  await AuthServices.setPassword(userId, payload.password);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password set successfully",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IForgotPasswordPayload;
  await AuthServices.forgotPassword(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset email sent successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IResetPasswordPayload;
  await AuthServices.resetPassword(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IAuthUser | undefined;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const tokens = createUserTokens(user);
  setAuthCookie(res, tokens);

  const redirectState = typeof req.query.state === "string" ? req.query.state : "/";
  const safeRedirectPath = redirectState.startsWith("/") ? redirectState : "/";

  res.redirect(`${envVars.FRONTEND_URL}${safeRedirectPath}`);
});

export const AuthControllers = {
  register,
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
  googleCallbackController,
};
