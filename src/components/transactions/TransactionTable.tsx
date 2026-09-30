"use client";

import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
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
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Keterangan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Tanggal
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Nominal
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Tipe
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            <AnimatePresence mode="popLayout">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
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
      className="transition hover:bg-white/5"
    >
      <td className="px-6 py-4 text-sm font-medium text-white">
        {transaction.title}
      </td>
      <td className="px-6 py-4 text-sm text-zinc-400">
        <span className="inline-flex rounded-full bg-zinc-800/50 px-3 py-1 text-xs font-medium text-zinc-300">
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
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            transaction.type === "INCOME"
              ? "bg-emerald-950/50 text-emerald-300"
              : "bg-red-950/50 text-red-300"
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
              className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/30"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/30"
            >
              Hapus
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}