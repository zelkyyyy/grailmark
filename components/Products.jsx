'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase' // Upewnij się, że ścieżka do supabase jest poprawna
import AddProductModal from './AddProductModal'
import AddProductCard from './AddProductCard'
import ProductCard from './ProductCard'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)

      const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

        if (error) {
        console.error('Failed to fetch products:', error)
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
      <section className="max-w-7xl mx-auto anim">
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 sm:h-56 bg-neutral-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
            <AddProductCard onClick={() => setShowAddModal(true)} />
          </div>
        )}
      </section>

      <AnimatePresence>
        {showAddModal && (
          <AddProductModal
            key="add-product-modal"
            onClose={() => setShowAddModal(false)}
            onProductAdded={() => { fetchProducts(); setShowAddModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Products
