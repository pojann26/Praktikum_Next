import {
  User,
  Transaction,
  DashboardData,
  FinancialSummary,
} from "@/types";

export const mockUser: User = {
  id: "mem_29vogzr",
  name: "Quinta",
  email: "tes@gmail.com",
  createdAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-09-23"),
};

export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    title: "Gaji September",
    amount: 5000000,
    type: "INCOME",
    category: "Gaji",
    date: new Date("2026-09-20"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-20"),
    updatedAt: new Date("2026-09-20"),
  },
  {
    id: "txn_002",
    title: "Makan Siang",
    amount: 35000,
    type: "EXPENSE",
    category: "Makanan",
    date: new Date("2026-09-23"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-23"),
    updatedAt: new Date("2026-09-23"),
  },
  {
    id: "txn_003",
    title: "Uang Saku Mingguan",
    amount: 500000,
    type: "INCOME",
    category: "Uang Saku",
    date: new Date("2026-09-21"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-21"),
    updatedAt: new Date("2026-09-21"),
  },
  {
    id: "txn_004",
    title: "Bensin Motor",
    amount: 80000,
    type: "EXPENSE",
    category: "Transportasi",
    date: new Date("2026-09-22"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-22"),
    updatedAt: new Date("2026-09-22"),
  },
  {
    id: "txn_005",
    title: "Beli Buku Kuliah",
    amount: 150000,
    type: "EXPENSE",
    category: "Pendidikan",
    date: new Date("2026-09-20"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-20"),
    updatedAt: new Date("2026-09-20"),
  },
  {
    id: "txn_006",
    title: "Freelance Project",
    amount: 1500000,
    type: "INCOME",
    category: "Freelance",
    date: new Date("2026-09-18"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-18"),
    updatedAt: new Date("2026-09-18"),
  },
  {
    id: "txn_007",
    title: "Sewa Kos",
    amount: 700000,
    type: "EXPENSE",
    category: "Hunian",
    date: new Date("2026-09-01"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-01"),
    updatedAt: new Date("2026-09-01"),
  },
  {
    id: "txn_008",
    title: "Tagihan Internet",
    amount: 80000,
    type: "EXPENSE",
    category: "Utilitas",
    date: new Date("2026-09-05"),
    userId: mockUser.id,
    createdAt: new Date("2026-09-05"),
    updatedAt: new Date("2026-09-05"),
  },
];

export function calculateFinancialSummary(
  transactions: Transaction[]
): FinancialSummary {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export function getMockDashboardData(): DashboardData {
  const summary = calculateFinancialSummary(mockTransactions);
  const recentTransactions = mockTransactions.slice(0, 5);

  return {
    user: mockUser,
    summary,
    recentTransactions,
    allTransactions: mockTransactions,
  };
}

export const TRANSACTION_CATEGORIES = [
  "Gaji",
  "Uang Saku",
  "Freelance",
  "Bonus",
  "Makanan",
  "Transportasi",
  "Hunian",
  "Utilitas",
  "Pendidikan",
  "Hiburan",
  "Kesehatan",
  "Lainnya",
];
