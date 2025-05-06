const Category = require("../../models/category.model");

// [GET] /api/v1/category
module.exports.index = async (req, res) => {
  const categories = await Category.find({})
    .select("text icon_url id")
    .limit(10);

  res.status(200).json({
    message: "Success",
    data: categories,
  });
};

// [GET] /api/v1/category/:categoryId
module.exports.getCategoryByID = async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const category = await Category.findOne({
      id: categoryId,
    });
    const result = JSON.parse(JSON.stringify(category));

    const getResult = (children) => {
      return children.map((item) => {
        if (!item.children || !item.children.length) {
          return {
            key: `${item.id}`,
            label: item.name,
          };
        } else {
          return {
            key: `${item.id}`,
            label: item.name,
            children: getResult(item.children),
          };
        }
      });
    };

    let data = null;
    if (result) {
      data = {
        key: `${result.id}`,
        label: result.text,
        children: getResult(result.children),
      };
    }

    res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
