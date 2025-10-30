// authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect route
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  res.status(403).json({ message: "Admin only" });
};
