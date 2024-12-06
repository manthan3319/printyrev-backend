const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { addCategory } = require("../../../../services/printyrev/printyrev"); // Your service function to add category
const commonResolver = require("../../../../utilities/commonResolver");

const router = new Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../../../images");
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name with timestamp
  },
});

// Initialize Multer with custom storage settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

// Swagger Documentation
/**
 * @swagger
 * /api/v1/printyrev/addCategory:
 *   post:
 *     tags: ["printyrev"]
 *     summary: Add a single category with an image
 *     description: API to add a single category with a name and an optional image
 *     parameters:
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Category name
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Category image
 *         required: true
 *     responses:
 *       200:
 *         description: Category added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post(
  "/addCategory",
  upload.single('image'), // Only one image upload
  commonResolver.bind({
    modelService: addCategory, // Your model service for adding category
  })
);

module.exports = router;
