import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  ArrowDownUp,
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  CircleDollarSign,
  Filter,
  LayoutGrid,
  List,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import { getProductImage } from "../Utilities/productImage";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [notice, setNotice] = useState("");

  const BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);
    setNotice("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please sign in before managing products.");
      }

      const response = await axios.get(
        `${BASE_URL}/api/products?all=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const responseData = response.data?.data ?? response.data;
      const productList = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
          ? responseData.data
          : [];

      setProducts(productList);
    } catch (requestError) {
      console.error("Failed to fetch products:", requestError);

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load your product catalog. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const inventoryUnits = products.reduce(
      (total, product) => total + (Number(product.stock) || 0),
      0
    );

    const lowStock = products.filter((product) => {
      const stock = Number(product.stock) || 0;
      return stock > 0 && stock <= 5;
    }).length;

    const outOfStock = products.filter(
      (product) => (Number(product.stock) || 0) <= 0
    ).length;

    const inventoryValue = products.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const stock = Number(product.stock) || 0;

      return total + price * Math.max(stock, 0);
    }, 0);

    return {
      totalProducts,
      inventoryUnits,
      lowStock,
      outOfStock,
      inventoryValue,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const productCategory = String(product.category || "").toLowerCase();
      const id = String(product.id ?? "");

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        productCategory.includes(normalizedSearch) ||
        id.includes(normalizedSearch);

      const matchesCategory =
        category === "all" || product.category === category;

      const stock = Number(product.stock) || 0;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && stock > 5) ||
        (stockFilter === "low-stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "out-of-stock" && stock <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return String(a.name || "").localeCompare(String(b.name || ""));

        case "name-desc":
          return String(b.name || "").localeCompare(String(a.name || ""));

        case "price-low":
          return (Number(a.price) || 0) - (Number(b.price) || 0);

        case "price-high":
          return (Number(b.price) || 0) - (Number(a.price) || 0);

        case "stock-low":
          return (Number(a.stock) || 0) - (Number(b.stock) || 0);

        case "newest":
        default:
          return Number(b.id || 0) - Number(a.id || 0);
      }
    });
  }, [products, search, category, stockFilter, sortBy]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  const getStockStatus = (stockValue) => {
    const stock = Number(stockValue) || 0;

    if (stock <= 0) {
      return {
        label: "Out of stock",
        className:
          "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20",
        dot: "bg-red-500",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low stock",
        className:
          "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "In stock",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
      dot: "bg-emerald-500",
    };
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Delete "${name || "this product"}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setNotice("");

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => String(product.id) !== String(id)
        )
      );

      setNotice(`${name || "Product"} was deleted successfully.`);
    } catch (requestError) {
      console.error("Failed to delete product:", requestError);

      window.alert(
        requestError.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStockFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "all" ||
    stockFilter !== "all" ||
    sortBy !== "newest";

  const statCards = [
    {
      label: "Total products",
      value: stats.totalProducts.toLocaleString(),
      detail: "Products in your catalog",
      icon: Package,
      iconStyle:
        "bg-zinc-100 text-zinc-800 dark:bg-white/10 dark:text-white",
    },
    {
      label: "Inventory units",
      value: stats.inventoryUnits.toLocaleString(),
      detail: "Units currently recorded",
      icon: Boxes,
      iconStyle:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
    },
    {
      label: "Low stock",
      value: stats.lowStock.toLocaleString(),
      detail: "Products with 1–5 units",
      icon: AlertCircle,
      iconStyle:
        "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    },
    {
      label: "Inventory value",
      value: formatPrice(stats.inventoryValue),
      detail: "Price × recorded stock",
      icon: CircleDollarSign,
      iconStyle:
        "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-32 rounded-3xl bg-zinc-200 dark:bg-zinc-900" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-900"
              />
            ))}
          </div>

          <div className="h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 rounded-2xl bg-zinc-200 dark:bg-zinc-900"
              />
            ))}
          </div>

          <p className="text-center text-sm text-zinc-500">
            Preparing your product workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
            Couldn't load products
          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchProducts()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Subtle ambient background */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-80 bg-gradient-to-b from-purple-100/60 to-transparent dark:from-purple-950/20 dark:to-transparent" />

      <main className="relative mx-auto max-w-[1600px] space-y-8 px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <ShieldCheck size={14} />
                Store administration
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Manage{" "}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">
                Your product catalog, organized. Review inventory, discover
                low-stock items and keep your store up to date from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => fetchProducts(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <Link
                to="/admin/products/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <Plus size={18} />
                Add product
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Catalog overview
            </span>
            <span>Product management</span>
            <span>Inventory insights</span>
          </div>
        </section>

        {/* Success notification */}
        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Check size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{notice}</p>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Inventory summary */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Inventory overview</h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                A quick look at your current catalog.
              </p>
            </div>
            <span className="hidden rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 sm:inline-flex">
              Live catalog data
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-black/30 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {stat.label}
                      </p>
                      <p className="mt-3 break-words text-2xl font-black tracking-tight sm:text-3xl">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                    {stat.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Inventory alerts */}
        {(stats.lowStock > 0 || stats.outOfStock > 0) && (
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stats.lowStock > 0 && (
              <button
                type="button"
                onClick={() => setStockFilter("low-stock")}
                className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:border-amber-300 dark:border-amber-900/60 dark:bg-amber-950/20 dark:hover:border-amber-800"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <AlertCircle size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    {stats.lowStock} low-stock{" "}
                    {stats.lowStock === 1 ? "product" : "products"}
                  </p>
                  <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/70">
                    Select to review products with five or fewer units.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-amber-700 dark:text-amber-300"
                />
              </button>
            )}

            {stats.outOfStock > 0 && (
              <button
                type="button"
                onClick={() => setStockFilter("out-of-stock")}
                className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-left transition hover:border-red-300 dark:border-red-900/60 dark:bg-red-950/20 dark:hover:border-red-800"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300">
                  <Package size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-red-900 dark:text-red-200">
                    {stats.outOfStock} out-of-stock{" "}
                    {stats.outOfStock === 1 ? "product" : "products"}
                  </p>
                  <p className="mt-1 text-xs text-red-800/80 dark:text-red-300/70">
                    Select to review unavailable inventory.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-red-700 dark:text-red-300"
                />
              </button>
            )}
          </section>
        )}

        {/* Search, filters and sort */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold">Product catalog</h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Search, filter and organize your products.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative min-w-0 sm:min-w-[260px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, category or ID..."
                  aria-label="Search products"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-zinc-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-purple-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="Filter by category"
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-3 pl-9 pr-9 text-sm font-medium outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-black dark:text-white sm:w-44"
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                  aria-label="Filter by stock status"
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-3 pl-9 pr-9 text-sm font-medium outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-black dark:text-white sm:w-44"
                >
                  <option value="all">All stock statuses</option>
                  <option value="in-stock">In stock</option>
                  <option value="low-stock">Low stock</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Showing{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {products.length}
              </span>{" "}
              products
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <ArrowDownUp
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort products"
                  className="w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-8 text-xs font-semibold outline-none focus:border-purple-500 dark:border-zinc-800 dark:bg-black dark:text-white sm:w-auto"
                >
                  <option value="newest">Newest first</option>
                  <option value="name-asc">Name: A–Z</option>
                  <option value="name-desc">Name: Z–A</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="stock-low">Lowest stock</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>

              <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-black">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  className={`rounded-md p-2 transition ${
                    viewMode === "grid"
                      ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  className={`rounded-md p-2 transition ${
                    viewMode === "list"
                      ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <List size={17} />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-500/10"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-zinc-300 bg-white px-5 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              {products.length === 0
                ? "Your catalog is empty"
                : "No matching products"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {products.length === 0
                ? "Add your first product to start building your store catalog."
                : "Try another search term or adjust your filters to find what you're looking for."}
            </p>

            {products.length === 0 ? (
              <Link
                to="/admin/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <Plus size={17} />
                Add your first product
              </Link>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <RefreshCw size={16} />
                Reset filters
              </button>
            )}
          </section>
        ) : (
          <section
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                : "flex flex-col gap-3"
            }
          >
            {filteredProducts.map((product) => {
              const stock = Number(product.stock) || 0;
              const status = getStockStatus(stock);
              const isDeleting =
                String(deletingId) === String(product.id);

              return (
                <article
                  key={product.id}
                  className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-black/30 ${
                    viewMode === "list"
                      ? "flex flex-col sm:flex-row"
                      : "flex flex-col"
                  }`}
                >
                  {/* Product image */}
                  <div
                    className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${
                      viewMode === "list"
                        ? "h-56 sm:h-auto sm:w-52 sm:shrink-0"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/600x450/f4f4f5/71717a?text=Product+Image";
                      }}
                    />

                    <div className="absolute left-3 top-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-sm ring-1 ring-inset ${status.className}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="rounded-lg bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-zinc-700 shadow-sm backdrop-blur dark:bg-black/80 dark:text-zinc-200">
                        ID #{product.id}
                      </span>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="max-w-[75%] truncate rounded-md bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                          {product.category || "Uncategorized"}
                        </span>

                        <span className="text-xs text-zinc-400">
                          {stock} units
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-base font-bold leading-6 text-zinc-900 transition group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-300">
                        {product.name || "Unnamed product"}
                      </h3>

                      {product.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Selling price
                          </p>

                          <p className="mt-1 break-words text-xl font-black tracking-tight">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Stock status
                          </p>
                          <p className="mt-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {stock > 5
                              ? "Healthy"
                              : stock > 0
                                ? "Restock soon"
                                : "Unavailable"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <Package size={15} className="shrink-0" />
                        <span className="truncate">
                          {stock > 0
                            ? `${stock} available`
                            : "No units available"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(product.id, product.name)
                        }
                        disabled={isDeleting || deletingId !== null}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        {isDeleting ? (
                          <RefreshCw size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}

                        <span>
                          {isDeleting ? "Deleting..." : "Delete"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Footer */}
        {products.length > 0 && (
          <footer className="flex flex-col gap-2 border-t border-zinc-200 py-5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredProducts.length} of {products.length} products
            </p>

            <p className="inline-flex items-center gap-2">
              <ShieldCheck size={14} />
              YunaVogue product administration
            </p>
          </footer>
        )}
      </main>
    </div>
  );
};

export default ManageProducts;
