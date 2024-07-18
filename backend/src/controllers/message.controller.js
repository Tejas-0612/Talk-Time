import { isValidObjectId } from "mongoose";
import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

const createChat = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
    throw new ApiError("sender or receiver ID is missing");
  }

  const newChat = await Chat({
    participants: [senderId, receiverId],
  });

  const chat = await newChat.save();

  return res
    .status(201)
    .json(new ApiResponse(201, chat, "Chat created Successfully"));
});

const getAllUserChats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "UserId is not valid");
  }

  const chats = await Chat.find({
    participants: { $in: [userId] },
  }).sort({ lastModified: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Get all chats successfully"));
});

const createMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!isValidObjectId(chatId)) {
    throw new ApiError(400, "chatId is not valid");
  }
  const newMessage = new Message(req.body);

  const message = await newMessage.save();

  await Chat.findByIdAndUpdate(chatId, { lastModified: Date.now() });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message created successfully"));
});

const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!isValidObjectId(chatId)) {
    throw new ApiError(400, "chatId is not valid");
  }

  const messages = await Message.find({ chatId });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "get all messages"));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "userId is not valid");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User get successfully"));
});

export {
  createChat,
  getAllUserChats,
  createMessage,
  getChatMessages,
  getUserById,
};
