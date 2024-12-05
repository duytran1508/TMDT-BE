const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const Voucher = require("../models/VoucherModel");

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

        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.promotionPrice
        };
      })
    );

    const totalPrice = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

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
        discount = (totalPrice + shippingFee) * (voucher.discount / 100);
      } else {
        throw { status: 400, message: "Voucher giảm giá không hợp lệ" };
      }
    }

    const discountedPrice = totalPrice + shippingFee - discount;

    const orderTotalRaw = Math.max(discountedPrice, 0);
    const orderTotal = parseFloat(orderTotalRaw.toFixed(2));

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
const getOrdersByStatusAndDate = async (
  status = "Delivered",
  timeRange = "daily"
) => {
  try {
    const currentDate = new Date();

    let startDate;
    if (timeRange === "daily") {
      startDate = new Date(currentDate.setHours(0, 0, 0, 0));
    } else if (timeRange === "weekly") {
      startDate = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "monthly") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      startDate.setHours(0, 0, 0, 0);
    }

    const orders = await Order.find({
      status: status,
      createdAt: { $gte: startDate }
    }).populate("products.productId");

    return orders;
  } catch (error) {
    console.error("Lỗi trong getOrdersByStatusAndDate service:", error);
    throw error;
  }
};
const getOrdersByTimePeriod = async (status, timePeriod, date) => {
  try {
    let startUtcDate, endUtcDate;
    const selectedDate = new Date(date);

    if (timePeriod === "day") {
      startUtcDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      );
      endUtcDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        23,
        59,
        59
      );
    } else if (timePeriod === "week") {
      const dayOfWeek = selectedDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

      startUtcDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + diffToMonday,
        0,
        0,
        0
      );

      endUtcDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + diffToSunday,
        23,
        59,
        59
      );
    } else if (timePeriod === "month") {
      startUtcDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      endUtcDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );
    } else {
      throw new Error("Invalid time period. Use 'day', 'week', or 'month'.");
    }

    const orders = await Order.find({
      status,
      createdAt: { $gte: startUtcDate, $lte: endUtcDate }
    }).populate("products.productId");

    const ordersWithVietnamTime = orders.map((order) => ({
      ...order.toObject(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    const totalProducts = orders.reduce((sum, order) => {
      return (
        sum +
        order.products.reduce((productSum, product) => {
          return productSum + product.quantity;
        }, 0)
      );
    }, 0);
    const totalOrders = orders.length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.orderTotal,
      0
    );

    return {
      orders: ordersWithVietnamTime,
      totalProducts,
      totalAmount,
      totalOrders,
      startDate: startUtcDate,
      endDate: endUtcDate
    };
  } catch (error) {
    console.error("Error in getOrdersByTimePeriod:", error);
    throw error;
  }
};
const getTotalRevenue = async () => {
  try {
    const deliveredOrders = await Order.find({ status: "Delivered" });

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.orderTotal,
      0
    );

    return {
      status: "OK",
      totalRevenue
    };
  } catch (error) {
    console.error("Error in getTotalRevenue:", error);
    throw {
      status: "ERR",
      message: "Không thể tính tổng doanh thu",
      error: error.message
    };
  }
};
const updatePaymentStatus = async (orderId, isSuccess) => {
  console.log(isSuccess);

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return { success: false, message: "Không tìm thấy đơn hàng" };
    }

    if (isSuccess) {
      order.isPaid = true;
    }
    await order.save();

    return {
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      returnUrl: "http://localhost:3000/ket-qua-thanh-toan"
    };
  } catch (e) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", e.message);
    return {
      success: false,
      message: "Cập nhật trạng thái thanh toán thất bại",
      error: e.message
    };
  }
};
module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderById,
  cancelOrder,
  shipOrder,
  deliverOrder,
  getOrdersByTimePeriod,
  getTotalRevenue,
  updatePaymentStatus
};
