import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(200, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User deleted Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) {
    throw new ApiError(404, "No users found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { deleteUser, getAllUsers };
