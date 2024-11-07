const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const categoryController = require('../controllers/CategoryController');

// Đường dẫn cho các API của Category
router.post('/create', categoryController.createCategory); // Tạo mới category
router.put('/update/:id', categoryController.updateCategory); // Cập nhật category theo ID
router.get('/get-details/:id', categoryController.getCategoryById); // Lấy thông tin category theo ID
router.delete('/delete/:id', categoryController.deleteCategory); // Xóa category theo ID
router.get('/getAll', categoryController.getAllCategories); // Lấy tất cả category
=======
const categoryController = require("../controllers/CategoryController");

// Đường dẫn cho các API của Category
router.post("/create", categoryController.createCategory); // Tạo mới category
router.put("/update/:id", categoryController.updateCategory); // Cập nhật category theo ID
router.get("/get-details/:id", categoryController.getCategoryById); // Lấy thông tin category theo ID
router.delete("/delete/:id", categoryController.deleteCategory); // Xóa category theo ID
router.get("/getAll", categoryController.getAllCategories); // Lấy tất cả category
>>>>>>> 3d39295 (done CRUD category and CRUD product)

module.exports = router;
