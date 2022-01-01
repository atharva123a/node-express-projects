// error handler for all routes that do not exist!
const { StatusCodes } = require("http-status-codes");

const NotFound = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).send("Not Found!");

module.exports = NotFound;
