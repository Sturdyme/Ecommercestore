import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  PackageSearch,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import FeaturedCard from "./FeaturedCard";
import { useCart } from "./CartContext";
import { useDeals } from "../hooks/useDeals";

const INITIAL_COUNT = 8;

const FeaturedSection = () => {
  const { products = [], loading, error } = useDeals();
  const { addToCart } = useCart();

  const preview = products.slice(0, INITIAL_COUNT);

  return (
    <section
      id="featuredsection"
      className="relative mx-auto mt-12 max-w-7xl overflow-hidden px-4 pb-10 pt-4 sm:mt-16 sm:px-6 sm:pb-14 lg:mt-20 lg:px-8"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-700/10" />
      <div className="pointer-events-none absolute bottom-10 left-0 -z-10 h-48 w-48 rounded-full bg-indigo-300/10 blur-3xl dark:bg-indigo-700/10" />

      {/* Section heading */}
      <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300 sm:text-xs">
            <Sparkles size={14} />
            Curated for you
          </div>

          <h2 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl lg:text-5xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Products
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base sm:leading-7">
            Discover standout finds, everyday essentials, and products
            worth adding to your collection.
          </p>
        </div>

        <Link
          to="/deals"
          state={{ from: "featuredsection" }}
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 shadow-sm transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300 sm:px-5"
        >
          Explore all
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Subtle divider */}
      <div className="mb-7 h-px bg-gradient-to-r from-purple-500/40 via-zinc-200 to-transparent dark:via-zinc-800 sm:mb-9" />

      {/* Loading state */}
      {loading && (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
          aria-label="Loading featured products"
          aria-busy="true"
        >
          {Array.from({ length: INITIAL_COUNT }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-3xl sm:p-3"
            >
              <div className="aspect-[4/4.5] rounded-xl bg-zinc-200 dark:bg-zinc-800 sm:rounded-2xl" />
              <div className="mt-3 h-3 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-2 h-3 w-2/5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-4 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-3xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-900/50 dark:bg-zinc-950 sm:px-8"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <PackageSearch size={27} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
            Featured products are unavailable
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {typeof error === "string"
              ? error
              : "We couldn't load the product collection. Please try again shortly."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-purple-400"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-5 py-14 text-center dark:border-zinc-800 dark:bg-zinc-950 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
            <PackageSearch size={27} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
            Something exciting is coming
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Our featured collection is being updated. Check back soon to
            discover your next favourite find.
          </p>

          <Link
            to="/deals"
            state={{ from: "featuredsection" }}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-700 transition hover:text-purple-500 dark:text-purple-300"
          >
            Explore current deals
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && preview.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
          >
            {preview.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{
                  duration: 0.35,
                  delay: (index % 4) * 0.06,
                  ease: "easeOut",
                }}
                className="min-w-0"
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

          {/* Collection footer */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/70 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                <Flame size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Find something you love
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {products.length > INITIAL_COUNT
                    ? `${products.length - INITIAL_COUNT} more products are waiting to be explored.`
                    : "Explore the collection for more great finds."}
                </p>
              </div>
            </div>

            <Link
              to="/deals"
              state={{ from: "featuredsection" }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-purple-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-purple-500 dark:hover:text-white sm:w-auto"
            >
              {products.length > INITIAL_COUNT
                ? `View all ${products.length} products`
                : "Explore all products"}
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedSection;
