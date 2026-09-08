'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { useCart } from '@/context/CartContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAdmin, username, logout, isCustomer, customerName, customerLogout } = useAuth()
  const { t, lang, toggle } = useLang()
  const { totalItems } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  const handleLogout = () => {
    if (isAdmin) logout()
    if (isCustomer) customerLogout()
    router.push('/')
  }

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'products', path: '/products' },
    { key: 'categories', path: '/categories' },
  ]

  const isActive = (path) => pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
        : 'bg-white border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, path }) => (
              <Link key={key} href={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >
                {t(key)}
                {isActive(path) && (
                  <span className="block h-0.5 bg-amber-500 rounded-full mt-0.5" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/admin') ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >
                {t('dashboard')}
              </Link>
            )}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart icon */}
            <Link href="/cart" className="relative p-2 rounded-lg text-slate-600 hover:text-blue-950 hover:bg-slate-50 transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <button onClick={toggle}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 hover:border-amber-400 hover:text-amber-600 transition-all duration-200">
              {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-blue-950 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  Admin: {username}
                </span>
                <button onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200">
                  {t('logout')}
                </button>
              </div>
            ) : isCustomer ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-200">
                  {customerName ? customerName.charAt(0).toUpperCase() : 'U'}
                </div>
                <Link href="/my-orders" className="text-blue-950 text-sm font-semibold hidden lg:block hover:text-amber-600 transition-colors">
                  {customerName}
                </Link>
                <Link href="/wishlist" className="hidden lg:block text-red-500 hover:text-red-600 transition-colors ml-2" title="My Wishlist">
                  ❤️
                </Link>
                <Link href="/my-orders" className="hidden md:block lg:hidden px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                  Orders
                </Link>
                <button onClick={handleLogout}
                  className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all duration-200">
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/customer-login"
                  className="px-5 py-2 text-xs font-bold rounded-full bg-blue-950 text-white hover:bg-blue-900 shadow-lg transition-all duration-200">
                  Sign In
                </Link>
                <Link href="/login"
                  className="px-3 py-2 text-xs font-semibold rounded-lg text-slate-500 hover:bg-slate-100 transition-all duration-200">
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile cart */}
          <Link href="/cart" className="md:hidden relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu">
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-72 pb-4' : 'max-h-0'}`}>
          <div className="pt-2 space-y-1 border-t border-slate-100">
            {navLinks.map(({ key, path }) => (
              <Link key={key} href={path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path) ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >{t(key)}</Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                {t('dashboard')}
              </Link>
            )}
            <div className="flex items-center gap-2 px-4 pt-2">
              <button onClick={toggle}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 hover:border-amber-400 transition-colors">
                {lang === 'en' ? 'ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ' : 'View in English'}
              </button>
              {isAdmin ? (
                <button onClick={handleLogout}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                  {t('logout')}
                </button>
              ) : isCustomer ? (
                <>
                  <Link href="/my-orders" className="flex-1 py-2 text-center rounded-lg text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors">
                    Orders
                  </Link>
                  <Link href="/wishlist" className="flex-1 py-2 text-center rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                    Wishlist
                  </Link>
                  <button onClick={handleLogout}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                    {t('logout')}
                  </button>
                </>
              ) : (
                <div className="flex-1 flex gap-2">
                  <Link href="/customer-login"
                    className="flex-1 py-2 text-center rounded-lg text-xs font-bold bg-blue-950 text-white">
                    Sign In
                  </Link>
                  <Link href="/login"
                    className="py-2 px-3 text-center rounded-lg text-[10px] font-semibold text-slate-500 border border-slate-200">
                    Admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
