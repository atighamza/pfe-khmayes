const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getStudentPosts,
  getStudentProfile,
  updateStudentProfile,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/studentPostController");

router.get("/profile", auth, getStudentProfile);
router.put("/profile", auth, upload.single("resume"), updateStudentProfile);
router.get("/", auth, getStudentPosts);
router.put("/:id/status", auth, updateApplicationStatus);
router.delete("/:id", auth, deleteApplication);

module.exports = router;
