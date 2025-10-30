import User from "../models/User.js";

// ✅ Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};
