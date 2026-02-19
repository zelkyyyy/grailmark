'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // Upewnij się, że ścieżka do supabase jest poprawna
import AddProductForm from './components/AddProductForm'
import ProductCard from './components/ProductCard'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // 1. Sprawdzamy usera i pobieramy produkty przy wejściu na stronę
  useEffect(() => {
    const getUserAndProducts = async () => {
      // Pobierz sesję
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        fetchProducts()
      } else {
        setLoading(false)
      }
    }

    getUserAndProducts()
  }, [])

  // 2. Funkcja pobierająca produkty z bazy (posortowane od najnowszych)
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Błąd pobierania produktów:', error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  // 3. Funkcja usuwająca produkt (przekazujemy ją do ProductCard)
  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return

    // Optimistic UI: Usuwamy z widoku od razu, żeby było szybko
    setProducts(products.filter(p => p.id !== id))

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Błąd podczas usuwania')
      fetchProducts() // Jak błąd, to przywracamy listę
    }
  }

  // Jeśli user nie jest zalogowany
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl mb-4">Musisz być zalogowany</h1>
        <Link href="/" className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200">
          Wróć do logowania
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      
      {/* Header / Nawigacja */}
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Twoje Produkty
          </h1>
          <p className="text-neutral-400">
            Lista życzeń i znalezione perełki niezależne od sklepów.
          </p>
        </div>
        
        {/* Prosta nawigacja powrotna */}
        <Link 
          href="/" 
          className="text-sm font-medium text-neutral-500 hover:text-white transition-colors"
        >
          ← Wróć do Sklepów
        </Link>
      </header>

      {/* Sekcja Dodawania */}
      <section className="max-w-3xl mx-auto mb-16">
        <AddProductForm onProductAdded={fetchProducts} />
      </section>

      {/* Sekcja Listy Produktów */}
      <section className="max-w-7xl mx-auto">
        {loading ? (
          // Prosty Skeleton loader
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-neutral-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
            <h3 className="text-xl font-medium text-neutral-400">Pusto tutaj...</h3>
            <p className="text-neutral-500 mt-2">Wklej link powyżej, aby dodać pierwszy produkt.</p>
          </div>
        )}
      </section>
    </div>
  )
}