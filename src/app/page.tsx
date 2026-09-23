import { checkDbConnection } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbStatus = await checkDbConnection();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7s0 5 8 5 8-5 8-5M12 12v9" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Next.js <span className="text-slate-500">&bull;</span> PostgreSQL
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
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
            <span>{dbStatus.success ? "Database Terhubung" : "Database Terputus"}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Template Kosongan Siap Digunakan
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Project Starter Next.js &amp; PostgreSQL
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Fondasi aplikasi dan koneksi database sudah terkonfigurasi dengan baik. Tinggal tentukan kebutuhan studi kasus untuk mulai mendevelop.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold mb-3">
              ⚡
            </div>
            <h3 className="font-semibold text-sm text-white">Next.js 16 App Router</h3>
            <p className="text-xs text-slate-400 mt-1">
              Mendukung Server Components, Server Actions, dan Tailwind CSS v4.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold mb-3">
              🐘
            </div>
            <h3 className="font-semibold text-sm text-white">PostgreSQL 18</h3>
            <p className="text-xs text-slate-400 mt-1">
              Berjalan lokal di port 5432, database <code className="text-emerald-300">nextjs_db</code> sudah siap.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold mb-3">
              💎
            </div>
            <h3 className="font-semibold text-sm text-white">Prisma ORM 7</h3>
            <p className="text-xs text-slate-400 mt-1">
              Type-safe database client dengan driver adapter <code className="text-violet-300">@prisma/adapter-pg</code>.
            </p>
          </div>
        </div>

        {/* Next Steps Box */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <span>📌</span> Langkah Selanjutnya Saat Studi Kasus Diberikan:
          </h2>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              Definisikan tabel/model di file <code className="text-indigo-300 font-mono">prisma/schema.prisma</code> (contoh: model User, Produk, Transaksi, dll).
            </li>
            <li>
              Sinkronkan schema ke PostgreSQL dengan perintah: <code className="text-emerald-400 font-mono">npx prisma db push</code>
            </li>
            <li>
              Buat logic server actions atau query di <code className="text-indigo-300 font-mono">src/app/actions.ts</code> dan buat antarmuka di <code className="text-indigo-300 font-mono">src/app/page.tsx</code>.
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        Praktikum PPK &bull; Next.js 16 + PostgreSQL 18 + Prisma ORM 7
      </footer>
    </div>
  );
}
