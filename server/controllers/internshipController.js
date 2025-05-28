const Internship = require("../models/Internship");

exports.createInternship = async (req, res) => {
  try {
    if (req.user.role !== "company")
      return res
        .status(403)
        .json({ message: "Only companies can post internships" });

    const internship = await Internship.create({
      ...req.body,
      companyId: req.user._id,
    });

    res.status(201).json(internship);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to post internship", error: err.message });
  }
};

exports.getCompanyInternships = async (req, res) => {
  try {
    if (req.user.role !== "company")
      return res.status(403).json({ message: "Forbidden" });

    const { page = 1, limit = 6, search = "" } = req.query;
    const query = {
      companyId: req.user._id,
      title: { $regex: search, $options: "i" },
    };

    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Internship.countDocuments(query);
    res.json({ internships, total });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    if (
      req.user.role !== "company" ||
      !internship.companyId.equals(req.user._id)
    )
      return res.status(403).json({ message: "Forbidden" });

    Object.assign(internship, req.body);
    await internship.save();

    res.json({ message: "Internship updated", internship });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: "Not found" });

    if (
      req.user.role !== "company" ||
      !internship.companyId.equals(req.user._id)
    )
      return res.status(403).json({ message: "Unauthorized" });

    await internship.deleteOne();
    res.json({ message: "Internship deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    if (
      req.user.role !== "company" ||
      !internship.companyId.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(internship);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load internship", error: err.message });
  }
};

exports.getAllInternships = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", type, tech } = req.query;

    const query = {
      title: { $regex: search, $options: "i" },
    };

    if (type) query.type = type;
    if (tech) query.technologies = { $in: [tech] };

    const internships = await Internship.find(query)
      .populate("companyId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Internship.countDocuments(query);

    res.json({ internships, total });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};
