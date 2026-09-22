'use client'
import React, { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import ShopLink from './ShopLink'
import { supabase } from '../lib/supabase';
import AddShopForm from './AddShopForm';

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
    fetchProducts();
  }, [])

  return (
    <div id="lista" className='anim z-10 w-full py-4 duration-500'>
      {errorMsg && <p className="text-red-400 text-sm text-center mb-3">{errorMsg}</p>}

      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 max-w-5xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((shop) => (
          <ShopLink key={shop.id} shop={shop} delete={deleteShop} />
        ))}

        {addShop ? (
          <div className="flex items-center gap-2 shrink-0">
            <AddShopForm compact onShopAdded={() => { fetchProducts(); setAddShop(false); }} />
            <button
              onClick={() => setAddShop(false)}
              aria-label="Cancel"
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 duration-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddShop(true)}
            className="shrink-0 flex items-center gap-1.5 pl-2 pr-4 py-1.5 rounded-full border border-dashed border-white/20 text-neutral-400 hover:text-white hover:border-white/40 duration-300 cursor-pointer"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5">
              <Plus size={14} />
            </span>
            <span className="text-sm font-medium">Add shop</span>
          </button>
        )}
      </div>
    </div>
  )
}
