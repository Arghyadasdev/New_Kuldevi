'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

export default function CustomerManager() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers')
      setCustomers(res.data)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="py-12 text-center text-slate-500 font-semibold animate-pulse">Loading Customers...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-950">Customer Directory</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Total Orders</th>
              <th className="px-6 py-4 text-right">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                  No customers have registered yet.
                </td>
              </tr>
            )}
            {customers.map(customer => (
              <tr key={customer._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{customer.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {customer.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 font-bold rounded-full text-xs">
                    {customer.orderCount || 0} Orders
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 text-right">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
