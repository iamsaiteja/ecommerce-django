import API from "../utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error("Error fetching products:", err);
      });
  }, []);

  function addToCart(productId) {
    API.post("/cart/add/", {
      product_id: productId
    })
    .then(() => {
      alert("Added to cart");
    })
    .catch((err) => {
      console.error("Cart error:", err);
    });
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Products</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
        gap: "20px"
      }}>

        {products.map(p => (
          <div key={p.id}>

            <img 
              src={p.image} 
              alt={p.name} 
              style={{ width: "250px", height: "250px", objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250";
              }}
            />

            <h3>
              <Link to={`/product/${p.id}`}>{p.name}</Link>
            </h3>

            <p>₹{p.price}</p>

            <button onClick={() => addToCart(p.id)}>
              Add To Cart
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Products;