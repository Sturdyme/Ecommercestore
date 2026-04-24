import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import api from "../api"; // Assuming your axios instance is here

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // To capture backend errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // 1. Send the login request to Laravel
      const response = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      // 2. Save token and user data to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 3. Success notification & Redirect
      alert("Login successful 🎉");
      navigate("/dashboard"); // Redirect to dashboard

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      // Handle 401 (Invalid Credentials) or 422 (Validation errors)
      if (error.response?.status === 401) {
        setErrors({ general: "Invalid email or password." });
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6">
          Login to <span className="font-semibold text-purple-600">YossyVogue</span>
        </p>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className={`mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.email ? 'border-red-500' : 'focus:ring-purple-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none pr-12 ${
                  errors.password ? 'border-red-500' : 'focus:ring-purple-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup"> 
            <span className="text-purple-600 font-semibold cursor-pointer hover:underline">
              Create one
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;