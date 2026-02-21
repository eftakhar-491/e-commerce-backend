import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { PaymentControllers } from "./payment.controller";
import { initiatePaymentZodSchema } from "./payment.validation";

// /api/payment

const router = Router();

router.get("/ssl/success", PaymentControllers.sslSuccess);
router.post("/ssl/success", PaymentControllers.sslSuccess);
router.get("/ssl/fail", PaymentControllers.sslFail);
router.post("/ssl/fail", PaymentControllers.sslFail);
router.get("/ssl/cancel", PaymentControllers.sslCancel);
router.post("/ssl/cancel", PaymentControllers.sslCancel);
router.post("/ssl/validate", PaymentControllers.validateSslCallback);
router.post("/ssl/ipn", PaymentControllers.validateSslCallback);

router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.post("/validate-payment", PaymentControllers.validatePayment);

router.post(
  "/:orderId/initiate",
  checkAuth(Role.USER),
  validateRequest(initiatePaymentZodSchema),
  PaymentControllers.initiatePayment,
);
router.post(
  "/init-payment/:orderId",
  checkAuth(Role.USER),
  validateRequest(initiatePaymentZodSchema),
  PaymentControllers.initPayment,
);

router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentControllers.getInvoiceDownloadUrl,
);
router.get(
  "/invoice/:paymentId/download",
  checkAuth(...Object.values(Role)),
  PaymentControllers.downloadInvoice,
);

router.get(
  "/my/:orderId",
  checkAuth(Role.USER),
  PaymentControllers.getMyPaymentByOrder,
);

router.get(
  "/:orderId",
  checkAuth(Role.ADMIN, Role.MANAGER),
  PaymentControllers.getPaymentByOrderForAdmin,
);

export const PaymentRoutes = router;
