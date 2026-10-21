import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowRight, CreditCard, Heart, Package, Plus, ShoppingBag, User, Wallet } from "lucide-react";
import api from "../api";
import { useAuth } from "../Component/AuthContext";
import { useCart } from "../Component/CartContext";
import { useWishlist } from "../Utilities/WishlistContext";
import { formatNaira } from "../Utilities/currency";
import bgImage from "../assets/specialOfferImages/shoppingcart.png";

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  return [];
};

const STATUS_STYLES = {
  completed:
    "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  pending:
    "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
};
const STATUS_FALLBACK =
  "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:ring-gray-600";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "";
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ title, value, Icon, tint }) => (
  <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-gray-900 dark:text-white">{value}</p>
    </div>
    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
      <Icon className="h-5 w-5" />
    </span>
  </div>
);

const QuickLink = ({ to, title, text, Icon }) => (
  <Link
    to={to}
    className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-purple-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 dark:bg-gray-800 dark:ring-gray-700 dark:hover:ring-purple-500/40 motion-reduce:transform-none"
  >
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-500/10 dark:text-purple-300">
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
      <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  </Link>
);

const ProductSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
    <div className="h-44 bg-gray-100 dark:bg-gray-700" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-700" />
      <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-700" />
      <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700" />
    </div>
  </div>
);

const ProductCard = ({ product, wishlisted, onAdd, onWishlist }) => (
  <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:ring-gray-700">
    <Link to={`/products/${product.id}`} className="relative block h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        src={product.image_url || "/placeholder.png"}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
      />
      {product.category && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 backdrop-blur dark:bg-gray-900/80 dark:text-gray-200">
          {product.category}
        </span>
      )}
    </Link>
    <div className="p-4">
      <Link to={`/products/${product.id}`} className="block truncate text-sm font-bold text-gray-900 hover:text-purple-600 dark:text-white dark:hover:text-purple-300">
        {product.name}
      </Link>
      <p className="mt-1 text-sm font-black text-purple-600 dark:text-purple-300">{formatNaira(Number(product.price))}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-600/20 transition hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={onWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 ${
            wishlisted
              ? "bg-pink-500 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-pink-500/10"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [balance, setBalance] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(" ")[0] || "there";
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [walletRes, ordersRes, dealsRes] = await Promise.allSettled([
        api.get("/wallet"),
        api.get("/orders"),
        api.get("/products/deals"),
      ]);
      if (cancelled) return;

      if (walletRes.status === "fulfilled") {
        setBalance(Number(walletRes.value.data?.wallet?.balance ?? 0));
      }
      if (ordersRes.status === "fulfilled") {
        setOrders(toList(ordersRes.value.data).slice(0, 4));
      }

      let list = dealsRes.status === "fulfilled" ? toList(dealsRes.value.data) : [];
      if (!list.length) {
        try {
          const { data } = await api.get("/products", { params: { all: 1 } });
          list = toList(data);
        } catch {
          // Leave the section empty.
        }
      }
      if (cancelled) return;

      setProducts(list.slice(0, 6));
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      title: product.name,
      price: Number(product.price),
      image: product.image_url,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, title: product.name, price: Number(product.price), image: product.image_url });
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome + wallet */}
        <Reveal>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-6 text-white shadow-xl shadow-purple-600/20 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">{greeting()},</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{firstName}</h1>
                <p className="mt-2 max-w-md text-sm leading-6 text-purple-100/90">
                  Your wallet, orders and saved items are all here.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/20 backdrop-blur">
                  <p className="flex items-center gap-2 text-xs font-semibold text-purple-100">
                    <Wallet className="h-4 w-4" />
                    Wallet balance
                  </p>
                  <p className="mt-1 text-2xl font-black tracking-tight">
                    {balance === null ? (loading ? "..." : formatNaira(0)) : formatNaira(balance)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/wallet")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-purple-700 shadow-lg transition hover:bg-purple-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                  >
                    <Plus className="h-4 w-4" />
                    Top up
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(totalItems > 0 ? "/checkout" : "/products")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                  >
                    {totalItems > 0 ? "Checkout" : "Shop now"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.05}>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Items in cart" value={totalItems} Icon={ShoppingBag} tint="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300" />
            <StatCard title="Cart subtotal" value={formatNaira(subtotal)} Icon={CreditCard} tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" />
            <StatCard title="Saved to wishlist" value={wishlist.length} Icon={Heart} tint="bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300" />
          </div>
        </Reveal>

        {/* Quick links */}
        <Reveal delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickLink to="/order" title="My orders" text="Track and review your purchases." Icon={Package} />
            <QuickLink to="/wishlist" title="Wishlist" text={`${wishlist.length} saved ${wishlist.length === 1 ? "item" : "items"}.`} Icon={Heart} />
            <QuickLink to="/payments" title="Payments" text="Wallet and card payment history." Icon={CreditCard} />
            <QuickLink to="/profile" title="Profile" text="Your details, password and preferences." Icon={User} />
          </div>
        </Reveal>

        {/* Recent orders + checkout card */}
        <Reveal delay={0.15}>
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Recent orders</h2>
                <Link to="/order" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:underline dark:text-purple-300">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center dark:border-gray-700">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <Package className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
                    {loading ? "Loading your orders..." : "No orders yet"}
                  </p>
                  {!loading && (
                    <>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your purchases will show up here.</p>
                      <Link to="/products" className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700">
                        Start shopping
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
                  {orders.map((order) => (
                    <li key={order.id ?? order.reference} className="flex items-center justify-between gap-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                          <Package className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                            {order.reference || `Order #${order.id}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${
                            STATUS_STYLES[order.status] || STATUS_FALLBACK
                          }`}
                        >
                          {order.status || "unknown"}
                        </span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          {formatNaira(Number(order.total_amount ?? 0))}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-xl"
              style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-purple-900/75" />
              <div className="relative">
                <h2 className="text-xl font-black tracking-tight">
                  {totalItems > 0 ? "Ready to check out?" : "Your cart is empty"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/85">
                  {totalItems > 0
                    ? `${totalItems} ${totalItems === 1 ? "item" : "items"} waiting, ${formatNaira(subtotal)} before delivery.`
                    : "Find something you love and it will be waiting here."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(totalItems > 0 ? "/checkout" : "/products")}
                className="relative mt-8 rounded-xl bg-white px-4 py-3 text-sm font-bold text-purple-700 shadow-lg transition hover:bg-purple-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                {totalItems > 0 ? "Go to checkout" : "Browse products"}
              </button>
            </section>
          </div>
        </Reveal>

        {/* Recommended */}
        <Reveal delay={0.2}>
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Picked for you</h2>
              <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:underline dark:text-purple-300">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((n) => (
                  <ProductSkeleton key={n} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                New products are on the way. Check back soon.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlist.some((item) => item.id === product.id)}
                    onAdd={() => handleAdd(product)}
                    onWishlist={() => toggleWishlist(product)}
                  />
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </div>
  );
};

export default Dashboard;
