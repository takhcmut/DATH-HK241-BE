const LoginLog = require("../../models/login-log.model");
const User = require("../../models/user.model");

// [GET] /api/v1/admin/login-log
module.exports.index = async (req, res) => {
  try {
    const loginLogs = await LoginLog.find({});

    Promise.all(
      loginLogs.map((loginLog) => User.findOne({ _id: loginLog.userId }))
    ).then((users) => {
      res.status(200).json({
        message: "Success",
        loginLogs: loginLogs,
        users: users,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error",
    });
  }
};
