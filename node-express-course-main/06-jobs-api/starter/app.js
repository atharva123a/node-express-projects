require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const authMiddleWare = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages for security:
app.set("trust proxy", 1);
app.use(
  // limits requests from user:
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(helmet()); // for security
app.use(cors()); // for cross origin resource sharing
app.use(xss()); // in order to prevent cross origin attacks!

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
