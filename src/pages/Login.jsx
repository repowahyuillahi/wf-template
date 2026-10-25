import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { DEMO_EMAIL, DEMO_PASS } from '../data.js'
import { API_BASE_URL } from '../api.js'

const LOGO = import.meta.env.BASE_URL + 'logo.svg'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(DEMO_EMAIL)
  // Preview template: sandi demo terisi otomatis, tinggal klik Masuk.
  const [password, setPassword] = useState(DEMO_PASS)
  const [error, setError] = useState('')

  async function submit(ev) {
    ev.preventDefault()
    if (!email.trim() || !password) {
      setError('Isi email dan kata sandi terlebih dahulu.')
      return
    }
    try {
      await onLogin(email, password)
    } catch (e) {
      if (e.code === 'bad-credentials') setError('Kredensial salah. Gunakan akun demo di bawah.')
      else setError('Gagal masuk: ' + (e.message || 'kesalahan tidak dikenal'))
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="login-brand">
          <div className="mark">
            <img src={LOGO} alt="WF" />
          </div>
          <div>
            <strong>WF Template</strong>
            <span>Design system · ciri khas kita</span>
          </div>
        </div>
        <h1>Selamat datang</h1>
        <p>Masuk untuk mengelola ruang kerja Anda.</p>
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={submit}>
          <div className="fields" style={{ gridTemplateColumns: '1fr' }}>
            <label className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.id"
                autoComplete="username"
              />
            </label>
            <label className="field">
              <span className="label">Kata sandi</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
          </div>
          <div className="modal-actions" style={{ justifyContent: 'stretch' }}>
            <Button variant="primary" type="submit" icon="lock">
              Masuk
            </Button>
          </div>
        </form>
        {!API_BASE_URL && (
          <div className="demo-hint">
            Akun demo — email: <code>{DEMO_EMAIL}</code> · sandi: <code>{DEMO_PASS}</code>
          </div>
        )}
        <div className="login-foot">Contoh visual. Autentikasi nyata disambungkan ke backend Anda.</div>
      </div>
    </div>
  )
}
