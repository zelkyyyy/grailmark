'use client'

import { useEffect, useState } from 'react'
import { Trash2, Check } from 'lucide-react'

const DeleteButton = ({ onConfirm, className = '' }) => {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timeout = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(timeout)
  }, [confirming])

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirming) {
      onConfirm()
      setConfirming(false)
    } else {
      setConfirming(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={confirming ? 'Confirm delete' : 'Delete'}
      className={`absolute -top-2 -right-2 z-10 flex h-7 items-center gap-1 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
        confirming
          ? 'px-2.5 border-red-500 bg-red-600 text-white opacity-100'
          : 'w-7 justify-center border-red-600/60 bg-red-500/20 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600'
      } ${className}`}
    >
      {confirming ? (
        <>
          <Check size={13} /> Confirm
        </>
      ) : (
        <Trash2 size={13} />
      )}
    </button>
  )
}

export default DeleteButton
