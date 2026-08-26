import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  User, 
  ChevronDown 
} from "lucide-react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load orders.");
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

      // Update local state smoothly
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? { ...ord, status: res.data?.order?.status || newStatus }
            : ord
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper for status badge colors & icons
  const getStatusBadge = (status) => {
    const formatted = (status || "pending").toLowerCase();
    switch (formatted) {
      case "completed":
      case "delivered":
        return {
          color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60",
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      case "processing":
      case "shipped":
        return {
          color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60",
          icon: <Truck className="w-3 h-3" />,
        };
      case "cancelled":
        return {
          color: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-800/60",
          icon: <XCircle className="w-3 h-3" />,
        };
      default:
        return {
          color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60",
          icon: <Clock className="w-3 h-3" />,
        };
    }
  };

  // Animation Variants matching ManageProducts
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading orders...</p>
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
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Manage Orders
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {orders.length} Total
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track customer orders, review purchases, and update fulfillment status
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center"
        >
          <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300">No orders found</h3>
          <p className="text-xs text-gray-400 mt-1">Customers haven't placed any orders yet.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const itemCount = order.item?.length || order.order_item?.length || 0;
              const customerName = order.user?.name || order.customer_name || `Customer #${order.user_id || "Guest"}`;

              return (
                <motion.div
                  key={order.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
                >
                  {/* Order Icon / Avatar */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      #{order.id}
                    </div>

                    {/* Mobile Status Badge Header (shown on small screens) */}
                    <div className="sm:hidden ml-auto">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${badge.color}`}>
                        {badge.icon}
                        <span className="capitalize">{order.status || "Pending"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {customerName}
                      </p>
                      {/* Desktop Status Badge */}
                      <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}>
                        {badge.icon}
                        <span className="capitalize">{order.status || "Pending"}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${Number(order.total_amount || order.total || 0).toFixed(2)}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-[11px]">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                      <span>•</span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>
                  </div>

                  {/* Status Change Dropdown */}
                  <div className="relative flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 flex items-center justify-between sm:justify-end gap-2">
                    <span className="sm:hidden text-xs text-gray-400 font-medium">Update Status:</span>
                    <div className="relative">
                      <select
                        value={order.status || "pending"}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="appearance-none bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-gray-200 dark:border-gray-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                        {updatingId === order.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
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