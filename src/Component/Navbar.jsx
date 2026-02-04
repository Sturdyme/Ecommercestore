import { useState } from "react";
import { FaUser, FaYoast, FaBars, FaTimes } from "react-icons/fa";
import { GiWorld, GiHamburgerMenu } from "react-icons/gi"; // 
import { IoCart } from "react-icons/io5";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io"; // Added Arrows


const Navbar = () => {
  const [open, setOpen] = useState(false)

  const [categories, setCategories] = useState(false);
  const [moreCategories, setMoreCategories] = useState(false);

  return (
   <section className="relative max-sm:sticky top-0 z-50 bg-white shadow-md px-4 py-4 flex justify-between items-center border-b">
      
      {/* Logo */}
      <div className="flex gap-1 items-center">
        <FaYoast className="text-3xl text-purple-400" />
        <h2 className="text-2xl text-purple-400 font-semibold">
          YossyVogue.com
        </h2>
      </div>

      {/* Search (Desktop) */}
      <div className="hidden lg:block">
        <input
          type="text"
          placeholder="Search for products..."
          className="border w-96 p-2 px-4 rounded-full"
        />
      </div>

      {/* Desktop Menu Items */}
      <ul className="hidden lg:flex gap-6 text-gray-600 items-center">
        <p className="flex gap-1 items-center">
          <GiWorld className="text-2xl" />
          <span className="text-sm">EN-USD</span>
        </p>
        <li><IoCart className="text-2xl text-purple-400" /></li>
        <li className="flex gap-1 items-center">
          <FaUser className="text-2xl text-purple-400" />
          <span>Sign in</span>
        </li>
        <button className="bg-purple-400 rounded-xl font-semibold text-white p-2 px-4">
          Create account
        </button>
      </ul>

      {/* Hamburger Toggle Button */}
      <button
        className="lg:hidden  text-2xl text-purple-500"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile menu */}
      {open && (
  <div className="absolute top-full left-0 w-full bg-white shadow-xl z-[999] lg:hidden border-t border-gray-100">
    {/* Use a div with overflow-y-auto so you can scroll through long lists */}
    <div className="max-h-[85vh] overflow-y-auto">
      <ul className="flex flex-col text-gray-600 font-medium">
        
        {/* --- ALL CATEGORIES TOGGLE --- */}
        <li 
          className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer"
          onClick={() => setCategories(!categories)}
        >
          <div className="flex items-center gap-3">
            <GiHamburgerMenu className="text-purple-500" />
            <span className="font-bold text-black">All Categories</span>
          </div>
          <IoIosArrowDropup
            className={`transition-transform duration-300 ${
              categories ? "rotate-180" : "rotate-0"
            }`}
          />
        </li>

        {/* --- THE HIDDEN LIST (Shows when categories is true) --- */}
        {categories && (
          <div className="bg-white flex flex-col transition-all">
            <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50">Clothings</li>
            <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50">Mobiles</li>
            <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50">Electronics</li>
            <li className="p-3 pl-10 border-b border-gray-50 hover:bg-purple-50">Cameras</li>
            
            {/* More Categories Nested Inside */}
            <li 
              className="p-3 pl-10 text-purple-500 flex items-center justify-between bg-purple-50/50"
              onClick={() => setMoreCategories(!moreCategories)}
            >
              <span>{moreCategories ? "Show Less" : "More Categories..."}</span>
            </li>

            {moreCategories && (
              <div className="bg-gray-50">
                <li className="p-3 pl-14 border-b border-white">Sports</li>
                <li className="p-3 pl-14 border-b border-white">Groceries</li>
                <li className="p-3 pl-14 border-b border-white">Books</li>
              </div>
            )}
          </div>
        )}

        {/* --- STANDARD LINKS (Cart, Sign in, etc) --- */}
        <li className="flex gap-3 items-center p-4 border-b">
          <GiWorld className="text-xl" /> English-USD
        </li>
        <li className="flex gap-3 items-center p-4 border-b">
          <IoCart className="text-xl text-purple-400" /> Cart
        </li>
        <li className="flex gap-3 items-center p-4 border-b">
          <FaUser className="text-xl text-purple-400" /> Sign in
        </li>
        
        <div className="p-4">
          <button className="w-full bg-purple-400 rounded-xl font-semibold text-white py-3 shadow-md active:scale-95 transition-transform">
            Create account
          </button>
        </div>
      </ul>
    </div>
  </div>
      )}
    </section>
  );
};

export default Navbar