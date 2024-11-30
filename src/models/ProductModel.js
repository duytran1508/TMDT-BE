const timespan = require("jsonwebtoken/lib/timespan");

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    quantityInStock: { type: Number },
    prices: { type: Number, default: 0 }, // Giá gốc
    discount: { type: Number, default: 0 }, // % Giảm giá (0-100)
    promotionPrice: { type: Number, default: 0 }, // Giá sau khi giảm
    size: { type: String },
    color: { type: String },
    imageUrl: { type: String },
    bannerUrl: { type: String },
    brand: { type: String },
    gender: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }
  },
  { timestamps: true }
);
// **Middleware: Tính giá sau khi giảm trước khi lưu**
productSchema.pre("save", function (next) {
  this.promotionPrice = this.prices - (this.prices * this.discount) / 100;
  next();
});

// **Middleware: Tính giá sau khi giảm khi cập nhật**
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.prices || update.discount) {
    const prices =
      update.prices !== undefined ? update.prices : this.getQuery().prices;
    const discount =
      update.discount !== undefined
        ? update.discount
        : this.getQuery().discount;
    update.promotionPrice = prices - (prices * discount) / 100;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
