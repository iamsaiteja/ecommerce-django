import React, { useEffect, useState } from "react";
import API, { getImage } from "../utils/api";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products/")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Products</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px"
      }}>
        {products.map((p) => (
          <div key={p.id} style={{
            border: "1px solid #333",
            padding: "10px",
            borderRadius: "10px"
          }}>
            <img
              src={getImage(p.image)}
              alt={p.name}
              style={{ width: "100%", height: "150px", objectFit: "contain" }}
            />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;