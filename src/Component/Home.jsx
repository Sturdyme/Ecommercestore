
import Navbar from './Navbar'
import Slideprops from './Slideprops'
import Products from './Products'
import Trending from './Trending'
import Shopping from './Shopping'
import SpecialOfferSection from './SpecialOfferSection'
import ExplorePage from './ExplorePage'
import PromoSection from './PromoSection'
import FeaturedProducts from './FeaturedProducts'
import FeaturedSection from './FeaturedSection'
import SignUpOffers from './SignUpOffers'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    let userData = null;
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') userData = JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse stored user in Home', err);
      userData = null;
    }
    setIsLoggedIn(Boolean(token));
    setUser(userData);

    // Listen for login/logout events
    const handleUserLogin = (event) => {
      let loginData = null;
      if (event?.detail) {
        loginData = event.detail;
      } else {
        try {
          const stored = localStorage.getItem('user');
          if (stored && stored !== 'undefined') loginData = JSON.parse(stored);
        } catch (err) {
          console.error('Failed to parse stored user on userLogin in Home', err);
        }
      }
      setUser(loginData);
      setIsLoggedIn(Boolean(loginData));
    };

    const handleUserLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  return (
    <div>
        <Slideprops />
        <Trending />
        <Products />
        <Shopping />
        <SpecialOfferSection/> 
        <ExplorePage/> 
        <PromoSection/>
        <FeaturedProducts/>
        <FeaturedSection/>
        
        {/* Dashboard Banner for Logged-in Users */}
        {isLoggedIn && (
          <section className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-900 dark:to-purple-950 py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                  </h2>
                  <p className="text-purple-100 text-lg mb-6">
                    Check your orders, manage your profile, and track your purchases all in one place.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-purple-50 transition-colors transform hover:scale-105 active:scale-95"
                  >
                    Go to Dashboard
                    <FiArrowRight className="text-xl" />
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                    <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white">
                      <div className="text-5xl mb-3">📊</div>
                      <p className="text-sm font-semibold opacity-90">Your Personal Dashboard</p>
                      <p className="text-xs opacity-75 mt-2">Manage everything in one place</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SignUpOffers for Non-Logged-in Users */}
        {!isLoggedIn && <SignUpOffers/>}
       
    </div>
  )
}

export default Home
