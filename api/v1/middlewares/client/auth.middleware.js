const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const user = await User.findOne({
    token: token,
  }).select("-password -token");

  if (!user) {
    res.status(401).json({
      message: "Invalid Token",
    });
    return;
  }

  next();
};
