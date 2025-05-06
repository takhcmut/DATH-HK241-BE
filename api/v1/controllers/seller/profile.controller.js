const User = require("../../models/user.model");

// [GET] /api/v1/seller/profile
module.exports.index = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const seller = await User.findOne({ token: token }).select(
      "_id nickname description address phone email"
    );
    // Truy vấn tất cả đơn hàng từ MongoD

    res.status(200).json({
      message: "Success",
      seller: seller,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

// [PATCH] /api/v1/seller/profile/edit
module.exports.edit = async (req, res) => {
  const { ...userInfo } = req.body;
  await User.updateOne(
    {
      token: userInfo.token,
    },
    userInfo
  );
  res.status(200).json({
    message: "Success",
  });
};