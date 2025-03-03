const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("./cloudinary_setup.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("picture");

const cloudinaryFile = async (req, res, next) => {
  console.log("am i here?");
  try {
    if (!req.file) {
      return next();
    }

    console.log("Uploading file:", req.file.path);

    // Upload to Cloudinary from local path
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "images",
    });

    console.log("Cloudinary Upload URL:", result.secure_url);
    req.body.picturePath = result.secure_url;

    // Delete file from local storage
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed", error });
  }
};

module.exports = { upload, cloudinaryFile };

