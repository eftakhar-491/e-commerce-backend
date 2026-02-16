import bcryptjs from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../modules/user-pre/user.interface";
import { envVars } from "./env";

const toPassportUser = (user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  phone: string | null;
  status: string;
}) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role as Role,
  emailVerified: user.emailVerified,
  phone: user.phone,
  status: user.status as UserStatus,
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (
      email: string,
      password: string,
      done: (
        error: Error | null,
        user?: Express.User | false,
        info?: { message: string },
      ) => void,
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            credential: true,
          },
        });

        if (!user || !user.credential) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          return done(null, false, {
            message: `User is ${user.status.toLowerCase()}`,
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password,
          user.credential.passwordHash,
        );

        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, toPassportUser(user));
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      _: string,
      __: string,
      profile: Profile,
      done: (
        error: Error | null,
        user?: Express.User | false,
        info?: { message?: string },
      ) => void,
    ) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(null, false, { message: "No email found from google account" });
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
            return done(null, false, {
              message: `User is ${user.status.toLowerCase()}`,
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || null,
              image: profile.photos?.[0]?.value ?? null,
              emailVerified: true,
              role: "USER",
              status: "ACTIVE",
            },
          });
        }

        await prisma.account.upsert({
          where: {
            providerId_providerAccountId: {
              providerId: "google",
              providerAccountId: profile.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            providerId: "google",
            providerAccountId: profile.id,
          },
        });

        return done(null, toPassportUser(user));
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);
