import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { seedInvoices, rupiah } from '../data.js'

export default function Invoices({ toast }) {
  const [list, setList] = useState(seedInvoices)
  const [openId, setOpenId] = useState(null)
  const open = list.find((i) => i.id === openId)

  const total = list.reduce((n, i) => n + i.amount, 0)
  const paid = list.filter((i) => i.status === 'Lunas').reduce((n, i) => n + i.amount, 0)
  const waiting = total - paid

  function markPaid(id) {
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Lunas', tone: 'success' } : i)))
    toast('Tagihan ditandai lunas')
  }

  if (open) {
    return (
      <>
        <PageHead title={open.no} desc={`${open.client} · jatuh tempo ${open.due}`}>
          <Button icon="arrowleft" onClick={() => setOpenId(null)}>Kembali</Button>
          <Button icon="printer" variant="primary" onClick={() => window.print()}>Cetak</Button>
        </PageHead>
        <section className="card invoice-doc">
          <div className="inv-head">
            <div>
              <h2>INVOICE</h2>
              <p>{open.no}</p>
            </div>
            <Badge tone={open.tone}>{open.status}</Badge>
          </div>
          <div className="inv-meta">
            <div><span>Ditagihkan kepada</span><strong>{open.client}</strong></div>
            <div><span>Tanggal terbit</span><strong>{open.date}</strong></div>
            <div><span>Jatuh tempo</span><strong>{open.due}</strong></div>
          </div>
          <table className="data-table inv-table">
            <thead><tr><th>Deskripsi</th><th>Qty</th><th>Harga</th><th>Jumlah</th></tr></thead>
            <tbody>
              {open.items.map((it, i) => (
                <tr key={i}>
                  <td data-label="Deskripsi">{it.desc}</td>
                  <td data-label="Qty">{it.qty}</td>
                  <td data-label="Harga">{rupiah(it.price)}</td>
                  <td data-label="Jumlah">{rupiah(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inv-total">
            <span>Total tagihan</span>
            <strong>{rupiah(open.amount)}</strong>
          </div>
          {open.status !== 'Lunas' && (
            <div className="modal-actions">
              <Button variant="primary" icon="check" onClick={() => markPaid(open.id)}>
                Tandai lunas
              </Button>
            </div>
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <PageHead title="Tagihan" desc="Daftar invoice dan status pembayaran.">
        <Button icon="plus" variant="primary" onClick={() => toast('Form invoice baru (simulasi)')}>
          Buat tagihan
        </Button>
      </PageHead>
      <section className="grid-stats">
        <article className="card stat">
          <div className="stat-top"><span>Total tagihan</span></div>
          <div className="stat-value">{rupiah(total)}</div>
          <div className="trend"><strong>{list.length}</strong> invoice</div>
        </article>
        <article className="card stat">
          <div className="stat-top"><span>Sudah lunas</span></div>
          <div className="stat-value">{rupiah(paid)}</div>
          <div className="trend"><strong>{list.filter((i) => i.status === 'Lunas').length}</strong> invoice</div>
        </article>
        <article className="card stat">
          <div className="stat-top"><span>Menunggu bayar</span></div>
          <div className="stat-value">{rupiah(waiting)}</div>
          <div className="trend"><strong>{list.filter((i) => i.status !== 'Lunas').length}</strong> invoice</div>
        </article>
      </section>
      <section className="card table-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>No. Invoice</th><th>Klien</th><th>Terbit</th><th>Jatuh tempo</th><th>Jumlah</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id}>
                  <td data-label="No. Invoice"><strong>{i.no}</strong></td>
                  <td data-label="Klien">{i.client}</td>
                  <td data-label="Terbit">{i.date}</td>
                  <td data-label="Jatuh tempo">{i.due}</td>
                  <td data-label="Jumlah">{rupiah(i.amount)}</td>
                  <td data-label="Status"><Badge tone={i.tone}>{i.status}</Badge></td>
                  <td><Button small onClick={() => setOpenId(i.id)}>Lihat</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
