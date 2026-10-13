import Icon from '../components/Icon.jsx'

export default function NotFound({ go }) {
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang Anda tuju tidak ada atau sudah dipindahkan.</p>
      <div className="head-actions" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => go('dashboard')}>
          <Icon name="dashboard" />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}
