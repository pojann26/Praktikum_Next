"use client";

import { motion } from "framer-motion";
import { DollarSign, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BudgetSummary } from "@/types";

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
  delay?: number;
}

export function BudgetSummaryCard({ summary, delay = 0 }: BudgetSummaryCardProps) {
  const totalBudget = summary.totalBudget;
  const totalExpense = summary.totalExpense;
  const remaining = summary.remainingBudget;
  const usagePercentage = summary.usagePercentage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="glass-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-300">
          <Wallet size={18} />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Anggaran Bulanan</h3>
        </div>
        <span className="text-xl font-bold text-white">
          {formatCurrency(totalBudget)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-zinc-400">
          <span>Total Pengeluaran</span>
          <span className="font-semibold text-rose-400">
            {formatCurrency(totalExpense)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-zinc-400">
          <span>Sisa Anggaran</span>
          <span className={`font-semibold ${remaining >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-zinc-400">
          <span>Persentase Penggunaan</span>
          <span className="font-semibold text-white">
            {usagePercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}