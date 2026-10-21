
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiArrowLeft,
  FiShoppingBag,
  FiShoppingCart,
  FiTrash2,
  FiArrowUpRight,
  FiCheckCircle,
  FiPackage,
  FiShield,
} from "react-icons/fi";

import { useCart } from "../Component/CartContext";
import { useWishlist } from "../Utilities/WishlistContext";
import { formatNaira } from "../Utilities/currency";

const FALLBACK_IMAGE =
  "https://placehold.co/600x600/f3f0f8/6d28d9?text=YossyVogue";

const Wishlist = () => {
  const { wishlist = [], removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [notice, setNotice] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const getProductName = (product) =>
    product?.name || product?.title || "Untitled product";

  const getProductImage = (product) =>
    product?.image ||
    product?.image_url ||
    product?.thumbnail ||
    product?.product_image ||
    FALLBACK_IMAGE;

  const getProductPrice = (price) => {
    const amount = Number(price);
    return Number.isFinite(amount) ? formatNaira(amount) : formatNaira(0);
  };

  const handleMoveToCart = (product) => {
    if (!product?.id || busyId !== null) return;

    setBusyId(product.id);
    setNotice(null);

    try {
      addToCart({
        ...product,
        name: getProductName(product),
        image: getProductImage(product),
      });

      removeFromWishlist(product.id);

      setNotice({
        type: "success",
        message: `${getProductName(product)} was moved to your cart.`,
      });
    } catch (error) {
      console.error("Failed to move wishlist item to cart:", error);

      setNotice({
        type: "error",
        message: "We couldn't move this item to your cart. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = (product) => {
    if (!product?.id) return;

    try {
      removeFromWishlist(product.id);

      setNotice({
        type: "success",
        message: `${getProductName(product)} was removed from your wishlist.`,
      });
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);

      setNotice({
        type: "error",
        message: "Couldn't remove this item. Please try again.",
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-50 px-4 py-6 text-gray-900 dark:bg-[#09090b] dark:text-white sm:px-6 sm:py-10 lg:px-8">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-purple-100/70 via-purple-50/30 to-transparent dark:from-purple-950/25 dark:via-purple-950/10 dark:to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        {/* Page navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-purple-200 hover:text-purple-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-800 dark:hover:text-purple-400"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <FiShield className="text-purple-600 dark:text-purple-400" />
            Your personal collection
          </div>
        </div>

        {/* Hero header */}
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="relative p-6 sm:p-9 lg:p-12">
            <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-purple-100/70 blur-3xl dark:bg-purple-900/20" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                  <FiHeart className="fill-current" />
                  Saved with love
                </div>

                <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
                  Your Wishlist
                  <span className="text-purple-600 dark:text-purple-400">
                    .
                  </span>
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                  Keep the things you love in one place. Revisit your favourite
                  finds and add them to your cart whenever you're ready.
                </p>
              </div>

              <div className="flex items-center gap-4 self-start rounded-2xl border border-gray-100 bg-gray-50/90 p-4 dark:border-gray-800 dark:bg-gray-800/70 md:self-center md:p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
                  <FiHeart size={23} />
                </div>

                <div>
                  <p className="text-2xl font-black tabular-nums text-gray-900 dark:text-white">
                    {wishlist.length}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Saved {wishlist.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-800/30">
            <div className="px-3 py-4 text-center sm:py-5">
              <FiHeart className="mx-auto mb-2 text-lg text-purple-600 dark:text-purple-400" />
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 sm:text-xs">
                Your favourites
              </p>
            </div>

            <div className="border-x border-gray-100 px-3 py-4 text-center dark:border-gray-800 sm:py-5">
              <FiShoppingBag className="mx-auto mb-2 text-lg text-purple-600 dark:text-purple-400" />
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 sm:text-xs">
                Easy shopping
              </p>
            </div>

            <div className="px-3 py-4 text-center sm:py-5">
              <FiPackage className="mx-auto mb-2 text-lg text-purple-600 dark:text-purple-400" />
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 sm:text-xs">
                All in one place
              </p>
            </div>
          </div>
        </section>

        {/* Action feedback */}
        {notice && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${
              notice.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
            }`}
          >
            {notice.type === "success" ? (
              <FiCheckCircle className="mt-0.5 shrink-0" size={19} />
            ) : (
              <FiShield className="mt-0.5 shrink-0" size={19} />
            )}

            <p className="flex-1 text-sm font-medium">{notice.message}</p>

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
              className="text-current opacity-70 transition hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Wishlist contents */}
        {wishlist.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-5 py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:px-10 sm:py-20">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <FiHeart size={42} />
            </div>

            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              A little room for inspiration
            </p>

            <h2 className="text-2xl font-black text-gray-950 dark:text-white sm:text-3xl">
              Your wishlist is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
              You haven't saved anything yet. Browse our collection and tap
              the heart on products you'd love to keep.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition hover:-translate-y-0.5 hover:bg-purple-700"
            >
              <FiShoppingBag size={17} />
              Explore products
              <FiArrowUpRight size={17} />
            </Link>
          </section>
        ) : (
          <>
            {/* Collection heading */}
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-gray-950 dark:text-white sm:text-2xl">
                  Your saved collection
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {wishlist.length}{" "}
                  {wishlist.length === 1 ? "product" : "products"} saved for
                  later
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 transition hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Continue shopping
                <FiArrowUpRight />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {wishlist.map((item) => {
                const productName = getProductName(item);
                const image = getProductImage(item);
                const isMoving = busyId === item.id;

                return (
                  <article
                    key={item.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-950/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-900"
                  >
                    {/* Product image */}
                    <div className="relative m-3 mb-0 overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800">
                      <div className="flex aspect-[4/3] items-center justify-center p-5 sm:p-7">
                        <img
                          src={image}
                          alt={productName}
                          loading="lazy"
                          onError={(event) => {
                            if (event.currentTarget.src !== FALLBACK_IMAGE) {
                              event.currentTarget.src = FALLBACK_IMAGE;
                            }
                          }}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="absolute left-3 top-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/90 dark:text-purple-300">
                          <FiHeart className="fill-current" />
                          Saved
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        aria-label={`Remove ${productName} from wishlist`}
                        title="Remove from wishlist"
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/80 bg-white/95 text-gray-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    {/* Product details */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex-1">
                        {item.category && (
                          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
                            {typeof item.category === "object"
                              ? item.category.name
                              : item.category}
                          </p>
                        )}

                        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-gray-900 dark:text-white">
                          {productName}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          {item.description ||
                            "This product is saved to your wishlist. Add it to your cart whenever you're ready."}
                        </p>

                        <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              Price
                            </p>
                            <p className="text-xl font-black text-purple-700 dark:text-purple-400">
                              {getProductPrice(item.price)}
                            </p>
                          </div>

                          <span className="pb-1 text-[10px] font-semibold text-gray-400">
                            Price shown per item
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(item)}
                          disabled={isMoving || busyId !== null}
                          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-3 py-3.5 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-purple-600 dark:hover:bg-purple-500 sm:px-4"
                        >
                          {isMoving ? (
                            <span>Moving...</span>
                          ) : (
                            <>
                              <FiShoppingCart size={17} />
                              <span>Move to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          disabled={busyId !== null}
                          aria-label={`Remove ${productName}`}
                          title="Remove item"
                          className="flex h-full min-h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        >
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 py-6 text-center dark:border-gray-800 sm:flex-row sm:text-left">
          <p className="text-xs text-gray-400">
            Your favourites, thoughtfully kept with YossyVogue.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 transition hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-400"
          >
            <FiArrowLeft />
            Back to shopping
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default Wishlist;
