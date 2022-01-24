const CustomError = require("../errors");

const checkPermission = (requestUser, requestId) => {
  // admin has all rights:
  if (requestUser.role === "admin") return;

  // user is the person requesting data:
  if (requestUser.userId.toString() === requestId.toString()) return;

  // throw new error:
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route!"
  );
};

module.exports = checkPermission;
