
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaBoxOpen,
  FaExclamationCircle,
  FaRedoAlt,
} from "react-icons/fa";

import { useCart } from "./CartContext";
import { getProductImage } from "../Utilities/productImage";
import { formatNaira } from "../Utilities/currency";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/600x600/f3f0f8/6d28d9?text=YossyVogue";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product details from your Laravel API.
  useEffect(() => {
    let cancelled = false;

    const fetchSingleProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setCurrentIndex(0);
      setQuantity(1);
      setAddedToCart(false);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/products/${encodeURIComponent(id)}`
        );

        if (cancelled) return;

        const payload = response.data;

        // Supports a direct product, { product: ... },
        // or a Laravel-style { data: ... } response.
        const fetchedProduct =
          payload?.product ??
          payload?.data?.product ??
          payload?.data ??
          payload;

        if (
          !fetchedProduct ||
          typeof fetchedProduct !== "object" ||
          Array.isArray(fetchedProduct) ||
          (!fetchedProduct.id && !fetchedProduct.name && !fetchedProduct.title)
        ) {
          throw new Error("Invalid product response");
        }

        setProduct(fetchedProduct);
      } catch (err) {
        if (cancelled) return;

        console.error("Error fetching single product:", err);

        setError(
          err.response?.status === 404
            ? "This product could not be found. It may have been removed."
            : "We couldn't load this product. Please check your connection and try again."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSingleProduct();

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  const stock = useMemo(() => {
    const value =
      product?.stock ??
      product?.stock_quantity ??
      product?.quantity ??
      0;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }, [product]);

  const productName = product?.name || product?.title || "Product";

  const productImages = useMemo(() => {
    if (!product) return [];

    const rawImages = Array.isArray(product.images)
      ? product.images
          .map((entry) => {
            if (typeof entry === "string") return entry;

            return (
              entry?.url ||
              entry?.image_url ||
              entry?.image ||
              entry?.path ||
              ""
            );
          })
          .filter(Boolean)
      : [];

    const candidates =
      rawImages.length > 0
        ? rawImages
        : [
            product.image_url ||
              product.image ||
              product.thumbnail ||
              product.product_image ||
              "",
          ].filter(Boolean);

    const resolvedImages = candidates
      .map((image) => getProductImage({ image }))
      .filter((image) => typeof image === "string" && image.length > 0);

    return resolvedImages.length > 0
      ? [...new Set(resolvedImages)]
      : [FALLBACK_IMAGE];
  }, [product]);

  // Keep the active slide valid when the product or gallery changes.
  useEffect(() => {
    setCurrentIndex((index) =>
      Math.min(index, Math.max(0, productImages.length - 1))
    );
  }, [productImages.length]);

  const prevSlide = () => {
    setCurrentIndex((index) =>
      index === 0 ? productImages.length - 1 : index - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((index) =>
      index === productImages.length - 1 ? 0 : index + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
    setAddedToCart(false);
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((current) => Math.min(stock, current + 1));
      setAddedToCart(false);
    }
  };

  const handleAddToCart = () => {
    if (stock < 1 || quantity < 1 || quantity > stock) return;

    try {
      addToCart(
        {
          ...product,
          name: productName,
          image: productImages[currentIndex] || productImages[0],
        },
        quantity
      );

      setAddedToCart(true);
    } catch (err) {
      console.error("Could not add product to cart:", err);
    }
  };

  const formattedPrice = (amount) => {
    const value = Number(amount);
    return Number.isFinite(value) ? formatNaira(value) : formatNaira(0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-[#09090b]">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-36 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="grid gap-8 rounded-3xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:grid-cols-2 md:p-8">
            <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800" />

            <div className="space-y-5 py-3">
              <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-4/5 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-8 w-2/5 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800" />
              <div className="h-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-14 rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-[#09090b]">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl shadow-gray-200/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40">
            <FaExclamationCircle size={28} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Product unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error || "We couldn't find the product you requested."}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-700"
            >
              <FaRedoAlt />
              Try again
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <FaArrowLeft />
              Back to shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isInStock = stock > 0;
  const category = product.category?.name || product.category;
  const brand = product.brand || "YossyVogue Exclusive";

  return (
    <main className="min-h-screen overflow-hidden bg-gray-50 px-4 py-6 text-gray-900 dark:bg-[#09090b] dark:text-white sm:px-6 sm:py-10 lg:px-8">
      {/* Subtle decorative background */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-80 bg-gradient-to-b from-purple-100/60 to-transparent dark:from-purple-950/20 dark:to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        {/* Breadcrumb navigation */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-purple-200 hover:text-purple-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-800 dark:hover:text-purple-400"
          >
            <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Arrivals
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <FaShieldAlt className="text-purple-500" />
            Shop with confidence
          </div>
        </div>

        {/* Main product card */}
        <section className="grid gap-8 overflow-hidden rounded-[2rem] border border-gray-200/80 bg-white p-4 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-10">
          {/* LEFT: Product gallery */}
          <div className="min-w-0">
            <div className="group relative aspect-square overflow-hidden rounded-[1.5rem] border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-purple-50/60 dark:border-gray-800 dark:from-gray-800 dark:via-gray-900 dark:to-purple-950/20">
              {/* Product label */}
              <div className="absolute left-4 top-4 z-20">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-purple-700 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/90 dark:text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  {isInStock ? "Available now" : "Currently unavailable"}
                </span>
              </div>

              {/* Sliding gallery */}
              <div
                className="flex h-full w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {productImages.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="flex h-full w-full shrink-0 items-center justify-center p-6 sm:p-10"
                  >
                    <img
                      src={img}
                      alt={`${productName} view ${index + 1}`}
                      onError={(event) => {
                        if (event.currentTarget.src !== FALLBACK_IMAGE) {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }
                      }}
                      className="h-full w-full max-h-[560px] object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>

              {/* Previous / next controls */}
              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous product image"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/80 bg-white/90 text-gray-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-purple-600 hover:text-white dark:border-gray-700 dark:bg-gray-900/90 dark:text-white sm:left-5 sm:h-12 sm:w-12"
                  >
                    <FaChevronLeft size={13} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next product image"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/80 bg-white/90 text-gray-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-purple-600 hover:text-white dark:border-gray-700 dark:bg-gray-900/90 dark:text-white sm:right-5 sm:h-12 sm:w-12"
                  >
                    <FaChevronRight size={13} />
                  </button>

                  {/* Image position indicator */}
                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-2 backdrop-blur dark:border-gray-700 dark:bg-gray-900/85">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Show image ${index + 1}`}
                        aria-pressed={currentIndex === index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentIndex === index
                            ? "w-6 bg-purple-600"
                            : "w-2 bg-gray-300 hover:bg-purple-300 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    {currentIndex + 1} / {productImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail gallery */}
            {productImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={`${img}-thumbnail-${index}`}
                    type="button"
                    aria-label={`Select product image ${index + 1}`}
                    aria-pressed={currentIndex === index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl border-2 bg-gray-50 p-2 transition dark:bg-gray-800 sm:h-[88px] sm:w-[88px] ${
                      currentIndex === index
                        ? "border-purple-600 ring-4 ring-purple-100 dark:ring-purple-950"
                        : "border-gray-200 hover:border-purple-300 dark:border-gray-700 dark:hover:border-purple-700"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${productName} thumbnail ${index + 1}`}
                      onError={(event) => {
                        if (event.currentTarget.src !== FALLBACK_IMAGE) {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }
                      }}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust information */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl bg-gray-50 p-3 text-center dark:bg-gray-800/70 sm:p-4">
                <FaShieldAlt className="mx-auto mb-2 text-lg text-purple-600 dark:text-purple-400" />
                <p className="text-[10px] font-bold leading-4 text-gray-600 dark:text-gray-300 sm:text-xs">
                  Secure shopping
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-3 text-center dark:bg-gray-800/70 sm:p-4">
                <FaTruck className="mx-auto mb-2 text-lg text-purple-600 dark:text-purple-400" />
                <p className="text-[10px] font-bold leading-4 text-gray-600 dark:text-gray-300 sm:text-xs">
                  Delivery options
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-3 text-center dark:bg-gray-800/70 sm:p-4">
                <FaUndoAlt className="mx-auto mb-2 text-lg text-purple-600 dark:text-purple-400" />
                <p className="text-[10px] font-bold leading-4 text-gray-600 dark:text-gray-300 sm:text-xs">
                  Support available
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Product information */}
          <div className="flex min-w-0 flex-col lg:py-2">
            <div className="flex-1">
              {/* Brand and category */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  {brand}
                </span>

                {category && (
                  <span className="rounded-full border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    {category}
                  </span>
                )}
              </div>

              <h1 className="mt-5 break-words text-3xl font-black leading-tight tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-[2.65rem]">
                {productName}
              </h1>

              <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                Discover quality, style and value with YossyVogue. Explore the
                product details below and add your favourite item to your cart.
              </p>

              {/* Price and availability */}
              <div className="mt-7 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-5 dark:border-purple-900/50 dark:from-purple-950/30 dark:to-gray-900 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  Our price
                </p>

                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                  <p className="text-3xl font-black tracking-tight text-purple-700 dark:text-purple-300 sm:text-4xl">
                    {formattedPrice(product.price)}
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                      isInStock
                        ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                    }`}
                  >
                    {isInStock ? (
                      <FaCheckCircle />
                    ) : (
                      <FaExclamationCircle />
                    )}
                    {isInStock ? `${stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-7">
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-gray-900 dark:text-white">
                  Product description
                </h2>

                <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/40 sm:p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {product.description ||
                      "No description is available for this product yet."}
                  </p>
                </div>
              </div>

              {/* Optional product details */}
              {(product.sku || product.color || product.size) && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {product.sku && (
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Product code
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {product.sku}
                      </p>
                    </div>
                  )}

                  {product.color && (
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Colour
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {product.color}
                      </p>
                    </div>
                  )}

                  {product.size && (
                    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Size
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {product.size}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Purchase controls */}
            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                    Select quantity
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {isInStock
                      ? `Maximum ${stock} item${stock === 1 ? "" : "s"}`
                      : "Currently unavailable"}
                  </p>
                </div>

                <div className="flex items-center rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1 || !isInStock}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    −
                  </button>

                  <span
                    aria-live="polite"
                    className="min-w-[3rem] text-center text-base font-black tabular-nums"
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={increaseQuantity}
                    disabled={!isInStock || quantity >= stock}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order total */}
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 dark:bg-gray-800/70">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {formattedPrice(Number(product.price || 0) * quantity)}
                </span>
              </div>

              {/* Add to cart */}
              <button
                type="button"
                disabled={!isInStock}
                onClick={handleAddToCart}
                className={`mt-4 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-black transition duration-200 active:scale-[0.98] ${
                  !isInStock
                    ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    : addedToCart
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-950 text-white shadow-lg shadow-purple-950/10 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500"
                }`}
              >
                {addedToCart ? <FaCheckCircle size={18} /> : <FaShoppingCart size={18} />}
                {!isInStock
                  ? "Currently Out of Stock"
                  : addedToCart
                    ? "Added to Cart"
                    : "Add to Cart"}
              </button>

              {addedToCart && (
                <p
                  role="status"
                  className="mt-3 text-center text-sm font-semibold text-green-600 dark:text-green-400"
                >
                  Your item has been added to your cart.
                </p>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                <FaBoxOpen className="mr-1 inline-block" />
                Your shopping experience, made simple with YossyVogue.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom reassurance strip */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200/80 bg-white/80 px-5 py-5 text-center dark:border-gray-800 dark:bg-gray-900/80 sm:flex-row sm:gap-3">
          <FaShieldAlt className="text-purple-600 dark:text-purple-400" />
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            Need help with your purchase? Visit our support page for assistance
            with products, orders and delivery.
          </p>
          <Link
            to="/helpsupport"
            className="shrink-0 text-xs font-black text-purple-700 transition hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Get support →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
