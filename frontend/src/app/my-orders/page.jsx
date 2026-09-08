'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { isCustomer } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isCustomer) {
      router.push('/customer-login')
      return
    }
    fetchMyOrders()
  }, [isCustomer, router])

  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/orders/myorders')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-blue-950 mb-2">My Orders</h1>
      <p className="text-slate-500 mb-8">Track and review your past purchases.</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't made any purchases.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-blue-950 text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order Placed</p>
                  <p className="font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Amount</p>
                  <p className="font-bold text-slate-800">₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order ID</p>
                  <p className="font-mono font-bold text-slate-800">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.product} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
