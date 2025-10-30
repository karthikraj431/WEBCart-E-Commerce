import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ name: res.data.name, email: res.data.email });
        setAvatar(res.data.avatar);
      } catch (err) {
        console.error("❌ Error fetching profile:", err.response?.data || err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      if (preview) formData.append("avatar", preview);

      const res = await axios.put("http://localhost:5000/api/admin/profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");
      setAvatar(res.data.avatar);
      setForm({ ...form, password: "" });
    } catch (err) {
      alert("Error updating profile!");
      console.error(err.response?.data || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-md mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <FaArrowLeft className="text-xl cursor-pointer text-gray-600 hover:text-black" />
          </Link>
          <h2 className="text-xl font-semibold">Admin Profile</h2>
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

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={preview ? URL.createObjectURL(preview) : avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover mb-3 border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPreview(e.target.files[0])}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FaUserEdit />
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
