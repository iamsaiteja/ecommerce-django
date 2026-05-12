import React, { useEffect, useState } from 'react';
import API, { getImage } from "../utils/api";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: '0' });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ shipping_address: '', phone: '' });
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState('cart');

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart/');
      setCart(res.data);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/remove/${id}/`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const updateQty = async (id, qty) => {
    try {
      if (qty < 1) return removeItem(id);
      await API.patch(`/cart/update/${id}/`, { quantity: qty });
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const handleCheckout = async () => {
    if (!form.shipping_address.trim()) { alert('Enter shipping address'); return; }
    setPlacing(true);
    try {
      const res = await API.post('/orders/create/', form);
      const { razorpay_order_id, amount, key, name, email } = res.data;
      const options = {
        key, amount, currency: 'INR', name: 'SoleMate',
        order_id: razorpay_order_id,
        handler: async (response) => {
          await API.post('/orders/verify-payment/', response);
          alert('Payment successful!');
          fetchCart();
          setStep('cart');
        },
        prefill: { name: name || "", email: email || "", contact: form.phone || "" },
        theme: { color: '#e8ff3b' },
      };
      if (window.Razorpay) { new window.Razorpay(options).open(); }
      else { alert("Payment SDK not loaded"); }
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed');
    } finally { setPlacing(false); }
  };

  if (loading) return <p style={{ color: 'white', padding: '40px' }}>Loading...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>🛒 My Cart</h1>

      {cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
          <p style={{ fontSize: '18px' }}>Your cart is empty</p>
        </div>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              background: '#1a1a1a', borderRadius: '12px',
              padding: '15px', marginBottom: '15px'
            }}>
              <img
                src={getImage(item?.product?.image)}
                alt={item?.product?.name}
                style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', background: '#fff' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{item?.product?.name}</p>
                <p style={{ margin: '4px 0', color: '#e8ff3b' }}>₹{item?.product?.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#333', color: 'white', cursor: 'pointer', fontSize: '18px' }}>−</button>
                <span style={{ fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#333', color: 'white', cursor: 'pointer', fontSize: '18px' }}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)}
                style={{ padding: '8px 16px', background: '#e74c3c', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ))}

          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
            <h2 style={{ color: '#e8ff3b', margin: '0 0 15px' }}>Total: ₹{cart.total}</h2>

            {step === 'cart' ? (
              <button onClick={() => setStep('checkout')}
                style={{ padding: '12px 30px', background: '#e8ff3b', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                Proceed to Checkout →
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                <input
                  placeholder="Shipping Address"
                  value={form.shipping_address}
                  onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '14px' }}
                />
                <input
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '14px' }}
                />
                <button onClick={handleCheckout} disabled={placing}
                  style={{ padding: '12px', background: placing ? '#555' : '#e8ff3b', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  {placing ? "Processing..." : "💳 Pay Now"}
                </button>
                <button onClick={() => setStep('cart')}
                  style={{ padding: '10px', background: 'transparent', border: '1px solid #555', borderRadius: '8px', color: '#aaa', cursor: 'pointer' }}>
                  ← Back to Cart
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;