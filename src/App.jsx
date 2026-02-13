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

function App() {


  return (
    <div>
      
    <BrowserRouter>
    <Navbar/>
    <Routes> 
    <Route path='/' element={<Home />} />
    <Route path='/signup' element={<SignUp />} />
    <Route path='/login' element={<Login />} />
    <Route path='/loading-to-login' element={<LoadingToLogin />} />
    <Route path='/loading-to-page' element={<LoadingToPage />} />
    <Route path='/cart' element={<Cart />} />
    <Route path='/chat' element={<Chat room="general" />} />
    <Route path='/contact' element={<ContactUs />} />
    </Routes>
    <Footer/>
     </BrowserRouter>
    </div>
  )
}

export default App
