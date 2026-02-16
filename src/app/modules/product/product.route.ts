// import { Router } from "express";
// import { checkAuth } from "../../middlewares/checkAuth";

// import { Role } from "../user-pre/user.interface";
// import { validateRequest } from "../../middlewares/validateRequest";
// import {
//   createProductZodSchema,
//   updateProductZodSchema,
// } from "./product.validetion";
// import { ProductController } from "./product.controller";

// import { parseFormData } from "../../middlewares/parseFormData";

// // /api/product/

// const router = Router();
// // admin route

// router.post(
//   "/create",
//   checkAuth(Role.ADMIN),
//   validateRequest(createProductZodSchema),
//   ProductController.createProduct,
// );

// router.post(
//   "/update/:id",
//   checkAuth(Role.ADMIN),
//   validateRequest(updateProductZodSchema),
//   ProductController.updateProduct,
// );

// router.get("/", ProductController.getAllProducts);
// router.get("/:id", ProductController.getProductById);


// export const ProductRoutes = router;
