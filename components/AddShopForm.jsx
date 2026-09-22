'use client'
import { useState } from 'react'
import { Link2, Tag, Plus, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AddShopForm({ onShopAdded, onClose }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-fill the name from the URL's domain
  const handleUrlChange = (val) => {
    setUrl(val)
    if (!val) {
      setName('')
      return
    }

    try {
      const hostname = new URL(val).hostname.replace('www.', '')
      const extractedName = hostname.split('.')[0]
      setName(extractedName.charAt(0).toUpperCase() + extractedName.slice(1))
    } catch (e) {
      // URL may still be mid-typing, ignore
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('shops')
      .insert([{ name, url, user_id: user.id }])

    if (error) {
      setError(error.message)
    } else {
      setName('')
      setUrl('')
      if (onShopAdded) onShopAdded()
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-white/30 focus-within:bg-white/10">
          <Link2 size={16} className="shrink-0 text-neutral-500" />
          <input
            type="url"
            placeholder="Shop link…"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full min-w-0 bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
            required
          />
        </div>

        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-white/30 focus-within:bg-white/10">
          <Tag size={16} className="shrink-0 text-neutral-500" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-w-0 bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white text-neutral-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-neutral-200 duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {loading ? 'Adding…' : 'Add'}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400 text-center sm:text-left">{error}</p>}
    </div>
  )
}
