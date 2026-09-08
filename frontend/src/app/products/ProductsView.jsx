'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import api from '@/services/api'
import { useLang } from '@/context/LangContext'

const CATEGORY_ICONS = {
  'pens': '🖊️', 'notebooks': '📓', 'art-supplies': '🎨',
  'office-supplies': '📎', 'paper-products': '📄', 'desk-accessories': '✏️',
}

function ProductsView() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Search and Filter States
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')

  const { t } = useLang()

  const setSearchParams = (newParams) => {
    router.push(`${pathname}?${newParams.toString()}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sort = searchParams.get('sort')

        let url = '/products'
        const params = []
        if (category) params.push(`category=${category}`)
        if (search) params.push(`search=${search}`)
        if (minPrice) params.push(`minPrice=${minPrice}`)
        if (maxPrice) params.push(`maxPrice=${maxPrice}`)
        if (sort) params.push(`sort=${sort}`)
        if (params.length > 0) url += `?${params.join('&')}`

        const [productsRes, categoriesRes] = await Promise.all([
          api.get(url),
          api.get('/categories')
        ])
        setProducts(productsRes.data)
        setCategories(categoriesRes.data)

        // Sync local inputs with URL params
        if (search) setSearchTerm(search)
        if (minPrice) setMinPriceInput(minPrice)
        if (maxPrice) setMaxPriceInput(maxPrice)

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
    const newParams = new URLSearchParams(searchParams)
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim())
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const handlePriceFilter = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (minPriceInput) newParams.set('minPrice', minPriceInput)
    else newParams.delete('minPrice')

    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput)
    else newParams.delete('maxPrice')

    setSearchParams(newParams)
  }

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', e.target.value)
    setSearchParams(newParams)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setMinPriceInput('')
    setMaxPriceInput('')
    setSearchParams(new URLSearchParams())
  }

  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams(searchParams)
    if (cat) {
      newParams.set('category', cat.toLowerCase().replace(/\s+/g, '-'))
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
  }

  const activeCategory = searchParams.get('category')
  const activeSort = searchParams.get('sort') || 'newest'

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
          <p className="text-primary-200 font-kannada text-base">ನಮ್ಮ ಸಂಗ್ರಹ · ಬೆಂಗಳೂರು</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-6">

            {/* Category Filter */}
            <div className="rounded-2xl border border-primary-100 bg-white shadow-lg overflow-hidden">
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

            {/* Price Filter */}
            <div className="rounded-2xl border border-primary-100 bg-white shadow-lg overflow-hidden">
              <div className="p-5">
                <h3 className="text-sm font-bold text-primary-700 uppercase tracking-widest mb-4">
                  Price Range
                </h3>
                <form onSubmit={handlePriceFilter} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Min (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-slate-300 mt-4">-</span>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Max (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-primary-800 font-bold text-sm rounded-lg transition-colors">
                    Apply Filter
                  </button>
                </form>
              </div>
            </div>

          </aside>

          {/* Main */}
          <div className="flex-grow min-w-0">

            {/* Top Bar (Search + Sort) */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex-grow">
                <div className="flex gap-2 bg-white border border-primary-100 rounded-2xl shadow-sm p-2">
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
                      <button type="button" onClick={() => { setSearchTerm(''); handleSearch({preventDefault: ()=>{}}) }} className="text-primary-300 hover:text-primary-600 text-lg leading-none">×</button>
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

              {/* Sort Dropdown */}
              <div className="flex-shrink-0 flex items-center bg-white border border-primary-100 rounded-2xl shadow-sm px-4 py-2">
                <label className="text-xs font-bold text-slate-500 uppercase mr-3">Sort By</label>
                <select
                  value={activeSort}
                  onChange={handleSortChange}
                  className="bg-transparent text-sm font-semibold text-primary-900 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Result meta */}
            {!loading && (
              <div className="flex items-center gap-3 mb-6">
                <p className="text-primary-500 text-sm">
                  <span className="font-bold text-primary-800">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                  {activeCategory && (
                    <span> in <span className="font-semibold text-gold-600 capitalize">{activeCategory.replace(/-/g, ' ')}</span></span>
                  )}
                </p>
                {(activeCategory || searchParams.toString()) && (
                  <button onClick={clearSearch}
                    className="text-xs text-primary-400 hover:text-primary-700 border border-primary-200 rounded-full px-3 py-1 transition-colors">
                    Clear all filters ×
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
                <p className="text-primary-400 text-sm font-kannada mb-5">ಯಾವುದೇ ಉತ್ಪನ್ನ ಕಂಡುಬಂದಿಲ್ಲ</p>
                <button onClick={clearSearch}
                  className="btn-shine px-6 py-2.5 bg-gradient-to-r from-primary-700 to-primary-800 text-white font-bold rounded-xl text-sm">
                  Clear Filters
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

export default ProductsView
