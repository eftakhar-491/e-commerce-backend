import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { envVars } from "../config/env";
import AppError from "../helper/AppError";
import type { TErrorSources } from "../@types/error.types";
import { cleanupImages } from "../utils/cleanupImage";
import { ZodError } from "zod";
// import { handleCastError } from "../helpers/handleCastError";
// import { handlerDuplicateError } from "../helpers/handleDuplicateError";
// import { handlerValidationError } from "../helpers/handlerValidationError";
// import { handlerZodError } from "../helpers/handlerZodError";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await cleanupImages(
    req.uploadedImages as
      | {
          storageType: "link" | "local" | "cloudinary" | "supabase";
          src?: string;
          publicId?: string;
        }[]
      | undefined,
  );
  if (envVars.NODE_ENV === "development") {
    console.log("============================================");
    console.log(err);
    console.log("============================================");
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";
  // //Duplicate error
  if (err.code === 11000) {
    // const simplifiedError = handlerDuplicateError(err);
    // statusCode = simplifiedError.statusCode;
    // message = simplifiedError.message;
  }
  if (err.code === "P2002") {
    statusCode = 503;
    message = err.message;
  }
  if (err.code === "P2025") {
    statusCode = 503;
    message = "No record found to delete/update!";
  }
  if (err.code === "P2003") {
    statusCode = 503;
    message = err.message;
  }
  // Object ID error / Cast Error
  else if (err.name === "CastError") {
    // const simplifiedError = handleCastError(err);
    // statusCode = simplifiedError.statusCode;
    // message = simplifiedError.message;
  } else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  //Validation Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
