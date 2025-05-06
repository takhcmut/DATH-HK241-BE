const productRoutes = require("./product.route");
const orderRoutes = require("./order.route");
const profileRoutes = require("./profile.route");

const systemConfig = require("../../../../config/system");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + systemConfig.prefixSeller + "/product", productRoutes);
  app.use(version + systemConfig.prefixSeller + "/order", orderRoutes);
  app.use(version + systemConfig.prefixSeller + "/profile", profileRoutes);  
}
