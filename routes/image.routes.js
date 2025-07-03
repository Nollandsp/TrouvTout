const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const imageController = require("../controllers/image.controller");

// Configuration multer (upload temporaire dans dossier "uploads")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ex: 159789123.jpg
  },
});
const multerMiddleware = multer({ storage: storage }).single("image");

// Routes
router.get("/", imageController.getAllImages);
router.get("/annonce/:annonce_id", imageController.getImagesByAnnonce);
router.post("/upload", multerMiddleware, imageController.uploadImage);

module.exports = router;
