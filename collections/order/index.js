const mongoose = require("mongoose");

// Define the schema for the "order" collection
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, 
    price: { type: String }, 
    posterSend: { type: String }, 
    trackingid: { type: String }, 
    OrderSucess: { type: String }, 
    posterImage: { type: String }, 
    selectedSize: { type: String }, 
    userPhoto: [{ type: String, required: true }], 
    frameDetails: { type: String, required: true }, 
    selectedColor: { type: String, required: true }, 
    productId: { type: String, required: true }, 
    includeFrame: { type: Boolean, required: true }, 
    country: { type: String, required: true }, 
    state: { type: String, required: true }, 
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
    addressLine1: { type: String, required: true }, 
    addressLine2: { type: String, required: false },
    city: { type: String, required: true }, 
    postcode: { type: String, required: true }, 
  },
  { timestamps: true }
);

// Create the model
const Order = mongoose.model("Order", orderSchema);

// Export the model
module.exports = Order;
