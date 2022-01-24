const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });

  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_DEV === "production",
    signed: true,
    maxAge: 1000,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expiresIn: new Date(Date.now() + oneDay),
    secure: process.env.NODE_DEV === "production",
    signed: true,
  });
};

// we used the following function before for sending simply one token:
// const attachSingleCookieToResponse = ({ res, user }) => {
//   // create token:
//   const payload = user;
//   const token = createJWT({ payload });
//   const oneDay = 1000 * 60 * 60 * 24;
//   // attack cookie:
//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_DEV === "production", // only https urls can access the cookies and modify them
//     signed: true,
//   });
// };

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
