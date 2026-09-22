'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import AddProductForm from './AddProductForm'

export default function AddProductModal({ onClose, onProductAdded }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-950/95 p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">Add a product</h2>
          <p className="mt-1 text-sm text-neutral-400">Paste a link and we&apos;ll fetch the details</p>
        </div>

        <AddProductForm embedded onProductAdded={onProductAdded} />
      </motion.div>
    </motion.div>
  )
}
