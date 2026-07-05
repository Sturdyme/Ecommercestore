import React from 'react';

const Promocard = ({ title, whatsapp, order, brandlogo, button }) => {
  return (
    <div className="group h-full w-full max-w-md mx-auto">
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-purple-300 dark:group-hover:border-purple-500">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-100 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <a
            href="#"
            className="block text-base md:text-lg font-semibold text-gray-900 dark:text-white leading-tight tracking-tight line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
          >
            {title}
          </a>
        </div>

        {/* Main Content */}
        <div className="p-4 flex flex-col flex-grow">
          
          {/* Main Image with Zoom Effect */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <img
              src={whatsapp}
              alt="Join our WhatsApp channel"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Secondary Images */}
          <div className="flex gap-3 mt-4">
            {/* Order Image */}
            <div className="w-1/2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <img
                src={order}
                alt="Product preview"
                className="w-full h-20 md:h-24 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Brand Logo */}
            <div className="w-1/2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <img
                src={brandlogo}
                alt="Brand logo"
                className="w-full h-20 md:h-24 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* CTA Button with Unique Animation */}
          <div className="mt-auto pt-5">
            <button className="w-full group/button relative overflow-hidden rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 active:scale-[0.985]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {button}
                <span className="transition-transform duration-300 group-hover/button:translate-x-0.5">→</span>
              </span>
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promocard;