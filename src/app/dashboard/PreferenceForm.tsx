"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updatePreferencesAction } from "@/app/actions/authActions";
import { UserPreferences } from "@/lib/preferences";
import { Palette, Globe, Save } from "lucide-react";

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
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette size={18} className="text-indigo-400" />
            Pengaturan Cookie Preferensi Pengguna
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Preferensi ini disimpan di cookie browser (user_preference)
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-zinc-400">
            Tema Tampilan
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "dark" | "light" | "system")}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-white text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="dark">🌙 Dark Mode (Gelap)</option>
            <option value="light">☀️ Light Mode (Terang)</option>
            <option value="system">💻 System Default</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-zinc-400">
            Bahasa Pengantar
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "id" | "en")}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-white text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="id">ID Bahasa Indonesia</option>
            <option value="en">EN English</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          Simpan Preferensi
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