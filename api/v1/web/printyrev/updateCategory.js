const { Router } = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { updateCategory } = require("../../../../services/printyrev/printyrev");
const router = new Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.resolve(__dirname, '../../../../images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    cb(null, originalName);
  }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/v1/printyrev/updateCategory:
 *   post:
 *     tags: ["printyrev"]
 *     summary: Save Category information.
 *     description: API used for saving category information.
 *     parameters:
 *       - in: formData
 *         name: categoryId
 *         description: The ID of the category to update.
 *         type: string
 *         required: true
 *       - in: formData
 *         name: categoryName
 *         description: Category name.
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         description: Image file for the category.
 *         type: file
 *     responses:
 *       "200":
 *         description: Category updated successfully.
 *       "400":
 *         description: Error updating category.
 *       "404":
 *         description: Category not found.
 */

router.post(
  "/updateCategory",
  upload.single('image'), // For single file upload
  async (req, res, next) => {
    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      // Call the service function to update the category
      const result = await updateCategory(req);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
