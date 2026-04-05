import { useEffect, useState } from "react";
import { FaUser, FaYoast, FaBars, FaTimes } from "react-icons/fa";
import { GiWorld, GiHamburgerMenu } from "react-icons/gi";
import { IoCart } from "react-icons/io5";
import { IoIosArrowDropup } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "./CartContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // If scrolling down, hide it. If scrolling up, show it.
        if (window.scrollY > lastScrollY && window.scrollY > 100) { 
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true); // Scrolling up
        }
        // Update last scroll position
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    // Clean up listener on unmount
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const [categories, setCategories] = useState(false);
  const [moreCategories, setMoreCategories] = useState(false);

  // Function to handle navigation with loading page
  const handleNavigateWithSpinner = () => {
    setOpen(false); // close mobile menu
    navigate("/loading-to-page"); // go to spinner loading page
  };

  const handleNavigateToLoginWithSpinner = () => {
    setOpen(false); // close mobile menu
    navigate("/loading-to-login"); // go to spinner loading page
  }

  return (
    <section className={`fixed top-0 left-0 w-full h-[72px] z-[100] bg-white dark:bg-gray-900 shadow-md px-4 py-4 flex justify-between items-center border-b transition-transform duration-300 ${
    isVisible ? "translate-y-0" : "-translate-y-full"
  }`}>
      {/* Logo */}
     
      <div className="flex gap-1 items-center">
        <FaYoast className="text-3xl text-purple-400" />
         <Link to="/"> 
        <h2  className="text-2xl text-purple-400 font-semibold">YossyVogue.com</h2> </Link>
      </div>
       

      {/* Desktop Search */}
      <div className="hidden lg:block">
        <input
          type="text"
          placeholder="Search for products..."
          className="border w-96 p-2 px-4 rounded-full"
        />
      </div>
       
      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-6 theme-text-black items-center">
        <li className="flex gap-1 items-center">
          <GiWorld className="text-2xl" />
          <span className="text-sm theme-text-black">EN-USD</span>
        </li>

           <span className="flex text-black dark:text-white gap-3 items-center p-4  justify-center">
                <ThemeToggle />
              </span>
       
         <Link to="/cart"> 
        <li className="relative group">
          <IoCart className="text-2xl list-none block text-purple-400 group-hover:scale-110 transition-transform" />
          {/* The Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center border-2 border-white dark:border-gray-900 animate-in zoom-in duration-300">
              {totalItems}
            </span>
          )}
        </li>
        </Link>

        <li className="flex gap-1 items-center">
          <FaUser className="text-2xl text-purple-400" />
          <button onClick={handleNavigateToLoginWithSpinner} className="text-sm theme-text-black">Sign in</button>
        </li>
        <li>
          <button
            onClick={handleNavigateWithSpinner}
            className="bg-purple-400 rounded-xl font-semibold text-black dark:text-white p-2 px-4"
          >
            Create Account
          </button>
        </li>
      </ul>

      {/* Hamburger Button */}
      <div className="flex justify-around lg:hidden gap-5 items-center"> 

          <li className="flex gap-3 text-black dark:text-white items-center p-4 border-none justify-center">
                <ThemeToggle />
              </li>

       <Link to="/cart"> 
        <span className="relative group">
          <IoCart className="text-2xl list-none block text-purple-400 group-hover:scale-110 transition-transform" />
          {/* The Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center border-2 border-white dark:border-gray-900 animate-in zoom-in duration-300">
              {totalItems}
            </span>
          )}
        </span>
        </Link>
      <button
        className="text-2xl text-purple-500"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl z-[110] lg:hidden border-t border-gray-100">
          <div className="max-h-[85vh] overflow-y-auto">
            <ul className="flex flex-col theme-text-black dark:theme-text-white font-medium">
              {/* Categories */}
              <li
                className="flex items-center dark:bg-black justify-between p-4 bg-gray-50 border-b cursor-pointer"
                onClick={() => setCategories(!categories)}
              >
                <div className="flex dark:bg-black items-center gap-3">
                  <GiHamburgerMenu className="text-purple-500 " />
                  <span className="font-bold dark:bg-black theme-text-black">All Categories</span>
                </div>
                <IoIosArrowDropup
                  className={`transition-transform duration-300 ${
                    categories ? "rotate-180" : "rotate-0"
                  }`}
                />
              </li>

              {categories && (
                <div className="bg-white dark:bg-gray-900 flex flex-col transition-all">
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Clothings
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Mobiles
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Electronics
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Cameras
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Chairs
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Furnitures
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Home Theaters
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Accessories
                  </li>
                  <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">
                    Lightings
                  </li>
                  <li
                    className="p-3 pl-10 text-purple-500 flex items-center justify-between bg-purple-50/50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white"
                    onClick={() => setMoreCategories(!moreCategories)}
                  >
                    <span>{moreCategories ? "Show Less" : "More Categories..."}</span>
                  </li>
                  {moreCategories && (
                    <div className="bg-gray-50 dark:bg-gray-900">
                      <li className="p-3 pl-14 border-b border-white hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">Sports</li>
                      <li className="p-3 pl-14 border-b border-white hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">Groceries</li>
                      <li className="p-3 pl-14 border-b border-white hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">Books</li>
                      <li className="p-3 pl-14 border-b border-white hover:bg-purple-50 dark:hover:bg-gray-800 theme-text-black dark:theme-text-white">Toys</li>
                    </div>
                  )}
                </div>
              )}

              {/* Items from Category Bar */}
              <Link to="/superdeals" onClick={() => setOpen(false)}>
                <li className="p-4 border-b hover:bg-purple-50 dark:hover:bg-gray-800 transition">
                  Super Deals
                </li>
              </Link>
              <li className="p-4 border-b hover:bg-purple-50 dark:hover:bg-gray-800 transition">
                Yossy's Business
              </li>
              <Link to="/homeappliances" onClick={() => setOpen(false)}>
                <li className="p-4 border-b hover:bg-purple-50 dark:hover:bg-gray-800 transition">
                  Home Appliances
                </li>
              </Link>
              <li className="p-4 border-b hover:bg-purple-50 dark:hover:bg-gray-800 transition">
                Hair Extensions & Wigs
              </li>

              {/* Standard Links */}
              <li className="flex gap-3 items-center p-4 border-b">
                <GiWorld className="text-xl" /> English-USD
              </li>
              <Link to="/cart"> 
        <li className="flex gap-3 items-center p-4 border-b relative group">
          <div className="relative">
            <IoCart className="text-2xl text-purple-400 group-hover:scale-110 transition-transform" />
            
            {/* The Badge */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-black dark:text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center border-2 border-white dark:border-gray-900 animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </div>
          <span className="font-medium">Cart</span>
        </li>
      </Link>

              <li className="flex gap-3 items-center p-4 border-b">
                <button onClick={handleNavigateToLoginWithSpinner} className="flex items-center gap-2">
                <FaUser className="text-xl text-purple-400" /> Sign in  </button> 
              </li>

           
             

              {/* Mobile Create Account */}
              <li className="p-4">
                <button
                  onClick={handleNavigateWithSpinner}
                  className="w-full bg-purple-400 theme-text-white py-3 rounded-xl hover:bg-purple-500 transition"
                >
                  Create Account
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;
