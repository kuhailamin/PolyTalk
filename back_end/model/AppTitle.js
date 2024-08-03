const mongoose = require("mongoose");

// Define a schema for the AppTitle collection
const AppTitle = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Polyadic Bot", // Defalut title if none is provided
    },
    key: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Export the AppTitle model based on the schema
module.exports = mongoose.model("AppTitle", AppTitle);
