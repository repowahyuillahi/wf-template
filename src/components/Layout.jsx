import Icon from './Icon.jsx'
import { Avatar, Badge, SearchBox } from './ui.jsx'
import { nav } from '../data.js'

export function Sidebar({ page, go, open, close, onLogout }) {
  return (
    <>
      <div className={'mobile-overlay ' + (open ? 'show' : '')} onClick={close} />
      <aside className={'sidebar ' + (open ? 'open' : '')}>
        <div className="sidebar-head">
          <div className="workspace">
            Ruang kerja<small>Admin utama</small>
          </div>
          <Badge tone="success">Pro</Badge>
        </div>
        <div className="nav-label">Utama</div>
        <nav className="nav">
          {nav.slice(0, 4).map((n) => (
            <button
              key={n[2]}
              className={'nav-btn ' + (page === n[2] ? 'active' : '')}
              onClick={() => {
                go(n[2])
                close()
              }}
            >
              <Icon name={n[0]} />
              {n[1]}
              {n[2] === 'users' && <span className="nav-count">128</span>}
            </button>
          ))}
        </nav>
        <div className="nav-label">Akun</div>
        <nav className="nav">
          {nav.slice(4).map((n) => (
            <button
              key={n[2]}
              className={'nav-btn ' + (page === n[2] ? 'active' : '')}
              onClick={() => {
                go(n[2])
                close()
              }}
            >
              <Icon name={n[0]} />
              {n[1]}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="profile-mini">
            <Avatar label="WP" />
            <div>
              <strong>Wahyu Pratama</strong>
              <span>Administrator</span>
            </div>
          </div>
          <button className="logout-row" onClick={onLogout}>
            <Icon name="logout" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}

export function Topbar({ menu, toggleTheme }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={menu} aria-label="Buka menu">
        <Icon name="menu" />
      </button>
      <SearchBox placeholder="Cari halaman, data, atau perintah…" />
      <div className="top-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Ubah tema">
          <Icon name="sun" />
        </button>
        <button className="icon-btn" aria-label="Notifikasi">
          <Icon name="bell" />
        </button>
        <Avatar label="WP" />
      </div>
    </header>
  )
}

export function PageHead({ title, desc, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children && <div className="head-actions">{children}</div>}
    </div>
  )
}
