import React, { useEffect, useRef } from 'react'
import SpecialOfferHeader from './SpecialOfferHeader';
import Specialproperty from './Specialproperty';
import AOS from "aos";
import "aos/dist/aos.css";


const SpecialOfferSection = () => {

 useEffect(() => {
        AOS.init();
      }, []);


     const scrollRef= useRef(null);
    
  const scrollLeft = () => {
    console.log('Left arrow clicked');
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -202, behavior: 'smooth'});
  };

  const scrollRight = () => {
    console.log('Right arrow clicked');
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 202, behavior : 'smooth'})
  };
  return (

    <div className="bg-white dark:bg-gray-900" data-aos="fade-up" data-aos-duration="3000">
      <SpecialOfferHeader onLeft={scrollLeft} onRight={scrollRight} />
      <Specialproperty scrollRef={scrollRef}/>
    </div>
  )
};

export default SpecialOfferSection
