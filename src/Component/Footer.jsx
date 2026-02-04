
import FeaturedBanners from './FeaturedBanners'



const Footer = () => {


  return (
    <section className='mt-10'> 
    <div className='flex  justify-center items-center'> 
     <FeaturedBanners/>
    </div>

    <div className='mt-10 h-16 flex justify-around items-center  bg-purple-400 w-full '> 
      <div> 
        <p className='text-white font-thin md:text-sm max-sm:text-xs sm:text-xs'> <span className='font-semibold text-md text-white md:text-sm '>© 2026 YossyVogue. </span> All rights reserved.</p>
        <p className='text-white font-thin md:text-sm max-sm:text-xs sm:text-xs'>Designed and made by Sturdyme</p>
      </div>
       <div> 
        <p className='text-white font-thin md:text-sm max-sm:text-xs sm:text-xs'> PRIVACY POLICY | TERMS AND CONDITIONS</p>
       </div>
    </div>
     
    </section>
   
  )
}

export default Footer
