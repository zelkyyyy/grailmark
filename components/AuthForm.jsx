'use client' // To jest konieczne w Next.js App Router dla komponentów z "state"

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import ConfirmAlert from './ConfirmAlert';

export default function AuthForm({ onClose , initialMode, setConfirm}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register')

  const router = useRouter()

  // Funkcja logowania
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    let result;

    if (isRegistering) {
      result = await supabase.auth.signUp({
        email,
        password,
      })
      onClose(); // Close the form after registration
      setConfirm(true);
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    }
    
    const { error } = result;
    if (error) {
      alert(error.message)
    } else {
      if (isRegistering) {
        // alert('Konto założone! Sprawdź email (jeśli wymagane) lub zaloguj się.')
        setConfirm();
        setIsRegistering(false) // Przełącz na widok logowania po sukcesie

      }
    }
    setLoading(false)
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-full py-2 absolute top-0 left-0 w-full bg-black/70 overflow-hidden">
      <div className="p-8 border rounded shadow-lg w-96 bg-neutral-950/95 backdrop-blur-sm">
        <h1 className="mb-5 text-2xl font-bold text-center text-neutral-100">{isRegistering ? 'Zarejestruj się' : 'Zaloguj się'}</h1>
        <button onClick={onClose} className='absolute top-2 right-2 text-neutral-200 text-xl font-bold cursor-pointer'>X</button>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-md">
          <input
            className="p-2 border border-neutral-200/20 rounded text-neutral-200 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-2 border border-neutral-200/20 rounded text-neutral-200 text-sm"
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            className="p-2 bg-neutral-200 text-black rounded hover:bg-neutral-500 duration-300 text-sm"
            disabled={loading}
          >
            {loading ? 'Ładowanie...' : (isRegistering ? 'Zarejestruj się' : 'Zaloguj się')}
          </button>
        </form>
      </div>
    </div>
  )
}