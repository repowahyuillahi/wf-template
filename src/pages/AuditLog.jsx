import { useState } from 'react'
import { Badge, SearchBox } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { seedAudit } from '../data.js'

/**
 * Jejak audit — siapa melakukan apa, kapan, terhadap objek apa.
 * Sambungkan ke GET /api/audit-log untuk data live.
 */
export default function AuditLog() {
  const [query, setQuery] = useState('')
  const q = query.toLowerCase()
  const rows = seedAudit.filter((r) =>
    (r.user + ' ' + r.action + ' ' + r.object + ' ' + r.detail).toLowerCase().includes(q)
  )

  return (
    <>
      <PageHead title="Audit log" desc="Jejak aktivitas penting di seluruh ruang kerja." />
      <div className="card table-card">
        <div className="table-tools">
          <SearchBox placeholder="Cari aktivitas…" value={query} onChange={setQuery} />
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {['Waktu', 'Pengguna', 'Aksi', 'Objek', 'Detail'].map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td data-label="Waktu" style={{ whiteSpace: 'nowrap' }}>
                    {r.time}
                  </td>
                  <td data-label="Pengguna">{r.user}</td>
                  <td data-label="Aksi">
                    <Badge tone={r.tone}>{r.action}</Badge>
                  </td>
                  <td data-label="Objek">{r.object}</td>
                  <td data-label="Detail">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>
            Menampilkan {rows.length} dari {seedAudit.length} aktivitas
          </span>
        </div>
      </div>
    </>
  )
}
