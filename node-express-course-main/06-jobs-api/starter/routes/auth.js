// routes for authetication:

const express = require("express");
const { loginUser, registerUser } = require("../controllers/auth");
const authMiddleWare = require("../middleware/authentication");
const router = express.Router();

router.route("/login").post(authMiddleWare, loginUser);
router.route("/register").post(registerUser);

module.exports = router;
