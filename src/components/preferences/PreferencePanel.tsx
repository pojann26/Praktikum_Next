"use client";

import { useTheme } from "./ThemeProvider";

export function PreferencePanel() {
  const { theme, toggleTheme, language, setLanguage } = useTheme();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-xl text-indigo-400">⚙️</span>
          <h2 className="text-xl font-bold text-white">
            Pengaturan Cookie Preferensi Pengguna
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Preferensi ini disimpan di cookie browser dan bertahan saat sesi ditutup.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-400">
            Tema Tampilan (`theme`)
          </label>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left font-semibold text-white transition hover:bg-white/15"
          >
            <span>{theme === "dark" ? "🌙 Dark Mode (Gelap)" : "☀️ Light Mode (Terang)"}</span>
            <span className="text-slate-400">⌄</span>
          </button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-400">
            Bahasa Pengantar (`language`)
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "id" | "en")}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="id" className="bg-slate-900">
              ID Bahasa Indonesia
            </option>
            <option value="en" className="bg-slate-900">
              EN English
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700">
          Simpan Preferensi Cookie
        </button>
      </div>
    </section>
  );
}
