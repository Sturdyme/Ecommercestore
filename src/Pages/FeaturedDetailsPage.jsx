import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../Component/CartContext';
import { usdToNairaDisplay } from "../Utilities/currency";
import { FeaturedCards } from '../Component/FeaturedData'; 

// If extraItems can be exported from FeaturedSection, do so, or move it to FeaturedData.js
import { extraItems } from '../Component/FeaturedSection'; 

const FeaturedDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Combine both local arrays to search through everything at once
  const allFeaturedItems = [...FeaturedCards, ...extraItems];

  // Look for the exact item matching the URL path ID
  const item = allFeaturedItems.find(p => String(p.id) === String(id));

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-sm text-center border dark:border-gray-800">
          <p className="text-red-500 font-bold mb-4">Collection item not found</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 transition">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8 text-black dark:text-white transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium group transition">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
          </Link>
        </div>

        {/* Local Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          
          {/* LEFT side image box */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl aspect-square flex items-center justify-center border dark:border-gray-700 p-6">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-contain max-h-[350px] hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* RIGHT side metadata spec cards */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase font-bold text-purple-600 dark:text-purple-400 tracking-widest bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md">
                  {item.category || "Special Feature"}
                </span>
                <h1 className="text-2xl font-black mt-2 leading-tight">
                  {item.title}
                </h1>
              </div>

              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3">
                <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {usdToNairaDisplay(item.price || 0)}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Details</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description || "No customized description available for this local boutique department."}
                </p>
              </div>
            </div>

            {/* Cart Interaction Action Button */}
            <button
              onClick={() => addToCart({
                id: item.id,
                title: item.title,
                price: item.price || 0,
                image: item.image,
                quantity: 1
              })}
              className="w-full bg-gray-900 dark:bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-md"
            >
              <FaShoppingCart /> Add Department Deal to Cart
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FeaturedDetails;