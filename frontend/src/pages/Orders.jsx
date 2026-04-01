import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Orders() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('access')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetch("http://127.0.0.1:8000/orders/api/history/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
  }, [])

  const statusColor = { pending: "#f39c12", confirmed: "#27ae60", shipped: "#2980b9", delivered: "#16a085", cancelled: "#e74c3c" }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet. <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate('/')}>Start shopping →</span></p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>Order #{order.order_number}</h3>
                <p style={{ color: "#666", margin: "4px 0" }}>{order.created_at}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  background: statusColor[order.status] || "#999",
                  color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "13px"
                }}>{order.status.toUpperCase()}</span>
                <p style={{ margin: "6px 0", color: order.payment_status === 'paid' ? "green" : "orange" }}>
                  Payment: {order.payment_status}
                </p>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={th}>Product</th>
                  <th style={th}>Qty</th>
                  <th style={th}>Price</th>
                  <th style={th}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={td}>{item.product_name}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>₹{item.price}</td>
                    <td style={td}>₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ textAlign: "right", fontWeight: "bold", marginTop: "10px" }}>Total: ₹{order.total}</p>
          </div>
        ))
      )}
    </div>
  )
}

const th = { padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #ddd" }
const td = { padding: "8px 12px", borderBottom: "1px solid #eee" }

export default Orders