import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../services/api'
import { useLang } from '../context/LangContext'

const CATEGORY_ICONS = {
  'pens': '🖊️', 'notebooks': '📓', 'art-supplies': '🎨',
  'office-supplies': '📎', 'paper-products': '📄', 'desk-accessories': '✏️',
}

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useLang()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        let url = '/products'
        const params = []
        if (category) params.push(`category=${category}`)
        if (search) params.push(`search=${search}`)
        if (params.length > 0) url += `?${params.join('&')}`

        const [productsRes, categoriesRes] = await Promise.all([
          api.get(url),
          api.get('/categories')
        ])
        setProducts(productsRes.data)
        setCategories(categoriesRes.data)
        if (search) setSearchTerm(search)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('search', searchTerm.trim())
      setSearchParams(newParams)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchParams(new URLSearchParams())
  }

  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams()
    if (cat) newParams.set('category', cat.toLowerCase().replace(/\s+/g, '-'))
    setSearchParams(newParams)
  }

  const activeCategory = searchParams.get('category')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Hero header */}
      <div className="relative mesh-bg py-16 overflow-hidden">
        <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10 fill-slate-50">
            <path d="M0,30 C480,0 960,50 1440,20 L1440,50 L0,50 Z" />
          </svg>
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-gold-300 text-xs font-bold uppercase tracking-widest mb-4">
            🛍️ {t('products')}
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            Our Collection
          </h1>
          <p className="text-primary-200 font-devanagari text-base">हमारा संग्रह · बेंगलुरु</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-primary-100 bg-white shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
              <div className="p-5">
                <h3 className="text-sm font-bold text-primary-700 uppercase tracking-widest mb-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      !activeCategory
                        ? 'bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-md'
                        : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    <span>🗂️</span> All Products
                  </button>
                  {(categories.length > 0 ? categories : ['Pens', 'Notebooks', 'Art Supplies', 'Office Supplies', 'Paper Products', 'Desk Accessories']).map((cat) => {
                    const slug = cat.toLowerCase().replace(/\s+/g, '-')
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          activeCategory === slug
                            ? 'bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-md'
                            : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900'
                        }`}
                      >
                        <span>{CATEGORY_ICONS[slug] || '📦'}</span>
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-grow min-w-0">

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2 bg-white border border-primary-100 rounded-2xl shadow-md p-2">
                <div className="flex-grow flex items-center gap-3 px-3">
                  <svg className="w-4 h-4 text-primary-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="flex-grow py-2.5 border-0 focus:outline-none focus:ring-0 text-primary-900 text-sm bg-transparent"
                  />
                  {searchTerm && (
                    <button type="button" onClick={clearSearch} className="text-primary-300 hover:text-primary-600 text-lg leading-none">×</button>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn-shine px-5 py-2.5 bg-gradient-to-r from-primary-700 to-primary-800 text-white font-bold rounded-xl text-sm hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Result meta */}
            {!loading && (
              <div className="flex items-center gap-3 mb-6">
                <p className="text-primary-500 text-sm">
                  <span className="font-bold text-primary-800">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                  {activeCategory && (
                    <span> in <span className="font-semibold text-gold-600 capitalize">{activeCategory.replace(/-/g, ' ')}</span></span>
                  )}
                </p>
                {(activeCategory || searchParams.get('search')) && (
                  <button onClick={clearSearch}
                    className="text-xs text-primary-400 hover:text-primary-700 border border-primary-200 rounded-full px-3 py-1 transition-colors">
                    Clear filter ×
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-primary-100">
                    <div className="shimmer h-52 w-full" />
                    <div className="p-5 space-y-2">
                      <div className="shimmer h-3 w-1/3 rounded" />
                      <div className="shimmer h-4 w-3/4 rounded" />
                      <div className="shimmer h-3 w-full rounded" />
                      <div className="shimmer h-3 w-2/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-primary-50 to-gold-50 rounded-3xl border border-primary-100">
                <div className="text-7xl mb-4">🔍</div>
                <p className="text-primary-700 text-xl font-semibold mb-1">No products found</p>
                <p className="text-primary-400 text-sm font-devanagari mb-5">कोई उत्पाद नहीं मिला</p>
                <button onClick={clearSearch}
                  className="btn-shine px-6 py-2.5 bg-gradient-to-r from-primary-700 to-primary-800 text-white font-bold rounded-xl text-sm">
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
