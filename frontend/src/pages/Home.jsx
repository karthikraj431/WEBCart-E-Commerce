import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [products,setProducts]=useState([]);
  const [q,setQ]=useState("");
  useEffect(()=>{
    const fetchAll = async ()=> {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products || res.data);
    };
    fetchAll();
  },[]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>WEBCart</h2>
      <input placeholder="Search products..." value={q} onChange={(e)=>setQ(e.target.value)} />
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
        {filtered.map(p=>(
          <div key={p._id} style={{ width: 220, border: "1px solid #ddd", padding: "1rem", borderRadius: 8 }}>
            <Link to={`/product/${p._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <img src={p.image} alt={p.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
              <h4>{p.name}</h4>
            </Link>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
