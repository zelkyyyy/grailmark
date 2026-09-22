'use client'

import { useEffect, useState } from 'react'
import { Trash2, Check } from 'lucide-react'

const DeleteButton = ({ onConfirm, size = 'md', className = 'absolute -top-2 -right-2' }) => {
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

  const isSm = size === 'sm'
  const height = isSm ? 'h-6' : 'h-7'
  const idleWidth = isSm ? 'w-6' : 'w-7'
  const iconSize = isSm ? 11 : 13
  const textSize = isSm ? 'text-[10px]' : 'text-xs'

  return (
    <button
      onClick={handleClick}
      aria-label={confirming ? 'Confirm delete' : 'Delete'}
      className={`z-10 flex ${height} items-center gap-1 rounded-full border ${textSize} font-semibold transition-all duration-200 cursor-pointer ${
        confirming
          ? 'px-2.5 border-red-500 bg-red-600 text-white opacity-100'
          : `${idleWidth} justify-center border-red-600/60 bg-red-500/20 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600`
      } ${className}`}
    >
      {confirming ? (
        <>
          <Check size={iconSize} /> Confirm
        </>
      ) : (
        <Trash2 size={iconSize} />
      )}
    </button>
  )
}

export default DeleteButton
