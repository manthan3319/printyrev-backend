const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const multer = require("multer");
const { sendPosterWithEmail } = require("../../../../services/printyrev/printyrev");
const fs = require("fs"); // Ensure fs is imported
const path = require("path"); // Import path module

const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../../../images");
    // Check if the directory exists; if not, create it
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Swagger Documentation for API
/**
 * @swagger
 * /api/v1/printyrev/sendPosterWithEmail:
 *   post:
 *     tags: ["printyrev"]
 *     summary: Add product details with image uploads
 *     description: API to add product details with color image uploads
 *     parameters:
 *      - in: body
 *        name: lead
 *        description: Save Contractor information.
 *        schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *     responses:
 *       "200":
 *         description: Product added successfully
 *       "400":
 *         description: Bad request, validation failed
 *       "500":
 *         description: Server error
 */

const dataSchema = Joi.object({
  id: Joi.string().required().label("id"),
});

router.post(
  "/sendPosterWithEmail",
  upload.single("image"),
  commonResolver.bind({
    modelService: sendPosterWithEmail,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema,
  })
);

module.exports = router;
