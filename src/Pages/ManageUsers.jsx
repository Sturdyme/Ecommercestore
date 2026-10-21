import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronDown,
  LayoutGrid,
  List,
  Lock,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../Component/AuthContext";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "admins-first", label: "Admins first" },
];

const initialsOf = (name) =>
  String(name || "User")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(date)
    : "Date unavailable";
};

const StatCard = ({ label, value, hint, Icon, tint }) => (
  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          {Number(value).toLocaleString("en-NG")}
        </p>
      </div>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
  </div>
);

const UserCard = ({ user, isSelf, compact, reduceMotion, onPromote }) => {
  const isAdmin = user.role === "admin";

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:ring-gray-700 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          isAdmin ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-100 dark:bg-gray-700"
        }`}
      />

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div
            className={`flex shrink-0 items-center justify-center rounded-2xl font-black ring-1 ring-inset ${
              compact ? "h-11 w-11 text-sm" : "h-14 w-14 text-base"
            } ${
              isAdmin
                ? "bg-purple-100 text-purple-700 ring-purple-500/20 dark:bg-purple-500/15 dark:text-purple-300"
                : "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600"
            }`}
          >
            {initialsOf(user.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="max-w-full truncate text-base font-bold text-gray-900 dark:text-white">
                {user.name || "Unnamed user"}
              </h3>
              {isSelf && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
                  You
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${
                  isAdmin
                    ? "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-400/20"
                    : "bg-gray-100 text-gray-600 ring-gray-500/10 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600"
                }`}
              >
                {isAdmin && <ShieldCheck className="h-3 w-3" />}
                {isAdmin ? "Administrator" : user.role || "Unknown role"}
              </span>
              {user.is_verified === false && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
                  Unverified
                </span>
              )}
              <span className="text-[11px] text-gray-400">ID #{user.id}</span>
            </div>

            <div className="mt-3 flex min-w-0 flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex min-w-0 items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="break-all">{user.email || "No email provided"}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 pt-4 dark:border-gray-700 sm:min-w-[170px] sm:border-t-0 sm:pt-0">
          {isSelf ? (
            <p className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              Your account
            </p>
          ) : isAdmin ? (
            <p className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              Admins can't be demoted
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onPromote(user)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-50 px-3 py-2.5 text-xs font-bold text-purple-700 transition hover:bg-purple-600 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-600 dark:hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Make administrator
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const PromoteDialog = ({ target, loading, onConfirm, onClose }) => {
  useEffect(() => {
    if (!target) return;
    const onKey = (e) => e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, loading, onClose]);

  return (
    <AnimatePresence>
      {target && (
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
            aria-labelledby="promote-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h3 id="promote-title" className="mt-4 text-lg font-black text-gray-900 dark:text-white">
              Make {target.name || "this user"} an administrator?
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Administrators can manage products, orders and customers. This cannot be undone from here:
              administrators can't be demoted.
            </p>
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
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Working..." : "Make administrator"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const reduceMotion = useReducedMotion();

  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, admins: 0, customers: 0 });
  const [meta, setMeta] = useState({ page: 1, lastPage: 1, total: 0 });
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("cards");

  const [promoteTarget, setPromoteTarget] = useState(null);
  const [promoting, setPromoting] = useState(false);

  const requestId = useRef(0);

  // Wait a moment after typing before asking the server.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(
    async (page = 1, append = false) => {
      const id = ++requestId.current;
      if (append) setLoadingMore(true);
      else setFetching(true);
      setError(null);

      try {
        const { data } = await api.get("/admin/users", {
          params: {
            page,
            q: query || undefined,
            role: roleFilter === "all" ? undefined : roleFilter,
            sort: sortBy,
          },
        });
        if (id !== requestId.current) return;

        const list = Array.isArray(data?.data) ? data.data : [];
        setUsers((previous) => (append ? [...previous, ...list] : list));
        setMeta({
          page: data.current_page ?? page,
          lastPage: data.last_page ?? 1,
          total: data.total ?? list.length,
        });
        if (data.counts) setCounts(data.counts);
      } catch (err) {
        if (id !== requestId.current) return;

        // The PIN lock came back: PinGate takes over this screen, so no error is shown here.
        if (err.response?.data?.code === "pin_required") return;

        const res = err.response;
        const message =
          res && res.status < 500 && res.data?.message
            ? res.data.message
            : "Failed to load users. Please try again.";

        if (append) toast.error(message);
        else setError(message);
      } finally {
        if (id === requestId.current) {
          setInitialLoading(false);
          setFetching(false);
          setLoadingMore(false);
        }
      }
    },
    [query, roleFilter, sortBy]
  );

  // Runs on first load and whenever the search, role filter or sort changes.
  useEffect(() => {
    load(1);
  }, [load]);

  const confirmPromote = async () => {
    if (!promoteTarget) return;

    const target = promoteTarget;
    setPromoting(true);

    try {
      await api.put(`/admin/users/${target.id}/role`, { role: "admin" });

      setUsers((previous) =>
        roleFilter === "customer"
          ? previous.filter((u) => u.id !== target.id)
          : previous.map((u) => (u.id === target.id ? { ...u, role: "admin" } : u))
      );
      if (roleFilter === "customer") {
        setMeta((previous) => ({ ...previous, total: Math.max(0, previous.total - 1) }));
      }
      setCounts((previous) => ({
        ...previous,
        admins: previous.admins + 1,
        customers: Math.max(0, previous.customers - 1),
      }));

      toast.success(`${target.name || "User"} is now an administrator.`);
      setPromoteTarget(null);
    } catch (err) {
      if (err.response?.data?.code === "pin_required") return;

      const res = err.response;
      toast.error(
        res && res.status < 500 && res.data?.message
          ? res.data.message
          : "Unable to update the role. Please try again."
      );
    } finally {
      setPromoting(false);
    }
  };

  const hasActiveFilters = search.trim() !== "" || roleFilter !== "all" || sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setQuery("");
    setRoleFilter("all");
    setSortBy("newest");
  };

  const roleButton = (value, label, Icon, count, activeClass) => (
    <button
      type="button"
      onClick={() => setRoleFilter(value)}
      aria-pressed={roleFilter === value}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 ${
        roleFilter === value
          ? activeClass
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span className="opacity-70">{count}</span>
    </button>
  );

  if (initialLoading) {
    return (
      <div className="flex-1 bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-40 rounded-3xl bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-purple-500/5 ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-xl font-black text-gray-900 dark:text-white">Unable to load users</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{error}</p>
          <button
            type="button"
            onClick={() => load(1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:shadow-xl"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-6 text-white shadow-xl shadow-purple-600/20 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-purple-100">
                <ShieldCheck className="h-4 w-4" />
                Store administration
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Customers</h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-purple-100/90">
                Find any account and control who has administrative access.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => load(1)}
                disabled={fetching}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-purple-700 shadow-lg transition hover:bg-purple-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                View orders
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total accounts"
            value={counts.total}
            hint="Everyone registered in your store"
            Icon={Users}
            tint="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          />
          <StatCard
            label="Administrators"
            value={counts.admins}
            hint="Accounts with admin access"
            Icon={ShieldCheck}
            tint="bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300"
          />
          <StatCard
            label="Customers"
            value={counts.customers}
            hint="Standard shopper accounts"
            Icon={UserCheck}
            tint="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
          />
          <StatCard
            label="Matching your search"
            value={meta.total}
            hint="Based on the filters below"
            Icon={Search}
            tint="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
          />
        </section>

        {/* Toolbar */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:w-96">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or ID..."
                aria-label="Search users"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/15 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-purple-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {roleButton("all", "All", Users, counts.total, "bg-gray-900 text-white dark:bg-white dark:text-gray-900")}
              {roleButton("admin", "Admins", ShieldCheck, counts.admins, "bg-purple-600 text-white shadow-md shadow-purple-600/20")}
              {roleButton("customer", "Customers", UserCheck, counts.customers, "bg-emerald-600 text-white shadow-md shadow-emerald-600/20")}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-bold text-gray-900 dark:text-white">{users.length}</span> of{" "}
              <span className="font-bold text-gray-900 dark:text-white">{meta.total}</span> accounts
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort users"
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-xs font-semibold text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
                {[
                  { mode: "cards", label: "Card view", Icon: LayoutGrid },
                  { mode: "list", label: "Compact list", Icon: List },
                ].map(({ mode, label, Icon }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    aria-label={label}
                    aria-pressed={viewMode === mode}
                    className={`rounded-lg p-2 transition ${
                      viewMode === mode
                        ? "bg-white text-purple-700 shadow-sm dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-500/10"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className={fetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {users.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                <UserRound className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
                {counts.total === 0 ? "No accounts yet" : "No matching users"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                {counts.total === 0
                  ? "When people register, their accounts will appear here."
                  : "Try a different name, email address or role filter."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/25"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={viewMode === "cards" ? "grid gap-4 xl:grid-cols-2" : "flex flex-col gap-3"}>
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelf={String(user.id) === String(currentUser?.id)}
                    compact={viewMode === "list"}
                    reduceMotion={reduceMotion}
                    onPromote={setPromoteTarget}
                  />
                ))}
              </div>

              {meta.page < meta.lastPage && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => load(meta.page + 1, true)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-purple-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 disabled:opacity-60 dark:bg-gray-800 dark:text-purple-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                  >
                    {loadingMore && <RefreshCw className="h-4 w-4 animate-spin" />}
                    {loadingMore ? "Loading..." : `Show more (${meta.total - users.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <PromoteDialog
        target={promoteTarget}
        loading={promoting}
        onConfirm={confirmPromote}
        onClose={() => setPromoteTarget(null)}
      />
    </div>
  );
};

export default ManageUsers;
