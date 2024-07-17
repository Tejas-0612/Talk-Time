import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { options } from "../constants.js";
import { User } from "../models/user.model.js";
import { Token } from "../models/token.model.js";
import sendEmail from "../utils/sendEmail.js";
import hashToken from "../utils/hashToken.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const avatar = `https://avatar.iran.liara.run/username?username=${name}`;

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  if (!user) {
    throw new ApiError(400, "Invalid User data");
  }

  const token = generateToken(user._id);

  if (!token) {
    throw new ApiError(400, "Problem while generating token");
  }

  res.cookie("Token", token, options);

  res
    .status(201)
    .json(new ApiResponse(201, { user, token }, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(404, "User not found!");
  }

  const isMatch = await bcrypt.compare(password, existedUser.password);

  if (!isMatch) {
    throw new ApiError(400, "Password you entered is INCORRECT!");
  }

  const token = generateToken(existedUser._id);

  if (!token) {
    throw new ApiError(400, "Error while generating token");
  }

  res.cookie("Token", token, options);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { existedUser, token },
        "User LoggedIn Successfully!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .clearCookie("Token")
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json(new ApiResponse(200, user, "get user successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const { name, bio, avatar } = req.body;

  user.name = name || user.name;
  user.bio = bio || user.bio;
  user.avatar = avatar || user.avatar;

  const updatedUser = await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated Successfully"));
});

const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.Token;

  if (!token) {
    throw new ApiError(400, "Not authorized, please login!");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    res.status(200).json(false);
  }

  return res.status(200).json(true);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid Password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(400, "Users not found");
  }

  if (user.isVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User is already verified"));
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }).save();

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // send email
  const subject = "Email Verification - AuthKit";
  const send_to = user.email;
  const reply_to = "noreply@gmail.com";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL;
  const name = user.name;
  const url = verificationLink;

  await sendEmail(subject, send_to, send_from, reply_to, template, name, url);

  return res.status(200).json(new ApiResponse(200, {}, "Email could be sent"));
});

const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "Invalid verification token");
  }

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  const user = await User.findById(userToken.userId);

  if (user.isVerified) {
    return res
      .status(400)
      .json(new ApiResponse(400, user, "User is already verified"));
  }

  user.isVerified = true;
  await user.save();

  return res.status(200).json(new ApiResponse(200, user, "User verified"));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  const hashedToken = hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  }).save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  const subject = "Password Reset - TalkTime";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL;
  const reply_to = "noreply@gmail.com";
  const template = "forgetPassword";
  const name = user.name;
  const url = resetLink;

  await sendEmail(subject, send_to, send_from, reply_to, template, name, url);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email sent successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const hashedToken = hashToken(resetPasswordToken);

  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const user = await User.findById(userToken.userId);

  user.password = password;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset Successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
