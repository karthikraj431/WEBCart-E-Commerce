// auth.js
import express from "express";
import { signup, login, createAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// signup (user)
router.post("/signup", signup);

// login (user or admin)
router.post("/login", login);

// create admin (optional - use once)
router.post("/create-admin", createAdmin);

// get profile
router.get("/profile", protect, asyncHandler(async (req, res) => {
  res.json(req.user);
}));

// update profile
router.put("/profile", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.avatar) user.avatar = req.body.avatar;

  await user.save();

  res.json({ name: user.name, email: user.email, isAdmin: user.isAdmin, avatar: user.avatar });
}));

export default router;
