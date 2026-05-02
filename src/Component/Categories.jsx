import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io'
import { Link } from 'react-router-dom';
import SuperDeals from '../Pages/SuperDeals';

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

const [categories, setCategories] = useState(false);
const [moreCategories, setMoreCategories] = useState(false);

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
     <div className=' lg:overflow-visible' >  
      <ul className="flex items-center
  justify-start md:justify-center
  gap-4 md:gap-4 md:text-sm  sm:gap-4 sm:text-xs sm:px-1
  px-4 py-3  max-sm:text-xs max-sm:hidden max-md:hidden
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
          <span className='text-black dark:text-black hover:text-purple-500 dark:hover:text-purple-500' >All Categories</span>

          {/* Arrow rotates when categories is open */}
          <IoIosArrowDropup
            className={`transition-transform duration-300 ${
              categories ? "rotate-180" : "rotate-0"
            } text-gray-700`}
          />

          {/* Dropdown menu with slide-down animation */}
          <ul
          className={`absolute left-0 top-full mt-2 w-56
  z-[9999]  /* 🔥 important */
  overflow-hidden rounded-lg shadow-lg border
  theme-text-black dark:theme-text-white font-semibold bg-white dark:bg-gray-900
  transition-all divide-y divide-gray-400 duration-500 ${
    categories
      ? "max-h-[40rem] opacity-100"
      : "max-h-0 opacity-0"
  }`}
          >
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Clothings</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Mobiles</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Electronics</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Cameras</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Chiars</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Furnitures</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Home Theaters</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Accessories</li>
            <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800">Lightings</li>
          <li
              className="flex items-center py-2 px-4 justify-between cursor-pointer theme-text-black dark:theme-text-white hover:bg-purple-50 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation(); // prevent closing parent
                setMoreCategories(!moreCategories);
              }}
            >
              <span className='text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500'>More Categories</span>
              {moreCategories ? (
                <IoIosArrowDropdown className="text-md" />
              ) : (
                <IoIosArrowDropup className="text-md" />
              )}
            </li>

            {/* Extra categories */}
            {moreCategories && (
              <ul className="space-y-1 divide-y divide-gray-400 font-normal mt-2 bg-white dark:bg-gray-900">
                <li className="py-2 px-4 dtext-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Sports</li>
                <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Groceries</li>
                <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Books</li>
                <li className="py-2 px-4 text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Toys</li>
              </ul>
            )}

          </ul>
        </li>

        {/* Rest of your nav items */}
        <Link to='/superdeals'> 
          <span className="text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Super Deals</span>
        </Link>

        <li>
          <span className="text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Yossy's Business</span>
        </li>

        <Link to='/homeappliances'> 
          <span className="text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Home Appliances</span>
        </Link>

        <li>
          <span className="text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-500">Hair Extensions & Wigs</span>
        </li>

        <li className="flex gap-2 items-center sm:gap-1">
          <span className="text-black dark:text-white">More</span>
          <IoIosArrowDropdown className="text-black dark:text-white" />
        </li>
      </ul>
      </div>
    </section>
  )
}

export default Categories
