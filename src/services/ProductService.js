const Product = require("../models/ProductModel");
const fs = require("fs");

const createProduct = async (newProduct) => {
  const {
    name,
    quantityInStock,
    prices,
    imageUrl,
    bannerUrl,
    productsTypeName,
    inches,
    screenResolution,
    company,
    cpu,
    ram,
    memory,
    gpu,
    weight,
    opsys
  } = newProduct;

  try {
    const createdProduct = await Product.create({
      name: name || "",
      quantityInStock: quantityInStock || 0,
      prices: prices || 0,
      imageUrl: imageUrl || "",
      bannerUrl: bannerUrl || "",
      productsTypeName: productsTypeName || "",
      inches: inches || "",
      screenResolution: screenResolution || "",
      company: company || "",
      cpu: cpu || "",
      ram: ram || "",
      memory: memory || "",
      gpu: gpu || "",
      weight: weight || "",
      opsys: opsys || ""
    });

    return {
      status: "OK",
      message: "Product created successfully",
      data: createdProduct
    };
  } catch (error) {
    return {
      status: "ERR",
      message: "Failed to create product",
      error: error.message
    };
  }
};

const updateProduct = async (id, data) => {
  try {
    const checkProduct = await Product.findById(id);
    if (!checkProduct) {
      return {
        status: "ERR",
        message: "Product not found"
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true
    });

    return {
      status: "OK",
      message: "Product updated successfully",
      data: updatedProduct
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error updating product",
      error: e.message
    };
  }
};

const deleteProduct = async (id) => {
  try {
    const checkProduct = await Product.findById(id);
    if (!checkProduct) {
      return {
        status: "ERR",
        message: "Product not found"
      };
    }

    await Product.findByIdAndDelete(id);
    return {
      status: "OK",
      message: "Product deleted successfully"
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error deleting product",
      error: e.message
    };
  }
};

const deleteManyProduct = async (ids) => {
  try {
    await Product.deleteMany({ _id: { $in: ids } });
    return {
      status: "OK",
      message: "Products deleted successfully"
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error deleting products",
      error: e.message
    };
  }
};

const getAllProduct = async (sort, filter) => {
  try {
    let query = {};
    if (filter) {
      const [label, value] = filter;
      query[label] = { $regex: value, $options: "i" };
    }

    const allProducts = await Product.find(query)
      .sort(sort || {})
      .populate("category");

    const formattedProducts = allProducts.map((product) => ({
      ...product.toObject(),
      imageUrl: product.imageUrl || null,
      bannerUrl: product.bannerUrl || null
    }));

    return {
      status: "OK",
      message: "Products retrieved successfully",
      data: formattedProducts,
      total: formattedProducts.length
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving products",
      error: e.message
    };
  }
};

const getDetailsProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return {
        status: "ERR",
        message: "Product not found"
      };
    }

    return {
      status: "OK",
      message: "Product details retrieved successfully",
      data: product
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving product details",
      error: e.message
    };
  }
};

const getAllType = async () => {
  try {
    const allTypes = await Product.distinct("type");
    return {
      status: "OK",
      message: "Product types retrieved successfully",
      data: allTypes
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving product types",
      error: e.message
    };
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getDetailsProduct,
  getAllType
};
