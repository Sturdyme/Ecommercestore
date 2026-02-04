import React from 'react'


const FeaturedCard = ({image, title }) => {
  return (
    <section>
    <div className='mt-10'> 
        <img src={image} alt="snacks" 
        className='w-36 h-36 object-cover mx-auto rounded-full'
        />

        <p className='mt-2 text-sm text-center hover:text-purple-300 hover:underline cursor-pointer'>{title}</p>
    </div>
    </section>
  )
}

export default FeaturedCard
