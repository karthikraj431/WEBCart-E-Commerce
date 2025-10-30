// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("webcart_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    const u = {
      name: res.data.name,
      email: res.data.email,
      token: res.data.token,
      isAdmin: res.data.isAdmin,
      avatar: res.data.avatar,
    };

    setUser(u);
    localStorage.setItem("webcart_user", JSON.stringify(u)); // ✅ save full user
    localStorage.setItem("token", res.data.token);            // ✅ correct token
    return u;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("webcart_user");
    localStorage.removeItem("token"); // ✅ clear token too
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
