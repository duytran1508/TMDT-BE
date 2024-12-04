const VoucherService = require("../services/VoucherService"); // Import service
const Voucher = require("../models/VoucherModel");

const createVoucher = async (req, res) => {
  try {
    const { code, discount } = req.body;

    // Kiểm tra tất cả các trường có tồn tại không
    if (!code || !discount) {
      return res.status(400).json({
        status: "ERR",
        message: "Mã voucher và phần trăm giảm giá là bắt buộc"
      });
    }

    // Kiểm tra voucher đã tồn tại chưa
    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
      return res.status(400).json({
        status: "ERR",
        message: "Voucher đã tồn tại với mã này"
      });
    }

    // Tạo voucher mới thông qua service
    const response = await VoucherService.createVoucher(req.body);

    // Kiểm tra phản hồi từ service
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }

    // Trả về voucher mới đã tạo
    return res.status(201).json(response);
  } catch (e) {
    // Xử lý lỗi nếu có
    return res.status(500).json({
      status: "ERR",
      message: "Đã có lỗi xảy ra khi tạo voucher: " + e.message
    });
  }
};

const checkVoucher = async (req, res) => {
  const { code } = req.body;

  try {
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(404).json({ message: "Mã giảm giá không hợp lệ" });
    }

    return res.json({ discount: voucher.discount });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const listVouchers = async (req, res) => {
  try {

    const vouchers = await Voucher.find();

    if (vouchers.length === 0) {
      return res.status(404).json({ message: "No vouchers found" });
    }

    // Trả về danh sách voucher
    return res.status(200).json({ data: vouchers });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createVoucher,
  checkVoucher,
  listVouchers
};
