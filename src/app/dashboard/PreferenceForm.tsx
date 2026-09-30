"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updatePreferencesAction } from "@/app/actions/authActions";
import { UserPreferences } from "@/lib/preferences";
import { Palette, Save } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function PreferenceForm({
  initialPreferences,
}: {
  initialPreferences: UserPreferences;
}) {
  const [theme, setTheme] = useState(initialPreferences.theme);
  const [language, setLanguage] = useState(initialPreferences.language);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updatePreferencesAction(theme, language);
      if (res.success) {
        showToast(res.message, "success");
      } else {
        showToast(res.message || "Gagal menyimpan preferensi", "error");
      }
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card ml-auto w-full max-w-xl p-5 sm:p-6"
    >
      <div className="mb-6 border-b border-white/10 pb-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Palette size={18} className="text-teal-300" />
            Cookie Settings
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            Atur preferensi tampilan dan bahasa. Pilihan ini disimpan di cookie browser.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Tema Tampilan
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "dark" | "light" | "system")}
            className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm font-medium text-white shadow-inner shadow-black/10 backdrop-blur-md transition hover:border-teal-300/40 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300/20"
          >
            <option value="dark" className="bg-slate-900">🌙 Dark Mode (Gelap)</option>
            <option value="light" className="bg-slate-900">☀️ Light Mode (Terang)</option>
            <option value="system" className="bg-slate-900">💻 System Default</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Bahasa Pengantar
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "id" | "en")}
            className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm font-medium text-white shadow-inner shadow-black/10 backdrop-blur-md transition hover:border-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300/20"
          >
            <option value="id" className="bg-slate-900">ID Bahasa Indonesia</option>
            <option value="en" className="bg-slate-900">EN English</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-white/10 pt-5">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-purple-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:from-teal-300 hover:to-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? "Menyimpan..." : "Save Settings"}
        </button>
      </div>

      <AnimatePresence>
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="min-w-[280px] rounded-xl border px-4 py-3 text-sm font-medium shadow-xl"
              style={{
                backgroundColor: toast.type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
                borderColor: toast.type === "success" ? "rgba(16, 185, 129, 0.5)" : "rgba(239, 68, 68, 0.5)",
              }}
            >
              {toast.message}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.section>
  );
}