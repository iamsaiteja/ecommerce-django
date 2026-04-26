import API from "../utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    API.get('/products/')
        .then(res => setProducts(res.data))
        .catch(err => console.error("Error fetching products:", err))
}, []);

  function addToCart(e, productId) {
    e.stopPropagation(); // card click trigger avvakunda
    API.post("/cart/add/", { product_id: productId })
      .then(() => alert("Added to cart"))
      .catch((err) => console.error("Cart error:", err));
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", background: "#0a0a0a", minHeight: "100vh" }}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Products</h2>

      {/* Search Bar */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '28px' }}>
        <input
          type="text"
          placeholder="Search shoes..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          style={{
            padding: '10px 16px',
            width: '300px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />

        {showDropdown && search && filtered.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0,
            width: '300px', background: '#1a1a1a',
            border: '1px solid #333', borderRadius: '8px',
            zIndex: 999, marginTop: '4px', overflow: 'hidden'
          }}>
            {filtered.map(p => (
              <div
                key={p.id}
                onMouseDown={() => { setSearch(p.name); setShowDropdown(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', cursor: 'pointer',
                  borderBottom: '1px solid #222', color: 'white', fontSize: '14px'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img src={p.image} alt={p.name}
                  style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', background: '#fff' }}
                />
                <div>
                  <div>{p.name}</div>
                  <div style={{ color: '#e8ff3b', fontSize: '12px' }}>₹{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
        gap: "24px"
      }}>
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
            onMouseEnter={() => setHoveredCard(p.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              border: hoveredCard === p.id ? "1px solid #e8ff3b" : "1px solid #333",
              padding: "0",
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              background: "#111",
              transform: hoveredCard === p.id ? "translateY(-4px)" : "translateY(0)",
              transition: "all 0.25s ease",
              boxShadow: hoveredCard === p.id ? "0 8px 30px rgba(232,255,59,0.1)" : "none"
            }}
          >
            {/* Image */}
            <div style={{ overflow: "hidden", background: "#fff", height: "220px" }}>
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%", height: "220px", objectFit: "contain",
                  transform: hoveredCard === p.id ? "scale(1.06)" : "scale(1)",
                  transition: "transform 0.35s ease",
                  cursor: "zoom-in"
                }}
                onError={e => e.target.style.display = "none"}
              />
            </div>

            {/* Info */}
            <div style={{ padding: "16px" }}>
              <h3 style={{
                color: "white", fontSize: "14px", fontWeight: "600",
                marginBottom: "6px", lineHeight: "1.4"
              }}>
                {p.name}
              </h3>

              <p style={{ color: "#e8ff3b", fontWeight: "700", fontSize: "16px", marginBottom: "14px" }}>
                ₹{parseFloat(p.price).toLocaleString('en-IN')}
              </p>

              {/* Add To Cart Button */}
              <button
                onClick={e => addToCart(e, p.id)}
                onMouseEnter={() => setHoveredBtn(p.id)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: hoveredBtn === p.id ? "#e8ff3b" : "transparent",
                  color: hoveredBtn === p.id ? "#0a0a0a" : "#e8ff3b",
                  border: "1.5px solid #e8ff3b",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase"
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