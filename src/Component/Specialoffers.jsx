import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { FaCartArrowDown, FaEye, FaHeart } from 'react-icons/fa'
import { FaBurger } from 'react-icons/fa6'
import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { usdToNairaDisplay } from "../Utilities/currency";
import { useWishlist } from '../Utilities/WishlistContext';

function Specialoffers({id, productName, productImage, oldPrice, newPrice, onQuickView, }) {
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const isWishlisted = wishlist.some((item) => item.id === id);

    const toggleWishlist = () => {
      if (isWishlisted) {
        removeFromWishlist(id);
      } else {
        addToWishlist({ id, title: productName, price: newPrice, image: productImage });
      }
    };

    return (
        <section className='mb-5 mt-3 p-1 sm:mb-10 sm:mt-5 sm:p-2'>
            <article className='max-w-[170px] xs:max-w-[200px] sm:max-w-sm mx-auto'> 
                <div className='group relative flex flex-col p-1.5 sm:p-3 border border-gray-200 dark:border-zinc-800 rounded-lg sm:rounded-2xl shadow-sm 
                                hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 bg-white dark:bg-zinc-900 overflow-hidden'>
                    
                    {/* Image Container with Zoom Effect */}
                    <div className='relative overflow-hidden rounded-md sm:rounded-xl h-32 sm:h-56 md:h-80'>
                        <img 
                            src={productImage}
                            alt={productName} 
                            className='w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
                        />
                        
                        {/* Discount Badge */}
                        <div className='absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-purple-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full uppercase tracking-wider'>
                            Special Offer
                        </div>

                        {/* Floating Action Menu - Appears on Hover (desktop) / Always visible, smaller (mobile) */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-3 bg-black/20 backdrop-blur-[1px] 
                                        opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                            
                            {/* Quick View */}
                            <button 
                            onClick={onQuickView}
                                title="Quick View"
                                className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full 
                                           shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 sm:translate-y-8 sm:group-hover:translate-y-0 sm:delay-[50ms]"
                            >
                                <FaEye className="text-xs sm:text-[18px]" />
                            </button>

                            {/* Wishlist */}
                            <button 
                              onClick={toggleWishlist}
                              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                              className={`w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 sm:translate-y-8 sm:group-hover:translate-y-0 sm:delay-[100ms] ${isWishlisted ? 'bg-purple-600 text-white' : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-purple-600 hover:text-white'}`}
                            >
                                <FaHeart className="text-xs sm:text-[18px]" />
                            </button>

                            {/* Add to Cart */}
                            <button 
                                onClick={() => addToCart({ id, title: productName, price: newPrice, image: productImage })}
                                title="Add to Cart"
                                className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full 
                                           shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 sm:translate-y-8 sm:group-hover:translate-y-0 sm:delay-[150ms]"
                            >
                                <FaCartArrowDown className="text-xs sm:text-[18px]" />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='mt-1.5 sm:mt-4 px-0.5 sm:px-1 pb-1 sm:pb-2'>
                        <h3 className='font-semibold text-[11px] sm:text-sm md:text-base text-zinc-800 dark:text-zinc-100 truncate mb-0.5 sm:mb-1'>
                            {productName}
                        </h3> 

                        <div className='flex items-center gap-1.5 sm:gap-3'>
                            <span className='text-xs sm:text-lg font-bold text-purple-600 dark:text-purple-400'>
                                {usdToNairaDisplay(newPrice)}
                            </span> 
                            <span className='text-[10px] sm:text-sm line-through text-zinc-400 font-light'>
                                {usdToNairaDisplay(oldPrice)}
                            </span> 
                        </div>
                    </div>
                </div>  
            </article>
        </section>
    )
}

export default Specialoffers;
