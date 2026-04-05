import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) setUser(username);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const linkStyle = (path) => ({
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    color: location.pathname === path ? '#e8ff3b' : 'rgba(245,245,245,0.65)',
    textTransform: 'uppercase',
  });

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 40px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }}>
      <Link to="/" style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '26px', letterSpacing: '3px', color: '#f5f5f5',
      }}>SoleMate</Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/products" style={linkStyle('/products')}>Products</Link>

        {user ? (
          <>
            <Link to="/cart" style={linkStyle('/cart')}>🛒 Cart</Link>
            <Link to="/orders" style={linkStyle('/orders')}>Orders</Link>
            <span style={{ fontSize: '13px', color: 'rgba(245,245,245,0.35)' }}>{user}</span>
            <button onClick={logout} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(245,245,245,0.6)',
              padding: '7px 16px', borderRadius: '6px',
              fontSize: '12px', fontWeight: '500',
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Logout</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/login" style={linkStyle('/login')}>Login</Link>
            <Link to="/register" style={{
              background: '#e8ff3b', color: '#0a0a0a',
              padding: '8px 20px', borderRadius: '6px',
              fontSize: '12px', fontWeight: '700',
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;