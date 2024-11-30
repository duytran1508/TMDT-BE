const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const createOrder = async (
  userId,
  cartId,
  shippingAddress,
  productIds,
  name,
  phone,
  email,
  voucherCode
) => {
  try {
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) {
      throw { status: 404, message: "Không tìm thấy giỏ hàng" };
    }
    console.log("Cart:", cart); 
    const selectedProducts = cart.products.filter((item) =>
      productIds.includes(String(item.productId._id))
    );

    const validProducts = await Product.find({ _id: { $in: productIds } });
    if (!validProducts || validProducts.length === 0) {
      throw { status: 400, message: "Không có sản phẩm hợp lệ để thanh toán" };
    }

    const products = await Promise.all(
      selectedProducts.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw {
            status: 404,
            message: `Không tìm thấy sản phẩm với ID ${item.productId}`
          };
        }
        console.log(`Product: ${product._id}, Price: ${product.promotionPrice}`);
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.promotionPrice
        };
      })
    );
    
    console.log("Products to Order:", products);
    const totalPrice = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    const VAT = totalPrice * 0.1;
    const shippingFee = totalPrice >= 500000 ? 0 : 50000;

    let discount = 0;
    if (voucherCode) {
      const voucher = await Voucher.findOne({ code: voucherCode });
      if (!voucher) {
        throw { status: 404, message: "Mã giảm giá không hợp lệ" };
      }

      if (
        voucher.discount &&
        voucher.discount >= 1 &&
        voucher.discount <= 100
      ) {
        discount = (totalPrice + shippingFee + VAT) * (voucher.discount / 100);
      } else {
        throw { status: 400, message: "Voucher giảm giá không hợp lệ" };
      }
    }

    const discountedPrice = totalPrice + shippingFee + VAT - discount;

    const orderTotalRaw = Math.max(discountedPrice, 0); // Đảm bảo giá trị không âm
    const orderTotal = parseFloat(orderTotalRaw.toFixed(2));
    console.log("Order Total:", orderTotal);
    const newOrder = new Order({
      name,
      phone,
      email,
      userId,
      cartId,
      products,
      shippingAddress,
      totalPrice,
      discount,
      VAT,
      shippingFee,
      orderTotal,
      status: "Pending"
    });

    await newOrder.save();

    cart.products = cart.products.filter(
      (item) => !productIds.includes(String(item.productId._id))
    );
    await cart.save();

    return {
      status: "OK",
      data: {
        ...newOrder.toObject(),
        discount,
        totalPrice
      }
    };
  } catch (error) {
    console.error("Lỗi trong createOrder service:", error);
    throw error;
  }
};

const getAllOrdersByUser = async (userId) => {
  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUser service:", error);
    throw error;
  }
};

const getOrderById = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId).populate(
        "products.productId"
      );
      if (!order) {
        return reject({
          status: "ERR",
          message: "Order not found"
        });
      }
      resolve(order);
    } catch (error) {
      reject({
        status: "ERR",
        message: "Error while retrieving order: " + error.message
      });
    }
  });
};
const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      throw { status: 400, message: "Order already delivered or cancelled" };
    }

    order.status = "Cancelled";

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in cancelOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const shipOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.status !== "Pending") {
      throw { status: 400, message: "Order is not in Pending status" };
    }

    order.status = "Shipped";

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in shipOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const deliverOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.status !== "Shipped") {
      throw { status: 400, message: "Order is not in Shipped status" };
    }

    order.status = "Delivered";

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in deliverOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderById,
  cancelOrder,
  shipOrder,
  deliverOrder
};
