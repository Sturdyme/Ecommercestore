import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usdToNairaDisplay } from "../Utilities/currency";
import { useCart } from "./CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 💡 Track the current image index for the slider animation
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching single product:", err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleProduct();
  }, [id]);

  // Slider Navigation Logic
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? product.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === product.images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (loading) return <div className="text-center py-20 dark:text-white">Loading details...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500">{error}</div>;

  // Safety check to ensure we always fall back onto an array structure
  const productImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium">
            <FaArrowLeft /> Back to Arrivals
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          
          {/* ================= LEFT COLUMN: ANIMATED SLIDER GALLERY ================= */}
          <div className="flex flex-col gap-4 w-full">
            
            {/* Main Window Slider Window Viewport */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl aspect-square overflow-hidden relative border dark:border-gray-700 group">
              
              {/* Animated Sliding Strip Wrapper Container */}
              <div 
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {productImages.map((img, index) => (
                  <div key={index} className="w-full h-full shrink-0 flex items-center justify-center p-6">
                    <img 
                      src={img} 
                      alt={`${product.title} view ${index + 1}`} 
                      className="w-full h-full object-contain max-h-[400px]"
                    />
                  </div>
                ))}
              </div>

              {/* Dynamic Overlay Arrow Navigation Controls (Only shown if more than 1 image) */}
              {productImages.length > 1 && (
                <>
                  {/* Left Arrow Trigger */}
                  <button 
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur text-gray-800 dark:text-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-90 duration-300 z-10"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  {/* Right Arrow Trigger */}
                  <button 
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur text-gray-800 dark:text-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-90 duration-300 z-10"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>

                  {/* Floating Indicator Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {productImages.map((_, index) => (
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

            {/* Bottom Alternative Static Thumbnails Row for Manual Jumps */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 shrink-0 border-2 overflow-hidden transition-all ${
                      currentIndex === idx ? "border-purple-600 scale-95" : "border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <img src={img} alt={`Indicator view ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT SPECIFICATIONS ================= */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase font-bold text-purple-600 dark:text-purple-400 tracking-widest bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md">
                  {product.brand || "Exclusive"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2">
                  {product.title}
                </h1>
              </div>

              <div className="border-t border-b border-gray-100 dark:border-gray-800 py-3 flex items-center justify-between">
                <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                  {usdToNairaDisplay(product.price)}
                </p>
                <p className="text-xs font-bold text-green-600">Stock: {product.stock} left</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => addToCart({ ...product, image: productImages[0] })}
              className="w-full bg-gray-900 dark:bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              Add Item to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;