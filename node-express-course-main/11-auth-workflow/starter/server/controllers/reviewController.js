const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const { checkPermission } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const { userId } = req.user;

  // check if the product exists:
  const isProductValid = await Product.findOne({ _id: productId });

  if (!isProductValid) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${productId}`
    );
  }
  req.body.user = userId;

  // check if the user already has submitted a review:
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "User has already submitted a review!"
    );
  }

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review, count: review.length });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "company name price",
    })
    .populate({ path: "user", select: "name" });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review exists with id : ${reviewId}`
    );
  }
  res.status(StatusCodes.OK).json({ review, count: review.length });
};

const updateReview = async (req, res) => {
  const { userId } = req.user;
  const reviewId = req.params.id;

  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review exists with id : ${id}`);
  }

  // check if the userId mathches with user:
  checkPermission(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review: review, count: review.length });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${reviewId}`
    );
  }

  checkPermission(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "deleted review successfully!" });
};

// get all reviews for a single product:
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
