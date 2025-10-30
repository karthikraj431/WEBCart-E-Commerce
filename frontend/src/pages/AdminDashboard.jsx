import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBars, FaPlus, FaEdit, FaTrash, FaUsers, FaBullhorn,FaBox, FaTags, FaChartBar, FaClipboardList, FaUserEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../index.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth(); // ✅ user includes token
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [modalType, setModalType] = useState(null); // "add" | "edit" | "delete"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", image: "" });

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!user?.token) {
          console.error("❌ No user token found in context");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/admin/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Fetch error:", err.response?.data || err.message);
      }
    };
    fetchProducts();
  }, [user]);

  // ✅ Add, Edit, or Delete Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      console.error("❌ No user token found in context");
      return;
    }

    try {
      if (modalType === "add") {
        await axios.post("http://localhost:5000/api/admin/products", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else if (modalType === "edit") {
        await axios.put(
          `http://localhost:5000/api/admin/products/${selectedProduct._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } else if (modalType === "delete") {
        await axios.delete(
          `http://localhost:5000/api/admin/products/${selectedProduct._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      }

      // Refresh product list
      const res = await axios.get("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(res.data);

      // Reset form & modal
      setModalType(null);
      setSelectedProduct(null);
      setFormData({ name: "", description: "", price: "", image: "" });
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
    }
  };

  const openModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    if (product) setFormData(product);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20`}
      >
        <div className="p-5 font-bold text-lg border-b border-gray-700">Admin Panel</div>
        <ul className="p-4 space-y-3">
          <Link to="/admin/profile" className="flex items-center gap-2 hover:text-blue-600">
            <FaUserEdit /> Profile
          </Link>

          <li
            className="flex items-center gap-2 hover:text-yellow-400 cursor-pointer"
            onClick={() => openModal("add")}
          >
            <FaPlus /> Add Product
          </li>
          <Link to="/admin/users"
            className="flex items-center gap-2 hover:text-yellow-400 cursor-pointer"
          >
            <FaUsers /> View Users
          </Link>
          <li className="flex items-center gap-2 hover:text-yellow-400 cursor-pointer">
            <Link to="/admin/orders">🧾 Orders</Link>
          </li>
          <li className="flex items-center gap-2 hover:text-yellow-400 cursor-pointer">
            <FaBullhorn /> Promotions
          </li>
          <Link to="/admin/categories" className="flex items-center gap-2 hover:text-blue-600">
    <FaTags /> Categories
  </Link>

  <Link to="/admin/orders" className="flex items-center gap-2 hover:text-blue-600">
    <FaClipboardList /> Orders
  </Link>
  <Link to="/admin/analytics" className="flex items-center gap-2 hover:text-blue-600">
    <FaChartBar /> Analytics
  </Link>
          <li
            className="flex items-center gap-2 hover:text-red-500 cursor-pointer"
            onClick={logout}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between bg-white p-4 shadow">
          <FaBars
            className="text-2xl cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h2 className="text-xl font-semibold">Welcome, {user?.name || "Admin"}</h2>
          <button onClick={logout} className="text-red-500 font-semibold">
            Logout
          </button>
        </div>

        {/* Product List */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-md p-4 rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="font-bold text-lg mt-2">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.description}</p>
              <p className="font-semibold mt-1">₹{product.price}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openModal("edit", product)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => openModal("delete", product)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4 capitalize">{modalType} Product</h2>

            {modalType !== "delete" ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  {modalType === "add" ? "Add" : "Save Changes"}
                </button>
              </form>
            ) : (
              <div>
                <p>Are you sure you want to delete this product?</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSubmit}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setModalType(null)}
                    className="bg-gray-300 py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
