import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await API.post('/auth/login/', form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('username', res.data.user.username);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div className="fade-up" style={{
        width: '100%', maxWidth: '420px',
        background: '#111', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', padding: '48px 40px', position: 'relative', zIndex: 1,
      }}>
        <Link to="/" style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px',
          letterSpacing: '3px', color: '#f5f5f5', display: 'block', marginBottom: '32px',
        }}>SoleMate</Link>

        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px',
          letterSpacing: '2px', color: '#f5f5f5', marginBottom: '8px',
        }}>Welcome Back</h1>
        <p style={{ fontSize: '14px', color: 'rgba(245,245,245,0.35)', marginBottom: '36px' }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: 'rgba(255,69,69,0.08)', border: '1px solid rgba(255,69,69,0.2)',
            borderRadius: '8px', padding: '12px 16px', marginBottom: '24px',
            fontSize: '13px', color: '#ff4545',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(245,245,245,0.35)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Username
            </label>
            <input type="text" placeholder="your_username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(245,245,245,0.35)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px',
            background: '#e8ff3b', color: '#0a0a0a',
            border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '1px', textTransform: 'uppercase',
            cursor: loading ? 'wait' : 'pointer',
            marginBottom: '24px', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <a 
          href="https://solemate.servecounterstrike.com/accounts/google/login/"
          style={{
            display:'block',
            background:'#4285f4',
            color:'white',
            padding:'12px',
            borderRadius:'8px',
            textDecoration:'none',
            textAlign:'center',
            marginTop:'12px',
            fontWeight:'700'
          }}
        >
          🔵 Login with Google
      </a>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(245,245,245,0.3)' }}>
          New here?{' '}
          <Link to="/register" style={{ color: '#e8ff3b', fontWeight: '500' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;