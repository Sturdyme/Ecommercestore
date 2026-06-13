import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error('Failed to parse stored user', err);
    user = {};
  }

  const email = location.state?.email || user.email || '';
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  
  // 💡 FIXED STATE NAME: Changed to match your handleSubmit catch logic perfectly
  const [errors, setErrors] = useState({}); 
  
  const inputRefs = useRef([]);

  // Handle the countdown timer safely
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle typing in the input boxes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input box after typing a digit
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspaces gracefully
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    try {
      setLoading(true);
      // await api.post("/otp/resend", { email });
      setCooldown(60);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return;

    try {
      setLoading(true);
      setErrors({}); // 💡 FIXED: Safely matches state object initializer

      // 1. Send the OTP verification request to Laravel
      const response = await api.post("/otp/verify", {
        email,
        otp: finalOtp,
      });

      // 2. Set the verification flag to unlock ProtectedRoute
      localStorage.setItem("is_verified", "true");

      // 3. REFINE APPROACH: Safely unpack, update, and re-pack the deep user object
      const rawUser = localStorage.getItem("user");
      let userData = rawUser ? JSON.parse(rawUser) : {};

      // Force the parameter to true inside the object profile matrix
      userData.is_verified = true; 
      if (email) userData.email = email; // Fallback to ensure email stays attached

      localStorage.setItem("user", JSON.stringify(userData));

      // 4. Dispatch the custom event to update your Navbar dynamically using the complete profile
      window.dispatchEvent(new CustomEvent('userLogin', { detail: userData }));

      // 5. Alert the user and bounce them straight to the protected dashboard
      alert(response.data.message || "Verified successfully 🎉");
      navigate("/dashboard");

    } catch (error) {
      console.error("Verification Error:", error.response?.data || error.message);

      // 1. Create a safe string fallback default
      let safeMessage = "Something went wrong. Please try again.";

      // 2. Break down the backend payload step-by-step to extract only strings
      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === 'string') {
          safeMessage = data;
        } else if (data.message && typeof data.message === 'string') {
          safeMessage = data.message;
        } else if (data.errors && typeof data.errors === 'object') {
          // If Laravel returns nested validation field arrays (e.g. data.errors.otp[0])
          const firstKey = Object.keys(data.errors)[0];
          if (firstKey && Array.isArray(data.errors[firstKey])) {
            safeMessage = data.errors[firstKey][0];
          } else if (typeof data.errors[firstKey] === 'string') {
            safeMessage = data.errors[firstKey];
          }
        }
      } else if (typeof error.message === 'string') {
        safeMessage = error.message;
      }

      // 3. Save ONLY the text string. This guarantees React won't blow up.
      setErrors({ general: safeMessage });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          We sent a 6-digit verification code to {email || '-'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-sm border border-slate-200/80 sm:rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 6-Digit Flex Row */}
            <div className="flex justify-between gap-2 py-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 transition-all bg-slate-50/50"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.includes("")}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify Identity"}
            </button>
          </form>

          {/* 💡 FIXED: Synced condition check and defensive print block entirely to errors.general */}
          {errors.general && (
            <p className="mt-4 text-sm text-red-600 text-center font-medium">
              {typeof errors.general === 'object'
                ? (errors.general.message || JSON.stringify(errors.general))
                : errors.general
              }
            </p>
          )}

          {/* Cooldown & Resend Footer */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm">
            {cooldown > 0 ? (
              <p className="text-slate-500">
                Resend code in <span className="font-mono font-medium text-slate-700">{cooldown}s</span>
              </p>
            ) : (
              <p className="text-slate-600">
                Didn't get the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="font-semibold text-blue-600 hover:text-blue-700 focus:outline-none transition-colors"
                >
                  Click to resend
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;