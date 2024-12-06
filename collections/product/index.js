
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    shortTitle: { type: String, required: true },
    numPhotos: { type: Number, required: true },
    framecolor: [{ type: String, required: true }], // Array of colors
    framesize: [{ type: String, required: true }], // Array of sizes
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    price: [
      {
        frame: {
          type: String, // To store frame sizes like '30x40 cm'
          required: true,
        },
        designPrice: {
          type: String, // To store 'Design Price'
          required: true,
        },
        withFrame: {
          type: String, // To store 'withFrame' price
          required: true,
        },
      },
    ],
    category: [{ type: String, required: true }], // Array of categories
    productdetail: [
      new mongoose.Schema({
        title: { type: String, required: true },
        details: [{ type: String, required: true }], // Array of details
      }),
    ],
    tipsList: [{ type: String, required: true }], // Array of tips
    colorImages: { type: Map, of: [String] }, // Map to store color-based image filenames
    frameFields: [
      new mongoose.Schema({
        frameTitle: { type: String, required: true },
        framePlaceholder: { type: String, required: true },
      }),
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;