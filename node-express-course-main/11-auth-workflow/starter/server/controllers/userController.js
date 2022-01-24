const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");

const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  // to remove any field, simply use minus in front of it:
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id : ${id}`);
  }

  checkPermission(req.user, id);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide name and email");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.email = email;

  await user.save();

  const tokenUser = createTokenUser({ user });

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide an old password and a new password"
    );
  }

  const _id = req.user.userId;

  const user = await User.findOne({ _id });

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new CustomError.UnauthenticatedError("Old passwords do not match");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json("Updated password successfully!");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};

//  using findOneAndUpdate:
// const user = await User.findOneAndUpdate(
//   { _id: req.user.userId },
//   { name, email },
//   { new: true, runValidators: true }
// );
