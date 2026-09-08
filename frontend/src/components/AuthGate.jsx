'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function AuthGate({ children }) {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/login')
    }
  }, [loading, isAdmin, router])

  if (loading || !isAdmin) return null

  return children
}

export default AuthGate
