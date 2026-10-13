# WF Template

Dashboard admin React + Vite — design system ciri khas kita, komponen UI gaya shadcn yang ditulis sendiri dari nol (tanpa library shadcn/Tailwind). Fondasi reusable untuk IT Portal.

Live demo: https://repowahyuillahi.github.io/wf-template/ (login demo: `admin@portal.id` / `admin123`)

## Struktur

```
index.html                  → entry Vite
src/
  main.jsx                  → bootstrap React
  App.jsx                   → shell aplikasi + state global (auth, toast, tema)
  styles.css                → design token & seluruh gaya (light/dark mode)
  data.js                   → ikon SVG, navigasi, data contoh, peran & izin
  components/
    Icon.jsx                → ikon SVG
    ui.jsx                  → Button, Badge, Avatar, SearchBox, Switch
    Layout.jsx              → Sidebar, Topbar, PageHead
    Toast.jsx               → notifikasi bertumpuk (sukses/info/peringatan/error)
    Modal.jsx               → UserModal (tambah/edit), ConfirmModal (hapus)
  pages/
    Login.jsx               → halaman masuk + validasi
    Dashboard.jsx           → kartu statistik, grafik, aktivitas
    Users.jsx               → tabel pengguna: cari, tambah/edit/hapus, ekspor CSV
    Roles.jsx               → matriks hak akses peran × fitur
    FormPage.jsx            → pola form reusable + pratinjau
    Settings.jsx            → pengaturan (tab: umum, tampilan, notifikasi)
    Profile.jsx             → profil pengguna
```

## Halaman

- **Login** — validasi & akun demo
- **Dashboard** — kartu statistik, grafik performa, aktivitas terbaru
- **Daftar Data** — tabel dengan pencarian & pagination, unduh CSV, tambah/edit/hapus pengguna (modal + konfirmasi hapus)
- **Peran & Akses** — matriks hak akses 4 peran (Admin, Editor, Analis, Viewer) × 6 fitur, bisa dicentang langsung
- **Form** — contoh tambah/edit (input, select, checkbox, switch)
- **Pengaturan** & **Profil**

## Fitur

- Sidebar + topbar responsif (hamburger di mobile)
- Dark mode (otomatis ikut sistem, bisa diubah manual)
- Toast bertumpuk: sukses/info/peringatan/error, hilang otomatis

## Cara pakai

```bash
npm install
npm run dev      # development di http://localhost:5173
npm run build    # hasil build ke dist/
```

Setiap push ke branch `main` otomatis di-build dan deploy ke GitHub Pages lewat `.github/workflows/deploy.yml`.
