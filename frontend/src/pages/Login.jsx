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
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login/', form);

      // ✅ SAVE TOKENS
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('username', res.data.user.username);

      // ✅ REDIRECT (NO RELOAD)
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        <Link to="/" style={{
          fontSize: '22px',
          letterSpacing: '3px',
          color: '#f5f5f5',
          display: 'block',
          marginBottom: '32px',
        }}>
          SoleMate
        </Link>

        <h1 style={{
          fontSize: '32px',
          color: '#f5f5f5',
          marginBottom: '8px',
        }}>
          Welcome Back
        </h1>

        <p style={{
          fontSize: '14px',
          color: 'rgba(245,245,245,0.35)',
          marginBottom: '30px'
        }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: 'rgba(255,69,69,0.08)',
            border: '1px solid rgba(255,69,69,0.2)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '20px',
            color: '#ff4545',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '6px'
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '6px'
            }}
          />

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '12px',
            background: '#e8ff3b',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* ✅ GOOGLE LOGIN */}
        <a
          href="https://solemate.servecounterstrike.com/accounts/google/login/"
          style={{
            display: 'block',
            marginTop: '15px',
            padding: '10px',
            background: '#4285f4',
            color: 'white',
            textAlign: 'center',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Login with Google
        </a>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#aaa'
        }}>
          New user? <Link to="/register" style={{ color: '#e8ff3b' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;