import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../Component/AuthContext";

const EMPTY_OTP = ["", "", "", "", "", ""];

// Turn an API error into a short, safe message for the user.
// Server internals (stack traces, HTML error pages, log hints) are never shown.
const getErrorMessage = (error) => {
  const res = error.response;

  if (!res) {
    return "Cannot reach the server. Check your internet connection and try again.";
  }

  if (res.status === 429) {
    return res.data?.message || "Too many attempts. Please wait a moment and try again.";
  }

  if (res.status < 500) {
    if (typeof res.data?.message === "string") return res.data.message;

    const first = res.data?.errors && Object.values(res.data.errors)[0];
    if (Array.isArray(first) && first[0]) return String(first[0]);
    if (typeof first === "string") return first;
  }

  return "Something went wrong. Please try again.";
};

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, login } = useAuth();
  const inputRefs = useRef([]);

  // The email being verified comes only from the sign-up step (never from a stored user).
  const [email] = useState(
    () => location.state?.email || sessionStorage.getItem("pending_email") || ""
  );
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");

  // Keep the email available if the page is refreshed.
  useEffect(() => {
    if (email) sessionStorage.setItem("pending_email", email);
  }, [email]);

  // Resend countdown.
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const resetCode = () => {
    setOtp(EMPTY_OTP);
    requestAnimationFrame(() => inputRefs.current[0]?.focus());
  };

  // OTP input handling.
  const handleChange = (element, index) => {
    const value = element.value;

    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setErrors({});

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Pasting the whole code fills every box.
  const handlePaste = (event) => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!digits) return;

    const updatedOtp = [...EMPTY_OTP];
    digits.split("").forEach((digit, i) => {
      updatedOtp[i] = digit;
    });

    setOtp(updatedOtp);
    setErrors({});
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  // Verify the code. The account is created by the server only after this succeeds.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const finalOtp = otp.join("");

    if (!/^\d{6}$/.test(finalOtp)) {
      setErrors({
        general: "Please enter the complete 6-digit verification code.",
      });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setInfo("");

      const { data } = await api.post("/otp/verify", {
        email,
        otp: finalOtp,
      });

      sessionStorage.removeItem("pending_email");

      // The session starts only if the server returned a token and a verified user.
      const signedIn =
        typeof data?.token === "string" && data.token && login(data.token, data.user);

      if (!signedIn) {
        toast.success("Email verified. Please log in.");
        navigate("/login", { replace: true });
        return;
      }

      toast.success("Email verified 🎉");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });

      // Wrong or expired code: start over from the first box.
      if (error.response?.status === 422) resetCode();
    } finally {
      setLoading(false);
    }
  };

  // Resend the code.
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;

    try {
      setLoading(true);
      setErrors({});
      setInfo("");

      const response = await api.post("/otp/resend", { email });

      resetCode();
      setCooldown(60);
      setInfo(
        response.data?.message ||
          "A new verification code has been sent to your email."
      );
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    sessionStorage.removeItem("pending_email");
    navigate("/signup", { replace: true });
  };

  // Hooks are all above this point.
  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;
  if (!email) return <Navigate to="/signup" replace />;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 font-sans antialiased sm:px-6">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl sm:h-80 sm:w-80" />

      <main className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Compact brand mark */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/20">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">
            Account security
          </p>

          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Verify your email
          </h1>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500 sm:text-sm">
            Enter the six-digit code we sent to
            <span className="mt-0.5 block break-all font-semibold text-slate-700">
              {email}
            </span>
          </p>
        </div>

        {/* Verification card */}
        <section className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_45px_-18px_rgba(30,64,175,0.22)] backdrop-blur-xl sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p
                id="otp-label"
                className="mb-3 block text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                Verification code
              </p>

              <div
                role="group"
                aria-labelledby="otp-label"
                className="mx-auto flex max-w-[290px] justify-center gap-2 sm:max-w-xs sm:gap-3"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) => handleChange(event.target, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    onPaste={handlePaste}
                    aria-label={`Verification digit ${index + 1}`}
                    disabled={loading}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50/80 text-center text-lg font-bold text-slate-800 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 sm:h-12 sm:rounded-xl sm:text-xl"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.some((digit) => digit === "")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/15 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-600/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Verify and continue
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {errors.general && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-center text-xs leading-5 text-red-700"
            >
              {errors.general}
            </p>
          )}

          {info && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-center text-xs leading-5 text-emerald-700"
            >
              {info}
            </p>
          )}

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-center">
            {cooldown > 0 ? (
              <p className="text-xs text-slate-500">
                Resend available in{" "}
                <span className="font-semibold tabular-nums text-slate-700">
                  {cooldown}s
                </span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Didn't receive your code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="font-semibold text-blue-600 underline-offset-4 transition hover:text-indigo-700 hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              </p>
            )}

            <p className="text-xs text-slate-500">
              Wrong email?{" "}
              <button
                type="button"
                onClick={handleStartOver}
                className="font-semibold text-blue-600 underline-offset-4 transition hover:text-indigo-700 hover:underline"
              >
                Sign up again
              </button>
            </p>
          </div>
        </section>

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-400 sm:text-xs">
          Your account security matters. Never share your verification code.
        </p>
      </main>
    </div>
  );
};

export default VerifyOtp;
