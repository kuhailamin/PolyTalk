const mongoose = require("mongoose");

// Define a schema for the Activity collection
const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      default: "Left Chat",
    },
    channel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Export the Activity model based on the schema
module.exports = mongoose.model("Activity", ActivitySchema);
