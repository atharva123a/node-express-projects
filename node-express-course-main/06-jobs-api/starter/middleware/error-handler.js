const { StatusCodes } = require("http-status-codes");

// create a custom api error object and modify it accordingly:

const errorHandlerMiddleware = (err, req, res, next) => {
  // create a custom error object and modify it accordingly:
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Please try again later",
  };

  // handle duplicate email error:
  if (err && err.code === 11000) {
    customError.msg = `Duplicate value entered for the ${Object.keys(
      err.keyValue
    )} field. Please enter another value!`;
    customError.statusCode = Number(StatusCodes.BAD_REQUEST);
  }
  // handle validation error:
  if (err.name === "ValidationError") {
    // here we chained our values together:
    customError.msg = `${Object.values(err.errors)
      .map((item) => item.message)
      .join(",")}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // hanlde CastError:
  if (err.name === "CastError") {
    customError.msg = `No job found with id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
