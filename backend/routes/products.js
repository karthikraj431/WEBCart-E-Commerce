import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

// GET all with search & filters
router.get("/", async (req, res) => {
  const { search, category, minPrice, maxPrice, sort, page=1, limit=20 } = req.query;
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

  let q = Product.find(query);
  if (sort === "price_asc") q = q.sort({ price: 1 });
  if (sort === "price_desc") q = q.sort({ price: -1 });
  if (sort === "rating") q = q.sort({ avgRating: -1 });

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await q.skip(skip).limit(Number(limit));
  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET single product
router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

export default router;
