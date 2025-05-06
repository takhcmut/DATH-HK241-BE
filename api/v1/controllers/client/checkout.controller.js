const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const { generateOrderId } = require("../../../../helpers/generate");

// [POST] /api/v1/checkout/order
module.exports.order = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = await User.findOne({ token: token });
  const cartId = req.body.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  let productsList = [];

  Promise.all(
    cart.products.map((item) =>
      Product.findOne({ id: item.productId }).select("-_id")
    )
  )
    .then((products) => {
      const result = products.map((product) => {
        let temp = { ...product }._doc;
        const quantity = cart.products.find(
          (item) => item.productId === product.id
        ).quantity;
        temp.quantity = quantity;
        return temp;
      });
      productsList = result;
    })
    .then(() => {
      const newOrder = new Order({
        userId: user.id,
        orderId: generateOrderId(15),
        status: [...Array(productsList.length)].map(() => "pending"),
        products: productsList,
      });
      Promise.all([
        newOrder.save(),
        Cart.updateOne(
          {
            _id: cartId,
          },
          {
            products: [],
          }
        ),
      ])
        .then(() => {
          res.status(200).json({
            message: "Đặt hàng thành công!",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
};
