import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// add review
router.post("/:productId", protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // optionally validate that user bought product (requires orders check)

  const review = await Review.create({
    user: req.user._id,
    product: product._id,
    rating,
    comment
  });

  // update product rating
  const reviews = await Review.find({ product: product._id });
  product.numReviews = reviews.length;
  product.avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  await product.save();

  res.status(201).json(review);
});

// get reviews
router.get("/:productId", async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate("user", "name avatar");
  res.json(reviews);
});

export default router;
