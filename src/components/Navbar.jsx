import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAdmin, username, logout } = useAuth()
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'products', path: '/products' },
    { key: 'categories', path: '/categories' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
        : 'bg-white border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="navbar-logo-link">
            <div className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="Kuldevi Stationers"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                  document.getElementById('navbar-text-logo').style.display = 'flex'
                }}
                onLoad={() => {
                  const el = document.getElementById('navbar-text-logo')
                  if (el) el.style.display = 'none'
                }}
              />
            </div>
            <div id="navbar-text-logo" className="items-center gap-3" style={{ display: 'flex' }}>
              <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-amber-400 font-bold text-xl shadow-md">K</div>
              <div className="leading-tight">
                <div className="text-blue-950 font-bold text-lg tracking-wide">KULDEVI</div>
                <div className="text-amber-600 text-[10px] uppercase tracking-[0.2em]">Stationers</div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, path }) => (
              <Link key={key} to={path}
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
              <Link to="/admin"
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
            <button onClick={toggle}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 hover:border-amber-400 hover:text-amber-600 transition-all duration-200">
              {lang === 'en' ? 'हिंदी' : 'EN'}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-blue-950 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  {username}
                </span>
                <button onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200">
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="px-5 py-2 text-xs font-bold rounded-full bg-blue-950 text-white hover:bg-blue-900 shadow-lg transition-all duration-200">
                {t('adminLogin')}
              </Link>
            )}
          </div>

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
              <Link key={key} to={path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path) ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >{t(key)}</Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                {t('dashboard')}
              </Link>
            )}
            <div className="flex items-center gap-2 px-4 pt-2">
              <button onClick={toggle}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 hover:border-amber-400 transition-colors">
                {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
              </button>
              {isAdmin ? (
                <button onClick={handleLogout}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                  {t('logout')}
                </button>
              ) : (
                <Link to="/login"
                  className="flex-1 py-2 text-center rounded-lg text-xs font-bold bg-blue-950 text-white">
                  {t('adminLogin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
