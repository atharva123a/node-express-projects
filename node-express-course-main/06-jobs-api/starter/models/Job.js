// model for a job listed
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name!"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, `Please provide your designation`],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: {
        values: ["interview", "declined", "pending"],
        default: "pending",
        message: "Value is not supported",
      },
    },
    createdBy: {
      //   this is a new ref in mongoose for the user who created the job posting:
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
