'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddShopForm({ onShopAdded, onClose }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1. Pobierz ID aktualnie zalogowanego użytkownika
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Musisz być zalogowany!')
      setLoading(false)
      return
    }

    // 2. Wyślij dane do Supabase
    const { error } = await supabase
      .from('shops')
      .insert([
        { 
          name: name, 
          url: url, 
          user_id: user.id // <--- KLUCZOWE dla RLS
        }
      ])

    if (error) {
      alert('Błąd: ' + error.message)
    } else {
      // Sukces! Czyścimy formularz
      setName('')
      setUrl('')
      // alert('Sklep dodany!')
      
      // Jeśli przekazaliśmy funkcję odświeżania listy, wywołaj ją
      if (onShopAdded) onShopAdded() 
    }
    
    setLoading(false)
  }

  return (
   


    <div className="p-8">

        {/* <button onClick={() => onClose(false)} className='absolute top-2 right-2 text-neutral-200 text-xl font-bold cursor-pointer'>X</button> */}
         <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-md">

      <div className="flex lg:flex-row flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-neutral-200/20 rounded text-neutral-200 text-md"
          required
        />
        <input
          type="url"
          placeholder="Link (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border border-neutral-200/20 rounded text-neutral-200 text-md"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-neutral-300 text-neutral-900 font-bold p-2 rounded hover:bg-neutral-400 w-full md:w-auto"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>

    </div>
  )
}