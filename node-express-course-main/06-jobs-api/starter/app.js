require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const authMiddleWare = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

// routers
app.use("/api/v1", authRoutes);
app.use("/api/v1", authMiddleWare, jobRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// modules:
const connectDB = require("./db/connect");
const { route } = require("./routes/auth");

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
