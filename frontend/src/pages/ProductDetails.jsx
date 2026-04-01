import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({})
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('access')

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/api/products/${id}/`)
      .then(res => res.json())
      .then(data => setProduct(data))
  }, [id])

  const addToCart = () => {
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(true)
    fetch("http://127.0.0.1:8000/cart/api/cart/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: id, quantity: 1 })
    })
      .then(res => res.json())
      .then(data => {
        setMsg(data.message || data.error)
        setLoading(false)
        setTimeout(() => setMsg(""), 2000)
      })
      .catch(() => { setMsg("Error occurred"); setLoading(false) })
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{product.name}</h2>
      {product.image && (
        <img src={"http://127.0.0.1:8000" + product.image} width="300" alt="product" style={{ borderRadius: "8px" }} />
      )}
      <p style={{ fontSize: "22px", fontWeight: "bold", margin: "16px 0" }}>₹{product.price}</p>
      {product.discount_price && (
        <p style={{ color: "green" }}>Discounted: ₹{product.discount_price}</p>
      )}
      <p>{product.description}</p>
      <p>Stock: {product.stock}</p>

      {msg && <p style={{ color: "green", fontWeight: "bold" }}>{msg}</p>}

      <button
        onClick={addToCart}
        disabled={loading}
        style={{
          padding: "12px 30px", background: "black", color: "white",
          border: "none", borderRadius: "6px", fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer", marginRight: "12px"
        }}
      >
        {loading ? "Adding..." : "Add To Cart"}
      </button>

      <button
        onClick={() => navigate('/cart')}
        style={{
          padding: "12px 30px", background: "#6c5ce7", color: "white",
          border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer"
        }}
      >
        Go to Cart
      </button>
    </div>
  )
}

export default ProductDetails