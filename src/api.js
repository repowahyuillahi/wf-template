// ============================================================================
// Lapisan API terpusat — SATU-SATUNYA tempat frontend bicara ke backend.
//
// Cara menyambungkan ke backend IT Portal:
//   1. Buat file `.env` di root project berisi:  VITE_API_URL=https://api.portal-anda.id
//   2. Sesuaikan path endpoint di bawah (authApi, usersApi, ...) dengan API Anda.
//   3. Tidak perlu ubah komponen apa pun — semua request lewat fungsi di sini.
//
// Konvensi yang dipakai:
//   - Token JWT disimpan di localStorage 'wf-token', dikirim otomatis sebagai
//     header `Authorization: Bearer <token>` di setiap request.
//   - Response 401 dari server memicu event 'wf:unauthorized' → aplikasi
//     otomatis logout dan kembali ke halaman login.
//   - Saat VITE_API_URL kosong (default), aplikasi jalan dalam MODE DEMO
//     memakai data contoh lokal — cocok untuk prototyping & demo.
// ============================================================================

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const TOKEN_KEY = 'wf-token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api(path, { method = 'GET', body, headers = {}, signal } = {}) {
  const res = await fetch(API_BASE_URL + path, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthToken() ? { Authorization: 'Bearer ' + getAuthToken() } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    window.dispatchEvent(new Event('wf:unauthorized'))
    throw Object.assign(new Error('Sesi berakhir (401)'), { code: 'unauthorized', status: 401 })
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw Object.assign(new Error(text || `Request gagal (HTTP ${res.status})`), {
      code: 'http-error',
      status: res.status,
    })
  }

  if (res.status === 204) return null
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const apiGet = (path, opts) => api(path, { ...opts, method: 'GET' })
export const apiPost = (path, body, opts) => api(path, { ...opts, method: 'POST', body })
export const apiPut = (path, body, opts) => api(path, { ...opts, method: 'PUT', body })
export const apiPatch = (path, body, opts) => api(path, { ...opts, method: 'PATCH', body })
export const apiDelete = (path, opts) => api(path, { ...opts, method: 'DELETE' })

// ---------------------------------------------------------------------------
// Contoh pemetaan endpoint. Sesuaikan dengan API backend Anda.
// Format login yang diharapkan: { token: '...', user: { name, email, role } }
// ---------------------------------------------------------------------------
export const authApi = {
  login: (email, password) => apiPost('/api/auth/login', { email, password }),
  me: () => apiGet('/api/auth/me'),
  logout: () => apiPost('/api/auth/logout'),
}

export const usersApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return apiGet('/api/users' + (q ? '?' + q : ''))
  },
  create: (data) => apiPost('/api/users', data),
  update: (id, data) => apiPut('/api/users/' + id, data),
  remove: (id) => apiDelete('/api/users/' + id),
}

export const notificationsApi = {
  list: () => apiGet('/api/notifications'),
  markAllRead: () => apiPost('/api/notifications/read-all'),
}
