import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const Promocard = ({ title, whatsapp, order, brandlogo, button, badge = "HOT DEAL" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative h-full w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden transition-all duration-300 flex flex-col"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* HEADER / TITLE */}
      <div className="p-4 bg-gradient-to-b from-slate-50/80 to-transparent dark:from-slate-800/50 border-b border-slate-100 dark:border-slate-800/80">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-2">
          {badge}
        </span>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
        
        {/* Main Banner Image */}
        <div className="relative aspect-[16/9] sm:aspect-video w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <img
            src={whatsapp}
            alt={title || "Promo banner"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Secondary Thumbnail Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 aspect-[4/3] sm:aspect-square">
            <img
              src={order}
              alt="Product preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="relative overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 aspect-[4/3] sm:aspect-square">
            <img
              src={brandlogo}
              alt="Brand logo"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="pt-1">
          <button className="w-full relative group/button overflow-hidden rounded-xl bg-purple-600 hover:bg-purple-700 py-3 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition-all duration-300 active:scale-[0.98]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>{button || "Explore Deal"}</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default Promocard;