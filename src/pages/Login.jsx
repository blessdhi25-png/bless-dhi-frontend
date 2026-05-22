import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 50%, #0d1b3e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '48px 44px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  logo: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '900',
    color: '#0d1b3e',
    margin: '0 auto 16px',
    fontFamily: 'Georgia, serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Georgia, serif',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '8px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#4a7ff7',
  },
  fieldGroup: {
    marginBottom: '18px',
  },
  pwRow: {
    display: 'flex',
    gap: '8px',
  },
  showBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.6)',
    padding: '0 16px',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontWeight: '600',
    flexShrink: 0,
  },
  errorBox: {
    background: 'rgba(198,40,40,0.15)',
    border: '1px solid rgba(198,40,40,0.4)',
    borderRadius: '8px',
    color: '#ff8a80',
    fontSize: '13px',
    padding: '10px 14px',
    marginBottom: '18px',
    textAlign: 'center',
  },
  primaryBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #1a237e, #2348c0)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s, transform 0.2s',
    letterSpacing: '0.3px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
  },
  line: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  secondaryBtn: {
    width: '100%',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    border: '1.5px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    padding: '13px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const role = data.user.role;
      if      (role === 'client')  navigate('/client');
      else if (role === 'manager') navigate('/manager');
      else if (role === 'admin')   navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed.';
      setError(msg);

      // If needs verification redirect
      if (err.response?.data?.needsVerification) {
        setTimeout(() => {
          navigate('/register', {
            state: {
              userId: err.response.data.userId,
              step:   err.response.data.step
            }
          });
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>B</div>
          <div style={styles.title}>Welcome Back</div>
          <div style={styles.sub}>
            Sign in to Bless Dhi Hostel System
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              style={{
                ...styles.input,
                ...(focused === 'username' ? styles.inputFocus : {})
              }}
              onFocus={() => setFocused('username')}
              onBlur={() => setFocused('')}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.pwRow}>
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  ...styles.input,
                  flex: 1,
                  ...(focused === 'password' ? styles.inputFocus : {})
                }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
              />
              <button
                type="button"
                style={styles.showBtn}
                onClick={() => setShowPw(p => !p)}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.primaryBtn,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.line} />
          <span>or</span>
          <div style={styles.line} />
        </div>

        <Link to="/register" style={styles.secondaryBtn}>
          Create New Account
        </Link>

        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          marginTop: '20px'
        }}>
          Admin: username <strong style={{color:'rgba(255,255,255,0.4)'}}>admin</strong> / password <strong style={{color:'rgba(255,255,255,0.4)'}}>admin123</strong>
        </p>
      </div>
    </div>
  );
}