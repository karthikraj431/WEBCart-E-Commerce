import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import reviewsRoutes from "./routes/reviews.js";
import ordersRoutes from "./routes/orders.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // IMPORTANT
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/categories", categoryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
