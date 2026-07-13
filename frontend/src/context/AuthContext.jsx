import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => { logout() })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: jwt, ...userData } = res.data
    localStorage.setItem('token', jwt)
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    setToken(jwt)
    setUser(userData)
    return userData
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token: jwt, ...userData } = res.data
    localStorage.setItem('token', jwt)
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    setToken(jwt)
    setUser(userData)
    return userData
  }

  const setTokenFromOAuth = (jwt) => {
    localStorage.setItem('token', jwt)
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    setLoading(true)
    setToken(jwt) // triggers the useEffect above, which fetches /users/me
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setTokenFromOAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)