import AppError from "../../helper/AppError";
import httpStatus from "http-status-codes";
import { userSearchableFields } from "./user.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { Prisma } from "../../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import type { IUser } from "./user.interface";

export const getAllUsers = async (query: Record<string, string>) => {
  const qb = new QueryBuilder<
    Prisma.UserWhereInput,
    Prisma.UserSelect,
    Prisma.UserOrderByWithRelationInput[]
  >(query)
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const users = await prisma.user.findMany(
    qb.build() as Prisma.UserFindManyArgs,
  );

  const meta = await qb.getMeta(prisma.user);

  return {
    meta,
    data: users,
  };
};
const getMe = async (userId: string, headers: Record<string, string>) => {
  const session = await auth.api.getSession({
    headers: headers,
  });

  if (!session?.user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return session.user;
};

const updateMe = async (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    image?: string | null;
    status?: string | null;
  },
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.phone && { phone: payload.phone }),
      ...(payload.image && { image: payload.image }),
      ...(payload.status && { status: payload.status }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.role && { role: payload.role }),
      ...(typeof payload.emailVerified === "boolean" && {
        emailVerified: payload.emailVerified,
      }),
      ...(payload.status && { status: payload.status }),
      ...(payload.phone && { phone: payload.phone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

export const UserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  updateMe,
};

