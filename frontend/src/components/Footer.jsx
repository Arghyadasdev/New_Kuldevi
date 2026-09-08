'use client'

import Link from 'next/link'
import { useLang } from '@/context/LangContext'

function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLang()

  return (
    <footer className="bg-primary-950 text-white">
      {/* Indian decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 via-white via-gold-500 to-primary-600"></div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gold-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Kuldevi Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML += '<span class="text-primary-950 font-bold text-2xl">ಕ</span>'
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-display font-bold">KULDEVI</span>
                <span className="text-gold-400 text-xs block font-kannada">ಕುಲದೇವಿ ಸ್ಟೇಷನರಿ</span>
              </div>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed mb-2">
              Your trusted stationery destination since 1995.
            </p>
            <p className="text-gold-400 text-sm font-kannada mb-6">
              ೧೯೯೫ ರಿಂದ ಬೆಂಗಳೂರಿನ ನಂಬಿಕೆಯ ಸ್ಟೇಷನರಿ ಅಂಗಡಿ.
            </p>
            <div className="flex gap-3">
              {/* WhatsApp */}
              <a href="#" className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.862a.5.5 0 0 0 .614.614l6.007-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.028-1.38l-.36-.214-3.733.917.935-3.625-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-primary-800 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-primary-800 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gold-400">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">{t('home')}</Link></li>
              <li><Link href="/products" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">{t('products')}</Link></li>
              <li><Link href="/categories" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">{t('categories')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gold-400">{t('categories')}</h3>
            <ul className="space-y-2">
              <li><Link href="/categories/pens" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">Pens / ಪೆನ್</Link></li>
              <li><Link href="/categories/notebooks" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">Notebooks / ನೋಟ್‌ಬುಕ್</Link></li>
              <li><Link href="/categories/art-supplies" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">Art Supplies / ಕಲಾ ಸಾಮಗ್ರಿ</Link></li>
              <li><Link href="/categories/office-supplies" className="text-primary-300 hover:text-gold-400 transition-colors text-sm">Office Supplies / ಆಫೀಸ್ ಸಾಮಗ್ರಿ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gold-400">{t('contactUs')}</h3>
            <ul className="space-y-3 text-primary-300">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gold-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">
                  Kuldevi Stationery<br />
                  <span className="font-kannada text-xs text-gold-400">ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ - 560001</span><br />
                  Bengaluru, Karnataka - 560001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{t('email')}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">{t('phone')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-primary-400 text-xs">
              © {currentYear} {t('copyright')}
            </p>
            <p className="text-primary-500 text-xs font-kannada">
              🇮🇳 ಭಾರತದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ · Made in India
            </p>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-primary-700 via-gold-500 to-primary-700"></div>
    </footer>
  )
}

export default Footer
