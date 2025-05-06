const User = require("../../models/user.model");
const CryptoJS = require("crypto-js");

// [GET] /api/v1/admin/user
module.exports.index = async (req, res) => {
  try {
    let users = [];
    const role = req.query.role;
    if (role) {
      users = await User.find({ role: role });
    } else {
      users = await User.find({});
    }
    res.status(200).json({
      message: "Success",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
    });
  }
};

// [GET] /api/v1/admin/user/get-info
module.exports.getInfo = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({ token: token });
    res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
    });
  }
};

// [POST] /api/v1/admin/user/add
module.exports.add = async (req, res) => {
  try {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      "secretkey"
    ).toString();
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({
      message: "Cập nhật thông tin tài khoản thành công!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Không thể cập nhật thông tin tài khoản !",
    });
  }
};

// [PATCH] /api/v1/admin/user/edit
module.exports.edit = async (req, res) => {
  try {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      "secretkey"
    ).toString();
    await User.updateOne(
      {
        username: req.body.username,
      },
      req.body
    );
    res.status(200).json({
      message: "Cập nhật thông tin tài khoản thành công!",
    });
  } catch (error) {
    res.status(200).json({
      message: "Không thể cập nhật thông tin tài khoản !",
    });
  }
};

// [DELETE] /api/v1/admin/user/delete
module.exports.delete = (req, res) => {
  res.send("OK");
};
