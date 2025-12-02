'use client'
import React, { useState, useEffect } from 'react'
import ShopLink from './ShopLink'
import { supabase } from '../lib/supabase';
import AddShopForm from './AddShopForm';

export default function ShopList() {
  // 1. FIX: Rename state to match the function body
  // changed [err, serErr] to [errorMsg, setErrorMsg]
  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null); 
  const [addShop, setAddShop] = useState(false);
  const [deleteOn, setDeleteOn] = useState(false);
  const fetchProducts = async () => {
    // TO JEST TA MAGIA SUPABASE:
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Błąd:', error)
      // 2. Now this works because setErrorMsg is defined above
      setErrorMsg('Nie udało się pobrać sklepów') 
    }

    if (data) {
      setProducts(data)
      setErrorMsg(null) // Good practice: clear error on success
    }
  }

  const deleteShop = async (id) => {
    // Dobre praktyki: Pytamy użytkownika o potwierdzenie
    if (!window.confirm("Czy na pewno chcesz usunąć ten sklep?")) return;
    try {
      // Ask the API to return the deleted row(s) so we can inspect the response
      const { data, error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id)
        .select()

      console.log('deleteShop response for id=', id, { data, error })

      if (error) {
        // More informative message for debugging
        alert("Błąd usuwania: " + error.message)
        return
      }

      // If RLS or auth prevents deletion, `data` may be empty even without an error
      if (!data || data.length === 0) {
        alert('Nie usunięto wiersza — sprawdź uprawnienia (RLS) lub zobacz konsolę dla szczegółów.')
        return
      }

      // Success: refresh the list
      fetchProducts()
    } catch (err) {
      console.error('Unexpected error in deleteShop:', err)
      alert('Nieoczekiwany błąd podczas usuwania. Zobacz konsolę dla szczegółów.')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    // Note: React might warn about missing dependency here. 
    // It is safe to ignore for now, or use useCallback (advanced).
  }, [])

  return (
    <div id="lista" className='anim z-10 flex flex-col items-center justify-center bg-transparent backdrop-blur-xs w-full py-8 duration-500'>
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

<div className='flex flex-row gap-2 '>
 {<button onClick={() => setAddShop(!addShop)} className='p-3 text-neutral-900 border border-white/20 hover:bg-white/60 duration-300 font-bold backdrop-blur-sm bg-white/90 cursor-pointer rounded-xl'>{addShop ? 'Cancel' : 'Add bookmark'}</button>}
        {products.length > 0 &&<button 
        onClick={() => setDeleteOn(!deleteOn)} 
        className={`p-3 border ${deleteOn ? 'bg-red-600/30 border-red-500/40 text-red-400' : 'border-white/20 hover:bg-white/20 text-neutral-200'} duration-300 font-bold backdrop-blur-sm cursor-pointer rounded-xl`}
      >
        {deleteOn ? 'Cancel delete' : 'Delete bookmark'}
      </button>}
</div>
     
      
      {addShop && <AddShopForm onShopAdded={fetchProducts} onClose={setAddShop}/>}


      <div  className="flex lg:flex-row flex-col  items-center justify-center gap-4 mt-6">
        {products.map((shop) => (
          <ShopLink key={shop.id} shop={shop} delete={deleteShop} deleteOn={deleteOn} />
        ))}
      </div>
    </div>
  )
}