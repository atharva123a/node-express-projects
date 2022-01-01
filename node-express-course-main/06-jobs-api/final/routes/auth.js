// basically routes for login and register:

const express = require("express");
const router = express.Router();

const { loginUser, registerUser } = require("../controller/auth");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

module.exports = router;
