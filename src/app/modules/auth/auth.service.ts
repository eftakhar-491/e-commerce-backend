import bcryptjs from "bcryptjs";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/sendEmail";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { UserStatus } from "../user/user.interface";
import type {
  IChangePasswordPayload,
  IForgotPasswordPayload,
  IRegisterPayload,
  IResetPasswordPayload,
} from "./auth.interface";

const register = async (payload: IRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }

  const hashedPassword = await bcryptjs.hash(
    payload.password,
    envVars.BCRYPT_SALT_ROUND,
  );

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? null,
        image: payload.image ?? null,
        role: "USER",
        status: "ACTIVE",
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        image: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.userCredential.create({
      data: {
        userId: createdUser.id,
        passwordHash: hashedPassword,
      },
    });

    await tx.account.create({
      data: {
        userId: createdUser.id,
        providerId: "credentials",
        providerAccountId: createdUser.email,
      },
    });

    return createdUser;
  });

  return user;
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (userId: string, payload: IChangePasswordPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      credential: true,
    },
  });

  if (!user || !user.credential) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is not set for this account. Please use set password first",
    );
  }

  const isOldPasswordMatched = await bcryptjs.compare(
    payload.oldPassword,
    user.credential.passwordHash,
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
  }

  const newHashedPassword = await bcryptjs.hash(
    payload.newPassword,
    envVars.BCRYPT_SALT_ROUND,
  );

  await prisma.userCredential.update({
    where: {
      userId: user.id,
    },
    data: {
      passwordHash: newHashedPassword,
    },
  });
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      credential: true,
      accounts: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.credential) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Password already exists for this account. Use change-password instead",
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    envVars.BCRYPT_SALT_ROUND,
  );

  await prisma.$transaction(async (tx) => {
    await tx.userCredential.create({
      data: {
        userId: user.id,
        passwordHash: hashedPassword,
      },
    });

    const hasCredentialsAccount = user.accounts.some(
      (provider) => provider.providerId === "credentials",
    );

    if (!hasCredentialsAccount) {
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credentials",
          providerAccountId: user.email,
        },
      });
    }
  });
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, `User is ${user.status.toLowerCase()}`);
  }

  const resetToken = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenType: "RESET_PASSWORD",
    },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_RESET_PASSWORD_EXPIRES as Parameters<typeof generateToken>[2],
  );

  const resetUILink = `${envVars.FRONTEND_URL}/auth/reset-password?id=${user.id}&token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: user.name || "User",
      resetUILink,
    },
  });
};

const resetPassword = async (payload: IResetPasswordPayload) => {
  const decodedToken = verifyToken(
    payload.token,
    envVars.JWT_ACCESS_SECRET,
  ) as JwtPayload;

  if (
    !decodedToken.userId ||
    decodedToken.userId !== payload.id ||
    decodedToken.tokenType !== "RESET_PASSWORD"
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid reset token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    envVars.BCRYPT_SALT_ROUND,
  );

  await prisma.userCredential.upsert({
    where: { userId: user.id },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      userId: user.id,
      passwordHash: hashedPassword,
    },
  });
};

export const AuthServices = {
  register,
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
