import { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Wallet,
  User,
  LogOut,
  ChevronRight,
  Plus,
  Menu,
  X,
  Camera,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Package,
  Boxes,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "./CartContext";
import { FaYoast } from "react-icons/fa";

const PRODUCT_CATEGORIES = [
  "Clothing",
  "Mobiles",
  "Electronics",
  "Cameras",
  "Chairs",
  "Furniture",
  "Home Theaters",
  "Accessories",
  "Lightings",
  "Sports",
  "Groceries",
  "Books",
  "Toys",
  "Home Appliances",
  "Hair Extensions & Wigs",
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.00);

  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const searchRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          const savedProfilePic = localStorage.getItem(`profilePic_${parsed.email}`);
          if (savedProfilePic) parsed.profilePic = savedProfilePic;
        }
        return parsed;
      }
    } catch (err) {
      console.error("Failed to parse stored user", err);
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const profilePic = user?.profilePic;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Fetch Wallet Balance
  const fetchWalletBalance = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.balance ?? 0.00);
      }
    } catch (err) {
      console.error("Failed to fetch wallet balance", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWalletBalance();
    }

    const handleWalletUpdate = () => fetchWalletBalance();
    window.addEventListener("walletUpdated", handleWalletUpdate);
    return () => window.removeEventListener("walletUpdated", handleWalletUpdate);
  }, [isLoggedIn]);

  // Navbar scroll visibility logic
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Handle body overflow for mobile drawer
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [open]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync user state on login event
  useEffect(() => {
    const handleUserLogin = (event) => {
      let userData = null;
      if (event?.detail) {
        userData = event.detail;
      } else {
        try {
          const stored = localStorage.getItem("user");
          if (stored && stored !== "undefined") {
            userData = JSON.parse(stored);
          }
        } catch (err) {
          console.error("Failed to parse stored user on userLogin", err);
        }
      }

      if (userData?.email) {
        const savedProfilePic = localStorage.getItem(`profilePic_${userData.email}`);
        if (savedProfilePic) {
          userData.profilePic = savedProfilePic;
        }
      }
      setUser(userData);
      setIsLoggedIn(Boolean(userData));
    };

    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  // Search debounce API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed", err);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, profilePic: reader.result };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (user?.email) {
        localStorage.setItem(`profilePic_${user.email}`, reader.result);
      }
      setUser(updatedUser);
      setUploading(false);
      setProfileDropdownOpen(false);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("admin_pin_verified");
    setUser(null);
    setIsLoggedIn(false);
    setOpen(false);
    setProfileDropdownOpen(false);
    window.dispatchEvent(new Event("userLogout"));
    navigate("/login");
  };

  const handleMobileCategoryClick = (category) => {
    setOpen(false);
    setMobileCategoriesOpen(false);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-[72px] z-[100] bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/80 transition-transform duration-300 px-4 lg:px-10 flex justify-between items-center ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-300">
            <FaYoast className="w-5 h-5 fill-current" />
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            YUNA<span className="text-purple-600 dark:text-purple-400">VOGUE</span>
          </h2>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, trends, categories..."
              className="w-full bg-gray-100/80 dark:bg-gray-800/80 dark:text-white border border-transparent focus:border-purple-500/30 pl-11 pr-4 py-2.5 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 max-h-80 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setShowResults(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                    >
                      <img
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {product.name}
                        </span>
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                          ₦{Number(product.price).toLocaleString("en-NG")}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-4 text-center text-xs text-gray-400">
                    No products found matching "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 lg:gap-4">
          <div className="hidden lg:flex dark:text-white items-center">
            <ThemeToggle />
          </div>

          {/* Desktop Wallet Badge */}
          {isLoggedIn && (
            <Link
              to="/wallet"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 rounded-2xl font-bold text-xs hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200/60 dark:border-purple-800/50 shadow-sm"
            >
              <Wallet className="w-4 h-4 text-purple-500" />
              <span>
                ₦{Number(walletBalance).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span>
            </Link>
          )}

          {/* Cart Trigger */}
          <Link
            to="/cart"
            className="relative p-2.5 bg-gray-100/70 dark:bg-gray-800/70 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Desktop User Account Trigger */}
          <div className="hidden lg:block relative" ref={profileDropdownRef}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-10 h-10 rounded-2xl border-2 border-purple-500/80 overflow-hidden shadow-md shadow-purple-500/10 hover:border-purple-600 transition-all flex items-center justify-center bg-purple-50 dark:bg-purple-950"
                >
                  {profilePic ? (
                    <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                    >
                      {/* Dropdown Header */}
                      <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/40 bg-white/10 flex items-center justify-center flex-shrink-0">
                            {profilePic ? (
                              <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm truncate">
                              {user?.name || "User Account"}
                            </p>
                            <p className="text-xs text-purple-100 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Photo Upload Option */}
                      <div className="border-b border-gray-100 dark:border-gray-800">
                        <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                          <Camera className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {uploading ? "Uploading..." : "Change Profile Photo"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            disabled={uploading}
                            className="hidden"
                            ref={fileInputRef}
                          />
                        </label>
                      </div>

                      {/* Admin Links */}
                      {user?.role === "admin" && (
                        <div className="py-1 border-b border-gray-100 dark:border-gray-800 bg-purple-50/40 dark:bg-purple-950/20">
                          <p className="px-4 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-purple-500">
                            Admin Control
                          </p>
                          <button
                            onClick={() => {
                              navigate("/admin/products/new");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Product
                          </button>
                          <button
                            onClick={() => {
                              navigate("/admin/products");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors"
                          >
                            <Boxes className="w-3.5 h-3.5" /> Manage Products
                          </button>
                          <button
                            onClick={() => {
                              navigate("/admin/users");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Manage Users
                          </button>
                          <button
                            onClick={() => {
                              navigate("/admin/orders");
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors"
                          >
                            <Package className="w-3.5 h-3.5" /> Manage Orders
                          </button>
                        </div>
                      )}

                      {/* Customer Quick Links */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate("/wallet");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Wallet className="w-4 h-4 text-gray-400" /> My Wallet
                          </span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            ₦{Number(walletBalance).toFixed(0)}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            navigate("/profile");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-400" /> Account Settings
                        </button>

                        <button
                          onClick={() => {
                            navigate("/admin");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" /> Admin Dashboard
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-t border-gray-100 dark:border-gray-800 mt-1"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md hover:scale-[1.02] transition-transform"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Drawer Trigger */}
          <button
            onClick={() => setOpen(true)}
            className="p-2.5 bg-purple-600 text-white rounded-2xl lg:hidden shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Offcanvas Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[120] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Offcanvas Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-[85%] max-w-[380px] h-full bg-white dark:bg-gray-950 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Close Drawer Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 left-5 z-10 p-2 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20 active:scale-90 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Drawer User Banner */}
              <div className="p-6 pt-16 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-b-[32px] relative overflow-hidden">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4 relative z-10">
                    <label className="cursor-pointer relative group flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/30 overflow-hidden flex items-center justify-center">
                        {profilePic ? (
                          <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <User className="w-8 h-8 text-white" />
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">Uploading</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black truncate">
                        Hey, {user?.name?.split(" ")[0] || "User"}!
                      </h3>
                      <p className="text-xs text-purple-200 truncate">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 relative z-10">
                    <h3 className="text-xl font-black">Welcome to YunaVogue</h3>
                    <p className="text-xs text-purple-100">
                      Sign in to unlock deals, wallet checkout, and order history.
                    </p>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/signup");
                      }}
                      className="bg-white text-purple-700 px-5 py-2.5 rounded-xl font-black text-xs shadow-md"
                    >
                      Join Yuna Collective
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Navigation List */}
              <div className="flex-1 px-5 py-6 overflow-y-auto space-y-6">
                {/* Wallet Balance Card */}
                {isLoggedIn && (
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-600 text-white rounded-xl">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">
                          Wallet Balance
                        </p>
                        <p className="text-base font-black text-gray-900 dark:text-white">
                          ₦{Number(walletBalance).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/wallet");
                      }}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Top Up
                    </button>
                  </div>
                )}

                {/* Main Links */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    <AnimatedMobileLink to="/superdeals" label="Super Deals" setOpen={setOpen} />
                    <AnimatedMobileLink to="/homeappliances" label="Home Appliances" setOpen={setOpen} />
                    <AnimatedMobileLink to="/cart" label="Shopping Cart" setOpen={setOpen} count={totalItems} />

                    {/* Categories Accordion */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setMobileCategoriesOpen((isOpen) => !isOpen)}
                        className="flex w-full items-center justify-between p-3.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          Categories
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            mobileCategoriesOpen ? "rotate-90 text-purple-600" : ""
                          }`}
                        />
                      </button>

                      {mobileCategoriesOpen && (
                        <div className="ml-3 mt-1 pl-3 border-l-2 border-purple-200 dark:border-purple-800/50 space-y-1">
                          {PRODUCT_CATEGORIES.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => handleMobileCategoryClick(category)}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                              {category}
                              <ChevronRight className="w-3 h-3 text-gray-300" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account & Admin Navigation */}
                {isLoggedIn && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">
                      Account
                    </p>
                    <div className="space-y-1">
                      <AnimatedMobileLink to="/wallet" label="My Wallet" setOpen={setOpen} />
                      <AnimatedMobileLink to="/profile" label="My Profile" setOpen={setOpen} />
                      <AnimatedMobileLink to="/order" label="Order History" setOpen={setOpen} />

                      {user?.role === "admin" && (
                        <div className="pt-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2 px-2">
                            Admin Area
                          </p>
                          <AnimatedMobileLink to="/admin/products/new" label="Add New Product" setOpen={setOpen} />
                          <AnimatedMobileLink to="/admin/products" label="Manage Products" setOpen={setOpen} />
                          <AnimatedMobileLink to="/admin/users" label="Manage Users" setOpen={setOpen} />
                          <AnimatedMobileLink to="/admin/orders" label="Manage Orders" setOpen={setOpen} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Sign Out Action */}
              {isLoggedIn && (
                <div className="p-5 border-t border-gray-100 dark:border-gray-900">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-2xl font-bold text-xs hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const AnimatedMobileLink = ({ to, label, setOpen, count }) => (
  <Link
    to={to}
    onClick={() => setOpen(false)}
    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {label}
      </span>
      {count > 0 && (
        <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-black">
          {count}
        </span>
      )}
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 transition-colors" />
  </Link>
);

export default Navbar;