import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/sendEmail";
import { envVars } from "../config/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins: [process.env.FRONTEND_URL as string],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
      },
      phone: {
        type: "string",
        required: true,
        unique: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const resetUILink = `${envVars.FRONTEND_URL}/auth/verify?id=${user.id}&token=${token}`;

      sendEmail({
        to: user.email,
        subject: "Verify your email address",
        templateName: "otp",
        templateData: {
          name: user.name,
          resetUILink,
          otp: 5555,
        },
      });
      console.log("Verification URL:", url);
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: envVars.GOOGLE_CLIENT_ID!,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
    },
  },
});
