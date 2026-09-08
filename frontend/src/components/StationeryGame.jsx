'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

const ITEMS = [
  { id: 1, emoji: '✏️', name: 'Pencil Set', nameKn: 'ಪೆನ್ಸಿಲ್ ಸೆಟ್', desc: '12 coloured pencils', price: 60, color: 'from-yellow-400 to-amber-500' },
  { id: 2, emoji: '📓', name: 'Notebook', nameKn: 'ನೋಟ್‌ಬುಕ್', desc: 'A4 ruled, 200 pages', price: 80, color: 'from-blue-400 to-indigo-500' },
  { id: 3, emoji: '🖊️', name: 'Pen Pack', nameKn: 'ಪೆನ್ ಪ್ಯಾಕ್', desc: 'Blue, black & red pens', price: 45, color: 'from-sky-400 to-cyan-500' },
  { id: 4, emoji: '📐', name: 'Geometry Box', nameKn: 'ಜ್ಯಾಮಿತಿ ಬಾಕ್ಸ್', desc: 'Complete math set', price: 120, color: 'from-purple-400 to-violet-600' },
  { id: 5, emoji: '🎨', name: 'Colour Box', nameKn: 'ಬಣ್ಣದ ಡಬ್ಬ', desc: '24 wax crayons', price: 75, color: 'from-pink-400 to-rose-500' },
  { id: 6, emoji: '📏', name: 'Scale & Eraser', nameKn: 'ಸ್ಕೇಲ್ ಮತ್ತು ರಬ್ಬರ್', desc: '30cm ruler + eraser', price: 30, color: 'from-orange-400 to-red-500' },
  { id: 7, emoji: '✂️', name: 'Scissors', nameKn: 'ಕತ್ತರಿ', desc: 'Safe round-tip', price: 55, color: 'from-teal-400 to-emerald-500' },
  { id: 8, emoji: '🗂️', name: 'Folder Set', nameKn: 'ಫೋಲ್ಡರ್ ಸೆಟ್', desc: 'Pack of 5 coloured', price: 90, color: 'from-fuchsia-400 to-pink-600' },
]

function StationeryGame() {
  const [selected, setSelected] = useState([])
  const [sent, setSent] = useState(false)

  const toggle = (item) => {
    setSelected(prev =>
      prev.find(s => s.id === item.id)
        ? prev.filter(s => s.id !== item.id)
        : [...prev, item]
    )
    setSent(false)
  }

  const total = selected.reduce((sum, s) => sum + s.price, 0)

  const buildLink = () => {
    const list = selected.map(s => `• ${s.name} (₹${s.price})`).join('\n')
    const text = encodeURIComponent(
      `ನಮಸ್ಕಾರ! ನಾನು ಈ ಕಿಟ್ ಆರ್ಡರ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ:\n\n${list}\n\nಒಟ್ಟು: ₹${total}\n\nHi! I'd like to order this kit:\n${list}\nTotal: ₹${total}`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gold-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-widest mb-4">
            🎮 Interactive Game
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900">
            Build Your School Kit! 🎒
          </h2>
          <p className="text-primary-400 font-kannada mt-1 text-base">ನಿಮ್ಮ ಶಾಲಾ ಕಿಟ್ ನಿರ್ಮಿಸಿ!</p>
          <p className="text-primary-500 mt-3 max-w-lg mx-auto text-sm">
            Tap items to pick → see your total → order in one WhatsApp tap
          </p>
          <div className="divider-indian mt-5" />
        </div>

        {/* Counter bar */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="glass-light rounded-2xl px-6 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-gradient">{selected.length}</span>
            <div>
              <p className="text-primary-700 font-bold text-sm">items selected</p>
              <p className="text-primary-400 text-xs font-kannada">{selected.length} ಐಟಂಗಳು ಆಯ್ಕೆ</p>
            </div>
          </div>
          {selected.length > 0 && (
            <div className="glass-light rounded-2xl px-6 py-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-gradient">₹{total}</span>
              <div>
                <p className="text-primary-700 font-bold text-sm">total</p>
                <p className="text-primary-400 text-xs font-kannada">ಒಟ್ಟು ಮೊತ್ತ</p>
              </div>
            </div>
          )}
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {ITEMS.map(item => {
            const isSelected = !!selected.find(s => s.id === item.id)
            return (
              <button key={item.id} onClick={() => toggle(item)}
                className={`relative rounded-2xl p-5 text-center transition-all duration-300 transform border-2 shadow-md ${
                  isSelected
                    ? 'border-transparent scale-105 shadow-xl text-white'
                    : 'bg-white border-gray-100 text-primary-900 hover:border-primary-200 hover:scale-103 hover:shadow-lg'
                }`}
                style={isSelected ? {
                  background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                } : {}}
              >
                {/* Gradient bg when selected */}
                {isSelected && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-95`} />
                )}

                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`text-4xl mb-2 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                    {item.emoji}
                  </div>
                  <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-primary-900'}`}>{item.name}</p>
                  <p className={`text-xs mt-0.5 font-kannada ${isSelected ? 'text-white/80' : 'text-primary-400'}`}>{item.nameKn}</p>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-primary-300'}`}>{item.desc}</p>
                  <p className={`text-lg font-bold mt-2 ${isSelected ? 'text-white' : 'text-gradient'}`}>₹{item.price}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Kit summary card */}
        <div className={`max-w-2xl mx-auto transition-all duration-500 ${
          selected.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}>
          <div className="glass-light rounded-3xl overflow-hidden shadow-2xl border border-primary-100">
            <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />
            <div className="p-7">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-primary-900">
                  🎒 Your Kit
                  <span className="ml-2 text-sm font-normal text-primary-400">({selected.length} item{selected.length !== 1 ? 's' : ''})</span>
                </h3>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gradient">₹{total}</span>
                  <p className="text-primary-400 text-xs font-kannada">ಒಟ್ಟು ಮೊತ್ತ</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selected.map(s => (
                  <span key={s.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100 hover:border-primary-300 transition-colors"
                  >
                    {s.emoji} {s.name}
                    <button onClick={() => toggle(s)}
                      className="text-primary-300 hover:text-primary-600 ml-0.5 text-base leading-none"
                    >×</button>
                  </span>
                ))}
              </div>

              <a href={buildLink()} target="_blank" rel="noopener noreferrer"
                onClick={() => setSent(true)}
                className="pulse-ring btn-shine flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-xl hover:shadow-green-500/30 hover:scale-[1.02]"
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.862a.5.5 0 0 0 .614.614l6.007-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.028-1.38l-.36-.214-3.733.917.935-3.625-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                </svg>
                Order Kit via WhatsApp — ₹{total}
              </a>

              {sent && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-xl py-3 border border-green-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">WhatsApp opened! We'll confirm your order shortly.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {selected.length === 0 && (
          <p className="text-center text-primary-300 text-sm mt-6">
            👆 Tap any item above to start building your kit
          </p>
        )}
      </div>
    </section>
  )
}

export default StationeryGame
