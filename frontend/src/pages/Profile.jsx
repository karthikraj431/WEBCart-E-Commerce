import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setName(res.data.name);
        setEmail(res.data.email);
        setAvatar(res.data.avatar || "");
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
  "http://localhost:5000/api/auth/profile",
  { name, email, password, avatar },
  { headers: { Authorization: `Bearer ${user.token}` } }
);

toast.success("Profile updated successfully!");
setPassword("");

// 🔄 Update localStorage and context with latest info
localStorage.setItem("webcart_user", JSON.stringify(data));
localStorage.setItem("token", data.token);
window.location.reload();

    } catch (err) {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in first.</p>;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter image URL"
            />
          </div>

          {avatar && (
            <div className="flex justify-center">
              <img
                src={avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover mt-3 border"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
