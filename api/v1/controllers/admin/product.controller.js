const Product = require("../../models/product.model");

// [GET] /api/v1/admin/product
module.exports.index = async (req, res) => {
  let page = parseInt(req.query.page);
  let categoryId = req.query?.categoryId;

  if (!page) {
    page = 0;
  }

  try {
    const productsPerPage = 2000;

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.floor(totalProducts / 40);
    if (page > totalPages) {
      res.status(400).json({
        message: "Error: Invalid page",
      });
      return;
    }

    const regex = new RegExp(`^\\d+/\\d+/${categoryId}/`);

    let products = [];
    if (categoryId) {
      products = await Product.find({
        primary_category_path: regex,
        deleted: false,
      })
        .skip(page * productsPerPage)
        .limit(productsPerPage);
    } else {
      products = await Product.find({ deleted: false })
        .skip(page * productsPerPage)
        .limit(productsPerPage);
    }

    res.status(200).json({
      message: "Success",
      products: products,
      totalPages: totalPages,
      totalProducts: totalProducts,
      productsPerPage: productsPerPage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
    });
  }
};

// [POST] /api/v1/admin/product/add
module.exports.add = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      discount_rate: req.body.discountRate,
      description: req.body.description,
      stock_item: {
        qty: req.body.stockQty,
      },
      thumbnail_url: req.body.thumbnailUrl,
      categories: {
        id: parseInt(req.body.categoryId),
        name: req.body.categoryName,
      },
      primary_category_path: `1/2/${req.body.rootCategoryId}/${req.body.categoryId}`,
    });
    console.log(newProduct);
    await newProduct.save();

    res.status(200).json({
      message: "Add Success",
    });
  } catch (error) {
    res.status(400).json({
      message: "Add Error",
    });
  }
};

// [PATCH] /api/v1/admin/product/edit
module.exports.edit = async (req, res) => {
  try {
    await Product.updateOne(
      {
        id: parseInt(req.body.id),
      },
      {
        $set: {
          "stock_item.qty": req.body.stockQty,
          name: req.body.name,
          discount_rate: req.body.discount_rate,
          price: req.body.price,
          description: req.body.description,
          thumbnail_url: req.body.thumbnail_url,
        },
      }
    );
    res.status(200).json({
      message: "Chỉnh sửa thành công!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Chỉnh sửa thất bại!",
    });
  }
};

// [PATCH] /api/v1/admin/product/delete
module.exports.delete = async (req, res) => {
  try {
    await Product.updateOne(
      {
        id: req.body.id,
      },
      {
        deleted: true,
      }
    );
    res.status(200).json({ message: "Đã xóa thành công!" });
  } catch (error) {
    res.status(400).json({ message: "Không thể xóa sản phẩm" });
  }
};
