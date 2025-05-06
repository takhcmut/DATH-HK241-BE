const Product = require("../../models/product.model");
const unidecode = require("unidecode");

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
  const limitQuantity = parseInt(req.query.limitQuantity);
  const categoryId = req.query.category;

  let findObj = {};

  if (categoryId) {
    const regex = new RegExp(`/${categoryId}`);
    find.primary_category_path = regex;
  }

  let limit = limitQuantity || 100;

  const data = await Product.find(findObj).limit(limit);

  if (data) {
    res.json({
      code: 200,
      message: "Success",
      data: data,
      length: data.length,
      limit: limit,
    });
  } else {
    res.json({
      code: 400,
      message: "Error",
    });
  }
};

// [GET] /api/v1/products/search
module.exports.search = async (req, res) => {
  const limitQuantity = parseInt(req.query.limitQuantity);
  const keyword = req.query.keyword;
  const page = parseInt(req.query.page);
  const categoryId = req.query.categoryId;

  if (keyword) {
    const regex = new RegExp(keyword, "i");

    const slug = unidecode(keyword).trim().replace(/\s+/g, "-");
    const regexSlug = new RegExp(slug, "i");

    const regexCategory = new RegExp(`/${categoryId}`, "i");

    let limit = limitQuantity || 40;

    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }

    let objFind = {
      $or: [{ name: regex }, { slug: regexSlug }],
    };

    const productsTemp = await Product.find(objFind);

    if (categoryId) {
      objFind.primary_category_path = regexCategory;
    }

    const totalProducts = await Product.countDocuments(objFind);

    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(objFind)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = new Set();
    for (const product of productsTemp) {
      const parentCategory = product.primary_category_path.split("/")[2];
      categories.add(parentCategory);
    }

    if (products) {
      res.status(200).json({
        message: "Success",
        data: products,
        length: products.length,
        limit: limit,
        totalPages: totalPages,
        listParentCategories: [...categories],
      });
    } else {
      res.status(400).json({
        message: "Error",
      });
    }
  }
};

// [GET] /api/v1/products/detail/:productId
module.exports.detail = async (req, res) => {
  const productId = req.params.productId;

  const product = await Product.findOne({
    id: productId,
  });

  if (product) {
    res.json({
      code: 200,
      message: "Success",
      data: product,
    });
  } else {
    res.json({
      code: 400,
      message: "Error not found",
    });
  }
};
