import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

function ProductCard({ product }) {
  const { t } = useLang()
  const isOutOfStock = product.stock === 0

  return (
    <div className="card-glow group bg-white rounded-2xl overflow-hidden border border-primary-100/80 shadow-md">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary-50 to-gold-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl opacity-60">📦</span>
            <span className="text-primary-300 text-xs">No image</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            to={`/products/${product._id}`}
            className="btn-shine px-5 py-2 bg-white/90 backdrop-blur-sm text-primary-800 text-sm font-bold rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
          >
            {t('quickView')} →
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-primary-700 text-white text-[10px] font-bold rounded-full shadow">
              {t('outOfStock')}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-gold-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gold-600 text-[11px] font-semibold uppercase tracking-widest mb-1.5">
          {product.category}
        </p>
        <h3 className="text-base font-bold text-primary-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-primary-400 text-xs line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3.5 border-t border-primary-100">
          <div>
            <span className="text-2xl font-bold text-gradient">₹{product.price}</span>
            {!isOutOfStock && (
              <p className="text-[10px] text-green-600 font-medium mt-0.5">
                ✓ {product.stock} {t('inStock')}
              </p>
            )}
          </div>
          <Link
            to={`/products/${product._id}`}
            className="btn-shine px-4 py-2 bg-gradient-to-r from-primary-700 to-primary-800 text-white text-xs font-bold rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-md"
          >
            {t('view')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
