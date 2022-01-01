const express = require("express");
const router = express.Router();

const { UploadProductImage } = require("../controllers/uploadsController");

const {
  getAllProducts,
  createProduct,
} = require("../controllers/productController");

router.route("/").get(getAllProducts).post(createProduct);
router.route("/uploads").post(UploadProductImage);

module.exports = router;
