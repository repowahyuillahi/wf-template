import Icon from '../components/Icon.jsx'
import { Switch } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'

const tabs = ['Umum', 'Tampilan', 'Notifikasi']

export default function Settings({ tab, setTab, dark, toggleTheme, toast }) {
  return (
    <>
      <PageHead title="Pengaturan" desc="Kelola tampilan dan perilaku ruang kerja." />
      <div className="card form-card">
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t} className={'tab ' + (tab === t ? 'active' : '')} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        {tab === 'Umum' && (
          <div className="settings-list">
            <div className="setting">
              <div>
                <strong>Bahasa antarmuka</strong>
                <span>Bahasa untuk menu dan format tanggal</span>
              </div>
              <select className="select" style={{ width: 180 }}>
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>
            <div className="setting">
              <div>
                <strong>Zona waktu</strong>
                <span>Dipakai pada laporan dan aktivitas</span>
              </div>
              <select className="select" style={{ width: 180 }}>
                <option>WIB (UTC+7)</option>
                <option>WITA (UTC+8)</option>
                <option>WIT (UTC+9)</option>
              </select>
            </div>
          </div>
        )}
        {tab === 'Tampilan' && (
          <div className="settings-list">
            <div className="setting">
              <div>
                <strong>Mode gelap</strong>
                <span>Ikuti pilihan tema pada tombol di atas</span>
              </div>
              <Switch on={dark} onClick={toggleTheme} />
            </div>
            <div className="setting">
              <div>
                <strong>Warna aksen</strong>
                <span>Aksen hijau menjadi ciri visual utama</span>
              </div>
              <div className="color-row">
                <button className="swatch active" style={{ background: '#167a4a' }} aria-label="Hijau" />
                <button className="swatch" style={{ background: '#3563c7' }} aria-label="Biru" />
                <button className="swatch" style={{ background: '#c05b25' }} aria-label="Jingga" />
              </div>
            </div>
          </div>
        )}
        {tab === 'Notifikasi' && (
          <div className="settings-list">
            {[
              ['Ringkasan mingguan', 'Dikirim setiap Senin pagi'],
              ['Pembaruan aktivitas', 'Saat ada perubahan penting'],
              ['Pengingat tugas', 'Satu hari sebelum tenggat'],
            ].map((s, i) => (
              <div className="setting" key={s[0]}>
                <div>
                  <strong>{s[0]}</strong>
                  <span>{s[1]}</span>
                </div>
                <Switch on={i < 2} onClick={() => toast('Preferensi diubah untuk sesi ini')} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
