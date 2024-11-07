const Product = require("../models/ProductModel");

const createProduct = (productData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newProduct = await Product.create(productData);
      resolve({
        status: "OK",
        message: "Product created successfully",
        data: newProduct
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
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

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true
      });

      resolve({
        status: "Oke",
        massage: "Success",
        data: updatedProduct
      });
    } catch (e) {
      reject(e);
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

<<<<<<< HEAD

const getAllProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Product.find().populate('category');
=======
const getAllProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Product.find().populate("category");
>>>>>>> 3d39295 (done CRUD category and CRUD product)
      resolve({
        status: "OK",
        message: "Retrieved all products successfully",
        data: products
      });
    } catch (e) {
      reject(e);
    }
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

<<<<<<< HEAD

=======
>>>>>>> 3d39295 (done CRUD category and CRUD product)
module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
<<<<<<< HEAD
  getAllProduct,
=======
  getAllProduct
>>>>>>> 3d39295 (done CRUD category and CRUD product)
};
