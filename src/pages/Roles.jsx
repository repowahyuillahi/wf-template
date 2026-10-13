import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Avatar } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { PERMS, ROLE_DEFS } from '../data.js'

export default function Roles({ toast }) {
  const [matrix, setMatrix] = useState(ROLE_DEFS)

  function toggle(ri, pi) {
    setMatrix((prev) =>
      prev.map((r, i) => {
        if (i !== ri) return r
        const perms = r.perms.slice()
        perms[pi] = perms[pi] ? 0 : 1
        return { ...r, perms }
      })
    )
    toast('Hak akses diperbarui untuk sesi ini', 'info')
  }

  return (
    <>
      <PageHead title="Peran & hak akses" desc="Atur izin tiap peran terhadap menu dan fitur.">
        <Button variant="primary" icon="plus" onClick={() => toast('Fitur tambah peran: contoh visual', 'info')}>
          Tambah peran
        </Button>
      </PageHead>
      <div className="card table-card">
        <div className="table-wrap">
          <table className="data-table role-matrix">
            <thead>
              <tr>
                <th>Peran</th>
                {PERMS.map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((r, ri) => (
                <tr key={r.name}>
                  <td data-label="Peran">
                    <div className="user-cell">
                      <Avatar label={r.name[0]} style={{ background: 'var(--info)' }} />
                      <div>
                        <strong>{r.name}</strong>
                        <span>
                          {r.desc} · {r.users} pengguna
                        </span>
                      </div>
                    </div>
                  </td>
                  {r.perms.map((on, pi) => (
                    <td data-label={PERMS[pi]} key={pi}>
                      <button
                        className={'perm-check ' + (on ? 'on' : '')}
                        onClick={() => toggle(ri, pi)}
                        aria-label={(on ? 'Cabut' : 'Beri') + ' akses ' + PERMS[pi] + ' untuk ' + r.name}
                      >
                        <Icon name="check" />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Perubahan hanya berlaku selama halaman terbuka. Matriks ini siap disambungkan ke API peran backend.</span>
        </div>
      </div>
    </>
  )
}
