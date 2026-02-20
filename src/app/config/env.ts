import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENV: "development" | "production";
  EXPRESS_SESSION_SECRET?: string;
  BCRYPT_SALT_ROUND: number;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  JWT_RESET_PASSWORD_EXPIRES: string;
  CLOUDINARY_URL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  FRONTEND_URL: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_BUCKET?: string;
  META_PIXEL_ID?: string;
  META_CAPI_ACCESS_TOKEN?: string;
  META_TEST_EVENT_CODE?: string;
  GA4_MEASUREMENT_ID?: string;
  GA4_API_SECRET?: string;
  GA4_ENDPOINT?: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_PORT: string;
    SMTP_HOST: string;
    SMTP_FROM: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "FRONTEND_URL",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "JWT_RESET_PASSWORD_EXPIRES",
    "CLOUDINARY_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_FROM",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  const envConfig: EnvConfig = {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    JWT_RESET_PASSWORD_EXPIRES: process.env.JWT_RESET_PASSWORD_EXPIRES as string,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER!,
      SMTP_PASS: process.env.SMTP_PASS!,
      SMTP_PORT: process.env.SMTP_PORT!,
      SMTP_HOST: process.env.SMTP_HOST!,
      SMTP_FROM: process.env.SMTP_FROM!,
    },
  };

  if (process.env.SUPABASE_URL) {
    envConfig.SUPABASE_URL = process.env.SUPABASE_URL;
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    envConfig.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  if (process.env.SUPABASE_BUCKET) {
    envConfig.SUPABASE_BUCKET = process.env.SUPABASE_BUCKET;
  }

  if (process.env.META_PIXEL_ID) {
    envConfig.META_PIXEL_ID = process.env.META_PIXEL_ID;
  }

  if (process.env.META_CAPI_ACCESS_TOKEN) {
    envConfig.META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
  }

  if (process.env.META_TEST_EVENT_CODE) {
    envConfig.META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
  }

  if (process.env.GA4_MEASUREMENT_ID) {
    envConfig.GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
  }

  if (process.env.GA4_API_SECRET) {
    envConfig.GA4_API_SECRET = process.env.GA4_API_SECRET;
  }

  if (process.env.GA4_ENDPOINT) {
    envConfig.GA4_ENDPOINT = process.env.GA4_ENDPOINT;
  }

  return envConfig;
};

export const envVars = loadEnvVariables();
