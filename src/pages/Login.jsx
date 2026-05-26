import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const BG_IMAGE = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${BG_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(13,27,62,0.92) 0%, rgba(26,47,107,0.85) 50%, rgba(13,27,62,0.7) 100%)',
    zIndex: 1,
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 80px',
    position: 'relative',
    zIndex: 2,
  },
  right: {
    width: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 48px',
    position: 'relative',
    zIndex: 2,
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
  },
  brandLogo: {
    width: 56, height: 56,
    background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
    borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Georgia, serif',
    fontWeight: 900, fontSize: 26, color: '#0d1b3e',
    marginBottom: 24,
  },
  brandName: {
    fontFamily: 'Georgia, serif',
    fontSize: 42, fontWeight: 900,
    color: 'white', lineHeight: 1.1,
    marginBottom: 16,
  },
  brandSub: {
    fontSize: 16, color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.7, maxWidth: 420, marginBottom: 40,
  },
  featureRow: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  feature: {
    display: 'flex', alignItems: 'center', gap: 14,
  },
  featureIcon: {
    width: 40, height: 40,
    background: 'rgba(201,168,76,0.15)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 18,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 13, color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.5,
  },
  featureTitle: {
    fontSize: 14, fontWeight: 700,
    color: 'white', marginBottom: 2,
  },
  formWrap: { width: '100%' },
  formHeader: { textAlign: 'center', marginBottom: 32 },
  formLogo: {
    width: 48, height: 48,
    background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
    borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Georgia, serif',
    fontWeight: 900, fontSize: 22, color: '#0d1b3e',
    margin: '0 auto 14px',
  },
  formTitle: {
    fontSize: 22, fontWeight: 700,
    color: 'white', fontFamily: 'Georgia, serif',
    marginBottom: 4,
  },
  formSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  label: {
    display: 'block', fontSize: 11,
    fontWeight: 700, color: 'rgba(255,255,255,0.6)',
    marginBottom: 7, letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10, padding: '12px 16px',
    fontSize: 14, color: 'white',
    outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  inputFocus: { borderColor: '#4a7ff7' },
  fieldGroup: { marginBottom: 18 },
  pwRow: { display: 'flex', gap: 8 },
  showBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10, color: 'rgba(255,255,255,0.6)',
    padding: '0 16px', fontSize: 12,
    cursor: 'pointer', fontWeight: 600, flexShrink: 0,
  },
  errorBox: {
    background: 'rgba(198,40,40,0.15)',
    border: '1px solid rgba(198,40,40,0.4)',
    borderRadius: 8, color: '#ff8a80',
    fontSize: 12, padding: '10px 14px',
    marginBottom: 16, textAlign: 'center',
  },
  primaryBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
    color: '#0d1b3e', border: 'none',
    borderRadius: 10, padding: '14px',
    fontSize: 15, fontWeight: 800,
    cursor: 'pointer', marginTop: 8,
    transition: 'opacity 0.2s, transform 0.2s',
    letterSpacing: 0.3,
  },
  divider: {
    display: 'flex', alignItems: 'center',
    gap: 12, margin: '18px 0',
    color: 'rgba(255,255,255,0.25)', fontSize: 11,
  },
  line: { flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' },
  secondaryBtn: {
    width: '100%', background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: '1.5px solid rgba(255,255,255,0.15)',
    borderRadius: 10, padding: '12px',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
    textDecoration: 'none', display: 'block',
    textAlign: 'center', boxSizing: 'border-box',
  },
  adminHint: {
    textAlign: 'center', fontSize: 10,
    color: 'rgba(255,255,255,0.2)', marginTop: 16,
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
    setLoading(true); setError('');
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
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Background */}
      <div style={styles.bgImage} />
      <div style={styles.bgOverlay} />

      {/* Left — branding */}
      <div style={styles.left}>
        <div style={styles.brandLogo}>B</div>
        <div style={styles.brandName}>
          Bless Dhi<br />Hostel System
        </div>
        <div style={styles.brandSub}>
          The complete hostel management platform
          for Ghana. Find, book and manage hostels
          all in one place.
        </div>

        <div style={styles.featureRow}>
          {[
            { icon: '🏨', title: 'Browse Hostels',
              text: 'Explore approved hostels with photos, room types and pricing' },
            { icon: '📋', title: 'Easy Booking',
              text: 'Send booking requests and track status in real time' },
            { icon: '💬', title: 'Direct Messaging',
              text: 'Chat directly with hostel managers before you book' },
            { icon: '🔐', title: 'Secure & Verified',
              text: 'Email verification and secure authentication for all users' },
          ].map(f => (
            <div key={f.title} style={styles.feature}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div>
                <div style={styles.featureTitle}>{f.title}</div>
                <div style={styles.featureText}>{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div style={styles.right}>
        <div style={styles.formWrap}>
          <div style={styles.formHeader}>
            <div style={styles.formLogo}>B</div>
            <div style={styles.formTitle}>Welcome Back</div>
            <div style={styles.formSub}>
              Sign in to your account
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                name="username" value={form.username}
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
                    ...styles.input, flex: 1,
                    ...(focused === 'password' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
                <button type="button" style={styles.showBtn}
                  onClick={() => setShowPw(p => !p)}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit"
              style={{
                ...styles.primaryBtn,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.line} /><span>or</span>
            <div style={styles.line} />
          </div>

          <Link to="/register" style={styles.secondaryBtn}>
            Create New Account
          </Link>

          <div style={styles.adminHint}>
            Admin: <strong>admin</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}