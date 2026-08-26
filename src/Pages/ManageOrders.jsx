// src/Pages/Admin/ManageOrders.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  PackageCheck,
  User,
  Mail,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "completed", "cancelled"];

const STATUS_BADGES = {
  pending: {
    bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    icon: Clock,
  },
  processing: {
    bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
    icon: RefreshCw,
  },
  shipped: {
    bg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
    icon: Truck,
  },
  completed: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
  cancelled: {
    bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
    icon: XCircle,
  },
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  // Filter orders by search term and selected tab
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toString().includes(searchQuery) ||
        (order.reference && order.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.email && order.user.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTab = activeTab === "all" || order.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  // Tab count calculations
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    STATUS_OPTIONS.forEach((status) => {
      counts[status] = orders.filter((o) => o.status === status).length;
    });
    return counts;
  }, [orders]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading order registry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 font-sans">
      {/* Header & Quick Route Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Manage Orders
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {orders.length} Total
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track customer transactions, update order fulfillment, and inspect items
          </p>
        </div>

        <div className="flex gap-3 text-xs font-bold">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition"
          >
            Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition"
          >
            Users <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Control */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> All ({statusCounts.all})
          </button>
          {STATUS_OPTIONS.map((status) => {
            const Config = STATUS_BADGES[status];
            const StatusIcon = Config ? Config.icon : Clock;
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 capitalize transition whitespace-nowrap ${
                  activeTab === status
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50"
                }`}
              >
                <StatusIcon className="w-3.5 h-3.5" /> {status} ({statusCounts[status] || 0})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID, ref, user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <PackageCheck className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="font-bold text-sm text-gray-700 dark:text-gray-300">No orders found</p>
          <p className="text-xs text-gray-400 mt-1">
            There are no transactions matching your current query or tab filter.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => {
              const statusConfig = STATUS_BADGES[order.status] || STATUS_BADGES.pending;
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedOrderId === order.id;
              const itemCount = order.item?.length || 0;

              return (
                <motion.div
                  key={order.id}
                  layout
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Top Bar Section */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Order & Customer Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white tracking-tight">
                          Order #{order.id}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${statusConfig.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>

                        {order.reference && (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            {order.reference}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          {order.user?.name || "Guest Checkout"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {order.user?.email || "No email"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 capitalize">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          {order.fulfillment_method || "Standard"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Amount & Status Action Selector */}
                    <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400 font-medium">Total Amount</p>
                        <p className="font-black text-base text-indigo-600 dark:text-indigo-400">
                          ₦
                          {Number(order.total_amount || 0).toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      {/* Status Dropdown */}
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="appearance-none text-xs font-bold border rounded-xl px-3 py-2 pr-8 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition cursor-pointer capitalize"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingId === order.id ? (
                          <RefreshCw className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500 animate-spin pointer-events-none" />
                        ) : (
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Order Items Drawer */}
                  <div className="bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800/80 px-4 py-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>
                        {isExpanded ? "Hide" : "Inspect"} Purchased Items ({itemCount})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800"
                      >
                        <div className="p-4 space-y-2">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Order Breakdown
                          </p>
                          {order.item && order.item.length > 0 ? (
                            order.item.map((line) => (
                              <div
                                key={line.id}
                                className="flex items-center justify-between text-xs p-2.5 bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                                    {line.product_name}
                                  </span>
                                  <span className="text-gray-400 font-mono">
                                    × {line.quantity}
                                  </span>
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300 ml-2">
                                  ₦
                                  {Number(line.price || 0).toLocaleString("en-NG", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              No items recorded for this order.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ManageOrders;