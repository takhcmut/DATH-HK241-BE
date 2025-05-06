const express = require("express");

const controller = require("../../controllers/seller/product.controller");
const { requireAuth } = require("../../middlewares/seller/auth.middleware");

const routes = express.Router();

routes.get("/" , requireAuth, controller.index);
routes.get("/search", requireAuth, controller.search);
routes.patch("/edit", requireAuth, controller.edit);
routes.post("/add", requireAuth, controller.add);
routes.patch("/delete", requireAuth, controller.delete);

module.exports = routes;
