import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err.response?.data || err.message);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) return <div>Please log in to view your orders.</div>;
  if (orders.length === 0) return <div style={{ padding: "2rem" }}>No orders found.</div>;
  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem" }}>
          <h4>Order ID: {order._id}</h4>
          <p><strong>Total:</strong> ₹{order.totalPrice || order.total}</p>
          <p><strong>Status:</strong> {order.isPaid ? "Paid" : "Pending"}</p>
          <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          <h5>Items:</h5>
          <ul>
            {order.orderItems.map((item) => (
              <li key={item._id}>
                {item.name} × {item.qty} — ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default MyOrders
