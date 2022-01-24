const { isTokenValid } = require("../utils");
const Token = require("../models/Token");
const CustomError = require("../errors");
const { attachCookiesToResponse } = require("../utils");
const { StatusCodes } = require("http-status-codes");

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (accessToken && isTokenValid(accessToken)) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({ user: payload.user.userId });
    // if the token does not exist or is not valid throw error:
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Failed");
    }
    // attaching user payload to the user object:
    req.user = payload.user;
    const user = req.user;
    // return refreshTokens and accessToken as cookie responses:
    attachCookiesToResponse({ res, user, refreshToken });
    return next();
  } catch (error) {
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
