import React from 'react'
import { BiDownArrow } from 'react-icons/bi'

const TriangleIcon = ({ size = 20, color = '#7c3aed', children}) => {
    
    

  return (
   <div className='relative flex items-center justify-center'
   style={{
    width: size * 2,
    height: size * 2,
   }} 
   > 


      <div
      className="absolute"
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderBottom: `${size}px solid #7c3aed`,
      }}
    />
  
  <div className='relative z-10 text-white text-xs font-semibold'> 
    {children}
  </div>

   </div>

    )  
}

export default TriangleIcon
