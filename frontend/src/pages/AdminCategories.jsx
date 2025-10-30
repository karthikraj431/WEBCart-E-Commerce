import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminCategories = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  // 🟢 Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Error fetching categories:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ Add or ✏️ Update category
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await axios.put(
          `http://localhost:5000/api/categories/${editCategory._id}`,
          { name, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/categories",
          { name, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowModal(false);
      setEditCategory(null);
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      console.error("❌ Error saving category:", err.response?.data || err.message);
    }
  };

  // 🗑️ Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("❌ Error deleting category:", err.response?.data || err.message);
    }
  };

  // ✏️ Open modal for edit
  const openEditModal = (cat) => {
    setEditCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-md mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <FaArrowLeft className="text-xl cursor-pointer text-gray-600 hover:text-black" />
          </Link>
          <h2 className="text-xl font-semibold">Manage Categories</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Add Category
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {cat.description || "No description provided"}
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => openEditModal(cat)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No categories found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded mb-3 focus:ring focus:ring-blue-200"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3 focus:ring focus:ring-blue-200"
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditCategory(null);
                    setName("");
                    setDescription("");
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
