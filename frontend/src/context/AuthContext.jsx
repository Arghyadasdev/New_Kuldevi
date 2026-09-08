'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const adminUsername = localStorage.getItem('adminUsername')
    const customerToken = localStorage.getItem('customerToken')
    const customerName = localStorage.getItem('customerName')
    const customerEmail = localStorage.getItem('customerEmail')

    if (adminToken && adminUsername) {
      setUser({ username: adminUsername, role: 'admin' })
      setIsAdmin(true)
    } else if (customerToken && customerEmail) {
      setUser({ name: customerName, email: customerEmail, role: 'customer' })
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const { data } = await axios.post('/api/auth/login', { username, password })
    localStorage.setItem('adminToken', data.token)
    localStorage.setItem('adminUsername', data.username)
    setUser({ username: data.username, role: 'admin' })
    setIsAdmin(true)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUsername')
    setUser(null)
    setIsAdmin(false)
  }, [])

  const customerLogin = useCallback(async (email, password) => {
    const { data } = await axios.post('/api/auth/customer/login', { email, password })
    localStorage.setItem('customerToken', data.token)
    localStorage.setItem('customerName', data.name)
    localStorage.setItem('customerEmail', data.email)
    setUser({ name: data.name, email: data.email, role: 'customer' })
    return data
  }, [])

  const customerRegister = useCallback(async (name, email, password) => {
    const { data } = await axios.post('/api/auth/customer/register', { name, email, password })
    localStorage.setItem('customerToken', data.token)
    localStorage.setItem('customerName', data.name)
    localStorage.setItem('customerEmail', data.email)
    setUser({ name: data.name, email: data.email, role: 'customer' })
    return data
  }, [])

  const customerLogout = useCallback(() => {
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customerName')
    localStorage.removeItem('customerEmail')
    setUser(null)
  }, [])

  const isCustomer = !!user && !isAdmin

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isCustomer,
      loading,
      token: isAdmin ? localStorage.getItem('adminToken') : null,
      username: user?.username,
      login,
      logout,
      customerToken: isCustomer ? localStorage.getItem('customerToken') : null,
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
