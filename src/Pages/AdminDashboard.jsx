import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ShoppingBag,
  Clock,
  Banknote,
  Box,
  AlertTriangle,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ChevronRight,
  WalletCards,
  CalendarDays,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard analytics
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const baseURL = (
        import.meta.env.VITE_API_URL || "http://localhost:8000"
      ).replace(/\/+$/, "");

      const res = await axios.get(`${baseURL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setStats(res.data);
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError("We couldn't load your dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fallback chart data: displayed only when the API does not provide chart_data.
  // Replace these sample values with actual backend data when available.
  const chartData = stats?.chart_data || [
    { day: "Mon", orders: 12, revenue: 45000 },
    { day: "Tue", orders: 19, revenue: 78000 },
    { day: "Wed", orders: 15, revenue: 52000 },
    { day: "Thu", orders: 25, revenue: 110000 },
    { day: "Fri", orders: 32, revenue: 145000 },
    { day: "Sat", orders: 40, revenue: 190000 },
    { day: "Sun", orders: 28, revenue: 130000 },
  ];

  const formatCurrency = (amount) =>
    `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatCompactCurrency = (amount) =>
    `₦${Number(amount || 0).toLocaleString("en-NG", {
      notation: "compact",
      maximumFractionDigits: 1,
    })}`;

  const cards = [
    {
      label: "Total Orders",
      value: (stats?.total_orders ?? 0).toLocaleString("en-NG"),
      icon: ShoppingBag,
      accent:
        "from-blue-500/15 to-indigo-500/5 text-blue-600 dark:text-blue-400 border-blue-200/70 dark:border-blue-900/50",
      iconBg: "bg-blue-100 dark:bg-blue-950/70",
      link: "/admin/orders",
      description: "All recorded orders",
    },
    {
      label: "Pending Orders",
      value: (stats?.pending_orders ?? 0).toLocaleString("en-NG"),
      icon: Clock,
      accent:
        "from-amber-500/15 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-900/50",
      iconBg: "bg-amber-100 dark:bg-amber-950/70",
      link: "/admin/orders",
      description: "Awaiting processing",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.total_revenue),
      icon: Banknote,
      accent:
        "from-emerald-500/15 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-900/50",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/70",
      link: "/admin/orders",
      description: "Reported order revenue",
    },
    {
      // The API must calculate this from successful wallet credit/deposit
      // transactions only, not from current wallet balances.
      label: "Wallet Deposits",
      value:
        stats?.total_wallet_deposits == null
          ? "—"
          : formatCurrency(stats.total_wallet_deposits),
      icon: WalletCards,
      accent:
        "from-fuchsia-500/15 to-pink-500/5 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/70 dark:border-fuchsia-900/50",
      iconBg: "bg-fuchsia-100 dark:bg-fuchsia-950/70",
      link: "/admin",
      description: "Successful wallet deposits",
    },
    {
      label: "Total Products",
      value: (stats?.total_products ?? 0).toLocaleString("en-NG"),
      icon: Box,
      accent:
        "from-purple-500/15 to-violet-500/5 text-purple-600 dark:text-purple-400 border-purple-200/70 dark:border-purple-900/50",
      iconBg: "bg-purple-100 dark:bg-purple-950/70",
      link: "/admin/products",
      description: "Products in your store",
    },
    {
      label: "Low Stock Items",
      value: (stats?.low_stock_products ?? 0).toLocaleString("en-NG"),
      icon: AlertTriangle,
      accent:
        "from-rose-500/15 to-red-500/5 text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-900/50",
      iconBg: "bg-rose-100 dark:bg-rose-950/70",
      link: "/admin/products",
      description: "Products needing attention",
    },
    {
      label: "Total Users",
      value: (stats?.total_users ?? 0).toLocaleString("en-NG"),
      icon: Users,
      accent:
        "from-cyan-500/15 to-sky-500/5 text-cyan-600 dark:text-cyan-400 border-cyan-200/70 dark:border-cyan-900/50",
      iconBg: "bg-cyan-100 dark:bg-cyan-950/70",
      link: "/admin/users",
      description: "Registered store users",
    },
  ];

  const quickNav = [
    {
      label: "Manage Products",
      description: "Update products and inventory",
      link: "/admin/products",
      icon: Box,
      iconBg: "bg-violet-500/15 text-violet-500",
    },
    {
      label: "Manage Orders",
      description: "Review and process orders",
      link: "/admin/orders",
      icon: ShoppingBag,
      iconBg: "bg-blue-500/15 text-blue-500",
    },
    {
      label: "Manage Users",
      description: "View registered customers",
      link: "/admin/users",
      icon: Users,
      iconBg: "bg-emerald-500/15 text-emerald-500",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-72 max-w-full rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="hidden h-11 w-36 rounded-xl bg-gray-200 dark:bg-gray-800 sm:block" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="h-36 rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
              />
            ))}
          </div>

          <div className="h-80 rounded-3xl bg-gray-200 dark:bg-gray-800" />

          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchStats}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-7 font-sans text-gray-900 dark:bg-gray-950 dark:text-white sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-5 border-b border-gray-200/80 pb-7 dark:border-gray-800 sm:flex-row sm:items-center"
        >
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20">
                <Activity className="h-5 w-5" />
              </span>

              <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Admin Dashboard
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <p className="max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              Your store at a glance. Monitor orders, track revenue, and manage
              your YossyVogue business from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchStats}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:text-indigo-400"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <Link
              to="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        </motion.header>

        {/* Overview Heading */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
              Store Overview
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Key metrics for your business
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 sm:flex">
            <CalendarDays className="h-4 w-4 text-indigo-500" />
            All-time summary
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(
            (
              {
                label,
                value,
                icon: Icon,
                accent,
                iconBg,
                link,
                description,
              },
              index
            ) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.055,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <Link
                  to={link}
                  className="group relative flex h-full min-h-[166px] flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800 dark:hover:shadow-black/20 sm:p-6"
                >
                  {/* Decorative gradient */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60 transition duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accent} ${iconBg} transition duration-300 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition group-hover:bg-white/80 group-hover:text-indigo-600 dark:group-hover:bg-gray-800 dark:group-hover:text-indigo-400">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="relative mt-5 min-w-0">
                    <p
                      className={`break-words text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl ${
                        label === "Total Revenue" || label === "Wallet Deposits"
                          ? "text-xl sm:text-2xl"
                          : ""
                      }`}
                    >
                      {value}
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-gray-700 dark:text-gray-200">
                      {label}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>

        {/* Analytics Chart */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold sm:text-lg">
                  Order Volume & Performance
                </h3>
                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
                  Weekly checkout activity breakdown
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Weekly overview
            </div>
          </div>

          <div className="px-3 py-6 sm:px-6 sm:py-7">
            <div className="h-64 w-full sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                  barCategoryGap="25%"
                >
                  <defs>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 5"
                    vertical={false}
                    stroke="#9CA3AF"
                    opacity={0.18}
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    allowDecimals={false}
                    width={35}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.07)" }}
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "14px",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "12px 14px",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                    }}
                    labelStyle={{
                      color: "#D1D5DB",
                      fontWeight: 700,
                      marginBottom: 5,
                    }}
                    formatter={(value, name) => [
                      Number(value).toLocaleString("en-NG"),
                      name === "orders" ? "Orders" : name,
                    ]}
                  />

                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill="url(#ordersGradient)"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={42}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                Number of orders
              </div>

              <p className="text-xs text-gray-400">
                {stats?.chart_data
                  ? "Based on available dashboard data"
                  : "Sample chart data — connect backend analytics for live figures"}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">
              Quick Actions
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Jump straight into your store management tools
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickNav.map(
              ({ label, description, link, icon: Icon, iconBg }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.07 }}
                >
                  <Link
                    to={link}
                    className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800 sm:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} transition duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-extrabold text-gray-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </section>

        {/* Dashboard Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-gray-200/80 pt-5 text-center text-xs text-gray-400 dark:border-gray-800 sm:flex-row sm:text-left">
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            YossyVogue Admin Workspace
          </p>

          <p>Store management made simple.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;