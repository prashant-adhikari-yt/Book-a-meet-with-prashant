const express = require("express");
const {
  getAvailableSlots,
  getAvailableDates,
  createBooking,
  getAllBookings,
  cancelBooking,
  sendReminder,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/slots", getAvailableSlots); // GET /api/bookings/slots?date=YYYY-MM-DD
router.get("/available-dates", getAvailableDates); // GET /api/bookings/available-dates
router.post("/", createBooking); // POST /api/bookings

// Protected routes (admin only)
router.get("/", authMiddleware, getAllBookings); // GET /api/bookings
router.delete("/:id", authMiddleware, cancelBooking); // DELETE /api/bookings/:id
router.post("/:id/reminder", authMiddleware, sendReminder); // POST /api/bookings/:id/reminder

module.exports = router;
