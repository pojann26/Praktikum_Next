"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "☀️"}
      <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}
