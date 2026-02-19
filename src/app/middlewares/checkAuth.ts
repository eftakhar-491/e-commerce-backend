import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../helper/AppError";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../modules/user/user.interface";
import { verifyToken } from "../utils/jwt";

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken as string | undefined;

  if (!authHeader) {
    return cookieToken;
  }

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return authHeader;
};

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const accessToken = extractToken(req);

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No access token received");
      }

      const decodedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      const userId = decodedToken.userId as string | undefined;

      if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          phone: true,
          status: true,
        },
      });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `User is ${user.status.toLowerCase()}`,
        );
      }

      if (!user.emailVerified) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Please verify your email to continue",
        );
      }

      if (authRoles.length && !authRoles.includes(user.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource",
        );
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        emailVerified: user.emailVerified,
        phone: user.phone,
        status: user.status as UserStatus,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
