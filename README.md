# Panduan Setup Project Next.js 16 & PostgreSQL 18

Dokumentasi lengkap untuk inisialisasi, konfigurasi, dan menjalankan project web modern menggunakan **Next.js (App Router)** dan database **PostgreSQL** dengan **Prisma ORM 7**.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Language & Styling**: TypeScript, Tailwind CSS v4
- **Database**: PostgreSQL 18 (Local Windows Service di port `5432`)
- **ORM / Data Layer**: [Prisma ORM 7](https://www.prisma.io/) dengan `@prisma/adapter-pg`

---

## 🐘 Bagian 1: Panduan Setup PostgreSQL di Windows

### 1. Unduh dan Instalasi
1. Download installer resmi PostgreSQL untuk Windows dari [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (versi 16 atau 18).
2. Jalankan installer `.exe` dan tentukan komponen yang diinstal:
   - ✅ **PostgreSQL Server** *(Wajib)*
   - ✅ **pgAdmin 4** *(Direkomendasikan — aplikasi GUI desktop untuk melihat tabel/data)*
   - ⬜ **Stack Builder** *(Boleh di-uncheck / lewati)*
   - ✅ **Command Line Tools** *(Wajib — menyertakan `psql`)*
3. **Password Superuser**:
   - Masukkan password untuk user default `postgres` (misal: `BambangStoner26`).
   - **PENTING**: Catat password ini karena wajib dimasukkan ke file `.env` di Next.js.
4. **Port**:
   - Gunakan port standar: `5432`.
5. **Locale**:
   - Pilih `[Default locale]`.
6. Selesaikan proses instalasi. Jika di akhir muncul popup *Stack Builder*, klik **Cancel**.

### 2. Memeriksa Layanan PostgreSQL
PostgreSQL akan otomatis berjalan di latar belakang sebagai Windows Service setiap kali komputer dinyalakan. Untuk mengecek statusnya via PowerShell:

```powershell
Get-Service *postgres*
```
*(Pastikan statusnya **Running**)*.

### 3. Mengakses Database via GUI
- **pgAdmin 4 (Desktop)**:
  - Buka aplikasi **pgAdmin 4** dari Start Menu.
  - Masukkan master password saat diminta.
  - Di panel kiri: Klik **Servers** > **PostgreSQL 18** > **Databases**.
- **Prisma Studio (Browser)**:
  - Alternatif yang jauh lebih ringan dan modern tanpa perlu membuka pgAdmin (lihat di Bagian 3).

---

## 💻 Bagian 2: Panduan Setup Project Next.js

### 1. Clone / Buka Direktori Project
Buka terminal pada folder project ini:
```powershell
cd "c:\Users\fauza\OneDrive\Documents\Kuliah\SEMESTER 5 - PRAKTIKUM\PPK\NextJS"
```

### 2. Install Dependencies
Jika baru pertama kali mendownload project atau setelah clone dari repository:
```powershell
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Buat atau buka file `.env` di root direktori project, lalu atur variabel `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/nextjs_db?schema=public"
```

> **Penjelasan Format URL Koneksi:**
> - `postgres` : Username superuser default PostgreSQL.
> - `PASSWORD_ANDA` : Password yang Anda buat saat instalasi PostgreSQL tadi.
> - `localhost:5432` : Alamat host dan port server PostgreSQL lokal Anda.
> - `nextjs_db` : Nama database yang akan dibuat/digunakan untuk project ini.
> - `?schema=public` : Schema default di dalam PostgreSQL.

### 4. Sinkronisasi Schema Database (Prisma DB Push)
Jalankan perintah ini di terminal:
```powershell
npx prisma db push
```
Prisma akan:
1. Menghubungi PostgreSQL di laptop Anda.
2. Otomatis membuatkan database `nextjs_db` jika belum ada.
3. Otomatis membuatkan tabel `Student` (dan model lain yang ada di `prisma/schema.prisma`).

### 5. Generate Prisma Client
Pastikan type-definition dan query client Prisma sudah di-generate:
```powershell
npx prisma generate
```

---

## 🏃 Bagian 3: Menjalankan Aplikasi

### 1. Jalankan Development Server
```powershell
npm run dev
```
Buka browser di **[http://localhost:3000](http://localhost:3000)**.
- Anda akan melihat antarmuka Dashboard Sistem Mahasiswa.
- Indikator status di kanan atas akan berwarna hijau: **"PostgreSQL Terhubung"**.
- Anda bisa langsung mengisi form dan menambah/menghapus data mahasiswa secara realtime.

### 2. Menjalankan Prisma Studio (GUI Visual di Browser)
Untuk melihat dan mengelola isi tabel database secara visual melalui browser:
```powershell
npx prisma studio
```
Browser akan otomatis membuka **[http://localhost:5555](http://localhost:5555)**.

---

## 📁 Struktur Direktori Project

```text
NextJS/
├── .env                       # File kredensial & connection string database
├── prisma/
│   └── schema.prisma          # Definisi schema database (model Student)
├── prisma7.config.ts          # Konfigurasi Prisma 7 datasource & migrations
├── src/
│   ├── app/
│   │   ├── actions.ts         # Server Actions (query database: create, read, delete, check connection)
│   │   ├── globals.css        # Konfigurasi Tailwind CSS v4 & theme
│   │   ├── layout.tsx         # Root layout aplikasi Next.js
│   │   ├── page.tsx           # Server Component utama yang memuat data awal
│   │   └── components/
│   │       └── StudentDashboard.tsx # Client Component antarmuka interaktif & form
│   ├── generated/
│   │   └── prisma/            # Type-safe Prisma Client yang di-generate otomatis
│   └── lib/
│       └── prisma.ts          # Singleton PrismaClient instance & PostgreSQL driver adapter
├── package.json
└── README.md
```

---

## 🛠️ Panduan Menambah Model / Tabel Baru

Jika di kemudian hari Anda ingin menambah tabel baru (misalnya tabel `Dosen` atau `Course`):

1. Buka file [`prisma/schema.prisma`](prisma/schema.prisma) dan tambahkan model baru:
   ```prisma
   model Course {
     id        Int      @id @default(autoincrement())
     code      String   @unique
     title     String
     credits   Int
     createdAt DateTime @default(now())
   }
   ```
2. Jalankan perintah push schema ke PostgreSQL:
   ```powershell
   npx prisma db push
   ```
3. Generate ulang client:
   ```powershell
   npx prisma generate
   ```
4. Anda sekarang bisa mengakses tabel baru via `prisma.course.findMany()`, `prisma.course.create()`, dll. di [`src/app/actions.ts`](src/app/actions.ts).

---

## ⚠️ Troubleshooting Umum

| Masalah / Error | Penyebab | Solusi |
| :--- | :--- | :--- |
| `Error P1000: Authentication failed` | Username atau password di `.env` salah | Pastikan username adalah `postgres` dan password sesuai yang dibuat saat instalasi. Format: `postgresql://postgres:PASSWORD@localhost:5432/nextjs_db` |
| Halaman web menampilkan `Database Terputus` padahal `.env` sudah diubah | Server `npm run dev` masih menyimpan cache `.env` lama | Hentikan dev server di terminal dengan menekan `Ctrl + C`, lalu jalankan kembali `npm run dev`. |
| `Can't reach database server at localhost:5432` | Layanan PostgreSQL Windows mati | Buka PowerShell sebagai Administrator dan jalankan: `Start-Service postgresql*` |
