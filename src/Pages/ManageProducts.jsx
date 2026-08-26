import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Plus, RefreshCw, Trash2 } from "lucide-react";
import { getProductImage } from "../Utilities/productImage";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products?all=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
    } catch (requestError) {
      console.error(requestError);
      window.alert(requestError.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-red-500">
        <AlertCircle className="h-10 w-10" />
        <p className="font-semibold">{error}</p>
        <button
          type="button"
          onClick={fetchProducts}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-12">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Manage Products</h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Review and remove products from your store catalog.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-gray-400">No products found.</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900"
            >
              <img
                src={getProductImage(product)}
                alt={product.name || "Product"}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {product.name}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {product.category || "Uncategorized"} • ${product.price} • {product.stock} in stock
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(product.id, product.name)}
                disabled={deletingId === product.id}
                className="inline-flex items-center justify-center gap-2 self-end rounded-xl px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50 sm:self-center dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                {deletingId === product.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;