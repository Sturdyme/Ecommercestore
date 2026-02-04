import React, { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io'

const Categories = () => {

const [categories, setCategories] = useState(false);
const [moreCategories, setMoreCategories] = useState(false);

  return (
      <section className="sticky top-0 bg-purple-400 z-50 shadow">
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
          <span>All Categories</span>

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
  text-black font-semibold bg-white
  transition-all divide-y divide-gray-400 duration-500 ${
    categories
      ? "max-h-[40rem] opacity-100"
      : "max-h-0 opacity-0"
  }`}
          >
            <li className="py-2 px-4">Clothings</li>
            <li className="py-2 px-4">Mobiles</li>
            <li className="py-2 px-4">Electronics</li>
            <li className="py-2 px-4">Cameras</li>
            <li className="py-2 px-4">Chiars</li>
            <li className="py-2 px-4">Furnitures</li>
            <li className="py-2 px-4">Home Theaters</li>
            <li className="py-2 px-4">Accessories</li>
            <li className="py-2 px-4">Lightings</li>
          <li
              className="flex items-center  py-2 px-4 justify-between cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // prevent closing parent
                setMoreCategories(!moreCategories);
              }}
            >
              <span >More Categories</span>
              {moreCategories ? (
                <IoIosArrowDropdown className="text-md" />
              ) : (
                <IoIosArrowDropup className="text-md" />
              )}
            </li>

            {/* Extra categories */}
            {moreCategories && (
              <ul className=" space-y-1  divide-y divide-gray-400 font-normal mt-2">
                <li className="py-2 px-4">Sports</li>
                <li className="py-2 px-4">Groceries</li>
                <li className="py-2 px-4">Books</li>
                <li className="py-2 px-4">Toys</li>
              </ul>
            )}

          </ul>
        </li>

        {/* Rest of your nav items */}
        <li>
          <span className="text-purple-600">Super Deals</span>
        </li>

        <li>
          <span className="text-white">Yossy's Business</span>
        </li>

        <li>
          <span className="text-white">Home Appliances</span>
        </li>

        <li>
          <span className="text-white">Hair Extensions & Wigs</span>
        </li>

        <li className="flex gap-2 items-center sm:gap-1">
          <span className="text-white">More</span>
          <IoIosArrowDropdown className="text-white" />
        </li>
      </ul>
      </div>
    </section>
  )
}

export default Categories
