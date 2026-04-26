import React from 'react'
import { Link } from "react-router-dom";
import TriangleIcon from './TriangleIcon'

const TriangleWithBar = ({ icon, label, links }) => {

  return (
    <div className="mb-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs mx-auto">
      <div className="relative flex text-black dark:text-white items-center">
        <TriangleIcon size={24}>
          {icon}
        </TriangleIcon>
        <div className="-ml-6 h-8 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[180px] bg-purple-600 flex items-center px-4 sm:px-6">
          <span className="text-black dark:text-white text-xs sm:text-sm md:text-base font-semibold truncate">
            {label}
          </span>
        </div>
      </div>
      {/* Links */}
      <ul className="space-y-1 text-xs sm:text-sm md:text-base text-black dark:text-white mt-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.path}
              className="hover:text-purple-600 text-black dark:text-white transition cursor-pointer block truncate"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TriangleWithBar
