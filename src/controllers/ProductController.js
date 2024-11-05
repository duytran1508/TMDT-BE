const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const response = await ProductService.createProduct(req.body);
    return res.status(201).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "An error occurred while creating the product"
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const response = await ProductService.updateProduct(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "An error occurred while updating the product"
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the userId is required "
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};


const getAllProduct = async (req, res) => {
  try {
    const { sort, filter } = req.query;
    const response = await ProductService.getAllProduct(sort, filter);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "An error occurred while fetching products.",
      error: error.message
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the productId is required "
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};



module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct
};
