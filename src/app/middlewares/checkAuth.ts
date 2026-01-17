import httpStatus from "http-status-codes";
import AppError from "../helper/AppError";
import { auth } from "../lib/auth";

import type { NextFunction, Request, Response } from "express";
// import {
//   IsActive,
//   IsAdminActive,
//   IsDriverActive,
//   Role,
// } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>,
      });

      if (!session?.user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "You are not authorized",
        });
      }
      if (!session.user.emailVerified) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Please verify your email to proceed",
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
        phone: session.user.phone,
        status: session.user.status as string,
      };

      next();
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  };
