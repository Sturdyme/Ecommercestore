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
            productName="Balack Pro Camera"
            oldPrice="$1151.00"
            newPrice="999.99"
            productImage={camera}
          />
        </div>
  <div className="min-w-[200px] flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Single Stand Chair"
            oldPrice="$470.00"
            newPrice="$399.99
            "
            productImage={chair}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Dining Chair"
            oldPrice="$559.00"
            newPrice="$499.99"
            productImage={dining}
          />
        </div>
  <div className="min-w-[320px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName=" Knives Set"
            oldPrice="$599.00"
            newPrice="$399.99"
            productImage={knives}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Scissors Set"
            oldPrice="$180.00"
            newPrice="99.99"
            productImage={scissors}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Advanced Cutlery"
            oldPrice="$312.00"
            newPrice="$229.99"
            productImage={cutlery}
          />
        </div>
  <div className="min-w-[200px] flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Imported kitchen Utensils"
            oldPrice="$102.00"
            newPrice="$88.99"
            productImage={mug}
          />
        </div>
      </div>
 ) }

 export default Specialproperty
  
