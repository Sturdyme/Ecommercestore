import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await api.get("/orders");
        // Assumes your backend returns an array directly or inside a data field
        setOrders(Array.isArray(response.data) ? response.data : response.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Could not retrieve your order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Mirrors your exact mathematical layout for localized currency display
  const formatNaira = (amount) => {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return "₦0.00";
    
    const parts = numericAmount
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .split(".");
    return `₦${parts[0]}.${parts[1]}`;
  };

  // Helper to visually flag transaction states uniformly
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900",
          icon: <FaCheckCircle />
        };
      case "failed":
        return {
          bg: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900",
          icon: <FaTimesCircle />
        };
      default:
        return {
          bg: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900",
          icon: <FaClock />
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-purple-600 dark:text-purple-400 font-medium animate-pulse text-lg">
          Loading order history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-sm text-center border border-red-100 dark:border-slate-700">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-10 px-4 transition-colors duration-200">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 text-white rounded-xl shadow-md">
            <FaShoppingBag className="text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Order History
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Track and view your recent boutique purchases
            </p>
          </div>
        </div>

        {/* Orders List Container */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusStyle(order.status);
              return (
                <div 
                  key={order.id} 
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-200"
                >
                  {/* Order Meta Header Card Segment */}
                  <div className="p-4 bg-gray-50/50 dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                        Reference Code
                      </span>
                      <span className="text-sm font-mono font-medium text-purple-600 dark:text-purple-400">
                        {order.reference}
                      </span>
                    </div>
                    
                    {/* Synchronized Pill Status Style */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${statusInfo.bg}`}>
                      {statusInfo.icon}
                      <span>{order.status}</span>
                    </div>
                  </div>

                  {/* Order Purchased Items Array List */}
                  <div className="p-4 divide-y divide-gray-100 dark:divide-slate-700/60">
                    {order.items && order.items.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0 gap-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                            {item.product_name || item.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: <span className="font-medium text-gray-600 dark:text-gray-300">{item.quantity}</span>
                            {" • "}
                            Each: <span className="font-medium text-gray-600 dark:text-gray-300">{formatNaira(item.price)}</span>
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 shrink-0">
                          {formatNaira(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total Summary Segment */}
                  <div className="p-4 bg-gray-50/30 dark:bg-slate-900/20 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 mr-2">Grand Total:</span>
                      <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                        {formatNaira(order.total_amount)}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Verified Footer Signature */}
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest pt-2">
          Secure Order Management System
        </p>
      </div>
    </div>
  );
};

export default OrderHistory;