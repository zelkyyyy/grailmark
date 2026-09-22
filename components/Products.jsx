'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // Upewnij się, że ścieżka do supabase jest poprawna
import AddProductForm from './AddProductForm'
import ProductCard from './ProductCard'
import { ShoppingBag } from 'lucide-react'

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
        // Optimistic UI: remove from view immediately for a snappy feel
        setProducts(products.filter(p => p.id !== id))

        const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

        if (error) {
        fetchProducts() // Restore the list if the delete failed
        }
    }


return (
    <div className="w-full bg-black/40 backdrop-blur-xs text-neutral-200 py-16 px-[1em] self-stretch font-sans z-10">
      <div className="anim mb-10 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-bold text-transparent bg-clip-text bg-linear-30 from-neutral-500 to-neutral-100">
          Your Products
        </h2>
        <p className="mt-2 text-neutral-400 text-sm">Everything you&apos;re keeping an eye on, in one place</p>
      </div>
      <section className="mb-10">
        <AddProductForm onProductAdded={fetchProducts} />
      </section>
      <section className="max-w-7xl mx-auto anim">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 sm:h-80 bg-neutral-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
            <ShoppingBag size={28} className="text-neutral-600" />
            <h3 className="text-lg font-medium text-neutral-400">Nothing here yet</h3>
            <p className="text-neutral-500 text-sm">Paste a product link above to add your first one.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Products