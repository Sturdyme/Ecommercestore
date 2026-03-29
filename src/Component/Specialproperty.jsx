import React from 'react'
import Specialoffers from './Specialoffers'
import camera from '../assets/specialOfferImages/camera.png'
import chair from '../assets/specialOfferImages/chair.png'
import dining from '../assets/specialOfferImages/dining.png'
import knives from '../assets/specialOfferImages/Knives.png'
import scissors from '../assets/specialOfferImages/scissors.png'
import cutlery from '../assets/specialOfferImages/Cutlery.png'
import mug from '../assets/specialOfferImages/mug.png'
const Specialproperty = ({scrollRef}) => {
  return (
   

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth gap-2 items-stretch bg-white dark:bg-gray-900 snap-x snap-mandatory scrollbar-hide"
      >
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-1"
            productName="Balack Pro Camera"
            oldPrice={1151.99}
            newPrice={999.00}
            productImage={camera}
          />
        </div>
  <div className="min-w-[200px] flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-2"
            productName="Single Stand Chair"
            oldPrice={470.00}
            newPrice={399.}
            productImage={chair}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-3"
            productName="Dining Chair"
            oldPrice={559.00}
            newPrice={499.}
            productImage={dining}
          />
        </div>
  <div className="min-w-[320px]  flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-4"
            productName=" Knives Set"
            oldPrice={599.00}
            newPrice={399.00}
            productImage={knives}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-5"
            productName="Scissors Set"
            oldPrice={180.00}
            newPrice={99.00}
            productImage={scissors}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-6"
            productName="Advanced Cutlery"
            oldPrice={312.00}
            newPrice={229.00}
            productImage={cutlery}
          />
        </div>
  <div className="min-w-[200px] flex-shrink-0 snap-start">
          <Specialoffers 
            id="sp-7"
            productName="Imported kitchen Utensils"
            oldPrice={102.00}
            newPrice={88.00}
            productImage={mug}
          />
        </div>
      </div>
 ) }

 export default Specialproperty
  
