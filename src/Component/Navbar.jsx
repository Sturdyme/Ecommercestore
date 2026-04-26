import { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaUser, FaYoast, FaBars, FaTimes, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { GiWorld, GiHamburgerMenu } from "react-icons/gi";
import { IoCart } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "./CartContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));
  const profilePic = user?.profilePic;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setOpen(false);
    navigate('/login');
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
            YOSSY<span className="text-purple-500">VOGUE</span>
          </h2>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-10">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search trends..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-none py-2.5 px-6 rounded-2xl text-sm focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 lg:gap-6">
          <div className="hidden lg:flex dark:text-white"><ThemeToggle /></div>
          
          <Link to="/cart" className="relative p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <IoCart className="text-xl text-gray-700 dark:text-gray-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Desktop Auth */}
          <div className="hidden lg:block">
            {isLoggedIn ? (
              <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-xl border-2 border-purple-500 overflow-hidden shadow-lg shadow-purple-200 dark:shadow-none">
                 {profilePic ? <img src={profilePic} className="w-full h-full object-cover" /> : <FaUser className="w-full h-full p-2 text-purple-500" />}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                Sign In
              </button>
            )}
          </div>

          {/* RIGHT SIDE HAMBURGER */}
          <button 
            onClick={() => setOpen(true)}
            className="p-2.5 bg-purple-500 text-white rounded-xl lg:hidden shadow-lg shadow-purple-200"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </nav>

      {/* RIGHT SIDE DRAWER MENU */}
      <div className={`fixed inset-0 z-[120] transition-visibility duration-300 ${open ? "visible" : "invisible"}`}>
        
        {/* Backdrop glass */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} 
          onClick={() => setOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 w-[85%] max-w-[380px] h-full bg-white dark:bg-gray-950 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          
          {/* Close Button */}
          <button 
            onClick={() => setOpen(false)}
            className="absolute top-6 left-[-50px] w-10 h-10 bg-white dark:bg-gray-900 flex items-center justify-center rounded-full shadow-lg text-purple-500"
          >
            <FaTimes />
          </button>

          <div className="h-full flex flex-col">
            {/* Drawer Header (User Card) */}
            <div className="p-8 pb-10 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-bl-[40px]">
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden">
                     {profilePic ? <img src={profilePic} className="w-full h-full object-cover" /> : <FaUser className="w-full h-full p-4" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Hey, {user?.name?.split(' ')[0]}!</h3>
                    <p className="text-xs text-purple-200">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-black">Welcome.</h3>
                  <p className="text-sm text-purple-100">Unlock deals, tracking, and more.</p>
                  <button onClick={() => navigate('/loading-to-page')} className="w-fit bg-white text-purple-600 px-6 py-2 rounded-xl font-bold text-sm">Join YossyVogue</button>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-4 ml-2">Main Menu</p>
              
              <div className="flex flex-col gap-1">
                <AnimatedMobileLink delay="100ms" to="/superdeals" label="Super Deals" setOpen={setOpen} />
                <AnimatedMobileLink delay="150ms" to="/homeappliances" label="Home Appliances" setOpen={setOpen} />
                <AnimatedMobileLink delay="200ms" to="/cart" label="Shopping Cart" setOpen={setOpen} count={totalItems} />
                
                {isLoggedIn && (
                  <>
                    <div className="my-4 border-t border-gray-100 dark:border-gray-800" />
                    <AnimatedMobileLink delay="250ms" to="/profile" label="My Profile" setOpen={setOpen} />
                    <AnimatedMobileLink delay="300ms" to="/orders" label="Order History" setOpen={setOpen} />
                  </>
                )}
              </div>

              {/* Extra Tools */}
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-3xl flex items-center  dark:text-whitejustify-between">
               
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
    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all translate-x-0 group"
  >
    <div className="flex items-center gap-4">
      <span className="text-gray-700 dark:text-gray-200 font-semibold group-hover:text-purple-500 transition-colors">{label}</span>
      {count > 0 && <span className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{count}</span>}
    </div>
    <FaChevronRight className="text-xs text-gray-300 group-hover:text-purple-500 transition-all" />
  </Link>
);

export default Navbar;