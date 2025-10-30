import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { orderItems, total } = req.body;
  if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
  const order = await Order.create({ user: req.user._id, orderItems, total });
  res.status(201).json(order);
});

router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("orderItems.product");
  res.json(orders);
});

export default router;
