const CategoryService = require("../services/CategoryService");

const createCategory = async (req, res) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await CategoryService.getAllCategories();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const result = await CategoryService.getCategoryById(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ status: "ERR", message: e.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ status: "ERR", message: e.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await CategoryService.deleteCategory(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ status: "ERR", message: e.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
