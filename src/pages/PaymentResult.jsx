import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function PaymentResult() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const [status, setStatus]   = useState('verifying');
  const [result, setResult]   = useState(null);
  const [error,  setError]    = useState('');

  useEffect(() => {
    const ref      = params.get('ref');
    const provider = params.get('provider');

    if (!ref || !provider) {
      setStatus('error');
      setError('Invalid payment reference.');
      return;
    }

    api.post('/payment/verify', { reference: ref, provider })
      .then(({ data }) => {
        setResult(data);
        setStatus(data.success ? 'success' : 'failed');
      })
      .catch(err => {
        setError(
          err.response?.data?.error || 'Verification failed.'
        );
        setStatus('error');
      });
  }, []);

  const C = {
    navy: '#0d1b3e', green: '#2e7d32',
    danger: '#c62828', gray: '#64748b',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0d1b3e,#1a2f6b)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif", padding: 20,
    }}>
      <div style={{
        background: 'white', borderRadius: 20,
        padding: '48px 44px', maxWidth: 440,
        width: '100%', textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
      }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              ⏳
            </div>
            <div style={{
              fontSize: 20, fontWeight: 700,
              color: C.navy, marginBottom: 8,
            }}>
              Verifying Payment...
            </div>
            <div style={{ fontSize: 13, color: C.gray }}>
              Please wait while we confirm your payment.
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#e8f5e9',
              border: '2px solid #a5d6a7',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36, margin: '0 auto 20px',
            }}>
              ✓
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700,
              color: C.green, marginBottom: 8,
              fontFamily: 'Georgia,serif',
            }}>
              Payment Successful!
            </div>
            <div style={{
              fontSize: 13, color: C.gray,
              lineHeight: 1.7, marginBottom: 8,
            }}>
              Your booking has been confirmed and paid.
            </div>
            {result && (
              <div style={{
                background: '#f8faff',
                border: '1px solid #e2e8f0',
                borderRadius: 10, padding: '14px 18px',
                marginBottom: 24, textAlign: 'left',
              }}>
                <div style={{
                  fontSize: 12, color: C.gray,
                  marginBottom: 4,
                }}>
                  Amount Paid
                </div>
                <div style={{
                  fontSize: 24, fontWeight: 800,
                  color: C.green,
                }}>
                  {result.currency}{' '}
                  {Number(result.amount).toFixed(2)}
                </div>
                <div style={{
                  fontSize: 11, color: '#b0bec5', marginTop: 4,
                }}>
                  Ref: {result.reference}
                </div>
              </div>
            )}
            <Link to="/client" style={{
              display: 'block',
              background: C.green, color: 'white',
              borderRadius: 10, padding: '14px',
              textDecoration: 'none', fontWeight: 700,
              fontSize: 14,
            }}>
              Back to Dashboard
            </Link>
          </>
        )}

        {(status === 'failed' || status === 'error') && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#ffebee',
              border: '2px solid #ef9a9a',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36, margin: '0 auto 20px',
            }}>
              ✕
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700,
              color: C.danger, marginBottom: 8,
              fontFamily: 'Georgia,serif',
            }}>
              Payment {status === 'error'
                ? 'Error' : 'Unsuccessful'}
            </div>
            <div style={{
              fontSize: 13, color: C.gray,
              lineHeight: 1.7, marginBottom: 24,
            }}>
              {error || 'Your payment was not completed.'}
            </div>
            <Link to="/client" style={{
              display: 'block',
              background: C.navy, color: 'white',
              borderRadius: 10, padding: '14px',
              textDecoration: 'none', fontWeight: 700,
              fontSize: 14,
            }}>
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}