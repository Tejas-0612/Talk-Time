import dotenv from "dotenv";

import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

const server = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`⚙️ Server is running on port : ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server.....", error.message);
    process.exit(1);
  }
};

server();
