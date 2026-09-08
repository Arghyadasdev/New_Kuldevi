'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/services/api'
import { useLang } from '@/context/LangContext'

const CATEGORY_DATA = {
  'pens':             { icon: '🖊️', color: 'from-blue-500 to-indigo-600',   desc: 'Premium writing instruments',   kn: 'ಬರವಣಿಗೆ ಸಾಧನಗಳು' },
  'notebooks':        { icon: '📓', color: 'from-emerald-500 to-teal-600',  desc: 'Journals, planners & ruled',     kn: 'ನೋಟ್‌ಬುಕ್ ಮತ್ತು ಡೈರಿ' },
  'art-supplies':     { icon: '🎨', color: 'from-purple-500 to-violet-600', desc: 'Colors for every creation',      kn: 'ಬಣ್ಣ ಮತ್ತು ಕಲಾ ಸಾಮಗ್ರಿ' },
  'office-supplies':  { icon: '📎', color: 'from-orange-500 to-red-500',    desc: 'Essentials for productivity',    kn: 'ಆಫೀಸ್ ಸಾಮಗ್ರಿ' },
  'paper-products':   { icon: '📄', color: 'from-slate-500 to-gray-600',    desc: 'Quality paper & cards',          kn: 'ಕಾಗದ ಉತ್ಪನ್ನಗಳು' },
  'desk-accessories': { icon: '✏️', color: 'from-teal-500 to-cyan-600',     desc: 'Organize your workspace',        kn: 'ಡೆಸ್ಕ್ ಸಾಮಗ್ರಿ' },
}

const DEFAULT_CATS = ['Pens', 'Notebooks', 'Art Supplies', 'Office Supplies', 'Paper Products', 'Desk Accessories']

function getInfo(name) {
  const slug = (name || '').toLowerCase().replace(/\s+/g, '-')
  return CATEGORY_DATA[slug] || { icon: '📦', color: 'from-primary-500 to-primary-700', desc: 'Explore our collection', kn: 'ಸಂಗ್ರಹ ನೋಡಿ' }
}

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const list = categories.length > 0 ? categories : DEFAULT_CATS

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Hero */}
      <div className="relative mesh-bg py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-[2px]" />
        {/* Floating decorations */}
        {['✏️','📓','🎨','📎'].map((e, i) => (
          <span key={i} className="float-emoji absolute text-4xl pointer-events-none select-none opacity-10"
            style={{ left: `${15 + i * 22}%`, top: `${20 + (i % 2) * 40}%`, '--dur': `${3+i}s`, '--delay': `${i*0.4}s` }}
          >{e}</span>
        ))}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10 fill-slate-50">
            <path d="M0,30 C480,0 960,50 1440,20 L1440,50 L0,50 Z" />
          </svg>
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-gold-300 text-xs font-bold uppercase tracking-widest mb-4">
            🗂️ Browse
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            {t('shopByCategory')}
          </h1>
          <p className="text-primary-200 font-kannada text-base">ವರ್ಗದ ಪ್ರಕಾರ ಖರೀದಿಸಿ</p>
          <div className="divider-indian mt-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-primary-100">
                <div className="shimmer h-40 w-full" />
                <div className="p-6 space-y-2">
                  <div className="shimmer h-5 w-1/2 rounded" />
                  <div className="shimmer h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((cat, idx) => {
              const info = getInfo(cat)
              return (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="card-glow group bg-white rounded-3xl overflow-hidden border border-primary-100/80 shadow-md"
                >
                  {/* Color band */}
                  <div className={`relative h-40 bg-gradient-to-br ${info.color} flex items-center justify-center overflow-hidden`}>
                    {/* Subtle texture */}
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
                    <span className="text-8xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 drop-shadow-xl">
                      {info.icon}
                    </span>
                    {/* Item count badge placeholder */}
                    <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-white text-[10px] font-bold opacity-80">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-primary-900 mb-1 capitalize group-hover:text-primary-700 transition-colors">
                      {cat}
                    </h3>
                    <p className="text-primary-400 text-sm mb-1">{info.desc}</p>
                    <p className="text-primary-300 text-xs font-kannada">{info.kn}</p>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-primary-50">
                      <span className="text-primary-600 text-sm font-semibold group-hover:text-gold-600 transition-colors">
                        Explore Collection
                      </span>
                      <span className="w-8 h-8 rounded-full bg-primary-50 group-hover:bg-gold-500 flex items-center justify-center transition-all duration-300">
                        <svg className="w-4 h-4 text-primary-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
