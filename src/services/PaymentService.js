const crypto = require("crypto");
<<<<<<< HEAD
const Order = require("../models/OrderModel"); // Đảm bảo có model Order
const config = require("../config/default.json"); // Đọc các thông số từ config hoặc .env
=======
const Order = require("../models/OrderModel");
const config = require("../config/default.json");
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb

const createVNPayPaymentUrl = async (orderId, returnUrl) => {
  const { VNP_TMN_CODE, VNP_HASH_SECRET, VNP_URL, VNP_RETURN_URL } =
    process.env;
<<<<<<< HEAD
=======

>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Đơn hàng với ID ${orderId} không tồn tại`);
  }
<<<<<<< HEAD
  const amount = order.orderTotal;
  console.log("amout", amount);
  if (!VNP_HASH_SECRET) {
    throw new Error("VNP_HASH_SECRET không được định nghĩa");
  }
=======

  const amount = order.orderTotal;
  console.log("amout", amount);

  if (!VNP_HASH_SECRET) {
    throw new Error("VNP_HASH_SECRET không được định nghĩa");
  }

>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
  const date = new Date();
  const vnp_CreateDate = `${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(
    date.getHours()
  ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(
    date.getSeconds()
  ).padStart(2, "0")}`;

<<<<<<< HEAD
  // In ra thông tin order và các giá trị cần kiểm tra
  console.log("Thông tin đơn hàng:", order);
  console.log("Giá trị đơn hàng (VND):", amount);

  // Tạo các tham số yêu cầu
=======
  console.log("Thông tin đơn hàng:", order);
  console.log("Giá trị đơn hàng (VND):", amount);

>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
  let params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNP_TMN_CODE,
<<<<<<< HEAD
    vnp_Amount: amount * 100, // Đơn vị: VND
    vnp_CreateDate: vnp_CreateDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: "127.0.0.1", // Thay bằng IP người dùng nếu cần
=======
    vnp_Amount: amount * 100,
    vnp_CreateDate: vnp_CreateDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: "127.0.0.1",
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
    vnp_Locale: "vn",
    vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: returnUrl || VNP_RETURN_URL,
    vnp_TxnRef: orderId
  };

<<<<<<< HEAD
  // In ra các tham số trước khi sắp xếp
  console.log("Các tham số trước khi sắp xếp:", params);

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = sortObject(params);
  const query = new URLSearchParams(sortedParams).toString();

  // Tạo SecureHash
=======
  console.log("Các tham số trước khi sắp xếp:", params);

  const sortedParams = sortObject(params);
  const query = new URLSearchParams(sortedParams).toString();

>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
  const secureHash = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(query)
    .digest("hex");

<<<<<<< HEAD
  // Trả về URL thanh toán VNPay
=======
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
  const paymentUrl = `${VNP_URL}?${query}&vnp_SecureHash=${secureHash}`;

  return paymentUrl;
};

<<<<<<< HEAD
// Hàm sắp xếp các tham số theo thứ tự alphabet
=======
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
function sortObject(obj) {
  const sortedKeys = Object.keys(obj).sort();
  return sortedKeys.reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {});
}

<<<<<<< HEAD
module.exports = {
  createVNPayPaymentUrl
};
=======
module.exports = createVNPayPaymentUrl;
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
