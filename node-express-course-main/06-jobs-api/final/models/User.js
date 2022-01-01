require("dotenv").config();

const bcrypt = require("bcryptjs");
const { BadRequestError } = require("../errors");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email!"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email type!",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password!"],
    minLength: 6,
  },
});

// this is not a method, but something we try to do just before saving our
UserSchema.pre("save", async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// we have an instance method that allows us to create a token on a particular document in the user model!
UserSchema.methods.createJWT = async function () {
  const token = await jwt.sign(
    { userId: this.id, name: this.name },
    process.env.secretJWT,
    { expiresIn: process.env.LIFETIME }
  );
  return token;
};

UserSchema.methods.match = async function (candidatePassword) {
  const match = await bcrypt.compare(candidatePassword, this.password);
  return match;
};

module.exports = mongoose.model("User", UserSchema);
