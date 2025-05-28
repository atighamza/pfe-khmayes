const mongoose = require("mongoose");

const studentPostSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    internshipType: {
      type: String,
      enum: ["Summer", "Final Year", "Gap Year"],
    },
    technologies: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentPost", studentPostSchema);
