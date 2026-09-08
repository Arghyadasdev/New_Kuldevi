'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

export default function CouponManager() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ code: '', discountPercentage: '', expiryDate: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons')
      setCoupons(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/coupons', {
        ...formData,
        discountPercentage: Number(formData.discountPercentage)
      })
      setFormData({ code: '', discountPercentage: '', expiryDate: '' })
      fetchCoupons()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon')
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (id) => {
    try {
      await api.put(`/coupons/${id}/toggle`)
      fetchCoupons()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`)
        fetchCoupons()
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (loading) return <div className="py-12 text-center text-slate-500 font-bold animate-pulse">Loading Coupons...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-950">Discount Coupons</h2>

      {/* Create Coupon Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Create New Promo Code</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Code (e.g. SUMMER20)</label>
            <input required type="text" name="code" value={formData.code} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Discount (%)</label>
            <input required type="number" min="1" max="100" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry Date (Optional)</label>
            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <button disabled={creating} type="submit" className="w-full py-2 bg-blue-950 text-white font-bold rounded-lg shadow hover:bg-blue-900 disabled:opacity-70">
            {creating ? 'Creating...' : 'Create Coupon'}
          </button>
        </form>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Expires</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No coupons active.</td>
              </tr>
            ) : coupons.map(coupon => (
              <tr key={coupon._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono font-bold text-blue-900">{coupon.code}</td>
                <td className="px-6 py-4 font-bold text-green-600">{coupon.discountPercentage}% OFF</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(coupon._id)} className={`px-3 py-1 rounded-full text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:text-red-700 font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
