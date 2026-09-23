"use client";

import { useState, useTransition } from "react";
import { createStudent, deleteStudent, checkDbConnection } from "../actions";

type Student = {
  id: number;
  nim: string;
  name: string;
  major: string;
  email: string;
  createdAt: Date | string;
};

interface StudentDashboardProps {
  initialStudents: Student[];
  initialDbStatus: { success: boolean; message: string };
}

export default function StudentDashboard({
  initialStudents,
  initialDbStatus,
}: StudentDashboardProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [dbStatus, setDbStatus] = useState(initialDbStatus);
  const [isPending, startTransition] = useTransition();
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCheckConnection = async () => {
    setIsCheckingDb(true);
    try {
      const res = await checkDbConnection();
      setDbStatus(res);
    } catch {
      setDbStatus({ success: false, message: "Gagal terhubung ke database." });
    } finally {
      setIsCheckingDb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createStudent(formData);
      if (res.success && res.data) {
        setFormMessage({ type: "success", text: "Data mahasiswa berhasil disimpan ke PostgreSQL!" });
        setStudents((prev) => [res.data as Student, ...prev]);
        form.reset();
        // Clear message after 4s
        setTimeout(() => setFormMessage(null), 4000);
      } else {
        setFormMessage({
          type: "error",
          text: res.error || "Gagal menyimpan data. Pastikan database sudah terhubung.",
        });
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) return;

    startTransition(async () => {
      const res = await deleteStudent(id);
      if (res.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(res.error || "Gagal menghapus data");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]" />
      </div>

      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7s0 5 8 5 8-5 8-5M12 12v9" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Next.js &amp; PostgreSQL
              </h1>
              <p className="text-xs text-slate-400 font-medium">Praktikum PPK &bull; Prisma ORM 7</p>
            </div>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all ${
                dbStatus.success
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm shadow-rose-500/10"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus.success ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                }`}
              />
              <span>{dbStatus.success ? "PostgreSQL Terhubung" : "Database Terputus"}</span>
            </div>
            <button
              onClick={handleCheckConnection}
              disabled={isCheckingDb}
              title="Cek ulang koneksi"
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 ${isCheckingDb ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Connection Notice / Config Guide if not connected */}
        {!dbStatus.success && (
          <div className="rounded-2xl p-5 border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-amber-200">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-base text-amber-100">
                  PostgreSQL Belum Terhubung ke Next.js
                </h3>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Pesan sistem: <span className="font-mono text-amber-300">{dbStatus.message}</span>
                </p>
                <div className="text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-slate-300 space-y-1">
                  <p className="text-slate-400 font-sans">
                    💡 <strong>Solusi Cepat</strong>: Buka file <code className="text-indigo-300">.env</code> di root project dan pastikan password PostgreSQL yang Anda buat saat instalasi sudah benar:
                  </p>
                  <p className="text-emerald-400">
                    DATABASE_URL=&quot;postgresql://postgres:PASSWORD_ANDA@localhost:5432/nextjs_db?schema=public&quot;
                  </p>
                  <p className="text-slate-400 font-sans mt-2">
                    Lalu jalankan migrasi schema di terminal: <code className="text-amber-300">npx prisma db push</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tech Stack Banner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <span className="text-xs text-slate-400 font-medium">Framework</span>
            <p className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              Next.js 16
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                App Router
              </span>
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <span className="text-xs text-slate-400 font-medium">Database Server</span>
            <p className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              PostgreSQL 18
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Port 5432
              </span>
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <span className="text-xs text-slate-400 font-medium">Data Layer / ORM</span>
            <p className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              Prisma 7
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                @prisma/adapter-pg
              </span>
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <span className="text-xs text-slate-400 font-medium">Total Mahasiswa</span>
            <p className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              {students.length} Data
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Realtime
              </span>
            </p>
          </div>
        </div>

        {/* Main Grid: Form (Left) & Table (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Tambah Mahasiswa */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Tambah Data Mahasiswa
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Data akan disimpan langsung ke tabel <code className="text-indigo-300">Student</code> di PostgreSQL.
              </p>
            </div>

            {formMessage && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs font-medium border flex items-center gap-2.5 transition-all ${
                  formMessage.type === "success"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                }`}
              >
                <span>{formMessage.type === "success" ? "✓" : "⚠️"}</span>
                <span>{formMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nomor Induk Mahasiswa (NIM)
                </label>
                <input
                  type="text"
                  name="nim"
                  placeholder="Contoh: 2210511001"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Contoh: Fauzan Azhim"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Program Studi / Jurusan
                </label>
                <input
                  type="text"
                  name="major"
                  placeholder="Contoh: Informatika"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Contoh: mahasiswa@kampus.ac.id"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Menyimpan ke Database...
                  </>
                ) : (
                  <>Simpan ke PostgreSQL &rarr;</>
                )}
              </button>
            </form>
          </div>

          {/* Tabel / Daftar Mahasiswa */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Data Mahasiswa Tersimpan
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Query otomatis dieksekusi via Prisma Client di Next.js Server Action.
                </p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <div className="w-12 h-12 rounded-full bg-slate-800/70 mx-auto flex items-center justify-center text-slate-400 mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-300">Belum ada data mahasiswa</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Isi form di samping untuk menguji penyimpanan data langsung ke database PostgreSQL Anda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">NIM</th>
                      <th className="py-3 px-3">Nama</th>
                      <th className="py-3 px-3">Jurusan</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-mono text-indigo-300 font-medium">
                          {student.nim}
                        </td>
                        <td className="py-3 px-3 text-white font-medium">
                          {student.name}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {student.major}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {student.email}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDelete(student.id)}
                            disabled={isPending}
                            className="text-rose-400 hover:text-rose-300 hover:underline transition cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
