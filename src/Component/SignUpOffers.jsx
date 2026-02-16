import React from 'react'
import { Link } from 'react-router-dom'

const SignUpOffers = () => {
  return (
    <section>
      <div className='bg-[#ded5d0] h-32 '> 
      <div className='flex justify-center '>
        <Link to="/signup"> 
        <button className='px-4 py-3 border border-black mt-10 bg-gray-200 items-center hover:bg-purple-300 hover:theme-text-white transition ease-in-out
         duration-400 font-semibold text-sm
       theme-text-black rounded-full'> Sign up for deals and offers!</button>
       </Link>
      </div>
      </div>
    </section>
  )
}

export default SignUpOffers
