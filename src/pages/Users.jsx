import Icon from '../components/Icon.jsx'
import { Button, Badge, Avatar, SearchBox } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'

function initials(name) {
  return name
    .split(' ')
    .map((x) => x[0])
    .join('')
}

export default function Users({ list, query, setQuery, openModal, editUser, exportData }) {
  const q = query.toLowerCase()
  const filtered = list.filter((u) =>
    (u.name + ' ' + u.email + ' ' + u.role + ' ' + u.status).toLowerCase().includes(q)
  )

  return (
    <>
      <PageHead title="Daftar pengguna" desc="Cari, tinjau, dan kelola akses anggota tim.">
        <Button icon="download" onClick={exportData}>
          Ekspor
        </Button>
        <Button variant="primary" icon="plus" onClick={() => openModal()}>
          Tambah pengguna
        </Button>
      </PageHead>
      <div className="card table-card">
        <div className="table-tools">
          <SearchBox placeholder="Cari pengguna…" value={query} onChange={setQuery} />
          <select className="select" style={{ width: 'auto' }}>
            <option>Semua peran</option>
            <option>Admin</option>
            <option>Editor</option>
            <option>Analis</option>
          </select>
        </div>
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {['Pengguna', 'Peran', 'Status', 'Bergabung', 'Aksi'].map((x) => (
                    <th key={x}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.email}>
                    <td data-label="Pengguna">
                      <div className="user-cell">
                        <Avatar label={initials(u.name)} />
                        <div>
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Peran">{u.role}</td>
                    <td data-label="Status">
                      <Badge tone={u.tone}>{u.status}</Badge>
                    </td>
                    <td data-label="Bergabung">{u.joined}</td>
                    <td data-label="Aksi">
                      <Button small onClick={() => editUser(u)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">Tidak ada pengguna yang cocok.</div>
        )}
        <div className="pagination">
          <span>
            Menampilkan {filtered.length} dari {list.length} pengguna
          </span>
          <div className="pagination-actions">
            {[1, 2, 3].map((n) => (
              <button key={n} className={'page-btn ' + (n === 1 ? 'active' : '')}>
                {n}
              </button>
            ))}
            <button className="page-btn">›</button>
          </div>
        </div>
      </div>
    </>
  )
}
