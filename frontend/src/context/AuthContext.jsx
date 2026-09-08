'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AuthContext = createContext(null)
const ADMIN_EMAIL_DOMAIN = 'kuldevi.internal'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const resolveSession = useCallback(async (session) => {
    if (!session) {
      setUser(null)
      setIsAdmin(false)
      return
    }
    const authUser = session.user
    if (authUser.email?.endsWith(`@${ADMIN_EMAIL_DOMAIN}`)) {
      const { data: adminRow } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle()
      if (adminRow) {
        setUser({ username: authUser.user_metadata?.username || authUser.email.split('@')[0], role: 'admin' })
        setIsAdmin(true)
        return
      }
    }
    setUser({ name: authUser.user_metadata?.name, email: authUser.email, role: 'customer' })
    setIsAdmin(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveSession(session).finally(() => setLoading(false))
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [resolveSession])

  const login = useCallback(async (username, password) => {
    const email = `${username}@${ADMIN_EMAIL_DOMAIN}`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Invalid username or password')

    const { data: adminRow } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle()
    if (!adminRow) {
      await supabase.auth.signOut()
      throw new Error('Invalid username or password')
    }

    setUser({ username, role: 'admin' })
    setIsAdmin(true)
    return { username }
  }, [])

  const logout = useCallback(() => {
    supabase.auth.signOut()
  }, [])

  const customerLogin = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Invalid credentials')
    const name = data.user.user_metadata?.name
    setUser({ name, email: data.user.email, role: 'customer' })
    return { name, email: data.user.email }
  }, [])

  const customerRegister = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if (error) throw new Error(error.message)
    if (!data.session) {
      throw new Error('Check your email to confirm your account before signing in.')
    }
    setUser({ name, email: data.user.email, role: 'customer' })
    return { name, email: data.user.email }
  }, [])

  const customerLogout = useCallback(() => {
    supabase.auth.signOut()
  }, [])

  const isCustomer = !!user && !isAdmin

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isCustomer,
      loading,
      username: user?.username,
      login,
      logout,
      customerName: user?.name || user?.email,
      customerLogin,
      customerRegister,
      customerLogout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
