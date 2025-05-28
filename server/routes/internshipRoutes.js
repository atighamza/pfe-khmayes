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

router.get("/my", auth, getCompanyInternships);
router.get("/:id", auth, getInternshipById);
router.put("/:id", auth, updateInternship);
router.delete("/:id", auth, deleteInternship);
router.get("/", getAllInternships);
router.post("/", auth, createInternship);

module.exports = router;
