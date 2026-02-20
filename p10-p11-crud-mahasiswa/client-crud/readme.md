# Frontend Client (Ionic Angular)

Aplikasi mobile antarmuka pengguna.

## Struktur Kode
- **Interfaces (`src/app/interfaces/`):** Definisi tipe data `Mahasiswa` agar type-safe.
- **Home Logic (`home.page.ts`):** Menangani logika Search, Refresh, dan CRUD.
- **Home UI (`home.page.html`):** Menggunakan `ion-item-sliding`, `ion-searchbar`, dan `ion-refresher`.

## Catatan UX
- Gunakan gesture **Swipe Left** pada list nama untuk memunculkan tombol Edit/Hapus.
- Tarik layar ke bawah untuk me-refresh data.