import { User } from "@/types";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="mb-8 border-b border-white/10 pb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            SESI BERHASIL TERVERIFIKASI
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Dashboard Finansial
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Halo, {user.name}. Pantau pemasukan dan pengeluaranmu di HematKu.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400/50 hover:bg-red-900/40">
          <span>↪</span>
          Logout
        </button>
      </div>
    </header>
  );
}

interface UserSessionCardProps {
  user: User;
}

export function UserSessionCard({ user }: UserSessionCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 text-2xl font-bold shadow-lg shadow-indigo-950/40">
          {getInitials(user.name)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
        <div className="grid gap-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">ID Pengguna:</span>
            <span className="font-medium text-indigo-300">{user.id}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Tipe Sesi:</span>
            <span className="font-medium text-emerald-400">JWT Signed</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Status Cookie Sesi:</span>
            <span className="font-medium text-indigo-300">HttpOnly, SameSite=Lax</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CookieStatusCard() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xl text-amber-400">🔒</span>
        <h2 className="text-lg font-bold text-white">Status Proteksi Cookie</h2>
      </div>
      <p className="mb-6 text-sm leading-6 text-slate-400">
        Cookie sesi disimpan dengan flag <strong className="text-white">HttpOnly</strong> sehingga tidak dapat diakses oleh script client-side XSS.
      </p>
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
        🔐 Cookie <strong>session</strong> aktif di browser
      </div>
    </section>
  );
}
