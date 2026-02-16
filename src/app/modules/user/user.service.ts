import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import type {
  IAdminUpdateUserPayload,
  ICreateAddressPayload,
  IUpdateAddressPayload,
  IUpdateMePayload,
} from "./user.interface";

const userSelect = {
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
} satisfies Prisma.UserSelect;

const userWithAddressesSelect = {
  ...userSelect,
  addresses: {
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  },
} satisfies Prisma.UserSelect;

const addressSelect = {
  id: true,
  userId: true,
  label: true,
  recipient: true,
  phone: true,
  street: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AddressSelect;

const ensureUserExists = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
};

const ensurePhoneUnique = async (phone: string, excludedUserId?: string) => {
  const existing = await prisma.user.findFirst({
    where: {
      phone,
      ...(excludedUserId && { id: { not: excludedUserId } }),
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Phone number already in use");
  }
};

const getAllUsers = async (query: Record<string, string>) => {
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

  const builtQuery = qb.build() as Prisma.UserFindManyArgs;

  const [data, meta] = await Promise.all([
    prisma.user.findMany({
      ...builtQuery,
      select: builtQuery.select ?? userSelect,
    }),
    qb.getMeta(prisma.user),
  ]);

  return {
    meta,
    data,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userWithAddressesSelect,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateMe = async (userId: string, payload: IUpdateMePayload) => {
  await ensureUserExists(userId);

  if (payload.phone) {
    await ensurePhoneUnique(payload.phone, userId);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.image !== undefined && { image: payload.image }),
      ...(payload.status !== undefined && { status: payload.status }),
    },
    select: userWithAddressesSelect,
  });

  return updatedUser;
};

const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userWithAddressesSelect,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUser = async (userId: string, payload: IAdminUpdateUserPayload) => {
  await ensureUserExists(userId);

  if (payload.phone) {
    await ensurePhoneUnique(payload.phone, userId);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.role !== undefined && { role: payload.role }),
      ...(payload.emailVerified !== undefined && {
        emailVerified: payload.emailVerified,
      }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
    },
    select: userSelect,
  });

  return updatedUser;
};

const createAddress = async (userId: string, payload: ICreateAddressPayload) => {
  await ensureUserExists(userId);

  const shouldSetDefault =
    payload.isDefault === true ||
    (await prisma.address.count({ where: { userId } })) === 0;

  const addressData: Prisma.AddressUncheckedCreateInput = {
    userId,
    street: payload.street,
    city: payload.city,
    ...(payload.label !== undefined && { label: payload.label }),
    ...(payload.recipient !== undefined && { recipient: payload.recipient }),
    ...(payload.phone !== undefined && { phone: payload.phone }),
    ...(payload.state !== undefined && { state: payload.state }),
    ...(payload.zipCode !== undefined && { zipCode: payload.zipCode }),
    ...(payload.country !== undefined && { country: payload.country }),
    ...(shouldSetDefault && { isDefault: true }),
  };

  const address = await prisma.$transaction(async (tx) => {
    if (shouldSetDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: addressData,
      select: addressSelect,
    });
  });

  return address;
};

const getMyAddresses = async (userId: string) => {
  await ensureUserExists(userId);

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: addressSelect,
  });

  return addresses;
};

const updateMyAddress = async (
  userId: string,
  addressId: string,
  payload: IUpdateAddressPayload,
) => {
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
    select: {
      id: true,
      isDefault: true,
    },
  });

  if (!existingAddress) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  if (payload.isDefault === false && existingAddress.isDefault) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot unset the current default address directly",
    );
  }

  const addressData: Prisma.AddressUncheckedUpdateInput = {
    ...(payload.label !== undefined && { label: payload.label }),
    ...(payload.recipient !== undefined && { recipient: payload.recipient }),
    ...(payload.phone !== undefined && { phone: payload.phone }),
    ...(payload.street !== undefined && { street: payload.street }),
    ...(payload.city !== undefined && { city: payload.city }),
    ...(payload.state !== undefined && { state: payload.state }),
    ...(payload.zipCode !== undefined && { zipCode: payload.zipCode }),
    ...(payload.country !== undefined && { country: payload.country }),
    ...(payload.isDefault !== undefined && { isDefault: payload.isDefault }),
  };

  if (payload.isDefault) {
    const updatedAddress = await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: {
          ...addressData,
          isDefault: true,
        },
        select: addressSelect,
      });
    });

    return updatedAddress;
  }

  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: addressData,
    select: addressSelect,
  });

  return updatedAddress;
};

const deleteMyAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
    select: {
      id: true,
      isDefault: true,
    },
  });

  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({
      where: { id: addressId },
    });

    if (address.isDefault) {
      const fallbackAddress = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (fallbackAddress) {
        await tx.address.update({
          where: { id: fallbackAddress.id },
          data: { isDefault: true },
        });
      }
    }
  });
};

const setDefaultAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  const updatedAddress = await prisma.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
      select: addressSelect,
    });
  });

  return updatedAddress;
};

export const UserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  updateMe,
  createAddress,
  getMyAddresses,
  updateMyAddress,
  deleteMyAddress,
  setDefaultAddress,
};
