import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            Nx
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Praktikum Next.js Auth
          </span>
        </div>

        <nav className="flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              Ke Dashboard ({session.name.split(" ")[0]})
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-zinc-300 hover:text-white font-semibold text-sm transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto w-full text-center py-16 sm:py-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          Modul Autentikasi, Session JWT, Middleware & Cookies
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Sistem Autentikasi Lanjutan <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Next.js App Router
          </span>
        </h1>

        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Implementasi lengkap mencakup enkripsi password (`bcrypt`), cookie sesi terenkripsi yang aman (`HttpOnly`), proteksi rute (`Middleware`), dan penanganan preferensi pengguna.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl shadow-xl shadow-indigo-600/30 transition duration-200"
          >
            Mulai Registrasi Akun &rarr;
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold rounded-xl transition duration-200"
          >
            Akses Dashboard Privat
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              🔑
            </div>
            <h3 className="font-bold text-white text-base">Enkripsi Password</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Menggunakan `bcryptjs` untuk mengamankan password user secara aman.
            </p>
          </div>

          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              🛡️
            </div>
            <h3 className="font-bold text-white text-base">Cookie HttpOnly</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Token JWT disimpan dalam HttpOnly Cookie pencegah serangan XSS.
            </p>
          </div>

          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              🚀
            </div>
            <h3 className="font-bold text-white text-base">Next.js Middleware</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Pengalihan & proteksi otomatis pada rute privat di tingkat Edge.
            </p>
          </div>

          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              🎨
            </div>
            <h3 className="font-bold text-white text-base">Preferensi User</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Pengelolaan cookie preferensi pengguna seperti tema & bahasa.
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center py-6 text-xs text-zinc-500 border-t border-zinc-900 relative z-10">
        Praktikum Next.js Authentication Module &bull; 2026
      </footer>
    </div>
  );
}
