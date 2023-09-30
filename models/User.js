const mongoose = require('mongoose');

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The Name is required."],
    },
    email: {
      type: String,
      required: [true, "The Username is required."],
    },
    password: {
      type: String,
      required: [true, "The Name is required."],
      minlength: [6, "Password length must be greater than 6"],
    },
    contactNumber: {
      type: String,
      minlength: [10, "Digits in Contact must be 10"],
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userModel);
module.exports = Users;
