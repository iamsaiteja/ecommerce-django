import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Cart() {
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem('access')

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  const fetchCart = () => {
    if (!token) { navigate('/login'); return }
    fetch("http://127.0.0.1:8000/cart/api/cart/", { headers })
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
  }

  useEffect(() => { fetchCart() }, [])

  const removeItem = (id) => {
    fetch(`http://127.0.0.1:8000/cart/api/cart/remove/${id}/`, { method: "DELETE", headers })
      .then(() => fetchCart())
  }

  const updateQty = (id, qty) => {
    fetch(`http://127.0.0.1:8000/cart/api/cart/update/${id}/`, {
      method: "PUT", headers,
      body: JSON.stringify({ quantity: qty })
    }).then(() => fetchCart())
  }

  const total = items.reduce((sum, i) => sum + i.subtotal, 0)

  const handleCheckout = () => {
    fetch("http://127.0.0.1:8000/orders/api/create/", { method: "POST", headers })
      .then(res => res.json())
      .then(data => {
        if (data.error) { setMsg(data.error); return }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "SoleMate",
          description: `Order ${data.order_number}`,
          order_id: data.razorpay_order_id,
          handler: function (response) {
            fetch("http://127.0.0.1:8000/orders/api/verify/", {
              method: "POST", headers,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            })
              .then(res => res.json())
              .then(result => {
                if (result.message) {
                  setMsg(`✅ ${result.message} — Order: ${result.order_number}`)
                  setItems([])
                  setTimeout(() => navigate('/orders'), 2000)
                } else {
                  setMsg("❌ Payment verification failed")
                }
              })
          },
          prefill: { name: data.user_name, email: data.user_email },
          theme: { color: "#000000" }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      })
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Your Cart</h2>

      {msg && <p style={{ color: msg.startsWith("✅") ? "green" : "red", fontWeight: "bold" }}>{msg}</p>}

      {items.length === 0 ? (
        <p>Cart is empty. <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate('/')}>Shop now →</span></p>
      ) : (
        <>
          {items.map(i => (
            <div key={i.id} style={{
              display: "flex", alignItems: "center", gap: "20px",
              border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "8px"
            }}>
              <img src={"http://127.0.0.1:8000" + i.image} width="80" alt="product" style={{ borderRadius: "6px" }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{i.name}</h3>
                <p style={{ margin: "4px 0" }}>₹{i.price} each</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => updateQty(i.id, i.quantity - 1)} style={btnStyle}>−</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => updateQty(i.id, i.quantity + 1)} style={btnStyle}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "bold" }}>₹{i.subtotal.toFixed(2)}</p>
                <button onClick={() => removeItem(i.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <h2>Total: ₹{total.toFixed(2)}</h2>
            <button onClick={handleCheckout} style={{
              padding: "14px 40px", background: "black", color: "white",
              border: "none", borderRadius: "8px", fontSize: "18px", cursor: "pointer"
            }}>
              Proceed to Pay (Razorpay)
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const btnStyle = {
  padding: "4px 10px", background: "#eee", border: "1px solid #ccc",
  borderRadius: "4px", cursor: "pointer", fontSize: "16px"
}

export default Cart