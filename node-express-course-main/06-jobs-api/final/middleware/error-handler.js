// handles errors for us!

const { StatusCodes } = require("http-status-codes");

// we will also handle mongoose errors here:
const ErrorHandlerMiddleware = async (err, req, res, next) => {
  const customError = {
    message: err.message || "Something went wrong, please try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // handle model validation:
  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors)
      .map((item) => {
        return item.message;
      })
      .join(",");
    // customError.message = err.errors
  }

  // handle repeated email:
  if (err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message =
      "Email already in use. Please provide a different email";
  }
  if (err.name === "JsonWebTokenError") {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = "Invalid token!";
  }

  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `Invalid ID type`;
  }

  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  res.status(customError.statusCode).json(customError.message);
};

module.exports = ErrorHandlerMiddleware;
