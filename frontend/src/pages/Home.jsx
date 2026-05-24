import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { getImage } from "../utils/api";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products/")
      .then((res) => setProducts(res.data.slice(0, 8)))
      .catch((err) => console.error(err));
  }, []);

  const handleProtectedRoute = () => {
    const token = localStorage.getItem("access");
    if (token) navigate("/products");
    else navigate("/login");
  };

  const addToCart = async (productId) => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
      return;
    }
    try {
      await API.post("/cart/add/", { product_id: productId, quantity: 1 });
      alert("Added to cart");
    } catch {
      alert("Error adding to cart");
    }
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* HERO */}
      <div style={{
        height: "100vh",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        textAlign: "center", padding: "20px"
      }}>
        <h1 style={{ fontSize: "90px", fontWeight: "900", letterSpacing: "5px", marginBottom: "20px", color: "#fff" }}>
          SOLEMATE
        </h1>
        <p style={{ fontSize: "22px", maxWidth: "700px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
          Discover premium sneakers crafted for comfort, performance, and modern street fashion.
        </p>
        <div style={{ display: "flex", gap: "20px", marginTop: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={handleProtectedRoute} style={{
            padding: "15px 40px", background: "#e8ff3b",
            border: "none", fontWeight: "bold", fontSize: "16px",
            cursor: "pointer", borderRadius: "8px", color: "#0a0a0a"
          }}>Shop Now</button>
          <button onClick={handleProtectedRoute} style={{
            padding: "15px 40px", background: "transparent",
            border: "2px solid white", color: "white",
            fontWeight: "bold", fontSize: "16px",
            cursor: "pointer", borderRadius: "8px"
          }}>Explore Collection</button>
        </div>
      </div>

      {/* STATS */}
      <div style={{
        display: "flex", justifyContent: "space-around",
        padding: "60px 20px", flexWrap: "wrap",
        textAlign: "center", background: "#ffffff",
        borderBottom: "1px solid #eee"
      }}>
        {[["10K+", "Happy Customers"], ["500+", "Premium Products"], ["24/7", "Customer Support"]].map(([num, label]) => (
          <div key={label}>
            <h1 style={{ color: "#1a1a1a", fontSize: "48px", fontWeight: "800" }}>{num}</h1>
            <p style={{ color: "#666", fontSize: "15px", marginTop: "4px" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ padding: "80px 40px", background: "#f5f5f5" }}>
        <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "8px", textAlign: "center", color: "#1a1a1a" }}>
          Featured Products
        </h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "48px", fontSize: "15px" }}>
          Handpicked. Heat certified. Zero fake.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {products.map((p) => (
            <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} style={{
              background: "#ffffff",
              borderRadius: "16px", overflow: "hidden",
              cursor: "pointer", border: "1px solid #eee",
              transition: "0.3s"
            }}>
              <div style={{ background: "#f8f8f8", padding: "20px" }}>
                <img src={getImage(p.image)} alt={p.name} style={{
                  width: "100%", height: "220px", objectFit: "contain"
                }} />
              </div>
              <div style={{ padding: "20px" }}>
                <h3 style={{ marginBottom: "8px", color: "#1a1a1a", fontSize: "16px", fontWeight: "600" }}>
                  {p.name}
                </h3>
                <p style={{ color: "#1a1a1a", fontWeight: "700", fontSize: "20px" }}>
                  ₹{p.price}
                </p>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p.id); }} style={{
                  marginTop: "14px", width: "100%", padding: "12px",
                  background: "#1a1a1a", color: "#e8ff3b",
                  border: "none", fontWeight: "bold",
                  cursor: "pointer", borderRadius: "8px", fontSize: "14px"
                }}>
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: "40px 20px", textAlign: "center",
        borderTop: "1px solid #e0e0e0",
        background: "#fff", color: "#888"
      }}>
        <h2 style={{ color: "#1a1a1a", fontWeight: "800", letterSpacing: "2px" }}>SOLEMATE</h2>
        <p style={{ marginTop: "10px", fontSize: "14px" }}>Premium Sneakers for Modern Lifestyle</p>
        <p style={{ marginTop: "12px", fontSize: "13px" }}>© 2026 SOLEMATE. All Rights Reserved.</p>
      </div>

    </div>
  );
}

export default Home;