import React from 'react'

const ConfirmAlert = ({ setConfirm }) => {
  return (
    <div className='absolute top-[20px] left-1/2 transform -translate-x-1/2 p-4 border border-white/10 rounded shadow-lg text-lg text-white w-96 bg-neutral-950/95 backdrop-blur-sm'>
        <button 
        onClick={() => setConfirm(false)} 
        className='absolute z-20 cursor-pointer -right-2 -top-2 bg-neutral-700/30 text-neutral-200 border border-neutral-200/30 font-normal  rounded-full w-6 h-6 align-middle items-center align-center justify-center flex'
      >
        x
      </button> 
        <p>Confirmation mail is waiting in your inbox.</p>
    </div>
  )
}

export default ConfirmAlert