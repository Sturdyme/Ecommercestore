import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useCart } from '../Component/CartContext';
import { usdToNairaDisplay } from "../Utilities/currency";
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../Utilities/WishlistContext';
import { Link } from 'react-router-dom'

const SuperDeals = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

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
      <Link to={`/products/${p.id}`} className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center h-44">
        <img
          src={p.image}
          alt={p.title}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2">
        
        {/* Title */}
        <Link to={`/product/${p.id}`} className="text-sm font-semibold line-clamp-2 leading-tight">
          {p.title}
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {p.description}
        </p>

        {/* Price + Category */}
        <div className="flex justify-between items-center pt-1">
          <p className="text-base font-bold text-green-600">
            {usdToNairaDisplay(p.price)}
          </p>
          <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full capitalize">
            {p.category}
          </span>
        </div>

        {/* Button */}
       <div className="mt-4 flex items-center gap-3">

  {/* ADD TO CART */}
  <button
    onClick={() => addToCart(p)}
    className="flex-1 bg-purple-600 text-white text-sm py-2.5 rounded-xl font-semibold 
               hover:bg-purple-700 active:scale-95 transition-all duration-200 shadow-sm"
  >
    Add to Cart
  </button>

  {/* WISHLIST */}
  <button
    onClick={() => {
      const isWishlisted = wishlist.some(item => item.id === p.id);
      if (isWishlisted) {
        removeFromWishlist(p.id);
      } else {
        addToWishlist(p);
      }
    }}
    className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-95
      ${
        wishlist.some(item => item.id === p.id)
          ? "bg-purple-600 border-purple-600 text-white shadow-md"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600"
      }`}
    title={
      wishlist.some(item => item.id === p.id)
        ? "Remove from wishlist"
        : "Add to wishlist"
    }
  >
    <FiHeart
      className={`text-lg transition ${
        wishlist.some(item => item.id === p.id)
          ? "fill-white"
          : ""
      }`}
    />
  </button>

</div>
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