# WF Template

Dashboard admin React — design system ciri khas kita, komponen UI gaya shadcn yang ditulis sendiri dari nol (tanpa library shadcn/Tailwind).

## Isi

- `index.html` — aplikasi dashboard siap buka di browser (hasil build statis)

## Halaman

- **Login** — halaman masuk dengan validasi & akun demo (`admin@portal.id` / `admin123`)
- **Dashboard** — kartu statistik, grafik performa, aktivitas terbaru
- **Daftar Data** — tabel dengan pencarian & pagination, unduh CSV, tambah/edit/hapus pengguna (modal + konfirmasi hapus)
- **Peran & Akses** — matriks hak akses 4 peran (Admin, Editor, Analis, Viewer) × 6 fitur, bisa dicentang langsung
- **Form** — contoh tambah/edit (input, select, checkbox, switch)
- **Pengaturan** & **Profil**

## Fitur

- Sidebar + topbar responsif (hamburger di mobile)
- Dark mode
- Komponen reusable: Button, Card, Badge, Input, Table, Dialog, Tabs, Alert, Avatar, Toast (notifikasi bertumpuk: sukses/info/peringatan/error), Permission matrix

## Cara pakai

Buka `index.html` langsung di browser. Untuk pengembangan lanjut, jadikan ini fondasi aplikasi React berikutnya.
