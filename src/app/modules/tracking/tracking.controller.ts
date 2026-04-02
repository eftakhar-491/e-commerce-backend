import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { verifyToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import type {
  ITrackEventPayload,
  ITrackingEventQuery,
  ITrackingRequestContext,
} from "./tracking.interface";
import { TrackingService } from "./tracking.service";

const getParamAsString = (value: string | string[] | undefined, key: string) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`);
  }

  return value;
};

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken as string | undefined;

  if (!authHeader) {
    return cookieToken;
  }

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return authHeader;
};

const resolveAuthenticatedUserId = (req: Request) => {
  if (req.user?.id) {
    return req.user.id;
  }

  const accessToken = extractToken(req);

  if (!accessToken) {
    return undefined;
  }

  try {
    const decoded = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    const userId = decoded.userId;

    return typeof userId === "string" ? userId : undefined;
  } catch {
    return undefined;
  }
};

const extractIpAddress = (req: Request) => {
  const forwardedForHeader = req.headers["x-forwarded-for"];

  if (typeof forwardedForHeader === "string") {
    const firstIp = forwardedForHeader.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp.startsWith("::ffff:") ? firstIp.slice(7) : firstIp;
    }
  }

  if (Array.isArray(forwardedForHeader) && forwardedForHeader.length > 0) {
    const firstIp = forwardedForHeader[0]?.trim();

    if (firstIp) {
      return firstIp.startsWith("::ffff:") ? firstIp.slice(7) : firstIp;
    }
  }

  const ipAddress = req.ip || req.socket.remoteAddress;

  if (!ipAddress) {
    return undefined;
  }

  return ipAddress.startsWith("::ffff:") ? ipAddress.slice(7) : ipAddress;
};

const trackEvent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ITrackEventPayload;
  const userAgentHeader = req.headers["user-agent"];
  const refererHeader = req.headers.referer;
  const ipAddress = extractIpAddress(req);
  const authenticatedUserId = resolveAuthenticatedUserId(req);

  const context: ITrackingRequestContext = {
    ...(authenticatedUserId && { authenticatedUserId }),
    ...(ipAddress && { ipAddress }),
    ...(typeof userAgentHeader === "string" && { userAgent: userAgentHeader }),
    ...(typeof refererHeader === "string" && { sourceUrl: refererHeader }),
  };

  const result = await TrackingService.trackEvent(payload, context);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: result.deduplicated
      ? "Tracking event processed (deduplicated)"
      : "Tracking event processed successfully",
    data: result,
  });
});

const getTrackingEvents = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as ITrackingEventQuery;
  const result = await TrackingService.getTrackingEvents(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tracking events retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getTrackingEventById = catchAsync(async (req: Request, res: Response) => {
  const id = getParamAsString(req.params.id, "Tracking event id");
  const result = await TrackingService.getTrackingEventById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tracking event retrieved successfully",
    data: result,
  });
});

const retryTrackingEvent = catchAsync(async (req: Request, res: Response) => {
  const id = getParamAsString(req.params.id, "Tracking event id");
  const result = await TrackingService.retryTrackingEvent(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tracking event retry completed",
    data: result,
  });
});

export const TrackingControllers = {
  trackEvent,
  getTrackingEvents,
  getTrackingEventById,
  retryTrackingEvent,
};
