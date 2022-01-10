const { isTokenValid } = require("../utils");

const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication failed!");
  }
  try {
    const { userId, name, role } = isTokenValid({ token });
    req.user = { userId, name, role };
    next();
  } catch (error) {
    console.log(error);
    throw new CustomError.UnauthenticatedError("Authentication failed!");
  }
};

const authenticatePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access the route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authenticatePermission };
