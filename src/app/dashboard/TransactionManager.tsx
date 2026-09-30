"use client";

import { useState, useTransition, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, ListFilter } from "lucide-react";
import {
  TransactionItem,
  TransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionSummary,
} from "@/app/actions/transactionActions";
import { FinancialWidget } from "@/components/dashboard/FinancialWidget";
import { FilterTabs, getFilteredTransactions } from "@/components/transactions/FilterTabs";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Modal, DeleteConfirmModal } from "@/components/transactions/Modal";
import { Transaction, TransactionFormData } from "@/types";

interface TransactionManagerProps {
  initialTransactions: TransactionItem[];
  initialSummary: TransactionSummary;
}

export default function TransactionManager({
  initialTransactions,
  initialSummary,
}: TransactionManagerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions as unknown as Transaction[]);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [isPending, startTransition] = useTransition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>();

  const counts = useMemo(() => {
    return {
      ALL: transactions.length,
      INCOME: transactions.filter(t => t.type === "INCOME").length,
      EXPENSE: transactions.filter(t => t.type === "EXPENSE").length,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(
    () => getFilteredTransactions({ transactions, filter: activeFilter }),
    [transactions, activeFilter]
  );

  const refreshData = () => {
    startTransition(async () => {
      const [txRes, sumRes] = await Promise.all([
        getTransactions("ALL"),
        getTransactionSummary(),
      ]);
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data as unknown as Transaction[]);
      }
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
    });
  };

  const handleCreate = (data: TransactionFormData) => {
    startTransition(async () => {
      const res = await createTransaction(data);
      if (res.success) {
        setIsFormOpen(false);
        refreshData();
      }
    });
  };

  const handleUpdate = (data: TransactionFormData) => {
    if (!editingItem) return;
    startTransition(async () => {
      const res = await updateTransaction({ id: editingItem.id, ...data });
      if (res.success) {
        setIsFormOpen(false);
        setEditingItem(undefined);
        refreshData();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteTransaction(id);
      if (res.success) {
        setDeleteTarget(undefined);
        refreshData();
      }
    });
  };

  return (
    <div className="space-y-8">
      <FinancialWidget summary={summary} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ListFilter size={24} className="text-indigo-400" />
              Manajemen Transaksi
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Kelola pencatatan keuangan pribadi Anda secara real-time
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setEditingItem(undefined);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            <Plus size={20} />
            Tambah Transaksi
          </motion.button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-md">
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              counts={counts}
            />
          </div>
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Sinkronisasi Database...
            </div>
          )}
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          onEdit={(t) => {
            setEditingItem(t);
            setIsFormOpen(true);
          }}
          onDelete={(id) => setDeleteTarget(transactions.find(t => t.id === id))}
        />
      </motion.section>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(undefined);
        }}
        title={editingItem ? "Edit Transaksi" : "Tambah Transaksi Baru"}
      >
        <TransactionForm
          initialData={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          isLoading={isPending}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={deleteTarget?.title || "transaksi"}
      />
    </div>
  );
}
