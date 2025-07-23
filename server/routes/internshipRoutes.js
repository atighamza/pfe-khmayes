const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createInternship,
  getCompanyInternships,
  updateInternship,
  deleteInternship,
  getInternshipById,
  getAllInternships,
} = require("../controllers/internshipController");
const {
  getApplicationStatus,
  applyForInternship,
} = require("../controllers/applicationController");

router.get("/my", auth, getCompanyInternships);
router.get("/:id", auth, getInternshipById);
router.put("/:id", auth, updateInternship);
router.delete("/:id", auth, deleteInternship);
router.get("/", getAllInternships);
router.post("/", auth, createInternship);

// Application routes
router.get("/:id/application-status", auth, getApplicationStatus);
router.post("/:id/apply", auth, applyForInternship);

module.exports = router;
