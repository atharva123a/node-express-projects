const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const attachCookiesToResponse = ({ res, user }) => {
  // create token:
  const payload = user;
  const token = createJWT({ payload });
  const oneDay = 1000 * 60 * 60 * 24;
  // attack cookie:
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_DEV === "production", // only https urls can access the cookies and modify them
    signed: true,
  });
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
