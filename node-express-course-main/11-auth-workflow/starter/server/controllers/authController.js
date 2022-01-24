const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const crypto = require("crypto");

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

  // generates random hex value of 40 bytes:
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  // only temp return token for postman testing:
  const origin = `http://localhost:3000`;

  // some useful properties in the req object:
  const tempOrigin = req.get("origin");
  const protocol = req.protocol;
  const host = req.get("host");

  const forwardedHost = req.get("x-forwarded-host");
  const forwardedProtocol = req.get("x-forwarded-proto");

  await sendVerificationEmail({ name, email, verificationToken, origin });
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email for verification code!!",
  });

  // we will not return token until user verifies email:
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

  // check if the user verified the email:
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email!");
  }

  // if there is a match:
  // const tokenUser = { userId: user._id, name: user.name, role: user.role };
  const tokenUser = createTokenUser({ user });

  // create a token document for our Token Model:
  let refreshToken = "";

  // check if the user already has the token:
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    // we simply prevent readdition of tokens to our database:
    const { isValid } = existingToken;
    if (!isValid) {
      // if the user is inValid we do not allow the user to login:
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    // set the refrestToken from the current token:
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];

  const token = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(token);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    expiresIn: Date.now(),
  });
  res.cookie("refreshToken", "logout", {
    expiresIn: Date.now(),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError(
      `No user found with email : ${email}`
    );
  }
  if (verificationToken !== user.verificationToken) {
    throw new CustomError.UnauthenticatedError("Tokens do not match!");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide email");
  }
  const user = await User.findOne({ email });

  if (user) {
    // send email:
    const origin = "http://localhost:3000";
    const expires = 1000 * 60 * 15;
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const passwordTokenExpirationDate = new Date(Date.now() + expires);
    await sendResetPasswordEmail({
      name: user.name,
      email,
      token: passwordToken,
      origin,
    });
    // hash before saving to the database:
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;

    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Please check you email for the verification link!` });
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  if (!email || !password || !token) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      currentDate < user.passwordTokenExpirationDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
      res.status(StatusCodes.OK).json({ msg: "password reset successful!" });
    }
  }
};

module.exports = {
  login,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
