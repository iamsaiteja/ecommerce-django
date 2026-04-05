import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (id) => { await API.delete(`/cart/remove/${id}/`); fetchCart(); };
  const updateQty = async (id, qty) => {
    if (qty < 1) return removeItem(id);
    await API.put(`/cart/update/${id}/`, { quantity: qty });
    fetchCart();
  };

  const handleCheckout = async () => {
    if (!form.shipping_address.trim()) { alert('Enter shipping address'); return; }
    setPlacing(true);
    try {
      const res = await API.post('/orders/create/', form);
      const { razorpay_order_id, amount, key, name, email } = res.data;
      const options = {
        key, amount, currency: 'INR',
        name: 'SoleMate', order_id: razorpay_order_id,
        handler: async (response) => {
          await API.post('/orders/verify-payment/', response);
          alert('Payment successful!');
          fetchCart(); setStep('cart');
        },
        prefill: { name, email, contact: form.phone },
        theme: { color: '#e8ff3b' },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(245,245,245,0.3)', letterSpacing: '1px' }}>LOADING...</p>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px' }}>

        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', color: '#e8ff3b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {cart.items.length} items
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '60px', letterSpacing: '2px', color: '#f5f5f5' }}>
            Your Cart
          </h1>
        </div>

        {cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '80px', color: 'rgba(245,245,245,0.05)', marginBottom: '24px' }}>EMPTY</div>
            <p style={{ color: 'rgba(245,245,245,0.3)', marginBottom: '32px' }}>Your cart is waiting</p>
            <Link to="/products" style={{
              display: 'inline-block', background: '#e8ff3b', color: '#0a0a0a',
              padding: '14px 36px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
            }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>

            {/* Left - Items or Checkout form */}
            <div>
              {step === 'cart' ? (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {cart.items.map(item => (
                    <div key={item.id} style={{
                      display: 'grid', gridTemplateColumns: '80px 1fr auto',
                      gap: '20px', alignItems: 'center',
                      padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ background: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
                        <img src={item.product.image || 'https://via.placeholder.com/80/1e1e1e/444'}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                      </div>

                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#f5f5f5', marginBottom: '4px' }}>
                          {item.product.name}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'rgba(245,245,245,0.4)', marginBottom: '16px' }}>
                          ₹{parseFloat(item.product.price).toLocaleString('en-IN')} each
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {[
                            { label: '−', action: () => updateQty(item.id, item.quantity - 1), radius: '6px 0 0 6px' },
                            { label: item.quantity, action: null, radius: '0' },
                            { label: '+', action: () => updateQty(item.id, item.quantity + 1), radius: '0 6px 6px 0' },
                          ].map((btn, i) => (
                            <button key={i} onClick={btn.action}
                              style={{
                                width: btn.action ? '32px' : '40px', height: '32px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderLeft: i === 2 ? 'none' : undefined,
                                borderRight: i === 0 ? 'none' : undefined,
                                borderRadius: btn.radius,
                                color: '#f5f5f5', fontSize: '14px',
                                cursor: btn.action ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>{btn.label}</button>
                          ))}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#f5f5f5', marginBottom: '12px' }}>
                          ₹{parseFloat(item.subtotal).toLocaleString('en-IN')}
                        </p>
                        <button onClick={() => removeItem(item.id)}
                          style={{
                            background: 'none', border: 'none',
                            color: 'rgba(245,245,245,0.2)', fontSize: '12px',
                            cursor: 'pointer', textTransform: 'uppercase',
                          }}
                          onMouseEnter={e => e.target.style.color = '#ff4545'}
                          onMouseLeave={e => e.target.style.color = 'rgba(245,245,245,0.2)'}
                        >Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', letterSpacing: '2px', color: '#f5f5f5', marginBottom: '32px' }}>
                    Delivery Details
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'rgba(245,245,245,0.4)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Full Address *
                      </label>
                      <textarea placeholder="House no., Street, City, State, PIN"
                        value={form.shipping_address}
                        onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                        rows={4} style={{ resize: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'rgba(245,245,245,0.4)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Phone Number
                      </label>
                      <input type="tel" placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <button onClick={() => setStep('cart')} style={{
                    marginTop: '24px', background: 'none', border: 'none',
                    color: 'rgba(245,245,245,0.35)', fontSize: '13px', cursor: 'pointer',
                  }}>← Back to cart</button>
                </div>
              )}
            </div>

            {/* Right - Order Summary */}
            <div style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '28px',
              position: 'sticky', top: '90px',
            }}>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '1px', color: '#f5f5f5', marginBottom: '24px' }}>
                Order Summary
              </h3>

              {cart.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(245,245,245,0.5)', maxWidth: '180px' }}>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ fontSize: '13px', color: '#f5f5f5', fontWeight: '500' }}>
                    ₹{parseFloat(item.subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(245,245,245,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping</span>
                <span style={{ fontSize: '13px', color: '#e8ff3b', fontWeight: '600' }}>Free</span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '12px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
                <span style={{ fontSize: '15px', color: '#f5f5f5', fontWeight: '500' }}>Total</span>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#f5f5f5' }}>
                  ₹{parseFloat(cart.total).toLocaleString('en-IN')}
                </span>
              </div>

              {step === 'cart' ? (
                <button onClick={() => setStep('checkout')} style={{
                  width: '100%', padding: '16px',
                  background: '#e8ff3b', color: '#0a0a0a',
                  border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '700',
                  letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                }}>Continue to Checkout →</button>
              ) : (
                <button onClick={handleCheckout} disabled={placing} style={{
                  width: '100%', padding: '16px',
                  background: '#e8ff3b', color: '#0a0a0a',
                  border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '700',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  cursor: placing ? 'wait' : 'pointer',
                  opacity: placing ? 0.7 : 1,
                }}>
                  {placing ? 'Processing...' : `Pay ₹${parseFloat(cart.total).toLocaleString('en-IN')}`}
                </button>
              )}
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'rgba(245,245,245,0.2)' }}>
                🔒 Secured by Razorpay
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;