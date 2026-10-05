import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const formatNaira = (value) => `₦${Number(value).toLocaleString('en-NG')}`;

const FeaturedCard = ({ id, image, title, price, onAddToCart }) => {
  // Link to the product page when an id is provided, otherwise a plain div
  const Wrapper = id ? Link : 'div';

  const wrapperProps = id
    ? { to: `/featured/${id}` }
    : {};

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 w-full max-w-[160px] sm:max-w-[200px]"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Image with ring animation */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500/20 via-transparent to-pink-500/20 group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-500">
        <Wrapper {...wrapperProps} className="block w-full h-full">
          <img
            src={image || '/placeholder.png'}
            alt={title || 'Featured item'}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/placeholder.png';
            }}
            className="w-full h-full object-cover rounded-full shadow-inner group-hover:scale-105 transition-transform duration-300"
          />
        </Wrapper>

        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-md scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
            title="Add to cart"
          >
            <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-3 flex flex-col items-center text-center w-full">
        <Wrapper {...wrapperProps} className="w-full">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
        </Wrapper>

        {price != null && (
          <span className="mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/50">
            {formatNaira(price)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default FeaturedCard;