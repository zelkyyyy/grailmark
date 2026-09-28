'use client'
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import ShopLink from './ShopLink'
import { supabase } from '../lib/supabase';
import AddShopModal from './AddShopModal';

export default function ShopList() {
  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [addShop, setAddShop] = useState(false);
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch shops:', error)

      setErrorMsg('Failed to load your shops')
    }

    if (data) {
      setProducts(data)
      setErrorMsg(null)
    }
  }

  const deleteShop = async (id) => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id)
        .select()

      if (error || !data || data.length === 0) {
        console.error('Failed to delete shop:', error)
        setErrorMsg('Failed to delete the shop')
        return
      }

      // Success: refresh the list
      fetchProducts()
    } catch (err) {
      console.error('Unexpected error in deleteShop:', err)
      setErrorMsg('Something went wrong while deleting the shop')
    }
  }

  useEffect(() => {
    const fun = async () => {
      fetchProducts();
    }
    fun()
  }, [])

  return (
    <div id="lista" className='anim z-10 w-full bg-black/40 backdrop-blur-xs text-neutral-200 py-16 px-[1em] self-stretch font-sans'>
      <div className="mb-10 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-bold text-transparent bg-clip-text bg-linear-30 from-neutral-500 to-neutral-100">
          Your Shops
        </h2>
        <p className="mt-2 text-neutral-400 text-sm">Bookmark the stores you shop from most</p>
      </div>

      {errorMsg && <p className="text-red-400 text-sm text-center mb-6">{errorMsg}</p>}

      <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
        {products.map((shop) => (
          <ShopLink key={shop.id} shop={shop} delete={deleteShop} />
        ))}

        <button
          onClick={() => setAddShop(true)}
          className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-full hover:border-white/30 hover:bg-neutral-800/80 transition-all duration-500 shadow-md shadow-black/20 cursor-pointer"
        >
          <span className="text-sm font-medium text-neutral-200">Add link</span>
          <span className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-white/10">
            <Plus size={14} className="text-neutral-200" />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {addShop && (
          <AddShopModal
            key="add-shop-modal"
            onClose={() => setAddShop(false)}
            onShopAdded={() => { fetchProducts(); setAddShop(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
