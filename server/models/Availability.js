const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  startTime: {
    type: String, // Format: "HH:mm"
    required: true,
  },
  endTime: {
    type: String, // Format: "HH:mm"
    required: true,
  },
  duration: {
    type: Number, // in minutes, e.g. 30
    default: 30,
  },
});

module.exports = mongoose.model("Availability", AvailabilitySchema);
