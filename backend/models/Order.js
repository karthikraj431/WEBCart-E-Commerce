import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: Number,
      price: Number,
      name: String,
      image: String
    }
  ],
  shippingAddress: {
    address: String, city: String, postalCode: String, country: String
  },
  paymentResult: {}, // stripe or other
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
