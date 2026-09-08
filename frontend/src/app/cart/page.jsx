'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { loadSettings } from '@/components/admin/StoreSettings'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

function buildWhatsAppLink(cart, totalPrice, customer, storeSettings) {
  const store = storeSettings
  const itemLines = cart
    .map((i, idx) => `${idx + 1}. ${i.name} × ${i.qty} = ₹${(i.qty * i.price).toFixed(2)}`)
    .join('\n')

  const text = encodeURIComponent(
`ನಮಸ್ಕಾರ! ನಾನು ಆರ್ಡರ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ:

ಅಂಗಡಿ: ${store.name || 'Kuldevi Stationers'}${customer.name ? `\nಗ್ರಾಹಕ: ${customer.name}` : ''}${customer.phone ? `\nಫೋನ್: ${customer.phone}` : ''}

ಆರ್ಡರ್ ವಿವರ:
${itemLines}

*ಒಟ್ಟು: ₹${totalPrice.toFixed(2)}*

---
Hi! I'd like to place an order:
Store: ${store.name || 'Kuldevi Stationers'}${customer.name ? `\nCustomer: ${customer.name}` : ''}
Items:
${itemLines}
*Total: ₹${totalPrice.toFixed(2)}*`
  )

  const phone = customer.phone
    ? `91${customer.phone.replace(/\D/g, '')}`
    : WHATSAPP_NUMBER

  return `https://wa.me/${phone}?text=${text}`
}

function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, totalItems, totalPrice } = useCart()
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [ordered, setOrdered] = useState(false)
  const router = useRouter()
  const storeSettings = loadSettings()

  const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 text-sm bg-white transition-all"

  if (cart.length === 0 && !ordered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">Cart is empty</h2>
          <p className="text-primary-400 text-sm font-kannada mb-6">ಕಾರ್ಟ್ ಖಾಲಿ ಇದೆ</p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-primary-700 to-primary-800 text-white font-bold rounded-xl shadow-lg hover:from-gold-500 hover:to-gold-600 transition-all">
            Browse Products →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-primary-950 border-b border-white/5">
        <div className="h-0.5 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Your Cart</h1>
            <p className="text-primary-400 text-xs font-kannada">ನಿಮ್ಮ ಕಾರ್ಟ್ · {totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/products" className="text-primary-400 hover:text-gold-400 text-sm transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-primary-900 text-sm uppercase tracking-wide">Order Items</h2>
                <button onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-slate-50">
                {cart.map(item => (
                  <div key={item._id} className="px-6 py-4 flex items-center gap-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-slate-100 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-50 to-gold-50 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary-900 text-sm truncate">{item.name}</p>
                      <p className="text-gold-600 text-[11px] font-semibold uppercase tracking-wide">{item.category}</p>
                      <p className="text-lg font-bold text-gradient mt-0.5">₹{item.price}</p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(item._id, item.qty - 1)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:border-primary-300 transition-all font-bold text-lg leading-none">
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-primary-900 text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:border-primary-300 transition-all font-bold text-lg leading-none">
                        +
                      </button>
                    </div>

                    <div className="text-right flex-shrink-0 w-20">
                      <p className="font-bold text-primary-900 text-sm">₹{(item.qty * item.price).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item._id)}
                        className="text-red-300 hover:text-red-500 text-xs mt-1 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer details */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-primary-900 text-sm uppercase tracking-wide mb-4 pb-3 border-b border-slate-100">
                Your Details (Optional)
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Name</label>
                  <input value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                    className={inputCls} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone</label>
                  <input value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
                    className={inputCls} placeholder="10-digit mobile" type="tel" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
              <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
              <div className="p-6">
                <h3 className="font-bold text-primary-900 text-sm uppercase tracking-wide mb-4">Order Summary</h3>

                <div className="space-y-2 text-sm mb-4">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between text-primary-600">
                      <span className="truncate mr-2">{item.name} × {item.qty}</span>
                      <span className="flex-shrink-0 font-medium">₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary-900">Total</span>
                    <span className="text-2xl font-bold text-gradient">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-primary-400 text-xs mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="pulse-ring btn-shine flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-blue-950 to-blue-900 text-white hover:from-blue-900 hover:to-blue-800 transition-all duration-300 shadow-xl hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Secure Checkout
                </button>

                <p className="text-center text-primary-300 text-xs mt-4 font-kannada">
                  ಸುರಕ್ಷಿತ ಚೆಕ್ಔಟ್
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
