import React, { createContext, useState, useContext, useEffect } from "react";

// ✅ Create Context
const CartContext = createContext();

// ✅ Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load from localStorage on start
  useEffect(() => {
    const storedCart = localStorage.getItem("webcart_cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("webcart_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Export Context Hook
export const useCart = () => useContext(CartContext);
