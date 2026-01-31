const express = require("express");
const {
  addAvailability,
  getAllAvailability,
  deleteAvailability,
} = require("../controllers/availabilityController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware);

// POST /api/availability
router.post("/", addAvailability);

// GET /api/availability
router.get("/", getAllAvailability);

// DELETE /api/availability/:id
router.delete("/:id", deleteAvailability);

module.exports = router;
