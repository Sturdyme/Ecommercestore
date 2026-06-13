import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../Component/CartContext';
import { useWishlist } from '../Utilities/WishlistContext';
import { usdToNairaDisplay } from "../Utilities/currency";

const SuperdealsDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching superdeal spec:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-500 dark:text-gray-400 font-medium">Inspecting deal details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-sm text-center border dark:border-gray-800">
          <p className="text-red-500 font-bold mb-4">Deal not found</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 transition">
            <FaArrowLeft /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Ensure images are formatted as an array even if the API provides a single string
  const imagesArray = Array.isArray(product.image) ? product.image : [product.image];
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagesArray.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8 text-black dark:text-white transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium group transition">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Super Deals
          </Link>
        </div>

        {/* Product Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          
          {/* LEFT: Gallery Slide Interface */}
          <div className="flex flex-col gap-4 w-full">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl aspect-square overflow-hidden relative flex items-center justify-center border dark:border-gray-700 group">
              
              {/* Sliding Horizontal Strip Container */}
              <div 
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {imagesArray.map((img, index) => (
                  <div key={index} className="w-full h-full shrink-0 flex items-center justify-center p-6">
                    <img 
                      src={img} 
                      alt={`${product.title} view ${index + 1}`} 
                      className="w-full h-full object-contain max-h-[380px]"
                    />
                  </div>
                ))}
              </div>

              {/* Slider UI Controls */}
              {imagesArray.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur text-gray-800 dark:text-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-90 z-10">
                    <FaChevronLeft className="text-xs" />
                  </button>
                  <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur text-gray-800 dark:text-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-90 z-10">
                    <FaChevronRight className="text-xs" />
                  </button>
                  
                  {/* Dots Indicator overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {imagesArray.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentIndex === index ? "w-6 bg-purple-600" : "w-2 bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Specs Detail Block */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase font-bold text-purple-600 dark:text-purple-400 tracking-widest bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md capitalize">
                  {product.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Pricing Breakdown Row */}
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3 flex items-center justify-between">
                <p className="text-2xl font-black text-green-600">
                  {usdToNairaDisplay(product.price)}
                </p>
                {product.rating && (
                  <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
                    <span>⭐ {product.rating.rate}</span>
                    <span className="text-xs text-gray-400 font-normal">({product.rating.count} reviews)</span>
                  </div>
                )}
              </div>

              {/* Description Context */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Product Description</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Interaction Action Row (Matches your exact layout strategy) */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
              
              {/* ADD TO CART */}
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-purple-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:bg-purple-700 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              {/* WISHLIST TOGGLE */}
              <button
                onClick={() => {
                  if (isWishlisted) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className={`w-14 h-14 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
                  isWishlisted
                    ? "bg-purple-600 border-purple-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600"
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FiHeart className={`text-xl ${isWishlisted ? "fill-white" : ""}`} />
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SuperdealsDetails;