import { FinancialSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface FinancialWidgetProps {
  summary: FinancialSummary;
}

export function FinancialWidget({ summary }: FinancialWidgetProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <BalanceCard balance={summary.balance} />
      <IncomeCard total={summary.totalIncome} />
      <ExpenseCard total={summary.totalExpense} />
    </div>
  );
}

function BalanceCard({ balance }: { balance: number }) {
  const isPositive = balance >= 0;
  
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/40 to-indigo-950/40 p-6 shadow-2xl shadow-black/20">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">💰</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300">
          Saldo Akhir
        </h3>
      </div>
      <p className={`text-3xl font-bold ${isPositive ? "text-white" : "text-red-400"}`}>
        {formatCurrency(balance)}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Total Pemasukan - Total Pengeluaran
      </p>
    </div>
  );
}

function IncomeCard({ total }: { total: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/40 to-green-950/40 p-6 shadow-2xl shadow-black/20">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
          Total Pemasukan
        </h3>
      </div>
      <p className="text-3xl font-bold text-emerald-400">
        {formatCurrency(total)}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Semua transaksi bertipe INCOME
      </p>
    </div>
  );
}

function ExpenseCard({ total }: { total: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-950/40 to-rose-950/40 p-6 shadow-2xl shadow-black/20">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">📉</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-red-300">
          Total Pengeluaran
        </h3>
      </div>
      <p className="text-3xl font-bold text-red-400">
        {formatCurrency(total)}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Semua transaksi bertipe EXPENSE
      </p>
    </div>
  );
}
