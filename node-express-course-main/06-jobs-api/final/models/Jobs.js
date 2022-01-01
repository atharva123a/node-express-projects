const mongoose = require("mongoose");

const User = require("./User");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please enter company name"],
      minLength: 3,
    },
    position: {
      type: String,
      required: [true, "Please enter position"],
      minLength: 3,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "interview", "declined"],
        message: `{VALUE} is not supported!`,
      },
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
