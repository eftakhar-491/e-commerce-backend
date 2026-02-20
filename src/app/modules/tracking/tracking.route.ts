import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TrackingControllers } from "./tracking.controller";
import { trackEventZodSchema } from "./tracking.validation";

// /api/tracking

const router = Router();

router.post("/", validateRequest(trackEventZodSchema), TrackingControllers.trackEvent);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER),
  TrackingControllers.getTrackingEvents,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  TrackingControllers.getTrackingEventById,
);

router.post(
  "/:id/retry",
  checkAuth(Role.ADMIN, Role.MANAGER),
  TrackingControllers.retryTrackingEvent,
);

export const TrackingRoutes = router;
