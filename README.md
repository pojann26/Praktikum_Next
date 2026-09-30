# 💰 HematKu — Student Expense Tracker & Financial Management System
> **Dokumen Spesifikasi Kebutuhan Perangkat Lunak (Software Requirements Specification — SRS)**  
> Mata Kuliah: Pengembangan Perangkat Lunak Berorientasi Komponen (PPK) — Semester 5

---

## 👥 Tim Pengembang & Struktur Organisasi

| No | Peran / Jabatan | Nama Lengkap | NIM | Tanggung Jawab Utama |
|:--:|:---|:---|:---:|:---|
| 1 | **Project Manager (PM)** | **Quinta Aurabiansyah** | 24060124120016 | Manajemen proyek, delegasi tugas, manajemen branching Git, review Pull Request (PR), pengujian End-to-End, dan integrasi akhir. |
| 2 | **Programmer 1** | **Fauzan (pojann26)** | *[NIM]* | Modul Autentikasi, Session Management, Cookies, dan Middleware Route Protection. |
| 3 | **Programmer 2** | **Naufal Dwi Yusmawan** | 24060124130075 | Modul Manajemen Transaksi (CRUD), Filter Transaksi, Server Actions, dan Database Query (Prisma). |
| 4 | **Programmer 3** | **Aditya Sultonul Ulya** | 24060124120006 | Modul Dashboard, Ringkasan Saldo/Keuangan, Komponen UI/UX interaktif, dan Manajemen Preferensi Pengguna. |

> **Catatan perubahan struktur:** Pada **Fase 1** (Fitur Inti, FR-001 s.d. FR-009) PM dijabat oleh Fauzan (pojann26) dan Programmer 1 oleh Quinta Aurabiansyah. Mulai **Fase 2** (Fitur Budget Bulanan, FR-010 s.d. FR-013) PM dijabat oleh **Quinta Aurabiansyah** dan Programmer 1 oleh **Fauzan (pojann26)**. Pembagian tugas per fase dapat dilihat pada Bagian 6.

---

## 📌 1. Deskripsi & Ringkasan Proyek

### 1.1 Latar Belakang
Mahasiswa sering menghadapi kendala dalam mengelola keuangan bulanan akibat tidak adanya pencatatan transaksi pemasukan dan pengeluaran yang terstruktur. Aplikasi **HematKu** hadir sebagai solusi berbasis web yang ringan, cepat, dan intuitif untuk membantu mahasiswa memantau kondisi finansial pribadi secara mandiri.

### 1.2 Tujuan Sistem
- Menyediakan sistem pencatatan keuangan pribadi (*personal expense tracker*) yang mudah digunakan oleh mahasiswa.
- Memberikan visibilitas langsung terhadap status keuangan (*Total Saldo*, *Total Pemasukan*, dan *Total Pengeluaran*).
- Menjaga kerahasiaan dan integritas data keuangan antar pengguna dengan mekanisme autentikasi dan isolasi data (*authorization*) yang ketat.
- Menerapkan arsitektur web modern berbasis **Next.js (App Router)**, **Prisma ORM**, dan database **PostgreSQL**.

---

## 🎯 2. Kebutuhan Fungsional (Functional Requirements)

Sistem wajib mengimplementasikan 13 fitur utama berikut (FR-001 s.d. FR-009 sebagai fitur inti, FR-010 s.d. FR-013 sebagai pengembangan **Budget Bulanan**):

| ID Kebutuhan | Nama Fitur | Deskripsi Kebutuhan |
|:---|:---|:---|
| **FR-001** | **Registrasi Akun (Register)** | Pengguna dapat mendaftarkan akun baru dengan menginput **Nama Lengkap**, **Email unik**, dan **Password**. Password harus di-hash (enkripsi) sebelum disimpan ke PostgreSQL. |
| **FR-002** | **Autentikasi (Login)** | Pengguna yang terdaftar dapat masuk menggunakan **Email** dan **Password**. Sistem memvalidasi kredensial dan menolak akses jika data tidak cocok. |
| **FR-003** | **Manajemen Sesi (Session)** | Sistem mempertahankan status login pengguna menggunakan session berbasis token/cookie yang aman. Halaman privat (seperti Dashboard) otomatis dilindungi oleh Next.js Middleware. Jika pengguna belum login, akses akan dialihkan (*redirect*) ke halaman Login. |
| **FR-004** | **Dashboard Finansial** | Menampilkan antarmuka utama yang menyajikan:<br>1. Sapaan nama pengguna yang sedang aktif.<br>2. **Saldo Akhir** (Total Pemasukan - Total Pengeluaran).<br>3. Ringkasan **Total Pemasukan** (*Total Income*).<br>4. Ringkasan **Total Pengeluaran** (*Total Expense*).<br>5. Daftar riwayat transaksi keuangan terbaru. |
| **FR-005** | **Manajemen Transaksi (CRUD)** | Pengguna dapat mengelola transaksi keuangan secara penuh:<br>- **Create**: Menambah transaksi baru (Judul, Jumlah Nominal, Kategori/Catatan, Tanggal, dan Jenis: Pemasukan / Pengeluaran).<br>- **Read**: Melihat daftar seluruh transaksi.<br>- **Update**: Mengubah data transaksi yang telah dibuat.<br>- **Delete**: Menghapus transaksi dari database. |
| **FR-006** | **Filter Transaksi** | Pengguna dapat memfilter daftar transaksi di dashboard berdasarkan jenisnya:<br>- Tampilkan **Semua** Transaksi.<br>- Tampilkan Hanya **Pemasukan** (*Income*).<br>- Tampilkan Hanya **Pengeluaran** (*Expense*). |
| **FR-007** | **Manajemen Cookies** | Sistem memanfaatkan HTTP Cookies untuk:<br>1. Menyimpan sesi login pengguna (`session_token`).<br>2. Menyimpan minimal satu preferensi pengguna (misal: preferensi tema **Dark Mode / Light Mode** atau preferensi default filter transaksi). |
| **FR-008** | **Otorisasi & Isolasi Data (Authorization)** | Setiap transaksi wajib berelasi langsung dengan `userId`. Pengguna **hanya dapat melihat, mengedit, dan menghapus transaksi miliknya sendiri**. Percobaan akses atau manipulasi data milik pengguna lain harus ditolak (*Forbidden*). |
| **FR-009** | **Terminasi Sesi (Logout)** | Pengguna dapat keluar dari akun. Sistem akan menghapus cookie sesi dan mengarahkan kembali ke halaman Login. |
| **FR-010** | **Set Budget** | Pengguna dapat menetapkan dan mengubah **anggaran pengeluaran bulanan**:<br>- **Create**: Menetapkan nominal anggaran untuk bulan & tahun tertentu.<br>- **Update**: Mengubah nominal anggaran pada bulan yang sudah memiliki budget (satu pengguna hanya memiliki **satu** budget per bulan).<br>- **Delete** *(opsional)*: Menghapus budget pada bulan tertentu.<br>- Nominal harus berupa angka lebih besar dari 0. |
| **FR-011** | **Budget Summary** | Menampilkan ringkasan penggunaan anggaran pada bulan terpilih:<br>1. **Anggaran** (nominal budget yang ditetapkan).<br>2. **Total Pengeluaran** (akumulasi transaksi bertipe `EXPENSE` milik pengguna pada bulan tersebut).<br>3. **Sisa Anggaran** (Anggaran - Total Pengeluaran; bernilai negatif jika melebihi budget).<br>4. **Persentase Penggunaan** (Total Pengeluaran ÷ Anggaran × 100%). |
| **FR-012** | **Budget Indicator** | Menampilkan status penggunaan anggaran berupa *progress bar* dan label status berwarna sesuai persentase penggunaan (lihat Tabel Indikator pada Bagian 2.1). |
| **FR-013** | **Monthly Budget** | Pengguna dapat **memilih bulan dan tahun** (*month picker*) untuk melihat serta mengelola anggaran pada periode tersebut. Ringkasan dan indikator otomatis menyesuaikan bulan terpilih. Jika belum ada budget pada bulan tersebut, sistem menampilkan pesan *"Belum ada anggaran"* beserta tombol untuk menetapkannya. |

### 2.1 Aturan Bisnis Budget Bulanan

**Tabel Indikator Status Anggaran (FR-012)**

| Persentase Penggunaan | Status | Warna | Keterangan |
|:---:|:---|:---:|:---|
| 0% – < 75% | **Aman** | 🟢 Hijau | Pengeluaran masih terkendali. |
| 75% – < 100% | **Waspada** | 🟡 Kuning | Anggaran hampir habis. |
| ≥ 100% | **Melebihi Anggaran** | 🔴 Merah | Pengeluaran telah melampaui budget; sisa anggaran bernilai negatif. |

**Aturan Umum**
- Total pengeluaran dihitung **hanya** dari transaksi `type = EXPENSE` dengan `date` berada dalam rentang bulan terpilih (tanggal 1 s.d. akhir bulan) dan `userId` milik pengguna aktif. Transaksi `INCOME` tidak memengaruhi budget.
- Satu pengguna hanya boleh memiliki satu budget untuk kombinasi (`month`, `year`) yang sama (*unique constraint*).
- Perubahan pada transaksi (tambah/ubah/hapus) otomatis tercermin pada Budget Summary tanpa input ulang.
- Pengguna hanya dapat melihat, menetapkan, mengubah, dan menghapus budget miliknya sendiri. Akses ke budget pengguna lain ditolak (*Forbidden*), mengikuti prinsip FR-008.
- Bulan default saat halaman dibuka adalah bulan berjalan; bulan terakhir yang dipilih dapat disimpan pada cookie preferensi (`budget_period`).

---

## 🛡️ 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Spesifikasi |
|:---|:---|
| **Keamanan (Security)** | - Password pengguna di-hash menggunakan algoritma yang aman (misal: `bcryptjs`).<br>- Cookie sesi menggunakan atribut `HttpOnly`, `SameSite=Lax`, dan `Secure` (pada production).<br>- Proteksi route menggunakan Next.js Middleware (termasuk halaman `/budget`).<br>- Setiap Server Action budget wajib memverifikasi `userId` dari sesi, bukan dari input klien. |
| **Integritas Data (Data Integrity)** | Hubungan relasional antar entitas (`User` 1 — N `Transaction`) terjamin menggunakan Foreign Key dan Cascade Delete di PostgreSQL. |
| **Integritas Data Budget** | Hubungan `User` 1 — N `Budget` dijamin menggunakan Foreign Key dan Cascade Delete. Kombinasi (`userId`, `month`, `year`) bersifat unik (`@@unique`) sehingga tidak ada budget ganda pada bulan yang sama. Nominal budget divalidasi di sisi server (harus > 0). |
| **Performa (Performance)** | - Pengambilan data dan mutasi menggunakan Next.js Server Components & Server Actions.<br>- Total pengeluaran bulanan dihitung di database menggunakan agregasi Prisma (`aggregate` / `_sum`), bukan di sisi klien.<br>- Load time halaman di bawah 2 detik pada jaringan lokal. |
| **Usabilitas & Responsivitas** | Antarmuka bersih (*clean*), ramah pengguna (*user-friendly*), dan responsif baik pada layar desktop maupun smartphone menggunakan Tailwind CSS. |

---

## 🗄️ 4. Perancangan Basis Data (Database Design)

### 4.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : "memiliki"
    USER ||--o{ BUDGET : "menetapkan"
    
    USER {
        string id PK "cuid / uuid"
        string name "Nama Lengkap"
        string email UK "Email unik"
        string password "Hashed Password"
        datetime createdAt "Waktu Dibuat"
        datetime updatedAt "Waktu Diperbarui"
    }

    TRANSACTION {
        string id PK "cuid / uuid"
        string title "Keterangan/Judul Transaksi"
        float amount "Nominal Transaksi"
        string type "INCOME | EXPENSE"
        string category "Kategori (cth: Makanan, Uang Saku, dll)"
        datetime date "Tanggal Transaksi"
        string userId FK "ID Pemilik Akun"
        datetime createdAt "Waktu Dibuat"
        datetime updatedAt "Waktu Diperbarui"
    }

    BUDGET {
        string id PK "cuid / uuid"
        float amount "Nominal Anggaran Bulanan"
        int month "Bulan (1-12)"
        int year "Tahun (cth: 2026)"
        string userId FK "ID Pemilik Akun"
        datetime createdAt "Waktu Dibuat"
        datetime updatedAt "Waktu Diperbarui"
    }
```

> **Catatan:** `UNIQUE (userId, month, year)` pada tabel `BUDGET` memastikan satu pengguna hanya memiliki satu anggaran per bulan.

### 4.2 Skema Prisma (`prisma/schema.prisma`)
Rancangan model yang akan digunakan di dalam project:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum TransactionType {
  INCOME
  EXPENSE
}

model User {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  password     String
  transactions Transaction[]
  budgets      Budget[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Transaction {
  id        String          @id @default(cuid())
  title     String
  amount    Float
  type      TransactionType
  category  String          @default("Umum")
  date      DateTime        @default(now())
  userId    String
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  @@index([userId])
}

model Budget {
  id        String   @id @default(cuid())
  amount    Float
  month     Int      // 1 - 12
  year      Int
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, month, year])
  @@index([userId])
}
```

---

## 🔄 5. Alur Kerja Pengguna (User Flow)

```mermaid
flowchart TD
    Start([Mulai]) --> CheckAuth{Apakah Sudah Login?}
    CheckAuth -- Tidak --> AuthPage[Halaman Login / Register]
    AuthPage --> SubmitAuth[Submit Form Kredensial]
    SubmitAuth -- Sukses --> SetCookie[Set Session Cookie]
    SetCookie --> Dashboard[Halaman Dashboard]
    CheckAuth -- Ya --> Dashboard

    Dashboard --> ViewSummary[Melihat Saldo, Total Pemasukan, Total Pengeluaran]
    Dashboard --> FilterData[Memfilter Jenis: Semua / Pemasukan / Pengeluaran]
    Dashboard --> CRUD[Kelola Transaksi: Tambah / Edit / Hapus]
    CRUD --> UpdateDB[(Database PostgreSQL)]
    UpdateDB --> Dashboard
    
    Dashboard --> ChangePref[Ubah Preferensi Tema / Tampilan]
    ChangePref --> SavePrefCookie[Simpan ke Cookie Preferensi]

    Dashboard --> BudgetPage[Buka Halaman Budget Bulanan]
    BudgetPage --> PickMonth[Pilih Bulan & Tahun]
    PickMonth --> HasBudget{Budget Bulan Ini Sudah Ada?}
    HasBudget -- Tidak --> SetBudget[Set Budget: Input Nominal]
    HasBudget -- Ya --> ViewBudget[Lihat Budget Summary & Indicator]
    ViewBudget --> EditBudget[Ubah Nominal Budget]
    SetBudget --> SaveBudget[(Simpan ke Database PostgreSQL)]
    EditBudget --> SaveBudget
    SaveBudget --> ViewBudget
    ViewBudget --> Dashboard

    Dashboard --> Logout[Klik Tombol Logout]
    Logout --> ClearCookie[Hapus Session Cookie]
    ClearCookie --> AuthPage
```

---

## 📋 6. Matriks Pembagian Tugas Tim (WBS / Task Delegation)

Sebagai pedoman pengerjaan antar anggota tim. Pembagian tugas dibagi menjadi dua fase sesuai struktur tim pada masing-masing fase.

### 6.1 Fase 1 — Fitur Inti (FR-001 s.d. FR-009)

#### 1. Project Manager (Fauzan / pojann26)
- [x] Inisialisasi arsitektur repository dan konfigurasi database PostgreSQL + Prisma ORM 7.
- [x] Penyusunan dokumen SRS (*Software Requirements Specification*).
- [ ] Manajemen branching Git (`main`, `dev`, `feature/*`), supervisi kode, dan review Pull Request (PR).
- [ ] Pengujian menyeluruh (*End-to-End Testing*) dan pemastian kepatuhan terhadap 9 requirement wajib.

#### 2. Programmer 1 (Quinta Aurabiansyah — 24060124120016)
- [ ] **Modul Autentikasi**: Implementasi halaman dan logika Register (`nama`, `email`, `password`) dengan enkripsi password.
- [ ] **Modul Login & Logout**: Validasi user, penanganan session login, dan penghapusan session saat logout.
- [ ] **Middleware & Session**: Pembuatan Next.js Middleware untuk proteksi halaman privat (*route protection*).
- [ ] **Cookies**: Pengelolaan cookie sesi aman (*HttpOnly*) dan cookie preferensi pengguna.

#### 3. Programmer 2 (Naufal Dwi Yusmawan — 24060124130075)
- [ ] **Prisma Schema & Migrasi**: Implementasi model `User` dan `Transaction` ke PostgreSQL (`npx prisma db push`).
- [ ] **Server Actions Transaksi (CRUD)**: Logika penambahan, pembacaan, pengubahan, dan penghapusan transaksi.
- [ ] **Otorisasi (Authorization)**: Validasi kepemilikan data agar user hanya bisa memanipulasi transaksi miliknya sendiri (`userId`).
- [ ] **Fitur Filter**: Logika filter query transaksi berdasarkan jenis `INCOME` dan `EXPENSE`.

#### 4. Programmer 3 (Aditya Sultonul Ulya — 24060124120006)
- [ ] **UI/UX Dashboard**: Merancang antarmuka dashboard utama yang modern, bersih, dan responsif.
- [ ] **Widget Finansial**: Komponen visual kartu ringkasan saldo, total pemasukan, dan total pengeluaran.
- [ ] **Tabel & Form Transaksi**: Komponen formulir modal input/edit transaksi dan tabel riwayat transaksi.
- [ ] **Fitur Preferensi UI**: Implementasi pergantian preferensi (misal toggle Dark/Light mode) yang tersimpan di cookies.

### 6.2 Fase 2 — Fitur Budget Bulanan (FR-010 s.d. FR-013)

#### 1. Project Manager (Quinta Aurabiansyah — 24060124120016)
- [ ] **Pembaruan SRS**: Menyusun dan memperbarui dokumen SRS untuk fitur Budget Bulanan (FR-010 s.d. FR-013, ERD, skema Prisma, dan user flow).
- [ ] **Manajemen Git**: Membuat dan mengelola branch `feature/budget-*` dari `dev`, supervisi kode, dan review Pull Request (PR) fitur budget.
- [ ] **Delegasi & Koordinasi**: Membagi tugas, memantau progres, serta menyepakati kontrak data antar modul (bentuk data `Budget`, format `month`/`year`, dan hasil kalkulasi summary).
- [ ] **Pengujian End-to-End**: Menguji skenario batas indikator (74%, 75%, 99%, 100%), ganti bulan, budget belum ada, serta isolasi data antar pengguna (FR-008).
- [ ] **Integrasi Akhir**: Merge ke `main` dan memastikan kepatuhan terhadap 13 requirement wajib.

#### 2. Programmer 1 (Fauzan / pojann26)
- [ ] **Budget — Proteksi Route**: Menambahkan route `/budget` ke daftar halaman terproteksi pada Next.js Middleware.
- [ ] **Budget — Cookie Preferensi**: Menyimpan bulan & tahun terakhir yang dipilih pada cookie preferensi (`budget_period`) dan membacanya saat halaman dibuka.
- [ ] **Budget — Helper Sesi**: Menyediakan helper pengambilan `userId` dari sesi yang dipakai oleh Server Actions budget.

#### 3. Programmer 2 (Naufal Dwi Yusmawan — 24060124130075)
- [ ] **Budget — Model & Migrasi**: Menambahkan model `Budget` beserta relasi ke `User` pada `schema.prisma`, lalu menjalankan `npx prisma db push`.
- [ ] **Budget — Server Actions**: Logika `setBudget` (upsert berdasarkan `userId` + `month` + `year`), `getBudgetByMonth`, dan `deleteBudget` beserta validasi input (nominal > 0, bulan 1–12).
- [ ] **Budget — Kalkulasi**: Query agregasi total `EXPENSE` per bulan, perhitungan sisa anggaran dan persentase penggunaan.
- [ ] **Budget — Otorisasi**: Validasi kepemilikan budget melalui `userId` sesi; akses ke budget pengguna lain ditolak (*Forbidden*).

#### 4. Programmer 3 (Aditya Sultonul Ulya — 24060124120006)
- [ ] **Budget — Halaman & Month Picker**: Halaman `/budget` dengan pemilih bulan & tahun serta form modal Set/Ubah Budget.
- [ ] **Budget — Summary Card**: Komponen kartu Anggaran, Total Pengeluaran, Sisa Anggaran, dan persentase penggunaan.
- [ ] **Budget — Indicator**: Komponen *progress bar* dan badge status (Aman / Waspada / Melebihi Anggaran) sesuai Tabel Indikator, responsif dan mendukung Dark Mode.
- [ ] **Budget — Empty State**: Tampilan *"Belum ada anggaran"* beserta tombol untuk menetapkan budget.

---

## 💻 7. Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Server & Client Components)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **Styling UI**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL 18](https://www.postgresql.org/)
- **ORM / Database Layer**: [Prisma ORM 7](https://www.prisma.io/) dengan `@prisma/adapter-pg`
- **Keamanan**: `bcryptjs` (Password Hashing) & Next.js Server Cookies / Session Token

---

## 🚀 8. Panduan Menjalankan Proyek (Getting Started)

### 1. Clone Repository & Install Dependency
```bash
git clone https://github.com/pojann26/Praktikum_Next.git
cd Praktikum_Next
npm install
```

### 2. Atur Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan password PostgreSQL lokal Anda di dalam `.env`:
```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/nextjs_db?schema=public"
```

### 3. Sinkronkan Database dengan Prisma
Jalankan perintah berikut untuk meng-generate client dan menyinkronkan tabel ke PostgreSQL:
```bash
npx prisma generate
npx prisma db push
```

> **Catatan (fitur Budget Bulanan):** Setelah menarik (*pull*) perubahan yang memuat model `Budget`, jalankan kembali `npx prisma generate` dan `npx prisma db push` agar tabel `Budget` terbentuk di database lokal.

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada: **[http://localhost:3000](http://localhost:3000)**

---
*Dokumentasi ini disusun oleh Project Manager sebagai acuan resmi pengerjaan proyek praktikum.*
