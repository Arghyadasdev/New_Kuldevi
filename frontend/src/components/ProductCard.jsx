'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/context/LangContext'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

function ProductCard({ product }) {
  const { t } = useLang()
  const { addToCart } = useCart()
  const { isCustomer } = useAuth()
  const [added, setAdded] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const isOutOfStock = product.stock === 0

  useEffect(() => {
    // If we wanted to check if it's already in wishlist initially
    // We could pass an initial prop or fetch. For simplicity we assume not loaded individually unless passed.
  }, [])

  const toggleWishlist = async (e) => {
    e.preventDefault()
    if (!isCustomer) {
      alert('Please log in to add to wishlist')
      return
    }
    setWishlistLoading(true)
    try {
      await api.post(`/customers/wishlist/${product._id}`)
      setInWishlist(!inWishlist)
    } catch (err) {
      console.error('Wishlist error', err)
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="card-glow group bg-white rounded-2xl overflow-hidden border border-primary-100/80 shadow-md">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary-50 to-gold-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl opacity-60">📦</span>
            <span className="text-primary-300 text-xs">No image</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            href={`/products/${product._id}`}
            className="btn-shine px-5 py-2 bg-white/90 backdrop-blur-sm text-primary-800 text-sm font-bold rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
          >
            {t('quickView')} →
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-primary-700 text-white text-[10px] font-bold rounded-full shadow">
              {t('outOfStock')}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <span className="px-2 py-1 bg-gold-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.category}
          </span>
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className={`p-2 rounded-full backdrop-blur-sm shadow-md transition-all duration-300 transform active:scale-90 ${inWishlist ? 'bg-red-50 text-red-500' : 'bg-white/80 text-slate-400 hover:text-red-400'}`}
          >
            <svg className={`w-5 h-5 ${inWishlist ? 'fill-current text-red-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-gold-600 text-[11px] font-semibold uppercase tracking-widest">
            {product.category}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs font-bold text-slate-700">{product.averageRating || 'New'}</span>
            <span className="text-[10px] text-slate-400">({product.numReviews})</span>
          </div>
        </div>
        <h3 className="text-base font-bold text-primary-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-primary-400 text-xs line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3.5 border-t border-primary-100">
          <div>
            <span className="text-2xl font-bold text-gradient">₹{product.price}</span>
            {!isOutOfStock && (
              <p className="text-[10px] text-green-600 font-medium mt-0.5">
                ✓ {product.stock} {t('inStock')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isOutOfStock && (
              <button
                onClick={handleAdd}
                className={`btn-shine px-3 py-2 text-xs font-bold rounded-xl transition-all duration-300 shadow-md ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-400 hover:to-gold-500'
                }`}
              >
                {added ? '✓' : '🛒'}
              </button>
            )}
            <Link
              href={`/products/${product._id}`}
              className="btn-shine px-4 py-2 bg-gradient-to-r from-primary-700 to-primary-800 text-white text-xs font-bold rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-md"
            >
              {t('view')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
