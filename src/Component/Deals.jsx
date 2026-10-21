import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import FeaturedCard from "./FeaturedCard";
import { useCart } from "./CartContext";
import { useDeals } from "../hooks/useDeals";

const Deals = () => {
  const { products = [], loading, error } = useDeals();
  const { addToCart } = useCart();

  const skeletons = Array.from({ length: 10 }, (_, index) => index);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 pt-24 pb-16 dark:bg-gray-950">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-[35rem] h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            to="/#featuredsection"
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-purple-300 hover:text-purple-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500 dark:hover:text-purple-400"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Featured Products
          </Link>
        </motion.div>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 border-b border-gray-200 pb-7 dark:border-gray-800 sm:mb-10"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
            <Sparkles size={14} />
            Explore our collection
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
                Featured{" "}
                <span className="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
                Discover products selected for you. Find your next favourite
                and add it to your cart in just a few clicks.
              </p>
            </div>

            {!loading && !error && products.length > 0 && (
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                <PackageSearch
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
                <span>
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div
            className="grid grid-cols-2 justify-items-stretch gap-3 min-[480px]:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-5"
            aria-label="Loading products"
          >
            {skeletons.map((item) => (
              <div
                key={item}
                className="w-full min-w-0 animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900 sm:p-3"
              >
                <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="mt-4 h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-2 h-3 w-2/5 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-4 h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-900/50 dark:bg-gray-900"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
              <PackageSearch
                size={26}
                className="text-red-500 dark:text-red-400"
              />
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              We couldn't load the products
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
              {typeof error === "string"
                ? error
                : "Something went wrong while fetching the products. Please try again."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 active:scale-95"
            >
              Try again
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
              <PackageSearch
                size={30}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No featured products yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
              We're updating our collection. Please check back soon to discover
              new products.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
            >
              Return home
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 },
                },
              }}
              className="grid grid-cols-2 justify-items-stretch gap-3 min-[480px]:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-5"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full min-w-0"
                >
                  <FeaturedCard
                    id={product.id}
                    image={product.image_url}
                    title={product.name}
                    price={product.price}
                    onAddToCart={() => addToCart(product)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom navigation */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:px-7">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  Found something you love?
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Keep exploring and discover more at YossyVogue.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 active:scale-95 sm:w-auto"
              >
                Back to home
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Deals;