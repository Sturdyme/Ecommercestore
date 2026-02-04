import React from 'react'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

const SpecialOfferHeader = ({onLeft, onRight}) => {
  return (
    <section>
          <div className='flex items-center justify-between px-10 mt-10'>
        <h1 className='text-1xl'>SPECIAL OFFERS</h1>
       <div> 
        <button onClick={onLeft}> <BiLeftArrow className='hover:text-gray-400'/></button>
        <button onClick={onRight}> <BiRightArrow className='hover:text-gray-400' /> </button>
       </div>
      </div>
      <div className="border mt-2 h-1 w-full mb-6"> 
  <p className="bg-purple-400 h-full w-40"></p>
</div>
      
    </section>
  )
};

export default SpecialOfferHeader
