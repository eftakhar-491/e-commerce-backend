import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../helper/AppError";
import { prisma } from "../lib/prisma";
import { UserStatus } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";

export interface ITokenUserPayload {
  id: string;
  email: string;
  role: string;
}

export const createUserTokens = (user: ITokenUserPayload) => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    payload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES as Parameters<typeof generateToken>[2],
  );

  const refreshToken = generateToken(
    payload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES as Parameters<typeof generateToken>[2],
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  const userId = decoded.userId as string | undefined;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, `User is ${user.status.toLowerCase()}`);
  }

  const newAccessToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES as Parameters<typeof generateToken>[2],
  );

  return newAccessToken;
};
