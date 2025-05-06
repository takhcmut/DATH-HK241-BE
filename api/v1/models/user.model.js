const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: String,
    nickname: {
      type: String,
      default: "",
    },
    avatar: String,
    username: String,
    password: String,
    role: String,
    email: String,
    phoneNumber: String,
    birthday: String,
    sex: String,
    nationality: String,
    address: String,
    token: {
      type: String,
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
