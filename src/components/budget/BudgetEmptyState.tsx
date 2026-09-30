"use client";

import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

interface BudgetEmptyStateProps {
  onSetBudget: () => void;
  periodLabel?: string;
}

export function BudgetEmptyState({
  onSetBudget,
  periodLabel,
}: BudgetEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card flex flex-col items-center justify-center p-10 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
        <PiggyBank size={28} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">Belum ada anggaran</h2>
      <p className="mb-6 max-w-md text-sm text-zinc-400">
        {periodLabel
          ? `Belum ada anggaran untuk ${periodLabel}. Tetapkan nominal agar pengeluaran bisa dipantau.`
          : "Tentukan anggaran pengeluaran Anda untuk bulan ini."}
      </p>
      <button
        onClick={onSetBudget}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-500"
      >
        Tetapkan Anggaran
      </button>
    </motion.div>
  );
}
