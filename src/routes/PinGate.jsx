import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import api from "../api";
import { useAuth } from "../Component/AuthContext";

const PIN_LENGTH = 4;

const PinInput = ({ value, onChange, disabled, invalid, label, autoFocus = false, focusOnError = false }) => {
  const refs = useRef([]);
  const digits = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  // After a wrong attempt the boxes are cleared: put the cursor back on the first one.
  useEffect(() => {
    if (focusOnError && invalid && !disabled && value === "") refs.current[0]?.focus();
  }, [focusOnError, invalid, disabled, value]);

  const setDigit = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(""));
  };

  const handleChange = (index, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < PIN_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigit(index - 1, "");
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < PIN_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    refs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-3" role="group" aria-label={label}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`${label}, digit ${index + 1}`}
          className={`h-14 w-12 rounded-xl border bg-gray-50 text-center text-2xl font-bold text-gray-900 outline-none transition focus:bg-white focus:ring-4 disabled:opacity-60 dark:bg-gray-800 dark:text-white ${
            invalid
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
              : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/15 dark:border-gray-700"
          }`}
        />
      ))}
    </div>
  );
};

const primaryButton =
  "w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:transform-none";

// The server decides whether this login is unlocked (see EnsureAdminPinVerified).
// Nothing here is trusted: hiding this screen in the browser would still not open the data.
const PinGate = ({ children }) => {
  const { status } = useAuth();
  const reduceMotion = useReducedMotion();
  const shake = useAnimation();

  const [gate, setGate] = useState("checking"); // checking | setup | locked | open | error
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);

  const locked = waitSeconds > 0;

  const loadStatus = useCallback(async () => {
    setGate("checking");
    try {
      const { data } = await api.get("/admin/pin/status", { skipAuthRedirect: true });
      setGate(data.unlocked ? "open" : data.has_pin ? "locked" : "setup");
    } catch {
      setGate("error");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadStatus();
  }, [status, loadStatus]);

  // The server answered "PIN required" (for example after 30 idle minutes): lock again.
  useEffect(() => {
    window.addEventListener("adminPinRequired", loadStatus);
    return () => window.removeEventListener("adminPinRequired", loadStatus);
  }, [loadStatus]);

  // Countdown after too many wrong attempts.
  useEffect(() => {
    if (waitSeconds <= 0) return;
    const timer = setTimeout(() => setWaitSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [waitSeconds]);

  const fail = async (message) => {
    setError(message);
    setPin("");
    setConfirmPin("");
    if (!reduceMotion) {
      await shake.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.4 } });
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (submitting || locked || pin.length !== PIN_LENGTH) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/admin/pin/verify", { pin }, { skipAuthRedirect: true });
      setPin("");
      setGate("open");
    } catch (err) {
      const res = err.response;

      if (res?.status === 429) {
        setWaitSeconds(res.data?.retry_after || Number(res.headers?.["retry-after"]) || 60);
      }

      await fail(
        res && res.status < 500 && res.data?.message
          ? res.data.message
          : "Could not verify the PIN. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetup = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (pin.length !== PIN_LENGTH) {
      setError(`Choose a ${PIN_LENGTH}-digit PIN.`);
      return;
    }
    if (pin !== confirmPin) {
      await fail("The two PINs do not match.");
      return;
    }
    if (!password) {
      setError("Enter your account password to confirm.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/admin/pin/set", { pin, password }, { skipAuthRedirect: true });
      setPassword("");
      setPin("");
      setConfirmPin("");
      setGate("open");
    } catch (err) {
      const res = err.response;
      const fields = res?.status === 422 ? res.data?.errors : null;

      setPassword("");
      await fail(
        fields?.password?.[0] ||
          fields?.pin?.[0] ||
          (res && res.status < 500 && res.data?.message) ||
          "Could not save the PIN. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (gate === "open") return children;

  const errorBox = error && (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      {error}
      {locked && ` Try again in ${waitSeconds}s.`}
    </p>
  );

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <motion.div animate={shake} className="w-full max-w-sm">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-purple-500/5 dark:border-gray-800 dark:bg-gray-900">
          {gate === "checking" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checking access...</p>
            </div>
          )}

          {gate === "error" && (
            <div className="py-4">
              <h1 className="text-xl font-black text-gray-900 dark:text-white">Couldn't check your access</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Check your connection and try again.
              </p>
              <button type="button" onClick={loadStatus} className={`${primaryButton} mt-6`}>
                Try again
              </button>
            </div>
          )}

          {gate === "locked" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Customer management is locked
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter your {PIN_LENGTH}-digit admin PIN to continue.
              </p>

              <form onSubmit={handleVerify} className="mt-8 space-y-5">
                <PinInput
                  value={pin}
                  onChange={(v) => {
                    setPin(v);
                    setError(null);
                  }}
                  disabled={submitting || locked}
                  invalid={Boolean(error)}
                  label="Admin PIN"
                  autoFocus
                  focusOnError
                />
                {errorBox}
                <button
                  type="submit"
                  disabled={submitting || locked || pin.length !== PIN_LENGTH}
                  className={primaryButton}
                >
                  {submitting ? "Checking..." : locked ? `Locked (${waitSeconds}s)` : "Unlock"}
                </button>
              </form>
            </>
          )}

          {gate === "setup" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Set your admin PIN
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                This PIN protects customer management. You'll enter it whenever you open this area.
              </p>

              <form onSubmit={handleSetup} className="mt-8 space-y-5 text-left">
                <div>
                  <p className="mb-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Choose a {PIN_LENGTH}-digit PIN
                  </p>
                  <PinInput
                    value={pin}
                    onChange={(v) => {
                      setPin(v);
                      setError(null);
                    }}
                    disabled={submitting}
                    invalid={Boolean(error)}
                    label="New PIN"
                    autoFocus
                    focusOnError
                  />
                </div>
                <div>
                  <p className="mb-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Confirm the PIN
                  </p>
                  <PinInput
                    value={confirmPin}
                    onChange={(v) => {
                      setConfirmPin(v);
                      setError(null);
                    }}
                    disabled={submitting}
                    invalid={Boolean(error)}
                    label="Confirm PIN"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pin-account-password"
                    className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Your account password
                  </label>
                  <input
                    id="pin-account-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    autoComplete="current-password"
                    disabled={submitting}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                {errorBox}
                <button
                  type="submit"
                  disabled={submitting || pin.length !== PIN_LENGTH || confirmPin.length !== PIN_LENGTH || !password}
                  className={primaryButton}
                >
                  {submitting ? "Saving..." : "Save PIN"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          Stays unlocked while you're active and locks after 30 idle minutes.
        </p>
      </motion.div>
    </div>
  );
};

export default PinGate;
