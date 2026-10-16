import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge, Avatar } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { seedTasks, TASK_COLS } from '../data.js'

const ORDER = TASK_COLS.map(([k]) => k)

export default function Tasks({ toast }) {
  const [cols, setCols] = useState(seedTasks)
  const [draft, setDraft] = useState('')
  const [draftCol, setDraftCol] = useState('todo')

  const total = ORDER.reduce((n, k) => n + cols[k].length, 0)
  const done = cols.done.length

  function move(id, dir) {
    setCols((prev) => {
      const next = { todo: [...prev.todo], doing: [...prev.doing], done: [...prev.done] }
      const fromIdx = ORDER.findIndex((k) => next[k].some((t) => t.id === id))
      if (fromIdx === -1) return prev
      const toIdx = fromIdx + dir
      if (toIdx < 0 || toIdx >= ORDER.length) return prev
      const i = next[ORDER[fromIdx]].findIndex((t) => t.id === id)
      const [t] = next[ORDER[fromIdx]].splice(i, 1)
      next[ORDER[toIdx]].push(t)
      return next
    })
  }

  function remove(id) {
    setCols((prev) => {
      const next = {}
      ORDER.forEach((k) => { next[k] = prev[k].filter((t) => t.id !== id) })
      return next
    })
    toast('Tugas dihapus', 'warning')
  }

  function add(ev) {
    ev.preventDefault()
    if (!draft.trim()) return
    const t = { id: Date.now(), title: draft.trim(), tag: 'Baru', tone: 'info', who: 'WI' }
    setCols((prev) => ({ ...prev, [draftCol]: [...prev[draftCol], t] }))
    setDraft('')
    toast('Tugas ditambahkan')
  }

  return (
    <>
      <PageHead
        title="Tugas"
        desc={`${done} dari ${total} tugas selesai (${total ? Math.round((done / total) * 100) : 0}%).`}
      >
        <form className="task-add" onSubmit={add}>
          <input className="input" placeholder="Tugas baru…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <select className="select" value={draftCol} onChange={(e) => setDraftCol(e.target.value)} style={{ maxWidth: 130 }}>
            {TASK_COLS.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
          <Button type="submit" variant="primary" icon="plus">Tambah</Button>
        </form>
      </PageHead>
      <div className="kanban">
        {TASK_COLS.map(([k, label]) => (
          <section key={k} className="card kanban-col">
            <div className="card-head">
              <h2>{label}</h2>
              <Badge tone={k === 'done' ? 'success' : k === 'doing' ? 'info' : ''}>{cols[k].length}</Badge>
            </div>
            <div className="kanban-list">
              {cols[k].length === 0 && <div className="empty">Kosong.</div>}
              {cols[k].map((t) => (
                <article key={t.id} className="task-card">
                  <div className="task-top">
                    <Badge tone={t.tone}>{t.tag}</Badge>
                    <button className="icon-btn btn-sm task-x" aria-label="Hapus tugas" onClick={() => remove(t.id)}>
                      <Icon name="x" />
                    </button>
                  </div>
                  <p>{t.title}</p>
                  <div className="task-foot">
                    <Avatar label={t.who} style={{ width: 26, height: 26, fontSize: 10 }} />
                    <span className="task-move">
                      <button className="icon-btn btn-sm" aria-label="Geser kiri" disabled={k === ORDER[0]} onClick={() => move(t.id, -1)}>
                        <span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><Icon name="chev" /></span>
                      </button>
                      <button className="icon-btn btn-sm" aria-label="Geser kanan" disabled={k === ORDER[ORDER.length - 1]} onClick={() => move(t.id, 1)}>
                        <Icon name="chev" />
                      </button>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
