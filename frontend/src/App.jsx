import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminCategories from "./pages/AdminCategories"; 
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminProfile from "./pages/AdminProfile";
import Checkout from "./pages/Checkout"
import MyOrders from "./pages/MyOrders";


const App = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
