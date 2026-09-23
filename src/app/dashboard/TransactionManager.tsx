"use client";

import { useState, useTransition } from "react";
import {
  TransactionItem,
  TransactionSummary,
  FilterType,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionSummary,
} from "@/app/actions/transactionActions";

interface TransactionManagerProps {
  initialTransactions: TransactionItem[];
  initialSummary: TransactionSummary;
}

export default function TransactionManager({
  initialTransactions,
  initialSummary,
}: TransactionManagerProps) {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [isPending, startTransition] = useTransition();

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransactionItem | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("Umum");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Status message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const refreshData = (filter: FilterType = activeFilter) => {
    startTransition(async () => {
      const [txRes, sumRes] = await Promise.all([
        getTransactions(filter),
        getTransactionSummary(),
      ]);
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data);
      }
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    refreshData(filter);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setAmount("");
    setType("EXPENSE");
    setCategory("Umum");
    setDate(new Date().toISOString().split("T")[0]);
    setMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TransactionItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setAmount(item.amount.toString());
    setType(item.type as "INCOME" | "EXPENSE");
    setCategory(item.category || "Umum");
    const d = new Date(item.date);
    setDate(d.toISOString().split("T")[0]);
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!title.trim()) {
      setMessage({ text: "Judul transaksi wajib diisi.", type: "error" });
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: "Nominal harus berupa angka lebih dari 0.", type: "error" });
      return;
    }

    startTransition(async () => {
      if (editingItem) {
        // UPDATE
        const res = await updateTransaction({
          id: editingItem.id,
          title: title.trim(),
          amount: numAmount,
          type,
          category: category.trim(),
          date,
        });

        if (res.success) {
          setMessage({ text: res.message || "Transaksi berhasil diperbarui!", type: "success" });
          setIsModalOpen(false);
          refreshData();
        } else {
          setMessage({ text: res.error || "Gagal memperbarui transaksi.", type: "error" });
        }
      } else {
        // CREATE
        const res = await createTransaction({
          title: title.trim(),
          amount: numAmount,
          type,
          category: category.trim(),
          date,
        });

        if (res.success) {
          setMessage({ text: res.message || "Transaksi berhasil ditambahkan!", type: "success" });
          setIsModalOpen(false);
          refreshData();
        } else {
          setMessage({ text: res.error || "Gagal menambahkan transaksi.", type: "error" });
        }
      }
    });
  };

  const handleDelete = (id: string, titleText: string) => {
    if (!confirm(`Hapus transaksi "${titleText}"?`)) return;

    startTransition(async () => {
      const res = await deleteTransaction(id);
      if (res.success) {
        setMessage({ text: "Transaksi berhasil dihapus.", type: "success" });
        refreshData();
      } else {
        setMessage({ text: res.error || "Gagal menghapus transaksi.", type: "error" });
      }
    });
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateVal: Date | string) => {
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Notifikasi feedback */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between transition-all ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-75 hover:opacity-100 underline ml-4"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. Ringkasan Keuangan (Financial Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Saldo Akhir */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Saldo Akhir
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                summary.balance >= 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {summary.balance >= 0 ? "Surplus" : "Defisit"}
            </span>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black mt-2 tracking-tight ${
              summary.balance >= 0 ? "text-white" : "text-red-400"
            }`}
          >
            {formatRupiah(summary.balance)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Total Pemasukan dikurangi Pengeluaran</p>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Total Pemasukan
            </span>
            <span className="text-xs text-emerald-500 font-mono">INCOME</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 tracking-tight">
            +{formatRupiah(summary.totalIncome)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Uang saku, gaji, dan pemasukan lain</p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Total Pengeluaran
            </span>
            <span className="text-xs text-rose-500 font-mono">EXPENSE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-2 tracking-tight">
            -{formatRupiah(summary.totalExpense)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Biaya makan, transport, dll</p>
        </div>
      </div>

      {/* 2. Toolbar & Filter Section */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Riwayat Transaksi Keuangan
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kelola pencatatan pengeluaran dan pemasukan dengan otorisasi akun terisolasi
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Transaksi Baru
          </button>
        </div>

        {/* Filter Tabs (FR-006: Filter Transaksi) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-400 font-medium px-2 hidden sm:inline">Filter:</span>
            <button
              onClick={() => handleFilterChange("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === "ALL"
                  ? "bg-zinc-800 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Semua ({summary.totalTransactions})
            </button>
            <button
              onClick={() => handleFilterChange("INCOME")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeFilter === "INCOME"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow"
                  : "text-zinc-400 hover:text-emerald-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Pemasukan
            </button>
            <button
              onClick={() => handleFilterChange("EXPENSE")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeFilter === "EXPENSE"
                  ? "bg-rose-600/30 text-rose-300 border border-rose-500/40 shadow"
                  : "text-zinc-400 hover:text-rose-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Pengeluaran
            </button>
          </div>

          {isPending && (
            <span className="text-xs text-indigo-400 animate-pulse flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Memuat data...
            </span>
          )}
        </div>

        {/* 3. Daftar Transaksi */}
        {transactions.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">Belum ada transaksi</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {activeFilter === "ALL"
                ? "Anda belum mencatat transaksi keuangan apa pun. Klik 'Tambah Transaksi Baru' untuk memulai."
                : `Tidak ada transaksi dengan jenis ${activeFilter === "INCOME" ? "Pemasukan" : "Pengeluaran"}.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {transactions.map((t) => {
                  const isIncome = t.type === "INCOME";
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isIncome ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div>{t.title}</div>
                          <div className="text-[10px] text-zinc-500 sm:hidden">
                            {formatDate(t.date)} &bull; {t.category}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 text-xs hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-mono">
                          {t.category || "Umum"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 text-xs hidden sm:table-cell">
                        {formatDate(t.date)}
                      </td>

                      <td
                        className={`py-3.5 px-4 text-right font-bold text-sm sm:text-base ${
                          isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatRupiah(t.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(t)}
                            title="Edit Transaksi"
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(t.id, t.title)}
                            title="Hapus Transaksi"
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Modal Formulir Tambah / Edit Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? "Edit Transaksi" : "Tambah Transaksi Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipe Transaksi (INCOME / EXPENSE) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-2 ${
                      type === "EXPENSE"
                        ? "bg-rose-600/20 border-rose-500/50 text-rose-300 shadow"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("INCOME")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-2 ${
                      type === "INCOME"
                        ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300 shadow"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Pemasukan
                  </button>
                </div>
              </div>

              {/* Judul Transaksi */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Judul / Keterangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Makan Siang, Gaji Bulanan, dsb."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="Contoh: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Makanan, Transportasi, Kuliah, dll."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
