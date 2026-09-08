'use client'

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import api from '@/services/api'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const EMPTY_FORM = { name: '', description: '', price: '', category: '', stock: '', sku: '', image: '' }

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ])
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data)
      } else {
        await api.post('/products', data)
      }
      await fetchData()
      handleCancel()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setImagePreview(URL.createObjectURL(file))
    try {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('adminToken')
      const { data } = await axios.post(`${BASE}/api/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setFormData(prev => ({ ...prev, image: data.url }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Image upload failed. Check CLOUDINARY_URL in backend .env')
      setImagePreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name, description: product.description,
      price: product.price, category: product.category,
      stock: product.stock, sku: product.sku || '', image: product.image || ''
    })
    setImagePreview(product.image || '')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (product) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      try { await api.delete(`/products/${product.id || product._id}`); fetchData() }
      catch (error) { console.error('Error deleting product:', error) }
    }
  }

  const handleCancel = () => {
    setShowForm(false); setEditingProduct(null)
    setFormData(EMPTY_FORM); setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500 font-semibold animate-pulse">Loading Products...</div>
  }

  const inputCls = "w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 text-sm bg-white transition-all"
  const labelCls = "block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-950">Product Catalog</h2>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); setFormData(EMPTY_FORM) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-950 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-blue-900 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="h-1 bg-gradient-to-r from-blue-950 via-amber-500 to-blue-950" />
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-950">
                {editingProduct ? '✏️ Edit Product' : '➕ New Product'}
              </h2>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={inputCls} placeholder="e.g. Blue Gel Pen" />
              </div>
              <div>
                <label className={labelCls}>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required className={inputCls}>
                  <option value="">Select Category</option>
                  {(categories.length > 0 ? categories : ['Pens', 'Notebooks', 'Art Supplies', 'Office Supplies', 'Paper Products', 'Desk Accessories']).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required step="0.01" min="0" className={inputCls} placeholder="0.00" />
              </div>
              <div>
                <label className={labelCls}>Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" className={inputCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className={inputCls} placeholder="Optional" />
              </div>
              <div>
                <label className={labelCls}>Product Image</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 cursor-pointer w-full px-4 py-2.5 border-2 border-dashed rounded-xl transition-all ${
                    uploading ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-blue-900 bg-white'
                  }`}>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    {uploading ? (
                      <span className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-slate-500 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {imagePreview ? 'Change image' : 'Click to upload image'}
                      </span>
                    )}
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className={inputCls} placeholder="Product description..." />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-950 text-white font-bold rounded-xl text-sm hover:bg-blue-900 transition-all disabled:opacity-60 shadow-lg">
                  {saving ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg> Saving...</>
                  ) : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button type="button" onClick={handleCancel}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 border border-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-lg">📦</div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.sku || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-full border border-amber-200 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-950">₹{product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                      {product.stock === 0 ? 'Out of stock' : product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-950 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-600 font-semibold text-lg mb-1">No products yet</p>
            <p className="text-slate-400 text-sm">Click "Add Product" to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
