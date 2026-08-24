import whatsapp from '../assets/ExplorePictures/Whatsapp.jpg'
import order from '../assets/ExplorePictures/order.jpg'
import brandlogo from '../assets/ExplorePictures/brandlogo.png'
import instagram from '../assets/ExplorePictures/instagram.jpg'
import instgramcomment from '../assets/ExplorePictures/instagramcomment.png'
import spcialoffer from '../assets/ExplorePictures/spcialoffer.jpg'
import rewards from '../assets/ExplorePictures/rewards.jpg'

export const PromoCards = [
    {
        title: 'Join our Whatsapp channel to discover new products available for sale',
        whatsapp,
        order,
        brandlogo,
        button: 'Join Now',
        link: 'https://whatsapp.com/channel/your-channel-id', // External WhatsApp link
        isExternal: true,
    },
    {
        title: 'Follow us on Instagram so you will not miss out on New Offers',
        whatsapp: instagram,
        order: instgramcomment,
        brandlogo,
        button: 'Follow Us',
        link: 'https://instagram.com/your-handle', // External Instagram link
        isExternal: true,
    },
    {
        title: 'Unlock Your offer, and stand a chance to win exciting prizes and rewards',
        whatsapp: spcialoffer,
        order: rewards,
        brandlogo,
        button: 'Unlock Now',
        link: '/prize-wheel', 
        isExternal: false,
    },
];