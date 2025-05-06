const express = require("express");

const controller = require("../../controllers/admin/category.controller");

const routes = express.Router();

routes.get("/", controller.index);
routes.get("/:categoryId", controller.getParentCategoryById);
routes.post("/add", controller.add);
routes.patch("/edit", controller.edit);
routes.delete("/delete", controller.delete);

module.exports = routes;