import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa";

const AdminOrders = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err.response?.data || err.message);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-md mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <FaArrowLeft className="text-xl cursor-pointer text-gray-600 hover:text-black" />
          </Link>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaBoxOpen /> Orders Management
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">{user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{o.user?.name || "Unknown"}</td>
                  <td className="py-3 px-4">
                    {o.orderItems.map((i) => (
                      <div key={i._id}>
                        {i.name} × {i.qty}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4">${o.totalPrice?.toFixed(2) || 0}</td>
                  <td className="py-3 px-4">
                    {o.isPaid ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
