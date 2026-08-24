// src/Pages/Admin/ManageProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Star, Package, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { getProductImage } from "../Utilities/productImage";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?all=true`);
      setProducts(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Delete "${name}"? This can't be undone.`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  // Animation Variants
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
        <p className="text-gray-500 font-medium text-sm">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchProducts}
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
            Manage Products
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {products.length} Total
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review, track, and remove catalog items
          </p>
        </div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center"
        >
          <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300">No products found</h3>
          <p className="text-xs text-gray-400 mt-1">Your inventory is currently empty.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                variants={itemVariants}
                exit="exit"
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
              >
                {/* Product Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getProductImage(p)}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10"
                  />
                  {p.is_featured && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 p-1 rounded-full shadow-sm">
                      <Star className="w-3 h-3 fill-amber-950" />
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {p.name}
                    </p>
                    {p.is_featured && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      ${Number(p.price).toFixed(2)}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-[11px]">
                      {p.category || "Uncategorized"}
                    </span>
                    <span>•</span>
                    <span
                      className={`font-medium ${
                        p.stock < 5
                          ? "text-red-500 font-semibold"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {p.stock} in stock
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={deletingId === p.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {deletingId === p.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </span>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ManageProducts;