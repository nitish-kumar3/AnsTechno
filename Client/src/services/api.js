import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // refresh cookie bhejne ke liye
})

// Access token yahan memory me rahta hai
let accessToken = ''
export const setToken = (token) => {
  accessToken = token
}

// Har request ke saath token laga do
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// 401 aaye (token expire) to ek baar naya token lekar request dobara bhejo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthCall = original?.url?.includes('/auth/')

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true
      try {
        const { data } = await api.post('/auth/refresh')
        setToken(data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        setToken('')
        window.dispatchEvent(new Event('auth:logout'))
      }
    }
    return Promise.reject(error)
  }
)

export default api