import express from "express";
import multer from "multer";
import { adminMiddleware } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";
import { getAllUsers } from "../controllers/admin.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/productController.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

// Multer setup for avatar upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `avatar-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Product routes
router.get("/products", adminMiddleware, getProducts);
router.post("/products", adminMiddleware, upload.single("image"), addProduct);
router.put("/products/:id", adminMiddleware, upload.single("image"), updateProduct);
router.delete("/products/:id", adminMiddleware, deleteProduct);

// Users route
router.get("/users", adminMiddleware, getAllUsers);

// 🆕 Orders route (admin view all orders)
router.get("/orders", adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price image");
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// Analytics route
router.get("/analytics", adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error.message);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Get admin profile
router.get("/profile", protect, adminMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    res.json(admin);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update admin profile
router.put("/profile", protect, adminMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    if (req.file) {
      admin.avatar = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      admin.password = req.body.password;
    }

    const updatedAdmin = await admin.save();
    res.json({
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      avatar: updatedAdmin.avatar,
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
});


export default router;
