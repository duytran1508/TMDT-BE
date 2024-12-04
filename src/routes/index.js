const UserRouter = require("./UserRouter");

const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const CartRouter = require("./CartRouter");
const CategoryRouter = require("./CategoryRouter");
const OtpRouter = require("./otpRoutes");
const PaymentRouter = require("./PaymentRouter");
const AdminRouter = require("./AdminRoutes");
const VoucherRouter = require("./VoucherRouter");
const ReviewRouter = require("./ReviewRouter");
const AddressRouter = require("./AddressRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/otp", OtpRouter);
  app.use("/api/check", AdminRouter);
  app.use("/api/voucher", VoucherRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/payments", PaymentRouter);
  app.use("/api/address", AddressRouter);
};
module.exports = routes;
