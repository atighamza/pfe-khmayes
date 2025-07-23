const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Ensure student can only apply once per internship
applicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
