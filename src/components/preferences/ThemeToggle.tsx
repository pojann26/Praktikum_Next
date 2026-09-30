"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { updatePreferencesAction } from "@/app/actions/authActions";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light") ? "light" : "dark";
    }
    return "dark";
  });

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
    await updatePreferencesAction(next, "id");
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 text-white"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 16, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -16, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25 }}
        >
          {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
