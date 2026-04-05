import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const STATUS = {
  pending:    { color: '#e8a83b', bg: 'rgba(232,168,59,0.1)',  label: 'Pending' },
  processing: { color: '#3b9de8', bg: 'rgba(59,157,232,0.1)',  label: 'Processing' },
  shipped:    { color: '#a83be8', bg: 'rgba(168,59,232,0.1)',  label: 'Shipped' },
  delivered:  { color: '#3be87b', bg: 'rgba(59,232,123,0.1)',  label: 'Delivered' },
  cancelled:  { color: '#e84545', bg: 'rgba(232,69,69,0.1)',   label: 'Cancelled' },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get('/orders/').then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(245,245,245,0.3)', letterSpacing: '1px' }}>LOADING...</p>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 40px' }}>

        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', color: '#e8ff3b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {orders.length} orders
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '60px', letterSpacing: '2px', color: '#f5f5f5' }}>
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '80px', color: 'rgba(245,245,245,0.05)', marginBottom: '24px' }}>
              NO ORDERS YET
            </div>
            <Link to="/products" style={{
              display: 'inline-block', background: '#e8ff3b', color: '#0a0a0a',
              padding: '14px 36px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
            }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(order => {
              const s = STATUS[order.status] || STATUS.pending;
              const open = expanded === order.id;
              return (
                <div key={order.id} style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px', overflow: 'hidden',
                }}>
                  <div onClick={() => setExpanded(open ? null : order.id)}
                    style={{
                      padding: '24px 28px',
                      display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                      gap: '24px', alignItems: 'center', cursor: 'pointer',
                    }}>
                    <div>
                      <p style={{ fontSize: '13px', color: 'rgba(245,245,245,0.35)', marginBottom: '4px' }}>
                        Order #{String(order.id).padStart(4, '0')} · {order.created_at}
                      </p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#f5f5f5' }}>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    <span style={{
                      background: s.bg, color: s.color,
                      fontSize: '11px', fontWeight: '600',
                      padding: '6px 14px', borderRadius: '100px',
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>{s.label}</span>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#f5f5f5' }}>
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                      </p>
                      <p style={{
                        fontSize: '11px', fontWeight: '600',
                        color: order.payment_status === 'paid' ? '#3be87b' : '#e8a83b',
                        textTransform: 'uppercase', marginTop: '2px',
                      }}>{order.payment_status === 'paid' ? '✓ Paid' : 'Pending'}</p>
                    </div>

                    <span style={{
                      color: 'rgba(245,245,245,0.25)', fontSize: '18px',
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>▾</span>
                  </div>

                  {open && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 28px' }}>
                      {order.items.map((item, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <p style={{ fontSize: '14px', color: '#f5f5f5', marginBottom: '2px' }}>{item.product_name}</p>
                            <p style={{ fontSize: '12px', color: 'rgba(245,245,245,0.35)' }}>
                              {item.quantity} × ₹{parseFloat(item.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f5f5f5' }}>
                            ₹{parseFloat(item.subtotal).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                      {order.shipping_address && (
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px 16px', marginTop: '8px' }}>
                          <p style={{ fontSize: '11px', color: 'rgba(245,245,245,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Delivery Address
                          </p>
                          <p style={{ fontSize: '13px', color: 'rgba(245,245,245,0.6)', lineHeight: '1.5' }}>
                            {order.shipping_address}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;