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
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>

      <div style={{
        flex: '1.2', background: '#0a0a0a',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '44px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: '#e8ff3b', opacity: '0.06' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: '#e8ff3b', opacity: '0.04' }} />

        <div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#e8ff3b', letterSpacing: '4px' }}>
            SOLE<span style={{ color: '#fff' }}>MATE</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '2px', marginTop: '4px' }}>
            PREMIUM SNEAKERS
          </div>
        </div>

        <div>
          <div style={{ fontSize: '48px', fontWeight: '700', color: '#fff', lineHeight: '1.1', marginBottom: '16px' }}>
            STEP<br /><span style={{ color: '#e8ff3b' }}>INTO</span><br />YOUR<br />STYLE.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            10K+ customers. 500+ drops. Zero fakes.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {[['10K+', 'Customers'], ['500+', 'Products'], ['24/7', 'Support']].map(([num, label]) => (
            <div key={label} style={{ border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
              <div style={{ color: '#e8ff3b', fontSize: '18px', fontWeight: '700' }}>{num}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        flex: '1', background: '#fff',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '48px 40px'
      }}>
        <div style={{ width: '40px', height: '4px', background: '#e8ff3b', borderRadius: '2px', marginBottom: '24px' }} />
        <div style={{ fontSize: '26px', fontWeight: '700', color: '#0a0a0a', marginBottom: '4px' }}>Welcome back</div>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>Login to continue shopping</div>

        {error && <p style={{ color: 'red', marginBottom: '12px', fontSize: '13px' }}>{error}</p>}

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#0a0a0a', letterSpacing: '1px', marginBottom: '8px' }}>USERNAME</div>
          <input
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
            style={{ width: '100%', background: '#f8f8f8', border: '1.5px solid #eee', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#0a0a0a', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#0a0a0a', letterSpacing: '1px', marginBottom: '8px' }}>PASSWORD</div>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={{ width: '100%', background: '#f8f8f8', border: '1.5px solid #eee', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#0a0a0a', outline: 'none' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: '#0a0a0a', color: '#e8ff3b', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer' }}
        >
          {loading ? 'LOADING...' : 'LOGIN'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#888' }}>
          New here? <Link to="/register" style={{ color: '#0a0a0a', fontWeight: '700', textDecoration: 'underline' }}>Create account</Link>
        </p>
      </div>

    </div>
  );
}

export default Login;