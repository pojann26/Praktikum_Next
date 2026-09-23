"use client";

import { useMemo, useState } from "react";
import { DashboardData, Transaction, TransactionFormData } from "@/types";
import { FinancialWidget } from "@/components/dashboard/FinancialWidget";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { FilterTabs, getFilteredTransactions } from "@/components/transactions/FilterTabs";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { DeleteConfirmModal, Modal } from "@/components/transactions/Modal";
import { calculateFinancialSummary } from "@/lib/mock-data";

interface DashboardClientProps {
  initialData: DashboardData;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialData.allTransactions
  );
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>();

  const summary = useMemo(
    () => calculateFinancialSummary(transactions),
    [transactions]
  );

  const filteredTransactions = useMemo(
    () => getFilteredTransactions({ transactions, filter }),
    [transactions, filter]
  );

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  );

  const handleCreate = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === editingTransaction.id
            ? { ...transaction, ...data, updatedAt: new Date() }
            : transaction
        )
      );
    } else {
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        ...data,
        userId: initialData.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTransactions((prev) => [newTransaction, ...prev]);
    }

    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  return (
    <div className="space-y-8">
      <FinancialWidget summary={summary} />
      <RecentTransactions transactions={recentTransactions} />

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Manajemen Transaksi</h2>
            <p className="mt-1 text-sm text-slate-400">
              Prototipe CRUD menggunakan mock data, siap dihubungkan ke Server Actions.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            + Tambah Transaksi
          </button>
        </div>

        <FilterTabs onFilterChange={setFilter} defaultFilter="ALL" />
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={(id) =>
            setDeleteTarget(transactions.find((transaction) => transaction.id === id))
          }
        />
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(undefined);
        }}
        title={editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
      >
        <TransactionForm
          initialData={editingTransaction}
          onSubmit={handleSubmit}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        itemName={deleteTarget?.title ?? "transaksi"}
      />
    </div>
  );
}
