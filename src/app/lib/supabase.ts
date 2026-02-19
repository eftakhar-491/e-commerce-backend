import { createClient } from "@supabase/supabase-js";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../helper/AppError";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!envVars.SUPABASE_URL || !envVars.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Supabase storage is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      envVars.SUPABASE_URL,
      envVars.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  return supabaseClient;
};

export const getSupabaseBucket = () => {
  if (!envVars.SUPABASE_BUCKET) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Supabase bucket is not configured. Please set SUPABASE_BUCKET.",
    );
  }

  return envVars.SUPABASE_BUCKET;
};
