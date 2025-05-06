const express = require("express");

const controller = require("../../controllers/seller/order.controller");
const { requireAuth } = require("../../middlewares/seller/auth.middleware");

const routes = express.Router();

routes.get("/" , requireAuth, controller.index);
routes.patch("/changeStatus", requireAuth, controller.changeStatus);
routes.patch("/cancel", requireAuth, controller.cancel);

// routes.get("/search", controller.search);

module.exports = routes; 
