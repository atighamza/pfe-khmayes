const StudentPost = require("../models/StudentPost");
const User = require("../models/User");
const Internship = require("../models/Internship");
const nodemailer = require("nodemailer");

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

exports.updateApplicationStatus = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_KEY}`,
    },
  });

  const sendEmail = async (to, subject, body, cc = null) => {
    return transporter.sendMail({
      from: `"FORSA" <${process.env.EMAIL_USER}>`,
      to,
      cc,
      subject,
      text: body,
    });
  };
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_KEY:", process.env.EMAIL_KEY);
    const { id } = req.params;
    const { status } = req.body;

    const post = await StudentPost.findById(id).populate(
      "studentId internshipId"
    );
    if (!post)
      return res.status(404).json({ message: "Application not found" });

    post.status = status;
    await post.save();

    const email = post.studentId.email;
    const studentName = post.studentId.name;
    const internshipTitle = post.internshipId.title;
    const companyName = req.user.name;

    const templates = {
      rh: {
        subject: `HR Interview Invitation – ${internshipTitle}`,
        body: `Dear ${studentName},\n\nThank you for your application to ${companyName}.\nWe are pleased to invite you to an HR interview for the position of ${internshipTitle}.\nPlease reply with your availability.\n\nBest regards,\n${companyName} HR Team`,
      },
      technical: {
        subject: `Technical Interview Invitation – ${internshipTitle}`,
        body: `Dear ${studentName},\n\nCongratulations! You’ve been shortlisted for a technical interview at ${companyName}.\nPlease respond with your preferred time slots.\n\nBest,\n${companyName} Technical Team`,
      },
      accepted: {
        subject: `Internship Offer – ${internshipTitle}`,
        body: `Dear ${studentName},\n\nCongratulations! We are excited to offer you the position of ${internshipTitle} at ${companyName}.\nPlease confirm your acceptance.\n\nWelcome aboard,\n${companyName}`,
      },
      rejected: {
        subject: `Application Update – ${internshipTitle}`,
        body: `Dear ${studentName},\n\nThank you for applying to ${companyName} for the ${internshipTitle} position.\nAfter careful consideration, we regret to inform you that you have not been selected.\n\nKind regards,\n${companyName}`,
      },
    };

    if (templates[status]) {
      const { subject, body } = templates[status];
      await sendEmail(email, subject, body, req.user.email);
    }

    res.json({ message: "Status updated and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
};
exports.deleteApplication = async (req, res) => {
  try {
    const post = await StudentPost.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Application not found" });

    const internship = await Internship.findById(post.internshipId);
    if (!internship || !internship.companyId.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Application deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete application", error: err.message });
  }
};
