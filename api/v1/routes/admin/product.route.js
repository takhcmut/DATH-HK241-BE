const express = require("express");

const controller = require("../../controllers/admin/product.controller");

const routes = express.Router();

routes.get("/", controller.index);
routes.post("/add", controller.add);
routes.patch("/edit", controller.edit);
routes.patch("/delete", controller.delete);

module.exports = routes;