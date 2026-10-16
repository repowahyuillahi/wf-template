import { useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { seedFiles, FILE_ICON } from '../data.js'

export default function Files({ toast }) {
  const [files, setFiles] = useState(seedFiles)
  const [dir, setDir] = useState(null)
  const [q, setQ] = useState('')
  const inputRef = useRef(null)

  const crumbs = dir ? [files.find((f) => f.id === dir)] : []
  const shown = files.filter(
    (f) =>
      f.parent === dir &&
      f.name.toLowerCase().includes(q.toLowerCase())
  )

  function fmtSize(bytes) {
    if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
    if (bytes > 1024) return Math.round(bytes / 1024) + ' KB'
    return bytes + ' B'
  }

  function upload(ev) {
    const picked = Array.from(ev.target.files || [])
    if (!picked.length) return
    const now = new Date()
    const stamp = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const ext = (n) => (n.split('.').pop() || '').toLowerCase()
    const typeOf = (n) => {
      const e = ext(n)
      if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(e)) return 'image'
      if (e === 'pdf') return 'pdf'
      if (e === 'zip') return 'zip'
      return 'doc'
    }
    setFiles((prev) =>
      prev.concat(
        picked.map((f, i) => ({
          id: Date.now() + i, name: f.name, type: typeOf(f.name),
          size: fmtSize(f.size), modified: stamp, parent: dir,
        }))
      )
    )
    toast(picked.length + ' file diunggah (simulasi)')
    ev.target.value = ''
  }

  function remove(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id && f.parent !== id))
    toast('Dihapus', 'warning')
  }

  return (
    <>
      <PageHead title="File" desc="Kelola dokumen, gambar, dan arsip.">
        <Button icon="upload" variant="primary" onClick={() => inputRef.current?.click()}>
          Unggah
        </Button>
        <input ref={inputRef} type="file" multiple hidden onChange={upload} />
      </PageHead>
      <div className="crumbs-bar card">
        <button className={'crumb' + (dir === null ? ' cur' : '')} onClick={() => setDir(null)}>
          Semua file
        </button>
        {crumbs.map((c) => (
          <span key={c.id}>
            <span className="crumb-sep">/</span>
            <span className="crumb cur">{c?.name}</span>
          </span>
        ))}
        <div className="search" style={{ marginLeft: 'auto', maxWidth: 280 }}>
          <Icon name="search" />
          <input className="input" placeholder="Cari file…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="file-grid">
        {shown.length === 0 && <div className="empty card" style={{ gridColumn: '1/-1' }}>Folder kosong atau tidak ada yang cocok.</div>}
        {shown.map((f) =>
          f.type === 'folder' ? (
            <button key={f.id} className="card file-card folder" onClick={() => setDir(f.id)}>
              <span className="file-ic"><Icon name="folder" /></span>
              <strong>{f.name}</strong>
              <span>{f.items ?? files.filter((x) => x.parent === f.id).length} item · {f.modified}</span>
            </button>
          ) : (
            <div key={f.id} className="card file-card">
              <span className="file-ic"><Icon name={FILE_ICON[f.type] || 'file'} /></span>
              <strong>{f.name}</strong>
              <span>{f.size} · {f.modified}</span>
              <button className="icon-btn btn-sm file-x" aria-label={'Hapus ' + f.name} onClick={() => remove(f.id)}>
                <Icon name="trash" />
              </button>
            </div>
          )
        )}
      </div>
      <section className="card storage">
        <div className="storage-top"><strong>Penyimpanan</strong><span>184 MB dari 1 GB</span></div>
        <div className="storage-bar"><i style={{ width: '18%' }} /></div>
      </section>
    </>
  )
}
