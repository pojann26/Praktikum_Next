export type TransactionType = "INCOME" | "EXPENSE";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface DashboardData {
  user: User;
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
}

export interface TransactionFilters {
  type?: TransactionType | "ALL";
  startDate?: Date;
  endDate?: Date;
}

export type BudgetStatus = "SAFE" | "WARNING" | "EXCEEDED";

export interface Budget {
  id: string;
  amount: number;
  month: number; // 1 - 12
  year: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetSummary {
  budget: Budget | null;
  totalBudget: number;
  totalExpense: number;
  remainingBudget: number;
  usagePercentage: number;
  status: BudgetStatus;
  statusLabel: "Aman" | "Waspada" | "Melebihi Anggaran";
  month: number;
  year: number;
}

export interface SetBudgetInput {
  amount: number;
  month: number; // 1 - 12
  year: number;
}

export interface BudgetPeriod {
  month: number;
  year: number;
}

export type SessionUser = import("@/lib/session").SessionUser;

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  language: "id" | "en";
}