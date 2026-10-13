import { useState, useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import { nav } from '../data.js'

/**
 * Command palette (Ctrl+K / Cmd+K) — navigasi cepat antar halaman + aksi global.
 * Props: open, close, go(pageKey), actions [{icon, label, run}].
 */
export default function CommandPalette({ open, close, go, actions = [] }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)

  const pages = nav.map((n) => ({ type: 'page', icon: n[0], label: n[1], key: n[2] }))
  const acts = actions.map((a) => ({ type: 'action', ...a }))
  const query = q.toLowerCase()
  const items = [...pages, ...acts].filter((i) => i.label.toLowerCase().includes(query)).slice(0, 9)

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30)
    }
  }, [open ])

  useEffect(() => setIdx(0), [q])

  function run(item) {
    if (!item) return
    if (item.type === 'page') go(item.key)
    else item.run()
    close()
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      run(items[idx])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  if (!open) return null

  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="palette card" role="dialog" aria-label="Pencarian perintah">
        <div className="palette-input">
          <Icon name="search" />
          <input
            ref={inputRef}
            placeholder="Ketik perintah atau cari halaman…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
          />
          <kbd>esc</kbd>
        </div>
        <div className="palette-list">
          {items.length === 0 && <div className="empty">Tidak ada hasil untuk “{q}”.</div>}
          {items.map((item, i) => (
            <button
              key={item.label}
              className={'palette-item' + (i === idx ? ' active' : '')}
              onMouseEnter={() => setIdx(i)}
              onClick={() => run(item)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              <span className="palette-kind">{item.type === 'page' ? 'Halaman' : 'Aksi'}</span>
            </button>
          ))}
        </div>
        <div className="palette-foot">
          <span>
            <kbd>↑↓</kbd> navigasi
          </span>
          <span>
            <kbd>↵</kbd> jalankan
          </span>
        </div>
      </div>
    </div>
  )
}
