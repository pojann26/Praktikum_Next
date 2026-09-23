"use client";

import { useState } from "react";
import { Transaction, TransactionType } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

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
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-12 text-center shadow-2xl shadow-black/20">
        <p className="text-lg text-slate-400">Tidak ada transaksi ditemukan</p>
        <p className="mt-2 text-sm text-slate-500">
          Gunakan filter atau tambah transaksi baru
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-black/25">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Keterangan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tanggal
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nominal
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tipe
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
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
    <tr className="transition hover:bg-white/[0.04]">
      <td className="px-6 py-4 text-sm font-medium text-white">
        {transaction.title}
      </td>
      <td className="px-6 py-4 text-sm text-slate-400">
        <span className="inline-flex rounded-full bg-slate-500/20 px-3 py-1 text-xs font-medium text-slate-300">
          {transaction.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-400">
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
    </tr>
  );
}
