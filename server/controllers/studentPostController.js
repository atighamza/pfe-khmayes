const StudentPost = require("../models/StudentPost");
const User = require("../models/User");

exports.getStudentPosts = async (req, res) => {
  try {
    if (req.user.role !== "company")
      return res.status(403).json({ message: "Forbidden" });

    const { page = 1, limit = 6, search = "" } = req.query;

    const query = {
      title: { $regex: search, $options: "i" },
    };

    const posts = await StudentPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("studentId", "name email");

    const total = await StudentPost.countDocuments(query);

    res.json({ posts, total });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Access denied" });

  const student = await User.findById(req.user._id).select("-password");
  res.json(student);
};

exports.updateStudentProfile = async (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Access denied" });

  const { name, university, degree, year, resumeUrl } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, university, degree, year, resumeUrl },
    { new: true }
  ).select("-password");

  res.json(updated);
};
