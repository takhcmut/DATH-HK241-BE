const express = require("express");

const controller = require("../../controllers/client/checkout.controller");

const routes = express.Router();

routes.post("/order", controller.order);

module.exports = routes;