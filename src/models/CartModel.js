const mongoose = require("mongoose");
const Product = require("./ProductModel");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

cartSchema.pre("save", async function (next) {
  try {
    const productsWithPrices = await Promise.all(
      this.products.map(async (item) => {
        const product = await Product.findById(item.productId);

        const price = product
          ? product.promotionPrice ??
            product.prices * (1 - (product.discount || 0) / 100)
          : 0;

        return {
          quantity: item.quantity,
          price: price
        };
      })
    );

    this.totalPrice = productsWithPrices.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
