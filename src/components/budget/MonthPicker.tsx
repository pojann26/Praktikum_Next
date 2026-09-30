"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface MonthPickerProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function yearOptions(currentYear: number) {
  const years: number[] = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y += 1) {
    years.push(y);
  }
  return years;
}

export function MonthPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
  disabled = false,
}: MonthPickerProps) {
  const years = yearOptions(new Date().getFullYear());

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap"
    >
      <div className="flex items-center gap-2 text-zinc-400">
        <Calendar size={18} />
        <span className="text-sm font-semibold">Periode</span>
      </div>

      <select
        value={month}
        disabled={disabled}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {MONTH_NAMES.map((name, index) => (
          <option key={index + 1} value={index + 1} className="bg-zinc-900">
            {name}
          </option>
        ))}
      </select>

      <select
        value={year}
        disabled={disabled}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {years.map((y) => (
          <option key={y} value={y} className="bg-zinc-900">
            {y}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
