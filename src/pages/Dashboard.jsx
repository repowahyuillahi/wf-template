import Icon from '../components/Icon.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'

function Stat({ label, value, delta, note, icon }) {
  return (
    <article className="card stat">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon name={icon} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="trend">
        <strong>{delta}</strong> {note}
      </div>
    </article>
  )
}

function RevenueChart() {
  return (
    <svg className="chart" viewBox="0 0 700 250" preserveAspectRatio="none" role="img" aria-label="Grafik pendapatan enam bulan terakhir">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {[40, 90, 140, 190].map((y) => (
        <line key={y} className="grid" x1={45} y1={y} x2={680} y2={y} />
      ))}
      <path className="prev" d="M45 185 C110 170 130 135 195 150 S300 180 360 130 S470 120 520 95 S625 90 680 75" />
      <path className="area" d="M45 180 C105 180 130 150 195 155 S295 135 360 120 S455 138 520 88 S620 95 680 42 L680 210 L45 210 Z" />
      <path className="line" d="M45 180 C105 180 130 150 195 155 S295 135 360 120 S455 138 520 88 S620 95 680 42" />
      {['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'].map((m, i) => (
        <text key={m} x={55 + i * 123} y={235} textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>
  )
}

const activities = [
  ['users', 'Nadia mengundang 3 anggota', '4 menit lalu'],
  ['package', 'Produk “Starter Kit” diperbarui', '28 menit lalu'],
  ['money', 'Pembayaran baru diterima', '1 jam lalu'],
  ['edit', 'Halaman laporan disunting', '3 jam lalu'],
]

export default function Dashboard({ openModal }) {
  return (
    <>
      <PageHead title="Dashboard" desc="Ringkasan operasional ruang kerja hari ini.">
        <Button variant="primary" icon="plus" onClick={() => openModal()}>
          Tambah data
        </Button>
      </PageHead>
      <section className="grid-stats">
        <Stat label="Total pendapatan" value="Rp 84,2 jt" delta="+12,5%" note="dari bulan lalu" icon="money" />
        <Stat label="Pesanan" value="1.284" delta="+8,2%" note="dari bulan lalu" icon="cart" />
        <Stat label="Pengguna aktif" value="7.429" delta="+18,1%" note="dalam 30 hari" icon="users" />
        <Stat label="Konversi" value="3,82%" delta="+0,6%" note="poin bulan ini" icon="activity" />
      </section>
      <section className="dashboard-grid">
        <article className="card">
          <div className="card-head">
            <div>
              <h2>Performa pendapatan</h2>
              <p>Mei–Oktober 2026</p>
            </div>
            <Badge tone="success">+18,4%</Badge>
          </div>
          <div className="chart-wrap">
            <div className="chart-legend">
              <span>
                <i className="dot" />
                Tahun ini
              </span>
              <span>
                <i className="dot muted" />
                Tahun lalu
              </span>
            </div>
            <RevenueChart />
          </div>
        </article>
        <article className="card">
          <div className="card-head">
            <div>
              <h2>Aktivitas terbaru</h2>
              <p>Pembaruan dari tim</p>
            </div>
          </div>
          <div className="activity">
            {activities.map((a) => (
              <div className="activity-item" key={a[1]}>
                <div className="activity-icon">
                  <Icon name={a[0]} />
                </div>
                <div>
                  <p>{a[1]}</p>
                  <span>{a[2]}</span>
                </div>
                <Icon name="chev" />
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
