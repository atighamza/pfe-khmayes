const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: String,
    password: String,
    role: { type: String, enum: ["student", "company"], required: true },
    // Student-specific fields
    university: String,
    degree: String,
    year: String,
    resumeUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
