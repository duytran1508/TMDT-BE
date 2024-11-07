const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");

<<<<<<< HEAD
router.post('/create',productController.createProduct)
router.put('/update/:id',productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete-product/:id', productController.deleteProduct)
router.get('/getAllProduct', productController.getAllProduct)
=======
router.post("/create", productController.createProduct);
router.put("/update/:id", productController.updateProduct);
router.get("/get-details/:id", productController.getDetailsProduct);
router.delete("/delete-product/:id", productController.deleteProduct);
router.get("/getAllProduct", productController.getAllProduct);
>>>>>>> 3d39295 (done CRUD category and CRUD product)

module.exports = router;
