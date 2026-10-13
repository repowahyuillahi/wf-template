import { useState, useRef, useEffect } from 'react'
import Icon from './Icon.jsx'

/** Input tanggal native yang sudah mengikuti gaya design system. */
export function DateField({ label, value, onChange, hint }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <input type="date" className="input" value={value || ''} onChange={(e) => onChange && onChange(e.target.value)} />
      {hint && <span className="hint">{hint}</span>}
    </label>
  )
}

/** Zona unggah file: klik atau drag & drop, menampilkan daftar file terpilih. */
export function FileUpload({ label, hint, accept, multiple, onFiles }) {
  const [drag, setDrag] = useState(false)
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)

  function add(list) {
    const next = files.concat(Array.from(list))
    setFiles(next)
    onFiles && onFiles(next)
  }
  function remove(i) {
    const next = files.filter((_, x) => x !== i)
    setFiles(next)
    onFiles && onFiles(next)
  }

  return (
    <div className="field">
      <span className="label">{label}</span>
      <div
        className={'dropzone' + (drag ? ' drag' : '')}
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          add(e.dataTransfer.files)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current && inputRef.current.click()}
      >
        <Icon name="download" />
        <p>
          <strong>Klik untuk memilih</strong> atau seret file ke sini
        </p>
        {hint && <span className="hint">{hint}</span>}
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            add(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
      {files.length > 0 && (
        <div className="file-list">
          {files.map((f, i) => (
            <div key={i} className="file-item">
              <Icon name="form" />
              <span>
                {f.name} <em>({(f.size / 1024).toFixed(1)} KB)</em>
              </span>
              <button className="toast-x" onClick={() => remove(i)} aria-label={'Hapus ' + f.name}>
                <Icon name="x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Select dengan pencarian — untuk daftar opsi yang panjang. */
export function SearchableSelect({ label, options, value, onChange, placeholder = 'Pilih…', hint }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const boxRef = useRef(null)

  useEffect(() => {
    if (open) setQ('')
  }, [open ])

  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="field" ref={boxRef}>
      <span className="label">{label}</span>
      <div className="sselect">
        <button type="button" className="input sselect-btn" onClick={() => setOpen((o) => !o)}>
          <span className={value ? '' : 'placeholder'}>{value || placeholder}</span>
          <Icon name="chev" />
        </button>
        {open && (
          <>
            <div className="sselect-backdrop" onClick={() => setOpen(false)} />
            <div className="sselect-panel card">
              <div className="sselect-search">
                <Icon name="search" />
                <input autoFocus placeholder="Cari opsi…" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="sselect-list">
                {filtered.length === 0 && <div className="empty">Tidak ada opsi yang cocok.</div>}
                {filtered.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={'sselect-item' + (o === value ? ' active' : '')}
                    onClick={() => {
                      onChange && onChange(o)
                      setOpen(false)
                    }}
                  >
                    {o}
                    {o === value && <Icon name="check" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}
