import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      alert("Signup success. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <br/><br/>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <br/><br/>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
