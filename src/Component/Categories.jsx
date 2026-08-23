import React, { useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import SuperDeals from '../Pages/SuperDeals';
import AOS from 'aos';

const Categories = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [categories, setCategories] = useState(false);
  const [moreCategories, setMoreCategories] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Universal handler to navigate to products page with category filter
  const handleCategoryClick = (e, categoryName) => {
    e.stopPropagation(); // Prevents event bubbling/toggling dropdowns unexpectedly
    setCategories(false); // Closes menu on click
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { 
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <section 
      className={`fixed left-0 w-full top-[72px] bg-purple-500 z-[90] shadow transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-[72px]"
      }`}
    >
      <div className=' lg:overflow-visible'>  
        <ul className="flex items-center
          justify-start md:justify-center
          gap-4 md:gap-4 md:text-sm sm:gap-4 sm:text-xs sm:px-1
          px-4 py-3 max-sm:text-xs max-sm:hidden max-md:hidden
          lg:overflow-visible
          whitespace-nowrap
          border-b
          text-gray-600 font-semibold ">
          
          {/* All Categories */}
          <li
            className="flex gap-2 items-center bg-gray-200 px-4 py-2 rounded-full relative cursor-pointer"
            onClick={() => setCategories(!categories)}
          >
            <GiHamburgerMenu />
            <span className='text-black dark:text-black hover:text-purple-500 dark:hover:text-purple-500'>
              All Categories
            </span>

            {/* Arrow rotates when categories is open */}
            <IoIosArrowDropup
              className={`transition-transform duration-300 ${
                categories ? "rotate-180" : "rotate-0"
              } text-gray-700`}
            />

            {/* Dropdown menu with slide-down animation */}
            <ul
              className={`absolute left-0 top-full mt-2 w-56
                z-[9999]
                overflow-hidden rounded-lg shadow-lg border
                theme-text-black dark:theme-text-white font-semibold bg-white dark:bg-gray-900
                transition-all divide-y divide-gray-400 duration-500 ${
                  categories
                    ? "max-h-[40rem] opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
              <li 
                onClick={(e) => handleCategoryClick(e, "Clothing")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Clothings
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Mobiles")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Mobiles
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Electronics")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Electronics
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Cameras")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Cameras
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Chairs")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Chairs
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Furniture")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Furnitures
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Home Theaters")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Home Theaters
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Accessories")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Accessories
              </li>
              <li 
                onClick={(e) => handleCategoryClick(e, "Lightings")}
                className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Lightings
              </li>

              <li
                className="flex items-center py-2 px-4 justify-between cursor-pointer theme-text-black dark:theme-text-white hover:bg-purple-50 dark:hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreCategories(!moreCategories);
                }}
              >
                <span className='text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500'>
                  More Categories
                </span>
                {moreCategories ? (
                  <IoIosArrowDropdown className="text-md" />
                ) : (
                  <IoIosArrowDropup className="text-md" />
                )}
              </li>

              {/* Extra categories */}
              {moreCategories && (
                <ul className="space-y-1 divide-y divide-gray-400 font-normal mt-2 bg-white dark:bg-gray-900">
                  <li 
                    onClick={(e) => handleCategoryClick(e, "Sports")}
                    className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 cursor-pointer"
                  >
                    Sports
                  </li>
                  <li 
                    onClick={(e) => handleCategoryClick(e, "Groceries")}
                    className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 cursor-pointer"
                  >
                    Groceries
                  </li>
                  <li 
                    onClick={(e) => handleCategoryClick(e, "Books")}
                    className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 cursor-pointer"
                  >
                    Books
                  </li>
                  <li 
                    onClick={(e) => handleCategoryClick(e, "Toys")}
                    className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 cursor-pointer"
                  >
                    Toys
                  </li>
                </ul>
              )}
            </ul>
          </li>

          {/* Rest of your nav items */}
          <Link to='/superdeals'> 
            <span className="text-black dark:text-white hover:text-purple-100 dark:hover:text-purple-200">
              Super Deals
            </span>
          </Link>

          <li>
            <span className="text-black dark:text-white hover:text-purple-100 dark:hover:text-purple-200">
              Yuna's Business
            </span>
          </li>

          <li onClick={(e) => handleCategoryClick(e, "Home Appliances")} className="cursor-pointer">
            <span className="text-black dark:text-white hover:text-purple-100 dark:hover:text-purple-200">
              Home Appliances
            </span>
          </li>

          <li onClick={(e) => handleCategoryClick(e, "Hair Extensions & Wigs")} className="cursor-pointer">
            <span className="text-black dark:text-white hover:text-purple-100 dark:hover:text-purple-200">
              Hair Extensions & Wigs
            </span>
          </li>

          <li className="flex gap-2 items-center sm:gap-1">
            <span className="text-black dark:text-white hover:text-purple-100 dark:hover:text-purple-200">
              More
            </span>
            <IoIosArrowDropdown className="text-black dark:text-white" />
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Categories;