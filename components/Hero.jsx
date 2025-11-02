import React from 'react'
import {Outfit} from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });
const Hero = () => {
  return (
    <div className='inset-0 h-screen flex items-center justify-center z-10'>
        <h1 className={`text-neutral-100 tracking-tighter text-[180px] font-bold ${outfit.className}`}>GrailMark</h1>
    </div>
  )
}

export default Hero