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
