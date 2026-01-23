import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import * as z from "zod";

// /api/product/

const router = Router();
// admin route

export const ProductRoutes = router;
