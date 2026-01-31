const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/otpController");

const router = express.Router();

// POST /api/otp/send
router.post("/send", sendOTP);

// POST /api/otp/verify
router.post("/verify", verifyOTP);

module.exports = router;
