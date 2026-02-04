import React, { useState } from 'react'
import { FeaturedCards } from './FeaturedData'
import FeaturedCard from './FeaturedCard'
import image1 from '../assets/FeaturedPictures/Always.jpg'
import image2 from '../assets/FeaturedPictures/Advil.jpg'
import image3 from '../assets/FeaturedPictures/Birthday.jpg'
import image4 from '../assets/FeaturedPictures/Dollarp.jpg'
import image5 from '../assets/FeaturedPictures/Mini.jpg'
import image6 from '../assets/FeaturedPictures/Opil.jpg'
import image7 from '../assets/FeaturedPictures/Pampers.jpg'
import image8 from '../assets/FeaturedPictures/Super.jpg'
import image9 from '../assets/FeaturedPictures/Workout.jpg'
import { BiDownArrow } from 'react-icons/bi'


const extraItems = [
    {
        title: "Women's Well-Being",
        image: image1
    },

     {
        title: "MA OTC",
        image: image2
    },

     {
        title: "Party Supplies",
        image: image3
    },

     {
        title: "Clearance",
        image: image4
    },

     {
        title: "Toys, Games & Books",
        image: image5
    },

     {
        title: "Sexual Wellness",
        image: image6
    },

    {
        title: "Baby & Kids",
        image: image7
    },

    {
        title: "Yossy's Brand",
        image: image8
    },

    {
        title: "Active Nutrition",
        image: image9
    },
]

const FeaturedSection = () => {
    const [isExpanded, setIsExpanded] = useState(false)
  return (
    <section> 
    <div className='mt-4 mb-4 flex items-center justify-center flex-wrap gap-4'>
      {
        FeaturedCards.map((card) => (
            <FeaturedCard
            title={card.title}
            image={card.image}/>
        ))
      }
    </div>

    {
        isExpanded && (
            <div className='mt-4 mb-4 flex items-center justify-center flex-wrap gap-4'> {extraItems.map(item => (
                <FeaturedCard
                title={item.title}
                image={item.image}
                />
            ))}</div>
        )
    }


     
     {
     
          
    
        <button onClick={() => setIsExpanded(prev => !prev)}
        className='mt-6 mx-auto mb-4 flex items-center gap-1 text-purple-600 hover:text-purple-800 transition'
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
