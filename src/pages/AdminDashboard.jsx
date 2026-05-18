import { useEffect, useState, useRef } from 'react'
import api from '../services/api'

const EMPTY_FORM = { name: '', description: '', price: '', category: '', stock: '', sku: '', image: '' }

function AdminDashboard() {
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
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post('/upload', fd)
      setFormData(prev => ({ ...prev, image: res.data.url }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Image upload failed. Check server logs.')
      setImagePreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      sku: product.sku || '',
      image: product.image || ''
    })
    setImagePreview(product.image || '')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      try {
        await api.delete(`/products/${id}`)
        fetchData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
    setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin" />
          <p className="text-primary-400 text-sm font-devanagari">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  const inputCls = "w-full px-4 py-2.5 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-primary-900 text-sm bg-white transition-all"
  const labelCls = "block text-primary-600 text-xs font-semibold uppercase tracking-wide mb-1.5"

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">

      {/* Top bar */}
      <div className="bg-primary-950 border-b border-white/5">
        <div className="h-0.5 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display font-bold text-xl">Admin Dashboard</h1>
            <p className="text-primary-400 text-xs font-devanagari">कुलदेवी स्टेशनरी · उत्पाद प्रबंधन</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl px-4 py-2 text-center">
              <p className="text-gold-400 font-bold text-lg">{products.length}</p>
              <p className="text-primary-400 text-[10px]">Products</p>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditingProduct(null); setFormData(EMPTY_FORM) }}
              className="btn-shine flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-xl text-sm shadow-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Add/Edit form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl border border-primary-100 overflow-hidden mb-8">
            <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-primary-900">
                  {editingProduct ? '✏️ Edit Product' : '➕ New Product'}
                </h2>
                <button onClick={handleCancel} className="text-primary-300 hover:text-primary-600 text-2xl leading-none transition-colors">×</button>
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
                      uploading ? 'border-amber-400 bg-amber-50' : 'border-primary-200 hover:border-primary-400 bg-white'
                    }`}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <span className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Uploading to Cloudinary...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-primary-500 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {imagePreview ? 'Change image' : 'Click to upload image'}
                        </span>
                      )}
                    </label>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview"
                        className="h-24 w-24 object-cover rounded-xl border border-primary-100 shadow-sm" />
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className={inputCls} placeholder="Product description..." />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" disabled={saving}
                    className="btn-shine flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-800 text-white font-bold rounded-xl text-sm hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-60 shadow-lg"
                  >
                    {saving ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Saving...
                      </>
                    ) : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                  <button type="button" onClick={handleCancel}
                    className="px-6 py-3 bg-primary-50 text-primary-600 font-bold rounded-xl text-sm hover:bg-primary-100 border border-primary-200 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products table */}
        <div className="bg-white rounded-3xl shadow-md border border-primary-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-50 border-b border-primary-100">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-primary-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-primary-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-primary-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-primary-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-primary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name}
                            className="h-10 w-10 rounded-xl object-cover border border-primary-100 flex-shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-50 to-gold-50 border border-primary-100 flex items-center justify-center flex-shrink-0 text-lg">📦</div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-primary-900">{product.name}</p>
                          <p className="text-xs text-primary-400">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-gold-100 text-primary-700 text-[11px] font-semibold rounded-full border border-gold-200 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gradient">₹{product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-primary-400' : product.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                        {product.stock === 0 ? 'Out of stock' : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)}
                          className="px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)}
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
              <p className="text-primary-600 font-semibold text-lg mb-1">No products yet</p>
              <p className="text-primary-400 text-sm font-devanagari">ऊपर "Add Product" बटन दबाएं</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
