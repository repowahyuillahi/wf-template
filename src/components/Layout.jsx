import { Fragment } from 'react'
import Icon from './Icon.jsx'
import { Avatar, Badge, initials } from './ui.jsx'
import { navGroups } from '../data.js'

const LOGO = import.meta.env.BASE_URL + 'logo.svg'

export function Sidebar({ page, go, open, close, onLogout, user }) {
  const name = user?.name || 'Wahyu Illahi'
  const role = user?.role || 'Administrator'
  return (
    <>
      <div className={'mobile-overlay ' + (open ? 'show' : '')} onClick={close} />
      <aside className={'sidebar ' + (open ? 'open' : '')}>
        <div className="sidebar-head">
          <div className="brand">
            <img src={LOGO} alt="WF" className="brand-logo" />
            <div className="workspace">
              WF Template<small>Design system</small>
            </div>
          </div>
          <Badge tone="success">Pro</Badge>
        </div>
        {navGroups.map((g) => (
          <Fragment key={g.label}>
            <div className="nav-label">{g.label}</div>
            <nav className="nav">
              {g.items.map((n) => (
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
          </Fragment>
        ))}
        <div className="sidebar-foot">
          <div className="profile-mini">
            <Avatar label={initials(name)} />
            <div>
              <strong>{name}</strong>
              <span>{role}</span>
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

export function Topbar({ menu, toggleTheme, bell, onSearchFocus, user }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={menu} aria-label="Buka menu">
        <Icon name="menu" />
      </button>
      <div className="search" onClick={onSearchFocus}>
        <Icon name="search" />
        <input className="input" placeholder="Cari halaman, data, atau perintah…" readOnly={!!onSearchFocus} onFocus={onSearchFocus} />
      </div>
      <div className="top-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Ubah tema">
          <Icon name="sun" />
        </button>
        {bell}
        <Avatar label={initials(user?.name || 'Wahyu Illahi')} />
      </div>
    </header>
  )
}

export function PageHead({ title, desc, children }) {
  return (
    <div className="page-head">
      <div>
        <nav className="crumbs" aria-label="Breadcrumb">
          <span>Beranda</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{title}</span>
        </nav>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children && <div className="head-actions">{children}</div>}
    </div>
  )
}
