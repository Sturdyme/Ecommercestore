import React from 'react'

const Shopping = () => {
  return (
    <section className='p-8 mt-5'>
      <div className='bg-purple-400 rounded-lg flex justify-between items-center p-10 theme-text-white w-full h-24'>
        <div className='flex flex-col  gap-1'>
        <h1 className='font-semibold text-2xl'>Best Selling Products </h1>
        <p className='text-sm'>Shop now and enjoy exclusive deals on our top-rated products!</p>
        </div>

    <div> 
    <button className='bg-purple-800  theme-text-white p-2 rounded-full font-serif hover:bg-pink-800  transition-colors
     
     duration-300 ease-in-out max-sm:text-xs sm:text-xs'> Shop Now</button>
    </div>
      </div>
    </section>
  )
}

export default Shopping
