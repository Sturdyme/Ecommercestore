import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Bell,
  Camera,
  Download,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../Component/AuthContext";

const TABS = [
  { id: "personal", label: "Personal info", Icon: User },
  { id: "security", label: "Password", Icon: Lock },
  { id: "addresses", label: "Address", Icon: MapPin },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "privacy", label: "Privacy & data", Icon: ShieldCheck },
  { id: "danger", label: "Danger zone", Icon: ShieldAlert },
];

const NOTIFICATION_ITEMS = [
  { key: "orderUpdates", label: "Order updates", description: "Shipping and delivery emails.", fallback: true },
  { key: "promotions", label: "Promotions & discounts", description: "Sales, new arrivals and limited-time offers.", fallback: false },
  { key: "newsletter", label: "Newsletter", description: "Occasional style guides and store news.", fallback: false },
  { key: "smsAlerts", label: "SMS alerts", description: "Text messages for time-sensitive order updates.", fallback: false },
];

const PRIVACY_ITEMS = [
  { key: "shareActivity", label: "Share activity for recommendations", description: "Lets us suggest products based on your browsing and past orders.", fallback: false },
  { key: "personalizedAds", label: "Personalized ads", description: "Show ads based on your shopping activity on this site.", fallback: true },
];

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

const STRENGTH = [
  { label: "Too weak", bar: "bg-red-500" },
  { label: "Weak", bar: "bg-red-500" },
  { label: "Fair", bar: "bg-amber-500" },
  { label: "Good", bar: "bg-emerald-500" },
  { label: "Strong", bar: "bg-emerald-600" },
];

const strengthOf = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

// Turns an API error into field messages plus one safe sentence for a toast.
const readError = (error, fallback) => {
  const res = error.response;
  const data = res?.data;

  if (res?.status === 422 && data?.errors) {
    return {
      fields: Object.fromEntries(
        Object.entries(data.errors).map(([field, msgs]) => [field, Array.isArray(msgs) ? msgs[0] : String(msgs)])
      ),
      message: data.message || fallback,
    };
  }

  return { fields: {}, message: res && res.status < 500 && data?.message ? data.message : fallback };
};

// Square-crops and shrinks a photo so it is small enough to keep on this device.
const resizeImage = (file, size = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas
          .getContext("2d")
          .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/* ---------- small building blocks ---------- */

const Card = ({ title, description, children }) => (
  <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 sm:p-8">
    <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">{title}</h2>
    {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    <div className="mt-6">{children}</div>
  </section>
);

const Field = ({ label, error, hint, icon: Icon, trailing, className = "", ...props }) => (
  <div className={className}>
    <label htmlFor={props.id} className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      )}
      <input
        {...props}
        aria-invalid={Boolean(error)}
        className={`block w-full rounded-xl border bg-white py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-900 dark:text-white dark:disabled:bg-gray-900/50 ${
          Icon ? "pl-10" : "pl-3.5"
        } ${trailing ? "pr-11" : "pr-3.5"} ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
            : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/15 dark:border-gray-700"
        }`}
      />
      {trailing}
    </div>
    {error ? (
      <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
    ) : hint ? (
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
    ) : null}
  </div>
);

const SaveButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transform-none"
  >
    {loading ? "Saving..." : children}
  </button>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-4 last:border-0 dark:border-gray-700">
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
      {description && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 ${
        checked ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const ConfirmDialog = ({ open, title, description, confirmLabel, loading, confirmDisabled, onConfirm, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
          >
            <h3 id="confirm-title" className="text-lg font-black text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>
            {children}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading || confirmDisabled}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Working..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ---------- sections ---------- */

const PersonalSection = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    if (name.trim().length < 3) next.name = "Name must be at least 3 characters.";
    if (phone.trim() && !/^[0-9+\s-]{7,15}$/.test(phone.trim())) next.phone = "Enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      // The email is sent unchanged; changing it would need its own verification step.
      await api.put("/user/profile", { name: name.trim(), email: user.email, phone: phone.trim() });
      updateUser({ name: name.trim(), phone: phone.trim() });
      toast.success("Profile updated");
    } catch (error) {
      const { fields, message } = readError(error, "Could not save your changes. Please try again.");
      setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Personal information" description="Your name and how we can reach you.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="profile-name"
            label="Full name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            id="profile-email"
            label="Email address"
            icon={Mail}
            value={user?.email || ""}
            disabled
            hint="Verified. Contact support to change it."
          />
        </div>
        <Field
          id="profile-phone"
          label="Phone number"
          icon={Phone}
          type="tel"
          placeholder="e.g. 08012345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          autoComplete="tel"
          className="sm:max-w-sm"
        />
        <SaveButton loading={saving}>Save changes</SaveButton>
      </form>
    </Card>
  );
};

const SecuritySection = () => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const strength = strengthOf(form.next);
  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const eye = (
    <button
      type="button"
      onClick={() => setShow((v) => !v)}
      aria-label={show ? "Hide passwords" : "Show passwords"}
      className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    if (!form.current) next.current = "Enter your current password.";
    if (!PASSWORD_RULE.test(form.next)) next.next = "Use 8 to 72 characters with letters and numbers.";
    if (form.next !== form.confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await api.put(
        "/user/password",
        { current_password: form.current, password: form.next, password_confirmation: form.confirm },
        { skipAuthRedirect: true }
      );
      setForm({ current: "", next: "", confirm: "" });
      toast.success("Password changed");
    } catch (error) {
      const { fields, message } = readError(error, "Could not change your password.");
      setErrors({ current: fields.current_password, next: fields.password, confirm: fields.password_confirmation });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Change password" description="Choose a strong password you don't use anywhere else.">
      <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-5">
        <Field
          id="pw-current"
          label="Current password"
          icon={Lock}
          type={show ? "text" : "password"}
          value={form.current}
          onChange={set("current")}
          error={errors.current}
          autoComplete="current-password"
          trailing={eye}
        />
        <div>
          <Field
            id="pw-new"
            label="New password"
            icon={Lock}
            type={show ? "text" : "password"}
            value={form.next}
            onChange={set("next")}
            error={errors.next}
            autoComplete="new-password"
            maxLength={72}
            trailing={eye}
          />
          {form.next && (
            <div className="mt-3">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      strength >= step ? STRENGTH[strength].bar : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                {STRENGTH[strength].label}
              </p>
            </div>
          )}
        </div>
        <Field
          id="pw-confirm"
          label="Confirm new password"
          icon={Lock}
          type={show ? "text" : "password"}
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
          maxLength={72}
          trailing={eye}
        />
        <SaveButton loading={saving}>Update password</SaveButton>
      </form>
    </Card>
  );
};

const AddressSection = () => {
  const { user, updateUser } = useAuth();
  const [address, setAddress] = useState({
    line1: user?.address?.line1 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/user/address", address);
      updateUser({ address });
      toast.success("Address saved");
    } catch (error) {
      const { fields, message } = readError(error, "Could not save your address.");
      setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Shipping address" description="Used to prefill checkout and estimate delivery.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field
          id="addr-line1"
          label="Street address"
          icon={MapPin}
          value={address.line1}
          onChange={set("line1")}
          error={errors.line1}
          autoComplete="address-line1"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="addr-city" label="City" value={address.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
          <Field id="addr-state" label="State" value={address.state} onChange={set("state")} error={errors.state} autoComplete="address-level1" />
          <Field
            id="addr-postal"
            label="Postal code"
            value={address.postalCode}
            onChange={set("postalCode")}
            error={errors.postalCode}
            autoComplete="postal-code"
          />
        </div>
        <SaveButton loading={saving}>Save address</SaveButton>
      </form>
    </Card>
  );
};

// Saves each switch straight away and puts it back if the server says no.
const PreferenceSection = ({ title, description, endpoint, field, items, children }) => {
  const { user, updateUser } = useAuth();
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(items.map((item) => [item.key, user?.[field]?.[item.key] ?? item.fallback]))
  );

  const toggle = async (key) => {
    const previous = prefs;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);

    try {
      await api.put(endpoint, next);
      updateUser({ [field]: next });
    } catch {
      setPrefs(previous);
      toast.error("Could not save that setting. Please try again.");
    }
  };

  return (
    <Card title={title} description={description}>
      <div>
        {items.map((item) => (
          <Toggle
            key={item.key}
            label={item.label}
            description={item.description}
            checked={prefs[item.key]}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>
      {children}
    </Card>
  );
};

const DataExport = () => {
  const [loading, setLoading] = useState(false);

  const requestExport = async () => {
    setLoading(true);
    try {
      await api.post("/user/data-export");
      toast.success("Your data export has been emailed to you.");
    } catch (error) {
      toast.error(readError(error, "Could not start the data export. Please try again.").message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Download your data</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Get a copy of your orders, profile and account activity by email.
        </p>
      </div>
      <button
        type="button"
        onClick={requestExport}
        disabled={loading}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-700 transition hover:bg-purple-100 disabled:opacity-60 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20"
      >
        <Download className="h-4 w-4" />
        {loading ? "Requesting..." : "Request export"}
      </button>
    </div>
  );
};

const DangerSection = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dialog, setDialog] = useState(null); // "logoutAll" | "delete" | null
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);

  const close = () => {
    setDialog(null);
    setPassword("");
  };

  // The local session is only cleared once the server confirmed the action.
  const logoutEverywhere = async () => {
    setWorking(true);
    try {
      await api.post("/logout-all", null, { skipAuthRedirect: true });
      logout();
      toast.success("Logged out of all devices");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(readError(error, "Could not log you out everywhere. Please try again.").message);
      setWorking(false);
    }
  };

  const deleteAccount = async () => {
    setWorking(true);
    try {
      await api.delete("/user", { data: { password }, skipAuthRedirect: true });
      logout();
      toast.success("Your account was deleted");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(readError(error, "Could not delete your account. Check your password and try again.").message);
      setWorking(false);
    }
  };

  return (
    <>
      <Card title="Danger zone" description="These actions are difficult or impossible to undo.">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Log out of all devices</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Ends every active session, including this one.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDialog("logoutAll")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-800 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              <LogOut className="h-4 w-4" />
              Log out everywhere
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Delete account</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Permanently deletes your account and order history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDialog("delete")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
            </button>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={dialog === "logoutAll"}
        title="Log out of all devices?"
        description="You will need to sign in again everywhere, including on this device."
        confirmLabel="Log out everywhere"
        loading={working}
        onConfirm={logoutEverywhere}
        onClose={close}
      />

      <ConfirmDialog
        open={dialog === "delete"}
        title="Delete your account?"
        description="This cannot be undone. Your profile, wallet and order history will be removed. Enter your password to confirm."
        confirmLabel="Delete forever"
        loading={working}
        confirmDisabled={password.length === 0}
        onConfirm={deleteAccount}
        onClose={close}
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Your password"
          aria-label="Your password"
          className="mt-4 block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </ConfirmDialog>
    </>
  );
};

/* ---------- page ---------- */

const Profile = () => {
  const { user, updateUser } = useAuth();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("personal");

  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // The photo is kept on this device only (resized first so it stays small).
  const storePhoto = (dataUrl) => {
    try {
      if (user?.email) {
        if (dataUrl) localStorage.setItem(`profilePic_${user.email}`, dataUrl);
        else localStorage.removeItem(`profilePic_${user.email}`);
      }
      localStorage.setItem("user", JSON.stringify({ ...user, profilePic: dataUrl }));
    } catch (error) {
      console.error("Could not store the profile photo on this device.");
    }
    updateUser({ profilePic: dataUrl });
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Choose an image smaller than 5 MB.");
      return;
    }

    try {
      storePhoto(await resizeImage(file));
      toast.success("Photo updated");
    } catch {
      toast.error("Could not read that image.");
    }
  };

  return (
    <div className="flex-1 bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Identity header */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
          <div className="h-28 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 sm:h-32" />
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative -mt-10 h-24 w-24 shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 ring-4 ring-white dark:bg-purple-950 dark:ring-gray-800">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Your profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-purple-600 dark:text-purple-300">{initials}</span>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white shadow-lg ring-2 ring-white transition hover:bg-purple-700 focus-within:ring-purple-300 dark:ring-gray-800">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile photo</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
                </label>
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  {user?.name || "Your account"}
                </h1>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                <BadgeCheck className="h-3.5 w-3.5" />
                Email verified
              </span>
              {user?.profilePic && (
                <button
                  type="button"
                  onClick={() => storePhoto(null)}
                  className="text-xs font-semibold text-gray-500 transition hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Tabs: a scrolling row on phones, a vertical list on desktop */}
          <nav
            aria-label="Account settings"
            className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 lg:sticky lg:top-32 lg:h-fit lg:flex-col lg:overflow-visible"
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              const danger = id === "danger";
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                      : danger
                        ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </nav>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {activeTab === "personal" && <PersonalSection />}
              {activeTab === "security" && <SecuritySection />}
              {activeTab === "addresses" && <AddressSection />}
              {activeTab === "notifications" && (
                <PreferenceSection
                  title="Notification preferences"
                  description="Choose what we contact you about."
                  endpoint="/user/notifications"
                  field="notifications"
                  items={NOTIFICATION_ITEMS}
                />
              )}
              {activeTab === "privacy" && (
                <PreferenceSection
                  title="Privacy & data"
                  description="Control how your data is used."
                  endpoint="/user/privacy"
                  field="privacy"
                  items={PRIVACY_ITEMS}
                >
                  <DataExport />
                </PreferenceSection>
              )}
              {activeTab === "danger" && <DangerSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
