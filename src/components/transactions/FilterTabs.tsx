"use client";

import { motion } from "framer-motion";
import { Transaction } from "@/types";

type FilterValue = "ALL" | "INCOME" | "EXPENSE";

interface FilterTabsProps {
  onFilterChange: (filter: FilterValue) => void;
  defaultFilter?: FilterValue;
  activeFilter?: FilterValue;
  counts?: Partial<Record<FilterValue, number>>;
}

const TABS: { id: FilterValue; label: string; active: string }[] = [
  { id: "ALL", label: "Semua", active: "bg-indigo-600" },
  { id: "INCOME", label: "Pemasukan", active: "bg-emerald-600" },
  { id: "EXPENSE", label: "Pengeluaran", active: "bg-rose-600" },
];

export function FilterTabs({
  onFilterChange,
  defaultFilter = "ALL",
  activeFilter,
  counts,
}: FilterTabsProps) {
  const active = activeFilter ?? defaultFilter;

  return (
    <div className="relative flex gap-1 rounded-2xl border border-white/10 bg-black/30 p-1.5">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isActive ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-indicator"
                className={`absolute inset-0 rounded-xl shadow-lg ${tab.active}`}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {tab.label}
              {typeof counts?.[tab.id] === "number" ? ` (${counts[tab.id]})` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface FilteredTransactionsProps {
  transactions: Transaction[];
  filter: FilterValue;
}

export function getFilteredTransactions({
  transactions,
  filter,
}: FilteredTransactionsProps): Transaction[] {
  if (filter === "ALL") return transactions;
  return transactions.filter((item) => item.type === filter);
}
