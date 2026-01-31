const express = require("express");
const {
  login,
  createAdmin,
  verifyToken,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/verify
router.get("/verify", authMiddleware, verifyToken);

// POST /api/auth/create-admin (One-time setup)
router.post("/create-admin", createAdmin);

module.exports = router;
