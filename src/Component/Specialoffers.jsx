



import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { FaCartArrowDown, FaEye } from 'react-icons/fa'
import { FaBurger } from 'react-icons/fa6'

import { useEffect, useState } from 'react';


function Specialoffers({productName,productImage, oldPrice, newPrice}) {


    const [quickView, setQuickView] = useState(false);
    const [compare, setCompare] = useState(false);
    const [addCart, setAddCart] = useState(false);
   
    
  return (
    <section className='mb-10 mt-5 p-5'>
  <div>
     <article> 
  <div className='group flex flex-col p-4 border border-gray-300 rounded-lg shadow-lg 
                  hover:border-purple-500 transition-all duration-300'>
      
      <img src={productImage}
        alt="offer1" 
        className='h-80 object-cover rounded-md shadow-md'
      />

      <p className='mt-1 font-mono'>{productName}</p> 

      <div className='flex gap-4 font-thin'>
        <p>{newPrice}</p> 
        <p className='line-through text-gray-500'>{oldPrice}</p> 
      </div> 

      {/* Hidden until hover */}
      <ul className="flex gap-3 mt-2 opacity-0 translate-y-2 
               group-hover:opacity-100 group-hover:translate-y-0 
               transition-all duration-500 ease-in-out">
         <li className="border w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 
                 cursor-pointer hover:bg-purple-600 relative group"
   onClick= {() => setQuickView(!quickView)}>
  <FaEye size={20} className="transition-transform duration-500 group-hover:rotate-[360deg]"/>

  {/* Tooltip text to the right */}
{ quickView && <span className=" absolute left-2 top-8 bg-gray-500 text-white text-xs rounded
                     transition-opacity duration-300 whitespace-nowrap">
    Quick View
  </span>}
</li>
         <li
      className="border w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 
                 cursor-pointer hover:bg-purple-600 relative"
      onClick={() => setCompare(!compare)}
    >
      {/* Icon spins on hover */}
      <FaBurger
        size={20}
        className="transition-transform duration-500 group-hover:rotate-[360deg]"
      />

      {/* Tooltip shows only on click */}
      {compare && (
        <span
          className="absolute left-2 top-8 bg-gray-500 text-white text-xs rounded
                     transition-opacity duration-300 whitespace-nowrap"
        >
          Compare
        </span>
      )}
    </li>
   <li
      className="border w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 
                 cursor-pointer hover:bg-purple-600 relative group"
      onClick={() => setAddCart(!addCart)}
    >
      {/* Icon spins on hover */}
      <FaCartArrowDown
        size={20}
        className="transition-transform duration-500 group-hover:rotate-[360deg]"
      />

      {/* Tooltip shows only on click */}
      {addCart && (
        <span
          className="absolute left-2 top-8 bg-gray-500 text-white text-xs rounded
                     transition-opacity duration-300 whitespace-nowrap"
        >
          Add to Cart
        </span>
      )}
    </li>

      </ul>
  </div>  
</article>

  </div>
    </section>
  )
}

export default Specialoffers;

