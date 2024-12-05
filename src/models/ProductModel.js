const timespan = require("jsonwebtoken/lib/timespan");
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema]
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    quantityInStock: { type: Number },
    prices: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    promotionPrice: { type: Number, default: 0 },
    size: { type: String },
    color: { type: String },
    imageUrl: { type: String },
    bannerUrl: { type: String },
    brand: { type: String },
    gender: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    ratingPercentages: {
      oneStar: { type: Number, default: 0 },
      twoStar: { type: Number, default: 0 },
      threeStar: { type: Number, default: 0 },
      fourStar: { type: Number, default: 0 },
      fiveStar: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.promotionPrice = this.prices - (this.prices * this.discount) / 100;
  next();
});

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
