import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error fetching users:", err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow p-4 rounded-md mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <FaArrowLeft className="text-xl cursor-pointer text-gray-600 hover:text-black" />
          </Link>
          <h2 className="text-xl font-semibold">All Registered Users</h2>
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

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    {u.isAdmin ? (
                      <>
                        <FaUserShield className="text-blue-500" /> Admin
                      </>
                    ) : (
                      "User"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
