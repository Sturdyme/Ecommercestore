import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
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
  Package,
  TrendingUp,
  ClipboardList,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  X,
  MapPin,
  Check,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dot: "bg-amber-500",
  },
  processing: {
    label: "Processing",
    icon: RefreshCw,
    badge:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    badge:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60",
    dot: "bg-violet-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badge:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    dot: "bg-rose-500",
  },
};

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrderItems = (order) => {
  if (Array.isArray(order?.item)) return order.item;
  if (Array.isArray(order?.items)) return order.items;
  return [];
};

const getOrderCustomer = (order) => ({
  name: order?.user?.name || order?.name || "Guest Checkout",
  email: order?.user?.email || order?.email || "No email provided",
});

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.pending;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const payload = response.data?.data ?? response.data;
      const fetchedOrders = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(
        getErrorMessage(err, "Unable to load orders. Please try again.")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!notification) return undefined;

    const timeout = setTimeout(() => setNotification(null), 3500);

    return () => clearTimeout(timeout);
  }, [notification]);

  const handleStatusChange = async (orderId, newStatus) => {
    const currentOrder = orders.find(
      (order) => String(order.id) === String(orderId)
    );

    if (!currentOrder || currentOrder.status === newStatus) return;

    const previousStatus = currentOrder.status;
    setUpdatingId(orderId);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await axios.put(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const confirmedStatus = response.data?.status || newStatus;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, status: confirmedStatus }
            : order
        )
      );

      setNotification({
        type: "success",
        message: `Order #${orderId} updated to ${confirmedStatus}.`,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, status: previousStatus }
            : order
        )
      );

      setNotification({
        type: "error",
        message: getErrorMessage(
          err,
          "Failed to update the order status."
        ),
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId((previousId) =>
      String(previousId) === String(id) ? null : id
    );
  };

  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };

    STATUS_OPTIONS.forEach((status) => {
      counts[status] = orders.filter(
        (order) => order.status === status
      ).length;
    });

    return counts;
  }, [orders]);

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((order) => order.status === "completed")
        .reduce(
          (total, order) => total + Number(order.total_amount || 0),
          0
        ),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const customer = getOrderCustomer(order);

      const searchableValues = [
        order.id,
        order.reference,
        customer.name,
        customer.email,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        activeTab === "all" || order.status === activeTab;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, activeTab]);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  const hasActiveFilters = searchQuery.trim() !== "" || activeTab !== "all";

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
            <ShoppingBag className="h-7 w-7 text-violet-600 dark:text-violet-400" />
          </div>
          <RefreshCw className="absolute -right-2 -top-2 h-5 w-5 animate-spin text-violet-600 dark:text-violet-400" />
        </div>

        <div className="text-center">
          <p className="font-bold text-gray-900 dark:text-white">
            Loading your orders
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fetching the latest order records...
          </p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 dark:bg-gray-950 px-5 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Unable to load orders
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchOrders()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 dark:bg-white dark:text-gray-950 dark:hover:bg-violet-200"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-6 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl sm:right-6 sm:top-6 ${
                notification.type === "success"
                  ? "border-emerald-200 bg-white dark:border-emerald-900 dark:bg-gray-900"
                  : "border-rose-200 bg-white dark:border-rose-900 dark:bg-gray-900"
              }`}
              role="status"
              aria-live="polite"
            >
              {notification.type === "success" ? (
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              )}

              <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                {notification.message}
              </p>

              <button
                type="button"
                onClick={() => setNotification(null)}
                aria-label="Dismiss notification"
                className="text-gray-400 transition hover:text-gray-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-5 border-b border-gray-200 pb-7 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300">
              <ClipboardList className="h-3.5 w-3.5" />
              ORDER MANAGEMENT
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Manage Orders
              </h1>

              <span className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {orders.length} total
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              Monitor customer orders, manage fulfillment, and keep track of
              completed transactions from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-violet-700 dark:hover:text-violet-300"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 dark:bg-white dark:text-gray-950 dark:hover:bg-violet-200"
            >
              Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.header>

        {/* Inline refresh error */}
        {error && orders.length > 0 && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>

            <button
              type="button"
              onClick={() => fetchOrders(true)}
              className="font-bold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Summary cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total orders
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">
                  {orders.length.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  All recorded orders
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <ShoppingBag className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Awaiting processing
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">
                  {statusCounts.pending || 0}
                </p>
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Requires attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  In transit
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">
                  {statusCounts.shipped || 0}
                </p>
                <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">
                  Shipped orders
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
                <Truck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed revenue
                </p>
                <p className="mt-3 break-words text-2xl font-black tracking-tight">
                  {formatNaira(totalRevenue)}
                </p>
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  From completed orders
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Orders workspace */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-800 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-gray-950 dark:text-white">
                  Order registry
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Review and manage customer purchases.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1 sm:min-w-72">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search order, reference, customer..."
                    aria-label="Search orders"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-950"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Status filters */}
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter by status
              </div>

              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  aria-pressed={activeTab === "all"}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition ${
                    activeTab === "all"
                      ? "border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  All orders
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      activeTab === "all"
                        ? "bg-white/15 text-white dark:bg-gray-950/10 dark:text-gray-950"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {statusCounts.all}
                  </span>
                </button>

                {STATUS_OPTIONS.map((status) => {
                  const config = getStatusConfig(status);
                  const StatusIcon = config.icon;
                  const isActive = activeTab === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setActiveTab(status)}
                      aria-pressed={isActive}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold capitalize transition ${
                        isActive
                          ? "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                          : "border-gray-200 bg-white text-gray-600 hover:border-violet-200 hover:bg-violet-50/50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-800 dark:hover:bg-violet-950/20"
                      }`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {config.label}
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {statusCounts[status] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40 sm:px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {orders.length}
              </span>{" "}
              orders
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live records from your API
            </span>
          </div>

          {/* Order list */}
          {filteredOrders.length === 0 ? (
            <div className="px-5 py-16 text-center sm:py-20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                {hasActiveFilters ? (
                  <Search className="h-7 w-7 text-gray-400" />
                ) : (
                  <PackageCheck className="h-7 w-7 text-gray-400" />
                )}
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {hasActiveFilters ? "No matching orders" : "No orders yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                {hasActiveFilters
                  ? "Try a different search term or status filter to find the order you're looking for."
                  : "Orders will appear here when customers place purchases."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 dark:bg-white dark:text-gray-950 dark:hover:bg-violet-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  const customer = getOrderCustomer(order);
                  const items = getOrderItems(order);
                  const isExpanded =
                    String(expandedOrderId) === String(order.id);
                  const isUpdating =
                    String(updatingId) === String(order.id);

                  return (
                    <motion.article
                      key={order.id}
                      layout
                      variants={itemVariants}
                      exit={{ opacity: 0, height: 0 }}
                      className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/20"
                    >
                      {/* Order summary */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-base font-black tracking-tight text-gray-950 dark:text-white">
                                Order #{order.id}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${statusConfig.badge}`}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {statusConfig.label}
                              </span>
                            </div>

                            {order.reference && (
                              <p className="mt-2 break-all font-mono text-xs text-gray-400">
                                Ref: {order.reference}
                              </p>
                            )}

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                              <div className="flex min-w-0 items-start gap-2.5">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Customer
                                  </p>
                                  <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {customer.name}
                                  </p>
                                </div>
                              </div>

                              <div className="flex min-w-0 items-start gap-2.5">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Email
                                  </p>
                                  <p
                                    title={customer.email}
                                    className="mt-1 truncate text-sm font-medium text-gray-600 dark:text-gray-300"
                                  >
                                    {customer.email}
                                  </p>
                                </div>
                              </div>

                              <div className="flex min-w-0 items-start gap-2.5">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                  {order.fulfillment_method === "pickup" ? (
                                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  ) : (
                                    <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Fulfillment
                                  </p>
                                  <p className="mt-1 text-sm font-semibold capitalize text-gray-800 dark:text-gray-200">
                                    {String(
                                      order.fulfillment_method || "Standard"
                                    ).replace(/[_-]/g, " ")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Amount and actions */}
                          <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800 xl:min-w-64 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                            <div className="flex items-center justify-between gap-4 xl:justify-end">
                              <div className="xl:text-right">
                                <p className="text-xs font-medium text-gray-400">
                                  Order total
                                </p>
                                <p className="mt-1 text-xl font-black tracking-tight text-gray-950 dark:text-white">
                                  {formatNaira(order.total_amount)}
                                </p>
                              </div>

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40">
                                <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                              <label className="sr-only" htmlFor={`status-${order.id}`}>
                                Change status for order {order.id}
                              </label>

                              <div className="relative flex-1">
                                <select
                                  id={`status-${order.id}`}
                                  value={
                                    STATUS_OPTIONS.includes(order.status)
                                      ? order.status
                                      : "pending"
                                  }
                                  onChange={(event) =>
                                    handleStatusChange(
                                      order.id,
                                      event.target.value
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-3 pr-10 text-sm font-bold text-gray-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-wait disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                  {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                      {STATUS_CONFIG[status].label}
                                    </option>
                                  ))}
                                </select>

                                {isUpdating ? (
                                  <RefreshCw className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-violet-500" />
                                ) : (
                                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleExpand(order.id)}
                                aria-expanded={isExpanded}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-600 transition hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-800 dark:hover:bg-violet-950/20 dark:hover:text-violet-300"
                              >
                                <Eye className="h-4 w-4" />
                                {isExpanded ? "Hide details" : "View details"}
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Order date */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-400 dark:border-gray-800">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Placed {formatDate(order.created_at)}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5" />
                            {items.length}{" "}
                            {items.length === 1 ? "line item" : "line items"}
                          </span>

                          {order.updated_at && (
                            <span className="inline-flex items-center gap-1.5">
                              <RefreshCw className="h-3.5 w-3.5" />
                              Updated {formatDateTime(order.updated_at)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expanded order details */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950/40 sm:p-6">
                              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                                    Purchased items
                                  </h3>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Review the items included in this order.
                                  </p>
                                </div>

                                <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                  {items.length}{" "}
                                  {items.length === 1 ? "item" : "items"}
                                </span>
                              </div>

                              {items.length > 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                  <div className="hidden grid-cols-[minmax(0,1fr)_100px_140px] gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:bg-gray-800/50 sm:grid">
                                    <span>Product</span>
                                    <span className="text-center">Quantity</span>
                                    <span className="text-right">Unit price</span>
                                  </div>

                                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {items.map((line, index) => {
                                      const lineKey =
                                        line.id ??
                                        `${line.product_id ?? "product"}-${index}`;

                                      return (
                                        <div
                                          key={lineKey}
                                          className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_100px_140px] sm:items-center sm:gap-4"
                                        >
                                          <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                              <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                            </div>

                                            <div className="min-w-0">
                                              <p className="break-words text-sm font-bold text-gray-900 dark:text-white">
                                                {line.product_name ||
                                                  line.name ||
                                                  `Product ${index + 1}`}
                                              </p>
                                              {line.product_id && (
                                                <p className="mt-1 text-xs text-gray-400">
                                                  Product ID: {line.product_id}
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between sm:justify-center">
                                            <span className="text-xs text-gray-400 sm:hidden">
                                              Quantity
                                            </span>
                                            <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-extrabold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                              × {line.quantity ?? 1}
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between sm:justify-end">
                                            <span className="text-xs text-gray-400 sm:hidden">
                                              Unit price
                                            </span>
                                            <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                                              {formatNaira(line.price)}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                                  <Package className="mx-auto h-8 w-8 text-gray-400" />
                                  <p className="mt-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                                    No item details available
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    The order record does not contain a
                                    recognized items array.
                                  </p>
                                </div>
                              )}

                              {/* Order totals */}
                              <div className="mt-4 flex justify-end">
                                <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                                  <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Subtotal
                                    </span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                      {formatNaira(order.subtotal)}
                                    </span>
                                  </div>

                                  <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Shipping
                                    </span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                      {formatNaira(order.shipping)}
                                    </span>
                                  </div>

                                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                                      Total
                                    </span>
                                    <span className="text-lg font-black text-violet-700 dark:text-violet-300">
                                      {formatNaira(order.total_amount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-3 pb-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Yuna`Vogue Admin{" "}
            <span className="mx-1 text-gray-300 dark:text-gray-700">/</span>
            Order Management
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 font-semibold transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              Manage users
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Admin workspace
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ManageOrders;
