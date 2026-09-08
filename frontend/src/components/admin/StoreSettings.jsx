'use client'

import { useState, useEffect } from 'react'

const DEFAULTS = {
  name: 'Kuldevi Stationers',
  tagline: 'Quality Paper & Stationery Products',
  address: 'Bengaluru, Karnataka - 560001',
  phone: '',
  email: 'info@kuldevistationers.com',
  gst: '',
  hours: 'Mon–Sat: 9am–8pm',
}

const STORAGE_KEY = 'kuldevi_store_settings'

export function loadSettings() {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export default function StoreSettings() {
  const [settings, setSettings] = useState(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const update = (key, val) => setSettings(p => ({ ...p, [key]: val }))

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 text-sm bg-white"
  const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5"

  const Field = ({ label, k, placeholder, type = 'text' }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} value={settings[k]} onChange={e => update(k, e.target.value)}
        className={inputCls} placeholder={placeholder} />
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-blue-950">Store Settings</h2>
        <p className="text-slate-500 text-sm">Used in invoices and site footer.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">Business Info</h3>
        <Field label="Store Name" k="name" placeholder="Kuldevi Stationers" />
        <Field label="Tagline" k="tagline" placeholder="Quality Paper & Stationery Products" />
        <Field label="Full Address" k="address" placeholder="Street, City, Pincode" />
        <Field label="GST Number" k="gst" placeholder="Optional" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">Contact</h3>
        <Field label="WhatsApp / Phone" k="phone" placeholder="+91 98765 43210" type="tel" />
        <Field label="Email" k="email" placeholder="info@..." type="email" />
        <Field label="Business Hours" k="hours" placeholder="Mon–Sat: 9am–8pm" />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save}
          className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:scale-105">
          Save Settings
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved!
          </span>
        )}
      </div>
    </div>
  )
}
