import React, { useContext } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.product} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
              <h4>{item.name}</h4>
              <p>₹{item.price} × {item.qty}</p>
              <button onClick={() => removeFromCart(item.product)}>Remove</button>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
          <button onClick={clearCart}>Clear Cart</button>
          <button style={{ marginLeft: "10px" }} onClick={() => navigate("/checkout")}>
  Checkout
</button>

        </>
      )}
    </div>
  );
};

export default Cart;
