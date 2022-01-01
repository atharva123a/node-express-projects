const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} = require("../errors/");
const User = require("../models/User");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please enter email and password!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("Invalid email!");
  }
  // async bycrpt compare:
  const isMatch = await user.match(password);
  if (!isMatch) {
    throw new UnAuthenticatedError("Invalid Password");
  }

  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ name: user.name, token });
};

const registerUser = async (req, res) => {
  const user = await User.create(req.body);
  const token = await user.createJWT();
  res.status(StatusCodes.CREATED).json({ user });
};
module.exports = { loginUser, registerUser };
