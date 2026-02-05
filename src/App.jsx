import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Component/Home'
import SignUp from './Pages/SignUp'
import Navbar from './Component/Navbar'
import LoadingToPage from './Pages/LoadingToPage'

function App() {


  return (
    <div>
    <BrowserRouter>
    <Navbar/>
    <Routes> 
    <Route path='/' element={<Home />} />
    <Route path='/signup' element={<SignUp />} />
    <Route path='/loading-to-page' element={<LoadingToPage />} />
    </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
