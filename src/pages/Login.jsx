import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { DEMO_EMAIL, DEMO_PASS } from '../data.js'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(ev) {
    ev.preventDefault()
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASS) {
      onLogin({ name: 'Wahyu Pratama', email, role: 'Administrator' })
    } else if (!email.trim() || !password) {
      setError('Isi email dan kata sandi terlebih dahulu.')
    } else {
      setError('Kredensial salah. Gunakan akun demo di bawah.')
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="login-brand">
          <div className="mark">W</div>
          <div>
            <strong>IT Portal</strong>
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
        <div className="demo-hint">
          Akun demo — email: <code>{DEMO_EMAIL}</code> · sandi: <code>{DEMO_PASS}</code>
        </div>
        <div className="login-foot">Contoh visual. Autentikasi nyata disambungkan ke backend Anda.</div>
      </div>
    </div>
  )
}
