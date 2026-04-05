import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products/').then(res => {
      setProducts(res.data.slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const addToCart = async (productId) => {
    if (!localStorage.getItem('access')) {
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart/add/', { product_id: productId, quantity: 1 });
      alert('Added to cart!');
    } catch (e) {
      alert('Failed to add');
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        {/* Yellow glow */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(232,255,59,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingTop: '80px' }}>

          <div className="fade-up" style={{
            display: 'inline-block',
            background: 'rgba(232,255,59,0.1)',
            border: '1px solid rgba(232,255,59,0.2)',
            color: '#e8ff3b',
            fontSize: '11px', fontWeight: '600',
            letterSpacing: '2px', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: '4px',
            marginBottom: '32px',
          }}>New Season — 2026</div>

          <h1 className="fade-up fade-up-1" style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(72px, 12vw, 140px)',
            lineHeight: '0.95', letterSpacing: '2px',
            color: '#f5f5f5', marginBottom: '32px',
          }}>
            STEP INTO<br />
            <span style={{ color: '#e8ff3b' }}>GREATNESS</span>
          </h1>

          <p className="fade-up fade-up-2" style={{
            fontSize: '17px', color: 'rgba(245,245,245,0.5)',
            maxWidth: '440px', lineHeight: '1.7',
            marginBottom: '48px', fontWeight: '300',
          }}>
            Curated kicks for those who move with intention. Premium footwear, delivered.
          </p>

          <div className="fade-up fade-up-3" style={{ display: 'flex', gap: '16px' }}>
            <Link to="/products" style={{
              display: 'inline-block',
              background: '#e8ff3b', color: '#0a0a0a',
              padding: '16px 40px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '700',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>Shop Now</Link>

            <Link to="/products" style={{
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(245,245,245,0.65)',
              padding: '16px 32px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>Explore →</Link>
          </div>

          {/* Stats */}
          <div className="fade-up fade-up-4" style={{
            display: 'flex', gap: '48px',
            marginTop: '80px', paddingTop: '48px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[['10K+', 'Happy Customers'], ['500+', 'Brands'], ['Free', 'Delivery']].map(([num, label]) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '36px', color: '#f5f5f5',
                }}>{num}</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,245,245,0.35)', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section style={{ padding: '80px 40px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#e8ff3b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Handpicked
            </p>
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '52px', letterSpacing: '2px', color: '#f5f5f5',
            }}>Featured Drops</h2>
          </div>
          <Link to="/products" style={{
            fontSize: '13px', color: 'rgba(245,245,245,0.4)',
            borderBottom: '1px solid rgba(245,245,245,0.15)', paddingBottom: '2px',
          }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: '360px', borderRadius: '12px',
                background: 'linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section style={{
        margin: '0 40px 80px',
        background: '#e8ff3b', borderRadius: '16px',
        padding: '64px 80px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '52px', letterSpacing: '2px',
            color: '#0a0a0a', lineHeight: '1', marginBottom: '12px',
          }}>FREE SHIPPING<br />ON ALL ORDERS</h2>
          <p style={{ color: 'rgba(10,10,10,0.55)', fontSize: '15px' }}>No minimum order value.</p>
        </div>
        <Link to="/products" style={{
          background: '#0a0a0a', color: '#e8ff3b',
          padding: '18px 48px', borderRadius: '8px',
          fontSize: '13px', fontWeight: '700',
          letterSpacing: '1px', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Shop Now →</Link>
      </section>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#161616',
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: '12px', overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          cursor: 'pointer',
        }}
      >
        <div style={{ background: '#1e1e1e', height: '220px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={product.image || 'https://via.placeholder.com/400x300/1e1e1e/444?text=No+Image'}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', padding: '16px',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        </div>

        <div style={{ padding: '16px 20px 20px' }}>
          {product.category && (
            <span style={{
              fontSize: '10px', fontWeight: '600', color: '#e8ff3b',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              display: 'block', marginBottom: '6px',
            }}>{product.category}</span>
          )}
          <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#f5f5f5', marginBottom: '12px', lineHeight: '1.4' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#f5f5f5' }}>
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); onAddToCart(product.id); }}
              style={{
                background: '#e8ff3b', color: '#0a0a0a',
                border: 'none', padding: '8px 16px', borderRadius: '6px',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              }}
            >+ Cart</button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Home;