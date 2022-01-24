const express = require("express");

const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  login,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
