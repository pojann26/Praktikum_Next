"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { BudgetSummaryCard } from "@/components/budget/BudgetSummaryCard";
import { BudgetIndicator } from "@/components/budget/BudgetIndicator";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { MonthPicker } from "@/components/budget/MonthPicker";
import { SetBudgetModal } from "@/components/budget/SetBudgetModal";
import { DeleteConfirmModal } from "@/components/transactions/Modal";
import {
  deleteBudget,
  getBudgetByMonth,
  setBudget,
} from "@/app/actions/budgetActions";
import { updateBudgetPeriodAction } from "@/app/actions/budgetPreferenceActions";
import { BudgetSummary } from "@/types";

interface BudgetClientProps {
  initialPeriod: { month: number; year: number };
  initialSummary: BudgetSummary | null;
}

export function BudgetClient({
  initialPeriod,
  initialSummary,
}: BudgetClientProps) {
  const [period, setPeriod] = useState(initialPeriod);
  const [summary, setSummary] = useState<BudgetSummary | null>(initialSummary);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasBudget = Boolean(summary?.budget);
  const monthName = new Date(period.year, period.month - 1, 1).toLocaleString(
    "id-ID",
    { month: "long" }
  );

  const loadSummary = (month: number, year: number) => {
    startTransition(async () => {
      const res = await getBudgetByMonth(month, year);
      if (res.success && res.data) {
        setSummary(res.data);
        setError(null);
      } else {
        setError(res.error ?? "Gagal memuat data anggaran.");
      }
    });
  };

  const changePeriod = (month: number, year: number) => {
    setPeriod({ month, year });
    startTransition(async () => {
      await updateBudgetPeriodAction(month, year);
      const res = await getBudgetByMonth(month, year);
      if (res.success && res.data) {
        setSummary(res.data);
        setError(null);
      } else {
        setError(res.error ?? "Gagal memuat data anggaran.");
      }
    });
  };

  const handleSubmit = (amount: number) => {
    startTransition(async () => {
      const res = await setBudget({
        amount,
        month: period.month,
        year: period.year,
      });

      if (!res.success) {
        setError(res.error ?? "Gagal menyimpan anggaran.");
        return;
      }

      setIsModalOpen(false);
      setError(null);
      loadSummary(period.month, period.year);
    });
  };

  const handleDelete = () => {
    const budgetId = summary?.budget?.id;
    if (!budgetId) return;

    startTransition(async () => {
      const res = await deleteBudget(budgetId);
      if (!res.success) {
        setError(res.error ?? "Gagal menghapus anggaran.");
        return;
      }

      setIsDeleteOpen(false);
      setError(null);
      loadSummary(period.month, period.year);
    });
  };

  return (
    <div className="space-y-6">
      <MonthPicker
        month={period.month}
        year={period.year}
        disabled={isPending}
        onMonthChange={(month) => changePeriod(month, period.year)}
        onYearChange={(year) => changePeriod(period.month, year)}
      />

      {isPending && (
        <p className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Menyinkronkan data anggaran...
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {hasBudget && summary ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <BudgetSummaryCard summary={summary} delay={0.1} />
            <BudgetIndicator
              percentage={summary.usagePercentage}
              statusLabel={summary.statusLabel}
            />
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              <Pencil size={16} />
              Ubah Budget
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-900/50"
            >
              <Trash2 size={16} />
              Hapus Budget
            </button>
          </div>
        </>
      ) : (
        <BudgetEmptyState
          periodLabel={`${monthName} ${period.year}`}
          onSetBudget={() => setIsModalOpen(true)}
        />
      )}

      <SetBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        existingBudget={summary?.budget}
        isLoading={isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={`anggaran ${monthName} ${period.year}`}
      />
    </div>
  );
}
