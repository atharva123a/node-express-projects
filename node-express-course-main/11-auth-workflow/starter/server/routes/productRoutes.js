const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const {
  authenticateUser,
  authenticatePermission,
} = require("../middleware/authentication");

const { getSingleProductReviews } = require("../controllers/reviewController");

// the get all products is public
router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authenticatePermission("admin")], createProduct);

//uploadImage is admin only:
router
  .route("/uploadImage")
  .post(authenticateUser, authenticatePermission("admin"), uploadImage);

// get single product is public:
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authenticatePermission("admin")], updateProduct)
  .delete([authenticateUser, authenticatePermission("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
