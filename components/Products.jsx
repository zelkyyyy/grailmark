'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // Upewnij się, że ścieżka do supabase jest poprawna
import AddProductForm from './AddProductForm'
import ProductCard from './ProductCard'
import Link from 'next/link'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

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


return (
    <div className="w-full bg-black/40 backdrop-blur-xs text-neutral-200 py-8 px-[1em] self-stretch font-sans z-10">
      <h2 className="text-[4em] anim font-bold text-white mb-8 text-center">Twoje Produkty</h2>
      <section className="  mb-4">
        <AddProductForm onProductAdded={fetchProducts} />
      </section>
      <section className="max-w-7xl anim">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-neutral-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-wrap justify-center  gap-4  p-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (

          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
            <h3 className="text-xl font-medium text-neutral-400">Pusto tutaj...</h3>
            <p className="text-neutral-500 mt-2">Wklej link powyżej, aby dodać pierwszy produkt.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Products