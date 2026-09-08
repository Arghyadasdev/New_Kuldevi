'use client'

import { LangProvider } from '@/context/LangContext'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'

function Providers({ children }) {
  return (
    <LangProvider>
      <CartProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </CartProvider>
    </LangProvider>
  )
}

export default Providers
