'use client'
import React, { useState, useEffect } from 'react'
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
      console.error('Błąd:', error)

      setErrorMsg('Nie udało się pobrać sklepów') 
    }

    if (data) {
      setProducts(data)
      setErrorMsg(null) 
    }
  }

  const deleteShop = async (id) => {

    if (!window.confirm("Czy na pewno chcesz usunąć ten sklep?")) return;
    try {
      const { data, error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id)
        .select()

      console.log('deleteShop response for id=', id, { data, error })

      if (error) {

        alert("Błąd usuwania: " + error.message)
        return
      }

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
    fetchProducts();
  }, [])

  return (
    <div id="lista" className='anim z-10 flex flex-col items-center  justify-center bg-black/40 backdrop-blur-xs w-full py-8 duration-500'>
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
      <div className='mx-auto w-full'>
        <h2 className="text-[4em] font-bold text-neutral-200 mb-8  text-center">Twoje sklepy</h2>
        {/* <div className='flex flex-row gap-2 '>
        {<button onClick={() => setAddShop(!addShop)} className='p-3 text-neutral-900 border border-white/20 hover:bg-white/60 duration-300 font-bold backdrop-blur-sm bg-white/90 cursor-pointer rounded-xl'>{addShop ? 'Cancel' : 'Add bookmark'}</button>}
                {products.length > 0 }
        </div> */}
    
     
      
      <AddShopForm onShopAdded={fetchProducts} onClose={setAddShop}/>


      <div  className="flex lg:flex-row  flex-wrap items-center justify-center gap-4 w-full mx-auto p-8">
        {products.map((shop) => (
          <ShopLink key={shop.id} shop={shop} delete={deleteShop} deleteOn={deleteOn} />
        ))}
      </div>
    </div>
      </div>

  )
}