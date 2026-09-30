"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  onAdd,
}: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (transaction) =>
        transaction.title.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-lg text-zinc-400">Tidak ada transaksi ditemukan</p>
        <p className="mt-2 text-sm text-zinc-500">
          Gunakan filter atau tambah transaksi baru
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        {onAdd && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 px-4 py-2.5 font-semibold text-teal-300 shadow-lg shadow-teal-500/10 transition hover:from-teal-500/30 hover:to-purple-500/30 hover:border-teal-500/50"
          >
            <Plus size={18} />
            Tambah
          </motion.button>
        )}
      </div>

      {/* Table Container with Glassmorphism */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Keterangan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Nominal
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Tipe
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-sm text-zinc-400">
                        Tidak ada hasil yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface TransactionRowProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="group transition-colors duration-200 hover:bg-gradient-to-r hover:from-teal-500/[0.06] hover:to-purple-500/[0.06]"
    >
      <td className="px-6 py-4 text-sm font-medium text-white">
        {transaction.title}
      </td>
      <td className="px-6 py-4 text-sm text-zinc-400">
        <span className="inline-flex rounded-full border border-white/10 bg-zinc-800/50 px-3 py-1 text-xs font-medium text-zinc-300 transition group-hover:border-teal-400/20">
          {transaction.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-zinc-400">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4 text-right text-sm font-semibold">
        <span
          className={
            transaction.type === "INCOME" ? "text-emerald-400" : "text-red-400"
          }
        >
          {transaction.type === "INCOME" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
            transaction.type === "INCOME"
              ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/30"
              : "bg-red-950/50 text-red-400 border-red-500/30"
          }`}
        >
          {transaction.type === "INCOME" ? "📈" : "📉"}
          {transaction.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 transition hover:bg-teal-500/20 hover:border-teal-500/50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:border-red-500/50"
            >
              Hapus
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}