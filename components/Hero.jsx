import React from 'react'
import {Outfit} from 'next/font/google';
import { useState } from 'react';
import Login from './Login';
const outfit = Outfit({ subsets: ['latin'] });
const Hero = ({ loggedIn, setLoggedIn }) => {
  return (
    <div className=' text-[70px] h-screen w-full flex flex-col items-center justify-center z-10'>
        <span className={`text-neutral-100 tracking-tighter anim lg:text-[180px] md:text-[100px] font-bold ${outfit.className}`}>GrailMark</span>
          <Login setLoggedIn={setLoggedIn} />
          {loggedIn && <a className='absolute bottom-0' href="#lista">
        <img className=' h-12 w-12  jump' src="/arrow.svg" alt="Arrow" />

          </a>}
    </div>
  )
}

export default Hero