'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

export default function InventoryManager() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id, stockChange, newStock = undefined) => {
    setUpdating(id)
    try {
      const payload = newStock !== undefined ? { newStock } : { stockChange }
      const res = await api.patch(`/products/${id}/stock`, payload)
      setProducts(products.map(p => p._id === id ? res.data : p))
    } catch (err) {
      console.error('Failed to update stock:', err)
      alert('Failed to update stock')
    } finally {
      setUpdating(null)
    }
  }

  const handleManualInput = (id, value) => {
    if (value === '') return
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0) {
      updateStock(id, undefined, num)
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500 font-semibold animate-pulse">Loading Inventory...</div>
  }

  const lowStockThreshold = 10
  const outOfStockItems = products.filter(p => p.stock === 0)
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-950">Inventory Control Panel</h2>
        <div className="flex items-center gap-3">
          <button onClick={fetchInventory} className="p-2 text-slate-400 hover:text-blue-950 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-red-800 font-bold text-lg">{outOfStockItems.length} Items Out of Stock</p>
            <p className="text-red-600 text-sm">Require immediate restocking</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl">
            🚨
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-amber-800 font-bold text-lg">{lowStockItems.length} Items Low in Stock</p>
            <p className="text-amber-600 text-sm">Below threshold ({lowStockThreshold} units)</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-2xl">
            ⚠️
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Product Name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 pl-12 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
        />
        <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Current Stock</th>
              <th className="px-6 py-4">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(product => {
              const isLow = product.stock > 0 && product.stock <= lowStockThreshold;
              const isOut = product.stock === 0;

              return (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📦</div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sku || 'No SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                      isOut ? 'bg-red-50 text-red-700 border-red-200' :
                      isLow ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {product.stock} Units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={updating === product._id || product.stock === 0}
                        onClick={() => updateStock(product._id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center font-bold text-lg disabled:opacity-50 transition-colors"
                      >-</button>

                      <input
                        type="number"
                        min="0"
                        defaultValue={product.stock}
                        onBlur={(e) => {
                          if (parseInt(e.target.value) !== product.stock) {
                            handleManualInput(product._id, e.target.value)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && parseInt(e.target.value) !== product.stock) {
                            handleManualInput(product._id, e.target.value)
                            e.target.blur()
                          }
                        }}
                        className="w-16 h-8 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm font-bold text-blue-950 disabled:bg-slate-50"
                        disabled={updating === product._id}
                      />

                      <button
                        disabled={updating === product._id}
                        onClick={() => updateStock(product._id, 1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center font-bold text-lg disabled:opacity-50 transition-colors"
                      >+</button>

                      {updating === product._id && (
                        <svg className="w-4 h-4 text-amber-500 animate-spin ml-2" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                        </svg>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-slate-500 font-semibold">
            No products found matching "{search}"
          </div>
        )}
      </div>
    </div>
  )
}
