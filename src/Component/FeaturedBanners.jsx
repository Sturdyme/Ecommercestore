import { Link } from "react-router-dom";
import TriangleWithBar from "../Utilities/TriangleWithBar";
import { FaCheck, FaInfo, FaPhone, FaUser } from "react-icons/fa";


const items = [
    {
    icon: <FaInfo size={12} />,
    label: 'INFORMATIONS',
    links: [
      { name: 'Our Blog', path: '/blog' },
      { name: 'About Our Shop', path: '/about' },
      { name: 'Secure Shopping', path: '/secure-shopping' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Delivery Informations', path: '/delivery-info' }
    ]
  },
  {
    icon: <FaCheck size={12} />,
    label: 'CUSTOMER CARE',
    links: [
      { name: 'Contact Us', path: '/contact' }, 
      { name: 'Site Map', path: '/sitemap' },
      { name: 'Help & Support', path: '/helpsupport' },
      { name: 'Gift Voucher', path: '/gift-voucher' },
      { name: 'Best Sellers', path: '/best-sellers' }
    ]
  },

   {
    icon: <FaCheck size={12} />,
    label: 'COLLECTIONS',
    links: [
      { name: 'New Arrivals', path: '/new-arrivals' },
      { name: 'New Offers', path: '/new-offers' },
      { name: 'Top Picks', path: '/top-picks' },
      { name: 'Super Deals', path: '/superdeals' },
      { name: 'Best Selling', path: '/best-selling' }
    ]
  },

   {
    icon: <FaCheck size={12} />,
    label: 'USEFUL LINKS',
    links: [
      { name: 'Service center', path: '/service-center'},
      { name: 'Report a product', path: '/sitemap' },
      { name: 'How To shop', path: '/gift-voucher' },
      { name: 'Return policy', path: '/top-sales' },
      { name: 'How to return a product', path: '/best-sellers' }
    ]
  },

]

export default function FeaturedBanners() {
  return (
    <div className="flex justify-center text-black dark:text-white items-start gap-16 flex-wrap">
      {items.map((item, i) => (
        <TriangleWithBar
          key={i}
          icon={item.icon}
          label={item.label}
          links={item.links}
        />
      ))}
    </div>
  );
}

