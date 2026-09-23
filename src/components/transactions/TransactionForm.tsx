"use client";

import { useState } from "react";
import { Transaction, TransactionFormData, TransactionType } from "@/types";
import { TRANSACTION_CATEGORIES } from "@/lib/mock-data";

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction;
  isLoading?: boolean;
}

export function TransactionForm({
  onSubmit,
  initialData,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>(
    initialData
      ? {
          title: initialData.title,
          amount: initialData.amount,
          type: initialData.type,
          category: initialData.category,
          date: new Date(initialData.date),
        }
      : {
          title: "",
          amount: 0,
          type: "EXPENSE",
          category: "Lainnya",
          date: new Date(),
        }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      date: new Date(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-white">
          Keterangan Transaksi
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masukkan keterangan transaksi"
          required
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-white">
            Nominal
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            required
            min="0"
            step="1000"
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white">
            Jenis
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="EXPENSE" className="bg-slate-900">
              Pengeluaran
            </option>
            <option value="INCOME" className="bg-slate-900">
              Pemasukan
            </option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-white">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white">
            Tanggal
          </label>
          <input
            type="date"
            value={formData.date.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? "Menyimpan..." : initialData ? "Perbarui" : "Tambah"} Transaksi
      </button>
    </form>
  );
}
