import React, { useEffect, useState, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';

const Categories = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const [categories, setCategories] = useState(false);
  const [moreCategories, setMoreCategories] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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

  // Hide while scrolling down and reveal when the user scrolls upward.
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;

      if (currentScrollY <= 40 || currentScrollY < previousScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > previousScrollY) {
        setIsVisible(false);
        setCategories(false);
        setMoreCategories(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  // Universal category click handler
  const handleCategoryClick = (e, categoryName) => {
    e.stopPropagation();
    setCategories(false);
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
        className={`hidden md:block fixed left-0 w-full top-[72px] bg-purple-600 dark:bg-purple-900 border-b border-purple-500/30 z-[90] shadow-md transition-transform duration-300 ease-in-out ${
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

        </div>
      </section>

    </>
  );
};

export default Categories;