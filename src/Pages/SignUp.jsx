import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const SignUp = () => {

      const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters.";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include letters and numbers.";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const response = await api.post("/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    });

    // ✅ Save token
    localStorage.setItem("token", response.data.token);

    // ✅ Optional: save user
    localStorage.setItem("user", JSON.stringify(response.data.user));

    alert("Signup successful 🎉");

    // ✅ Redirect to home or login
    navigate("/");

  } catch (error) {
    console.error(error.response?.data || error.message);

    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      alert("Something went wrong. Try again.");
    }
  }
};
  
  return (
  
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 shadow-lg dark:text-white px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join <span className="font-semibold text-black">YossyVogue</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg text-black dark:text-dark focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border text-black dark:text-black rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border text-black dark:text-black rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-gray-500"
            >
              {showPassword ?  <BsEye /> : <BsEyeSlash />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border text-black dark:text-black rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="********"
            />
            <button 
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className='absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-gray-500'>
                {showConfirmPassword ? <BsEye /> : <BsEyeSlash />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
         Already have an account?{" "}
           <Link to="/login"> 
          <span href="#" className="text-black font-semibold hover:underline">
            Log in
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp
