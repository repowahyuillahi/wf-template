import { createContext, useContext, useState } from 'react'
import { setAuthToken, authApi, API_BASE_URL } from './api.js'
import { DEMO_EMAIL, DEMO_PASS } from './data.js'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

const USER_KEY = 'wf-user'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

/**
 * Menyediakan state sesi aplikasi.
 * - Jika VITE_API_URL diisi → login memakai backend (authApi.login).
 * - Jika kosong → MODE DEMO memakai kredensial contoh lokal.
 * Logout otomatis terjadi saat api.js menerima HTTP 401 (event 'wf:unauthorized').
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  async function login(email, password) {
    if (API_BASE_URL) {
      const data = await authApi.login(email, password)
      if (!data || !data.token) throw Object.assign(new Error('Respons login tidak valid'), { code: 'bad-response' })
      setAuthToken(data.token)
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      return data.user
    }
    // --- mode demo (tanpa backend) ---
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASS) {
      const u = { name: 'Wahyu Illahi', email: email.trim(), role: 'Administrator' }
      setUser(u)
      localStorage.setItem(USER_KEY, JSON.stringify(u))
      return u
    }
    throw Object.assign(new Error('Kredensial salah'), { code: 'bad-credentials' })
  }

  function logout() {
    setAuthToken(null)
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
