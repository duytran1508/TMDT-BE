const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const createProduct = async (newProduct) => {
  const {
    name,
    quantityInStock,
    prices,
    discount,
    size,
    color,
    imageUrl,
    bannerUrl,
    brand,
    gender,
    category
  } = newProduct;
  const promotionPrice = prices - (prices * (discount || 0)) / 100;
  try {
    const createdProduct = await Product.create({
      name: name || "",
      quantityInStock: quantityInStock || 0,
      prices: prices || 0,
      discount: discount || 0,
      promotionPrice,
      size: size || 0,
      color: color || "",
      imageUrl: imageUrl || "",
      bannerUrl: bannerUrl || "",
      brand: brand || "",
      gender: gender || "",
      category: category || ""
    });

    return {
      status: "OK",
      message: "Product created successfully",
      data: createdProduct
    };
  } catch (error) {
    throw {
      status: "ERR",
      message: "Failed to create product",
      error: error.message
    };
  }
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id);
      if (!checkProduct) {
        return resolve({
          status: "ERR",
          message: "Product not found"
        });
      }

      if (data.prices !== undefined || data.discount !== undefined) {
        const prices = data.prices || checkProduct.prices;
        const discount =
          data.discount !== undefined ? data.discount : checkProduct.discount;
        data.promotionPrice = prices - (prices * discount) / 100;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true
      });

      resolve({
        status: "OK",
        message: "Product updated successfully",
        data: updatedProduct
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error updating product",
        error: e.message
      });
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id
      });
      if (checkProduct === null) {
        resolve({
          status: "Oke",
          message: "Product is not defined"
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "Oke",
        massage: "delete success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "Oke",
        massage: "delete many success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allProducts = await Product.find();
      const formattedProducts = allProducts.map((product) => {
        return {
          ...product.toObject(),
          imageUrl: product.imageUrl || null,
          bannerUrl: product.bannerUrl || null
        };
      });
      resolve({
        status: "OK",
        message: "success",
        data: formattedProducts,
        total: formattedProducts.length
      });
    } catch (e) {
      reject(e);
    }
  });
};

const convertToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const base64Image = `data:image/jpeg;base64,${data.toString("base64")}`;
        resolve(base64Image);
      }
    });
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id
      });
      if (product === null) {
        resolve({
          status: "Oke",
          message: "Product is not defined"
        });
      }

      resolve({
        status: "Oke",
        massage: "success",
        data: product
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "Oke",
        massage: "success",
        data: allType
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllType
};
