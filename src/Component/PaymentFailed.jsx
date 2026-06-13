import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                
                {/* Big Red Error Cross Circle */}
                <div style={{ width: '72px', height: '72px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>

                <h2 style={{ color: '#111827', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>Payment Failed</h2>
                <p style={{ color: '#6b7280', margin: '0 0 24px 0', fontSize: '15px', lineheight: '22px' }}>
                    We couldn't process your transaction. This might be due to insufficient funds, an incorrect card pin, or a temporary network glitch with the bank.
                </p>

                {/* Optional Reference Box (Only shows up if Paystack passed a token before dropping out) */}
                {reference && (
                    <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '32px', textAlign: 'left', border: '1px solid #f3f4f6' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Transaction Reference</span>
                        <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'monospace', fontWeight: '600', wordBreak: 'break-all' }}>{reference}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link to="/checkout" style={{ display: 'block', background: '#ef4444', color: '#fff', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', transition: 'background 0.2s' }}>
                        Try Again
                    </Link>
                    
                    <Link to="/" style={{ display: 'block', color: '#4b5563', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;