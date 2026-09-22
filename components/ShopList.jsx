'use client'
import React, { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import ShopLink from './ShopLink'
import { supabase } from '../lib/supabase';
import AddShopForm from './AddShopForm';

export default function ShopList() {
  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null); 
  const [addShop, setAddShop] = useState(false);
  const [deleteOn, setDeleteOn] = useState(false);
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
    <div id="lista" className='anim z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs w-full py-16 duration-500'>
      <div className='mx-auto w-full'>
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-bold text-transparent bg-clip-text bg-linear-30 from-neutral-500 to-neutral-100">
            Your Shops
          </h2>
          <p className="mt-2 text-neutral-400 text-sm">Bookmark the stores you shop from most</p>
        </div>

        {errorMsg && <p className="text-red-400 text-sm text-center mb-6">{errorMsg}</p>}

        <div className="mb-10">
          <AddShopForm onShopAdded={fetchProducts} onClose={setAddShop} />
        </div>

        {products.length > 0 ? (
          <div className="flex lg:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full mx-auto max-w-7xl px-4">
            {products.map((shop) => (
              <ShopLink key={shop.id} shop={shop} delete={deleteShop} deleteOn={deleteOn} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center py-20 mx-4 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
            <Store size={28} className="text-neutral-600" />
            <h3 className="text-lg font-medium text-neutral-400">No shops yet</h3>
            <p className="text-neutral-500 text-sm">Add a store link above to save it here.</p>
          </div>
        )}
      </div>
    </div>
  )
}