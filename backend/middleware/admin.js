// backend/middleware/admin.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in admin middleware:", error.message);
    res.status(500).json({
      message: "Server error in admin middleware",
      error: error.message,
    });
  }
};
