import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
