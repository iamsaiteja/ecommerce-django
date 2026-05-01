import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const SIZES = [6, 7, 8, 9, 10, 11, 12];

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    setLoading(true);

    API.get(`/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load product");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  // 🔥 ADD TO CART
  function addToCart() {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    API.post("/cart/add/", {
      product_id: product.id,
      size: selectedSize,
    })
      .then(() => alert("Added to cart!"))
      .catch(() => alert("Something went wrong"));
  }

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div style={{ background: "#0a0a0a", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#999" }}>Loading product...</p>
      </div>
    );
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <div style={{ background: "#0a0a0a", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "40px" }}>

      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", maxWidth: "1000px", margin: "40px auto" }}>

        {/* IMAGE */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={product?.image}
            alt={product?.name}
            style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        </div>

        {/* DETAILS */}
        <div>

          <h1 style={{ color: "white" }}>
            {product?.name}
          </h1>

          <p style={{ color: "#e8ff3b", fontSize: "24px" }}>
            ₹{parseFloat(product?.price || 0).toLocaleString("en-IN")}
          </p>

          <p style={{ color: "#888" }}>
            {product?.description || "No description available"}
          </p>

          {/* SIZE */}
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "#aaa" }}>
              Select Size {selectedSize && `— ${selectedSize}`}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: "10px",
                    border: selectedSize === size ? "2px solid yellow" : "1px solid gray",
                    background: selectedSize === size ? "yellow" : "transparent",
                    color: selectedSize === size ? "black" : "white",
                    cursor: "pointer"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={addToCart}
            style={{
              marginTop: "30px",
              padding: "15px",
              width: "100%",
              background: selectedSize ? "yellow" : "#333",
              color: selectedSize ? "black" : "#777",
              border: "none",
              cursor: selectedSize ? "pointer" : "not-allowed"
            }}
          >
            {selectedSize ? "Add to Cart" : "Select Size First"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;