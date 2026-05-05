import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (id) => {
    await API.delete(`/cart/remove/${id}/`);
    fetchCart();
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return removeItem(id);
    await API.patch(`/cart/update/${id}/`, { quantity: qty });
    fetchCart();
  };

  const handleCheckout = async () => {
    if (!form.shipping_address.trim()) {
      alert('Enter shipping address');
      return;
    }

    setPlacing(true);

    try {
      const res = await API.post('/orders/create/', form);

      const { razorpay_order_id, amount, key, name, email } = res.data;

      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'SoleMate',
        order_id: razorpay_order_id,
        handler: async (response) => {
          await API.post('/orders/verify-payment/', response);
          alert('Payment successful!');
          fetchCart();
          setStep('cart');
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

  if (loading) {
    return <p style={{ color: 'white' }}>Loading...</p>;
  }

  return (
    <div>
      <h1>Cart</h1>

      {cart.items.length === 0 ? (
        <p>Cart empty</p>
      ) : (
        cart.items.map(item => (
          <div key={item.id}>
            <img
              src={getImage(item.product.image)}
              alt={item.product.name}
              width="100"
            />

            <p>{item.product.name}</p>
            <p>₹{item.product.price}</p>

            <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>

            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))
      )}

      <h2>Total: ₹{cart.total}</h2>

      <button onClick={() => setStep('checkout')}>
        Checkout
      </button>

      {step === 'checkout' && (
        <div>
          <input
            placeholder="Address"
            value={form.shipping_address}
            onChange={e => setForm({ ...form, shipping_address: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <button onClick={handleCheckout}>
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;