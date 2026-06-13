import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Initialize state dynamically from localStorage
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isVerified: localStorage.getItem('is_verified') === 'true'
  });

  useEffect(() => {
    // 2. Define a sync function to pull fresh data when updates happen
    const syncAuth = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        isVerified: localStorage.getItem('is_verified') === 'true'
      });
    };

    // 3. Listen to the custom event you dispatched in Login and VerifyOtp
    window.addEventListener('userLogin', syncAuth);
    
    // Fallback: Also listen to native storage changes (good for multi-tab support)
    window.addEventListener('storage', syncAuth);

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('userLogin', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  // 4. Run your evaluation guards against the reactive state instead of static storage
  if (!authState.token) {
    return <Navigate to="/login" replace />;
  }

  if (!authState.isVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  // 5. Render children (Dashboard) cleanly once verified
  return children;
};

export default ProtectedRoute;