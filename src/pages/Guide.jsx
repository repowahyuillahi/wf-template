import Icon from '../components/Icon.jsx'
import { PageHead } from '../components/Layout.jsx'

const SECTIONS = [
  {
    icon: 'dashboard',
    title: 'Mulai cepat',
    body: 'Template ini 100% komponen buatan sendiri — tanpa shadcn, tanpa Tailwind. Semua gaya hidup di src/styles.css memakai CSS variable, jadi satu perubahan warna merambat ke seluruh aplikasi.',
    points: ['Login demo: admin@portal.id / admin123', 'Ctrl+K membuka command palette', 'Klik lonceng untuk pusat notifikasi'],
  },
  {
    icon: 'settings',
    title: 'Tema, aksen & font',
    body: 'Pilihan tersimpan otomatis di localStorage dan berlaku instan tanpa reload.',
    points: ['Mode gelap/terang via ikon matahari di topbar', 'Empat warna aksen: hijau, biru, jingga, ungu', 'Tiga font: DM Sans, Plus Jakarta Sans, Inter'],
  },
  {
    icon: 'activity',
    title: 'Jejak audit otomatis',
    body: 'Aksi penting (tambah/ubah/hapus pengguna, ubah peran, ekspor CSV) tercatat otomatis di halaman Audit log lengkap dengan waktu dan pelaku.',
    points: [],
  },
  {
    icon: 'shield',
    title: 'Peran & akses',
    body: 'Matriks peran memetakan izin per fitur. Nonaktifkan izin di sini, menu terkait ikut terkunci untuk peran tersebut.',
    points: ['Admin, Editor, Analis, Viewer sudah terdefinisi', 'Tambah peran baru dari halaman Peran & akses'],
  },
  {
    icon: 'info',
    title: 'Sambung ke backend',
    body: 'Semua data saat ini statis dari src/data.js. Ganti dengan fetch ke API lewat modul terpusat src/api.js — sudah menangani base URL, token, dan auto-logout saat 401.',
    points: ['Satu pintu: api.get / api.post / api.put / api.del', 'Token tersimpan aman, header otomatis', 'Event wf:unauthorized memicu logout otomatis'],
  },
]

export default function Guide() {
  return (
    <>
      <PageHead
        title="Panduan"
        desc="Cara memakai WF Template — ciri khas kita."
      />
      <div className="guide-grid">
        {SECTIONS.map((s) => (
          <article key={s.title} className="card guide-card">
            <div className="guide-head">
              <span className="stat-icon">
                <Icon name={s.icon} />
              </span>
              <h2>{s.title}</h2>
            </div>
            <p>{s.body}</p>
            {s.points.length > 0 && (
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </>
  )
}
