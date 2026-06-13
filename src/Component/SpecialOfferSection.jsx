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
   if (scrollRef.current)  {
    scrollRef.current.scrollBy({
      left: -220,
      behavior: "smooth",
    });
   }
  };

  const scrollRight = () => {
    console.log('Right arrow clicked');
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 220, behavior : 'smooth'})
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 220,
          behavior: "smooth"
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (

    <div className="bg-white dark:bg-gray-900" data-aos="fade-up" data-aos-duration="1000">
      <SpecialOfferHeader onLeft={scrollLeft} onRight={scrollRight} />
      <Specialproperty scrollRef={scrollRef}/>
    </div>
  )
};

export default SpecialOfferSection
