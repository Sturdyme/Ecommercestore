import React from 'react'
import FeaturedBanners from './FeaturedBanners'

const Footer = () => {
  return (
    <footer className="w-full"> 
      {/* Upper Footer (Banners) */}
      <FeaturedBanners />

      {/* Bottom Bar */}
      <div className='min-h-20 py-6 md:py-0 flex flex-col md:flex-row justify-around items-center bg-purple-500 dark:bg-purple-900 w-full px-4 gap-4 md:gap-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]'> 
        
        {/* Credits Section */}
        <div className="text-center md:text-left"> 
          <p className='text-white/90 font-light text-[10px] sm:text-xs md:text-sm tracking-wide'> 
            <span className='font-bold text-white'>© 2026 YossyVogue.</span> All rights reserved.
          </p>
          <p className='text-white/70 font-light text-[10px] sm:text-xs md:text-sm italic'>
            Designed and made by <span className="hover:text-white transition-colors cursor-pointer">Sturdyme</span>
          </p>
        </div>

        {/* Legal Links Section */}
        <div className="flex gap-4 md:gap-8"> 
          <a href="/privacy-policy" className='text-white/90 hover:text-white font-medium text-[10px] sm:text-xs md:text-sm tracking-widest transition-all duration-300 hover:scale-105'>
            PRIVACY POLICY
          </a>
          <span className="text-white/30 hidden md:block">|</span>
          <a href="/terms" className='text-white/90 hover:text-white font-medium text-[10px] sm:text-xs md:text-sm tracking-widest transition-all duration-300 hover:scale-105'>
            TERMS & CONDITIONS
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer