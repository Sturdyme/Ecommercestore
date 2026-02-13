
import Navbar from './Navbar'
import Categories from './Categories'
import Slideprops from './Slideprops'
import Products from './Products'
import Trending from './Trending'
import Shopping from './Shopping'
import Specialproperty from './Specialproperty'
import SpecialOfferHeader from './SpecialOfferHeader'
import SpecialOfferSection from './SpecialOfferSection'
import ExplorePage from './ExplorePage'
import PromoSection from './PromoSection'
import FeaturedProducts from './FeaturedProducts'
import FeaturedCard from './FeaturedCard'
import FeaturedSection from './FeaturedSection'
import SignUpOffers from './SignUpOffers'
import Footer from './Footer'

const Home = () => {
  return (
    <div>
        <Categories />
        <Slideprops />
        <Trending />
        <Products />
        <Shopping />
       <SpecialOfferSection/> 
       <ExplorePage/> 
       <PromoSection/>
       <FeaturedProducts/>
       <FeaturedSection/>
       <SignUpOffers/>
     
       
    </div>
  )
}

export default Home
