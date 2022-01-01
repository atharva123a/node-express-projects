// handle server requests for jobs:

const Job = require("../models/Jobs");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  // get jobs and sort them by time when they were created:
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs });
};

const addJob = async (req, res) => {
  // create a new job:
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.userId;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job found with id : ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.userId;

  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Please enter company and position");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true }
  );

  if (!job) {
    throw new NotFoundError(`No job found with id : ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job found with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).send(`Deleted job with id : ${jobId}`);
};

module.exports = { getAllJobs, addJob, getJob, updateJob, deleteJob };
