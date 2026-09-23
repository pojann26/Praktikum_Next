"use client";

import { useState } from "react";
import { Transaction } from "@/types";

interface FilterTabsProps {
  onFilterChange: (filter: "ALL" | "INCOME" | "EXPENSE") => void;
  defaultFilter?: "ALL" | "INCOME" | "EXPENSE";
}

export function FilterTabs({
  onFilterChange,
  defaultFilter = "ALL",
}: FilterTabsProps) {
  const [active, setActive] = useState<"ALL" | "INCOME" | "EXPENSE">(
    defaultFilter
  );

  const handleFilter = (filter: "ALL" | "INCOME" | "EXPENSE") => {
    setActive(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-black/25 p-2">
      <button
        onClick={() => handleFilter("ALL")}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
          active === "ALL"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/50"
            : "bg-transparent text-slate-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        Semua
      </button>
      <button
        onClick={() => handleFilter("INCOME")}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
          active === "INCOME"
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
            : "bg-transparent text-slate-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        Pemasukan
      </button>
      <button
        onClick={() => handleFilter("EXPENSE")}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
          active === "EXPENSE"
            ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
            : "bg-transparent text-slate-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        Pengeluaran
      </button>
    </div>
  );
}

interface FilteredTransactionsProps {
  transactions: Transaction[];
  filter: "ALL" | "INCOME" | "EXPENSE";
}

export function getFilteredTransactions({
  transactions,
  filter,
}: FilteredTransactionsProps): Transaction[] {
  if (filter === "ALL") return transactions;
  return transactions.filter((t) => t.type === filter);
}
