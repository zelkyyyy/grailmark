'use client' // required in Next.js App Router for stateful client components

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, X, Loader2, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AuthForm({ onClose, initialMode, setConfirm }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register')

  const passwordsMismatch = isRegistering && confirmPassword.length > 0 && password !== confirmPassword
  const passwordsMatch = isRegistering && confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const result = isRegistering
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    const { error } = result

    if (error) {
      setError(error.message)
    } else if (isRegistering) {
      onClose()
      setConfirm(true)
    }

    setLoading(false)
  }

  const switchMode = () => {
    setError('')
    setConfirmPassword('')
    setIsRegistering((prev) => !prev)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950/95 p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            {isRegistering ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {isRegistering ? 'Sign up to start shopping' : 'Log in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-white/30 focus-within:bg-white/10">
            <Mail size={16} className="shrink-0 text-neutral-500" />
            <input
              className="w-full min-w-0 bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-white/30 focus-within:bg-white/10">
            <Lock size={16} className="shrink-0 text-neutral-500" />
            <input
              className="w-full min-w-0 bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="shrink-0 text-neutral-500 hover:text-neutral-200 duration-200 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isRegistering && (
              <motion.div
                key="confirm-password"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <div
                  className={`flex items-center gap-2.5 rounded-xl border bg-white/5 px-3 transition focus-within:bg-white/10 ${
                    passwordsMismatch
                      ? 'border-red-500/50 focus-within:border-red-500/50'
                      : passwordsMatch
                        ? 'border-emerald-500/50 focus-within:border-emerald-500/50'
                        : 'border-white/10 focus-within:border-white/30'
                  }`}
                >
                  <Lock size={16} className="shrink-0 text-neutral-500" />
                  <input
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={isRegistering}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="shrink-0 text-neutral-500 hover:text-neutral-200 duration-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {(passwordsMismatch || passwordsMatch) && (
                  <p className={`flex items-center gap-1 text-xs ${passwordsMismatch ? 'text-red-400' : 'text-emerald-400'}`}>
                    {passwordsMismatch ? <X size={12} /> : <Check size={12} />}
                    {passwordsMismatch ? 'Passwords do not match' : 'Passwords match'}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || passwordsMismatch}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black duration-300 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isRegistering ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="font-semibold text-white hover:underline cursor-pointer"
          >
            {isRegistering ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}
