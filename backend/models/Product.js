import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, default: 0 },
  image: String, // URL or path
  images: [String], // additional images for HD view
  promotions: { type: String }, // promo text or promo code
  createdAt: { type: Date, default: Date.now },
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
