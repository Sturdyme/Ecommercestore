import React, { useState } from 'react'
import { FeaturedCards, extraItems } from './FeaturedData'
import FeaturedCard from './FeaturedCard'
import { BiDownArrow } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const FeaturedSection = () => {
    const [isExpanded, setIsExpanded] = useState(false)
  return (
    <section>
    <div className='mt-4 mb-4 flex items-center justify-center flex-wrap gap-4'>
      {
        FeaturedCards.map((card) => (
          <Link to={`/featured/${card.id}`} key={card.id} className="hover:scale-105 transition-transform duration-200">
            <FeaturedCard
              title={card.title}
              image={card.image}
              price={card.price}
            />
          </Link>
        ))
      }
    </div>

    {
        isExpanded && (
            <div className='mt-4 mb-4 flex items-center justify-center flex-wrap gap-4'>
              {extraItems.map((item) => (
                <Link to={`/featured/${item.id}`} key={item.id} className="hover:scale-105 transition-transform duration-200">
                  <FeaturedCard
                    title={item.title}
                    image={item.image}
                    price={item.price}
                  />
                </Link>
              ))}
            </div>
        )
    }


     
     {
     
          
    
        <button onClick={() => setIsExpanded(prev => !prev)}
        className='mt-6 mx-auto mb-4 flex items-center gap-1 text-black dark:text-white hover:text-purple-800 transition'
        > 
        {isExpanded ? 'See less' : 'See more'}
        <span className= 'mt-[4px]'>  <BiDownArrow 
         size={18}
    className={`transition-transform duration-300 ${
      isExpanded ? 'rotate-180' : ''
    }`}
        /> </span>
        
        </button>
     }
    
    </section>
  )
}

export default FeaturedSection
