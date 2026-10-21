import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("is_verified");
  sessionStorage.removeItem("admin_pin_verified");
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = ["/login", "/register", "/otp"].some((p) =>
      url.startsWith(p)
    );

    if (
      error.response?.status === 401 &&
      !isAuthCall &&
      !error.config?.skipAuthRedirect
    ) {
      clearSession();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;