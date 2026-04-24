import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, FiHeart, FiUser, FiLogOut, 
  FiGrid, FiCreditCard, FiArrowRight, FiMenu, FiX 
} from 'react-icons/fi';
import product1 from '../assets/specialOfferImages/cam.png';
import product2 from '../assets/specialOfferImages/bicycle.png';
import bgImage from '../assets/specialOfferImages/shoppingcart.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
         
          <button onClick={toggleSidebar} className="md:hidden text-2xl">
            <FiX />
          </button>
        </div>

        <nav className="flex-1 px-4 md:mt-10 lg:mt-0 space-y-2 overflow-y-auto">
          <NavItem icon={<FiGrid />} label="Overview" active onClick={() => setIsSidebarOpen(false)} />
          <Link to="/cart" className="block">
            <NavItem icon={<FiShoppingBag />} label="My Orders" onClick={() => setIsSidebarOpen(false)} />
          </Link>
          <NavItem icon={<FiHeart />} label="Wishlist" onClick={() => setIsSidebarOpen(false)} />
          <NavItem icon={<FiCreditCard />} label="Payments" onClick={() => { navigate('/checkout'); setIsSidebarOpen(false); }} />
          <NavItem icon={<FiUser />} label="Profile Settings" onClick={() => setIsSidebarOpen(false)} />
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full mt-16 overflow-x-hidden">
        {/* Top Navbar for Mobile */}
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md md:hidden border-b border-gray-200 dark:border-gray-700">
          <button onClick={toggleSidebar} className="p-2 text-2xl">
            <FiMenu />
          </button>
         
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                Here's what's happening with your order today.
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <button className="relative p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                <FiShoppingBag className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  3
                </span>
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
            <StatCard title="Total Orders" value="12" icon={<FiShoppingBag className="text-blue-500" />} />
            <StatCard title="Wishlist Items" value="08" icon={<FiHeart className="text-pink-500" />} />
            <StatCard title="Reward Points" value="1,250" icon={<FiCreditCard className="text-green-500" />} />
          </div>

          {/* Recommended Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold">Recommended for You</h3>
              <Link to="/" className="text-sm md:text-base text-purple-600 flex items-center hover:underline">
                View All <FiArrowRight className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard 
                image={product1} 
                name="Sony A7 Camera" 
                price="₦85,000" 
              />
              <ProductCard 
                image={product2} 
                name="Sport Bicycle X200" 
                price="₦45,000" 
              />
              {/* Checkout Card */}
             <div 
  className="relative rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl overflow-hidden group"
  style={{
        // 2. Use the imported variable here
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
>
  {/* 2. Black/Purple Gradient Overlay (Crucial for text readability) */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-purple-900/70 z-0 group-hover:opacity-90 transition-opacity duration-300" />

  {/* 3. Content - Must use z-10 to stay above the overlay */}
  <div className="relative z-10">
    <h4 className="text-xl font-extrabold mb-2 tracking-tight">Ready to ship?</h4>
    <p className="text-sm opacity-90 leading-relaxed font-medium">Complete your payment to process pending cart items.</p>
  </div>
  
  <button 
    onClick={() => navigate('/checkout')}
    // Re-styled the button slightly to pop against the image
    className="relative z-10 bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition mt-6 text-sm shadow-md active:scale-95"
  >
    Go to Checkout
  </button>
</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Sub-components kept the same but ensured they use responsive padding/text
const NavItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${active ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
    <span className="text-lg">{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">{icon}</div>
  </div>
);

const ProductCard = ({ image, name, price }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 group cursor-pointer">
    <div className="relative overflow-hidden h-48">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
    </div>
    <div className="p-4">
      <h4 className="font-bold text-base mb-1 truncate">{name}</h4>
      <p className="text-purple-600 font-bold text-sm">{price}</p>
    </div>
  </div>
);

export default Dashboard;