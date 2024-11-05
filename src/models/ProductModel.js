const timespan = require("jsonwebtoken/lib/timespan");

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String},
    quantityInStock: { type: Number },
    prices: { type: Number},
    size: { type: Number },
    color: { type: String },
    imageUrl: { type: String},
    bannerUrl: { type: String },
    brand: { type: String},
    gender: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }

  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
