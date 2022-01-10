const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");

const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await User.findOne({ email });
  if (data) {
    throw new CustomError.BadRequestError("email already in use!");
  }

  // check if it is the user's first account or not:
  const isFirstAccount = (await User.countDocuments({})) === 0;

  // if it is, then he is assigned admin:
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser({ user });

  attachCookiesToResponse({ user: tokenUser, res });
  res.status(StatusCodes.CREATED).json({ tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Invalid credentials!");
  }
  // make sure you wait for the comparison here as well:
  const isMatch = await user.comparePassword(password);
  // if not match:
  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Invalid credentials!");
  }

  // if there is a match:
  // const tokenUser = { userId: user._id, name: user.name, role: user.role };
  const tokenUser = createTokenUser({ user });

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  const token = "";
  res.cookie("token", token, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out user!");
};

module.exports = { login, logout, register };
