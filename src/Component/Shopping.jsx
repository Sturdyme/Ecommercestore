import React from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi' // Adding a small icon for the button

const Shopping = () => {
  return (
    <section className='p-4 md:p-8 mt-5'>
      {/* Enhanced background with a subtle gradient and overflow control */}
      <div className='relative overflow-hidden bg-gradient-to-r from-purple-700 to-purple-500 rounded-2xl flex flex-col md:flex-row justify-between items-center p-8 md:p-12 text-white w-full min-h-[120px] shadow-lg border border-purple-300/20'>
        
        {/* Decorative Background Circles for a professional touch */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-40 h-40 bg-purple-900/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className='flex flex-col gap-2 relative z-10 text-center md:text-left'>
          <h1 className='font-bold text-2xl md:text-3xl tracking-tight'>
            Best Selling Products
          </h1>
          <p className='text-sm md:text-base text-purple-50 opacity-90 max-w-md'>
            Shop now and enjoy exclusive deals on our top-rated products!
          </p>
        </div>

        <div className='mt-6 md:mt-0 relative z-10'> 
          <Link to="/superdeals"> 
            <button className='group flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 ease-in-out hover:bg-zinc-800 hover:shadow-xl active:scale-95 shadow-md'> 
              <span className='text-sm md:text-base'>Shop Now</span>
              <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
            </button> 
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Shopping