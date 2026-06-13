import React from 'react'
import { usdToNairaDisplay } from '../Utilities/currency'

const FeaturedCard = ({ image, title, price }) => {
  return (
    <section>
    <div className='mt-10 flex flex-col items-center'> 
        <img src={image} alt="snacks" 
        className='w-36 h-36 object-cover rounded-full border-2 border-transparent hover:border-purple-500 transition-colors'
        />

        <p className='mt-2 text-sm font-semibold text-center text-black dark:text-white hover:text-purple-300 hover:underline cursor-pointer'>{title}</p>
        {/* Display price if provided */}
        {price && <p className='text-xs font-bold text-purple-600 dark:text-purple-400'>{usdToNairaDisplay(price)}</p>}
    </div>
    </section>
  )
}

export default FeaturedCard
