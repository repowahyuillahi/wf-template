import Icon from '../components/Icon.jsx'
import { Switch } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { ACCENTS, FONTS } from '../data.js'

const tabs = ['Umum', 'Tampilan', 'Notifikasi']

export default function Settings({ tab, setTab, dark, toggleTheme, toast, accent, setAccent, font, setFont }) {
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
                <span>Aksen menjadi ciri visual utama seluruh aplikasi</span>
              </div>
              <div className="color-row">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    className={'swatch ' + (accent === a.id ? 'active' : '')}
                    style={{ background: a.color }}
                    aria-label={a.label}
                    title={a.label}
                    onClick={() => {
                      setAccent(a.id)
                      toast('Warna aksen: ' + a.label, 'info')
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="setting" style={{ alignItems: 'start' }}>
              <div>
                <strong>Font antarmuka</strong>
                <span>Jenis huruf untuk seluruh aplikasi</span>
              </div>
            </div>
            <div className="font-row" style={{ paddingBottom: 16 }}>
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  data-font={f.id}
                  className={'font-opt ' + (font === f.id ? 'active' : '')}
                  onClick={() => {
                    setFont(f.id)
                    toast('Font: ' + f.label, 'info')
                  }}
                >
                  <strong>Aa {f.label}</strong>
                  <span>{f.desc}</span>
                </button>
              ))}
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
