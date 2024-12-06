const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const commonResolver = require("../../../../utilities/commonResolver");
const { addToCardOverify } = require("../../../../services/printyrev/printyrev");

const router = new Router();

// Multer Storage Configuration for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../../../images');
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        return cb(err);
      }
      cb(null, uploadPath); // Save to the created directory
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Helper function to handle base64 to file conversion
const base64ToImage = (base64String, filePath) => {
  const base64Data = base64String.split(',')[1]; // Removing base64 metadata
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer); // Save as image file
};

// Swagger Documentation for API
/**
 * @swagger
 * /api/v1/printyrev/addToCardOverify:
 *   post:
 *     tags: ["printyrev"]
 *     summary: Add product details with image uploads
 *     description: API to add product details with color image uploads
 *     parameters:
 *       - in: formData
 *         name: productTitle
 *         type: string
 *         required: true
 *       - in: formData
 *         name: includeFrame
 *         type: string
 *         required: true
 *       - in: formData
 *         name: shortTitle
 *         type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *       - in: formData
 *         name: numPhotos
 *         type: integer
 *         required: true
 *       - in: formData
 *         name: framecolor
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: framesize
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: price
 *         type: object
 *         required: true
 *       - in: formData
 *         name: category
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: colorImages
 *         type: array
 *         items:
 *           type: file
 *         required: true
 *     responses:
 *       "200":
 *         description: Product added successfully
 *       "400":
 *         description: Bad request, validation failed
 *       "500":
 *         description: Server error
 */
router.post(
  "/addToCardOverify",
  upload.fields([
    { name: 'colorImages[Black]', maxCount: 10 },
    { name: 'colorImages[White]', maxCount: 10 },
    { name: 'colorImages[Poster Without Frame]', maxCount: 10 }
  ]),
  commonResolver.bind({
    modelService: addToCardOverify,
})
);

module.exports = router;
