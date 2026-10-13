import Icon from './Icon.jsx'

const toastIcon = {
  success: 'check',
  danger: 'trash',
  warning: 'bell',
  info: 'info',
}

export default function ToastStack({ items, dismiss }) {
  if (!items.length) return null
  return (
    <div className="toast-stack">
      {items.map((t) => (
        <div key={t.id} className={'toast toast-' + t.type} role="status">
          <Icon name={toastIcon[t.type] || 'info'} />
          <span>{t.msg}</span>
          <button
            className="toast-x"
            onClick={() => dismiss(t.id)}
            aria-label="Tutup notifikasi"
          >
            <Icon name="x" />
          </button>
        </div>
      ))}
    </div>
  )
}
