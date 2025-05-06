const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");

// [GET] /api/v1/seller/order
module.exports.index = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const seller = await User.findOne({ token: token });
    const category = await Category.findOne({ seller_id: seller.id });
    const category_id = String(category.id);

    // Truy vấn tất cả đơn hàng từ MongoDB
    const orders = await Order.find({}).select(
      "-_id userId orderId status products createdAt"
    );

    let products = [];
    Promise.all(
      orders.map((order) => User.findOne({ _id: order.userId }))
    ).then((users) => {
      orders.forEach((order) => {
        // console.log(user);
        order.products.forEach((productInOrder, index) => {
          const pathSegments = productInOrder.primary_category_path.split("/");
          if (pathSegments[2] === category_id) {
            const user = users.find((user) => user?._id === order.userId);
            products.push({
              productId: productInOrder.id,
              productName: productInOrder.name,
              userName: user?.fullname,
              quantity: productInOrder.quantity,
              total_price: parseInt(
                productInOrder.price *
                  (1 - productInOrder.discount_rate / 100) *
                  productInOrder.quantity
              ),
              status: order?.status[index],
              orderId: order?.orderId,
              orderDate: order?.createdAt.toLocaleDateString("vi-VN"),
            });
          }
        });
      });
      res.status(200).json({
        message: "Success",
        orders: products,
      });
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

// [PATCH] /api/v1/seller/order/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const { orderId, productId } = req.body;
    let newStatus = [];
    let quantity = 0;
    let id = null;
    const order = await Order.findOne({ orderId: orderId });
    for (let i = 0; i < order.products.length; i++) {
      let temp = order.status[i];

      if (order.products[i].id == productId) {
        id = order.products[i].id;
        if (order.status[i] == "pending") {
          temp = "packaging";
        } else if (order.status[i] == "packaging") {
          temp = "delivering";
          quantity = order.products[i].quantity;
        } else if (order.status[i] == "delivering") {
          temp = "delivered";
        }
      }
      newStatus.push(temp);
    }
    await Order.updateOne(
      {
        orderId: orderId,
      },
      {
        $set: {
          status: newStatus,
        },
      }
    );

    const product = await Product.findOne({ id: id });
    const oldQty = product.stock_item.qty;
    const qtySold = {
      text: "Đã bán " + (quantity + product.quantity_sold.value),
      value: quantity + product.quantity_sold.value,
    };
    console.log(oldQty, qtySold, quantity);

    await Product.updateOne(
      {
        id: id,
      },
      {
        $set: {
          "stock_item.qty": oldQty - quantity,
          quantity_sold: qtySold,
        },
      }
    );
    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    res.status(400).json({
      message: "fail",
    });
  }
};

// [PATCH] /api/v1/seller/order/cancel
module.exports.cancel = async (req, res) => {
  try {
    const { orderId, productId } = req.body;
    let newStatus = [];

    const order = await Order.findOne({ orderId: orderId });
    for (let i = 0; i < order.products.length; i++) {
      let temp = order.status[i];

      if (order.products[i].id == productId) {
        temp = "cancelled";
      }
      newStatus.push(temp);
    }
    // console.log(newStatus);
    await Order.updateOne(
      {
        orderId: orderId,
      },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    res.status(400).json({
      message: "fail",
    });
  }
};
