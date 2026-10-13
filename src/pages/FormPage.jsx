import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { PageHead } from '../components/Layout.jsx'
import { DateField, FileUpload, SearchableSelect } from '../components/fields.jsx'

const emptyForm = { name: '', category: 'Digital', price: '', status: 'Draf', desc: '', featured: false }

const KOTA = ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Semarang', 'Yogyakarta', 'Surabaya', 'Medan', 'Makassar', 'Denpasar', 'Palembang', 'Balikpapan']

export default function FormPage({ form, setForm, reset, preview, toast }) {
  const [tanggal, setTanggal] = useState('')
  const [kota, setKota] = useState('')
  const [lampiran, setLampiran] = useState([])

  function set(k, v) {
    setForm({ ...form, [k]: v })
  }

  return (
    <>
      <PageHead title="Form data" desc="Pola form reusable untuk tambah dan edit data.">
        <Button onClick={reset}>Reset</Button>
        <Button variant="primary" icon="arrow" onClick={preview}>
          Pratinjau
        </Button>
      </PageHead>
      <div className="form-grid">
        <section className="card form-card">
          <h2 className="section-title">Informasi dasar</h2>
          <div className="fields">
            <label className="field">
              <span className="label">Nama produk</span>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Contoh: Paket Kreator" />
              <span className="hint">Nama tampil pada katalog dan laporan.</span>
            </label>
            <label className="field">
              <span className="label">Kategori</span>
              <select className="select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option>Digital</option>
                <option>Layanan</option>
                <option>Fisik</option>
              </select>
            </label>
            <label className="field">
              <span className="label">Harga</span>
              <input className="input" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} />
            </label>
            <label className="field">
              <span className="label">Status</span>
              <select className="select" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option>Draf</option>
                <option>Aktif</option>
                <option>Diarsipkan</option>
              </select>
            </label>
            <label className="field full">
              <span className="label">Deskripsi</span>
              <textarea className="textarea" value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Jelaskan isi dan manfaat produk…" />
            </label>
            <label className="check-row field full">
              <input className="checkbox" type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>
                <span className="label">Tampilkan sebagai unggulan</span>
                <span className="hint" style={{ display: 'block' }}>
                  Produk mendapat sorotan pada halaman utama.
                </span>
              </span>
            </label>
          </div>
        </section>
        <aside className="card preview">
          <h2 className="section-title">Pratinjau ringkas</h2>
          <div className="preview-box">
            <Badge tone={form.status === 'Aktif' ? 'success' : 'warning'}>{form.status}</Badge>
            <h3>{form.name || 'Nama produk'}</h3>
            <p>{form.desc || 'Deskripsi produk akan tampil di sini.'}</p>
            <strong>Rp {Number(form.price || 0).toLocaleString('id-ID')}</strong>
            {form.featured && (
              <div className="alert">
                <Icon name="info" />
                <span>Produk ini akan diberi penanda unggulan.</span>
              </div>
            )}
          </div>
          <div className="alert">
            <Icon name="info" />
            <span>Ini adalah simulasi UI. Perubahan hanya tersimpan selama halaman terbuka.</span>
          </div>
        </aside>
      </div>
      <section className="card form-card" style={{ marginTop: 18 }}>
        <h2 className="section-title">Komponen lanjutan</h2>
        <p style={{ color: 'var(--muted)', marginTop: -12, marginBottom: 18, fontSize: 13 }}>
          Date picker, unggah file, dan select dengan pencarian — siap dipakai di form mana pun.
        </p>
        <div className="fields">
          <DateField label="Tanggal mulai" value={tanggal} onChange={setTanggal} hint="Format mengikuti locale browser." />
          <SearchableSelect label="Kota" options={KOTA} value={kota} onChange={setKota} placeholder="Pilih kota…" hint="Ketik untuk memfilter daftar." />
          <div className="field full">
            <FileUpload label="Lampiran" hint="Klik atau seret file ke zona ini." multiple onFiles={setLampiran} />
          </div>
        </div>
        <div className="modal-actions">
          <Button
            variant="primary"
            onClick={() =>
              toast &&
              toast(`Tanggal: ${tanggal || '-'} · Kota: ${kota || '-'} · File: ${lampiran.length}`, 'info')
            }
          >
            Simpan contoh
          </Button>
        </div>
      </section>
    </>
  )
}

export { emptyForm }
