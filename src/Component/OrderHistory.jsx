import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBoxOpen,
  FaSearch,
  FaArrowRight,
  FaReceipt,
  FaCalendarAlt,
  FaSyncAlt,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiPackage, FiFilter, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api";

const formatNaira = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) return "₦0.00";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getStatusInfo = (status) => {
  const normalizedStatus = String(status || "pending").toLowerCase();

  if (["completed", "success", "paid", "delivered"].includes(normalizedStatus)) {
    return {
      label: normalizedStatus === "success" ? "Successful" : normalizedStatus,
      icon: FaCheckCircle,
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/10 dark:text-emerald-300",
      dot: "bg-emerald-500",
    };
  }

  if (["failed", "cancelled", "canceled", "refunded"].includes(normalizedStatus)) {
    return {
      label: normalizedStatus,
      icon: FaTimesCircle,
      badge:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-300",
      dot: "bg-red-500",
    };
  }

  if (["shipped", "processing", "confirmed"].includes(normalizedStatus)) {
    return {
      label: normalizedStatus,
      icon: FaTruck,
      badge:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-500/10 dark:text-blue-300",
      dot: "bg-blue-500",
    };
  }

  return {
    label: normalizedStatus,
    icon: FaClock,
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
  };
};

const normalizeOrdersResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.orders)) return responseData.orders;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.data?.orders)) {
    return responseData.data.orders;
  }
  if (Array.isArray(responseData?.data?.data)) {
    return responseData.data.data;
  }

  return [];
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrderHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/orders");
      setOrders(normalizeOrdersResponse(response.data));
    } catch (err) {
      console.error("Failed to load orders:", err);

      const status = err.response?.status;

      if (status === 401) {
        setError("Your session may have expired. Please sign in and try again.");
      } else if (status === 403) {
        setError("You are not authorized to view these orders.");
      } else {
        setError(
          err.response?.data?.message ||
            "We couldn't retrieve your order history. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders
      .filter((order) => {
        const reference = String(order.reference || order.id || "").toLowerCase();
        const status = String(order.status || "pending").toLowerCase();

        const matchesSearch =
          !query ||
          reference.includes(query) ||
          status.includes(query) ||
          String(order.items?.map((item) => item.product_name || item.title || "").join(" "))
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" || status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const completed = orders.filter((order) =>
      ["completed", "success", "paid", "delivered"].includes(
        String(order.status || "").toLowerCase()
      )
    ).length;

    const pending = orders.filter((order) =>
      ["pending", "processing", "confirmed", "shipped"].includes(
        String(order.status || "").toLowerCase()
      )
    ).length;

    return {
      total: orders.length,
      completed,
      pending,
      totalSpent,
    };
  }, [orders]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-8">
          <div className="h-64 rounded-[2rem] bg-zinc-200 dark:bg-zinc-900" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-900"
              />
            ))}
          </div>

          <div className="h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />

          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 rounded-3xl bg-zinc-200 dark:bg-zinc-900"
            />
          ))}

          <p className="text-center text-sm text-zinc-500">
            Preparing your order history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[28rem] bg-gradient-to-b from-purple-100/70 via-indigo-50/30 to-transparent dark:from-purple-950/25 dark:via-indigo-950/10 dark:to-transparent" />

      <main className="relative mx-auto max-w-6xl space-y-8 px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-9 lg:p-11">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-purple-700 dark:border-purple-900 dark:bg-purple-500/10 dark:text-purple-300">
                  <HiOutlineSparkles size={15} />
                  Your shopping space
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Your orders,
                  <span className="mt-1 block bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                    all in one place.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">
                  Keep track of your YossyVogue purchases, check order
                  progress, and revisit the details of your shopping journey.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fetchOrderHistory(true)}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <FaSyncAlt
                    className={refreshing ? "animate-spin" : ""}
                    size={13}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-purple-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-purple-200"
                >
                  Continue shopping
                  <FaArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-zinc-100 pt-5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Personal order overview
              </span>
              <span className="inline-flex items-center gap-2">
                <FaReceipt size={12} />
                {stats.total} {stats.total === 1 ? "order" : "orders"} recorded
              </span>
            </div>
          </div>
        </section>

        {/* Error notice */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold text-red-800 dark:text-red-300">
                Unable to load your orders
              </p>
              <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchOrderHistory(true)}
              disabled={refreshing}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950"
            >
              <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
              Try again
            </button>
          </div>
        )}

        {/* Overview cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total orders",
              value: stats.total.toLocaleString(),
              detail: "All recorded purchases",
              icon: FaShoppingBag,
              iconStyle:
                "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
            },
            {
              label: "Completed",
              value: stats.completed.toLocaleString(),
              detail: "Successfully completed",
              icon: FaCheckCircle,
              iconStyle:
                "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
            },
            {
              label: "In progress",
              value: stats.pending.toLocaleString(),
              detail: "Awaiting completion",
              icon: FaClock,
              iconStyle:
                "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
            },
            {
              label: "Total order value",
              value: formatNaira(stats.totalSpent),
              detail: "Combined value of recorded orders",
              icon: FaReceipt,
              iconStyle:
                "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-black/30 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-3 break-words font-black tracking-tight ${
                        stat.label === "Total order value"
                          ? "text-xl sm:text-2xl"
                          : "text-3xl"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                  >
                    <Icon size={19} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                  {stat.detail}
                </p>
              </article>
            );
          })}
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Order history</h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Search by reference, status, or product name.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <FaSearch
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search your orders..."
                  aria-label="Search orders"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-zinc-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-purple-400"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <FiFilter
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter orders by status"
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-9 text-sm font-semibold outline-none focus:border-purple-500 dark:border-zinc-800 dark:bg-black dark:text-white sm:w-48"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="success">Successful</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Showing{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {filteredOrders.length}
              </span>{" "}
              of {orders.length} orders
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-500/10"
              >
                <FiX size={14} />
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <section className="rounded-3xl border-2 border-dashed border-zinc-300 bg-white px-5 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
              {orders.length === 0 ? (
                <FaBoxOpen size={27} />
              ) : (
                <FaSearch size={24} />
              )}
            </div>

            <h3 className="mt-5 text-xl font-black">
              {orders.length === 0
                ? "Your next favourite is waiting."
                : "No matching orders"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {orders.length === 0
                ? "You haven't placed any orders yet. Explore the collection and your purchases will appear here."
                : "Try another reference, product name, or order status."}
            </p>

            {orders.length === 0 ? (
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                <FaShoppingCart size={14} />
                Explore the collection
                <FaArrowRight size={12} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 dark:bg-white dark:text-black"
              >
                Clear filters
              </button>
            )}
          </section>
        ) : (
          <section className="space-y-5">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const items = Array.isArray(order.items) ? order.items : [];

              const itemsSubtotal = items.reduce((sum, item) => {
                return (
                  sum +
                  Number(item.price || 0) * Number(item.quantity || 0)
                );
              }, 0);

              const totalAmount = Number(order.total_amount ?? itemsSubtotal);
              const reference = order.reference || `ORD-${order.id}`;

              return (
                <article
                  key={order.id ?? reference}
                  className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-900 dark:hover:shadow-black/30"
                >
                  {/* Order heading */}
                  <div className="border-b border-zinc-100 bg-gradient-to-r from-zinc-50 via-white to-purple-50/40 p-5 dark:border-zinc-800 dark:from-zinc-900/70 dark:via-zinc-950 dark:to-purple-950/10 sm:p-6">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                          <FiPackage size={22} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">
                            Order reference
                          </p>
                          <p className="mt-1 break-all font-mono text-sm font-bold text-purple-700 dark:text-purple-300 sm:text-base">
                            {reference}
                          </p>

                          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <FaCalendarAlt size={11} />
                            Placed {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${statusInfo.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}
                          />
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {items.length}{" "}
                          {items.length === 1 ? "product" : "products"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Purchased products */}
                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                        Purchased items
                      </h3>
                      <span className="text-xs text-zinc-400">
                        {items.reduce(
                          (sum, item) => sum + Number(item.quantity || 0),
                          0
                        )}{" "}
                        total units
                      </span>
                    </div>

                    {items.length > 0 ? (
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {items.map((item, index) => {
                          const quantity = Number(item.quantity || 0);
                          const price = Number(item.price || 0);
                          const itemName =
                            item.product_name ||
                            item.title ||
                            item.name ||
                            "Product";

                          return (
                            <div
                              key={item.id ?? `${itemName}-${index}`}
                              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
                                  <FaShoppingBag size={16} />
                                </div>

                                <div className="min-w-0">
                                  <p className="line-clamp-2 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                    {itemName}
                                  </p>
                                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Qty:{" "}
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                      {quantity}
                                    </span>
                                    <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">
                                      ·
                                    </span>
                                    {formatNaira(price)} each
                                  </p>
                                </div>
                              </div>

                              <p className="shrink-0 text-right text-sm font-extrabold text-zinc-900 dark:text-white">
                                {formatNaira(price * quantity)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        Item details are not available for this order.
                      </div>
                    )}
                  </div>

                  {/* Order total */}
                  <div className="border-t border-zinc-100 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:px-6 sm:py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Order placed
                        </p>
                        <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          {formatDateTime(order.created_at)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-5 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:justify-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Total amount
                          </p>
                          <p className="mt-1 text-xl font-black tracking-tight text-purple-700 dark:text-purple-300 sm:text-2xl">
                            {formatNaira(totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 py-6 text-center dark:border-zinc-800 sm:flex-row sm:text-left">
          <div>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
              YossyVogue · Your style, your story.
            </p>
            <p className="mt-1 text-[11px] text-zinc-400">
              Your order overview at a glance.
            </p>
          </div>

          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <FaCheckCircle className="text-emerald-500" size={12} />
            Order history
          </p>
        </footer>
      </main>
    </div>
  );
};

export default OrderHistory;