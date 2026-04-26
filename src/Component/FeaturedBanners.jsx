import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { FaInfo } from 'react-icons/fa6' // Using Fa6 for a more modern look
import { IoLinkSharp } from 'react-icons/io5'
import { MdCollections } from 'react-icons/md'

const FeaturedBanners = () => {
  return (
    <section className='py-16 px-6 dark:bg-zinc-900 '>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-black dark:text-white'> 
        
        {/* Brand Section */}
        <div className='space-y-6'>
          <div className='max-w-[280px]'>
            <h4 className='text-xl font-semibold leading-tight tracking-tight'>
              Gear for Your Journey. <br/> 
              <span className='text-gray-500 font-normal'>Style for Your Success.</span>
            </h4> 
            <p className='text-sm mt-4 text-gray-600 dark:text-gray-400'>
              Rooted in Essex County, Shipping Nationwide.
            </p>
          </div>

          <div className='flex gap-4 items-center'> 
            <a href="#" className='hover:text-blue-600 transition-colors'><FaFacebook size={20} /></a>
            <a href="#" className='hover:text-pink-600 transition-colors'><FaInstagram size={20} /></a>
            <a href="#" className='hover:text-blue-400 transition-colors'><FaTwitter size={20} /></a>
            <a href="#" className='hover:text-red-600 transition-colors'><FaYoutube size={20} /></a>
              <a href="#" className='hover:text-green-500 transition-colors'><FaWhatsapp size={20} /></a>
          </div>
        </div>

        {/* Information Column */}
        <div> 
          <div className='flex gap-2 items-center mb-6 border-b border-gray-200 dark:border-zinc-800 pb-2'> 
            <FaInfo size={16} className='text-gray-400' />
            <h2 className='text-sm font-bold uppercase tracking-widest'>Information</h2> 
          </div>
          <ul className='flex flex-col space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400'> 
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/blog'>Our Blog</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/privacy-policy'>Privacy Policy</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/about'>About Our Shop</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/sitemap'>Site Map</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/helpsupport'>Help & Support</a></li>
          </ul>
        </div>

        {/* Collections Column */}
        <div> 
          <div className='flex gap-2 items-center mb-6 border-b border-gray-200 dark:border-zinc-800 pb-2'> 
            <MdCollections size={18} className='text-gray-400' />
            <h2 className='text-sm font-bold uppercase tracking-widest'>Collections</h2> 
          </div>
          <ul className='flex flex-col space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400'> 
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/superdeals'>Super Deals</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/best-selling'>Best Selling</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/new-arrivals'>New Arrivals</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/sitemap'>Site Map</a></li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div> 
          <div className='flex gap-2 items-center mb-6 border-b border-gray-200 dark:border-zinc-800 pb-2'> 
            <IoLinkSharp size={18} className='text-gray-400' />
            <h2 className='text-sm font-bold uppercase tracking-widest'>Quick Links</h2> 
          </div>
          <ul className='flex flex-col space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400'> 
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/blog'>Our Blog</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/privacy-policy'>Privacy Policy</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/about'>About Our Shop</a></li>
            <li className='hover:translate-x-1 hover:text-black dark:hover:text-white transition-all cursor-pointer'><a href='/sitemap'>Site Map</a></li>
          </ul>
        </div>

      </div>
    </section>
  )
}

export default FeaturedBanners






























// import { Link } from "react-router-dom";
// import TriangleWithBar from "../Utilities/TriangleWithBar";
// import { FaCheck, FaInfo, FaPhone, FaUser } from "react-icons/fa";


// const items = [
//     {
//     icon: <FaInfo size={12} />,
//     label: 'INFORMATIONS',
//     links: [
//       { name: 'Our Blog', path: '/blog' },
//       { name: 'About Our Shop', path: '/about' },
//       { name: 'Secure Shopping', path: '/secure-shopping' },
//       { name: 'Privacy Policy', path: '/privacy-policy' },
//       { name: 'Delivery Informations', path: '/delivery-info' }
//     ]
//   },
//   {
//     icon: <FaCheck size={12} />,
//     label: 'CUSTOMER CARE',
//     links: [
//       { name: 'Contact Us', path: '/contact' }, 
//       { name: 'Site Map', path: '/sitemap' },
//       { name: 'Help & Support', path: '/helpsupport' },
//       { name: 'Gift Voucher', path: '/gift-voucher' },
//       { name: 'Best Sellers', path: '/best-sellers' }
//     ]
//   },

//    {
//     icon: <FaCheck size={12} />,
//     label: 'COLLECTIONS',
//     links: [
//       { name: 'New Arrivals', path: '/new-arrivals' },
//       { name: 'New Offers', path: '/new-offers' },
//       { name: 'Top Picks', path: '/top-picks' },
//       { name: 'Super Deals', path: '/superdeals' },
//       { name: 'Best Selling', path: '/best-selling' }
//     ]
//   },

//    {
//     icon: <FaCheck size={12} />,
//     label: 'USEFUL LINKS',
//     links: [
//       { name: 'Service center', path: '/service-center'},
//       { name: 'Report a product', path: '/sitemap' },
//       { name: 'How To shop', path: '/gift-voucher' },
//       { name: 'Return policy', path: '/top-sales' },
//       { name: 'How to return a product', path: '/best-sellers' }
//     ]
//   },

// ]

// export default function FeaturedBanners() {
//   return (
//     <div className="flex justify-center text-black dark:text-white items-start gap-16 flex-wrap">
//       {items.map((item, i) => (
//         <TriangleWithBar
//           key={i}
//           icon={item.icon}
//           label={item.label}
//           links={item.links}
//         />
//       ))}
//     </div>
//   );
// }

