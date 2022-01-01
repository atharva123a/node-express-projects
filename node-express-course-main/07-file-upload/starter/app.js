require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// for using req.files:
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connect");

// router:
const ProductRouter = require("./routes/productRoutes");

// middleware:
const NotFoundMiddleware = require("./middleware/not-found");
const ErrorHandlerMiddleware = require("./middleware/error-handler");

// inbult middleware:
app.use(express.json());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));
// use routes:
app.use("/api/v1/products", ProductRouter);
app.use(ErrorHandlerMiddleware);
app.use(NotFoundMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
