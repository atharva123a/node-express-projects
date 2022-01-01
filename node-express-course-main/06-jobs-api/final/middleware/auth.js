// middleware to authorize the user:
require("dotenv").config();

const jwt = require("jsonwebtoken");

const { UnAuthenticatedError } = require("../errors");

const User = require("../models/User");

const authorizeUser = async (req, res, next) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Unauthorized to access the page!");
  }

  const token = headers.split(" ")[1];

  const payload = await jwt.verify(token, process.env.secretJWT);

  if (!payload) {
    throw new UnAuthenticatedError("Unauthorized to access the page!");
  }
  const user = await User.findById(payload.userId);
  req.user = { userId: payload.userId };
  next();
};

module.exports = authorizeUser;
