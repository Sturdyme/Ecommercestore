
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");

  // Recover the email safely if the page is refreshed.
  useEffect(() => {
    if (email) return;

    try {
      const storedUser = localStorage.getItem("user");

      if (
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && typeof parsedUser.email === "string") {
          setEmail(parsedUser.email);
        }
      }
    } catch (error) {
      console.error("Could not read stored user:", error);
    }
  }, [email]);

  // Resend countdown.
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

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
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Safely extract a readable message from API errors.
  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (data?.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0];
      const firstError = data.errors[firstKey];

      if (Array.isArray(firstError) && firstError.length > 0) {
        return String(firstError[0]);
      }

      if (typeof firstError === "string") {
        return firstError;
      }
    }

    if (typeof data === "string") {
      // Avoid displaying a full HTML error page.
      return data.trim().startsWith("<")
        ? "The server returned an error page. Check the Laravel logs."
        : data.slice(0, 250);
    }

    if (error.message === "Network Error") {
      return "Cannot connect to the server. Check that Laravel is running.";
    }

    return error.message || "Something went wrong. Please try again.";
  };

  // Verify OTP and establish the authenticated session.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalOtp = otp.join("");

    if (!email) {
      setErrors({
        general: "Your email is missing. Please return to registration.",
      });
      return;
    }

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

      const response = await api.post("/otp/verify", {
        email,
        otp: finalOtp,
      });

      console.log("OTP verification status:", response.status);
      console.log("OTP verification response:", response.data);

      const data = response.data;

      // Do not treat an unexpected response as successful verification.
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("The server returned an unexpected response.");
      }

      // This endpoint should return a token after successful verification.
      if (typeof data.token !== "string" || !data.token) {
        console.error(
          "Verification response did not contain a token:",
          data
        );

        throw new Error(
          "OTP verification response did not include an authentication token. Check your Laravel controller."
        );
      }

      // Recover any existing profile without allowing invalid JSON to crash.
      let previousUser = {};

      try {
        const rawUser = localStorage.getItem("user");

        if (
          rawUser &&
          rawUser !== "undefined" &&
          rawUser !== "null"
        ) {
          const parsedUser = JSON.parse(rawUser);

          if (
            parsedUser &&
            typeof parsedUser === "object" &&
            !Array.isArray(parsedUser)
          ) {
            previousUser = parsedUser;
          }
        }
      } catch (error) {
        console.warn("Ignoring invalid stored user data:", error);
      }

      const returnedUser =
        data.user &&
        typeof data.user === "object" &&
        !Array.isArray(data.user)
          ? data.user
          : {};

      const userData = {
        ...previousUser,
        ...returnedUser,
        email: returnedUser.email || email,
        is_verified: true,
      };

      // Persist authentication only after the server confirms success.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("is_verified", "true");

      window.dispatchEvent(
        new CustomEvent("userLogin", {
          detail: userData,
        })
      );

      setInfo(data.message || "Email verified successfully.");

      // Redirect after saving the authenticated session.
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("OTP verification failed:", {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });

      setErrors({
        general: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP.
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;

    if (!email) {
      setErrors({ general: "Your email address is missing." });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setInfo("");

      const response = await api.post("/otp/resend", { email });

      setOtp(["", "", "", "", "", ""]);
      setCooldown(60);
      setInfo(
        response.data?.message ||
          "A new verification code has been sent to your email."
      );

      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("OTP resend failed:", {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });

      setErrors({ general: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };


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
            {email || "your email address"}
          </span>
        </p>
      </div>

      {/* Verification card */}
      <section className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_45px_-18px_rgba(30,64,175,0.22)] backdrop-blur-xl sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-3 block text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Verification code
            </label>

            <div className="mx-auto flex max-w-[290px] justify-center gap-2 sm:max-w-xs sm:gap-3">
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
                  onChange={(event) =>
                    handleChange(event.target, index)
                  }
                  onKeyDown={(event) => handleKeyDown(event, index)}
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

        <div className="mt-5 border-t border-slate-100 pt-4 text-center">
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
