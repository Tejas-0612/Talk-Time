import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createChat,
  createMessage,
  getAllUserChats,
  getChatMessages,
  getUserById,
} from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/chats/create", createChat);
router.get("/chats/:userId", getAllUserChats);

router.post("/message/create", createMessage);
router.get("/messages/:chatId", getChatMessages);

router.get("/user/:userId", getUserById);

export default router;
