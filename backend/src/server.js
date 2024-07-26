import dotenv from "dotenv";

import { app } from "./app.js";
import connectDB from "./db/index.js";
import socketHandler from "./socket.js";
import { createServer } from "node:http";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

socketHandler(httpServer);

const server = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`⚙️ Server is running on port : ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server.....", error.message);
    process.exit(1);
  }
};

server();
