import { supabase } from './supabaseClient'

// 1. REJESTRACJA
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })
  if (error) throw error
  return data
}

// 2. LOGOWANIE
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  if (error) throw error
  return data
}

// 3. WYLOGOWANIE
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}