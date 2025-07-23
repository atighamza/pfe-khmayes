const StudentPost = require("../models/StudentPost");
const User = require("../models/User");
const Internship = require("../models/Internship");

exports.getStudentPosts = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { page = 1, limit = 6, search = "" } = req.query;

    // Get all internships from this company
    const companyInternships = await Internship.find({
      companyId: req.user._id,
    }).select("_id");

    const query = {
      internshipId: { $in: companyInternships },
    };

    const posts = await StudentPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("studentId", "name email")
      .populate("internshipId", "title technologies type");

    const total = await StudentPost.countDocuments(query);

    res.json({ posts, total });
  } catch (err) {
    console.error("Error in getStudentPosts:", err);
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await User.findById(req.user._id).select("-password");
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, university, degree, year } = req.body;
    const updateData = { name, university, degree, year };

    if (req.file) {
      updateData.resumeUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};