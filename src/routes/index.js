const UserRouter = require("./UserRouter");

const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const CartRouter = require("./CartRouter");
const CategoryRouter = require("./CategoryRouter");
const OtpRouter = require("./otpRoutes");
<<<<<<< HEAD
const PaymentRouter = require("./PaymentRouter")
const AdminRouter = require("./AdminRoutes");
const VoucherRouter = require("./VoucherRouter");
=======
const PaymentRouter = require("./PaymentRouter");
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/otp", OtpRouter);
<<<<<<< HEAD
  app.use("/api/check", AdminRouter);
  app.use("/api/voucher", VoucherRouter);
=======
  app.use("/api/payments", PaymentRouter);

>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
  app.use("/api/category", CategoryRouter);
  app.use("/api/payments", PaymentRouter);
};
module.exports = routes;
