import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#222", color: "white" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>🛒 WEBCart</Link>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/cart" style={{ color: "white" }}>Cart ({cart.reduce((a,i)=>a+i.qty,0)})</Link>
        {!user ? (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/signup" style={{ color: "white" }}>Signup</Link>
          </>
        ) : (
          <>
            <span style={{ color: "lightgray" }}>Hi, {user.name}</span>
            {user && (
              <Link to="/profile" className="px-3 hover:underline">
                My Profile
              </Link>
            )}
            {user.isAdmin && <Link to="/admin/dashboard" style={{ color: "lime" }}>Admin</Link>}
            {user && <Link to="/my-orders">My Orders</Link>}
            <button onClick={()=>{ logout(); navigate("/"); }} style={{ background: "transparent", border: "1px solid white", color: "white", padding: "4px 8px" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
