# WF Template

Dashboard admin React + Vite — design system ciri khas kita, komponen UI gaya shadcn yang ditulis sendiri dari nol (tanpa library shadcn/Tailwind). Fondasi reusable untuk IT Portal.

Live demo: https://repowahyuillahi.github.io/wf-template/ (login demo: `admin@portal.id` / `admin123`)

## Struktur

```
index.html                  → entry Vite
src/
  main.jsx                  → bootstrap React
  App.jsx                   → shell aplikasi + state global (halaman, toast, tema, notifikasi)
  api.js                    → LAPISAN API TERPUSAT (fetch wrapper, token, 401 → auto-logout)
  auth.jsx                  → AuthProvider: login/logout, mode demo ↔ backend
  styles.css                → design token & seluruh gaya (light/dark mode)
  data.js                   → ikon SVG, navigasi, data contoh, peran & izin, notifikasi, audit
  components/
    Icon.jsx                → ikon SVG
    ui.jsx                  → Button, Badge, Avatar, SearchBox, Switch
    Layout.jsx              → Sidebar, Topbar, PageHead (+ breadcrumbs)
    Toast.jsx               → notifikasi bertumpuk (sukses/info/peringatan/error)
    Modal.jsx               → UserModal (tambah/edit), ConfirmModal (hapus)
    Notifications.jsx       → pusat notifikasi (dropdown lonceng)
    CommandPalette.jsx      → Ctrl+K: cari halaman & jalankan aksi
    ErrorBoundary.jsx       → penangkap error render
    fields.jsx              → DateField, FileUpload, SearchableSelect
  pages/
    Login.jsx               → halaman masuk + validasi
    Dashboard.jsx           → kartu statistik, grafik, aktivitas
    Users.jsx               → tabel pengguna: cari, tambah/edit/hapus, ekspor CSV
    Roles.jsx               → matriks hak akses peran × fitur
    AuditLog.jsx            → jejak aktivitas (siapa, apa, kapan)
    NotFound.jsx            → halaman 404
    FormPage.jsx            → pola form reusable + pratinjau + komponen lanjutan
    Settings.jsx            → pengaturan (umum, tampilan: tema/aksen/font, notifikasi)
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

- Sidebar + topbar responsif (hamburger di mobile), breadcrumbs otomatis
- Dark mode + 4 warna aksen + 3 pilihan font (tersimpan di browser)
- Toast bertumpuk: sukses/info/peringatan/error, hilang otomatis
- **API terpusat** (`src/api.js`): token otomatis, 401 → auto-logout
- **Auth**: mode demo tanpa backend, atau sambungkan backend via `.env` (`VITE_API_URL=...`)
- **Pusat notifikasi**: dropdown lonceng dengan badge unread
- **Command palette**: tekan `Ctrl+K` untuk cari halaman & jalankan aksi
- **Audit log**: jejak aktivitas pengguna
- **Komponen form lanjutan**: date picker, upload file (drag & drop), select dengan pencarian
- Halaman 404 + error boundary

## Menyambungkan backend

1. Buat file `.env` di root: `VITE_API_URL=https://api.portal-anda.id`
2. Sesuaikan path endpoint di `src/api.js` (`authApi`, `usersApi`, `notificationsApi`)
3. Format login yang diharapkan: `{ token: "...", user: { name, email, role } }`
4. Tanpa `VITE_API_URL`, aplikasi jalan dalam mode demo (data lokal)

## Cara pakai

```bash
npm install
npm run dev      # development di http://localhost:5173
npm run build    # hasil build ke dist/
```

Deploy ke GitHub Pages: `npm run deploy` (build lalu push hasil ke branch `gh-pages`, yang dilayani Pages).
