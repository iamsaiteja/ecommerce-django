import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("access");
    const username = localStorage.getItem("username");
    if (token) {
      setUser(username || "User");
    } else {
      setUser(null);
    }
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

  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  const linkStyle = (path) => ({
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    color: location.pathname === path ? '#1a1a1a' : '#666',
    textTransform: 'uppercase',
    textDecoration: 'none',
    borderBottom: location.pathname === path ? '2px solid #1a1a1a' : '2px solid transparent',
    paddingBottom: '2px'
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '0 40px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      background: isLoginPage
        ? 'transparent'
        : scrolled
          ? 'rgba(255,255,255,0.98)'
          : '#ffffff',
      backdropFilter: scrolled && !isLoginPage ? 'blur(20px)' : 'none',
      borderBottom: isLoginPage
        ? '1px solid transparent'
        : '1px solid #eee',
      boxShadow: scrolled && !isLoginPage ? '0 2px 20px rgba(0,0,0,0.06)' : 'none'
    }}>

      <Link to="/" style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '26px',
        letterSpacing: '3px',
        color: isLoginPage ? 'transparent' : '#1a1a1a',
        pointerEvents: isLoginPage ? 'none' : 'auto',
        textDecoration: 'none'
      }}>
        SoleMate
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>

        {!isLoginPage && (
          <>
            <Link to="/" style={linkStyle('/')}>Home</Link>
            <Link to="/products" style={linkStyle('/products')}>Products</Link>
          </>
        )}

        {user ? (
          <>
            <Link to="/cart" style={linkStyle('/cart')}>Cart</Link>
            <Link to="/orders" style={linkStyle('/orders')}>Orders</Link>

            {role === "seller" && (
              <Link to="/seller-dashboard" style={linkStyle('/seller-dashboard')}>Seller</Link>
            )}

            <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
              {user}
            </span>

            <button onClick={logout} style={{
              background: '#1a1a1a',
              border: 'none',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        ) : (
          !isLoginPage && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/login" style={linkStyle('/login')}>Login</Link>
              <Link to="/register" style={{
                background: '#1a1a1a',
                color: '#e8ff3b',
                padding: '8px 20px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}>
                Register
              </Link>
            </div>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;