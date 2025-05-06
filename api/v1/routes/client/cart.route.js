const express = require("express");

const controller = require("../../controllers/client/cart.controller");

const routes = express.Router();

routes.get("/:cartId", controller.index);

routes.post("/add", controller.add);

routes.post("/delete", controller.delete);

routes.patch("/update", controller.update);

module.exports = routes;