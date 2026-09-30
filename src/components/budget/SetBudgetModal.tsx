"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/transactions/Modal";
import { formatCurrency } from "@/lib/utils";
import { Budget } from "@/types";

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  existingBudget?: Budget | null;
  isLoading?: boolean;
}

export function SetBudgetModal({
  isOpen,
  onClose,
  onSubmit,
  existingBudget,
  isLoading = false,
}: SetBudgetModalProps) {
  const [amount, setAmount] = useState<number>(existingBudget?.amount ?? 0);

  useEffect(() => {
    setAmount(existingBudget?.amount ?? 0);
  }, [existingBudget, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      onSubmit(amount);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingBudget ? "Ubah Budget" : "Tetapkan Budget"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white">Nominal Anggaran (IDR)</label>
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Contoh: 3000000"
            required
            min={1}
            step="any"
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p className="mt-1 text-xs text-zinc-500">Minimal Rp1.000. Nominal harus lebih besar dari 0.</p>
        </div>

        {existingBudget && (
          <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-sm text-zinc-400">
            Budget saat ini: <span className="text-white">{formatCurrency(existingBudget.amount)}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading || amount <= 0}
            className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : existingBudget ? "Perbarui" : "Tetapkan"} Budget
          </button>
        </div>
      </form>
    </Modal>
  );
}
