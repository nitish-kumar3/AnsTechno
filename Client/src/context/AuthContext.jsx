import { createContext, useEffect, useState } from 'react'
import api, { setToken } from '../services/api'
import { stopTrackingThisBrowser } from '../services/track'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // abhi check ho raha hai ki login hai ya nahi

  useEffect(() => {
    // Page khulte hi cookie se check karo ki admin pehle se login hai ya nahi
    api
      .post('/auth/refresh')
      .then(({ data }) => {
        if (data.user.role === 'admin') {
          setToken(data.accessToken)
          setUser(data.user)
          stopTrackingThisBrowser()
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Token refresh fail ho jaye to logout kar do
    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })

    // Admin ke alawa koi andar nahi aa sakta
    if (data.user.role !== 'admin') {
      await api.post('/auth/logout')
      throw new Error('This account does not have admin access')
    }

    setToken(data.accessToken)
    setUser(data.user)
    stopTrackingThisBrowser()
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // error aaye to bhi logout karna hai
    }
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}