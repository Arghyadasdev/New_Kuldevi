'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'

function Login() {
  const { login } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      router.push('/admin')
    } catch (err) {
      setError(err.message || t('invalidCreds'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />

          <div className="p-8 md:p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-5">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl rotate-6 blur-sm opacity-60" />
                <div className="relative w-18 h-18 bg-gradient-to-br from-gold-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl font-kannada px-5 py-4">
                  ಕ
                </div>
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-1">{t('adminLoginTitle')}</h1>
              <p className="text-primary-300 text-sm font-kannada">ಕುಲದೇವಿ ಸ್ಟೇಷನರಿ · ಬೆಂಗಳೂರು</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-primary-200 text-xs font-semibold uppercase tracking-widest mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-300 text-sm transition-all"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-primary-200 text-xs font-semibold uppercase tracking-widest mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-300 text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-shine w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-xl hover:shadow-gold-900/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {t('signingIn')}
                  </span>
                ) : t('signIn')}
              </button>
            </form>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="px-8 py-4 text-center">
            <p className="text-primary-500 text-xs">🔒 Admin access only · ಕುಲದೇವಿ ಸ್ಟೇಷನರಿ</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
