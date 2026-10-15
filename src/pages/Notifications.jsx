import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'

const TABS = [
  ['semua', 'Semua'],
  ['belum', 'Belum dibaca'],
  ['sudah', 'Sudah dibaca'],
]

export default function Notifications({ items, onReadAll, onReadOne }) {
  const [tab, setTab] = useState('semua')
  const unread = items.filter((n) => n.unread).length
  const list = items.filter((n) =>
    tab === 'semua' ? true : tab === 'belum' ? n.unread : !n.unread
  )
  return (
    <>
      <PageHead
        title="Notifikasi"
        desc={unread > 0 ? `${unread} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
      >
        <Button icon="check" onClick={onReadAll}>
          Tandai semua dibaca
        </Button>
      </PageHead>
      <div className="tabs">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            className={'tab ' + (tab === k ? 'active' : '')}
            onClick={() => setTab(k)}
          >
            {label}
            {k === 'belum' && unread > 0 && <span className="nav-count">{unread}</span>}
          </button>
        ))}
      </div>
      <div className="card notif-list">
        {list.length === 0 && <div className="empty">Tidak ada notifikasi di tab ini.</div>}
        {list.map((n) => (
          <button
            key={n.id}
            className={'notif-row' + (n.unread ? ' unread' : '')}
            onClick={() => onReadOne(n.id)}
          >
            <span className="activity-icon">
              <Icon name={n.icon} />
            </span>
            <span className="notif-text">
              <strong>{n.title}</strong>
              <span>{n.desc}</span>
            </span>
            <span className="notif-time">{n.time}</span>
            {n.unread && <span className="dot-unread" aria-label="Belum dibaca" />}
          </button>
        ))}
      </div>
    </>
  )
}
