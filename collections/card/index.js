const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    price: { type: String, required: true },
    email: { type: String, required: true },
    productId: { type: String, required: true },
    selectedColor: { type: String, required: true },
    selectedSize: { type: String, required: true }, 
    photos: [{ type: String, required: true }], 
    frameDetails: { type: String, required: true }, 
    userid: { type: String, required: true }, 
    includeFrame: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("cart", productSchema);

module.exports = Product;
