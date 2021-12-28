require("dotenv").config(); // for secret:

const { UnauthenticatedError, BadRequestError } = require("../errors/index");

const jwt = require("jsonwebtoken");

const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");

// checks for the token to authenticate our user:
// this is imp so that the user tryping to modify jobs is doing so for his own job and not for anyone else's jobs
const authMiddleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authorization Failed");
  }
  const token = authHeader.split(" ")[1];
  try {
    //   payload recieves data when jwt verifies the token
    const payload = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: payload.userId, name: payload.name };
    next();
    //   req.user = {userId : payload.user.userId}
  } catch (error) {
    throw new UnauthenticatedError("Authorization Failed");
  }
};

module.exports = authMiddleWare;
