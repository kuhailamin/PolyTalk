const mongoose = require("mongoose");

// Define a schema for the Chat collection
const ChatSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Export the Chat model based on the schema
module.exports = mongoose.model("Chat", ChatSchema);
