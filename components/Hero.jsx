import React from 'react'
import {Outfit} from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });
const Hero = () => {
  return (
    <div className='text-[70px] h-screen w-full flex flex-col items-center justify-center z-10'>
        <span className={`text-neutral-100 tracking-tighter lg:text-[180px] md:text-[100px] font-bold ${outfit.className}`}>GrailMark</span>
        {/* <div className='flex gap-4 '>
              <button className='md:text-[60px] lg:text-[120px] text-white bg-neutral-800/40 hover:bg-neutral-300/60 duration-300 backdrop-blur-[1px] border border-white/5 h-fit px-4 py-2 rounded-2xl'>Log in</button>
              <button className='md:text-[60px] lg:text-[120px] text-neutral-900 bg-white/90 hover:bg-neutral-800/40 hover:text-white duration-300 backdrop-blur-[1px] border border-black/80 h-fit px-4 py-2 rounded-2xl'>Sign up</button>
        </div> */}

    </div>
  )
}

export default Hero