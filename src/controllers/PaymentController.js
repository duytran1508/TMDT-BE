<<<<<<< HEAD
const PaymentService = require('../services/PaymentService');

const createPayment = async (req, res) => {
    try {
      const { orderId, returnUrl } = req.body;
  
      if (!orderId || !returnUrl) {
        return res.status(400).json({
          status: "ERR",
          message: "orderId và returnUrl là bắt buộc"
        });
      }
  
      const paymentURL = await PaymentService.createVNPayPaymentUrl(orderId, returnUrl);
  
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
  

  module.exports = {
    createPayment,
  };
=======
const PaymentService = require("../services/PaymentService");

const PaymentController = {
  async createPayment(req, res) {
    try {
      const { orderId, returnUrl } = req.body;
      console.log(orderId, returnUrl);
      const paymentURL = await PaymentService(orderId, returnUrl);

      res.status(200).json({
        paymentURL: paymentURL
      });
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error.message);
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo URL thanh toán",
        error: error.message
      });
    }
  }
};

module.exports = PaymentController;
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
