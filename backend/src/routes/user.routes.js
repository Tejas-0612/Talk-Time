import { Router } from "express";

import {
  changePassword,
  forgetPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);

router.get("/user", verifyJWT, getUser);
router.patch("/update", verifyJWT, updateUser);
router.get("/login-status", userLoginStatus);

router.post("/verify-email", verifyJWT, verifyEmail);
router.post("/verify-user/:verificationToken", verifyUser);

router.patch("/change-password", verifyJWT, changePassword);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);

export default router;
