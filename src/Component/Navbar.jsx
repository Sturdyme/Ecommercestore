import { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaUser, FaYoast, FaBars, FaTimes, FaSignOutAlt, FaChevronRight, FaWallet, FaPlus } from "react-icons/fa";
import { GiWorld, GiHamburgerMenu } from "react-icons/gi";
import { IoCart } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "./CartContext";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.00);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          const savedProfilePic = localStorage.getItem(`profilePic_${parsed.email}`);
          if (savedProfilePic) parsed.profilePic = savedProfilePic;
        }
        return parsed;
      }
    } catch (err) {
      console.error('Failed to parse stored user', err);
    }
    return null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));
  const profilePic = user?.profilePic;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Fetch Wallet Balance
  const fetchWalletBalance = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.balance ?? 0.00);
      }
    } catch (err) {
      console.error('Failed to fetch wallet balance', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWalletBalance();
    }
    
    const handleWalletUpdate = () => fetchWalletBalance();
    window.addEventListener('walletUpdated', handleWalletUpdate);
    return () => window.removeEventListener('walletUpdated', handleWalletUpdate);
  }, [isLoggedIn]);

  // Logic for scroll visibility and outside clicks...
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

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
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  // Listen for user login event to update profile picture immediately
  useEffect(() => {
    const handleUserLogin = (event) => {
      let userData = null;
      if (event?.detail) {
        userData = event.detail;
      } else {
        try {
          const stored = localStorage.getItem('user');
          if (stored && stored !== 'undefined') {
            userData = JSON.parse(stored);
          }
        } catch (err) {
          console.error('Failed to parse stored user on userLogin', err);
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

    window.addEventListener('userLogin', handleUserLogin);
    return () => window.removeEventListener('userLogin', handleUserLogin);
  }, []);

  // Debounced product search
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
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (user?.email) {
        localStorage.setItem(`profilePic_${user.email}`, reader.result);
      }
      setUser(updatedUser);
      setUploading(false);
      setProfileDropdownOpen(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setOpen(false);
    window.dispatchEvent(new Event('userLogout'));
    navigate('/login');
  };

  const handleMobileCategoryClick = (category) => {
    setOpen(false);
    setMobileCategoriesOpen(false);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full h-[72px] z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 lg:px-10 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 transition-transform duration-500 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-center group">
          <div className="bg-purple-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <FaYoast className="text-xl text-white" />
          </div>
          <h2 className="text-xl lg:text-2xl text-gray-900 dark:text-white font-black tracking-tighter">
            YUNA<span className="text-purple-500">VOGUE</span>
          </h2>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-10 relative" ref={searchRef}>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search trends..."
              className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white border-none py-2.5 px-6 rounded-2xl text-sm focus:ring-2 focus:ring-purple-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </div>

          {/* Results dropdown */}
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 max-h-80 overflow-y-auto">
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
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{product.name}</span>
                      <span className="text-xs text-gray-400">₦{product.price}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden lg:flex dark:text-white"><ThemeToggle /></div>

          {/* Desktop Wallet Pill Badge */}
          {isLoggedIn && (
            <Link 
              to="/wallet" 
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-xl font-bold text-xs hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-800/50"
            >
              <FaWallet className="text-purple-500" />
              <span>₦{Number(walletBalance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </Link>
          )}
          
          <Link to="/cart" className="relative p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <IoCart className="text-xl text-gray-700 dark:text-gray-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Desktop Auth */}
          <div className="hidden lg:block relative" ref={profileDropdownRef}>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-10 h-10 rounded-xl border-2 border-purple-500 overflow-hidden shadow-lg shadow-purple-200 dark:shadow-none hover:shadow-purple-300 transition-all"
                >
                  {profilePic ? <img src={profilePic} className="w-full h-full object-cover" alt="Profile" /> : <FaUser className="w-full h-full p-2 text-purple-500" />}
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white">
                          {profilePic ? <img src={profilePic} className="w-full h-full object-cover" alt="Profile" /> : <FaUser className="w-full h-full p-2" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{user?.name?.split(' ')[0] || 'User'}</p>
                          <p className="text-xs text-purple-100 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <label className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                          <span className="text-lg">📷</span>
                          <span className="text-sm font-medium">Change Photo</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleProfileImageUpload}
                          disabled={uploading}
                          className="hidden" 
                          ref={fileInputRef}
                        />
                      </label>
                      {uploading && <p className="px-4 py-2 text-xs text-purple-600 dark:text-purple-400">Uploading...</p>}
                    </div>

                    {user?.role === "admin" && (
         <button
         onClick={() => {
         navigate('/admin/products/new');
          setProfileDropdownOpen(false);
          }}
            className="w-full px-4 py-3 text-left text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-t border-gray-100 dark:border-gray-700 text-sm font-semibold"
          >
         Add New Product
       </button>
      )}

                    <button 
                      onClick={() => {
                        navigate('/wallet');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-sm font-medium flex items-center justify-between"
                    >
                      <span>My Wallet</span>
                      <span className="text-xs font-bold text-purple-500">₦{Number(walletBalance).toFixed(0)}</span>
                    </button>

                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-sm"
                    >
                      Settings
                    </button>

                    <button 
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-t border-gray-100 dark:border-gray-700 text-sm font-semibold"
                    >
                      Go to Dashboard
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium border-t border-gray-100 dark:border-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                Sign In
              </button>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setOpen(true)}
            className="p-2.5 bg-purple-500 text-white rounded-xl lg:hidden shadow-lg shadow-purple-200"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-0 z-[120] transition-visibility duration-300 ${open ? "visible" : "invisible"}`}>
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} 
          onClick={() => setOpen(false)}
        />

        <div className={`absolute top-0 right-0 w-[85%] max-w-[380px] h-full bg-white dark:bg-gray-950 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <button 
            onClick={() => setOpen(false)}
            className="absolute top-6 left-[-50px] w-10 h-10 bg-white dark:bg-gray-900 flex items-center justify-center rounded-full shadow-lg text-purple-500"
          >
            <FaTimes />
          </button>

          <div className="h-full flex flex-col">
            {/* Drawer Header */}
            <div className="p-8 pb-8 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-bl-[40px]">
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <label className="cursor-pointer group">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden group-hover:bg-white/30 transition-colors relative">
                      {profilePic ? <img src={profilePic} className="w-full h-full object-cover" alt="Profile" /> : <FaUser className="w-full h-full p-4" />}
                      {uploading && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><span className="text-xs text-white">Loading...</span></div>}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfileImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <div>
                    <h3 className="text-xl font-bold">Hey, {user?.name?.split(' ')[0]}!</h3>
                    <p className="text-xs text-purple-200">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-black">Welcome.</h3>
                  <p className="text-sm text-purple-100">Unlock deals, tracking, and more.</p>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate('/signup');
                    }}
                    className="w-fit bg-white text-purple-600 px-6 py-2 rounded-xl font-bold text-sm"
                  >
                    Join Yuna collective
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              
              {/* Mobile Wallet Display Card */}
              {isLoggedIn && (
                <div className="mb-6 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500 text-white rounded-xl">
                      <FaWallet />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400">Wallet Balance</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white">
                        ₦{Number(walletBalance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setOpen(false);
                      navigate('/wallet');
                    }}
                    className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <FaPlus className="text-[10px]" /> Top Up
                  </button>
                </div>
              )}

              <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-4 ml-2">Main Menu</p>
              
              <div className="flex flex-col gap-1">
                <AnimatedMobileLink delay="100ms" to="/superdeals" label="Super Deals" setOpen={setOpen} />
                <AnimatedMobileLink delay="150ms" to="/homeappliances" label="Home Appliances" setOpen={setOpen} />
                <AnimatedMobileLink delay="200ms" to="/cart" label="Shopping Cart" setOpen={setOpen} count={totalItems} />

                <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                  <button
                    type="button"
                    onClick={() => setMobileCategoriesOpen((isOpen) => !isOpen)}
                    className="flex w-full items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group"
                  >
                    <span className="text-gray-700 dark:text-gray-200 font-semibold group-hover:text-purple-500 transition-colors">
                       Categories
                    </span>
                    <FaChevronRight className={`text-xs text-gray-300 group-hover:text-purple-500 transition-transform ${mobileCategoriesOpen ? "rotate-90" : ""}`} />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="ml-4 border-l border-purple-200 dark:border-purple-800 pl-2">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleMobileCategoryClick(category)}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 transition-colors"
                        >
                          {category}
                          <FaChevronRight className="text-[10px] text-gray-300" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {isLoggedIn && (
                  <>
                    <div className="my-4 border-t border-gray-100 dark:border-gray-800" />
                    <AnimatedMobileLink delay="250ms" to="/wallet" label="My Wallet" setOpen={setOpen} />
                    <AnimatedMobileLink delay="300ms" to="/profile" label="My Profile" setOpen={setOpen} />
                    <AnimatedMobileLink delay="350ms" to="/order" label="Order History" setOpen={setOpen} />
                  </>
                )}
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Appearance</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Footer Logout */}
            {isLoggedIn && (
              <div className="p-6">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-bold transition-all hover:bg-red-100"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const AnimatedMobileLink = ({ to, label, setOpen, count, delay }) => (
  <Link 
    to={to} 
    onClick={() => setOpen(false)}
    style={{ transitionDelay: delay }}
    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group"
  >
    <div className="flex items-center gap-4">
      <span className="text-gray-700 dark:text-gray-200 font-semibold group-hover:text-purple-500 transition-colors">{label}</span>
      {count > 0 && <span className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{count}</span>}
    </div>
    <FaChevronRight className="text-xs text-gray-300 group-hover:text-purple-500 transition-all" />
  </Link>
);

export default Navbar;