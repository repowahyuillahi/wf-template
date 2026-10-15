import Icon from './Icon.jsx'

export function Button({ variant, small, icon, type = 'button', onClick, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={'btn ' + (variant ? 'btn-' + variant : '') + ' ' + (small ? 'btn-sm' : '')}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}

export function Badge({ tone, children }) {
  return <span className={'badge ' + (tone ? 'badge-' + tone : '')}>{children}</span>
}

export function Avatar({ label, style }) {
  return (
    <div className="avatar" style={style}>
      {label}
    </div>
  )
}

// Inisial dari nama lengkap, mis. "Wahyu Illahi" -> "WI"
export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/)
  if (!parts[0]) return '?'
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
}

export function SearchBox({ placeholder = 'Cari…', value = '', onChange }) {
  return (
    <div className="search">
      <Icon name="search" />
      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  )
}

export function Switch({ on, onClick, label }) {
  return (
    <button
      className={'switch ' + (on ? 'on' : '')}
      role="switch"
      aria-checked={on}
      aria-label={label || 'Ubah pengaturan'}
      onClick={onClick}
    />
  )
}
