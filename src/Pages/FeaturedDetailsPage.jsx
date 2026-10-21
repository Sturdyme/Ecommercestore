import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Package,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";

import { useCart } from "../Component/CartContext";
import { formatNaira } from "../Utilities/currency";
import { extraItems } from "../Component/FeaturedData";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const FeaturedDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setItem(null);
      setImageError(false);
      setAdded(false);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This product could not be found."
              : "Unable to load this product. Please try again."
          );
        }

        const result = await response.json();
        const product = result?.data ?? result?.product ?? result;

        if (!product || !product.id) {
          throw new Error("The requested product could not be found.");
        }

        setItem(product);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Error loading featured product:", err);
        setError(
          err.message || "Could not load this product. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/#featuredsection");
  };

  const productImage =
    item?.image_url ||
    item?.image ||
    item?.thumbnail ||
    extraItems?.[0]?.image ||
    "";

  const productTitle = item?.title || item?.name || "Featured Product";

  const handleAddToCart = () => {
    if (!item) return;

    addToCart({
      ...item,
      id: item.id,
      title: productTitle,
      name: item.name || productTitle,
      description: item.description || "",
      stock: item.stock ?? 1,
      price: Number(item.price) || 0,
      image: productImage,
      image_url: item.image_url || productImage,
      quantity: 1,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pb-16 pt-28 dark:bg-gray-950 sm:px-6">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-8 h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="grid gap-8 rounded-3xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-8 md:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />

            <div className="flex flex-col gap-5 py-3">
              <div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-9 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-8 w-2/5 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-20 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-auto h-14 rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-24 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
            <PackageSearch
              size={30}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>

          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {error ? "Unable to load product" : "Product not found"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error ||
              "This product may have been removed or is no longer available."}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-gray-700 dark:text-gray-200 dark:hover:text-purple-400"
            >
              <ArrowLeft size={16} />
              Go back
            </button>

            {error && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                Try again
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 px-4 pb-16 pt-24 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8 lg:pt-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-[35rem] h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Breadcrumb / back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7 flex flex-wrap items-center gap-2 text-sm"
        >
          <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-600 shadow-sm transition hover:border-purple-300 hover:text-purple-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-purple-400"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back
          </button>

          <span className="text-gray-300 dark:text-gray-700">/</span>
          <span className="truncate font-medium text-gray-500 dark:text-gray-400">
            {item.category || "Featured Products"}
          </span>
        </motion.div>

        {/* Product layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid items-start gap-6 md:grid-cols-2 md:gap-9 lg:gap-12"
        >
          {/* Product image */}
          <div className="min-w-0">
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">
              <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50/95 px-3 py-1.5 text-xs font-bold text-purple-700 backdrop-blur dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                <Sparkles size={13} />
                Featured item
              </div>

              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/70 sm:p-8">
                {productImage && !imageError ? (
                  <img
                    src={productImage}
                    alt={productTitle}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Package size={52} strokeWidth={1.2} />
                    <span className="text-sm">Image unavailable</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/70">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <ShieldCheck
                    size={17}
                    className="shrink-0 text-green-600 dark:text-green-400"
                  />
                  Quality-focused shopping
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <CheckCircle2 size={15} />
                  Selected for you
                </div>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="flex min-w-0 flex-col rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7 lg:p-8">
            <div className="mb-5">
              <span className="inline-flex max-w-full items-center rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                <span className="truncate">
                  {item.category || "Special Collection"}
                </span>
              </span>

              <h1 className="mt-4 break-words text-2xl font-black leading-tight tracking-tight text-gray-950 dark:text-white sm:text-3xl lg:text-4xl">
                {productTitle}
              </h1>

              {item.description && (
                <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
                  {item.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="border-y border-gray-100 py-5 dark:border-gray-800">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                Price
              </p>

              <p className="text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400 sm:text-4xl">
                {formatNaira(Number(item.price) || 0)}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Price displayed in Nigerian Naira.
              </p>
            </div>

            {/* Product information */}
            <div className="space-y-4 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10">
                  <Package
                    size={19}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Product information
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {item.description
                      ? "Review the product details above before adding this item to your cart."
                      : "Product details are currently limited. Contact our support team if you need more information."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10">
                  <Truck
                    size={19}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Delivery and fulfilment
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Available delivery and fulfilment options can be reviewed
                    during checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-2 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-4 text-sm font-extrabold text-white shadow-lg transition duration-200 active:scale-[0.98] ${
                  added
                    ? "bg-green-600 shadow-green-600/15"
                    : "bg-gray-950 shadow-gray-950/10 hover:bg-purple-700 dark:bg-purple-600 dark:shadow-purple-600/20 dark:hover:bg-purple-500"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 size={19} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={19} />
                    Add to Cart
                    <ArrowRight size={17} className="ml-auto" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-purple-400"
              >
                <ShoppingBag size={17} />
                Continue shopping
              </button>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-gray-400">
              Your item will be available in your cart for checkout.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDetails;