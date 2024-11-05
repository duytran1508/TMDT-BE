const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
<<<<<<< HEAD
    const response = await ProductService.createProduct(req.body);
    return res.status(201).json(response);
=======
    const {
      name,
      productsTypeName,
      quantityInStock,
      prices,
      size,
      color,
      imageUrl,
      bannerUrl,
      brand,
      gender
    } = req.body;
    if (
      !name ||
      !productsTypeName ||
      !quantityInStock ||
      !prices ||
      !size ||
      !color ||
      !brand ||
      !gender
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required"
      });
    }

    const fs = require("fs");
    const path = require("path");

    const saveBase64Image = (base64Data, filename, isImageFile) => {
      const base64String = base64Data.split(";base64,").pop();

      const folder = isImageFile ? "images" : "slides";
      const filePath = path.join(__dirname, "../uploads", folder, filename);

      const uploadsDir = path.join(__dirname, "../uploads");
      const specificDir = path.join(uploadsDir, folder);

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      if (!fs.existsSync(specificDir)) {
        fs.mkdirSync(specificDir);
      }

      fs.writeFileSync(filePath, base64String, { encoding: "base64" });

      return filePath;
    };

    const imageFilePath = saveBase64Image(
      imageUrl,
      `${Date.now()}_image.jpg`,
      true
    );
    const bannerFilePath = saveBase64Image(
      bannerUrl,
      `${Date.now()}_banner.jpg`,
      false
    );

    const productData = {
      name,
      quantityInStock,
      prices,
      size,
      color,
      imageUrl: imageFilePath,
      bannerUrl: bannerFilePath,
      brand,
      gender
    };

    const response = await ProductService.createProduct(productData);
    return res.status(201).json({
      status: "OK",
      message: "Product created successfully",
      data: response
    });
>>>>>>> 23d369f40e25c5a316949cca646da96a481eae9b
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
