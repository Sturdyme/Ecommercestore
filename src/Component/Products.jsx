import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { formatNaira } from "../Utilities/currency";
import axios from "axios";
import AOS from "aos";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Filter,
  Heart,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { useCart } from "./CartContext";
import { getProductImage } from "../Utilities/productImage";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const params = new URLSearchParams();

        if (category) {
          params.set("category", category);
        }

        const query = params.toString();
        const url = `${API_URL}/api/products${query ? `?${query}` : ""}`;

        const response = await axios.get(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        const responseData = response.data?.data ?? response.data;
        const items = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];

        setProducts(items);
      } catch (error) {
        if (error.name === "CanceledError") return;

        console.error("Failed to fetch products:", error);
        setFetchError(
          "We couldn't load the collection right now. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [category]);

  const visibleProducts = products
    .filter((product) => {
      const query = searchTerm.trim().toLowerCase();

      if (!query) return true;

      return [
        product.name,
        product.title,
        product.brand,
        product.category,
        product.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "name") {
        return String(a.name || a.title || "").localeCompare(
          String(b.name || b.title || "")
        );
      }

      return 0;
    })
    .slice(0, 10);

  const handleAddToCart = (product) => {
    const imgSrc = getProductImage(product);

    addToCart({ ...product, image: imgSrc });
    setAddedProductId(product.id);

    window.setTimeout(() => {
      setAddedProductId((current) =>
        current === product.id ? null : current
      );
    }, 1400);
  };

  const collectionTitle = category
    ? `${category} Collection`
    : "New Arrivals";

  return (
    <section className="min-h-screen bg-white py-10 text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Collection heading */}
        <div
          data-aos="fade-up"
          className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-8 dark:border-zinc-800 sm:mb-10 sm:pb-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <Sparkles className="size-3.5" />
              Curated for you
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              {collectionTitle}
              <span className="ml-2 text-violet-600 dark:text-violet-400">
                .
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-base">
              Discover thoughtfully selected pieces, everyday essentials,
              and fresh finds made for your lifestyle.
            </p>
          </div>

          <Link
            to="/deals"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 dark:bg-white dark:text-black dark:hover:bg-violet-400"
          >
            Explore deals
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Collection toolbar */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
            <ShoppingBag className="size-4" />
            <span>
              {loading
                ? "Loading products..."
                : `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} displayed`}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search this collection..."
                aria-label="Search products"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort products"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 sm:w-48"
              >
                <option value="featured">Default order</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="aspect-square animate-pulse bg-slate-100 dark:bg-zinc-900" />
                <div className="space-y-3 p-3 sm:p-4">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
                  <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && fetchError && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-950 sm:px-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
              <RefreshCw className="size-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-zinc-400">
              {fetchError}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 dark:bg-white dark:text-black dark:hover:bg-violet-400"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !fetchError && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {visibleProducts.map((product, index) => {
              const imgSrc = getProductImage(product);
              const productName = product.title || product.name || "Product";
              const stock = Number(product.stock);
              const hasStock =
                product.stock !== null &&
                product.stock !== undefined &&
                product.stock !== "";
              const outOfStock = hasStock && stock <= 0;
              const ratingValue =
                typeof product.rating === "object"
                  ? product.rating?.rate
                  : product.rating;
              const rating =
                Number(ratingValue) > 0 ? Number(ratingValue).toFixed(1) : null;
              const isAdded = addedProductId === product.id;

              return (
                <article
                  key={product.id}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 50, 200)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-black/40"
                >
                  {/* Product image */}
                  <Link
                    to={`/products/${product.id}`}
                    aria-label={`View ${productName}`}
                    className="relative block aspect-square overflow-hidden bg-slate-50 dark:bg-zinc-900"
                  >
                    <img
                      src={imgSrc}
                      alt={productName}
                      loading="lazy"
                      className="size-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 sm:p-6"
                    />

                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-white/70 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-zinc-200">
                        <Sparkles className="size-3 text-violet-500" />
                        New find
                      </span>
                    </div>

                    {rating && (
                      <div className="absolute right-3 top-3">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur dark:bg-zinc-950/95 dark:text-white">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {rating}
                        </span>
                      </div>
                    )}

                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-[2px] dark:bg-black/60">
                        <span className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-black">
                          Out of stock
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-sm:hidden">
                      <span className="flex items-center justify-center gap-2 rounded-xl bg-slate-950/95 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur dark:bg-white/95 dark:text-black">
                        View product
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>

                  {/* Product information */}
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <div className="mb-2">
                      <p className="mb-1.5 truncate text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500">
                        {product.brand || product.category || "YossyVogue"}
                      </p>

                      <Link
                        to={`/products/${product.id}`}
                        className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-800 transition hover:text-violet-700 dark:text-slate-100 dark:hover:text-violet-400 sm:text-[15px]"
                      >
                        {productName}
                      </Link>
                    </div>

                    <div className="mb-4 mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                      <p className="text-sm font-black tracking-tight text-violet-700 dark:text-violet-400 sm:text-base">
                        {formatNaira(product.price)}
                      </p>

                      {hasStock && (
                        <span
                          className={`text-[10px] font-medium ${
                            outOfStock
                              ? "text-rose-500"
                              : stock <= 5
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-slate-400 dark:text-zinc-500"
                          }`}
                        >
                          {outOfStock
                            ? "Unavailable"
                            : stock <= 5
                              ? `${stock} left`
                              : "In stock"}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={outOfStock || isAdded}
                      onClick={() => handleAddToCart(product)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed sm:text-sm ${
                        outOfStock
                          ? "bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500"
                          : isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-950 text-white hover:bg-violet-700 dark:bg-white dark:text-black dark:hover:bg-violet-400"
                      }`}
                    >
                      {outOfStock ? (
                        <>
                          <Package className="size-4" />
                          Out of stock
                        </>
                      ) : isAdded ? (
                        <>
                          <Check className="size-4" />
                          Added to cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="size-4" />
                          Add to cart
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && visibleProducts.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950 sm:px-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-zinc-900 dark:text-zinc-500">
              <Search className="size-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-zinc-400">
              {searchTerm
                ? `We couldn't find products matching "${searchTerm}". Try another search.`
                : "There are no products in this collection yet. Check back soon for new arrivals."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 dark:bg-white dark:text-black dark:hover:bg-violet-400"
              >
                Clear search
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        )}

        {/* Collection footer */}
        {!loading && !fetchError && products.length > 10 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:px-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Showing up to 10 products from this collection.
            </p>

            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 transition hover:text-violet-700 dark:text-white dark:hover:text-violet-400"
            >
              Explore categories
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;