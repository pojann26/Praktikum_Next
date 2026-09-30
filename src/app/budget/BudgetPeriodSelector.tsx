"use client";

import { useState, useTransition } from "react";
import { updateBudgetPeriodAction } from "@/app/actions/budgetPreferenceActions";

export default function BudgetPeriodSelector({
  currentMonth,
  currentYear,
}: {
  currentMonth: number;
  currentYear: number;
}) {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [statusMsg, setStatusMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const monthOptions = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateBudgetPeriodAction(Number(month), Number(year));
      if (res.success) {
        setStatusMsg(`✓ Berhasil! Cookie budget_period diperbarui ke ${res.data.month}/${res.data.year}`);
        setTimeout(() => setStatusMsg(""), 4000);
      } else {
        setStatusMsg("Gagal memperbarui cookie.");
      }
    });
  };

  return (
    <div className="pt-2 border-t border-zinc-800/80 space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
        Uji Ubah Cookie Preferensi Periode:
      </label>

      {statusMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          {statusMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full sm:w-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan ke Cookie"}
        </button>
      </div>
    </div>
  );
}
