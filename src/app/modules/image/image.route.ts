import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadImages } from "../../middlewares/uploadImages";
import { ImageController } from "./image.controller";
import { createMediaZodSchema } from "./image.validation";

// /api/image/

const router = Router();

router.post(
  "/upload",
  checkAuth(Role.ADMIN, Role.USER),
  uploadImages,
  validateRequest(createMediaZodSchema),
  ImageController.createImages,
);

router.get("/", checkAuth(Role.ADMIN), ImageController.getAllImages);
router.delete("/:id", checkAuth(Role.ADMIN), ImageController.deleteImage);

export const ImageRoutes = router;
