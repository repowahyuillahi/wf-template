import React from 'react'
import Icon from './Icon.jsx'

/**
 * Menangkap error render di dalamnya agar aplikasi tidak blank putih.
 * Bungkus <main> atau halaman dengan komponen ini.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Kirim ke layanan monitoring (mis. Sentry) di aplikasi nyata.
    console.error('ErrorBoundary menangkap:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-page">
          <div className="error-icon">
            <Icon name="info" />
          </div>
          <h1>Terjadi kesalahan</h1>
          <p>Maaf, ada yang tidak beres saat menampilkan halaman ini.</p>
          <code className="error-msg">{String(this.state.error.message || this.state.error)}</code>
          <div className="head-actions" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={() => this.setState({ error: null })}>
              Coba lagi
            </button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Muat ulang
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
