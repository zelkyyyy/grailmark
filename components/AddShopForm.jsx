'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddShopForm({ onShopAdded, onClose }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  // Funkcja automatycznie ustawiająca nazwę na podstawie linku
  const handleUrlChange = (val) => {
    setUrl(val)
    if (!val) {
      setName('')
      return
    }

    try {
      // Wyciągamy domenę, np: "sklep.pl" z "https://www.sklep.pl/buty"
      const hostname = new URL(val).hostname.replace('www.', '')
      const extractedName = hostname.split('.')[0] 
      // Formatujemy na: Sklep
      setName(extractedName.charAt(0).toUpperCase() + extractedName.slice(1))
    } catch (e) {
      // URL może być w trakcie wpisywania, więc nic nie robimy
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Musisz być zalogowany!')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('shops')
      .insert([{ name, url, user_id: user.id }])

    if (error) {
      alert('Błąd: ' + error.message)
    } else {
      setName('')
      setUrl('')
      if (onShopAdded) onShopAdded() 
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto w-4/5">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 text-md">

          {/* Input URL teraz kontroluje też nazwę */}
          <input
            type="url"
            placeholder="Link do sklepu..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="p-2 border border-neutral-200/20 rounded-xl text-neutral-200 text-md  bg-transparent focus:outline-none focus:border-neutral-400 transition-colors"
            required
          />
          
          {/* Input nazwy jest teraz opcjonalny/automatyczny, ale warto go zostawić 
              do drobnych korekt, jeśli automat się pomyli */}
          <input
            type="text"
            placeholder="Nazwa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border  border-neutral-200/20 rounded-xl  text-neutral-400 text-md bg-transparent w-full "
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="bg-neutral-300 text-neutral-900 w-fit m-auto  p-2 px-6 rounded-xl hover:bg-neutral-400 disabled:opacity-50 transition-all"
          >
            {loading ? 'Dodawanie...' : 'Dodaj'}
          </button>

        {/* <p className="text-xs text-neutral-500">Nazwa zostanie wygenerowana automatycznie na podstawie linku.</p> */}
      </form>
    </div>
  )
}