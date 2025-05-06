const Category = require("../../models/category.model");
const User = require("../../models/user.model");

// [GET] /api/v1/admin/category
module.exports.index = async (req, res) => {
  const categories = await Category.find({});
  Promise.all(
    categories.map((category) => User.findOne({ _id: category.seller_id }))
  ).then((sellers) => {
    res.status(200).json({
      message: "Success",
      data: categories,
      sellers: sellers,
    });
  });
};

// [GET] /api/v1/admin/category/:categoryId
module.exports.getParentCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categories = await Category.find({});

    const searchCategory = (category, parentCategories) => {
      let res = null;
      if (!category.children) {
        return null;
      }
      for (const cat of category.children) {
        res = null;
        if (cat.id === parseInt(categoryId)) {
          res = parentCategories;
          break;
        }
        res = searchCategory(cat, category.children);
        if (res) break;
      }
      return res;
    };

    let data = [];
    for (const category of categories) {
      data = searchCategory(category, categories);
      if (data) {
        break;
      }
    }

    res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
    });
  }
};

// [POST] /api/v1/admin/category/add
module.exports.add = async (req, res) => {
  const { ...categoryInfo } = req.body;

  const newCategory = new Category(categoryInfo);
  await newCategory.save();

  res.status(200).json({
    message: "Success",
  });
};

// [PATCH] /api/v1/admin/category/edit
module.exports.edit = async (req, res) => {
  try {
    if (req.body.isParentCategory) {
      await Category.updateOne(
        {
          id: req.body.id,
        },
        req.body
      );
    } else {
      res.status(400).json({
        message: "Chưa hỗ trợ tính năng này!",
      });
      return;
    }
    res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Đã có lỗi khi cập nhật!",
    });
  }
};

// [DELETE] /api/v1/admin/category/delete
module.exports.delete = (req, res) => {
  res.send("OK");
};
