'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/services/api'
import { useLang } from '@/context/LangContext'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  const { t } = useLang()
  const { addToCart } = useCart()
  const { isCustomer } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchProductAndReviews()
  }, [id])

  const fetchProductAndReviews = async () => {
    try {
      const [prodRes, revRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`)
      ])
      setProduct(prodRes.data)
      setReviews(revRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    router.push('/cart')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      await api.post(`/reviews/product/${id}`, reviewForm)
      setReviewForm({ rating: 5, comment: '' })
      fetchProductAndReviews() // Refresh to show new review and updated average
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-semibold">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product not found</h2>
          <Link href="/products" className="inline-block px-6 py-3 bg-blue-950 text-white font-bold rounded-xl shadow-lg hover:bg-blue-900">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  // Render Stars helper
  const renderStars = (rating) => {
    return (
      <div className="flex items-center text-amber-400 text-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{star <= rating ? '★' : '☆'}</span>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">

      {/* Breadcrumb bar */}
      <div className="bg-blue-950 border-b border-white/5">
        <div className="h-0.5 bg-gradient-to-r from-blue-800 via-amber-500 to-blue-800" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs">
            <Link href="/" className="text-blue-300 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-blue-700">/</span>
            <Link href="/products" className="text-blue-300 hover:text-amber-400 transition-colors">Products</Link>
            <span className="text-blue-700">/</span>
            <span className="text-amber-400 truncate max-w-[160px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 mb-8 font-medium transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 mb-12">
          <div className="md:grid md:grid-cols-2">

            {/* Image panel */}
            <div className="relative bg-slate-50 flex items-center justify-center min-h-[400px] md:min-h-[520px] overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <span className="text-9xl">📦</span>
                  <span className="text-slate-400 text-sm">No image</span>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute top-5 left-5 px-4 py-2 bg-red-600 text-white font-bold rounded-full text-sm shadow-lg">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="p-8 md:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-bold px-4 py-1.5 rounded-full border border-amber-200 uppercase tracking-wide">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  <span className="text-amber-400">★</span>
                  <span className="text-sm font-bold text-slate-800">{product.averageRating || 'New'}</span>
                  <span className="text-xs text-slate-500">({product.numReviews})</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-blue-950">₹{product.price.toFixed(2)}</span>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm mb-6 flex-grow">
                {product.description}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mb-1">Availability</p>
                  <p className={`text-sm font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} in Stock`}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mb-1">SKU</p>
                  <p className="text-sm font-bold text-slate-800">{product.sku || '—'}</p>
                </div>
              </div>

              {/* Qty selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg transition-all">−</button>
                    <span className="w-8 text-center font-bold text-slate-900">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg transition-all">+</button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {isOutOfStock ? (
                <div className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 text-center font-bold border border-slate-200">
                  Currently Unavailable
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
                      added
                        ? 'bg-green-500 text-white shadow-green-500/30'
                        : 'bg-amber-500 text-blue-950 hover:bg-amber-400 shadow-amber-500/20'
                    }`}>
                    {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
                  </button>
                  <button onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-blue-950/20">
                    Buy Now →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-12">

            {/* Reviews List */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Customer Reviews
                <span className="text-sm font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{reviews.length}</span>
              </h3>

              {reviews.length === 0 ? (
                <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review._id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                            {review.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{review.customerName}</p>
                            <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-slate-600 text-sm mt-3 leading-relaxed bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review */}
            <div className="md:w-80 flex-shrink-0">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 sticky top-24">
                <h4 className="font-bold text-slate-800 mb-4">Write a Review</h4>

                {!isCustomer ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500 mb-4">You must be signed in to leave a review.</p>
                    <Link href="/customer-login" className="block w-full py-2.5 bg-blue-950 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-900">
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`text-2xl transition-colors ${star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-200'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Your Review</label>
                      <textarea
                        required
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="What did you like or dislike?"
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm resize-none bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-3 bg-blue-950 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-blue-900 transition-all disabled:opacity-70"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
