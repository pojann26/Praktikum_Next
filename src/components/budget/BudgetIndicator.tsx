"use client";

import { motion } from "framer-motion";

interface BudgetIndicatorProps {
  percentage: number;
  statusLabel?: "Aman" | "Waspada" | "Melebihi Anggaran";
}

function resolveStatus(percentage: number) {
  if (percentage >= 100) {
    return {
      label: "Melebihi Anggaran" as const,
      bar: "bg-rose-500",
      badge: "bg-rose-500/20 text-rose-300",
    };
  }
  if (percentage >= 75) {
    return {
      label: "Waspada" as const,
      bar: "bg-amber-500",
      badge: "bg-amber-500/20 text-amber-300",
    };
  }
  return {
    label: "Aman" as const,
    bar: "bg-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-300",
  };
}

export function BudgetIndicator({ percentage, statusLabel }: BudgetIndicatorProps) {
  const status = resolveStatus(percentage);
  const label = statusLabel ?? status.label;
  const width = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Status Anggaran
        </h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badge}`}>
          {label}
        </span>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${status.bar}`}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Penggunaan saat ini: {percentage.toFixed(1)}% dari batas anggaran
      </p>
    </div>
  );
}
