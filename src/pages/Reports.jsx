import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { REPORT_PERIODS, seedReports, rupiah } from '../data.js'

const DONUT_COLORS = { success: 'var(--brand)', info: 'var(--info)', warning: 'var(--warning)' }

function BarChart({ values, labels }) {
  const max = Math.max(...values)
  const W = 640, H = 240, PAD = 34
  const bw = (W - PAD * 2) / values.length
  return (
    <svg className="chart bars" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik batang">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} className="grid" x1={PAD} y1={H - PAD - f * (H - PAD * 2)} x2={W - 10} y2={H - PAD - f * (H - PAD * 2)} />
      ))}
      {values.map((v, i) => {
        const h = (v / max) * (H - PAD * 2)
        const x = PAD + i * bw + bw * 0.22
        return (
          <g key={i}>
            <rect
              className="bar"
              x={x} y={H - PAD - h} width={bw * 0.56} height={h} rx={6}
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <text x={x + bw * 0.28} y={H - 12} textAnchor="middle">{labels[i] || ''}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Donut({ segments }) {
  const R = 70, C = 2 * Math.PI * R
  let acc = 0
  return (
    <div className="donut-wrap">
      <svg className="donut" viewBox="0 0 180 180" role="img" aria-label="Grafik donat">
        <circle cx={90} cy={90} r={R} className="donut-bg" />
        {segments.map((s) => {
          const dash = (s.pct / 100) * C
          const el = (
            <circle
              key={s.label} cx={90} cy={90} r={R} className="donut-seg"
              stroke={DONUT_COLORS[s.tone]}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-acc}
            />
          )
          acc += dash
          return el
        })}
        <text x={90} y={86} textAnchor="middle" className="donut-num">
          {segments[0].pct}%
        </text>
        <text x={90} y={106} textAnchor="middle" className="donut-cap">
          {segments[0].label}
        </text>
      </svg>
      <ul className="donut-legend">
        {segments.map((s) => (
          <li key={s.label}>
            <span className="dot" style={{ background: DONUT_COLORS[s.tone] }} />
            {s.label}
            <strong>{s.pct}%</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Reports({ toast }) {
  const [period, setPeriod] = useState('30 hari')
  const d = seedReports[period]
  return (
    <>
      <PageHead title="Laporan" desc="Analisis kinerja dalam berbagai periode.">
        <Button icon="download" onClick={() => toast('Laporan periode ' + period + ' disiapkan (simulasi)')}>
          Ekspor
        </Button>
      </PageHead>
      <div className="tabs">
        {REPORT_PERIODS.map((p) => (
          <button key={p} className={'tab ' + (period === p ? 'active' : '')} onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
      </div>
      <section className="grid-stats" key={period}>
        {d.stats.map((s) => (
          <article key={s.label} className="card stat">
            <div className="stat-top"><span>{s.label}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="trend"><strong>{s.delta}</strong> {s.note}</div>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="card">
          <div className="card-head">
            <div><h2>Tren pendapatan</h2><p>Periode {period}</p></div>
            <Badge tone="success">{d.stats[0].delta}</Badge>
          </div>
          <div className="chart-wrap" key={period}>
            <BarChart values={d.bars} labels={d.barLabels} />
          </div>
        </article>
        <article className="card">
          <div className="card-head">
            <div><h2>Komposisi</h2><p>Berdasarkan kategori</p></div>
          </div>
          <div className="chart-wrap">
            <Donut segments={d.donut} />
          </div>
        </article>
      </section>
    </>
  )
}
