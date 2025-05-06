const productRoutes = require("./product.route");
const categoryRoutes = require("./category.route");
const userRoutes = require("./user.route");
const loginLogRoutes = require("./login-log.route");

const systemConfig = require("../../../../config/system");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + systemConfig.prefixAdmin + "/product", productRoutes);
  app.use(version + systemConfig.prefixAdmin + "/category", categoryRoutes);
  app.use(version + systemConfig.prefixAdmin + "/user", userRoutes);
  app.use(version + systemConfig.prefixAdmin + "/login-log", loginLogRoutes);
}