'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

const emptyItem = () => ({ id: Date.now(), name: '', qty: 1, price: 0 })

function generateInvoiceNum() {
  return `KS-${Date.now().toString().slice(-6)}`
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function InvoiceBuilder({ storeSettings }) {
  const [products, setProducts] = useState([])
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [items, setItems] = useState([emptyItem()])
  const [invoiceNum] = useState(generateInvoiceNum)
  const [notes, setNotes] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const total = items.reduce((s, i) => s + (i.qty * i.price), 0)

  const addItem = () => setItems(prev => [...prev, emptyItem()])
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const updateItem = (id, field, val) => setItems(prev =>
    prev.map(i => i.id === id ? { ...i, [field]: field === 'name' ? val : Number(val) } : i)
  )
  const fillFromProduct = (id, productName) => {
    const p = products.find(p => p.name === productName)
    if (p) updateItem(id, 'price', p.price)
  }

  const buildWhatsAppText = () => {
    const store = storeSettings
    const itemLines = items
      .filter(i => i.name)
      .map((i, idx) => `${idx + 1}. ${i.name} × ${i.qty} = ₹${(i.qty * i.price).toFixed(2)}`)
      .join('\n')

    return encodeURIComponent(
`🧾 *INVOICE*
━━━━━━━━━━━━━━━━━━
*${store.name || 'Kuldevi Stationers'}*
${store.address || 'Bengaluru, Karnataka'}
━━━━━━━━━━━━━━━━━━

Invoice #: ${invoiceNum}
Date: ${formatDate()}${customer.name ? `\nCustomer: ${customer.name}` : ''}${customer.phone ? `\nPhone: ${customer.phone}` : ''}

*ITEMS:*
${itemLines}
━━━━━━━━━━━━━━━━━━
*TOTAL: ₹${total.toFixed(2)}*${notes ? `\n\nNote: ${notes}` : ''}

Thank you for shopping with us! 🙏`
    )
  }

  const whatsappUrl = customer.phone
    ? `https://wa.me/91${customer.phone.replace(/\D/g,'')}?text=${buildWhatsAppText()}`
    : `https://wa.me/${WHATSAPP}?text=${buildWhatsAppText()}`

  const inputCls = "w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 text-sm bg-white"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-950">Invoice Builder</h2>
          <p className="text-slate-500 text-sm">Invoice #{invoiceNum} · {formatDate()}</p>
        </div>
        <button onClick={() => setPreview(!preview)}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        /* ─ PREVIEW ─ */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-950 via-amber-500 to-blue-950" />
          <div className="p-8 font-mono text-sm">
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-blue-950">{storeSettings.name || 'Kuldevi Stationers'}</p>
              <p className="text-slate-500">{storeSettings.address || 'Bengaluru, Karnataka'}</p>
              {storeSettings.gst && <p className="text-slate-400 text-xs">GST: {storeSettings.gst}</p>}
            </div>
            <div className="border-t border-b border-dashed border-slate-300 py-3 mb-4 flex justify-between text-xs text-slate-500">
              <span>Invoice #: {invoiceNum}</span>
              <span>Date: {formatDate()}</span>
            </div>
            {customer.name && (
              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Bill To</p>
                <p className="font-semibold text-slate-800">{customer.name}</p>
                {customer.phone && <p className="text-slate-500">{customer.phone}</p>}
                {customer.address && <p className="text-slate-500">{customer.address}</p>}
              </div>
            )}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.name).map((i, idx) => (
                  <tr key={i.id} className="border-b border-slate-100">
                    <td className="py-2 text-slate-800">{i.name}</td>
                    <td className="py-2 text-center text-slate-600">{i.qty}</td>
                    <td className="py-2 text-right text-slate-600">₹{i.price.toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold text-blue-950">₹{(i.qty * i.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-48">
                <div className="flex justify-between border-t border-slate-300 pt-2">
                  <span className="font-bold text-blue-950">TOTAL</span>
                  <span className="font-bold text-xl text-amber-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            {notes && <p className="mt-4 text-slate-500 text-xs italic">Note: {notes}</p>}
            <p className="text-center text-slate-400 text-xs mt-6">Thank you for your business! 🙏</p>
          </div>
        </div>
      ) : (
        /* ─ FORM ─ */
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-blue-950 mb-4 text-sm uppercase tracking-wide">Customer Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Name</label>
                <input value={customer.name} onChange={e => setCustomer(p => ({...p, name: e.target.value}))}
                  className={inputCls} placeholder="Customer name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Phone</label>
                <input value={customer.phone} onChange={e => setCustomer(p => ({...p, phone: e.target.value}))}
                  className={inputCls} placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Address</label>
                <input value={customer.address} onChange={e => setCustomer(p => ({...p, address: e.target.value}))}
                  className={inputCls} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-blue-950 mb-4 text-sm uppercase tracking-wide">Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className={`${inputCls} resize-none`} rows={5}
              placeholder="Payment terms, delivery info, special instructions..." />
          </div>
        </div>
      )}

      {/* Line items */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wide">Line Items</h3>
          <button onClick={addItem}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {items.map((item, idx) => (
            <div key={item.id} className="px-6 py-3 grid grid-cols-12 gap-3 items-center">
              <span className="col-span-1 text-slate-400 text-xs font-semibold">{idx + 1}</span>
              <div className="col-span-5">
                <input
                  list={`products-${item.id}`}
                  value={item.name}
                  onChange={e => { updateItem(item.id, 'name', e.target.value); fillFromProduct(item.id, e.target.value) }}
                  className={inputCls} placeholder="Item name"
                />
                <datalist id={`products-${item.id}`}>
                  {products.map(p => <option key={p._id} value={p.name} />)}
                </datalist>
              </div>
              <div className="col-span-2">
                <input type="number" min="1" value={item.qty}
                  onChange={e => updateItem(item.id, 'qty', e.target.value)}
                  className={inputCls} placeholder="Qty" />
              </div>
              <div className="col-span-2">
                <input type="number" min="0" step="0.01" value={item.price}
                  onChange={e => updateItem(item.id, 'price', e.target.value)}
                  className={inputCls} placeholder="₹" />
              </div>
              <div className="col-span-1 text-sm font-semibold text-blue-950 text-right">
                ₹{(item.qty * item.price).toFixed(0)}
              </div>
              <div className="col-span-1 text-right">
                {items.length > 1 && (
                  <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 text-xl leading-none">×</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <span className="text-slate-500 text-sm">{items.filter(i=>i.name).length} item(s)</span>
          <span className="text-xl font-bold text-blue-950">Total: ₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Send button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-xl hover:scale-[1.01] transition-all duration-300">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.862a.5.5 0 0 0 .614.614l6.007-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.028-1.38l-.36-.214-3.733.917.935-3.625-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
        </svg>
        Send Invoice via WhatsApp — ₹{total.toFixed(2)}
      </a>
    </div>
  )
}
