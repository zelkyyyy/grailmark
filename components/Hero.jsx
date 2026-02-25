import React from 'react'
import {Outfit} from 'next/font/google';
import Login from './Login';
const outfit = Outfit({ subsets: ['latin'] });
const Hero = ({ loggedIn, setLoggedIn }) => {
  return (
    <div className=' text-[70px] h-screen w-full flex flex-col items-center justify-center z-10'>
        <span className={`tracking-tighter text-transparent bg-clip-text bg-linear-30 from-neutral-500 select-none to-neutral-100 anim lg:text-[180px] md:text-[100px] font-bold ${outfit.className}`}>ClothSet</span>
          <Login setLoggedIn={setLoggedIn} />
          {/* {loggedIn && <Selection />} */}
          {loggedIn && <a className='absolute bottom-0' href="#lista">
        <img className=' h-12 w-12  jump' src="/arrow.svg" alt="Arrow" />

          </a>}
    </div>
  )
}

export default Hero