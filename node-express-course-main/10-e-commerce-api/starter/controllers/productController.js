const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "reviews"
  );
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product, count: product.count });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${req.params.id}`
    );
  }
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ updatedProduct, count: updateProduct.count });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${productId}`
    );
  }
  // remove the product:
  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "deleted successfully!" });
};

const uploadImage = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new CustomError.BadRequestError("No file uploaded!");
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload images smaller than 1MB"
    );
  }
  // join paths:
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  // move the product:
  productImage.mv(imagePath);

  res
    .status(StatusCodes.OK)
    .json({ img: { src: `/uploads/${productImage.name}` } });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
