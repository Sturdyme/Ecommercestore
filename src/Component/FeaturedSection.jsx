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
import { Link } from 'react-router-dom';


export const extraItems = [
    {
        id: 1,
        title: "Women's Well-Being",
        image: image1,
        price: 11.00,
        description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
    },

     {
        id:2,
        title: "MA OTC",
        image: image2,
         price: 5.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
        
    },

     {
        id:3,
        title: "Party Supplies",
        image: image3,
         price: 9.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
        
         
        
    },

     {
        id:4,
        title: "Clearance",
        image: image4,
         price: 6.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
    },

     {
        id:5,
        title: "Toys, Games & Books",
        image: image5,
        price: 4.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'

    },

     {
        id:6,
        title: "Sexual Wellness",
        image: image6,
        price: 22.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
    },

    {
        id:7,
        title: "Baby & Kids",
        image: image7,
        price: 5.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
    },

    {
        id:8,
        title: "Yossy's Brand",
        image: image8,
        price: 12.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
    },

    {
        id:9,
        title: "Active Nutrition",
        image: image9,
        price: 9.00,
         description: 'premuim selection of wellness products curated for daily care and comfort',
        category: 'well-Being'
    },
]

const FeaturedSection = () => {
    const [isExpanded, setIsExpanded] = useState(false)
  return (
    <section> 
    <div className='mt-4 mb-4 flex items-center justify-center flex-wrap gap-4'>
      {
        FeaturedCards.map((card, index) => ( <Link to={`/featured/${card.id}`} key={index} className="hover:scale-105 transition-transform duration-200">
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
            <div className='mt-4 mb-4 flex items-center  justify-center flex-wrap gap-4'> {extraItems.map((item, index) => (
                <Link to={`/featured/${item.id}`} key={index} className="hover:scale-105 transition-transform duration-200"> 
                <FeaturedCard
                key={index}
                title={item.title}
                image={item.image}
                price={item.price}
                />
                </Link>
            ))}</div>
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
