// backend/controllers/productController.js
import Product from "../models/Product.js";

// ✅ Get all products (for admin & users)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin - Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, promotions } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
      promotions,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("❌ Add product error:", err);
    res.status(500).json({ message: "Server error while adding product" });
  }
};

// ✅ Admin - Update existing product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("❌ Update product error:", err);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// ✅ Admin - Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete product error:", err);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
