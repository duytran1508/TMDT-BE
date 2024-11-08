const CategoryService = require("../services/CategoryService");

const admin = require("firebase-admin");
const multer = require("multer");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<your-database-name>.firebaseio.com"
  });
}

const bucket = admin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadProductImages = upload.fields([{ name: "icon", maxCount: 2 }]);

const createCategory = async (req, res) => {
  console.log({ ...req.body });
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files["icon"] && req.files["icon"].length > 0) {
        const imageFile = req.files["icon"][0];
        const folderName = "TMDT/category";
        const imageIconName = `${folderName}/${Date.now()}-${
          imageFile.originalname
        }`;
        const fileUpload = bucket.file(imageIconName);
        const token = uuidv4();

        await fileUpload.save(imageFile.buffer, {
          contentType: imageFile.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: token
          }
        });

        data.iconUrl = `https://firebasestorage.googleapis.com/v0/b/${
          process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
        }/o/${encodeURIComponent(imageIconName)}?alt=media&token=${token}`;
      }
    }

    const result = await CategoryService.createCategory(data);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi thêm sản phẩm: " + error.message);
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
    const result = await CategoryService.updateCategory(
      req.params.id,
      req.body
    );
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
  uploadProductImages,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
