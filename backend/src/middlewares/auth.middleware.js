import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.Token;

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token");
  }
});

export const isAdmin = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "admin") {
    next();
    return;
  }
  return res
    .status(403)
    .json(new ApiResponse(403, {}, "Only admin can do this"));
});

export const isCreator = asyncHandler(async (req, res, next) => {
  if (
    (req.user && req.user.role == "creator") ||
    (req.user && req.user.role == "admin")
  ) {
    next();
    return;
  }
  return res
    .status(403)
    .json(new ApiResponse(403, {}, "Only creators can do this"));
});

export const isUserVerified = asyncHandler(async (req, res) => {
  if (req.user && req.user.isVerified) {
    next();
    return;
  }
  return res
    .status(403)
    .json(new ApiResponse(403, {}, "Please email your address!"));
});
