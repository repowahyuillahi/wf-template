import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge, Avatar, initials } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { seedMessages } from '../data.js'

export default function Messages({ toast }) {
  const [list, setList] = useState(seedMessages)
  const [openId, setOpenId] = useState(seedMessages[0].id)
  const [q, setQ] = useState('')
  const [compose, setCompose] = useState(false)
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const unread = list.filter((m) => m.unread).length
  const filtered = list.filter(
    (m) =>
      m.from.toLowerCase().includes(q.toLowerCase()) ||
      m.subject.toLowerCase().includes(q.toLowerCase())
  )
  const open = list.find((m) => m.id === openId)

  function read(id) {
    setOpenId(id)
    setList((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)))
  }

  function send(ev) {
    ev.preventDefault()
    if (!to.trim() || !subject.trim()) {
      toast('Isi penerima dan subjek dulu', 'warning')
      return
    }
    setList((prev) => [
      { id: Date.now(), from: to.trim(), email: '', subject: subject.trim(), body: body.trim() || '(tanpa isi)', time: 'baru saja', unread: false },
      ...prev,
    ])
    setCompose(false); setTo(''); setSubject(''); setBody('')
    toast('Pesan terkirim')
  }

  return (
    <>
      <PageHead title="Pesan" desc={unread ? `${unread} pesan belum dibaca` : 'Kotak masuk rapi, semua terbaca.'}>
        <Button icon="plus" variant="primary" onClick={() => setCompose((c) => !c)}>
          Tulis pesan
        </Button>
      </PageHead>
      {compose && (
        <section className="card compose">
          <h2 className="section-title">Pesan baru</h2>
          <form onSubmit={send}>
            <div className="fields" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <label className="field"><span className="label">Kepada</span>
                <input className="input" placeholder="nama@email.id" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
              <label className="field"><span className="label">Subjek</span>
                <input className="input" placeholder="Subjek pesan" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </label>
              <label className="field full"><span className="label">Isi</span>
                <textarea className="textarea" placeholder="Tulis pesan…" value={body} onChange={(e) => setBody(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <Button onClick={() => setCompose(false)}>Batal</Button>
              <Button type="submit" variant="primary" icon="send">Kirim</Button>
            </div>
          </form>
        </section>
      )}
      <div className="msg-layout">
        <section className="card msg-list">
          <div className="table-tools">
            <div className="search" style={{ maxWidth: 'none', flex: 1 }}>
              <Icon name="search" />
              <input className="input" placeholder="Cari pesan…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          {filtered.length === 0 && <div className="empty">Tidak ada pesan cocok.</div>}
          {filtered.map((m) => (
            <button key={m.id} className={'msg-item' + (m.unread ? ' unread' : '') + (m.id === openId ? ' sel' : '')} onClick={() => read(m.id)}>
              <Avatar label={initials(m.from)} />
              <span className="msg-meta">
                <strong>{m.from} {m.unread && <span className="dot-unread sm" />}</strong>
                <span className="msg-subj">{m.subject}</span>
                <span className="msg-snip">{m.body.split('\n')[0].slice(0, 60)}</span>
              </span>
              <span className="msg-time">{m.time}</span>
            </button>
          ))}
        </section>
        <section className="card msg-pane">
          {!open ? (
            <div className="empty">Pilih pesan untuk dibaca.</div>
          ) : (
            <>
              <div className="msg-pane-head">
                <h2>{open.subject}</h2>
                <div className="msg-from">
                  <Avatar label={initials(open.from)} />
                  <div>
                    <strong>{open.from}</strong>
                    <span>{open.email || 'pesan keluar'} · {open.time}</span>
                  </div>
                </div>
              </div>
              <div className="msg-body">
                {open.body.split('\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="msg-actions">
                <Button small icon="arrow">Balas</Button>
                <Button
                  small
                  onClick={() => {
                    setList((prev) => prev.filter((m) => m.id !== open.id))
                    setOpenId(null)
                    toast('Pesan dihapus', 'danger')
                  }}
                >
                  Hapus
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}
