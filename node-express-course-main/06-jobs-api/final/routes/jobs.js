// handle job routes:

const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  addJob,
  getJob,
  updateJob,
  deleteJob,
} = require("../controller/jobs");

router.route("/jobs").get(getAllJobs).post(addJob);
router.route("/jobs/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
