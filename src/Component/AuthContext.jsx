import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("is_verified");
  sessionStorage.removeItem("admin_pin_verified");
};

const withProfilePic = (user) => {
  const pic = user?.email ? localStorage.getItem(`profilePic_${user.email}`) : null;
  return pic ? { ...user, profilePic: pic } : user;
};

// Cached copy for older components that still read localStorage.
// Never trusted for access decisions.
const cacheUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("is_verified", "true");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | guest

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setStatus("guest");
    window.dispatchEvent(new Event("userLogout"));
  }, []);

  const login = useCallback((token, backendUser) => {
    if (!token || !backendUser?.is_verified) {
      clearSession();
      setUser(null);
      setStatus("guest");
      return false;
    }
    localStorage.setItem("token", token);
    const full = withProfilePic(backendUser);
    cacheUser(full);
    setUser(full);
    setStatus("authenticated");
    window.dispatchEvent(new CustomEvent("userLogin", { detail: full }));
    return true;
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  // On every page load, ask the backend who this token belongs to
  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("token");

    if (!token) {
      clearSession();
      setStatus("guest");
      return;
    }

    api
      .get("/user", { skipAuthRedirect: true })
      .then(({ data }) => {
        if (cancelled) return;
        const u = data.user ?? data;
        if (!u?.is_verified) return logout();
        const full = withProfilePic(u);
        cacheUser(full);
        setUser(full);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!cancelled) logout();
      });

    return () => {
      cancelled = true;
    };
  }, [logout]);

  // Log out other tabs when the token is removed
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token" && !e.newValue) logout();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout]);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === "authenticated", login, logout, updateUser }),
    [user, status, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);