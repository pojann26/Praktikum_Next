"use client";

import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { FinancialSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface FinancialWidgetProps {
  summary: FinancialSummary;
}

function useAnimatedNumber(value: number, duration = 1200) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}

export function FinancialWidget({ summary }: FinancialWidgetProps) {
  const balance = useAnimatedNumber(summary.balance);
  const income = useAnimatedNumber(summary.totalIncome);
  const expense = useAnimatedNumber(summary.totalExpense);
  const total = summary.totalIncome + summary.totalExpense;
  const incomeRatio = total === 0 ? 0 : summary.totalIncome / total;
  const expenseRatio = total === 0 ? 0 : summary.totalExpense / total;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <GlowCard glow="rgba(99, 102, 241, 0.35)" delay={0.1}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300">
            <Wallet size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Saldo Akhir</h3>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              summary.balance >= 0
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-rose-500/20 text-rose-300"
            }`}
          >
            {summary.balance >= 0 ? "Surplus" : "Defisit"}
          </span>
        </div>
        <p className={`text-3xl font-bold ${summary.balance >= 0 ? "text-white" : "text-rose-400"}`}>
          {formatCurrency(balance)}
        </p>
        <p className="mt-2 text-xs text-zinc-500">Pemasukan dikurangi pengeluaran</p>
        <Sparkline
          color={summary.balance >= 0 ? "#818cf8" : "#fb7185"}
          points={buildSparkline(summary.totalIncome, summary.totalExpense)}
        />
      </GlowCard>

      <GlowCard glow="rgba(16, 185, 129, 0.35)" delay={0.2}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-300">
            <ArrowUpRight size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Total Pemasukan</h3>
          </div>
          <ProgressRing value={incomeRatio} color="#34d399" />
        </div>
        <p className="text-3xl font-bold text-emerald-400">{formatCurrency(income)}</p>
        <p className="mt-2 text-xs text-zinc-500">Semua transaksi bertipe INCOME</p>
      </GlowCard>

      <GlowCard glow="rgba(244, 63, 94, 0.35)" delay={0.3}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-300">
            <ArrowDownRight size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Total Pengeluaran</h3>
          </div>
          <ProgressRing value={expenseRatio} color="#fb7185" />
        </div>
        <p className="text-3xl font-bold text-rose-400">{formatCurrency(expense)}</p>
        <p className="mt-2 text-xs text-zinc-500">Semua transaksi bertipe EXPENSE</p>
      </GlowCard>
    </div>
  );
}

function GlowCard({
  children,
  glow,
  delay,
}: {
  children: ReactNode;
  glow: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass-card relative overflow-hidden p-6"
    >
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${glow}, transparent 45%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function ProgressRing({ value, color }: { value: number; color: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - Math.min(Math.max(value, 0), 1) * circumference;

  return (
    <svg width={48} height={48} className="-rotate-90">
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="transparent"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="5"
      />
      <motion.circle
        cx="24"
        cy="24"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function Sparkline({ color, points }: { color: string; points: number[] }) {
  const width = 220;
  const height = 48;
  const max = Math.max(...points, 1);
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (point / max) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-12 w-full">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function buildSparkline(income: number, expense: number) {
  const base = Math.max(income - expense, income * 0.2, 1);
  return [
    base * 0.35,
    base * 0.55,
    base * 0.42,
    base * 0.7,
    income * 0.85 || base,
    Math.max(income - expense, base * 0.5),
  ];
}
