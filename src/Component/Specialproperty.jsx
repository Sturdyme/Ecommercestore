import React from 'react'
import Specialoffers from './Specialoffers'
import camera from '../assets/specialOfferImages/camera.png'
import chair from '../assets/specialOfferImages/chair.png'
import dining from '../assets/specialOfferImages/dining.png'
import canon from '../assets/specialOfferImages/canon.png'
import knives from '../assets/specialOfferImages/Knives.png'
import scissors from '../assets/specialOfferImages/scissors.png'
import cutlery from '../assets/specialOfferImages/Cutlery.png'
import mug from '../assets/specialOfferImages/mug.png'
const Specialproperty = ({scrollRef}) => {
  return (
   

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth gap-2 items-stretch bg-gray-100 snap-x snap-mandatory scrollbar-hide"
      >
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Balack Pro Camera"
            oldPrice="$251.00"
            newPrice="$149.00"
            productImage={camera}
          />
        </div>
  <div className="min-w-[200px] flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Single Stand Chair"
            oldPrice="$399.00"
            newPrice="$299.00"
            productImage={chair}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Dining Chair"
            oldPrice="$279.00"
            newPrice="$229.00"
            productImage={dining}
          />
        </div>
  <div className="min-w-[320px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName=" Knives Set"
            oldPrice="$279.00"
            newPrice="$229.00"
            productImage={knives}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Scissors Set"
            oldPrice="$279.00"
            newPrice="$229.00"
            productImage={scissors}
          />
        </div>
  <div className="min-w-[200px]  flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Advanced Cutlery"
            oldPrice="$279.00"
            newPrice="$229.00"
            productImage={cutlery}
          />
        </div>
  <div className="min-w-[200px] flex-shrink-0 snap-start">
          <Specialoffers 
            productName="Imported kitchen Utensils"
            oldPrice="$279.00"
            newPrice="$229.00"
            productImage={mug}
          />
        </div>
      </div>
 ) }

 export default Specialproperty
  
