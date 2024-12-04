const PaymentService = require("../services/PaymentService");
const OrderService = require("../services/OrderService");

const createPayment = async (req, res) => {
  try {
    const { orderId, returnUrl } = req.body;
    console.log(orderId, returnUrl);
    if (!orderId || !returnUrl) {
      return res.status(400).json({
        status: "ERR",
        message: "orderId và returnUrl là bắt buộc"
      });
    }

    const paymentURL = await PaymentService.createVNPayPaymentUrl(
      orderId,
      returnUrl
    );

    return res.status(200).json({
      status: "OK",
      success: true,
      paymentURL: paymentURL
    });
  } catch (e) {
    console.error("Lỗi khi tạo URL thanh toán:", e.message);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi khi tạo URL thanh toán",
      error: e.message
    });
  }
};
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, isSuccess } = req.body;
    console.log({ orderId, isSuccess });
    if (!orderId || typeof isSuccess !== "boolean") {
      return res.status(400).json({
        status: "ERR",
        message: "orderId và isSuccess là bắt buộc"
      });
    }

    const updateResult = await OrderService.updatePaymentStatus(
      orderId,
      isSuccess
    );

    if (updateResult.success) {
      return res.status(200).json({
        status: "OK",
        success: true,
        message: updateResult.message
      });
    }

    return res.status(400).json({
      status: "ERR",
      success: false,
      message: updateResult.message
    });
  } catch (e) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", e.message);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi hệ thống",
      error: e.message
    });
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus
};
