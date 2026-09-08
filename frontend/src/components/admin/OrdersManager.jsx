'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

export default function OrdersManager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status })
      setOrders(orders.map(o => o._id === id ? { ...o, status: res.data.status } : o))
    } catch (err) {
      alert('Failed to update status')
    }
  }

  if (loading) return <div className="py-12 text-center text-slate-500 font-semibold animate-pulse">Loading Orders...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-950">Orders Management</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                  No orders have been placed yet.
                </td>
              </tr>
            )}
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 text-sm">#{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {order.items.slice(0, 2).map((item, i) => (
                      <span key={i} className="text-xs text-slate-600">{item.quantity}x {item.name}</span>
                    ))}
                    {order.items.length > 2 && <span className="text-[10px] text-blue-600">+{order.items.length - 2} more items</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-800">{order.customer?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{order.customer?.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-blue-950">₹{order.totalAmount.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
