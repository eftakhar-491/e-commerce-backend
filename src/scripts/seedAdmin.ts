import "dotenv/config";
import bcryptjs from "bcryptjs";
import { prisma } from "../app/lib/prisma";

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

const parseSaltRounds = () => {
  const rawValue = process.env.BCRYPT_SALT_ROUND ?? "12";
  const saltRounds = Number(rawValue);

  if (!Number.isInteger(saltRounds) || saltRounds < 4) {
    throw new Error(
      "BCRYPT_SALT_ROUND must be an integer greater than or equal to 4",
    );
  }

  return saltRounds;
};

const seedSuperAdmin = async () => {
  const superAdminEmail = getRequiredEnv("SUPER_ADMIN_EMAIL").toLowerCase();
  const superAdminPassword = getRequiredEnv("SUPER_ADMIN_PASSWORD");
  const saltRounds = parseSaltRounds();
  const passwordHash = await bcryptjs.hash(superAdminPassword, saltRounds);

  const existingUser = await prisma.user.findUnique({
    where: { email: superAdminEmail },
    select: {
      id: true,
    },
  });

  const upsertedUser = await prisma.$transaction(async (tx) => {
    const user = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: {
            role: "ADMIN",
            status: "ACTIVE",
            emailVerified: true,
          },
          select: {
            id: true,
            email: true,
          },
        })
      : await tx.user.create({
          data: {
            name: "Super Admin",
            email: superAdminEmail,
            role: "ADMIN",
            status: "ACTIVE",
            emailVerified: true,
          },
          select: {
            id: true,
            email: true,
          },
        });

    await tx.userCredential.upsert({
      where: { userId: user.id },
      update: {
        passwordHash,
      },
      create: {
        userId: user.id,
        passwordHash,
      },
    });

    const credentialsAccount = await tx.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credentials",
      },
      select: {
        id: true,
      },
    });

    if (credentialsAccount) {
      await tx.account.update({
        where: { id: credentialsAccount.id },
        data: {
          providerAccountId: superAdminEmail,
        },
      });
    } else {
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credentials",
          providerAccountId: superAdminEmail,
        },
      });
    }

    return user;
  });

  console.log(
    `Super admin is ready: ${upsertedUser.email} (id: ${upsertedUser.id})`,
  );
};

const run = async () => {
  try {
    await seedSuperAdmin();
  } catch (error) {
    console.error("Failed to seed super admin");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

void run();
