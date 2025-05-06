const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

// [GET] /cart/:cartId
module.exports.index = async (req, res) => {
  const cartId = req.params.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length) {
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
        res.json({
          message: "Success",
          data: result,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: "Không thể lấy danh sách giỏ hàng!",
        })
      );
  } else {
    res.status(400).json({
      message: "Error: Cart Empty",
    });
  }
};

// [POST] /cart/add
module.exports.add = async (req, res) => {
  const cartId = req.body.cartId;
  const productId = parseInt(req.body.productId);
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const existProductInCart = cart.products.find(
    (item) => item.productId === productId
  );

  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.productId": productId,
      },
      {
        $set: {
          "products.$.quantity": newQuantity,
        },
      }
    );
  } else {
    const objectCart = {
      productId: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      { _id: cartId },
      {
        $push: { products: objectCart },
      }
    );
  }
  res.status(200).json({
    message: "Success",
    hasQuantityUpdated: existProductInCart ? false : true,
  });
};

// [POST] /cart/delete
module.exports.delete = async (req, res) => {
  const cartId = req.body.cartId;
  const productId = req.body.productId;

  const cart = await Cart.findOne({
    _id: cartId,
  });
  if (!cart.products.length) {
    res.json({
      code: 400,
      message: "Error: Products Array Empty",
    });
    return;
  }

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { productId: productId } },
    }
  );
  res.json({
    code: 200,
    message: "Success",
  });
};

// [PATCH] /cart/update
module.exports.update = async (req, res) => {
  const cartId = req.body.cartId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.productId": productId,
    },
    {
      $set: {
        "products.$.quantity": quantity,
      },
    }
  );

  res.json({
    code: 200,
    message: "Success",
  });
};
