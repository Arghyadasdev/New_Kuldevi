'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart()
  const { isCustomer } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  })

  // Ensure customer is logged in to checkout
  if (!isCustomer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">Please Sign In</h2>
        <p className="text-slate-500 mb-6">You must be logged into a customer account to place an order.</p>
        <button onClick={() => router.push('/customer-login')} className="px-6 py-3 bg-blue-950 text-white rounded-full font-bold shadow-lg hover:bg-blue-900 transition-all">
          Go to Sign In
        </button>
      </div>
    )
  }

  // Ensure cart is not empty
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-950 text-white rounded-full font-bold shadow-lg hover:bg-blue-900 transition-all">
          Continue Shopping
        </button>
      </div>
    )
  }

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const finalAmount = appliedCoupon
      ? getCartTotal() * (1 - appliedCoupon.discountPercentage / 100)
      : getCartTotal()

    const orderPayload = {
      items: cart.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress: formData,
      totalAmount: finalAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null
    }

    try {
      await api.post('/orders', orderPayload)
      clearCart()
      alert('Order Placed Successfully! Thank you for shopping with us.')
      router.push('/') // Or to a 'My Orders' page in the future
    } catch (err) {
      console.error('Checkout failed', err)
      alert(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await api.post('/coupons/validate', { code: couponCode })
      setAppliedCoupon(res.data)
      setCouponCode('')
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon')
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const finalTotal = appliedCoupon
    ? getCartTotal() * (1 - appliedCoupon.discountPercentage / 100)
    : getCartTotal()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-blue-950 mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Shipping Form */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm">1</span>
            Shipping Address
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Street Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Postal Code</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-amber-500 text-blue-950 font-black text-lg rounded-xl shadow-lg hover:bg-amber-400 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Processing...</>
              ) : `Place Order (₹${finalTotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm">2</span>
            Order Summary
          </h2>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-400">{item.quantity}x</span>
                  <span className="font-semibold text-slate-700 truncate w-32">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 mt-6 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500 font-semibold">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 font-semibold">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm font-bold text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{(getCartTotal() * appliedCoupon.discountPercentage / 100).toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pb-4 border-b border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Promo Code"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button onClick={() => setAppliedCoupon(null)} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg text-sm">Remove</button>
              ) : (
                <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode} className="px-4 py-2 bg-blue-950 text-white font-bold rounded-lg text-sm disabled:opacity-70">
                  {couponLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2 font-semibold">{couponError}</p>}
          </div>

          <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
            <span className="font-bold text-lg text-slate-800">Total</span>
            <span className="font-black text-2xl text-blue-950">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
