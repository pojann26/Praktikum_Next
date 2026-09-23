import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserPreferences } from "@/lib/preferences";
import { logoutAction } from "@/app/actions/authActions";
import { getTransactions, getTransactionSummary } from "@/app/actions/transactionActions";
import PreferenceForm from "./PreferenceForm";
import TransactionManager from "./TransactionManager";

export default async function DashboardPage() {
  const session = await getSession();
  const preferences = await getUserPreferences();

  if (!session) {
    redirect("/login");
  }

  const [transactionsRes, summaryRes] = await Promise.all([
    getTransactions("ALL"),
    getTransactionSummary(),
  ]);

  const initialTransactions = transactionsRes.success && transactionsRes.data ? transactionsRes.data : [];
  const initialSummary = summaryRes.success && summaryRes.data ? summaryRes.data : {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Sesi Berhasil Terverifikasi
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Dashboard Privat
            </h1>
            <p className="text-sm text-zinc-400">
              Halaman ini dilindungi oleh Next.js Middleware (`src/middleware.ts`)
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout (Hapus Sesi)
            </button>
          </form>
        </header>

        {/* User Card & Security Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Info */}
          <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/40">
                  {session.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {session.name}
                  </h2>
                  <p className="text-sm text-zinc-400">{session.email}</p>
                </div>
              </div>

              <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400 font-medium">ID Pengguna:</span>
                  <span className="font-mono text-indigo-300">{session.userId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400 font-medium">Tipe Sesi:</span>
                  <span className="font-medium text-emerald-400">JWT Signed (HS256)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400 font-medium">Status Cookie Sesi:</span>
                  <span className="font-medium text-indigo-400">
                    HttpOnly, SameSite=Lax (Aman)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Status Overview */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Status Proteksi Cookie
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Cookie sesi disimpan dengan flag <strong className="text-zinc-200">HttpOnly</strong> sehingga tidak dapat diakses oleh script client-side XSS.
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                🔒 Cookie <code className="bg-black/30 px-1 py-0.5 rounded">session</code> aktif di browser.
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Management Section (Programmer 2) */}
        <TransactionManager
          initialTransactions={initialTransactions}
          initialSummary={initialSummary}
        />

        {/* Preference Form Section */}
        <PreferenceForm initialPreferences={preferences} />
      </div>
    </div>
  );
}
