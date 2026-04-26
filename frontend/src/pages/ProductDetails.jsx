import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const SIZES = [6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    API.get(`/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  function addToCart() {
    if (!selectedSize) { alert("Please select a size!"); return; }
    API.post("/cart/add/", { product_id: product.id, size: selectedSize })
      .then(() => alert("Added to cart!"))
      .catch(err => console.error(err));
  }

  if (!product) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", letterSpacing: "2px" }}>LOADING...</p>
    </div>
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "40px" }}>

      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#666", fontSize: "14px", cursor: "pointer", marginBottom: "32px" }}>
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", maxWidth: "1000px", margin: "0 auto" }}>

        {/* Image */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={product.image} alt={product.name}
            style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
            onError={e => e.target.style.display = "none"}
          />
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "700", marginBottom: "12px" }}>
            {product.name}
          </h1>

          <p style={{ color: "#e8ff3b", fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}>
            ₹{parseFloat(product.price).toLocaleString("en-IN")}
          </p>

          <p style={{ color: "#888", fontSize: "14px", marginBottom: "32px", lineHeight: "1.6" }}>
            {product.description || "Premium footwear crafted for those who move with intention."}
          </p>

          {/* Sizes */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ color: "#666", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              Select Size {selectedSize && <span style={{ color: "#e8ff3b" }}>— UK {selectedSize}</span>}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {SIZES.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  style={{
                    width: "48px", height: "48px", borderRadius: "8px",
                    border: selectedSize === size ? "2px solid #e8ff3b" : "1px solid #333",
                    background: selectedSize === size ? "#e8ff3b" : "transparent",
                    color: selectedSize === size ? "#0a0a0a" : "white",
                    fontSize: "14px", fontWeight: "600", cursor: "pointer"
                  }}
                >{size}</button>
              ))}
            </div>
          </div>

          {/* Cart Button */}
          <button onClick={addToCart}
            style={{
              padding: "16px",
              background: selectedSize ? "#e8ff3b" : "#1a1a1a",
              color: selectedSize ? "#0a0a0a" : "#444",
              border: "none", borderRadius: "10px",
              fontSize: "14px", fontWeight: "700",
              letterSpacing: "1px", textTransform: "uppercase",
              cursor: selectedSize ? "pointer" : "not-allowed"
            }}
          >
            {selectedSize ? `ADD TO CART — UK ${selectedSize}` : "SELECT A SIZE FIRST"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;