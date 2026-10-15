import Icon from '../components/Icon.jsx'
import { Badge, Avatar, initials } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { useAuth } from '../auth.jsx'

export default function Profile() {
  const { user } = useAuth()
  const name = user?.name || 'Wahyu Illahi'
  return (
    <>
      <PageHead title="Profil" desc="Informasi akun dan preferensi personal." />
      <section className="card profile-hero">
        <Avatar label={initials(name)} />
        <div>
          <h2>{name}</h2>
          <p>Pemilik ruang kerja · Bergabung Oktober 2026</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge tone="success">Terverifikasi</Badge>
        </div>
      </section>
      <section className="card form-card">
        <h2 className="section-title">Informasi profil</h2>
        <div className="fields">
          <label className="field">
            <span className="label">Nama lengkap</span>
            <input className="input" defaultValue={name} />
          </label>
          <label className="field">
            <span className="label">Jabatan</span>
            <input className="input" defaultValue="Pemilik" />
          </label>
          <label className="field full">
            <span className="label">Bio singkat</span>
            <textarea className="textarea" defaultValue="Membangun produk digital yang rapi, ringan, dan mudah dipakai." />
          </label>
        </div>
        <div className="alert">
          <Icon name="info" />
          <span>Form profil ini adalah contoh visual dan tidak mengirim data ke server.</span>
        </div>
      </section>
    </>
  )
}
