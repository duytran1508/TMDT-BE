const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post(
  "/create",
  productController.uploadProductImages,
  productController.createProduct
);
router.put(
  "/update/:id",
  authMiddleWare,
  productController.uploadProductImages,
  productController.updateProduct
);
router.get("/get-details/:id", productController.getDetailsProduct);
router.delete(
  "/delete-product/:id",
  authMiddleWare,
  productController.deleteProduct
);
router.get("/getAllProduct", productController.getAllProduct);

module.exports = router;
