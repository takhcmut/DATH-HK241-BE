const productRoutes = require("./product.route");
const userRoutes = require("./user.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const categoryRoutes = require("./category.route");
const { requireAuth } = require("../../middlewares/client/auth.middleware");
// const { requireCart } = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/products", requireAuth, productRoutes);
  app.use(version + "/user", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  }, userRoutes);
  app.use(version + "/cart", requireAuth, cartRoutes);
  app.use(version + "/checkout", requireAuth, checkoutRoutes);
  app.use(version + "/category", requireAuth, categoryRoutes);

}
