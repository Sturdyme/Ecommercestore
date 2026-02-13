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
      { name: 'Contact Us', path: '/contact' }, // ✅ HERE
      { name: 'Site Map', path: '/sitemap' },
      { name: 'Top Sales & BestSellers', path: '/top-sales' },
      { name: 'Gift Voucher', path: '/gift-voucher' },
      { name: 'Best Sellers', path: '/best-sellers' }
    ]
  },

   {
    icon: <FaCheck size={12} />,
    label: 'CUSTOMER CARE',
    links: [
      { name: 'Contact Us', path: '/contact' }, // ✅ HERE
      { name: 'Site Map', path: '/sitemap' },
      { name: 'Top Sales & BestSellers', path: '/top-sales' },
      { name: 'Gift Voucher', path: '/gift-voucher' },
      { name: 'Best Sellers', path: '/best-sellers' }
    ]
  },

   {
    icon: <FaCheck size={12} />,
    label: 'CUSTOMER CARE',
    links: [
      { name: 'Contact Us', path: '/contact' }, // ✅ HERE
      { name: 'Site Map', path: '/sitemap' },
      { name: 'Top Sales & BestSellers', path: '/top-sales' },
      { name: 'Gift Voucher', path: '/gift-voucher' },
      { name: 'Best Sellers', path: '/best-sellers' }
    ]
  },

]

export default function FeaturedBanners() {
  return (
    <div className="flex justify-center items-start gap-10 flex-wrap">
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

