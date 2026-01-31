const Availability = require("../models/Availability");

// Add availability (Admin only)
const addAvailability = async (req, res) => {
  try {
    const { dates, startTime, endTime, duration } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ message: "Valid dates array is required" });
    }

    const availabilities = dates.map((date) => ({
      date,
      startTime,
      endTime,
      duration: duration || 30,
    }));

    const result = await Availability.insertMany(availabilities);
    res
      .status(201)
      .json({ message: "Availability added", availabilities: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all availability (Admin only)
const getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.find().sort({ date: 1 });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete availability (Admin only)
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    await Availability.findByIdAndDelete(id);
    res.json({ message: "Availability deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addAvailability, getAllAvailability, deleteAvailability };
