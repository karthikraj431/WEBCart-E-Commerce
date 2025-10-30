import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const AdminAnalytics = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching analytics:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "bg-blue-100 text-blue-600" },
    { title: "Total Products", value: stats.totalProducts, icon: <FaBox />, color: "bg-yellow-100 text-yellow-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FaShoppingCart />, color: "bg-green-100 text-green-600" },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: <FaDollarSign />, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-md mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <FaArrowLeft className="text-xl cursor-pointer text-gray-600 hover:text-black" />
          </Link>
          <h2 className="text-xl font-semibold">Admin Analytics</h2>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`p-6 rounded-lg shadow hover:shadow-lg transition ${c.color} flex flex-col justify-center items-center`}
          >
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-2xl font-bold mt-2">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
