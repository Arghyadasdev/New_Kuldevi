'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '@/services/api'

export default function DashboardHome() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, customersRes, productsRes] = await Promise.all([
        api.get('/orders/analytics/dashboard'),
        api.get('/customers/count'),
        api.get('/products')
      ])

      setData({
        ...analyticsRes.data,
        totalCustomers: customersRes.data.count,
        totalProducts: productsRes.data.length,
        outOfStock: productsRes.data.filter(p => p.stock === 0).length
      })
    } catch (err) {
      console.error('Failed to fetch analytics', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500 font-semibold animate-pulse">Loading Analytics...</div>
  }

  // Mock chart data for visual representation (since we don't have historical data yet)
  const chartData = [
    { name: 'Mon', revenue: data.totalRevenue * 0.1 },
    { name: 'Tue', revenue: data.totalRevenue * 0.15 },
    { name: 'Wed', revenue: data.totalRevenue * 0.2 },
    { name: 'Thu', revenue: data.totalRevenue * 0.1 },
    { name: 'Fri', revenue: data.totalRevenue * 0.25 },
    { name: 'Sat', revenue: data.totalRevenue * 0.15 },
    { name: 'Sun', revenue: data.totalRevenue * 0.05 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-sm text-slate-500">Welcome back to your store administration.</p>
        </div>
        <button onClick={fetchAnalytics} className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 transition-colors">
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-950 mt-2">₹{data.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Orders</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{data.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Active Customers</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{data.totalCustomers}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{data.outOfStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Revenue Overview (This Week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={4} dot={{r: 4, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {data.recentOrders.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No recent orders found.</p>
            ) : (
              data.recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{order.customer?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-blue-950">₹{order.totalAmount.toFixed(2)}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
