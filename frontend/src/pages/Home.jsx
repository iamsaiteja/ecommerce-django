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
    <div
      style={{
        background: "#050505",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          height: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "90px",
            fontWeight: "900",
            letterSpacing: "5px",
            marginBottom: "20px",
          }}
        >
          SOLEMATE
        </h1>

        <p
          style={{
            fontSize: "24px",
            maxWidth: "700px",
            color: "#d1d1d1",
            lineHeight: "1.6",
          }}
        >
          Discover premium sneakers crafted for comfort,
          performance, and modern street fashion.
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: "15px 40px",
              background: "#e8ff3b",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Shop Now
          </button>

          <button
            style={{
              padding: "15px 40px",
              background: "transparent",
              border: "1px solid white",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "60px 20px",
          flexWrap: "wrap",
          textAlign: "center",
          background: "#0d0d0d",
        }}
      >
        <div>
          <h1 style={{ color: "#e8ff3b" }}>10K+</h1>
          <p>Happy Customers</p>
        </div>

        <div>
          <h1 style={{ color: "#e8ff3b" }}>500+</h1>
          <p>Premium Products</p>
        </div>

        <div>
          <h1 style={{ color: "#e8ff3b" }}>24/7</h1>
          <p>Customer Support</p>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ padding: "80px 20px" }}>
        <h2
          style={{
            fontSize: "40px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          Featured Products
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              style={{
                background: "#111",
                borderRadius: "15px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
                border: "1px solid #222",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "20px",
                }}
              >
                <img
                  src={getImage(p.image)}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {p.name}
                </h3>

                <p
                  style={{
                    color: "#e8ff3b",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  ₹{p.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p.id);
                  }}
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "12px",
                    background: "#e8ff3b",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "8px",
                  }}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          borderTop: "1px solid #222",
          color: "#888",
        }}
      >
        <h2 style={{ color: "white" }}>SOLEMATE</h2>

        <p style={{ marginTop: "10px" }}>
          Premium Sneakers for Modern Lifestyle
        </p>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          © 2026 SOLEMATE. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Home;