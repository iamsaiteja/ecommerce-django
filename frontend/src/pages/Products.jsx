import API from "../utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://solemate.servecounterstrike.com";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products/")
      .then((res) => {
        console.log("PRODUCTS:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  function addToCart(e, productId) {
    e.stopPropagation();
    API.post("/cart/add/", { product_id: productId })
      .then(() => alert("Added to cart"))
      .catch((err) => console.error("Cart error:", err));
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", background: "#0a0a0a", minHeight: "100vh" }}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Products</h2>

      {/* 🔍 SEARCH BOX */}
      <div style={{ position: "relative", marginBottom: "28px" }}>
        <input
          type="text"
          placeholder="Search shoes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          style={{
            padding: "10px 16px",
            width: "300px",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "white",
          }}
        />

        {/* 🔽 DROPDOWN */}
        {showDropdown && search && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "300px",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              zIndex: 999,
            }}
          >
            {filtered.map((p) => (
              <div
                key={p.id}
                onMouseDown={() => {
                  setSearch(p.name);
                  setShowDropdown(false);
                }}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                {/* ✅ FIX 1: BASE_URL add చేశాం */}
                <img
                  src={`${BASE_URL}${p.image}`}
                  alt={p.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/300x300?text=No+Image";
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    objectFit: "contain",
                    background: "#fff",
                  }}
                />
                <div>
                  <div style={{ color: "white" }}>{p.name}</div>
                  <div style={{ color: "#e8ff3b" }}>₹{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🧱 PRODUCTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "24px",
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
            onMouseEnter={() => setHoveredCard(p.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              border: hoveredCard === p.id ? "1px solid #e8ff3b" : "1px solid #333",
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              background: "#111",
            }}
          >
            {/* ✅ FIX 2: BASE_URL add చేశాం */}
            <div style={{ background: "#fff", height: "220px" }}>
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x300?text=No+Image";
                }}
              />
            </div>

            {/* 📦 DETAILS */}
            <div style={{ padding: "16px" }}>
              <h3 style={{ color: "white" }}>{p.name}</h3>
              <p style={{ color: "#e8ff3b" }}>
                ₹{parseFloat(p.price).toLocaleString("en-IN")}
              </p>
              <button
                onClick={(e) => addToCart(e, p.id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e8ff3b",
                  color: "#e8ff3b",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;