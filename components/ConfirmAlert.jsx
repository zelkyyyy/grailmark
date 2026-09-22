import React from 'react'
import { MailCheck, X } from 'lucide-react'

const ConfirmAlert = ({ setConfirm }) => {
  return (
    <div className='fixed z-50 top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-4 pr-10 border border-white/10 rounded-2xl shadow-2xl text-sm text-white w-[calc(100%-2rem)] max-w-sm bg-neutral-950/95 backdrop-blur-sm'>
        <MailCheck size={20} className='shrink-0 text-emerald-400' />
        <p>Confirmation mail is waiting in your inbox.</p>
        <button
          onClick={() => setConfirm(false)}
          aria-label="Close"
          className='absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 duration-200 cursor-pointer'
        >
          <X size={14} />
        </button>
    </div>
  )
}

export default ConfirmAlert