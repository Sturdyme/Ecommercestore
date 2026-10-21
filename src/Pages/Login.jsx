import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Heart, Lock, Mail, Package, Wallet } from "lucide-react";
import { FaYoast } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../Component/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERKS = [
  { Icon: Wallet, title: "Wallet checkout", text: "Pay from your balance in a single step." },
  { Icon: Package, title: "Order history", text: "Every purchase and its status, in one place." },
  { Icon: Heart, title: "Wishlist", text: "Keep the things you want to come back to." },
];

const inputClass = (hasError, paddingRight) =>
  `peer block w-full rounded-xl border bg-gray-50/70 py-3 pl-11 ${paddingRight} text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-800 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/15 dark:border-gray-700"
  }`;

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const AlertIcon = () => (
  <svg
    className="mt-0.5 h-4 w-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { status, login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Where to go after logging in (set by a guarded route, otherwise the dashboard)
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validateForm()) return;

    const email = formData.email.trim().toLowerCase();

    setLoading(true);
    setErrors({});

    try {
      const { data } = await api.post("/login", {
        email,
        password: formData.password,
      });

      // The session starts only for a verified user with a token
      if (!login(data.token, data.user)) {
        setErrors({ general: "Please verify your email before logging in." });
        return;
      }

      toast.success("Welcome back 🎉");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const res = error.response;

      // Account exists but the email was never verified: the server sent a new code
      if (res?.status === 403 && res.data?.requires_verification) {
        sessionStorage.setItem("pending_email", email);
        toast("We sent a new code to your email.", { icon: "📧" });
        navigate("/verify-otp", { state: { email }, replace: true });
        return;
      }

      if (res?.status === 401) {
        setErrors({ general: "Invalid email or password." });
      } else if (res?.status === 422 && res.data?.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(res.data.errors).map(([field, msgs]) => [
              field,
              Array.isArray(msgs) ? msgs[0] : String(msgs),
            ])
          )
        );
      } else if (res?.status === 429) {
        setErrors({ general: "Too many attempts. Please wait a minute and try again." });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast("Password reset isn't available yet. Please contact support.");
  };

  // Hooks are all above this point. A logged-in user has no business here.
  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to={redirectTo} replace />;

  return (
    <div className="grid flex-1 bg-white dark:bg-gray-900 lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-12 pb-44 text-white lg:flex lg:flex-col xl:p-16 xl:pb-52">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
        />

        <Link to="/" className="relative z-10 flex w-fit items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <FaYoast className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tight">
            YUNA<span className="text-purple-200">VOGUE</span>
          </span>
        </Link>

        <div className="relative z-10 my-auto max-w-md py-12">
          <h2 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">
            Pick up where you left off.
          </h2>
          <p className="mt-4 text-base leading-7 text-purple-100/90">
            Log in to see your wallet balance, your orders and the items you saved.
          </p>

          <ul className="mt-10 space-y-5">
            {PERKS.map(({ Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-sm text-purple-100/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-4 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.22)] xl:text-[13rem]"
        >
          Yuna
        </p>
      </aside>

      {/* Form column */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Compact brand (mobile only) */}
          <Link to="/" className="mb-8 flex w-fit items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/20">
              <FaYoast className="h-5 w-5" />
            </span>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              YUNA<span className="text-purple-600 dark:text-purple-400">VOGUE</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Log in to your Yuna Collective account.
          </p>

          {/* General error */}
          <AnimatePresence initial={false}>
            {errors.general && (
              <motion.div
                role="alert"
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  <AlertIcon />
                  <span>{errors.general}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputClass(errors.email, "pr-4")}
                />
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition peer-focus:text-purple-600 dark:peer-focus:text-purple-400" />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="rounded text-xs font-semibold text-purple-600 transition hover:text-purple-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyUp={(e) => setCapsLock(e.getModifierState?.("CapsLock") ?? false)}
                  onBlur={() => setCapsLock(false)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={inputClass(errors.password, "pr-12")}
                />
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition peer-focus:text-purple-600 dark:peer-focus:text-purple-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {capsLock && (
                <p className="mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Caps Lock is on.
                </p>
              )}
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            New to Yuna Collective?{" "}
            <Link
              to="/signup"
              className="font-semibold text-purple-600 transition hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
