const Application = require("../models/Application");
const StudentPost = require("../models/StudentPost");
const Internship = require("../models/Internship");

exports.getApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can check application status" });
    }

    const application = await Application.findOne({
      internshipId: req.params.id,
      studentId: req.user._id,
    });

    res.json({ hasApplied: !!application });
  } catch (err) {
    res.status(500).json({ message: "Error checking application status", error: err.message });
  }
};

exports.applyForInternship = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can apply" });
    }

    // Check if internship exists
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    // Create or update student post
    const studentPost = await StudentPost.findOneAndUpdate(
      {
        studentId: req.user._id,
        internshipId: req.params.id,
      },
      {
        studentId: req.user._id,
        internshipId: req.params.id,
        status: "pending",
      },
      { upsert: true, new: true }
    );

    res.status(201).json(studentPost);
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ message: "Error applying for internship", error: err.message });
  }
};
