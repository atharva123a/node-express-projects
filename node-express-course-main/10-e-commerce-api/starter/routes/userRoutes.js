// routes for our user:
const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authenticatePermission,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require("../controllers/userController");

// placement is important:
router
  .route("/")
  .get(authenticateUser, authenticatePermission("admin", "owner"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);

router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
