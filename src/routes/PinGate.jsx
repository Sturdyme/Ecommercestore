// src/routes/PinGate.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const PinGate = ({ children }) => {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem("admin_pin_verified") === "true"
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      sessionStorage.removeItem("admin_pin_verified");
      setUnlocked(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/pin/verify`,
        { pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sessionStorage.setItem("admin_pin_verified", "true");
      setUnlocked(true);
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect PIN.");
      setPin("");
    } finally {
      setSubmitting(false);
    }
  };

  if (unlocked) return children;

  return (
    <div className="max-w-sm mx-auto px-6 py-32 text-center">
      <h2 className="text-xl font-black dark:text-white mb-2">Admin Access Locked</h2>
      <p className="text-sm text-gray-400 mb-6">Enter your PIN to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          autoFocus
          className="w-full text-center text-2xl tracking-[1em] border rounded-xl py-3 dark:bg-gray-800 dark:text-white"
          placeholder="••••"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || pin.length !== 4}
          className="w-full bg-gray-900 dark:bg-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-50"
        >
          {submitting ? "Checking..." : "Unlock"}
        </button>
      </form>
    </div>
  );
};

export default PinGate;