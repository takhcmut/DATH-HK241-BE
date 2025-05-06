const express = require("express");

const controller = require("../../controllers/seller/profile.controller");
const { requireAuth } = require("../../middlewares/seller/auth.middleware");

const routes = express.Router();

routes.get("/" , requireAuth, controller.index);
routes.patch("/edit", requireAuth, controller.edit);
// routes.get("/search", requireAuth, controller.search);

module.exports = routes; 
