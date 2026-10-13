import { useState, useEffect } from 'react'
import { Sidebar, Topbar } from './components/Layout.jsx'
import ToastStack from './components/Toast.jsx'
import { UserModal, ConfirmModal } from './components/Modal.jsx'
import LoginPage from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Users from './pages/Users.jsx'
import Roles from './pages/Roles.jsx'
import FormPage, { emptyForm } from './pages/FormPage.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import { seedUsers, toneForStatus } from './data.js'

const seedForm = {
  name: 'Paket Kreator',
  category: 'Digital',
  price: '249000',
  status: 'Aktif',
  desc: 'Template dan aset siap pakai untuk mempercepat produksi konten.',
  featured: true,
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [menu, setMenu] = useState(false)
  const [dark, setDark] = useState(false)
  const [modal, setModal] = useState(null)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('Umum')
  const [form, setForm] = useState(seedForm)
  const [list, setList] = useState(seedUsers)
  const [toasts, setToasts] = useState([])
  const [auth, setAuth] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    const m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(m)
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

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
    setAuth(null)
    setPage('dashboard')
  }

  const stack = <ToastStack items={toasts} dismiss={dismissToast} />

  if (!auth) {
    return (
      <div className="app">
        <LoginPage
          onLogin={(u) => {
            setAuth(u)
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
        <Topbar menu={() => setMenu(true)} toggleTheme={toggleTheme} />
        <main className="content">
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
          {page === 'form' && (
            <FormPage
              form={form}
              setForm={setForm}
              reset={() => setForm({ ...emptyForm })}
              preview={() => showToast('Pratinjau diperbarui')}
            />
          )}
          {page === 'settings' && (
            <Settings tab={tab} setTab={setTab} dark={dark} toggleTheme={toggleTheme} toast={showToast} />
          )}
          {page === 'profile' && <Profile />}
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
      {stack}
    </div>
  )
}
