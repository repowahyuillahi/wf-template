import Icon from './Icon.jsx'
import { Button } from './ui.jsx'
import { ROLES, STATUSES } from '../data.js'

function Backdrop({ close, labelledBy, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>
  )
}

export function UserModal({ user, close, onSave, onDelete, toast }) {
  const u = user || {}
  const editing = !!u.email

  function save() {
    const name = document.getElementById('um-name').value.trim()
    const email = document.getElementById('um-email').value.trim()
    if (!name || !email) {
      toast('Nama dan email wajib diisi', 'warning')
      return
    }
    onSave({
      name,
      email,
      role: document.getElementById('um-role').value,
      status: document.getElementById('um-status').value,
    })
  }

  return (
    <Backdrop close={close} labelledBy="modal-title">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h2 id="modal-title">{editing ? 'Edit pengguna' : 'Tambah pengguna'}</h2>
          <p>Data contoh untuk menguji pola dialog.</p>
        </div>
        <button className="icon-btn" onClick={close} aria-label="Tutup">
          <Icon name="x" />
        </button>
      </div>
      <div className="fields">
        <label className="field full">
          <span className="label">Nama lengkap</span>
          <input id="um-name" className="input" defaultValue={u.name || ''} placeholder="Masukkan nama" />
        </label>
        <label className="field full">
          <span className="label">Email</span>
          <input id="um-email" className="input" type="email" defaultValue={u.email || ''} placeholder="nama@perusahaan.id" />
        </label>
        <label className="field">
          <span className="label">Peran</span>
          <select id="um-role" className="select" defaultValue={u.role || 'Editor'}>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="label">Status</span>
          <select id="um-status" className="select" defaultValue={u.status || 'Aktif'}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="modal-actions">
        {editing && (
          <Button variant="danger" onClick={() => onDelete(u)}>
            Hapus
          </Button>
        )}
        <Button onClick={close}>Batal</Button>
        <Button variant="primary" onClick={save}>
          {editing ? 'Terapkan' : 'Tambahkan'}
        </Button>
      </div>
    </Backdrop>
  )
}

export function ConfirmModal({ user, close, onConfirm }) {
  return (
    <Backdrop close={close} labelledBy="confirm-title">
      <h2 id="confirm-title">Hapus pengguna?</h2>
      <p>
        {user.name} ({user.email}) akan dihapus dari daftar untuk sesi ini.
      </p>
      <div className="modal-actions">
        <Button onClick={close}>Batal</Button>
        <Button variant="danger" onClick={onConfirm}>
          Hapus
        </Button>
      </div>
    </Backdrop>
  )
}
