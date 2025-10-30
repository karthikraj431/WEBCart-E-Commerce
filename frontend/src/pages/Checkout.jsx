import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const placeOrder = async () => {
    if (!user) return alert("Login to continue");
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          qty: item.qty,
          price: item.price,
          name: item.name,
          image: item.image,
        })),
        shippingAddress: { address, city, postalCode, country },
        total,
      };

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      clearCart();
      alert(
        paymentMethod === "COD"
          ? "Order placed successfully! Pay on delivery."
          : "Payment simulated — order placed successfully!"
      );
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h2>Checkout</h2>

      <div>
        <label>Address:</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div>
        <label>City:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div>
        <label>Postal Code:</label>
        <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
      </div>
      <div>
        <label>Country:</label>
        <input value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <h3>Payment Method</h3>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="COD">Cash on Delivery</option>
        <option value="Online">Simulated Online Payment</option>
      </select>

      <h3>Total: ₹{total}</h3>

      <button disabled={loading} onClick={placeOrder}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
