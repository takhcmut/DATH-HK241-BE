const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
  {
    userId: String
  },
  { timestamps: true }
);

const LoginLog = new mongoose.model("LoginLog", loginLogSchema, "login-logs");

module.exports = LoginLog;