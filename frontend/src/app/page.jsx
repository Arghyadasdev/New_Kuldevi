'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/services/api'
import ProductCard from '@/components/ProductCard'
import { CoverFlowCarousel } from '@/components/ui/3-d-coverflow-carousel'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

const BANNERS = [
  '/Banner (1).jpg',
  '/Banner (2).jpg',
  '/Banner (3).jpg',
  '/Banner (4).jpg',
  '/Banner (5).jpg',
]

const FEATURES = [
  { num: '01', title: 'Premium Quality', desc: 'High-grade paper and durable office products.' },
  { num: '02', title: 'Custom Printing', desc: 'Personalized branding and custom stationery solutions.' },
  { num: '03', title: 'Bulk Orders', desc: 'Affordable wholesale pricing for schools and offices.' },
  { num: '04', title: 'Fast Delivery', desc: 'Quick and reliable delivery across locations.' },
]

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [bannerHovered, setBannerHovered] = useState(false)

  useEffect(() => {
    if (bannerHovered) return
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % BANNERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [bannerHovered])

  const prevSlide = () => setCurrentSlide(s => (s - 1 + BANNERS.length) % BANNERS.length)
  const nextSlide = () => setCurrentSlide(s => (s + 1) % BANNERS.length)

  useEffect(() => {
    api.get('/products?limit=6')
      .then(r => setFeaturedProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── HERO + BANNER CAROUSEL ── */}
      <section
        id="home"
        className="relative overflow-hidden text-white min-h-[600px] flex flex-col"
        onMouseEnter={() => setBannerHovered(true)}
        onMouseLeave={() => setBannerHovered(false)}
      >
        {/* Cycling banner backgrounds */}
        {BANNERS.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0'}`}
          >
            <img
              src={src}
              alt=""
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${i === currentSlide ? 'scale-110' : 'scale-100'}`}
            />
          </div>
        ))}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-950/55 to-blue-950/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <span className="inline-block bg-amber-500/20 border border-amber-400/60 text-amber-300 px-4 py-2 rounded-full text-sm mb-6">
              ESTD. 2023 · Premium Stationery Brand
            </span>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-xl">
              Elegant Stationery
              <span className="block text-amber-400">For Modern Businesses</span>
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed mb-8 max-w-xl drop-shadow">
              Kuldevi Stationers provides premium notebooks, office supplies,
              educational materials, customized printing, and corporate stationery solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products"
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105">
                Explore Products
              </Link>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.862a.5.5 0 0 0 .614.614l6.007-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.028-1.38l-.36-.214-3.733.917.935-3.625-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                </svg>
                WhatsApp Order
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
              {[['500+','Products'],['1000+','Customers'],['2+','Years Trust']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-3xl font-bold text-amber-400 drop-shadow">{n}</p>
                  <p className="text-slate-300 text-sm mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full ${i === currentSlide ? 'bg-amber-400 w-7 h-2.5' : 'bg-white/50 hover:bg-white/80 w-2.5 h-2.5'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-slate-50">
            <path d="M0,30 C480,0 960,60 1440,20 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── BEST SELLERS SHOWCASE ── */}
      <CoverFlowCarousel />

      {/* ── FEATURES ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-600 uppercase tracking-[0.2em] text-xs font-semibold">Why Us</span>
            <h3 className="text-4xl font-bold text-blue-950 mt-2 mb-4">Why Choose Kuldevi?</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Delivering premium quality stationery products for students, businesses and professionals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.num} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="h-14 w-14 rounded-2xl bg-blue-950 text-white flex items-center justify-center text-xl font-bold mb-6">
                  {f.num}
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h4>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-semibold">Our Collection</span>
            <h3 className="text-4xl font-bold text-blue-950 mt-3">Premium Stationery Products</h3>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden border border-slate-100">
                  <div className="shimmer h-52 w-full" />
                  <div className="p-6 space-y-2">
                    <div className="shimmer h-4 w-2/3 rounded" />
                    <div className="shimmer h-3 w-full rounded" />
                    <div className="shimmer h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="text-7xl mb-4">📦</div>
              <p className="text-blue-950 text-xl font-semibold">No products yet</p>
              <p className="text-slate-500 text-sm mt-1">Add products via Admin Dashboard</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white font-semibold px-8 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <img src="/logo.png" alt="About Kuldevi"
              className="rounded-[2rem] shadow-2xl w-full object-contain bg-white p-6"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div>
            <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-semibold">About Us</span>
            <h3 className="text-5xl font-bold text-blue-950 mt-4 mb-6 leading-tight">
              Building Trust Through Quality & Creativity
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              Kuldevi Stationers is committed to delivering high-quality stationery products
              with elegant design and durability. Serving Bengaluru since 2023.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              From premium notebooks and luxury pens to bulk office supplies and custom
              printed stationery — we have everything you need for school, office, and business.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h4 className="text-4xl font-bold text-blue-950">500+</h4>
                <p className="text-slate-600 mt-2">Products Available</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h4 className="text-4xl font-bold text-blue-950">1000+</h4>
                <p className="text-slate-600 mt-2">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-semibold">Contact Us</span>
            <h3 className="text-5xl font-bold text-blue-950 mt-4 mb-6">Let's Connect</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Reach out for wholesale inquiries, custom printing, or premium stationery orders.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-bold text-lg text-blue-950 mb-1">📞 Phone / WhatsApp</h4>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors">
                  +91 {WHATSAPP || '98765 43210'} →
                </a>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-bold text-lg text-blue-950 mb-1">📍 Address</h4>
                <p className="text-slate-600">Bengaluru, Karnataka — 560001</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-bold text-lg text-blue-950 mb-1">✉️ Email</h4>
                <p className="text-slate-600">info@kuldevistationers.com</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 shadow-lg">
            <h4 className="text-2xl font-bold text-blue-950 mb-6">Send a Message</h4>
            <form className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.target)
                const name = fd.get('name'), email = fd.get('email'), msg = fd.get('message')
                const text = encodeURIComponent(`Hi! I'm ${name} (${email}).\n\n${msg}`)
                window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank')
              }}
            >
              <input name="name" type="text" placeholder="Full Name" required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 bg-white" />
              <input name="email" type="email" placeholder="Email Address" required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 bg-white" />
              <textarea name="message" rows={5} placeholder="Your Message" required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 bg-white resize-none" />
              <button type="submit"
                className="w-full bg-blue-950 hover:bg-blue-900 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-900/30">
                Send via WhatsApp →
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
