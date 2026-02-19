import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user-pre/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";

import { uploadImages } from "../../middlewares/uploadImages";

import { parseFormData } from "../../middlewares/parseFormData";
import { ImageController } from "./image.controller";

// /api/product/

const router = Router();
// admin route

router.post(
  "/upload",
  checkAuth(Role.ADMIN),
  uploadImages,
  ImageController.createImages,
);
router.get("/", checkAuth(Role.ADMIN), ImageController.getAllImages);
router.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN),
  ImageController.deleteImage,
);

// router.post(
//   "/update/:id",
//   checkAuth(Role.ADMIN),
//   validateRequest(updateProductZodSchema),
//   ProductController.updateProduct,
// );
// router.get("/", ProductController.getAllProducts);
// router.get("/:id", ProductController.getProductById);

export const ImageRoutes = router;
