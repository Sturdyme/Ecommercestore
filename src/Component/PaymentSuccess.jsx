import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        if (reference) {
            // Optional: Double check payment status with your verify endpoint to show fresh UI data
            axios.get(`http://127.0.0.1:8000/api/payments/verify/${reference}`)
                .then(response => {
                    if (response.data.status === 'success') {
                        setStatus('success');
                    } else {
                        setStatus('failed');
                    }
                })
                .catch(() => setStatus('error'))
                .finally(() => setLoading(false));
        } else {
            setStatus('no_reference');
            setLoading(false);
        }
    }, [reference]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
                <h3>Verifying your payment, please wait...</h3>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                
                {/* Big Green Checkmark */}
                <div style={{ width: '72px', height: '72px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                <h2 style={{ color: '#111827', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>Payment Successful!</h2>
                <p style={{ color: '#6b7280', margin: '0 0 24px 0', fontSize: '15px', lineHeight: '22px' }}>
                    Thank you for your payment. Your transaction was processed successfully.
                </p>

                {/* Reference Code Box */}
                <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '6px', marginBottom: '32px', textAlign: 'left' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Payment Reference</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'monospace', fontWeight: '600', wordBreak: 'break-all' }}>{reference}</span>
                </div>

                <Link to="/dashboard" style={{ display: 'block', background: '#2563eb', color: '#fff', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', transition: 'background 0.2s' }}>
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;