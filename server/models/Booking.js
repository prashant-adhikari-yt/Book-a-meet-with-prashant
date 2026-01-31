const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  time: {
    type: String, // Format: "HH:mm"
    required: true,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
