const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");

module.exports.requireCart = async (req, res, next) => {
  const cartId = req.body.cartId;
  if (!cartId) {
    const token = req.body.token;
    const user = await User.findOne({ token: token });
    const cart = new Cart({
      userId: user.id,
    });
    await cart.save();

    const expiresTime = 1000 * 60 * 60 * 24 * 365;

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
    });
  }

  next();
};