import TriangleWithBar from "../Utilities/TriangleWithBar";
import { FaCheck, FaInfo, FaPhone, FaUser } from "react-icons/fa";


const items = [
    {icon: <FaInfo size={12} />, label: 'INFORMATIONS', links: ['Our Blog', 'About Our Shop', 'Secure Shopping', 'Privacy Policy', 'Delivery Informations']},
    {icon: <FaCheck size={12} />, label: 'CUSTOMER CARE', links: ['Contact Us', 'Site Map', 'Top Sales & BestSellers', 'Gift Voucher', 'Best Sellers']},
    {icon: <FaUser size={12} />, label: 'YOUR ACCOUNT', links: ['Order Status', 'Delivery Address', 'My Wishlist', 'Order History','Newsletter']},
    {icon: <FaPhone size={12} />, label: 'GET IN TOUCH', links: ['Call Us', 'Email Support', 'Live Chat', 'Leave a Feedback', 'FAQ']},

]

export default function FeaturedBanners() {
    return (
        <div className="flex justify-center items-center gap-20 flex-wrap"> 
         {items.map((item, i) => (
         <TriangleWithBar key={i} icon={item.icon} label={item.label} links={item.links}/>
         ))
         }
        </div>
    )
}