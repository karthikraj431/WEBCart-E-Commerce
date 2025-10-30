import express from "express";
import Category from "../models/Category.js";
import { adminMiddleware } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ➕ Create category
router.post("/", protect, adminMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📦 Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Update category
router.put("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ❌ Delete category
router.delete("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
