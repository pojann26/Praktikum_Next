import Link from "next/link";
import { requireAuthUser } from "@/lib/session";
import { getBudgetPeriodPreference } from "@/lib/preferences";
import BudgetPeriodSelector from "./BudgetPeriodSelector";

export const dynamic = "force-dynamic";

export default async function BudgetTestPage() {
  // 1. UJI TUGAS 3: Memanggil helper sesi requireAuthUser()
  const user = await requireAuthUser();

  // 2. UJI TUGAS 2: Membaca cookie preferensi budget_period
  const period = await getBudgetPeriodPreference();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Route /budget Terproteksi Berhasil Dimuat
            </div>
            <h1 className="text-2xl font-bold text-white">
              Halaman Verifikasi Tugas P1 (Fauzan)
            </h1>
            <p className="text-xs text-zinc-400">
              Pengujian Helper Sesi, Proteksi Route, dan Cookie Preferensi Periode Anggaran.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-xl transition"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* Card 1: Verifikasi Helper Sesi (Task 3) */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <h2 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <span>👤</span> Hasil Uji Task 3: Helper Sesi (requireAuthUser / getAuthUserId)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 block mb-1">User ID Sesi:</span>
              <span className="font-mono text-emerald-300 font-semibold">{user.userId}</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 block mb-1">Nama Pengguna:</span>
              <span className="text-white font-medium">{user.name}</span>
            </div>
          </div>
          <p className="text-xs text-emerald-400/90 font-medium">
            ✓ Berhasil: Helper sesi berhasil mengekstrak userId user yang sedang login tanpa error.
          </p>
        </div>

        {/* Card 2: Verifikasi Cookie Preferensi (Task 2) */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <span>🍪</span> Hasil Uji Task 2: Cookie Preferensi Periode (budget_period)
          </h2>
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Periode Aktif Terbaca dari Cookie:</span>
              <span className="font-bold text-amber-300 font-mono text-sm">
                {monthNames[period.month - 1]} {period.year}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-500">
              <span>Nama Cookie:</span>
              <span className="font-mono text-zinc-300">budget_period</span>
            </div>
          </div>

          {/* Client Component untuk uji ubah cookie */}
          <BudgetPeriodSelector currentMonth={period.month} currentYear={period.year} />
        </div>
      </div>
    </div>
  );
}
