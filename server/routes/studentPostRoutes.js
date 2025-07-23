const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getStudentPosts,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentPostController");

router.get("/profile", auth, getStudentProfile);
router.put("/profile", auth, upload.single("resume"), updateStudentProfile);
router.get("/", auth, getStudentPosts);

module.exports = router;
