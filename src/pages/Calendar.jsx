import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { seedEvents } from '../data.js'

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function keyOf(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Calendar({ toast }) {
  const today = new Date()
  const [ym, setYm] = useState({ y: 2026, m: 9 })
  const [events, setEvents] = useState(seedEvents)
  const [sel, setSel] = useState('2026-10-16')
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('09:00')

  const { y, m } = ym
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)

  const byDate = {}
  events.forEach((e) => {
    byDate[e.date] = byDate[e.date] || []
    byDate[e.date].push(e)
  })
  const selEvents = (byDate[sel] || []).slice().sort((a, b) => a.time.localeCompare(b.time))
  const isToday = (d) => y === today.getFullYear() && m === today.getMonth() && d === today.getDate()

  function addEvent(ev) {
    ev.preventDefault()
    if (!title.trim()) return
    setEvents((prev) => prev.concat([{ id: Date.now(), date: sel, title: title.trim(), time }]))
    setTitle('')
    toast('Agenda ditambahkan ke ' + sel)
  }

  return (
    <>
      <PageHead title="Kalender" desc="Jadwal dan agenda kegiatan.">
        <Button icon="plus" variant="primary" onClick={() => document.getElementById('ev-title')?.focus()}>
          Tambah agenda
        </Button>
      </PageHead>
      <div className="cal-layout">
        <section className="card cal-card">
          <div className="cal-nav">
            <button className="icon-btn" aria-label="Bulan lalu" onClick={() => setYm(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}>
              <span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}>
                <Icon name="chev" />
              </span>
            </button>
            <strong>{MONTHS[m]} {y}</strong>
            <button className="icon-btn" aria-label="Bulan depan" onClick={() => setYm(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}>
              <Icon name="chev" />
            </button>
          </div>
          <div className="cal-grid cal-head">
            {DAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="cal-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={'e' + i} className="cal-day empty" />
              const k = keyOf(y, m, d)
              const n = (byDate[k] || []).length
              return (
                <button
                  key={k}
                  className={'cal-day' + (isToday(d) ? ' today' : '') + (sel === k ? ' sel' : '')}
                  onClick={() => setSel(k)}
                >
                  <span>{d}</span>
                  {n > 0 && <span className="cal-dots">{Array.from({ length: Math.min(n, 3) }).map((_, j) => <i key={j} />)}</span>}
                </button>
              )
            })}
          </div>
        </section>
        <aside className="card agenda">
          <div className="card-head">
            <div><h2>Agenda</h2><p>{sel}</p></div>
            <Badge tone={selEvents.length ? 'info' : ''}>{selEvents.length} acara</Badge>
          </div>
          <div className="agenda-list">
            {selEvents.length === 0 && <div className="empty">Belum ada agenda di tanggal ini.</div>}
            {selEvents.map((e) => (
              <div key={e.id} className="agenda-item">
                <span className="agenda-time">{e.time}</span>
                <div><strong>{e.title}</strong></div>
                <button
                  className="icon-btn btn-sm" aria-label="Hapus agenda"
                  onClick={() => {
                    setEvents((prev) => prev.filter((x) => x.id !== e.id))
                    toast('Agenda dihapus', 'warning')
                  }}
                >
                  <Icon name="trash" />
                </button>
              </div>
            ))}
          </div>
          <form className="agenda-form" onSubmit={addEvent}>
            <input id="ev-title" className="input" placeholder="Judul agenda…" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ maxWidth: 120 }} />
            <Button type="submit" variant="primary" small>Tambah</Button>
          </form>
        </aside>
      </div>
    </>
  )
}
