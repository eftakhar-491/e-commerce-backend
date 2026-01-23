import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { uploadWithCloudinary } from "../../middlewares/multer";
import { ImageControllers } from "./image.controller";
import { Role } from "../user/user.interface";

// /api/image/

const router = Router();
// admin route

router.post(
  "/upload-image",
  checkAuth(Role.ADMIN),
  uploadWithCloudinary.single("image"),
  ImageControllers.uploadImage,
);

export const ImageRoutes = router;
