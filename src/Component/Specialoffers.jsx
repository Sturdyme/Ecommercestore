import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { FaCartArrowDown, FaEye } from 'react-icons/fa'
import { FaBurger } from 'react-icons/fa6'
import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { usdToNairaDisplay } from "../Utilities/currency";

function Specialoffers({id, productName, productImage, oldPrice, newPrice}) {
    const { addToCart } = useCart();

    return (
        <section className='mb-10 mt-5 p-2'>
            <article className='max-w-sm mx-auto'> 
                <div className='group relative flex flex-col p-3 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm 
                                hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 bg-white dark:bg-zinc-900 overflow-hidden'>
                    
                    {/* Image Container with Zoom Effect */}
                    <div className='relative overflow-hidden rounded-xl h-80'>
                        <img 
                            src={productImage}
                            alt={productName} 
                            className='w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
                        />
                        
                        {/* Discount Badge */}
                        <div className='absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider'>
                            Special Offer
                        </div>

                        {/* Floating Action Menu - Appears on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20 backdrop-blur-[2px] 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            
                            {/* Quick View */}
                            <button 
                                title="Quick View"
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full 
                                           shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 translate-y-8 group-hover:translate-y-0 delay-[50ms]"
                            >
                                <FaEye size={18} />
                            </button>

                            {/* Compare */}
                            <button 
                                title="Compare"
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full 
                                           shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 translate-y-8 group-hover:translate-y-0 delay-[100ms]"
                            >
                                <FaBurger size={18} />
                            </button>

                            {/* Add to Cart */}
                            <button 
                                onClick={() => addToCart({ id, title: productName, price: newPrice, image: productImage })}
                                title="Add to Cart"
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full 
                                           shadow-xl hover:bg-purple-600 hover:text-white transition-all duration-300 translate-y-8 group-hover:translate-y-0 delay-[150ms]"
                            >
                                <FaCartArrowDown size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='mt-4 px-1 pb-2'>
                        <h3 className='font-semibold text-sm md:text-base text-zinc-800 dark:text-zinc-100 truncate mb-1'>
                            {productName}
                        </h3> 

                        <div className='flex items-center gap-3'>
                            <span className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                                {usdToNairaDisplay(newPrice)}
                            </span> 
                            <span className='text-sm line-through text-zinc-400 font-light'>
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