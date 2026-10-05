import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useCart } from '../Component/CartContext';
import { formatNaira } from "../Utilities/currency";
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../Utilities/WishlistContext';
import { Link } from 'react-router-dom'
import { getProductImage } from "../Utilities/productImage";

const SuperDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load products");
        return response.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : data.data ?? []))
      .catch((requestError) => {
        console.error("Error fetching super deal products:", requestError);
        setError("Could not load products.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className='text-black dark:text-white'>Loading...</p>;
  }

  if (error) {
    return <p className='text-red-500'>{error}</p>;
  }

  if (!products.length) {
    return <p className='text-black dark:text-white'>No products found.</p>;
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
          src={getProductImage(p)}
          alt={p.title || p.name}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2">
        
        {/* Title */}
        <Link to={`/products/${p.id}`} className="text-sm font-semibold line-clamp-2 leading-tight">
          {p.title || p.name}
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {p.description}
        </p>

        {/* Price + Category */}
        <div className="flex justify-between items-center pt-1">
          <p className="text-base font-bold text-green-600">
            {formatNaira(p.price)}
          </p>
          <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full capitalize">
            {p.category}
          </span>
        </div>

        {/* Button */}
       <div className="mt-4 flex items-center gap-3">

  {/* ADD TO CART */}
  <button
    onClick={() => addToCart({ ...p, image: getProductImage(p) })}
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