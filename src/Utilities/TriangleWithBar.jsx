import React from 'react'
import { Link } from "react-router-dom";
import TriangleIcon from './TriangleIcon'

const TriangleWithBar = ({ icon, label, links }) => {

  return (
    <div>

      <div className='relative flex text-black dark:text-white items-center '>
        <TriangleIcon size={30}>
          {icon}
        </TriangleIcon>

        <div className="-ml-[30px] h-[30px] w-[250px] bg-purple-600 flex items-center px-8">
          <span className="text-black dark:text-white text-xs font-semibold">
            {label}
          </span>
        </div>
      </div>

      {/* Links */}
      <ul className="space-y-2  text-sm text-black dark:text-white mt-3">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.path}
              className="hover:text-purple-600  text-black dark:text-white transition cursor-pointer"
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
