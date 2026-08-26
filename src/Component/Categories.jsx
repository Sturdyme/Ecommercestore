import React, { useEffect, useState, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaChevronRight, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';

const Categories = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [categories, setCategories] = useState(false);
  const [moreCategories, setMoreCategories] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Lock background body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategories(false);
        setMoreCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Control visibility on scroll (Hides completely on scroll down, restores on scroll up)
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 40) {
          // Hide when scrolling down
          setIsVisible(false);
          setCategories(false);
          setMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY) {
          // Show when scrolling up
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Universal category click handler
  const handleCategoryClick = (e, categoryName) => {
    e.stopPropagation();
    setCategories(false);
    setMobileMenuOpen(false);
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const mainCategories = [
    'Clothing',
    'Mobiles',
    'Electronics',
    'Cameras',
    'Chairs',
    'Furniture',
    'Home Theaters',
    'Accessories',
    'Lightings',
  ];

  const extraCategories = ['Sports', 'Groceries', 'Books', 'Toys'];

  return (
    <>
      <section
        className={`fixed left-0 w-full top-[72px] bg-purple-600 dark:bg-purple-900 border-b border-purple-500/30 z-[90] shadow-md transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-[200%]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* DESKTOP NAVIGATION BAR */}
          <div className="hidden md:flex items-center justify-between py-2.5 text-xs lg:text-sm font-medium text-white">
            <ul className="flex items-center gap-2 lg:gap-6 whitespace-nowrap">
              {/* All Categories Dropdown Button */}
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCategories(!categories)}
                  className="flex items-center gap-2.5 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full font-semibold transition-colors duration-200 shadow-sm focus:outline-none"
                >
                  <GiHamburgerMenu className="text-base" />
                  <span>All Categories</span>
                  <motion.div
                    animate={{ rotate: categories ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IoIosArrowDown className="text-base" />
                  </motion.div>
                </button>

                {/* Animated Category Dropdown */}
                <AnimatePresence>
                  {categories && (
                    <motion.ul
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-2 w-64 z-[9999] rounded-xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-100 overflow-hidden"
                    >
                      <div className="py-1">
                        {mainCategories.map((cat) => (
                          <li
                            key={cat}
                            onClick={(e) => handleCategoryClick(e, cat)}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 dark:hover:bg-gray-800/80 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors text-sm font-medium"
                          >
                            <span>{cat}</span>
                            <FaChevronRight className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </li>
                        ))}
                      </div>

                      {/* Expandable Extra Categories */}
                      <div className="py-1">
                        <li
                          onClick={(e) => {
                            e.stopPropagation();
                            setMoreCategories(!moreCategories);
                          }}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 dark:hover:bg-gray-800/80 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors text-sm font-semibold"
                        >
                          <span>More Categories</span>
                          {moreCategories ? (
                            <IoIosArrowUp className="text-base" />
                          ) : (
                            <IoIosArrowDown className="text-base" />
                          )}
                        </li>

                        <AnimatePresence>
                          {moreCategories && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gray-50 dark:bg-gray-950/50 overflow-hidden"
                            >
                              {extraCategories.map((cat) => (
                                <li
                                  key={cat}
                                  onClick={(e) => handleCategoryClick(e, cat)}
                                  className="pl-7 pr-4 py-2 hover:bg-purple-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors text-xs font-normal"
                                >
                                  {cat}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {/* Static Navigation Items */}
              <li>
                <Link
                  to="/superdeals"
                  className="hover:text-purple-200 transition-colors py-1.5 px-2 rounded-md"
                >
                  Super Deals
                </Link>
              </li>

              <li>
                <span className="hover:text-purple-200 cursor-pointer transition-colors py-1.5 px-2 rounded-md">
                  Yuna's Business
                </span>
              </li>

              <li
                onClick={(e) => handleCategoryClick(e, 'Home Appliances')}
                className="cursor-pointer hover:text-purple-200 transition-colors py-1.5 px-2 rounded-md"
              >
                Home Appliances
              </li>

              <li
                onClick={(e) => handleCategoryClick(e, 'Hair Extensions & Wigs')}
                className="cursor-pointer hover:text-purple-200 transition-colors py-1.5 px-2 rounded-md"
              >
                Hair Extensions & Wigs
              </li>

              <li className="flex items-center gap-1 cursor-pointer hover:text-purple-200 transition-colors py-1.5 px-2 rounded-md">
                <span>More</span>
                <IoIosArrowDown className="text-xs" />
              </li>
            </ul>
          </div>

          {/* MOBILE NAVIGATION BAR */}
          <div className="flex md:hidden items-center justify-between py-2.5 text-white">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 bg-purple-700 active:bg-purple-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm focus:outline-none"
            >
              <GiHamburgerMenu className="text-sm" />
              <span>Categories & Menu</span>
            </button>

            <Link
              to="/superdeals"
              className="text-xs font-semibold bg-purple-700/60 active:bg-purple-700 px-3 py-1.5 rounded-lg"
            >
              Super Deals
            </Link>
          </div>
        </div>
      </section>

      {/* MOBILE DRAWER MODAL OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Slide-down drawer content */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-h-[80vh] bg-white dark:bg-gray-900 rounded-b-2xl shadow-2xl text-gray-800 dark:text-gray-100 overflow-hidden"
            >
              <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-base text-purple-600 dark:text-purple-400">
                    Categories & Navigation
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-1">
                  {[...mainCategories, ...extraCategories].map((cat) => (
                    <div
                      key={cat}
                      onClick={(e) => handleCategoryClick(e, cat)}
                      className="py-2.5 px-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 text-sm font-medium cursor-pointer transition-colors"
                    >
                      {cat}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2 text-sm font-medium">
                  <Link
                    to="/superdeals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 text-purple-600 dark:text-purple-400 font-semibold"
                  >
                    Super Deals
                  </Link>
                  <div
                    onClick={(e) => handleCategoryClick(e, 'Home Appliances')}
                    className="py-2 px-3 cursor-pointer"
                  >
                    Home Appliances
                  </div>
                  <div
                    onClick={(e) => handleCategoryClick(e, 'Hair Extensions & Wigs')}
                    className="py-2 px-3 cursor-pointer"
                  >
                    Hair Extensions & Wigs
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Categories;