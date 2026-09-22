'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import AuthForm from "@/components/AuthForm"; // Upewnij się, że ścieżka jest dobra
import { supabase } from "../lib/supabase"; // Upewnij się, że ścieżka jest dobra
import ConfirmAlert from './ConfirmAlert';

const Login = ({ setLoggedIn }) => {
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      
    })

    return () => subscription.unsubscribe()
  }, [])
  // Update parent logged-in state whenever session changes.
  // Avoid calling `setLoggedIn` during render to prevent React warnings
  // and ensure components update immediately when the session changes.
  useEffect(() => {
    setLoggedIn(!!session)

    // If session becomes null (user logged out), close any open auth modal
    // and redirect to the main page so the UI doesn't stay on AuthForm.
    if (!session) {
      // avoid synchronous state update inside effect to prevent cascading renders
      setTimeout(() => setLoginForm(null), 0)
      router.push('/')
    }
  }, [session, setLoggedIn, router])

  // ---------------------------------------------------------
  // SCENARIUSZ 1: UŻYTKOWNIK NIEZALOGOWANY (GUEST)
  // ---------------------------------------------------------
  if (!session) {
    return (
      <div className="flex gap-4 z-10 top-4 right-4">
    
        <button 
            onClick={() => setLoginForm('login')} 
            className='px-6 py-2 bg-white/10 hover:bg-white/20 anim duration-300 cursor-pointer border border-white/10 rounded-xl font-bold text-[17px] text-white backdrop-blur-sm'
        >
            Log in
        </button>
        
        {/* Guzik Rejestracji */}
        <button 
            onClick={() => setLoginForm('register')} 
            className='px-6 py-2 bg-white text-black hover:bg-neutral-200 anim duration-300 cursor-pointer border border-transparent rounded-xl font-bold text-[17px]'
        >
            Sign up
        </button>

        {/* Modal (pokazuje się tylko gdy loginForm === true) */}
        <AnimatePresence>
          {loginForm && <AuthForm key="auth-form" initialMode={loginForm} onClose={() => setLoginForm(null)} setConfirm={() => setConfirm(true)} />}
        </AnimatePresence>
        {confirm && <ConfirmAlert setConfirm={setConfirm} />}

      </div>
    )
  }

  // ---------------------------------------------------------
  // SCENARIUSZ 2: UŻYTKOWNIK ZALOGOWANY (USER)
  // ---------------------------------------------------------
  return (
    <div className="flex items-center gap-4 absolute top-4 right-4 z-10 anim">
        {/* Powitanie */}
        <div className="text-right hidden md:block">
            <p className="text-xs text-neutral-400">Zalogowany jako</p>
            <p className="text-sm font-bold text-white">{session.user.email}</p>
        </div>

        {/* Guzik Wylogowania */}
        <button 
            onClick={() => supabase.auth.signOut()} 
            className='px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 duration-300 cursor-pointer rounded-xl font-bold text-sm backdrop-blur-sm'
        >
            Log out
        </button>
    </div>
  )
}

export default Login