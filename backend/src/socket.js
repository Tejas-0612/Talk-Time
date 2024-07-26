import { User } from "./models/user.model.js";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = async (socketId) => {
  const user = users.find((user) => user.socketId !== socketId);

  if (user) {
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { lastSeen: new Date() },
      { new: true }
    );

    users = users.filter((user) => user.socketId !== socketId);

    return updatedUser;
  }
};

const socketHandler = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("add user", (userId) => {
      addUser(userId, socket.id);
      io.emit("get users", users);
    });

    socket.on("send message", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);

      if (user) {
        io.to(user.socketId).emit("get message", {
          senderId,
          text,
        });
      } else {
        console.log("User not found");
      }
    });

    socket.on("disconnect", async () => {
      console.log("a user disconnected", socket.id);
      const updatedUser = await removeUser(socket.id);
      if (updatedUser) {
        io.emit("user disconnected", updatedUser);
      }
      io.emit("get users", users);
    });
  });
};

export default socketHandler;
