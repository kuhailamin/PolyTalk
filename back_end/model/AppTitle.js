const mongoose = require("mongoose");

const AppTitle = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Polyadic Bot",
    },
    key: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppTitle", AppTitle);
