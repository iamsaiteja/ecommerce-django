import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { getImage } from "../utils/api";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products/")
      .then((res) => {
        setProducts(res.data.slice(0, 8));
      })
      .catch((err) => console.error(err));
  }, []);

  const addToCart = async (productId) => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/cart/add/", {
        product_id: productId,
        quantity: 1,
      });
      alert("Added to cart");
    } catch {
      alert("Error adding to cart");
    }
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ color: "white" }}>Featured Products</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            style={{
              border: "1px solid #333",
              borderRadius: "10px",
              padding: "10px",
              background: "#161616",
              cursor: "pointer",
            }}
          >
            {/* ✅ IMAGE FIX */}
            <img
              src={getImage(p.image)}
              alt={p.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
              }}
            />

            <h4 style={{ color: "white" }}>{p.name}</h4>

            <p style={{ color: "#e8ff3b" }}>₹{p.price}</p>

            {/* ✅ CART FIX */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // VERY IMPORTANT
                addToCart(p.id);
              }}
              style={{
                background: "#e8ff3b",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;