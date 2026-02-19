import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import {
  adminUpdateUserZodSchema,
  createAddressZodSchema,
  updateAddressZodSchema,
  updateMeZodSchema,
} from "./user.validation";

// /api/user/

const router = Router();
// admin route
router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

router.get(
  "/profile/:id",
  checkAuth(Role.ADMIN),
  UserControllers.getSingleUser,
);

router.put(
  "/update-profile/:id",
  checkAuth(Role.ADMIN),
  validateRequest(adminUpdateUserZodSchema),
  UserControllers.updateUser,
);

// user route
router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.getMe,
);

router.patch(
  "/profile",
  checkAuth(...Object.values(Role)),
  validateRequest(updateMeZodSchema),
  UserControllers.updateMe,
);

router.post(
  "/addresses",
  checkAuth(...Object.values(Role)),
  validateRequest(createAddressZodSchema),
  UserControllers.createAddress,
);

router.get(
  "/addresses",
  checkAuth(...Object.values(Role)),
  UserControllers.getMyAddresses,
);

router.patch(
  "/addresses/:addressId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateAddressZodSchema),
  UserControllers.updateMyAddress,
);

router.patch(
  "/addresses/set-default/:addressId",
  checkAuth(...Object.values(Role)),
  UserControllers.setDefaultAddress,
);

router.delete(
  "/addresses/:addressId",
  checkAuth(...Object.values(Role)),
  UserControllers.deleteMyAddress,
);

export const UserRoutes = router;
