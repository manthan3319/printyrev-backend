
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    category: { type: String },
    product: { type: String },
    image: { type: String, required: true },
  }
);

const Product = mongoose.model("category", productSchema);

module.exports = Product;