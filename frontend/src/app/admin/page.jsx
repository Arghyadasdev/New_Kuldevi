'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthGate from '@/components/AuthGate'
import DashboardHome from '@/components/admin/DashboardHome'
import OrdersManager from '@/components/admin/OrdersManager'
import ProductManager from '@/components/admin/ProductManager'
import InventoryManager from '@/components/admin/InventoryManager'
import CustomerManager from '@/components/admin/CustomerManager'
import CouponManager from '@/components/admin/CouponManager'
import InvoiceBuilder from '@/components/admin/InvoiceBuilder'
import StoreSettings, { loadSettings } from '@/components/admin/StoreSettings'
import { useAuth } from '@/context/AuthContext'

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📈' },
  { id: 'orders', label: 'Orders', icon: '🛍️' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'inventory', label: 'Inventory', icon: '📊' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'coupons', label: 'Coupons', icon: '🎟️' },
  { id: 'invoice', label: 'Invoices', icon: '🧾' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, username } = useAuth()
  const router = useRouter()
  const storeSettings = loadSettings()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />
      case 'orders': return <OrdersManager />
      case 'products': return <ProductManager />
      case 'inventory': return <InventoryManager />
      case 'customers': return <CustomerManager />
      case 'coupons': return <CouponManager />
      case 'invoice': return <InvoiceBuilder storeSettings={storeSettings} />
      case 'settings': return <StoreSettings />
      default: return <DashboardHome />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Mobile Header (Visible on Mobile) */}
      <div className="md:hidden bg-blue-950 text-white p-4 flex items-center justify-between shadow-md z-20">
        <div className="font-bold text-lg">{storeSettings.name} Admin</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-slate-200 shadow-sm flex-shrink-0 h-auto md:h-screen sticky top-0 z-10 flex flex-col`}>
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-md">
            {storeSettings.name.charAt(0)}
          </div>
          <h1 className="font-bold text-blue-950 text-lg leading-tight">{storeSettings.name}</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wide">Admin Portal</p>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-950'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold border border-slate-200">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">{username}</p>
              <p className="text-[10px] text-slate-500 uppercase">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] md:max-w-none">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGate>
      <AdminDashboard />
    </AuthGate>
  )
}
