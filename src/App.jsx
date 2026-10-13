import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './auth.jsx'
import { Sidebar, Topbar } from './components/Layout.jsx'
import ToastStack from './components/Toast.jsx'
import { UserModal, ConfirmModal } from './components/Modal.jsx'
import NotificationBell from './components/Notifications.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LoginPage from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Users from './pages/Users.jsx'
import Roles from './pages/Roles.jsx'
import AuditLog from './pages/AuditLog.jsx'
import NotFound from './pages/NotFound.jsx'
import FormPage, { emptyForm } from './pages/FormPage.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import { seedUsers, seedNotifications, toneForStatus } from './data.js'

const seedForm = {
  name: 'Paket Kreator',
  category: 'Digital',
  price: '249000',
  status: 'Aktif',
  desc: 'Template dan aset siap pakai untuk mempercepat produksi konten.',
  featured: true,
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}

function Shell() {
  const { user, login, logout: authLogout } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [menu, setMenu] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('wf-theme')
    if (saved) return saved === 'dark'
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [modal, setModal] = useState(null)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('Umum')
  const [form, setForm] = useState(seedForm)
  const [list, setList] = useState(seedUsers)
  const [toasts, setToasts] = useState([])
  const [confirm, setConfirm] = useState(null)
  const [accent, setAccent] = useState(() => localStorage.getItem('wf-accent') || 'green')
  const [font, setFont] = useState(() => localStorage.getItem('wf-font') || 'dm')
  const [notifs, setNotifs] = useState(seedNotifications)
  const [palette, setPalette] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('wf-theme', dark ? 'dark' : 'light')
  }, [dark])
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent)
    localStorage.setItem('wf-accent', accent)
  }, [accent])
  useEffect(() => {
    document.documentElement.setAttribute('data-font', font)
    localStorage.setItem('wf-font', font)
  }, [font])

  function showToast(msg, type) {
    const id = Date.now() + '' + Math.floor(Math.random() * 1e6)
    setToasts((ts) => ts.concat([{ id, type: type || 'success', msg }]))
    setTimeout(() => {
      setToasts((ts) => ts.filter((x) => x.id !== id))
    }, 3400)
  }
  function dismissToast(id) {
    setToasts((ts) => ts.filter((x) => x.id !== id))
  }

  const toggleTheme = () => setDark((x) => !x)
  const openModal = (u) => setModal(u || {})

  function saveUser(data) {
    const editing = modal && modal.email
    const rec = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      tone: toneForStatus(data.status),
      joined: editing ? modal.joined : 'Hari ini',
    }
    setList((prev) => {
      if (editing) return prev.map((x) => (x.email === modal.email ? rec : x))
      return prev.concat([rec])
    })
    setModal(null)
    showToast(editing ? 'Perubahan pengguna disimpan' : 'Pengguna baru ditambahkan')
  }

  function doDelete() {
    setList((prev) => prev.filter((x) => x.email !== confirm.email))
    setConfirm(null)
    setModal(null)
    showToast('Pengguna dihapus', 'danger')
  }

  function exportData() {
    const rows = ['Nama,Email,Peran,Status']
      .concat(list.map((u) => [u.name, u.email, u.role, u.status].join(',')))
      .join('\n')
    const blob = new Blob([rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'pengguna-demo.csv'
    a.click()
    URL.revokeObjectURL(a.href)
    showToast('CSV contoh berhasil diunduh')
  }

  function logout() {
    authLogout()
    setPage('dashboard')
  }

  function markNotifsRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const paletteActions = [
    { icon: 'sun', label: 'Ubah tema gelap/terang', run: () => toggleTheme() },
    { icon: 'plus', label: 'Tambah pengguna', run: () => openModal() },
    { icon: 'download', label: 'Ekspor data pengguna (CSV)', run: () => exportData() },
    { icon: 'logout', label: 'Keluar', run: () => logout() },
  ]

  // Ctrl+K / Cmd+K membuka command palette
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Auto-logout saat API mengembalikan 401 (sesi berakhir di server)
  useEffect(() => {
    const onUnauthorized = () => {
      authLogout()
      setPage('dashboard')
      showToast('Sesi berakhir, silakan masuk lagi', 'warning')
    }
    window.addEventListener('wf:unauthorized', onUnauthorized)
    return () => window.removeEventListener('wf:unauthorized', onUnauthorized)
  }, [])

  const stack = <ToastStack items={toasts} dismiss={dismissToast} />

  if (!user) {
    return (
      <div className="app">
        <LoginPage
          onLogin={async (email, password) => {
            const u = await login(email, password)
            showToast('Selamat datang kembali, ' + u.name.split(' ')[0])
          }}
        />
        {stack}
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar page={page} go={setPage} open={menu} close={() => setMenu(false)} onLogout={logout} />
      <div className="shell">
        <Topbar
          menu={() => setMenu(true)}
          toggleTheme={toggleTheme}
          onSearchFocus={() => setPalette(true)}
          bell={
            <NotificationBell items={notifs} onOpen={markNotifsRead} onReadAll={markNotifsRead} />
          }
        />
        <main className="content">
          <ErrorBoundary key={page}>
            {page === 'dashboard' && <Dashboard openModal={openModal} />}
            {page === 'users' && (
              <Users
                list={list}
                query={query}
                setQuery={setQuery}
                openModal={openModal}
                editUser={(u) => setModal(u)}
                exportData={exportData}
              />
            )}
            {page === 'roles' && <Roles toast={showToast} />}
            {page === 'audit' && <AuditLog />}
            {page === 'form' && (
              <FormPage
                form={form}
                setForm={setForm}
                reset={() => setForm({ ...emptyForm })}
                preview={() => showToast('Pratinjau diperbarui')}
                toast={showToast}
              />
            )}
            {page === 'settings' && (
              <Settings
                tab={tab}
                setTab={setTab}
                dark={dark}
                toggleTheme={toggleTheme}
                toast={showToast}
                accent={accent}
                setAccent={setAccent}
                font={font}
                setFont={setFont}
              />
            )}
            {page === 'profile' && <Profile />}
            {['dashboard', 'users', 'roles', 'audit', 'form', 'settings', 'profile'].indexOf(page) === -1 && (
              <NotFound go={setPage} />
            )}
          </ErrorBoundary>
        </main>
      </div>
      {modal && (
        <UserModal
          user={modal.email ? modal : null}
          close={() => setModal(null)}
          onSave={saveUser}
          onDelete={(u) => setConfirm(u)}
          toast={showToast}
        />
      )}
      {confirm && <ConfirmModal user={confirm} close={() => setConfirm(null)} onConfirm={doDelete} />}
      <CommandPalette open={palette} close={() => setPalette(false)} go={setPage} actions={paletteActions} />
      {stack}
    </div>
  )
}
