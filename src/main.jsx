import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './Utilities/ThemeContext.jsx'
import { WishlistProvider } from './Utilities/WishlistContext.jsx';

createRoot(document.getElementById('root')).render(
  <ThemeProvider> 
    <StrictMode>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </StrictMode>
  </ThemeProvider>
)
