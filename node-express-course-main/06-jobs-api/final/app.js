require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const ErrorHandlerMiddleware = require("./middleware/error-handler");

const NotFoundMiddleware = require("./middleware/not-found");

const authMiddleware = require("./middleware/auth");

const connectDB = require("./db/connect");

// middleware:
app.use(express.json());

const port = process.env.PORT || 5000;

// routes:
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");

app.use("/api/v1", authRoute);
app.use("/api/v1", authMiddleware, jobsRoute);
// use middleware!
app.use(ErrorHandlerMiddleware);
app.use(NotFoundMiddleware);

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port);
  console.log(`Server listening on port ${port}...`);
};

start();
