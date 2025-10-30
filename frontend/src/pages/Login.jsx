import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(email, password);
      if (u.isAdmin) navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <br/><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
