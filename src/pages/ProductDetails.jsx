import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useLang } from '../context/LangContext'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

function buildWhatsAppLink(product) {
  const text = encodeURIComponent(
    `नमस्ते! मैं यह उत्पाद ऑर्डर करना चाहता/चाहती हूं:\n\n*${product.name}*\nकीमत: ₹${product.price}\nSKU: ${product.sku || 'N/A'}\n\nकृपया उपलब्धता की पुष्टि करें।\n\nHi! I'd like to order:\n*${product.name}* — ₹${product.price}`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin" />
          <p className="text-primary-400 text-sm font-devanagari">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">📦</div>
          <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">Product not found</h2>
          <p className="text-primary-400 font-devanagari text-sm mb-5">उत्पाद नहीं मिला</p>
          <Link to="/products"
            className="btn-shine inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-800 text-white font-bold rounded-xl">
            ← {t('backToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Breadcrumb bar */}
      <div className="bg-primary-950 border-b border-white/5">
        <div className="h-0.5 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-primary-400 hover:text-gold-400 transition-colors">Home</Link>
            <span className="text-primary-700">/</span>
            <Link to="/products" className="text-primary-400 hover:text-gold-400 transition-colors">{t('products')}</Link>
            <span className="text-primary-700">/</span>
            <span className="text-gold-400 truncate max-w-[160px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/products"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-800 mb-8 font-medium transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToProducts')}
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-primary-100">
          <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />

          <div className="md:grid md:grid-cols-2">
            {/* Image panel */}
            <div className="relative bg-gradient-to-br from-primary-50 to-gold-50 flex items-center justify-center min-h-[400px] md:min-h-[520px] overflow-hidden">
              {/* Subtle mesh */}
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(ellipse at 20% 20%, rgba(194,32,14,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255,153,51,0.15) 0%, transparent 60%)' }} />

              {product.image ? (
                <img src={product.image} alt={product.name}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <span className="text-9xl">📦</span>
                  <span className="text-primary-300 text-sm">No image</span>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute top-5 left-5 px-4 py-2 bg-primary-700 text-white font-bold rounded-full text-sm shadow-lg">
                  {t('outOfStock')}
                </div>
              )}
              {!isOutOfStock && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-700 text-xs font-semibold">In Stock</span>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="p-8 md:p-10 flex flex-col">
              <span className="inline-block bg-gold-100 text-primary-700 text-[11px] font-bold px-4 py-1.5 rounded-full mb-4 border border-gold-200 uppercase tracking-wide w-fit">
                {product.category}
              </span>

              <h1 className="text-3xl font-display font-bold text-primary-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-bold text-gradient">₹{product.price}</span>
              </div>

              <p className="text-primary-500 leading-relaxed text-sm mb-6 flex-grow">
                {product.description}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-gold-50 border border-primary-100 p-4">
                  <p className="text-primary-400 text-[10px] uppercase font-semibold tracking-wide mb-1">{t('availability')}</p>
                  <p className={`text-lg font-bold ${isOutOfStock ? 'text-primary-600' : 'text-green-600'}`}>
                    {isOutOfStock ? t('outOfStock') : `${product.stock} ${t('inStock')}`}
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-gold-50 border border-primary-100 p-4">
                  <p className="text-primary-400 text-[10px] uppercase font-semibold tracking-wide mb-1">{t('sku')}</p>
                  <p className="text-lg font-bold text-primary-900">{product.sku || '—'}</p>
                </div>
              </div>

              {/* Order button */}
              {isOutOfStock ? (
                <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 text-center font-semibold cursor-not-allowed border border-gray-200">
                  {t('outOfStock')}
                </div>
              ) : (
                <a href={buildWhatsAppLink(product)} target="_blank" rel="noopener noreferrer"
                  className="pulse-ring btn-shine flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-xl hover:shadow-green-500/30 hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.862a.5.5 0 0 0 .614.614l6.007-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.028-1.38l-.36-.214-3.733.917.935-3.625-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                  </svg>
                  {t('orderWhatsApp')}
                </a>
              )}

              <p className="text-center text-primary-300 text-xs mt-3 font-devanagari">
                {t('orderWhatsAppSub')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
