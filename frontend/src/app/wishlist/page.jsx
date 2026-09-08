'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'
import ProductCard from '@/components/ProductCard'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { isCustomer } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isCustomer) {
      router.push('/customer-login')
      return
    }
    fetchWishlist()
  }, [isCustomer, router])

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/customers/wishlist')
      setWishlist(res.data)
    } catch (err) {
      console.error('Failed to fetch wishlist', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Wishlist</h1>
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
          {wishlist.length} items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Save items you love and buy them later.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-400 transition-all">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
