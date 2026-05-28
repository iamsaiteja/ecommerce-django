import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API, { getImage } from "../utils/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const SIZES = [6, 7, 8, 9, 10, 11, 12];

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

  function addToCart() {

    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    API.post("/cart/add/", {
      product_id: product.id,
      size: selectedSize,
    })
      .then(() => {
        alert("Added to cart!");
      })
      .catch((error) => {
        console.log(error.response);
        alert("Something went wrong");
      });
  }

  if (loading) {
    return (
      <div
        style={{
          background: "#f5f5f5",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#888", fontSize: "15px" }}>
          Loading product...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#f5f5f5",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#dc2626" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: "100px 40px 60px",
      }}
    >

      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#888",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "32px",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          padding: "48px",
          border: "1px solid #eee",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >

        {/* IMAGE */}
        <div
          style={{
            background: "#f8f8f8",
            borderRadius: "16px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #eee",
          }}
        >
          {product?.image && (
            <img
              src={getImage(product.image)}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300?text=No+Image";
              }}
            />
          )}
        </div>

        {/* DETAILS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >

          <h1
            style={{
              color: "#1a1a1a",
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "12px",
            }}
          >
            {product?.name}
          </h1>

          <p
            style={{
              color: "#1a1a1a",
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            ₹{parseFloat(product?.price || 0).toLocaleString("en-IN")}
          </p>

          <p
            style={{
              color: "#666",
              fontSize: "14px",
              lineHeight: "1.7",
              marginBottom: "28px",
            }}
          >
            {product?.description || "No description available"}
          </p>

          {/* SIZE */}
          <div style={{ marginBottom: "28px" }}>

            <p
              style={{
                color: "#1a1a1a",
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              Select Size {selectedSize && `— ${selectedSize}`}
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >

              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: "48px",
                    height: "48px",
                    border:
                      selectedSize === size
                        ? "2px solid #1a1a1a"
                        : "1px solid #e0e0e0",
                    background:
                      selectedSize === size
                        ? "#1a1a1a"
                        : "#fff",
                    color:
                      selectedSize === size
                        ? "#e8ff3b"
                        : "#1a1a1a",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  {size}
                </button>
              ))}

            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            style={{
              padding: "16px",
              width: "100%",
              background:
                selectedSize
                  ? "#1a1a1a"
                  : "#e0e0e0",
              color:
                selectedSize
                  ? "#e8ff3b"
                  : "#999",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "15px",
              letterSpacing: "0.5px",
              cursor:
                selectedSize
                  ? "pointer"
                  : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {selectedSize
              ? "Add to Cart"
              : "Select Size First"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;