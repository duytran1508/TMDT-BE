const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const CartRouter = require("./CartRouter");
const CategoryRouter = require("./CategoryRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/cart", CartRouter);
<<<<<<< HEAD
  app.use("/api/category", CategoryRouter)
=======
  app.use("/api/category", CategoryRouter);
>>>>>>> 3d39295 (done CRUD category and CRUD product)
};
module.exports = routes;
