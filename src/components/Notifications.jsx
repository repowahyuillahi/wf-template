import { useState } from 'react'
import Icon from './Icon.jsx'

/**
 * Pusat notifikasi — dropdown dari ikon lonceng di topbar.
 * Props: items [{id, icon, title, desc, time, unread}], onOpen (dipanggil saat
 * dibuka — biasanya untuk menandai dibaca), onReadAll.
 * Sambungkan ke notificationsApi di src/api.js untuk data live.
 */
export default function NotificationBell({ items, onOpen, onReadAll }) {
  const [open, setOpen] = useState(false)
  const unread = items.filter((i) => i.unread).length

  function toggle() {
    const next = !open
    setOpen(next)
    if (next && onOpen) onOpen()
  }

  return (
    <div className="notif-wrap">
      <button className="icon-btn notif-btn" aria-label="Notifikasi" onClick={toggle}>
        <Icon name="bell" />
        {unread > 0 && <span className="notif-dot">{unread}</span>}
      </button>
      {open && (
        <>
          <div className="notif-backdrop" onClick={() => setOpen(false)} />
          <div className="notif-panel card" role="dialog" aria-label="Daftar notifikasi">
            <div className="notif-head">
              <strong>Notifikasi</strong>
              <button
                className="link-btn"
                onClick={() => {
                  onReadAll && onReadAll()
                }}
              >
                Tandai semua dibaca
              </button>
            </div>
            <div className="notif-list">
              {items.length === 0 && <div className="empty">Belum ada notifikasi.</div>}
              {items.map((n) => (
                <div key={n.id} className={'notif-item' + (n.unread ? ' unread' : '')}>
                  <div className="activity-icon">
                    <Icon name={n.icon} />
                  </div>
                  <div>
                    <p>{n.title}</p>
                    <span>
                      {n.desc} · {n.time}
                    </span>
                  </div>
                  {n.unread && <span className="unread-dot" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
