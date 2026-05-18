import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username'))

  const login = useCallback(async (user, pass) => {
    const res = await api.post('/auth/login', { username: user, password: pass })
    localStorage.setItem('admin_token', res.data.token)
    localStorage.setItem('admin_username', res.data.username)
    setToken(res.data.token)
    setUsername(res.data.username)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    setToken(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAdmin: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
