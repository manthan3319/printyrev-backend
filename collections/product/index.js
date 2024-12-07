const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    shortTitle: { type: String, required: true },
    numPhotos: { type: Number, required: true },
    framecolor: [{ type: String, required: true }], 
    framesize: [{ type: String, required: true }],
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    price: [
      {
        frame: {
          type: String, 
          required: true,
        },
        designPrice: {
          type: String, 
          required: true,
        },
        withFrame: {
          type: String, 
          required: true,
        },
      },
    ],
    category: [
      {
        name: { type: String, required: true },  
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
      }
    ],
    productdetail: [
      new mongoose.Schema({
        title: { type: String, required: true },
        details: [{ type: String, required: true }],
      }),
    ],
    tipsList: [{ type: String, required: true }], 
    colorImages: { type: Map, of: [String] }, 
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
