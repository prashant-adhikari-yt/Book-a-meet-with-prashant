const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Admin Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.passwordHash); // Changed from user.password to user.passwordHash
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Create Token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "your-secret-key", // Added fallback for JWT_SECRET
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { email: user.email, role: user.role } });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Verify Token (Check if user is still valid)
const verifyToken = async (req, res) => {
  try {
    // req.user comes from jwt.verify decoding the payload
    // use authController.js login: payload = { user: { id: user.id, role: user.role } }
    // So req.user is { user: { id: ..., role: ... }, iat: ..., exp: ... }
    const user = await User.findById(req.user.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ valid: true, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Create Admin (One-time setup, can be removed after first admin is created)
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ email, passwordHash });
    await user.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Utility: Create admin directly (for server startup)
const createAdminDirect = async (email, password) => {
  try {
    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Admin user already exists");
      return { success: true, message: "Admin already exists" };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ email, passwordHash });
    await user.save();

    console.log("✅ Admin user created successfully:", email);
    return { success: true, message: "Admin created successfully" };
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { login, createAdmin, createAdminDirect, verifyToken };
