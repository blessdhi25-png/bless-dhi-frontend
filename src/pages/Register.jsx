import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api';

// ── Shared styles ──────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 50%, #0d1b3e 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif", padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '44px 44px',
    width: '100%', maxWidth: '480px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  logo: {
    width: '48px', height: '48px',
    background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: '900', color: '#0d1b3e',
    margin: '0 auto 14px', fontFamily: 'Georgia, serif',
  },
  title: {
    fontSize: '22px', fontWeight: '700', color: 'white',
    fontFamily: 'Georgia, serif', marginBottom: '4px',
    textAlign: 'center',
  },
  sub: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '28px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: 'rgba(255,255,255,0.7)', marginBottom: '7px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', padding: '11px 14px',
    fontSize: '13px', color: 'white', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  inputFocus: { borderColor: '#4a7ff7' },
  inputError: { borderColor: 'rgba(198,40,40,0.6)' },
  row: { marginBottom: '14px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  select: {
    width: '100%', background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', padding: '11px 14px',
    fontSize: '13px', color: 'white', outline: 'none',
    boxSizing: 'border-box', cursor: 'pointer',
  },
  errorBox: {
    background: 'rgba(198,40,40,0.15)',
    border: '1px solid rgba(198,40,40,0.4)',
    borderRadius: '8px', color: '#ff8a80',
    fontSize: '12px', padding: '10px 14px',
    marginBottom: '16px', textAlign: 'center',
  },
  successBox: {
    background: 'rgba(46,125,50,0.15)',
    border: '1px solid rgba(46,125,50,0.4)',
    borderRadius: '8px', color: '#a5d6a7',
    fontSize: '12px', padding: '10px 14px',
    marginBottom: '16px', textAlign: 'center',
  },
  primaryBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #1a237e, #2348c0)',
    color: 'white', border: 'none', borderRadius: '10px',
    padding: '13px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', marginTop: '8px',
    transition: 'opacity 0.2s', letterSpacing: '0.3px',
  },
  secondaryBtn: {
    width: '100%', background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: '1.5px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', padding: '12px',
    fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', marginTop: '10px',
  },
  pwRow: { display: 'flex', gap: '8px' },
  showBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', color: 'rgba(255,255,255,0.6)',
    padding: '0 14px', fontSize: '11px', cursor: 'pointer',
    fontWeight: '600', flexShrink: 0,
  },
  stepRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', marginBottom: '24px',
  },
  step: (active, done) => ({
    padding: '5px 14px', borderRadius: '100px',
    fontSize: '11px', fontWeight: '700',
    letterSpacing: '0.5px',
    background: done  ? 'rgba(46,125,50,0.3)'
               : active ? '#1a237e'
               : 'rgba(255,255,255,0.07)',
    color: done ? '#a5d6a7' : active ? 'white' : 'rgba(255,255,255,0.3)',
    border: done  ? '1px solid rgba(46,125,50,0.4)'
          : active ? '1px solid rgba(74,127,247,0.5)'
          : '1px solid transparent',
  }),
  arrow: { color: 'rgba(255,255,255,0.2)', fontSize: '12px' },
  codeInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '2px solid rgba(74,127,247,0.4)',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#90b4ff',
    textAlign: 'center',
    letterSpacing: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  timerText: {
    fontSize: '12px', color: '#e65100',
    textAlign: 'center', fontWeight: '600',
    marginBottom: '14px',
  },
};

// ── Step indicator ─────────────────────────────────
function StepBar({ step }) {
  return (
    <div style={S.stepRow}>
      <span style={S.step(step === 'form', false)}>1 Details</span>
      <span style={S.arrow}>›</span>
      <span style={S.step(step === 'verify_email', step === 'verify_phone' || step === 'complete')}>
        2 Email
      </span>
      <span style={S.arrow}>›</span>
      <span style={S.step(step === 'verify_phone', step === 'complete')}>3 Phone</span>
      <span style={S.arrow}>›</span>
      <span style={S.step(step === 'complete', false)}>4 Done</span>
    </div>
  );
}

// ── OTP Input ──────────────────────────────────────
function OTPPanel({ step, userId, onSuccess, onBack }) {
  const [code, setCode]       = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(600);
  const timerRef = useRef(null);

  useEffect(() => {
    setCode(''); setError(''); setSeconds(600);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const verify = async () => {
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    if (seconds <= 0) {
      setError('Code expired. Please resend.');
      return;
    }
    setLoading(true); setError('');
    try {
      const endpoint = step === 'verify_email'
        ? '/auth/verify-email'
        : '/auth/verify-phone';
      const { data } = await api.post(endpoint, { userId, code });
      setSuccess(data.message);
      setTimeout(() => onSuccess(data), 600);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      const type = step === 'verify_email' ? 'email' : 'phone';
      await api.post('/auth/resend-otp', { userId, type });
      setSeconds(600); setError('');
      setSuccess('New code sent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Resend failed');
    }
  };

  const isEmail = step === 'verify_email';

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(74,127,247,0.15)',
          border: '1px solid rgba(74,127,247,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', margin: '0 auto 14px',
        }}>
          {isEmail ? '✉' : '📱'}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
          {isEmail ? 'Verify Your Email' : 'Verify Your Phone'}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          A 6-digit code has been sent.
          {!isEmail && <><br />Check your backend console for the SMS code.</>}
        </div>
      </div>

      {error   && <div style={S.errorBox}>{error}</div>}
      {success && <div style={S.successBox}>{success}</div>}

      <input
        style={S.codeInput}
        value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
        placeholder="000000"
        maxLength={6}
        inputMode="numeric"
        onKeyDown={e => e.key === 'Enter' && verify()}
      />

      <div style={S.timerText}>
        {seconds > 0
          ? `Code expires in ${fmt(seconds)}`
          : 'Code expired — click Resend'}
      </div>

      <button
        style={{ ...S.primaryBtn, opacity: loading ? 0.7 : 1 }}
        onClick={verify}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: '14px',
      }}>
        <button style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.4)', fontSize: '12px',
          cursor: 'pointer',
        }} onClick={onBack}>
          Back
        </button>
        <button style={{
          background: 'none', border: 'none',
          color: seconds <= 0 ? '#90b4ff' : 'rgba(255,255,255,0.3)',
          fontSize: '12px', cursor: seconds <= 0 ? 'pointer' : 'default',
          fontWeight: '600',
        }} onClick={seconds <= 0 ? resend : undefined}>
          Resend Code
        </button>
      </div>
    </div>
  );
}

// ── Main Register component ────────────────────────
export default function Register() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [step, setStep]     = useState(
    location.state?.step || 'form'
  );
  const [userId, setUserId] = useState(
    location.state?.userId || null
  );
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '', username: '', email: '',
    phone: '', password: '', confirm: '',
    role: 'client',
  });

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const { fullName, username, email, phone, password, confirm } = form;
    if (!fullName || !username || !email || !phone ||
        !password || !confirm)
      return 'All fields are required.';
    if (fullName.length < 3)
      return 'Full name must be at least 3 characters.';
    if (username.length < 3)
      return 'Username must be at least 3 characters.';
    if (!/^[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}$/.test(email))
      return 'Invalid email format.';
    if (!/^\+?[0-9]{7,15}$/.test(phone))
      return 'Invalid phone number (7–15 digits, e.g. +233244123456).';
    if (password.length < 6)
      return 'Password must be at least 6 characters.';
    if (password !== confirm)
      return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', {
        fullName:  form.fullName,
        username:  form.username,
        email:     form.email,
        phone:     form.phone,
        password:  form.password,
        role:      form.role,
      });
      setUserId(data.userId);
      setStep('verify_email');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySuccess = data => {
    if (data.step === 'verify_phone') {
      setStep('verify_phone');
    } else if (data.step === 'complete') {
      setStep('complete');
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  const focused = useRef('');
  const [foc, setFoc] = useState('');
  const fi = name => ({
    ...S.input,
    ...(foc === name ? S.inputFocus : {}),
  });

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.card}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={S.logo}>B</div>
          <div style={S.title}>Create Account</div>
          <div style={S.sub}>Bless Dhi Hostel System</div>
        </div>

        <StepBar step={step} />

        {/* ── FORM STEP ── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            {error && <div style={S.errorBox}>{error}</div>}

            <div style={S.twoCol}>
              <div style={S.row}>
                <label style={S.label}>Full Name *</label>
                <input name="fullName" value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={fi('fullName')}
                  onFocus={() => setFoc('fullName')}
                  onBlur={() => setFoc('')} />
              </div>
              <div style={S.row}>
                <label style={S.label}>Username *</label>
                <input name="username" value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  style={fi('username')}
                  onFocus={() => setFoc('username')}
                  onBlur={() => setFoc('')} />
              </div>
            </div>

            <div style={S.row}>
              <label style={S.label}>Email Address *</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange}
                placeholder="john@email.com"
                style={fi('email')}
                onFocus={() => setFoc('email')}
                onBlur={() => setFoc('')} />
            </div>

            <div style={S.row}>
              <label style={S.label}>Phone Number *</label>
              <input name="phone" value={form.phone}
                onChange={handleChange}
                placeholder="+233244123456"
                style={fi('phone')}
                onFocus={() => setFoc('phone')}
                onBlur={() => setFoc('')} />
            </div>

            <div style={S.row}>
              <label style={S.label}>Password *</label>
              <div style={S.pwRow}>
                <input name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  style={{ ...fi('password'), flex: 1 }}
                  onFocus={() => setFoc('password')}
                  onBlur={() => setFoc('')} />
                <button type="button" style={S.showBtn}
                  onClick={() => setShowPw(p => !p)}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div style={S.row}>
              <label style={S.label}>Confirm Password *</label>
              <input name="confirm"
                type={showPw ? 'text' : 'password'}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Re-enter password"
                style={fi('confirm')}
                onFocus={() => setFoc('confirm')}
                onBlur={() => setFoc('')} />
            </div>

            <div style={S.row}>
              <label style={S.label}>Register As *</label>
              <select name="role" value={form.role}
                onChange={handleChange} style={S.select}>
                <option value="client">Client</option>
                <option value="manager">Hostel Manager</option>
              </select>
            </div>

            <button type="submit"
              style={{ ...S.primaryBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? 'Creating Account...' : 'Next: Verify Email'}
            </button>

            <Link to="/login" style={{
              ...S.secondaryBtn,
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              marginTop: '10px',
            }}>
              Already have an account? Sign In
            </Link>
          </form>
        )}

        {/* ── VERIFY STEPS ── */}
        {(step === 'verify_email'  || step === 'verify_phone') && (
          <OTPPanel
            step={step}
            userId={userId}
            onSuccess={handleVerifySuccess}
            onBack={() => setStep('form')}
          />
        )}

        {/* ── COMPLETE ── */}
        {step === 'complete' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: 'rgba(46,125,50,0.2)',
              border: '2px solid rgba(46,125,50,0.5)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px', margin: '0 auto 20px',
            }}>
              ✓
            </div>
            <div style={{
              fontSize: '20px', fontWeight: '700',
              color: 'white', marginBottom: '10px',
              fontFamily: 'Georgia, serif',
            }}>
              Account Created!
            </div>
            <div style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7, marginBottom: '24px',
            }}>
              Your email and phone have been verified.<br />
              Redirecting you to login...
            </div>
            <Link to="/login" style={{
              ...S.primaryBtn,
              display: 'inline-block',
              textDecoration: 'none',
              padding: '12px 32px',
              width: 'auto',
            }}>
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}