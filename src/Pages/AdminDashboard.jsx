// src/Pages/Admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
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
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Fallback / Sample Chart Data (Uses backend data if provided, else falls back to weekly projection)
  const chartData = stats?.chart_data || [
    { day: "Mon", orders: 12, revenue: 45000 },
    { day: "Tue", orders: 19, revenue: 78000 },
    { day: "Wed", orders: 15, revenue: 52000 },
    { day: "Thu", orders: 25, revenue: 110000 },
    { day: "Fri", orders: 32, revenue: 145000 },
    { day: "Sat", orders: 40, revenue: 190000 },
    { day: "Sun", orders: 28, revenue: 130000 },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 animate-pulse space-y-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-full text-red-500">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <p className="font-bold text-gray-800 dark:text-gray-200">{error}</p>
        <button
          onClick={fetchStats}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Refreshing
        </button>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: stats?.total_orders ?? 0,
      icon: ShoppingBag,
      accent: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30",
      link: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: stats?.pending_orders ?? 0,
      icon: Clock,
      accent: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30",
      link: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: `₦${Number(stats?.total_revenue || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      icon: Banknote,
      accent: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30",
      link: "/admin/orders",
    },
    {
      // The API must calculate this from successful wallet credit/deposit
      // transactions only; it must not be derived from wallet balances.
      label: "Wallet Deposits",
      value:
        stats?.total_wallet_deposits == null
          ? "—"
          : `₦${Number(stats.total_wallet_deposits).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}`,
      icon: WalletCards,
      accent: "from-fuchsia-500/10 to-pink-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/50 dark:border-fuchsia-900/30",
      link: "/admin",
    },
    {
      label: "Total Products",
      value: stats?.total_products ?? 0,
      icon: Box,
      accent: "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30",
      link: "/admin/products",
    },
    {
      label: "Low Stock Items",
      value: stats?.low_stock_products ?? 0,
      icon: AlertTriangle,
      accent: "from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30",
      link: "/admin/products",
    },
    {
      label: "Total Users",
      value: stats?.total_users ?? 0,
      icon: Users,
      accent: "from-cyan-500/10 to-sky-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-900/30",
      link: "/admin/users",
    },
  ];

  const quickNav = [
    { label: "Manage Products", link: "/admin/products", icon: Box },
    { label: "Manage Orders", link: "/admin/orders", icon: ShoppingBag },
    { label: "Manage Users", link: "/admin/users", icon: Users },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 font-sans">
      {/* Top Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Admin Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time analytics and store management hub
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, accent, link }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={link}
              className={`group relative block p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
            >
              {/* Subtle Gradient Accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-40 group-hover:opacity-70 transition-opacity`} />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border ${accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </div>

                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white truncate">
                    {value}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                    {label}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Order Volume & Performance
            </h3>
            <p className="text-xs text-gray-400">Weekly checkout activity breakdown</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#1F2937",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
              />
              <Bar dataKey="orders" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Action Navigation */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickNav.map(({ label, link, icon: Icon }) => (
          <Link
            key={label}
            to={link}
            className="group flex items-center justify-between p-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Icon className="w-4 h-4" />
              </div>
              <span>{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
