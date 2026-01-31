const OTP = require("../models/OTP");
const { sendOTPEmail } = require("../services/emailService");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    console.log(`OTP sent to ${email}: ${otp}`); // For development only

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, delete it
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Email verified successfully", verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};

module.exports = { sendOTP, verifyOTP };
