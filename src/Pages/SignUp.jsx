import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../Component/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 8 to 72 characters (bcrypt ignores anything past 72), with letters and numbers. Symbols are allowed.
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

const inputClass = (hasError) =>
  `mt-1 w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none ${
    hasError ? "border-red-500" : ""
  }`;

const SignUp = () => {
  const navigate = useNavigate();
  const { status } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the message for the field being edited
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters.";
    }

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8 to 72 characters and include letters and numbers.";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validateForm()) return;

    // Same normalized email is sent to the API and carried to the OTP page
    const email = formData.email.trim().toLowerCase();

    setSubmitting(true);
    try {
      await api.post("/register", {
        name: formData.name.trim(),
        email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      // No account exists yet. The only thing kept is the email being verified.
      sessionStorage.setItem("pending_email", email);

      toast.success("We sent a code to your email 📧");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      const res = error.response;

      if (res?.status === 422 && res.data?.errors) {
        // Laravel returns arrays per field; show the first message of each
        setErrors(
          Object.fromEntries(
            Object.entries(res.data.errors).map(([field, msgs]) => [
              field,
              Array.isArray(msgs) ? msgs[0] : String(msgs),
            ])
          )
        );
      } else if (res?.status === 429) {
        toast.error("Too many attempts. Please wait a minute and try again.");
      } else if (res && res.status < 500 && res.data?.message) {
        toast.error(res.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Hooks are all above this point. A logged-in user has no business here.
  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 shadow-lg dark:text-white px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join <span className="font-semibold text-black">Yuna collective</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength={100}
              aria-invalid={Boolean(errors.name)}
              className={inputClass(errors.name)}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={inputClass(errors.email)}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              maxLength={72}
              aria-invalid={Boolean(errors.password)}
              className={inputClass(errors.password)}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-gray-500"
            >
              {showPassword ? <BsEye /> : <BsEyeSlash />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              autoComplete="new-password"
              maxLength={72}
              aria-invalid={Boolean(errors.password_confirmation)}
              className={inputClass(errors.password_confirmation)}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-gray-500"
            >
              {showConfirmPassword ? <BsEye /> : <BsEyeSlash />}
            </button>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
