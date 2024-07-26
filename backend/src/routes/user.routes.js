import { Router } from "express";

import {
  acceptFriendRequest,
  changePassword,
  forgetPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  searchUsers,
  sendFriendRequest,
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

router.get("/search-users", verifyJWT, searchUsers);
router.post("/send-friend-request", verifyJWT, sendFriendRequest);
router.post("/friends/accept", verifyJWT, acceptFriendRequest);

export default router;
