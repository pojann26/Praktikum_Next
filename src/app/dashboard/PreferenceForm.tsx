"use client";

import { useState, useTransition } from "react";
import { updatePreferencesAction } from "@/app/actions/authActions";
import { UserPreferences } from "@/lib/preferences";

export default function PreferenceForm({
  initialPreferences,
}: {
  initialPreferences: UserPreferences;
}) {
  const [theme, setTheme] = useState(initialPreferences.theme);
  const [language, setLanguage] = useState(initialPreferences.language);
  const [statusMsg, setStatusMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await updatePreferencesAction(theme, language);
      if (res.success) {
        setStatusMsg(res.message);
        setTimeout(() => setStatusMsg(""), 3000);
      }
    });
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Pengaturan Cookie Preferensi Pengguna
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Preferensi ini disimpan di cookie browser (`user_preference`) dan bertahan saat sesi ditutup.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          ✓ {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Tema Tampilan (`theme`)
          </label>
          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as "dark" | "light" | "system")
            }
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="dark">🌙 Dark Mode (Gelap)</option>
            <option value="light">☀️ Light Mode (Terang)</option>
            <option value="system">💻 System Default</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Bahasa Pengantar (`language`)
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "id" | "en")}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="id">🇮🇩 Bahasa Indonesia</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
        >
          {isPending ? "Menyimpan Preferensi..." : "Simpan Preferensi Cookie"}
        </button>
      </div>
    </div>
  );
}
