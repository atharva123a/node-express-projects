// controller for jobs API:

const { StatusCodes } = require("http-status-codes");

const { BadRequestError, NotFoundError } = require("../errors");

const Job = require("../models/Job");
const { findOne } = require("../models/User");

const User = require("../models/User");

const getAllJobs = async (req, res) => {
  //  we filter according to the user trying to access it!
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const createJob = async (req, res) => {
  // the auth middleware automatically authorizes the user for us:
  const { company, status, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide company, status and position");
  }
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new NotFoundError("User does not exist!");
  }
  // createdBy is added that takes in the userId that created that job!
  req.body.createdBy = req.user.userId;

  const data = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ data });
};

const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError("Not found");
  }

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Please enter company name and position");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { runValidators: true, new: true }
  );

  if (!job) {
    throw new NotFoundError(`Not found job with id : ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  // delete the job:
  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`Not found job with id : ${jobId}`);
  }

  res.send(`Deleted job at ${jobId}`);
};

module.exports = { getAllJobs, getJob, updateJob, deleteJob, createJob };
