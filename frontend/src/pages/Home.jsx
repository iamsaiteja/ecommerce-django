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
        background: "#0a0a0a",
        minHeight: "100vh",
        padding: "20px",
        paddingTop: "90px",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            marginBottom: "20px",
            letterSpacing: "3px",
          }}
        >
          SOLEMATE
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#ccc",
          }}
        >
          Premium Shoes Collection
        </p>

        <button
          onClick={() => navigate("/products")}
          style={{
            marginTop: "20px",
            padding: "12px 30px",
            background: "#e8ff3b",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Shop Now
        </button>
      </div>

      {/* FEATURED PRODUCTS */}
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Featured Products
      </h2>

      {/* PRODUCTS GRID */}
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
              transition: "0.3s",
            }}
          >
            <img
              src={getImage(p.image)}
              alt={p.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
                background: "white",
                borderRadius: "5px",
              }}
            />

            <h4
              style={{
                color: "white",
                marginTop: "10px",
              }}
            >
              {p.name}
            </h4>

            <p
              style={{
                color: "#e8ff3b",
                fontWeight: "bold",
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
                background: "#e8ff3b",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: "bold",
                borderRadius: "5px",
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