const mongoose = require("mongoose");

const studentPostSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rh", "technical", "accepted", "rejected"],
      default: "pending",
    },
    note: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, upsert: true, new: true }
);

module.exports = mongoose.model("StudentPost", studentPostSchema);
