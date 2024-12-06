const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const multer = require("multer");
const { productAdd } = require("../../../../services/printyrev/printyrev");
const fs = require("fs"); // Ensure fs is imported
const path = require("path"); // Import path module

const router = new Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../../images');
    // Check if directory exists, if not, create it
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Swagger Documentation for API
/**
 * @swagger
 * /api/v1/printyrev/productAdd:
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
 *         name: shortTitle
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
  "/productAdd",
  upload.fields([
    { name: 'colorImages[Black][]', maxCount: 10 },
    { name: 'colorImages[White][]', maxCount: 10 },
    { name: 'colorImages[Poster Without Frame][]', maxCount: 10 },
  ]),  
  commonResolver.bind({
      modelService: productAdd,
  })
);

module.exports = router;
