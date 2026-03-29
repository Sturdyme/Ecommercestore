import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useCart } from '../Component/CartContext';

const SuperDeals = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  if (!products.length) {
    return <p className='text-black dark:text-white'>Loading...</p>;
  }
 
  const visibleProducts = products.slice(0, visibleCount);

  return (
    <>
   <section className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 py-6 text-black dark:text-white">
  {visibleProducts.map((p) => (
    <article
      key={p.id}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      
      {/* Image */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center h-44">
        <img
          src={p.image}
          alt={p.title}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        
        {/* Title */}
        <h3 className="text-sm font-semibold line-clamp-2 leading-tight">
          {p.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {p.description}
        </p>

        {/* Price + Category */}
        <div className="flex justify-between items-center pt-1">
          <p className="text-base font-bold text-green-600">
            ${p.price}
          </p>
          <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full capitalize">
            {p.category}
          </span>
        </div>

        {/* Button */}
        <button 
        onClick={() => addToCart(p)}
        className="w-full mt-3 bg-purple-500 text-white dark:bg-white dark:text-black text-sm py-2 rounded-lg font-medium hover:opacity-90 transition">
          Add to Cart
        </button>
      </div>
    </article>
  ))}
</section>

   {visibleCount < products.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition"
          >
            <IoIosArrowDown size={24} />
          </button>
        </div>
      )}
</>
  );
};



export default SuperDeals;