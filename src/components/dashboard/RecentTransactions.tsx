"use client";

import { motion } from "framer-motion";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, History } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="mb-4 rounded-full bg-zinc-900/50 p-4">
          <History size={32} className="text-zinc-600" />
        </div>
        <p className="text-zinc-400">Belum ada riwayat transaksi</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      <div className="border-b border-white/5 bg-white/5 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <History size={20} className="text-indigo-400" />
          Riwayat Transaksi Terbaru
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-zinc-900/40 text-left text-xs font-bold uppercase tracking-widest text-zinc-500">
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="group transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                        t.type === "INCOME"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {t.type === "INCOME" ? (
                        <ArrowUpRight size={14} strokeWidth={3} />
                      ) : (
                        <ArrowDownRight size={14} strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-white">
                      {t.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-md border border-white/5 bg-zinc-800/50 px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-zinc-400 group-hover:text-zinc-300">
                    {t.category || "Umum"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 group-hover:text-zinc-400">
                  {formatDate(t.date)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`text-sm font-black tabular-nums tracking-tight ${
                      t.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
