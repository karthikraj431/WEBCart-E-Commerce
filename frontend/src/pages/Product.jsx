import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Product = () => {
  const { id } = useParams();
  const [product,setProduct] = useState(null);
  const [reviews,setReviews] = useState([]);
  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(()=> {
    const fetch = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      const rev = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(rev.data);
    };
    fetch();
  }, [id]);

  const submitReview = async () => {
    if (!user) return alert("Login to give feedback");
    try {
      await axios.post(`http://localhost:5000/api/reviews/${id}`, { rating, comment }, { headers: { Authorization: `Bearer ${user.token}` }});
      const rev = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(rev.data);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Can't submit review");
    }
  };

  if (!product) return <div>Loading...</div>;
  return (
    <div style={{ padding: "2rem" }}>
      <h2>{product.name}</h2>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <img src={product.image} alt={product.name} style={{ width: 400, height: 400, objectFit: "cover", cursor: "zoom-in" }} />
          {/* For HD view: open image in new tab or lightbox - kept simple */}
        </div>
        <div>
          <p>{product.description}</p>
          <h3>₹{product.price}</h3>
          <p>Stock: {product.stock}</p>
          <button onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>

      <section style={{ marginTop: "2rem" }}>
        <h3>Reviews</h3>
        {reviews.map(r => (
          <div key={r._id} style={{ borderTop: "1px solid #eee", padding: "1rem 0" }}>
            <strong>{r.user?.name}</strong> — {r.rating}/5
            <p>{r.comment}</p>
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <h4>Submit review</h4>
          <select value={rating} onChange={e=>setRating(Number(e.target.value))}>
            {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
          <br/>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} />
          <br/>
          <button onClick={submitReview}>Submit</button>
        </div>
      </section>
    </div>
  );
};

export default Product;
