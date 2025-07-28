import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
  profilePic: {
    type: String,
    required: true,
  },
});

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
