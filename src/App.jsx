import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Component/Home'
import SignUp from './Pages/SignUp'
import Navbar from './Component/Navbar'
import LoadingToPage from './Pages/LoadingToPage'
import Login from './Pages/Login'
import LoadingToLogin from './Pages/LoadingToLogin'
import Cart from './Pages/Cart'
import Test from './Component/Test'
import Chat from './Component/Chat'
import ContactUs from './Pages/ContactUs'
import Footer from './Component/Footer'
import SuperDeals from './Pages/SuperDeals'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import HomeAppliances from './Pages/HomeAppliances'
import Categories from './Component/Categories'
import SiteMap from './Pages/SiteMap'
import HelpSupport from './Pages/HelpSupport'
import { CartProvider } from './Component/CartContext'
import ScrollToTop from './Utilities/ScrollToTop'
import Checkout from './Component/Checkout'
import CheckoutWrapper from './Component/CheckoutWrapper'
import PaymentSuccess from './Component/PaymentSuccess'
import Dashboard from './Pages/Dashboard'
import Wishlist from './Pages/Wishlist'
import ProtectedRoute from './Component/ProtectedRoute'
import Profile from './Pages/Profile'
import AIChatbox from './Utilities/AiChatbox';
import AISupport from './Pages/AISupport';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import About from './Pages/About';
import VerifyOtp from './Pages/VerifyOtp';
import OrderHistory from './Component/OrderHistory';
import ProductDetails from './Component/ProductDetails';
import Products from './Component/Products';
import FeaturedDetailsPage from './Pages/FeaturedDetailsPage';

function App() {
 useEffect(() => {
  toast("🚧 This site is under construction", {
    duration: 8000,
    position: "top-right",
    style: {
      background: "#7e22ce",
      color: "#fff",
      fontWeight: "bold",
      // RESPONSIVE SETTINGS BELOW:
      fontSize: window.innerWidth < 640 ? "12px" : "14px", 
      width: "auto",
      maxWidth: "350px", // Limits width on desktop
      margin: "0 10px",   // Adds a little space on mobile
    },
    icon: "⚠️",
  });
}, []);


  return (

    <div>
      <CartProvider> 
        <Toaster position='top-right' reverseOrder={false} />
    <BrowserRouter>
    <ScrollToTop />
    <Navbar/>
    <Categories/>
    <main className="pt-[72px] lg:pt-[120px] min-h-screen flex flex-col">
    <Routes> 
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/verify-otp' element={<VerifyOtp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/loading-to-login' element={<LoadingToLogin />} />
      <Route path='/loading-to-page' element={<LoadingToPage />} />
      <Route path='/cart' element={<Cart />} />
     <Route path="/" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path='/featured/:id' element={<FeaturedDetailsPage/>}/>
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/checkout' element={
        <ProtectedRoute>
          <CheckoutWrapper />
        </ProtectedRoute>
      } />
      <Route path='/profile' element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path='/wishlist' element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      } />
      <Route path='/order' element={<OrderHistory />}/>
      <Route path='/chat' element={<Chat room="general" />} />
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/superdeals' element={<SuperDeals />}/>
      <Route path='/homeappliances' element={<HomeAppliances />}/>
      <Route path='/sitemap' element={<SiteMap/>}/>
      <Route path='/helpsupport' element={<HelpSupport/>}/>
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='/aisupportpage' element={<AISupport />} />
      <Route path='/aichatbox' element={<AIChatbox />} />
      <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      <Route path='/about' element={<About />} />
      
      
    </Routes>
    </main>
    <Footer/>
     </BrowserRouter>
     </CartProvider>
     
    </div>
  )
}

export default App
