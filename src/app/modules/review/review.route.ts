import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ReviewControllers } from "./review.controller";
import {
  createReviewZodSchema,
  moderateReviewZodSchema,
  replyReviewZodSchema,
  updateMyReviewZodSchema,
} from "./review.validation";

// /api/review

const router = Router();

router.get("/product/:productId", ReviewControllers.getPublicReviewsByProduct);

router.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(createReviewZodSchema),
  ReviewControllers.createReview,
);

router.get(
  "/my-reviews",
  checkAuth(Role.USER),
  ReviewControllers.getMyReviews,
);

router.patch(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(updateMyReviewZodSchema),
  ReviewControllers.updateMyReview,
);

router.put(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(updateMyReviewZodSchema),
  ReviewControllers.updateMyReview,
);

router.delete(
  "/:id",
  checkAuth(Role.USER),
  ReviewControllers.deleteMyReview,
);

router.get("/", checkAuth(Role.ADMIN), ReviewControllers.getAllReviews);

router.get("/:id/admin", checkAuth(Role.ADMIN), ReviewControllers.getReviewByIdForAdmin);

router.patch(
  "/:id/moderate",
  checkAuth(Role.ADMIN),
  validateRequest(moderateReviewZodSchema),
  ReviewControllers.moderateReview,
);

router.patch(
  "/:id/reply",
  checkAuth(Role.ADMIN),
  validateRequest(replyReviewZodSchema),
  ReviewControllers.replyReview,
);

router.delete(
  "/:id/admin",
  checkAuth(Role.ADMIN),
  ReviewControllers.deleteReviewByAdmin,
);

export const ReviewRoutes = router;
